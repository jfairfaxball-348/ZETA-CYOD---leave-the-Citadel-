"use strict";
const {Pool}=require("@neondatabase/serverless");
const {HttpError}=require("./manuscript.cjs");
// Pool lifetime is ONE request; Neon WebSockets must not outlive the serverless handler.
function createRepository(){
 if(!process.env.DATABASE_URL)throw new HttpError(503,"NOT_CONFIGURED");
 const db=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:8000});
 let ready;
 async function prepare(){
  if(!ready)ready=(async()=>{
   await db.query("CREATE TABLE IF NOT EXISTS zeta_manuscript (id text PRIMARY KEY, revision bigint NOT NULL, document jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())");
   await db.query("CREATE TABLE IF NOT EXISTS zeta_revision (revision bigint PRIMARY KEY, document jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), restored_from bigint NULL)");
  })();
  return ready;
 }
 const id="book-one";
 return {
  async load(){
   await prepare();
   const row=(await db.query("SELECT revision,document,updated_at FROM zeta_manuscript WHERE id=$1",[id])).rows[0];
   return row?{revision:Number(row.revision),document:row.document,updatedAt:row.updated_at.toISOString()}:null;
  },
  async history(){
   await prepare();
   return (await db.query("SELECT revision,created_at,restored_from FROM zeta_revision ORDER BY revision DESC LIMIT 100")).rows.map(row=>({
    revision:Number(row.revision),updatedAt:row.created_at.toISOString(),restoredFrom:row.restored_from===null?null:Number(row.restored_from)
   }));
  },
  async loadVersion(revision){
   await prepare();
   const row=(await db.query("SELECT revision,document,created_at FROM zeta_revision WHERE revision=$1",[revision])).rows[0];
   return row?{revision:Number(row.revision),document:row.document,updatedAt:row.created_at.toISOString()}:null;
  },
  async save(document,expectedRevision,restoredFrom){
   await prepare();
   const client=await db.connect();let started=false;
   try{
    await client.query("BEGIN");started=true;
    // Transaction-scoped lock serialises both first-create and concurrent updates.
    await client.query("SELECT pg_advisory_xact_lock(970026005)");
    const row=(await client.query("SELECT revision FROM zeta_manuscript WHERE id=$1 FOR UPDATE",[id])).rows[0];
    const current=row?Number(row.revision):0;
    if(current!==expectedRevision)throw new HttpError(409,"REVISION_CONFLICT");
    const next=current+1,json=JSON.stringify(document);
    if(row)await client.query("UPDATE zeta_manuscript SET revision=$2,document=$3::jsonb,updated_at=now() WHERE id=$1",[id,next,json]);
    else await client.query("INSERT INTO zeta_manuscript(id,revision,document) VALUES ($1,$2,$3::jsonb)",[id,next,json]);
    const result=await client.query("INSERT INTO zeta_revision(revision,document,restored_from) VALUES ($1,$2::jsonb,$3) RETURNING created_at",[next,json,restoredFrom]);
    await client.query("COMMIT");started=false;
    return {revision:next,updatedAt:result.rows[0].created_at.toISOString()};
   }catch(e){if(started)await client.query("ROLLBACK");throw e;}
   finally{client.release();}
  },
  async close(){await db.end();}
 };
}
module.exports=createRepository;
