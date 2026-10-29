"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {archive}=require("../scripts/private-backup.cjs");
const baseEnv={
 STUDIO_URL:"https://zeta.example.workers.dev/",
 STUDIO_OWNER_TOKEN:"sample-owner-token-1234567890123456",
 GITHUB_BACKUP_TOKEN:"sample-test-token",
 GITHUB_BACKUP_REPO:"example/zeta-private"
};
function mockServer(document){
 let stored=null,reads=0,writes=0,changed=false;
 const api="https://api.github.com/repos/example/zeta-private";
 const target=api+"/contents/revisions/revision-00000004.json";
 async function fetcher(url,options={}){
  if(url===api)return {ok:true,json:async()=>({private:true})};
  if(url==="https://zeta.example.workers.dev/api/manuscript")
   return {ok:true,json:async()=>({revision:4,document})};
  if(url===target&&options.method==="PUT"){
   writes++;stored=JSON.parse(options.body).content;return {status:201,ok:true};
  }
  if(url===target){
   reads++;
   if(stored===null)return {status:404,ok:false};
   const actual=changed?Buffer.from('{"tampered":true}').toString("base64"):stored;
   return {status:200,ok:true,json:async()=>({encoding:"base64",content:actual})};
  }
  throw Error("Unexpected fetch "+url);
 }
 return {fetcher,metrics:()=>({writes,reads}),tamper:()=>{changed=true}};
}
test("scheduled backups fail loudly when required secrets are absent",async()=>{
 await assert.rejects(archive({ZETA_BACKUP_REQUIRED:"1"}),/Required private backup credentials missing/);
 assert.deepEqual(await archive({}),{skipped:true});
});
test("Cloudflare Access credentials must be supplied together",async()=>{
 await assert.rejects(archive({...baseEnv,CF_ACCESS_CLIENT_ID:"half"},async()=>({ok:true,json:async()=>({private:true})})),/pair/);
});
test("private GitHub backup is written, independently read back and never overwritten",async()=>{
 const doc={version:1,passages:[{body:"Disposable recovery paragraph"}]};
 const server=mockServer(doc);
 const first=await archive(baseEnv,server.fetcher);
 assert.deepEqual(first,{created:true,verified:true,revision:4});
 assert.equal(server.metrics().writes,1);
 const second=await archive(baseEnv,server.fetcher);
 assert.deepEqual(second,{exists:true,verified:true,revision:4});
 assert.equal(server.metrics().writes,1);
 server.tamper();
 await assert.rejects(archive(baseEnv,server.fetcher),/verification failed/);
});
