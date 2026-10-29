// Cloudflare Workers + D1: the browser's /api/manuscript protocol is unchanged.
// This file is server-only. Never add it to the public assets directory.
const MAX_BYTES = 1_900_000;
class Failure extends Error {
  constructor(status,code){super(code);this.status=status;this.code=code;}
}
const fail=(status,code)=>{throw new Failure(status,code);};
const reply=(body,status=200)=>Response.json(body,{status,headers:{
  "Cache-Control":"private, no-store, max-age=0","Vary":"Authorization",
  "X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"
}});
function validate(doc){
  if(!doc||Array.isArray(doc)||typeof doc!=="object"||doc.version!==1||
     typeof doc.title!=="string"||typeof doc.start!=="string"||
     !Number.isSafeInteger(doc.sequence)||doc.sequence<0||
     !Number.isSafeInteger(doc.edgeSequence)||doc.edgeSequence<0||
     !Array.isArray(doc.acts)||!Array.isArray(doc.scenes)||!Array.isArray(doc.passages)||
     doc.acts.length<1||doc.acts.length>20||doc.scenes.length<1||doc.scenes.length>300||
     doc.passages.length<1||doc.passages.length>3000)return false;
  const ids=xs=>xs.every(v=>v&&typeof v==="object"&&!Array.isArray(v)&&typeof v.id==="string"&&v.id.length>0&&v.id.length<100) &&
    new Set(xs.map(v=>v.id)).size===xs.length;
  if(!ids(doc.acts)||!ids(doc.scenes)||!ids(doc.passages))return false;
  const a=new Set(doc.acts.map(x=>x.id)),s=new Set(doc.scenes.map(x=>x.id)),p=new Set(doc.passages.map(x=>x.id));
  if(!p.has(doc.start)||!doc.acts.every(x=>typeof x.title==="string")||
     !doc.scenes.every(x=>a.has(x.act)&&typeof x.title==="string"&&(x.notes===undefined||typeof x.notes==="string")))return false;
  for(const node of doc.passages){
    if(!s.has(node.scene)||typeof node.title!=="string"||typeof node.body!=="string"||
       (node.notes!==undefined&&typeof node.notes!=="string")||!Array.isArray(node.edges)||
       node.edges.length>150||!ids(node.edges))return false;
    for(const edge of node.edges){
      if(!p.has(edge.to)||(edge.label!==undefined&&typeof edge.label!=="string")||
         (edge.setMark!==undefined&&!["digit","knot","binomial"].includes(edge.setMark))||
         (edge.requiresMark!==undefined&&!["digit","knot","binomial"].includes(edge.requiresMark)))return false;
    }
  }
  return true;
}
async function authorized(request,env){
  if(!env.DB || typeof env.STUDIO_OWNER_TOKEN!=="string" || env.STUDIO_OWNER_TOKEN.length<32)fail(503,"NOT_CONFIGURED");
  const match=/^Bearer (.+)$/i.exec(request.headers.get("Authorization")||"");
  const actual=match?.[1]||"";
  if(actual.length<32||actual.length>1024)fail(401,"UNAUTHORIZED");
  // Hash before a fixed-length, non-early-exit comparison. Owner key is >=32 random characters.
  const hash=async text=>new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text)));
  const [a,b]=await Promise.all([hash(actual),hash(env.STUDIO_OWNER_TOKEN)]);
  let delta=0;for(let i=0;i<a.length;i++)delta|=a[i]^b[i];
  if(delta!==0)fail(401,"UNAUTHORIZED");
  const origin=request.headers.get("Origin");
  if(origin){
    let parsed;try{parsed=new URL(origin);}catch{fail(403,"BAD_ORIGIN");}
    if(parsed.origin!==new URL(request.url).origin)fail(403,"BAD_ORIGIN");
  }
}
async function bodyJson(request){
  if(!/^application\/json(?:;|$)/i.test(request.headers.get("content-type")||""))fail(415,"JSON_REQUIRED");
  const length=Number(request.headers.get("content-length"));
  if(Number.isFinite(length)&&length>MAX_BYTES)fail(413,"MANUSCRIPT_TOO_LARGE");
  if(!request.body)fail(400,"INVALID_JSON");
  const reader=request.body.getReader(),decoder=new TextDecoder();
  let size=0,text="";
  try{
    for(;;){
      const {done,value}=await reader.read();if(done)break;
      size+=value.byteLength;
      if(size>MAX_BYTES){await reader.cancel();fail(413,"MANUSCRIPT_TOO_LARGE");}
      text+=decoder.decode(value,{stream:true});
    }
    text+=decoder.decode();
  }finally{reader.releaseLock();}
  let value;try{value=JSON.parse(text);}catch{fail(400,"INVALID_JSON");}
  if(!value||typeof value!=="object"||Array.isArray(value))fail(400,"INVALID_JSON");
  return value;
}
const validRevision=(n,zero=false)=>Number.isSafeInteger(n)&&n>=(zero?0:1);
function unpack(text){return text===null?null:JSON.parse(text);}
async function save(db,document,expectedRevision,restoredFrom=null){
  const serialized=JSON.stringify(document);
  if(new TextEncoder().encode(serialized).byteLength>MAX_BYTES-1500)fail(413,"MANUSCRIPT_TOO_LARGE");
  const updatedAt=new Date().toISOString(),next=expectedRevision+1;
  const changed=await db.batch([
    db.prepare("UPDATE zeta_manuscript SET revision=revision+1, document=?, updated_at=? WHERE id='book-one' AND revision=?")
      .bind(serialized,updatedAt,expectedRevision),
    // INSERT OR IGNORE lets us check the update result; concurrent stale writers cannot
    // change either head or historical snapshot. The batch is a single D1 transaction.
    db.prepare("INSERT OR IGNORE INTO zeta_revision(revision,document,created_at,restored_from) SELECT revision,document,updated_at,? FROM zeta_manuscript WHERE id='book-one' AND revision=?")
      .bind(restoredFrom,next)
  ]);
  if(changed[0]?.meta?.changes!==1)fail(409,"REVISION_CONFLICT");
  if(changed[1]?.meta?.changes!==1)fail(503,"REVISION_STORAGE_ERROR");
  return {revision:next,updatedAt};
}
async function manuscript(request,env){
  await authorized(request,env);
  const u=new URL(request.url),db=env.DB;
  if(request.method==="GET"){
    const action=u.searchParams.get("action");
    if(action==="history"){
      const r=await db.prepare("SELECT revision,created_at,restored_from FROM zeta_revision ORDER BY revision DESC LIMIT 100").all();
      return {history:r.results.map(x=>({revision:Number(x.revision),updatedAt:x.created_at,restoredFrom:x.restored_from===null?null:Number(x.restored_from)}))};
    }
    if(action==="revision"){
      const n=Number(u.searchParams.get("revision"));
      if(!validRevision(n))fail(400,"INVALID_REVISION");
      const row=await db.prepare("SELECT revision,document,created_at FROM zeta_revision WHERE revision=?").bind(n).first();
      if(!row)fail(404,"REVISION_NOT_FOUND");
      return {revision:Number(row.revision),document:unpack(row.document),updatedAt:row.created_at};
    }
    if(action!==null&&action!=="export")fail(400,"INVALID_ACTION");
    const row=await db.prepare("SELECT revision,document,updated_at FROM zeta_manuscript WHERE id='book-one'").first();
    if(!row)fail(503,"SCHEMA_NOT_READY");
    return {revision:Number(row.revision),document:unpack(row.document),updatedAt:row.updated_at};
  }
  if(request.method!=="POST")fail(405,"METHOD_NOT_ALLOWED");
  const input=await bodyJson(request);
  if(!validRevision(input.expectedRevision,true))fail(400,"INVALID_EXPECTED_REVISION");
  if(input.action==="save"){
    if(!validate(input.document))fail(422,"INVALID_DOCUMENT");
    return save(db,input.document,input.expectedRevision);
  }
  if(input.action==="restore"){
    if(!validRevision(input.targetRevision))fail(400,"INVALID_REVISION");
    const row=await db.prepare("SELECT document FROM zeta_revision WHERE revision=?").bind(input.targetRevision).first();
    if(!row)fail(404,"REVISION_NOT_FOUND");
    const doc=unpack(row.document);
    if(!validate(doc))fail(422,"INVALID_DOCUMENT");
    return save(db,doc,input.expectedRevision,input.targetRevision);
  }
  fail(400,"INVALID_ACTION");
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname!=="/api/manuscript"){
      return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found",{status:404});
    }
    try{return reply(await manuscript(request,env));}
    catch(e){return reply({error:e instanceof Failure?e.code:"STORAGE_UNAVAILABLE"},e instanceof Failure?e.status:503);}
  }
};
export {validate,save,manuscript};
