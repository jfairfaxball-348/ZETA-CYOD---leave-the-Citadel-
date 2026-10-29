(function(){
"use strict";
const RECOVERY="zeta-studio-w005-recovery-v1", ARCHIVE="zeta-studio-w005-previous-local-v1";
let editor,token="",revision=0,pending=false,blocked=false,busy=false,changes=0,timer;
const $=id=>document.getElementById(id),status=s=>{$("saveIndicator").textContent=s;};
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||"null");}catch{return null;}};
function buffer(document,unsent=pending){
  try{localStorage.setItem(RECOVERY,JSON.stringify({document,baseRevision:revision,pending:unsent,updatedAt:new Date().toISOString()}));return true;}
  catch{status("Browser storage failed — export now");return false;}
}
function download(data,name){
 const blob=new Blob([JSON.stringify(data,null,2)+"\n"],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function schedule(ms=900){clearTimeout(timer);if(token&&!blocked)timer=setTimeout(()=>void flush(),ms);}
function persist(document){
 pending=true;changes++;
 if(buffer(document,true))status(token?(blocked?"Conflict — local changes kept":"Saving…"):"Local only — export backup");
 schedule();
}
async function request(method,query="",body){
 const options={method,headers:{Authorization:"Bearer "+token}};
 if(body){options.headers["Content-Type"]="application/json";options.body=JSON.stringify(body);}
 const res=await fetch("/api/manuscript"+query,options);
 let result;try{result=await res.json();}catch{result={};}
 if(!res.ok){const e=new Error(result.error||"HTTP_"+res.status);e.status=res.status;throw e;}
 return result;
}
async function flush(){
 if(!token||!pending||busy||blocked)return;
 clearTimeout(timer);busy=true;status("Saving…");
 const snapshot=JSON.stringify(editor.getDoc()),serial=changes,expectedRevision=revision;
 try{
  const saved=await request("POST","",{action:"save",expectedRevision,document:JSON.parse(snapshot)});
  revision=saved.revision;
  if(serial===changes && JSON.stringify(editor.getDoc())===snapshot){pending=false;buffer(editor.getDoc(),false);status("✓ Saved");}
  else {pending=true;buffer(editor.getDoc(),true);status("Saving…");}
 }catch(e){
  pending=true;buffer(editor.getDoc(),true);
  if(e.status===409){blocked=true;status("Conflict — local changes kept");}
  else if(e.status===401){token="";status("Access expired — local changes kept");}
  else status("Offline / failed — local changes kept");
 }finally{busy=false;if(pending&&token&&!blocked)schedule(1800);}
}
function adopt(document,rev){editor.setDoc(document);revision=rev;pending=false;blocked=false;buffer(document,false);status("✓ Saved");}
async function connect(key){
 token=key;
 const remote=await request("GET"),local=editor.getDoc(),copy=read(RECOVERY);
 if(!remote.document){
  if(!confirm("Create first cloud manuscript from this browser? Original local data will not be removed.")){token="";status("Local only — export backup");return;}
  revision=0;pending=true;blocked=false;buffer(local,true);await flush();return;
 }
 if(JSON.stringify(remote.document)===JSON.stringify(local)){
  revision=remote.revision;pending=false;blocked=false;buffer(local,false);status("✓ Saved");return;
 }
 if(copy?.pending&&copy.baseRevision===remote.revision){
  revision=remote.revision;pending=true;blocked=false;await flush();return;
 }
 if(!confirm("Cloud revision "+remote.revision+" differs from this browser. OK archives and downloads the local draft before opening the cloud copy. Cancel keeps the local draft unchanged.")){token="";blocked=true;status("Local copy kept — cloud unchanged");return;}
 try{localStorage.setItem(ARCHIVE,JSON.stringify({document:local,archivedAt:new Date().toISOString()}));}
 catch{token="";throw Error("Local archive failed. Export your draft before switching.");}
 download({document:local,source:"previous-local"},"zeta-previous-local-draft.json");
 adopt(remote.document,remote.revision);
}
function unlock(){
 const root=$("modalRoot");
 root.innerHTML='<div class="dialog-overlay"><div class="dialog" role="dialog" aria-modal="true"><h2>Connect private saves</h2><p>Enter the owner key. It stays only in this tab’s memory.</p><label class="field"><span>Owner key</span><input id="ownerKey" type="password" autocomplete="off"></label><p id="ownerError" role="status"></p><button id="connectNow">Connect</button> <button id="cancelNow">Cancel</button></div></div>';
 $("cancelNow").onclick=()=>root.innerHTML="";
 $("connectNow").onclick=async()=>{
  const key=$("ownerKey").value;$("ownerKey").value="";
  if(key.length<32){$("ownerError").textContent="Enter a configured 32+ character owner key.";return;}
  $("connectNow").disabled=true;
  try{await connect(key);root.innerHTML="";}
  catch(e){token="";$("ownerError").textContent=e.message==="NOT_CONFIGURED"?"Cloud storage is not yet configured. Browser writing is untouched.":"Connection failed: "+e.message;status("Local only — export backup");$("connectNow").disabled=false;}
 };
 $("ownerKey").focus();
}
async function history(){
 if(!token){unlock();return;}
 if(pending||busy||blocked){alert("There are unresolved local edits. Export your manuscript and resolve the conflict first.");return;}
 try{
  const {history}=await request("GET","?action=history");
  if(!history.length){alert("No revisions yet.");return;}
  const list=history.slice(0,20).map(v=>v.revision+" — "+new Date(v.updatedAt).toLocaleString()).join("\n");
  const selected=prompt("Cloud history (newest first):\n"+list+"\nEnter a revision to restore, or Cancel:","");
  if(!selected)return;
  const targetRevision=Number(selected);
  if(!Number.isSafeInteger(targetRevision)||!history.some(v=>v.revision===targetRevision)){alert("Choose a listed revision.");return;}
  if(!confirm("Restore revision "+targetRevision+" as a NEW revision? All newer server versions remain recoverable."))return;
  const saved=await request("POST","",{action:"restore",expectedRevision:revision,targetRevision});
  const latest=await request("GET");
  if(saved.revision!==latest.revision)throw Error("VERSION_CHANGED");
  try{localStorage.setItem(ARCHIVE,JSON.stringify({document:editor.getDoc(),archivedAt:new Date().toISOString()}));}catch{}
  adopt(latest.document,latest.revision);
 }catch(e){if(e.status===409){blocked=true;status("Conflict — local copy kept");}alert("History unavailable: "+e.message);}
}
function recover(){
 const archived=read(ARCHIVE),current=read(RECOVERY);
 if(archived&&confirm("Download previous browser draft? Cancel downloads the current recovery buffer."))download(archived,"zeta-older-local-draft.json");
 else if(current)download(current,"zeta-recovery.json");
 else alert("No recovery data found; use Export manuscript.");
}
function init(options){
 editor=options;
 const old=read(RECOVERY);if(old&&editor.valid(old.document)){revision=Number.isSafeInteger(old.baseRevision)?old.baseRevision:0;pending=!!old.pending;}
 $("connectBtn").addEventListener("click",unlock);
 $("historyBtn").addEventListener("click",history);
 $("recoveryBtn").addEventListener("click",recover);
 status("Local only — export backup");
 window.addEventListener("online",()=>{if(token&&pending&&!blocked)schedule(25);});
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&token&&pending)void flush();});
 window.addEventListener("pagehide",()=>{if(token&&pending)void flush();});
}
const confirmImport=()=>!token||confirm("Upload this imported manuscript as a new cloud revision? Earlier revisions remain in server history.");
window.ZetaCloud={init,persist,confirmImport};
})();