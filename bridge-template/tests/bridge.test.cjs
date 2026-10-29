'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {sha256, run, checkConfig, assertPrivateRepository, validateRequest} = require('../scripts/bridge.cjs');
const token = 'test-owner-key-' + 'x'.repeat(48);
const env = {ZETA_STUDIO_OWNER_TOKEN: token};
const specimen = () => ({version:1,title:'Leave the Citadel',start:'p-1',sequence:1,edgeSequence:0,
  acts:[{id:'a-1',title:'Act I'}],scenes:[{id:'s-1',act:'a-1',title:'Beginning'}],
  passages:[{id:'p-1',scene:'s-1',title:'Opening',body:'Original',notes:'Kept private',edges:[]},
    {id:'p-2',scene:'s-1',title:'Other',body:'Unmodified',edges:[]}]});
const temp = () => fs.mkdtempSync(path.join(os.tmpdir(),'zeta-bridge-'));
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
function fakeServer(document=specimen(), initialRevision=7) {
 let doc=structuredClone(document), revision=initialRevision, posts=0, getCalls=0;
 const fetcher = async (url, options) => {
   assert.equal(url,'https://zeta-cyod---leave-the-citadel.jfairfaxball.workers.dev/api/manuscript');
   assert.equal(options.headers.Authorization,'Bearer '+token);
   assert.equal(options.redirect,'manual');
   const json = x => ({status:200,headers:new Map([['content-type','application/json']]),json: async () => x});
   if (options.method === 'GET'){getCalls++;return json({revision,document:structuredClone(doc),updatedAt:'2026-10-29T18:45:15.234Z'});}
   posts++;
   const q=JSON.parse(options.body);
   if (q.expectedRevision!==revision) return {status:409};
   assert.equal(q.action,'save');
   revision++;doc=structuredClone(q.document);
   return json({revision,updatedAt:'2026-10-29T19:10:00.000Z'});
 };
 return {fetcher,get posts(){return posts},get revision(){return revision},get doc(){return doc},get getCalls(){return getCalls}};
}
function putRequest(root, requestId, patch={}){
 const r={version:1,requestId,passageId:'p-1',expectedRevision:7,expectedBodySha256:sha256('Original'),newBody:'Author-approved revised passage',approved:true,...patch};
 const dir=path.join(root,'requests');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,requestId+'.json'),JSON.stringify(r));
}

test('sync stores an editable private snapshot with stable passage body hashes',async t=>{
 const root=temp();t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const server=fakeServer();const status=await run(root,'sync',env,server.fetcher);
 assert.deepEqual(status,{status:'synced',revision:7,count:2});
 assert.equal(server.posts,0);
 const index=read(path.join(root,'snapshot','index.json'));
 assert.equal(index.passages[0].bodySha256,sha256('Original'));
 const passage=read(path.join(root,'snapshot',index.passages[0].file));
 assert.equal(passage.body,'Original');assert.equal(passage._bridge.revision,7);
});

test('an approved edit modifies only selected body, verifies remote write, and records receipt',async t=>{
 const root=temp();t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 putRequest(root,'edit-opening-01');const server=fakeServer();
 const status=await run(root,'apply',env,server.fetcher);
 assert.equal(status.status,'complete'); assert.equal(status.succeeded,1);
 assert.equal(server.posts,1);assert.equal(server.revision,8);
 assert.equal(server.doc.passages[0].body,'Author-approved revised passage');
 assert.equal(server.doc.passages[0].notes,'Kept private');
 assert.equal(server.doc.passages[1].body,'Unmodified');
 assert.equal(read(path.join(root,'results','edit-opening-01.json')).status,'applied');
 assert.equal(read(path.join(root,'snapshot','index.json')).revision,8);
 const repeated=await run(root,'apply',env,server.fetcher);
 assert.equal(repeated.succeeded,0);assert.equal(server.posts,1,'receipt prevents replay');
});

test('stale revision refuses network write and saves rejection without prose',async t=>{
 const root=temp();t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 putRequest(root,'old-request',{expectedRevision:6});const server=fakeServer();
 const status=await run(root,'apply',env,server.fetcher);
 assert.equal(status.status,'attention_required'); assert.equal(server.posts,0);
 const receipt=read(path.join(root,'results','old-request.json'));
 assert.equal(receipt.code,'STALE_REVISION');assert.equal(JSON.stringify(receipt).includes('Author-approved revised passage'),false);
});

test('stale passage digest and disallowed document field refuse write',async t=>{
 for(const [requestId,patch,code] of [
  ['stale-body',{expectedBodySha256:'f'.repeat(64)},'STALE_PASSAGE_BODY'],
  ['invalid-payload',{document:{passages:[]}},'UNEXPECTED_REQUEST_FIELD'],
  ['not-approved',{approved:false},'AUTHOR_APPROVAL_REQUIRED'],
  ['unknown-passage',{passageId:'p-999'},'PASSAGE_NOT_FOUND']
 ]){
  const root=temp();t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  putRequest(root,requestId,patch);const server=fakeServer();await run(root,'apply',env,server.fetcher);
  assert.equal(read(path.join(root,'results',requestId+'.json')).code,code);
  assert.equal(server.posts,0);
 }
});

test('ambiguous POST acknowledgement is marked needs_review, not applied',async t=>{
 const root=temp();t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 putRequest(root,'ambiguous-ack');const server=fakeServer();
 const weird=async (url,options)=>{
   const response=await server.fetcher(url,options);
   if(options.method==='POST')return {status:200,headers:new Map([['content-type','application/json']]),json:async()=>({revision:1234,updatedAt:'2026-10-29T19:10:00Z'})};
   return response;
 };
 const state=await run(root,'apply',env,weird);
 assert.equal(state.status,'attention_required');
 assert.equal(server.posts,1);
 assert.equal(read(path.join(root,'results','ambiguous-ack.json')).status,'needs_review');
 assert.equal(read(path.join(root,'snapshot','index.json')).revision,8);
});

test('missing secret or partial Access pair fails before reading/saving',async()=>{
 assert.throws(()=>checkConfig({}),/OWNER_SECRET_MISSING/);
 assert.throws(()=>checkConfig({...env,ZETA_CF_ACCESS_CLIENT_ID:'id-only'}),/INCOMPLETE_ACCESS_TOKEN_PAIR/);
});

test('valid request requires strict approved shape',()=>{
 assert.throws(()=>validateRequest({version:1,requestId:'request-x',approved:true},'request-x.json'),/INVALID_PASSAGE_ID/);
});

test('CLI guard refuses wrong repo, public visibility, or unavailable GitHub verification',async()=>{
 const privateEnv={GITHUB_REPOSITORY:'jfairfaxball-348/ZETA-private-authoring',GITHUB_TOKEN:'g'.repeat(40)};
 await assert.rejects(assertPrivateRepository({...privateEnv,GITHUB_REPOSITORY:'jfairfaxball-348/ZETA-CYOD---leave-the-Citadel-'}),/WRONG_GITHUB_REPOSITORY/);
 await assert.rejects(assertPrivateRepository(privateEnv,async()=>({status:200,json:async()=>({private:false,full_name:privateEnv.GITHUB_REPOSITORY})})),/PRIVATE_REPOSITORY_REQUIRED/);
 await assert.rejects(assertPrivateRepository(privateEnv,async()=>({status:401})),/GITHUB_VISIBILITY_CHECK_FAILED/);
 await assertPrivateRepository(privateEnv,async()=>({status:200,json:async()=>({private:true,full_name:privateEnv.GITHUB_REPOSITORY})}));
});
