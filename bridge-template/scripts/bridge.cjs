'use strict';
// W009: INSTALL ONLY IN THE AUTHOR'S PRIVATE GITHUB REPOSITORY.
// No credentials or unpublished manuscript text belong in the public ZETA repo.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const STUDIO_ORIGIN = 'https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev';
const EXPECTED_REPOSITORY = 'jfairfaxball-348/ZETA-private-authoring';
const MAX_MANUSCRIPT_BYTES = 1_898_000;
const MAX_REQUEST_BYTES = 300_000;
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const HEX_PATTERN = /^[a-f0-9]{64}$/;
const ALLOWED_REQUEST_KEYS = new Set(['version', 'requestId', 'passageId', 'expectedRevision', 'expectedBodySha256', 'newBody', 'approved']);

class BridgeError extends Error {
  constructor(code) { super(code); this.code = code; }
}
const sha256 = value => crypto.createHash('sha256').update(value, 'utf8').digest('hex');
const byteLength = value => Buffer.byteLength(value, 'utf8');
const ensure = (condition, code) => { if (!condition) throw new BridgeError(code); };
const writeJSON = (filename, value) => {
  fs.mkdirSync(path.dirname(filename), {recursive: true});
  fs.writeFileSync(filename, JSON.stringify(value, null, 2) + '\n', {mode: 0o600});
};

async function assertPrivateRepository(env, fetchImpl = fetch) {
  ensure(typeof env.GITHUB_REPOSITORY === 'string' &&
    env.GITHUB_REPOSITORY.toLowerCase() === EXPECTED_REPOSITORY.toLowerCase(), 'WRONG_GITHUB_REPOSITORY');
  ensure(typeof env.GITHUB_TOKEN === 'string' && env.GITHUB_TOKEN.length >= 20, 'GITHUB_TOKEN_MISSING');
  let response;
  try {
    response = await fetchImpl('https://api.github.com/repos/' + EXPECTED_REPOSITORY, {
      headers: {Authorization: 'Bearer ' + env.GITHUB_TOKEN, Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'}, redirect: 'manual', signal: AbortSignal.timeout(10000)
    });
  } catch { throw new BridgeError('GITHUB_VISIBILITY_CHECK_FAILED'); }
  ensure(response?.status === 200, 'GITHUB_VISIBILITY_CHECK_FAILED');
  let record;
  try { record = await response.json(); }
  catch { throw new BridgeError('GITHUB_VISIBILITY_CHECK_FAILED'); }
  ensure(record && record.private === true && record.full_name?.toLowerCase() === EXPECTED_REPOSITORY.toLowerCase(),
    'PRIVATE_REPOSITORY_REQUIRED');
}

function checkConfig(env) {
  const token = env.ZETA_STUDIO_OWNER_TOKEN;
  ensure(typeof token === 'string' && token.length >= 32 && token.length <= 1024, 'OWNER_SECRET_MISSING');
  const id = env.ZETA_CF_ACCESS_CLIENT_ID || '';
  const secret = env.ZETA_CF_ACCESS_CLIENT_SECRET || '';
  ensure(Boolean(id) === Boolean(secret), 'INCOMPLETE_ACCESS_TOKEN_PAIR');
  return {token, id, secret};
}

function makeClient(env, fetchImpl = fetch) {
  const {token, id, secret} = checkConfig(env);
  const endpoint = STUDIO_ORIGIN + '/api/manuscript';
  async function call(method, body) {
    const headers = {Authorization: 'Bearer ' + token, Accept: 'application/json'};
    if (id) { headers['CF-Access-Client-Id'] = id; headers['CF-Access-Client-Secret'] = secret; }
    const options = {method, headers, redirect: 'manual', signal: AbortSignal.timeout(20000)};
    if (body !== undefined) {headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body);}
    let response;
    try { response = await fetchImpl(endpoint, options); }
    catch { throw new BridgeError('NETWORK_OR_TIMEOUT'); }
    if (!response || response.status < 200 || response.status >= 300) {
      throw new BridgeError(response?.status === 409 ? 'REVISION_CONFLICT' : 'HTTP_' + (response?.status || 'UNKNOWN'));
    }
    ensure((response.headers?.get('content-type') || '').includes('application/json'), 'INVALID_API_CONTENT_TYPE');
    let json;
    try { json = await response.json(); } catch { throw new BridgeError('INVALID_API_RESPONSE'); }
    ensure(json && typeof json === 'object' && !Array.isArray(json), 'INVALID_API_RESPONSE');
    return json;
  }
  return {read: () => call('GET'), save: (revision, document) => call('POST', {action: 'save', expectedRevision: revision, document})};
}

function validateRemote(remote) {
  ensure(remote && Number.isSafeInteger(remote.revision) && remote.revision >= 0, 'INVALID_REMOTE_REVISION');
  const doc = remote.document;
  ensure(doc && !Array.isArray(doc) && typeof doc === 'object' && Array.isArray(doc.passages), 'REMOTE_MANUSCRIPT_EMPTY');
  ensure(byteLength(JSON.stringify(doc)) <= MAX_MANUSCRIPT_BYTES, 'REMOTE_MANUSCRIPT_OVERSIZE');
  const seen = new Set();
  for (const p of doc.passages) {
    ensure(p && typeof p.id === 'string' && p.id.length > 0 && p.id.length < 100 && typeof p.body === 'string', 'INVALID_REMOTE_PASSAGE');
    ensure(!seen.has(p.id), 'DUPLICATE_PASSAGE_ID');
    seen.add(p.id);
  }
  return remote;
}

function syncSnapshot(root, remote) {
  validateRemote(remote);
  const target = path.join(root, 'snapshot');
  const passageDir = path.join(target, 'passages');
  fs.rmSync(passageDir, {recursive: true, force: true});
  fs.mkdirSync(passageDir, {recursive: true});
  const index = {
    version: 1, revision: remote.revision, updatedAt: remote.updatedAt ?? null,
    acts: remote.document.acts || [], scenes: remote.document.scenes || [],
    passages: []
  };
  for (const p of remote.document.passages) {
    const filename = sha256(p.id) + '.json';
    writeJSON(path.join(passageDir, filename), {...p, _bridge: {revision: remote.revision, bodySha256: sha256(p.body)}});
    index.passages.push({id: p.id, scene: p.scene, title: p.title, file: 'passages/' + filename, bodySha256: sha256(p.body)});
  }
  writeJSON(path.join(target, 'index.json'), index);
  return index;
}

function validateRequest(request, filename) {
  ensure(request && typeof request === 'object' && !Array.isArray(request), 'INVALID_REQUEST');
  ensure(Object.keys(request).every(key => ALLOWED_REQUEST_KEYS.has(key)), 'UNEXPECTED_REQUEST_FIELD');
  ensure(request.version === 1, 'INVALID_REQUEST_VERSION');
  ensure(typeof request.requestId === 'string' && ID_PATTERN.test(request.requestId) && request.requestId + '.json' === filename, 'INVALID_REQUEST_ID');
  ensure(request.approved === true, 'AUTHOR_APPROVAL_REQUIRED');
  ensure(typeof request.passageId === 'string' && request.passageId.length > 0 && request.passageId.length < 100, 'INVALID_PASSAGE_ID');
  ensure(Number.isSafeInteger(request.expectedRevision) && request.expectedRevision >= 1, 'INVALID_EXPECTED_REVISION');
  ensure(typeof request.expectedBodySha256 === 'string' && HEX_PATTERN.test(request.expectedBodySha256), 'INVALID_EXPECTED_BODY_HASH');
  ensure(typeof request.newBody === 'string' && byteLength(request.newBody) <= 250_000, 'INVALID_NEW_BODY');
  return request;
}

async function applyOne(client, request) {
  const current = validateRemote(await client.read());
  ensure(current.revision === request.expectedRevision, 'STALE_REVISION');
  const old = current.document.passages.find(p => p.id === request.passageId);
  ensure(old, 'PASSAGE_NOT_FOUND');
  ensure(sha256(old.body) === request.expectedBodySha256, 'STALE_PASSAGE_BODY');
  if (old.body === request.newBody) return {status: 'unchanged', revision: current.revision};
  // Edit *only* the named existing passage's body. Preserve the rest of the graph.
  const updatedDoc = JSON.parse(JSON.stringify(current.document));
  updatedDoc.passages.find(p => p.id === request.passageId).body = request.newBody;
  ensure(byteLength(JSON.stringify(updatedDoc)) <= MAX_MANUSCRIPT_BYTES, 'UPDATED_MANUSCRIPT_OVERSIZE');
  let acknowledged;
  try { acknowledged = await client.save(current.revision, updatedDoc); }
  catch (error) {
    if (error.code === 'REVISION_CONFLICT') throw error;
    // An HTTP/network error after POST can be ambiguous: never automatically retry.
    return {status: 'needs_review', code: 'SAVE_ACK_UNKNOWN'};
  }
  if (!Number.isSafeInteger(acknowledged.revision) || acknowledged.revision !== current.revision + 1 || typeof acknowledged.updatedAt !== 'string') {
    return {status: 'needs_review', code: 'SAVE_ACK_INVALID'};
  }
  let verified;
  try { verified = validateRemote(await client.read()); }
  catch { return {status: 'needs_review', code: 'VERIFY_READ_FAILED', acknowledgedRevision: acknowledged.revision}; }
  const actual = verified.document.passages.find(p => p.id === request.passageId);
  if (verified.revision !== acknowledged.revision || !actual || actual.body !== request.newBody ||
    JSON.stringify(verified.document) !== JSON.stringify(updatedDoc)) {
    return {status: 'needs_review', code: 'VERIFY_MISMATCH', acknowledgedRevision: acknowledged.revision, observedRevision: verified.revision};
  }
  return {status: 'applied', revision: acknowledged.revision, updatedAt: acknowledged.updatedAt};
}

async function run(root, mode, env = process.env, fetchImpl = fetch) {
  ensure(mode === 'sync' || mode === 'apply', 'INVALID_RUN_MODE');
  const client = makeClient(env, fetchImpl);
  if (mode === 'sync') {
    const index = syncSnapshot(root, await client.read());
    return {status: 'synced', revision: index.revision, count: index.passages.length};
  }
  const inbox = path.join(root, 'requests');
  fs.mkdirSync(inbox, {recursive: true});
  const names = fs.readdirSync(inbox).filter(x => x.endsWith('.json')).sort();
  let succeeded = 0, failed = 0, needsReview = 0;
  for (const filename of names) {
    const resultPath = path.join(root, 'results', filename);
    if (fs.existsSync(resultPath)) continue; // Immutable receipt prevents accidental replay.
    const requestId = filename.slice(0, -5);
    let result;
    try {
      ensure(ID_PATTERN.test(requestId), 'INVALID_FILENAME');
      const inputPath = path.join(inbox, filename);
      ensure(fs.lstatSync(inputPath).isFile() && fs.statSync(inputPath).size <= MAX_REQUEST_BYTES, 'REQUEST_FILE_UNSAFE');
      let parsed;
      try { parsed = JSON.parse(fs.readFileSync(inputPath, 'utf8')); }
      catch { throw new BridgeError('INVALID_REQUEST_JSON'); }
      const request = validateRequest(parsed, filename);
      result = {version: 1, requestId, passageId: request.passageId, ...await applyOne(client, request)};
    } catch (error) {
      result = {version: 1, requestId, status: 'rejected', code: error instanceof BridgeError ? error.code : 'UNEXPECTED_FAILURE'};
    }
    if (result.status === 'applied' || result.status === 'unchanged') succeeded++;
    else if (result.status === 'needs_review') needsReview++;
    else failed++;
    writeJSON(resultPath, result);
    console.log('W009 request', requestId, 'status', result.status, 'code', result.code || 'OK');
  }
  let snapshot;
  try { snapshot = syncSnapshot(root, await client.read()); }
  catch { throw new BridgeError('SNAPSHOT_SYNC_FAILED'); }
  return {status: failed || needsReview ? 'attention_required' : 'complete', succeeded, failed, needsReview, revision: snapshot.revision};
}

if (require.main === module) {
  assertPrivateRepository(process.env)
    .then(() => run(process.cwd(), process.argv[2] || 'sync'))
    .then(result => {
      console.log('W009 bridge:', JSON.stringify(result));
      if (result.status === 'attention_required') process.exitCode = 1;
    })
    .catch(error => {
      console.error('W009 bridge failed:', error instanceof BridgeError ? error.code : 'UNEXPECTED_FAILURE');
      process.exitCode = 1;
    });
}
module.exports = {BridgeError, sha256, checkConfig, assertPrivateRepository, makeClient, validateRemote, syncSnapshot, validateRequest, applyOne, run};
