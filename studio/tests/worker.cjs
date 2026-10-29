"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const key="a-strong-test-key-01234567890123456789";
function database(){
 let head={revision:0,document:null,updated_at:null};
 const history=new Map();
 return {
  prepare(sql){
   const item={
    sql,args:[],
    bind(...values){return {...item,args:values};},
    async first(){
     if(sql.startsWith("SELECT revision,document,updated_at FROM zeta_manuscript"))return {...head};
     if(sql.startsWith("SELECT revision,document,created_at FROM zeta_revision"))return history.get(item.args[0])||null;
     if(sql.startsWith("SELECT document FROM zeta_revision"))return history.get(item.args[0])||null;
     throw Error("Unexpected D1 .first query: "+sql);
    },
    async all(){
     if(sql.startsWith("SELECT revision,created_at,restored_from FROM zeta_revision"))
      return {results:[...history.values()].sort((a,b)=>b.revision-a.revision)};
     throw Error("Unexpected D1 .all query: "+sql);
    }
   };return item;
  },
  async batch(statements){
   const result=[];
   for(const st of statements){
    if(st.sql.startsWith("UPDATE zeta_manuscript")){
     const [document,time,expected]=st.args;
     const changes=head.revision===expected?1:0;
     if(changes)head={revision:head.revision+1,document,updated_at:time};
     result.push({meta:{changes}});
    }else if(st.sql.startsWith("INSERT OR IGNORE INTO zeta_revision")){
     const [restoredFrom,revision]=st.args;
     const changes=head.revision===revision&&!history.has(revision)?1:0;
     if(changes)history.set(revision,{revision,document:head.document,created_at:head.updated_at,restored_from:restoredFrom});
     result.push({meta:{changes}});
    }else throw Error("Unexpected batch SQL "+st.sql);
   }
   return result;
  }
 };
}
function document(){
 return {version:1,title:"Leave the Citadel",start:"P-1",sequence:2,edgeSequence:1,sceneSequence:1,
 acts:[{id:"a1",title:"ACT I"}],scenes:[{id:"s1",act:"a1",title:"Scene",notes:"planning",x:23,y:50}],
 passages:[
  {id:"P-1",scene:"s1",title:"Opening",body:"First line.\n\nSecond line.",notes:"Internal note",status:"draft",x:12,y:48,edges:[{id:"E-1",to:"P-2",label:"Next",setMark:"digit"}]},
  {id:"P-2",scene:"s1",title:"End",body:"",notes:"",status:"planned",x:40,y:50,edges:[]}
 ]};
}
(async()=>{
 const handler=(await import("../src/worker.mjs")).default;
 const env={DB:database(),STUDIO_OWNER_TOKEN:key,ASSETS:{fetch:async()=>new Response("Static assets",{status:200})}};
 const call=async(method="GET",data,auth=key,query="",origin="https://studio.test")=>{
  const headers={Authorization:"Bearer "+auth,Origin:origin};
  if(data)headers["Content-Type"]="application/json";
  const request=new Request("https://studio.test/api/manuscript"+query,{
   method,headers,body:data?JSON.stringify(data):undefined
  });
  const response=await handler.fetch(request,env);
  return {status:response.status,data:await response.json()};
 };
 test("Cloudflare worker serves static assets independently",async()=>{
  const response=await handler.fetch(new Request("https://studio.test/"),env);
  assert.equal(response.status,200);assert.equal(await response.text(),"Static assets");
 });
 test("Cloudflare D1 manuscript API: owner access, CAS, history, restore",async()=>{
  assert.equal((await call("GET",null,"no-access")).status,401);
  assert.equal((await call("GET",null,key,"","https://another.site")).status,403);
  assert.deepEqual((await call()).data,{revision:0,document:null,updatedAt:null});
  const initial=document();
  const first=await call("POST",{action:"save",expectedRevision:0,document:initial});
  assert.equal(first.status,200);assert.equal(first.data.revision,1);
  assert.deepEqual((await call()).data.document,initial);
  const second=structuredClone(initial);second.passages[0].body="Second authenticated tab";
  assert.equal((await call("POST",{action:"save",expectedRevision:1,document:second})).data.revision,2);
  const stale=structuredClone(initial);stale.passages[0].body="Stale local recovery";
  assert.deepEqual(await call("POST",{action:"save",expectedRevision:1,document:stale}),{status:409,data:{error:"REVISION_CONFLICT"}});
  assert.equal((await call()).data.document.passages[0].body,"Second authenticated tab");
  const restored=await call("POST",{action:"restore",expectedRevision:2,targetRevision:1});
  assert.equal(restored.data.revision,3);
  assert.deepEqual((await call()).data.document,initial);
  const versions=await call("GET",undefined,key,"?action=history");
  assert.deepEqual(versions.data.history.map(x=>x.revision),[3,2,1]);
  assert.equal(versions.data.history[0].restoredFrom,1);
  assert.deepEqual((await call("GET",undefined,key,"?action=revision&revision=2")).data.document,second);
 });
 test("Cloudflare D1 rejects invalid manuscript and keeps committed revision",async()=>{
  const invalid=document();invalid.passages[0].edges[0].to="MISSING";
  assert.equal((await call("POST",{action:"save",expectedRevision:3,document:invalid})).status,422);
  assert.equal((await call("POST",{action:"restore",expectedRevision:3,targetRevision:999})).status,404);
  assert.equal((await call("POST",{action:"unknown",expectedRevision:3})).status,400);
  assert.equal((await call("GET",undefined,key,"?action=unknown")).status,400);
  assert.equal((await call("PUT")).status,405);
  assert.equal((await call()).data.revision,3);
 });
})();
