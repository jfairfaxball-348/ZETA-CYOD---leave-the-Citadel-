"use strict";
const {Pool} = require("@neondatabase/serverless");
const {HttpError} = require("./manuscript.cjs");
let pool, ready;
function database() {
  if (!process.env.DATABASE_URL) throw new HttpError(503,"NOT_CONFIGURED");
  if (!pool) pool=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:8000});
  return pool;
}
async function prepare() {
  if (!ready) {
    ready=(async ()=>{
      const db=database();
      await db.query("CREATE TABLE IF NOT EXISTS zeta_manuscript (id text PRIMARY KEY, revision bigint NOT NULL, document jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())");
      await db.query("CREATE TABLE IF NOT EXISTS zeta_revision (revision bigint PRIMARY KEY, document jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), restored_from bigint NULL)");
    })().catch(err=>{ready=null;throw err;});
  }
  return ready;
}
const id="book-one";
const fmt=row=>row ? {revision:Number(row.revision),document:row.document,updatedAt:row.updated_at.toISOString()} : null;
const repository={
  async load() {
    await prepare();
    return fmt((await database().query("SELECT revision,document,updated_at FROM zeta_manuscript WHERE id=$1",[id])).rows[0]);
  },
  async history() {
    await prepare();
    return (await database().query("SELECT revision,created_at,restored_from FROM zeta_revision ORDER BY revision DESC LIMIT 100")).rows.map(r=>({
      revision:Number(r.revision),updatedAt:r.created_at.toISOString(),restoredFrom:r.restored_from===null?null:Number(r.restored_from)
    }));
  },
  async loadVersion(revision) {
    await prepare();
    const row=(await database().query("SELECT revision,document,created_at FROM zeta_revision WHERE revision=$1",[revision])).rows[0];
    return row ? {revision:Number(row.revision),document:row.document,updatedAt:row.created_at.toISOString()} : null;
  },
  async save(document,expectedRevision,restoredFrom) {
    await prepare();
    const client=await database().connect();
    let inTransaction=false;
    try {
      await client.query("BEGIN");inTransaction=true;
      // Serialise first-create and update transactions across all serverless workers.
      await client.query("SELECT pg_advisory_xact_lock(970026005)");
      const found=(await client.query("SELECT revision FROM zeta_manuscript WHERE id=$1 FOR UPDATE",[id])).rows[0];
      const current=found?Number(found.revision):0;
      if (current!==expectedRevision) throw new HttpError(409,"REVISION_CONFLICT");
      const next=current+1;
      if (found) {
        await client.query("UPDATE zeta_manuscript SET revision=$2,document=$3::jsonb,updated_at=now() WHERE id=$1",[id,next,JSON.stringify(document)]);
      } else {
        await client.query("INSERT INTO zeta_manuscript(id,revision,document) VALUES ($1,$2,$3::jsonb)",[id,next,JSON.stringify(document)]);
      }
      const result=await client.query("INSERT INTO zeta_revision(revision,document,restored_from) VALUES ($1,$2::jsonb,$3) RETURNING created_at",[next,JSON.stringify(document),restoredFrom]);
      await client.query("COMMIT");inTransaction=false;
      return {revision:next,updatedAt:result.rows[0].created_at.toISOString()};
    } catch (err) {
      if (inTransaction) await client.query("ROLLBACK");
      throw err;
    } finally {client.release();}
  }
};
module.exports=repository;
