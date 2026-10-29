"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {processRequest,HttpError,validateDocument}=require("../lib/manuscript.cjs");
const env={STUDIO_OWNER_TOKEN:"fixture-owner-token-not-for-production-000001",DATABASE_URL:"postgresql://mock"};
function manuscript(){
 const acts=[{id:"a1",title:"Act I"}],scenes=[{id:"s1",act:"a1",title:"Scene",notes:"scene note"}];
 return {version:1,title:"Leave the Citadel",start:"P-1",sequence:2,edgeSequence:1,sceneSequence:1,acts,scenes,
 passages:[{id:"P-1",scene:"s1",title:"Draft",body:"A paragraph.\n\nA second paragraph.",notes:"author note",status:"draft",x:12,y:44,edges:[{id:"E-1",to:"P-2",label:"Continue",setMark:"knot"}]},
 {id:"P-2",scene:"s1",title:"Ending",body:"",notes:"",status:"planned",x:22,y:50,edges:[]}]};
}
function store(){
 let head=null;const versions=new Map();
 return {
  async load(){return head&&structuredClone(head);},
  async loadVersion(n){return versions.has(n)?structuredClone(versions.get(n)):null;},
  async history(){return [...versions.values()].reverse().map(x=>({revision:x.revision,updatedAt:x.updatedAt,restoredFrom:x.restoredFrom}));},
  async save(doc,expected,from){
   const actual=head?.revision||0;
   if(expected!==actual)throw new HttpError(409,"REVISION_CONFLICT");
   const revision=actual+1,updatedAt=new Date().toISOString();
   head={revision,document:structuredClone(doc),updatedAt};
   versions.set(revision,{...structuredClone(head),restoredFrom:from});
   return {revision,updatedAt};
  }
 };
}
function req(method="GET",body,query={},auth=true,origin="https://studio.test"){
 return {method,query,body,headers:{host:"studio.test",origin,authorization:auth?"Bearer "+env.STUDIO_OWNER_TOKEN:undefined,"content-type":"application/json"}};
}
test("protect read/write/history/restore from unauthorized callers",async()=>{
 const db=store();
 for(const body of [undefined,{action:"save",expectedRevision:0,document:manuscript()},{action:"restore",expectedRevision:0,targetRevision:1}]){
  const method=body?"POST":"GET";
  await assert.rejects(processRequest(req(method,body,{},false),db,env),{status:401,code:"UNAUTHORIZED"});
 }
 await assert.rejects(processRequest(req("GET",undefined,{} ,true,"https://evil.site"),db,env),{status:403,code:"BAD_ORIGIN"});
 await assert.rejects(processRequest(req("GET"),db,{...env,STUDIO_OWNER_TOKEN:"short"}),{status:503,code:"NOT_CONFIGURED"});
});
test("lossless snapshot, revision monotonicity, stale-tab conflict, and nondestructive restore",async()=>{
 const db=store(),original=manuscript();
 assert.ok(validateDocument(original));
 assert.deepEqual(await processRequest(req(),db,env),{revision:0,document:null,updatedAt:null});
 let saved=await processRequest(req("POST",{action:"save",expectedRevision:0,document:original}),db,env);
 assert.equal(saved.revision,1);
 const otherTab=structuredClone(original);otherTab.passages[0].body="Second browser wrote this";
 saved=await processRequest(req("POST",{action:"save",expectedRevision:1,document:otherTab}),db,env);
 assert.equal(saved.revision,2);
 const stale=structuredClone(original);stale.passages[0].body="Stale unsent text";
 await assert.rejects(processRequest(req("POST",{action:"save",expectedRevision:1,document:stale}),db,env),{status:409});
 assert.deepEqual((await processRequest(req(),db,env)).document,otherTab);
 const restored=await processRequest(req("POST",{action:"restore",expectedRevision:2,targetRevision:1}),db,env);
 assert.equal(restored.revision,3);
 const current=await processRequest(req(),db,env);
 assert.deepEqual(current.document,original);
 const history=(await processRequest(req("GET",undefined,{action:"history"}),db,env)).history;
 assert.deepEqual(history.map(x=>x.revision),[3,2,1]);
 assert.equal(history[0].restoredFrom,1);
 assert.deepEqual((await processRequest(req("GET",undefined,{action:"revision",revision:"2"}),db,env)).document,otherTab);
});
test("whole-graph changes are preserved, deletions do not mutate previous versions",async()=>{
 const db=store(),doc=manuscript();
 await processRequest(req("POST",{action:"save",expectedRevision:0,document:doc}),db,env);
 doc.passages[0].body="A newly typed paragraph!";
 doc.passages[0].edges=[];
 doc.passages.splice(1,1);
 doc.scenes[0].x=330;doc.scenes[0].notes="Revised notes";
 await processRequest(req("POST",{action:"save",expectedRevision:1,document:doc}),db,env);
 assert.deepEqual((await processRequest(req(),db,env)).document,doc);
 assert.equal((await processRequest(req("GET",undefined,{action:"revision",revision:"1"}),db,env)).document.passages.length,2);
});
test("reject invalid imports, oversize bodies and unknown requests without mutation",async()=>{
 const db=store(),doc=manuscript();
 doc.passages[0].edges[0].to="NOT-A-DESTINATION";
 assert.equal(validateDocument(doc),false);
 await assert.rejects(processRequest(req("POST",{action:"save",expectedRevision:0,document:doc}),db,env),{status:422});
 const large=manuscript();large.passages[0].body="Z".repeat(2_000_001);
 await assert.rejects(processRequest(req("POST",{action:"save",expectedRevision:0,document:large}),db,env),{status:413});
 await assert.rejects(processRequest(req("POST",{action:"restore",expectedRevision:0,targetRevision:9}),db,env),{status:404});
 await assert.rejects(processRequest(req("DELETE"),db,env),{status:405});
 assert.equal((await db.load()),null);
});

test("backup skips absent credentials and refuses public destinations before querying data",async()=>{
 const {archive}=require("../scripts/private-backup.cjs");
 assert.deepEqual(await archive({}),{skipped:true});
 await assert.rejects(archive({DATABASE_URL:"postgresql://not-used",GITHUB_BACKUP_TOKEN:"x",GITHUB_BACKUP_REPO:"example/public"},
  async()=>({ok:true,json:async()=>({private:false})})),/private/);
});
