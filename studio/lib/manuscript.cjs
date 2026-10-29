"use strict";
const crypto = require("node:crypto");

class HttpError extends Error {
  constructor(status, code, message) { super(message || code); this.status=status; this.code=code; }
}
const has = (object,key) => Object.prototype.hasOwnProperty.call(object,key);
function validateDocument(doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc) || doc.version !== 1 ||
      !Array.isArray(doc.acts) || !Array.isArray(doc.scenes) || !Array.isArray(doc.passages) ||
      typeof doc.title !== "string" || typeof doc.start !== "string" ||
      !Number.isSafeInteger(doc.sequence) || doc.sequence < 0 ||
      !Number.isSafeInteger(doc.edgeSequence) || doc.edgeSequence < 0 ||
      doc.acts.length < 1 || doc.acts.length > 20 ||
      doc.scenes.length < 1 || doc.scenes.length > 300 ||
      doc.passages.length < 1 || doc.passages.length > 3000) return false;
  const ids = (items) => items.every(v => v && typeof v === "object" && !Array.isArray(v) &&
    typeof v.id === "string" && v.id.length > 0 && v.id.length < 100) &&
    (new Set(items.map(v=>v.id))).size === items.length;
  if (!ids(doc.acts) || !ids(doc.scenes) || !ids(doc.passages)) return false;
  const acts = new Set(doc.acts.map(a=>a.id)), scenes = new Set(doc.scenes.map(s=>s.id)),
        passages = new Set(doc.passages.map(p=>p.id));
  if (!passages.has(doc.start) || !doc.acts.every(a=>typeof a.title === "string") ||
      !doc.scenes.every(s=>acts.has(s.act) && typeof s.title==="string" && (s.notes===undefined || typeof s.notes==="string"))) return false;
  for (const p of doc.passages) {
    if (!scenes.has(p.scene) || typeof p.title!=="string" || typeof p.body!=="string" ||
        (p.notes!==undefined && typeof p.notes!=="string") ||
        !Array.isArray(p.edges) || p.edges.length>150 || !ids(p.edges)) return false;
    for (const edge of p.edges) {
      if (!passages.has(edge.to) || (edge.label!==undefined && typeof edge.label!=="string") ||
          (edge.setMark!==undefined && !["digit","knot","binomial"].includes(edge.setMark)) ||
          (edge.requiresMark!==undefined && !["digit","knot","binomial"].includes(edge.requiresMark))) return false;
    }
  }
  return true;
}
function authenticate(req, env) {
  const secret = env.STUDIO_OWNER_TOKEN;
  if (!secret || secret.length < 32 || !env.DATABASE_URL) throw new HttpError(503,"NOT_CONFIGURED");
  const match = /^Bearer (.+)$/i.exec(req.headers.authorization || "");
  const provided = match ? match[1] : "";
  const hash = value => crypto.createHash("sha256").update(value).digest();
  if (!provided || provided.length > 1024 || !crypto.timingSafeEqual(hash(secret),hash(provided)))
    throw new HttpError(401,"UNAUTHORIZED");
  const origin = req.headers.origin;
  if (origin) {
    let host; try { host = new URL(origin).host; } catch { throw new HttpError(403,"BAD_ORIGIN"); }
    if (host !== (req.headers["x-forwarded-host"] || req.headers.host))
      throw new HttpError(403,"BAD_ORIGIN");
  }
}
function integer(value,allowZero=false) {
  return Number.isSafeInteger(value) && value >= (allowZero ? 0 : 1);
}
function parseBody(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers["content-type"]||""))
    throw new HttpError(415,"JSON_REQUIRED");
  let value=req.body;
  if (typeof value === "string") { try { value=JSON.parse(value); } catch { throw new HttpError(400,"INVALID_JSON"); } }
  if (!value || typeof value!=="object" || Array.isArray(value)) throw new HttpError(400,"INVALID_JSON");
  const length = Buffer.byteLength(JSON.stringify(value));
  if (length > 2_000_000) throw new HttpError(413,"MANUSCRIPT_TOO_LARGE");
  return value;
}
async function processRequest(req, repo, env) {
  authenticate(req,env);
  if (req.method==="GET") {
    const query=req.query||{};
    if (query.action==="history") return {history:await repo.history()};
    if (query.action==="revision") {
      const n=Number(query.revision);
      if (!integer(n)) throw new HttpError(400,"INVALID_REVISION");
      const found=await repo.loadVersion(n);
      if (!found) throw new HttpError(404,"REVISION_NOT_FOUND");
      return {revision:n,document:found.document,updatedAt:found.updatedAt};
    }
    if (query.action && query.action!=="export") throw new HttpError(400,"INVALID_ACTION");
    const current=await repo.load();
    return current || {revision:0,document:null,updatedAt:null};
  }
  if (req.method!=="POST") throw new HttpError(405,"METHOD_NOT_ALLOWED");
  const body=parseBody(req);
  if (!integer(body.expectedRevision,true)) throw new HttpError(400,"INVALID_EXPECTED_REVISION");
  if (body.action==="save") {
    if (!validateDocument(body.document)) throw new HttpError(422,"INVALID_DOCUMENT");
    return await repo.save(body.document,body.expectedRevision,null);
  }
  if (body.action==="restore") {
    if (!integer(body.targetRevision)) throw new HttpError(400,"INVALID_REVISION");
    const old=await repo.loadVersion(body.targetRevision);
    if (!old) throw new HttpError(404,"REVISION_NOT_FOUND");
    if (!validateDocument(old.document)) throw new HttpError(422,"INVALID_DOCUMENT");
    return await repo.save(old.document,body.expectedRevision,body.targetRevision);
  }
  throw new HttpError(400,"INVALID_ACTION");
}
module.exports={HttpError,validateDocument,processRequest,authenticate,parseBody};
