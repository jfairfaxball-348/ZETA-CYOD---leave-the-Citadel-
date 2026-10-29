"use strict";
// Uses actual Wrangler/workerd and a locally migrated D1 SQLite database.
// No Cloudflare login or real credentials required.
const {spawn}=require("node:child_process"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,".."),base="http://127.0.0.1:8789";
const token="ci-local-only-owner-token-0123456789-abcdefgh";
const proc=spawn(process.platform==="win32"?"npx.cmd":"npx",[
 "wrangler","dev","--local","--ip","127.0.0.1","--port","8789",
 "--var","STUDIO_OWNER_TOKEN:"+token,"--log-level","error"
],{cwd:root,env:{...process.env,CI:"true"},stdio:["ignore","pipe","pipe"]});
let logs="";
proc.stdout.on("data",d=>logs+=String(d).slice(-3000));
proc.stderr.on("data",d=>logs+=String(d).slice(-3000));
function makeDoc(){
 return {version:1,title:"Leave the Citadel",start:"P-1",sequence:1,edgeSequence:0,sceneSequence:1,
  acts:[{id:"a1",title:"ACT I"}],scenes:[{id:"s1",act:"a1",title:"Scene",notes:"Intact"}],
  passages:[{id:"P-1",scene:"s1",title:"Local D1 passage",body:"New prose.\n\nSecond paragraph.",notes:"Keep",status:"draft",x:21,y:30,edges:[]}]
 };
}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function call(method="GET",body,withKey=true){
 const headers={Origin:base};
 if(withKey)headers.Authorization="Bearer "+token;
 if(body)headers["Content-Type"]="application/json";
 const response=await fetch(base+"/api/manuscript",{method,headers,body:body?JSON.stringify(body):undefined});
 return {status:response.status,body:await response.json()};
}
(async()=>{
 try{
  let ready=false;
  for(let i=0;i<70;i++){
   if(proc.exitCode!==null)throw Error("Wrangler dev terminated prematurely");
   try{if((await fetch(base+"/")).status===200){ready=true;break;}}catch{}
   await pause(350);
  }
  if(!ready)throw Error("Wrangler dev did not become ready");
  assert.equal((await call("GET",undefined,false)).status,401,"no public manuscript read");
  assert.deepEqual(await call(),{status:200,body:{revision:0,document:null,updatedAt:null}});
  const doc=makeDoc();
  assert.equal((await call("POST",{action:"save",expectedRevision:0,document:doc})).body.revision,1);
  assert.deepEqual((await call()).body.document,doc,"D1 saves complete graph without loss");
  assert.equal((await call("POST",{action:"save",expectedRevision:0,document:doc})).status,409);
  const changed=structuredClone(doc);changed.passages[0].body="Revised passage!";
  assert.equal((await call("POST",{action:"save",expectedRevision:1,document:changed})).body.revision,2);
  assert.equal((await call("POST",{action:"restore",expectedRevision:2,targetRevision:1})).body.revision,3);
  assert.deepEqual((await call()).body.document,doc);
  const history=await fetch(base+"/api/manuscript?action=history",{headers:{Authorization:"Bearer "+token}});
  assert.deepEqual((await history.json()).history.map(v=>v.revision),[3,2,1]);
  console.log("PASS: real local D1 save, read, authorization, stale-tab conflict and historical restore");
 }catch(e){console.error(e);console.error(logs.slice(-7000));process.exitCode=1;}
 finally{proc.kill("SIGTERM");}
})();
