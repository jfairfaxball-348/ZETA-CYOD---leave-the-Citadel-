"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const {JSDOM}=require("jsdom");
const root=path.resolve(__dirname,".."),html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sources=["cloud.js","app.js"].map(name=>fs.readFileSync(path.join(root,name),"utf8"));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const state={revision:0,document:null,history:[]};
function openBrowser(){
 const dom=new JSDOM(html,{url:"https://studio.test/",runScripts:"outside-only",pretendToBeVisual:true}),w=dom.window;
 w.requestAnimationFrame=fn=>fn();w.confirm=()=>true;w.alert=()=>{};w.prompt=()=>null;
 w.URL.createObjectURL=()=>"blob:mock";w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){};
 w.fetch=async(url,options)=>{
  assert.match(url,/^\/api\/manuscript/);
  assert.match(options.headers.Authorization,/^Bearer .{32}/);
  if(options.method==="GET")return {ok:true,json:async()=>structuredClone(state)};
  const data=JSON.parse(options.body);
  if(data.expectedRevision!==state.revision)return {ok:false,status:409,json:async()=>({error:"REVISION_CONFLICT"})};
  state.revision++;state.document=structuredClone(data.document);state.history.push(structuredClone(state.document));
  return {ok:true,status:200,json:async()=>({revision:state.revision,updatedAt:new Date().toISOString()})};
 };
 for(const source of sources)w.eval(source);
 return {dom,w,$:sel=>w.document.querySelector(sel)};
}
async function connect(browser){
 const {w,$}=browser;
 $("#connectBtn").click();
 $("#ownerKey").value="test-owner-token-0123456789-0123456789";
 $("#connectNow").click();
 await sleep(40);
}
function edit(browser,value){
 const {w,$}=browser;
 $('[data-open-scene="s-opening"]').click();
 $(".node-card").dispatchEvent(new w.PointerEvent("pointerdown",{bubbles:true,button:0,clientX:100,clientY:100}));
 const input=$("#passageTitle");assert.ok(input);
 input.value=value;input.dispatchEvent(new w.Event("input",{bubbles:true}));
}
(async()=>{
 const first=openBrowser();
 await connect(first);
 assert.equal(state.revision,1,"First connection creates a server revision");
 edit(first,"Durable paragraph heading");
 await sleep(1100);
 assert.equal(state.revision,2,"Typing produces a second server revision");
 assert.match(first.$("#saveIndicator").textContent,/Saved/);
 const second=openBrowser();
 await connect(second);
 assert.equal(state.revision,2,"Joining second browser does not overwrite cloud");
 second.$('[data-open-scene="s-opening"]').click();
 second.$(".node-card").dispatchEvent(new second.w.PointerEvent("pointerdown",{bubbles:true,button:0,clientX:100,clientY:100}));
 assert.equal(second.$("#passageTitle").value,"Durable paragraph heading","Cloud draft is visible on second browser");
 const title=first.$("#passageTitle");title.value="Newer first-browser edit";title.dispatchEvent(new first.w.Event("input",{bubbles:true}));
 await sleep(1100);
 assert.equal(state.revision,3);
 const stale=second.$("#passageTitle");stale.value="Conflicting second-browser edit";stale.dispatchEvent(new second.w.Event("input",{bubbles:true}));
 await sleep(1100);
 assert.equal(state.revision,3,"Stale device cannot overwrite latest server version");
 assert.match(second.$("#saveIndicator").textContent,/Conflict/);
 assert.match(second.w.localStorage.getItem("zeta-studio-w005-recovery-v1"),/Conflicting second-browser edit/);
 first.dom.window.close();second.dom.window.close();
 console.log("PASS: server-ack save, second browser, stale edit rejection, local conflict recovery");
})().catch(e=>{console.error(e);process.exitCode=1;});
