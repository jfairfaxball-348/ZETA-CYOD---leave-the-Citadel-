(function(){
"use strict";
const KEY="zeta-studio-w004-poc-v1";
const MARKS={digit:"Number mark",knot:"Interlocking mark",binomial:"Binomial mark"};
const STATUS=["planned","draft","reviewed"];
const $=(id)=>document.getElementById(id);
const html=(v)=>String(v??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function seed(){
 const acts=[
  {id:"a1",title:"ACT I",subtitle:"Exile · River",x:75,y:120,w:1260,h:865},
  {id:"a2",title:"ACT II",subtitle:"Exploration · Atlas",x:1370,y:120,w:1390,h:865},
  {id:"a3",title:"ACT III",subtitle:"Return · Living Book",x:2800,y:120,w:1030,h:865}
 ];
 const scenes=[
  {id:"s-opening",act:"a1",title:"Opening / the three marks",x:145,y:260,w:774,h:550,collapsed:false,notes:"Approved architecture: the opening mark branches into three different grounds for exile, then converges. Draft printed page pointers are not final."},
  {id:"s-shared",act:"a1",title:"Shared Act I",x:954,y:260,w:350,h:550,collapsed:false,notes:"The opening mark must not change this shared journey. The end-of-act gateway routes according to the mark chosen at the opening."},
  {id:"s-number",act:"a2",title:"Number-theory territory",x:1470,y:285,w:340,h:340,collapsed:true,notes:"Act II regional investigation: specific judgement and refutation remain unwritten."},
  {id:"s-topologia",act:"a2",title:"Topologia",x:1895,y:285,w:340,h:340,collapsed:true,notes:"Distinct Act II regional investigation; not an alternative Act I choice."},
  {id:"s-combinatorium",act:"a2",title:"Combinatorium",x:2320,y:285,w:340,h:340,collapsed:true,notes:"Distinct Act II regional investigation; substantive evidence is still to be designed."},
  {id:"s-return",act:"a3",title:"Return to the Citadel",x:2915,y:290,w:430,h:330,collapsed:true,notes:"Return, confrontation, vindication and a single unexplained incident. All scene content remains open."}
 ];
 const p=(id,scene,title,body,x,y,edges=[],kind="passage",status="planned")=>({id,scene,title,body,x,y,edges,kind,status,notes:""});
 const e=(id,to,label,extra={})=>({id,to,label,...extra});
 const passages=[
  p("P-0001","s-opening","The instruction","…leave The Citadel.\n\nThat is what you must do.\n\nYou look down at your right wrist.\n\nWhat do you see?",257,80,[e("E-01","P-0002","",{"setMark":"digit"}),e("E-02","P-0003","",{"setMark":"knot"}),e("E-03","P-0004","",{"setMark":"binomial"})],"opening","draft"),
  p("P-0002","s-opening","The digit","[UNWRITTEN: the number-theory accusation and reason departure is compulsory. Only one onward continuation.]",16,286,[e("E-04","P-0005","Continue — draft page 2")],"explanation"),
  p("P-0003","s-opening","The interlocking form","[UNWRITTEN: the topological accusation and reason departure is compulsory. Only one onward continuation.]",261,286,[e("E-05","P-0005","Continue — draft page 2")],"explanation"),
  p("P-0004","s-opening","The binomial mark","[UNWRITTEN: the combinatorial accusation and reason departure is compulsory. Only one onward continuation.]",506,286,[e("E-06","P-0005","Continue — draft page 2")],"explanation"),
  p("P-0005","s-shared","Beyond the Citadel","[UNWRITTEN: the first shared Act I scene. This passage does not change according to the wrist mark.]",44,95,[e("E-07","P-0006","Continue")],"passage"),
  p("P-0006","s-shared","The deferred gateway","[UNWRITTEN: the end of Act I. The opening mark determines where the reader goes next; the reader does not choose the region again.]",44,295,[e("E-08","P-0007","",{"requiresMark":"digit"}),e("E-09","P-0008","",{"requiresMark":"knot"}),e("E-10","P-0009","",{"requiresMark":"binomial"})],"gateway"),
  p("P-0007","s-number","The false judgement — number","[UNWRITTEN: regional investigation and route-specific evidence that the Citadel's judgement was unjustified.]",42,85,[e("E-11","P-0010","Return to the Citadel")],"passage"),
  p("P-0008","s-topologia","The false judgement — topology","[UNWRITTEN: regional investigation and route-specific evidence that the Citadel's judgement was unjustified.]",42,85,[e("E-12","P-0010","Return to the Citadel")],"passage"),
  p("P-0009","s-combinatorium","The false judgement — combinatorics","[UNWRITTEN: regional investigation and route-specific evidence that the Citadel's judgement was unjustified.]",42,85,[e("E-13","P-0010","Return to the Citadel")],"passage"),
  p("P-0010","s-return","Return and vindication","[UNWRITTEN: confrontation and vindication with route-specific consequences. One unexplained incident hints at the wider mystery.]",58,85,[],"ending")
 ];
 return {version:1,title:"Leave the Citadel",start:"P-0001",sequence:10,edgeSequence:13,sceneSequence:6,acts,scenes,passages};
}
function valid(d){return !!(d&&d.version===1&&Array.isArray(d.acts)&&Array.isArray(d.scenes)&&Array.isArray(d.passages)&&typeof d.start==="string"&&typeof d.sequence==="number"&&d.acts.length>0&&d.scenes.length>0&&d.passages.length>0&&d.passages.every(p=>p.id&&p.scene&&Array.isArray(p.edges)));}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);if(valid(d))return d;}}catch(err){console.warn("Could not restore studio data",err);}return seed();}
let doc=load(),selection=null,activeSceneId=null,view={x:20,y:40,z:.65},drag=null,reading=null,toastTimer=0;
function scene(id){return doc.scenes.find(x=>x.id===id);}
function passage(id){return doc.passages.find(x=>x.id===id);}
function act(id){return doc.acts.find(x=>x.id===id);}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(doc));$("saveIndicator").textContent="● Saved on this device";}catch(err){$("saveIndicator").textContent="Save failed — export a backup";console.warn(err);}}
function toast(message){const node=$("toast");node.textContent=message;node.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("visible"),2600);}
function posStyle(o){return "left:"+o.x+"px;top:"+o.y+"px;width:"+o.w+"px;height:"+o.h+"px";}
function sel(type,id){selection={type,id};render();}
function renderOutline(){
 let out="";
 for(const a of doc.acts){
  out+='<div class="act-outline"><div class="act-outline-head" style="--accent:'+(a.id==="a1"?"#4b9dd0":a.id==="a2"?"#4bb69f":"#b18fd3")+'"><span class="bar"></span>'+html(a.title)+" · "+html(a.subtitle)+'</div>';
  for(const s of doc.scenes.filter(x=>x.act===a.id)){
   const count=doc.passages.filter(p=>p.scene===s.id).length;
   out+='<button class="scene-link '+(selection?.id===s.id?"selected":"")+'" data-focus="'+html(s.id)+'"><span aria-hidden="true">'+(s.collapsed?"▣":"▤")+'</span><span>'+html(s.title)+'<small>'+count+" passages · "+(s.collapsed?"collapsed":"expanded")+'</small></span></button>';
  }
  out+="</div>";
 }
 $("outline").innerHTML=out;
 $("outline").querySelectorAll("[data-focus]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.focus;sel("scene",id);focusScene(id);}));
}

function enterScene(id){
 const s=scene(id);if(!s)return;
 activeSceneId=id;selection=null;
 // Keep the broad map intact, but show just the chosen scene in detail.
 for(const item of doc.scenes)item.collapsed=item.id!==id;
 persist();render();focusScene(id);
}
function backToOverview(){
 activeSceneId=null;selection=null;render();
}
function renderOverview(){
 const overview=$("overview"),inScene=!!activeSceneId;
 overview.hidden=inScene;$("viewport").hidden=!inScene;
 $("canvasTools").hidden=!inScene;$("backBtn").hidden=!inScene;
 $("addPassageBtn").hidden=!inScene;
 if(inScene){
  const s=scene(activeSceneId);
  $("stageKicker").textContent=(act(s?.act)?.title||"STORY")+" · SCENE";
  $("canvasTitle").textContent=s?.title||"Scene";
  $("stageHint").textContent="Choose a passage to write, or add another.";
  return;
 }
 $("stageKicker").textContent="YOUR STORY";
 $("canvasTitle").textContent="Where would you like to write?";
 $("stageHint").textContent="Choose a scene. Open its passages. Write one at a time.";
 const labels={a1:"Exile",a2:"Exploration",a3:"Return"};
 overview.innerHTML=doc.acts.map(a=>{
  const tiles=doc.scenes.filter(s=>s.act===a.id).map(s=>{
   const ps=doc.passages.filter(p=>p.scene===s.id);
   const worked=ps.filter(p=>p.status==="reviewed"||((p.status==="draft")&&p.body.trim()&&!p.body.includes("[UNWRITTEN"))).length;
   const pct=ps.length?Math.round(worked*100/ps.length):0;
   return '<button class="scene-tile" data-open-scene="'+html(s.id)+'"><span class="scene-title">'+html(s.title)+'</span><span class="scene-meta">'+ps.length+' '+(ps.length===1?"passage":"passages")+'<span class="scene-go">↗</span></span><span class="scene-progress"><span style="width:'+pct+'%"></span></span></button>';
  }).join("");
  return '<section class="act-column"><div class="act-label">'+html(a.title)+'</div><h2 class="act-title">'+html(labels[a.id]||a.subtitle)+'</h2><p class="act-description">'+html(a.subtitle)+'</p>'+tiles+'<button class="add-scene-tile" data-act-add="'+html(a.id)+'">＋ Add a scene</button></section>';
 }).join("");
 overview.querySelectorAll("[data-open-scene]").forEach(b=>b.addEventListener("click",()=>enterScene(b.dataset.openScene)));
 overview.querySelectorAll("[data-act-add]").forEach(b=>b.addEventListener("click",()=>addScene(b.dataset.actAdd)));
}
function endPoint(p){
 const s=scene(p.scene);
 if(!s)return null;
 if(s.collapsed)return {x:s.x+120,y:s.y+65};
 return {x:s.x+(Number(p.x)||0)+117,y:s.y+(Number(p.y)||0)+65};
}
function renderWorld(){
 const root=$("world");root.innerHTML="";
 for(const a of doc.acts){
  const el=document.createElement("div");el.className="act-frame";el.dataset.act=a.id;el.style.cssText=posStyle(a);
  el.innerHTML="<h3>"+html(a.title)+'<span class="act-subtitle">'+html(a.subtitle)+"</span></h3>";root.appendChild(el);
 }
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("class","edges-layer");svg.setAttribute("viewBox","0 0 4200 1600");
 const defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
 defs.innerHTML='<marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L0 6 L7 3 Z" fill="#7190a7"/></marker>';
 svg.appendChild(defs);
 const renderedEdges=new Set();
 for(const p of doc.passages){
  for(const edge of p.edges){
   const q=passage(edge.to),start=endPoint(p),end=q?endPoint(q):null;
   if(!start||!end)continue;
   const ps=scene(p.scene),qs=scene(q.scene);
   const key=(ps?.collapsed?ps.id:p.id)+"-"+(qs?.collapsed?qs.id:q.id);
   if(renderedEdges.has(key))continue;
   renderedEdges.add(key);
   const path=document.createElementNS("http://www.w3.org/2000/svg","path");
   const dx=Math.max(54,Math.abs(end.x-start.x)*.5);
   const sign=end.x>=start.x?1:-1;
   path.setAttribute("d","M"+start.x+" "+start.y+" C"+(start.x+dx*sign)+" "+start.y+" "+(end.x-dx*sign)+" "+end.y+" "+end.x+" "+end.y);
   path.setAttribute("class","edge"+(edge.setMark||edge.requiresMark?" mark":""));
   path.setAttribute("marker-end","url(#arrow)");svg.appendChild(path);
  }
 }
 root.appendChild(svg);
 for(const s of doc.scenes){
  const el=document.createElement("div");
  el.className="scene-frame"+(s.collapsed?" collapsed":"")+(selection?.type==="scene"&&selection.id===s.id?" selected":"");
  el.style.cssText=posStyle({...s,w:s.collapsed?250:s.w,h:s.collapsed?134:s.h});
  const count=doc.passages.filter(p=>p.scene===s.id).length;
  el.innerHTML='<div class="scene-header"><span class="scene-kicker">SCENE</span><strong>'+html(s.title)+'</strong><button class="collapse-btn" aria-label="'+(s.collapsed?"Expand":"Collapse")+' scene">'+(s.collapsed?"⊞":"⊟")+'</button></div>'+(s.collapsed?'<div class="collapsed-info">'+count+' passages · click to expand</div>':'<div class="scene-note">'+html(s.notes||"Add a purpose for this scene.")+'</div>');
  el.querySelector(".collapse-btn").addEventListener("pointerdown",event=>event.stopPropagation());
  el.querySelector(".collapse-btn").addEventListener("click",event=>{event.stopPropagation();s.collapsed=!s.collapsed;persist();render();});
  el.querySelector(".scene-header").addEventListener("pointerdown",(event)=>beginDrag(event,"scene",s.id));
  el.addEventListener("click",()=>{if(s.collapsed){enterScene(s.id);}else if(selection?.id!==s.id)sel("scene",s.id);});
  if(!s.collapsed){
   for(const p of doc.passages.filter(p=>p.scene===s.id)){
    const card=document.createElement("div");
    card.className="node-card"+(selection?.type==="passage"&&selection.id===p.id?" selected":"");
    card.style.left=(Number(p.x)||0)+"px";card.style.top=(Number(p.y)||0)+"px";
    card.innerHTML='<div class="node-top"><span class="node-id">'+html(p.id)+'</span><span class="status-dot '+html(p.status||"planned")+'"></span></div><h4>'+html(p.title)+'</h4><p>'+html(p.body||"Not yet written")+'</p><div class="node-footer">'+p.edges.length+" onward "+(p.edges.length===1?"link":"links")+"</div>";
    card.addEventListener("pointerdown",(event)=>{event.stopPropagation();selection={type:"passage",id:p.id};renderOutline();renderInspector();beginDrag(event,"passage",p.id);});
    card.addEventListener("click",(event)=>event.stopPropagation());
    el.appendChild(card);
   }
  }
  root.appendChild(el);
 }
 root.style.transform="translate("+view.x+"px,"+view.y+"px) scale("+view.z+")";
 $("zoomLabel").textContent=Math.round(view.z*100)+"%";
}
function renderInspector(){
 const area=$("inspectorContent");
 document.body.classList.toggle("editor-open",!!selection);
 $("drawerBackdrop").hidden=!selection;
 if(!selection){area.innerHTML='<div class="inspector-empty"><span class="empty-symbol">✎</span><h2>The page is yours.</h2><p>Select a passage on the canvas to begin writing.</p><p class="muted">Your changes are saved only in this browser.</p></div>';return;}
 if(selection.type==="scene"){
  const s=scene(selection.id);if(!s){selection=null;renderInspector();return;}
  area.innerHTML='<div class="inspector-head"><div class="path">SCENE · '+html(act(s.act)?.title||"")+'</div><h2>'+html(s.title)+'</h2><p>Group and plan passages here.</p></div><div class="inspector-body"><label class="field"><span>Scene title</span><input id="sceneTitle" value="'+html(s.title)+'"></label><label class="field"><span>Act</span><select id="sceneAct">'+doc.acts.map(a=>'<option value="'+html(a.id)+'"'+(a.id===s.act?" selected":"")+'>'+html(a.title)+"</option>").join("")+'</select></label><label class="field"><span>Purpose and notes</span><textarea class="notes" id="sceneNotes">'+html(s.notes||"")+'</textarea></label><p class="smallcopy">'+doc.passages.filter(p=>p.scene===s.id).length+' passages · '+(s.collapsed?"Collapsed":"Expanded")+'</p><button class="secondary-button" id="sceneToggle">'+(s.collapsed?"Expand":"Collapse")+' this scene</button> <button class="secondary-button" id="sceneAdd">+ Add passage</button><div class="notice">Scene cards are planning containers, not printed pages. Move them on the graph without changing the reading order.</div></div>';
  $("sceneTitle").addEventListener("input",e=>{s.title=e.target.value;persist();});
  $("sceneTitle").addEventListener("change",render);
  $("sceneNotes").addEventListener("input",e=>{s.notes=e.target.value;persist();});
  $("sceneNotes").addEventListener("change",render);
  $("sceneAct").addEventListener("change",e=>{s.act=e.target.value;persist();render();});
  $("sceneToggle").addEventListener("click",()=>{s.collapsed=!s.collapsed;persist();render();});
  $("sceneAdd").addEventListener("click",()=>addPassage(s.id));
  return;
 }
 const p=passage(selection.id);if(!p){selection=null;renderInspector();return;}
 const s=scene(p.scene);
 area.innerHTML='<div class="inspector-head"><div class="path">'+html(act(s?.act)?.title||"")+" / "+html(s?.title||"")+'</div><h2>'+html(p.id)+'</h2><p>Internal address · not a printed page number</p></div><div class="inspector-body"><label class="field"><span>Working title</span><input id="passageTitle" value="'+html(p.title)+'"></label><label class="field"><span>Editorial status</span><select id="passageStatus">'+STATUS.map(k=>'<option value="'+k+'"'+(p.status===k?" selected":"")+'>'+k[0].toUpperCase()+k.slice(1)+"</option>").join("")+'</select></label><label class="field"><span>Passage prose</span><textarea id="passageBody" spellcheck="true">'+html(p.body||"")+'</textarea></label><p class="smallcopy">Write naturally. A passage may contain many prose paragraphs and dialogue, followed by its outgoing choices.</p><label class="field"><span>Author notes (not printed)</span><textarea class="notes" id="passageNotes">'+html(p.notes||"")+'</textarea></label><div class="section-title"><strong>Outgoing connections ('+p.edges.length+')</strong><button id="addEdge">+ Choice / link</button></div><div id="edgeList">'+p.edges.map((edge,i)=>edgeEditor(edge,i)).join("")+'</div><div class="notice">'+(p.id===doc.start?"This is the designated reader opening. ":"")+'A mark-conditioned gateway routes automatically in reader mode. Link labels and numeric page addresses are separate from internal IDs.</div><div class="section-title"><strong>Reader test</strong><button id="readFrom">▶ Read from here</button></div><button class="secondary-button" id="removePassage" '+(p.id===doc.start?"disabled":"")+'>Delete this passage</button></div>';
 function binding(input,key){$(input).addEventListener("input",e=>{p[key]=e.target.value;persist();});$(input).addEventListener("change",render);}
 binding("passageTitle","title");binding("passageBody","body");binding("passageNotes","notes");
 $("passageStatus").addEventListener("change",e=>{p.status=e.target.value;persist();render();});
 $("addEdge").addEventListener("click",()=>addEdge(p));
 $("readFrom").addEventListener("click",()=>play(p.id));
 $("removePassage").addEventListener("click",()=>removePassage(p.id));
 area.querySelectorAll("[data-edge-index]").forEach(row=>{
  const edge=p.edges[Number(row.dataset.edgeIndex)];
  row.querySelector(".edge-label").addEventListener("input",e=>{edge.label=e.target.value;persist();});
  row.querySelector(".edge-destination").addEventListener("change",e=>{edge.to=e.target.value;persist();render();});
  row.querySelector(".edge-mark").addEventListener("change",e=>{
   const val=e.target.value;delete edge.setMark;delete edge.requiresMark;
   if(val.startsWith("set:"))edge.setMark=val.slice(4);
   if(val.startsWith("require:"))edge.requiresMark=val.slice(8);
   persist();render();
  });
  row.querySelector(".remove").addEventListener("click",()=>{p.edges.splice(Number(row.dataset.edgeIndex),1);persist();render();});
 });
}
function edgeEditor(edge,i){
 const marker=edge.setMark?"set:"+edge.setMark:edge.requiresMark?"require:"+edge.requiresMark:"";
 const options=[["","Ordinary link"],...Object.keys(MARKS).map(m=>["set:"+m,"Choose mark: "+MARKS[m]]),...Object.keys(MARKS).map(m=>["require:"+m,"Require mark: "+MARKS[m]])];
 return '<div class="edge-edit" data-edge-index="'+i+'"><div class="fields"><small>'+html(edge.id)+'</small><input class="edge-label" aria-label="Choice label" placeholder="Continue / choice text" value="'+html(edge.label||"")+'"><select class="edge-destination" aria-label="Destination">'+doc.passages.map(q=>'<option value="'+html(q.id)+'"'+(edge.to===q.id?" selected":"")+'>'+html(q.id+" · "+q.title)+'</option>').join("")+'</select><select class="edge-mark" aria-label="Mark behaviour">'+options.map(item=>'<option value="'+item[0]+'"'+(marker===item[0]?" selected":"")+'>'+html(item[1])+"</option>").join("")+"</select></div><button class=\"remove\" aria-label=\"Remove connection\">×</button></div>";
}
function render(){renderOutline();renderWorld();renderInspector();renderOverview();}
function beginDrag(event,type,id){
 if(event.button!==0)return;
 if(event.target.closest("button"))return;
 event.preventDefault();event.stopPropagation();
 const object=type==="scene"?scene(id):passage(id);
 drag={type,id,x:event.clientX,y:event.clientY,baseX:Number(object.x)||0,baseY:Number(object.y)||0,moved:false};
 window.addEventListener("pointermove",onDrag);
 window.addEventListener("pointerup",endDrag,{once:true});
 if(type==="scene"){selection={type,id};renderInspector();renderOutline();}
}
function onDrag(event){
 if(!drag)return;
 const object=drag.type==="scene"?scene(drag.id):passage(drag.id);
 if(!object)return;
 const dx=(event.clientX-drag.x)/view.z,dy=(event.clientY-drag.y)/view.z;
 if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
 object.x=Math.round(Math.max(0,drag.baseX+dx));object.y=Math.round(Math.max(0,drag.baseY+dy));
 renderWorld();
}
function endDrag(){window.removeEventListener("pointermove",onDrag);if(drag?.moved)persist();drag=null;render();}
function transform(){const root=$("world");root.style.transform="translate("+view.x+"px,"+view.y+"px) scale("+view.z+")";$("zoomLabel").textContent=Math.round(view.z*100)+"%";}
function zoomAt(factor,x,y){const next=Math.max(.2,Math.min(1.6,view.z*factor)),ratio=next/view.z;view.x=x-(x-view.x)*ratio;view.y=y-(y-view.y)*ratio;view.z=next;transform();}
function focusScene(id){const s=scene(id),rect=$("viewport").getBoundingClientRect();if(!s)return;view.z=Math.min(.9,(rect.width-80)/(s.collapsed?370:s.w+200),(rect.height-110)/(s.collapsed?350:s.h+130));view.z=Math.max(.32,view.z);view.x=rect.width/2-(s.x+(s.collapsed?125:s.w/2))*view.z;view.y=rect.height/2-(s.y+(s.collapsed?67:s.h/2))*view.z;transform();}
function fitAll(){const rect=$("viewport").getBoundingClientRect(),z=Math.max(.2,Math.min(.7,(rect.width-55)/3900,(rect.height-110)/1010));view.z=z;view.x=(rect.width-3900*z)/2;view.y=(rect.height-1030*z)/2-110*z;transform();}
function addScene(actId){
 const title=prompt("Name the new scene:","Untitled scene");if(title===null)return;
 const a=typeof actId==="string"?actId:selection?.type==="scene"?scene(selection.id)?.act:selection?.type==="passage"?scene(passage(selection.id)?.scene)?.act:"a1";
 doc.sceneSequence=(doc.sceneSequence||doc.scenes.length)+1;
 const id="s-custom-"+doc.sceneSequence, actObj=act(a)||doc.acts[0];
 const s={id,act:actObj.id,title:title.trim()||"Untitled scene",x:actObj.x+120,y:actObj.y+250,w:340,h:330,collapsed:false,notes:""};
 doc.scenes.push(s);persist();enterScene(id);toast("Scene added");
}
function addPassage(sceneId){
 const s=scene(typeof sceneId==="string"?sceneId:selection?.type==="scene"?selection.id:selection?.type==="passage"?passage(selection.id)?.scene:activeSceneId||"s-opening")||doc.scenes[0];
 doc.sequence=Math.max(doc.sequence||0,...doc.passages.map(p=>Number(p.id.replace("P-",""))||0))+1;
 const id="P-"+String(doc.sequence).padStart(4,"0"),count=doc.passages.filter(p=>p.scene===s.id).length;
 const y=80+count*160;s.h=Math.max(s.h,y+190);s.w=Math.max(s.w,320);s.collapsed=false;
 doc.passages.push({id,scene:s.id,title:"Untitled passage",body:"",status:"planned",notes:"",kind:"passage",x:27,y,edges:[]});
 persist();enterScene(s.id);sel("passage",id);toast("Passage added");
}
function addEdge(p){
 const target=doc.passages.find(q=>q.id!==p.id);if(!target){toast("Add another passage before linking");return;}
 doc.edgeSequence=(doc.edgeSequence||0)+1;
 p.edges.push({id:"E-"+String(doc.edgeSequence).padStart(3,"0"),to:target.id,label:"Continue"});
 persist();render();toast("New connection added — choose its destination");
}
function removePassage(id){
 if(id===doc.start||!confirm("Delete "+id+" and remove all incoming links to it? This cannot be undone except by importing a backup."))return;
 doc.passages=doc.passages.filter(p=>p.id!==id);
 for(const p of doc.passages)p.edges=p.edges.filter(e=>e.to!==id);
 selection=null;persist();render();toast("Passage deleted");
}
function validate(){
 const issues=[],all=new Set(),sceneIds=new Set(doc.scenes.map(s=>s.id));
 for(const p of doc.passages){
  if(all.has(p.id))issues.push("Duplicate passage ID: "+p.id);all.add(p.id);
  if(!sceneIds.has(p.scene))issues.push(p.id+": scene is missing");
  if(!["planned","draft","reviewed"].includes(p.status))issues.push(p.id+": unknown status");
  if(!p.body.trim()||p.body.includes("[UNWRITTEN"))issues.push(p.id+": prose not written");
  for(const edge of p.edges){
   if(!passage(edge.to))issues.push(p.id+": broken destination "+edge.to);
   if(edge.setMark&&!MARKS[edge.setMark])issues.push(p.id+": invalid assigned mark");
   if(edge.requiresMark&&!MARKS[edge.requiresMark])issues.push(p.id+": invalid required mark");
  }
 }
 const seen=new Set(),queue=[doc.start];while(queue.length){const id=queue.shift();if(seen.has(id)||!passage(id))continue;seen.add(id);for(const e of passage(id).edges)queue.push(e.to);}
 for(const p of doc.passages){if(!seen.has(p.id))issues.push(p.id+": unreachable from opening");}
 for(const p of doc.passages){if(p.kind==="gateway"){for(const mark of Object.keys(MARKS)){if(p.edges.filter(e=>e.requiresMark===mark).length!==1)issues.push(p.id+": "+mark+" must have exactly one gated destination");}}}
 if(!passage(doc.start))issues.unshift("Designated start passage is missing");
 let cycles=0;const active=new Set(),done=new Set();
 function dfs(id){if(active.has(id)){cycles++;return;}if(done.has(id)||!passage(id))return;active.add(id);for(const e of passage(id).edges)dfs(e.to);active.delete(id);done.add(id);}
 dfs(doc.start);if(cycles)issues.push(cycles+" possible directed cycles — review intended exits");
 return {issues,seen:seen.size,total:doc.passages.length,broken:issues.filter(x=>x.includes("broken")||x.includes("missing")||x.includes("unreachable")).length};
}
function audit(){
 const result=validate(),list=result.issues.length?'<ul class="audit-list">'+result.issues.map(x=>'<li class="'+(x.includes("unwritten")||x.includes("prose")?"warn":"")+'">'+html(x)+"</li>").join("")+"</ul>":'<p class="pass">No issues found in this small graph.</p>';
 showDialog('<h2>Manuscript integrity check</h2><p>'+result.seen+'/'+result.total+' passages reachable from the opening. '+result.broken+' structural warnings. '+result.issues.length+' total notices (including planned prose).</p>'+list+'<p>This is a light PoC audit, not yet exhaustive verification of mark-specific evidence, protected numerical jumps, or publication layout.</p>');
}
function showDialog(content){$("modalRoot").innerHTML='<div class="dialog-overlay"><div class="dialog" role="dialog" aria-modal="true">'+content+'<button id="closeDialog">Close</button></div></div>';$("closeDialog").addEventListener("click",()=>{$("modalRoot").innerHTML="";});}
function markArt(mark){if(mark==="digit")return '<span class="mark-art" aria-label="Single digit illustration">?</span>';if(mark==="knot")return '<span class="mark-art knot" aria-label="Interlocking form illustration">∞</span>';return '<span class="mark-art binomial" aria-label="Binomial symbol illustration">(ⁿₖ)</span>';}
function play(start){
 if(!passage(start)){toast("Missing reading start");return;}
 reading={id:start,mark:null,steps:0};renderReader();
}
function step(edge){
 if(!reading)return;
 if(edge.setMark)reading.mark=edge.setMark;
 reading.id=edge.to;reading.steps++;
 if(reading.steps>100){toast("Reading limit reached — possible loop");reading=null;$("modalRoot").innerHTML="";return;}
 renderReader();
}
function renderReader(){
 const p=passage(reading?.id);if(!p){showDialog("<h2>Broken link</h2><p>This destination has no authored passage.</p>");return;}
 let allowed=p.edges.filter(e=>!e.requiresMark||e.requiresMark===reading.mark);
 const isGate=p.kind==="gateway";
 let controls="";
 if(isGate&&!reading.mark){controls='<p class="reader-note">This gateway requires the wrist mark from the start of the book. Use “Read” from the opening for the full test.</p>';}
 else if(!allowed.length){controls='<p class="reader-note">'+(p.edges.length?"No valid outgoing connection for this reading state.":"End of currently authored route.")+'</p>';}
 else{
  controls='<div class="choices">'+allowed.map((e,i)=>'<button data-next="'+i+'">'+(e.setMark?markArt(e.setMark):"")+(html(e.label|| (e.setMark?"":isGate?"Continue to the assigned destination":"Continue"))||"")+'</button>').join("")+"</div>";
 }
 const placeholder=!p.body.trim()||p.body.includes("[UNWRITTEN");
 $("modalRoot").innerHTML='<div class="play-overlay"><div class="reader" role="dialog" aria-modal="true"><div class="reader-top"><span>ZETA · READER PROTOTYPE '+html(p.id)+'</span><button id="closeReader">✕ Return to studio</button></div><h1>'+html(p.title)+'</h1><div class="manuscript">'+html(p.body||"[This passage has not yet been written.]")+'</div>'+(placeholder?'<p class="reader-note">Draft placeholder — not published prose.</p>':"")+controls+'<p class="reader-note" style="margin-top:28px">Internal passage IDs shown for author testing only. Draft page destinations are not assigned.</p></div></div>';
 $("closeReader").addEventListener("click",()=>{reading=null;$("modalRoot").innerHTML="";});
 $("modalRoot").querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>step(allowed[Number(b.dataset.next)])));
}
function exportData(){
 const blob=new Blob([JSON.stringify(doc,null,2)+"\n"],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="zeta-manuscript-w004-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Manuscript snapshot exported");
}
function importData(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{
 try{const parsed=JSON.parse(String(reader.result));if(!valid(parsed))throw Error("Unrecognised studio JSON version/schema");
  if(!confirm("Import this manuscript? It will replace the current browser copy. Export a backup first if needed."))return;
  doc=parsed;selection=null;activeSceneId=null;persist();render();toast("Manuscript imported");
 }catch(err){alert("Import failed: "+err.message);}
 };reader.readAsText(file);}
function install(){
 $("addSceneBtn").addEventListener("click",addScene);
 $("addPassageBtn").addEventListener("click",()=>addPassage());
 $("playBtn").addEventListener("click",()=>play(doc.start));
 $("auditBtn").addEventListener("click",audit);
 $("exportBtn").addEventListener("click",exportData);
 $("importBtn").addEventListener("click",()=>$("importFile").click());
 $("importFile").addEventListener("change",e=>{importData(e.target.files[0]);e.target.value="";});
 $("zoomInBtn").addEventListener("click",()=>{const r=$("viewport").getBoundingClientRect();zoomAt(1.25,r.width/2,r.height/2);});
 $("zoomOutBtn").addEventListener("click",()=>{const r=$("viewport").getBoundingClientRect();zoomAt(.8,r.width/2,r.height/2);});
 $("fitBtn").addEventListener("click",()=>{if(activeSceneId)focusScene(activeSceneId);else fitAll();});
 $("backBtn").addEventListener("click",backToOverview);
 const closeEditor=()=>{selection=null;render();};
 $("closeEditor").addEventListener("click",closeEditor);
 $("drawerBackdrop").addEventListener("click",closeEditor);
 const viewport=$("viewport");
 viewport.addEventListener("wheel",e=>{e.preventDefault();const r=viewport.getBoundingClientRect();zoomAt(e.deltaY<0?1.12:.89,e.clientX-r.left,e.clientY-r.top);},{passive:false});
 let pan=null;
 viewport.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest(".scene-frame")||e.target.closest(".node-card"))return;pan={x:e.clientX,y:e.clientY,startX:view.x,startY:view.y};viewport.classList.add("grabbing");viewport.setPointerCapture(e.pointerId);});
 viewport.addEventListener("pointermove",e=>{if(!pan)return;view.x=pan.startX+e.clientX-pan.x;view.y=pan.startY+e.clientY-pan.y;transform();});
 const release=()=>{pan=null;viewport.classList.remove("grabbing");};
 viewport.addEventListener("pointerup",release);viewport.addEventListener("pointercancel",release);
 window.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("modalRoot").innerHTML){$("modalRoot").innerHTML="";reading=null;}});
 render();persist();
}
install();
})();