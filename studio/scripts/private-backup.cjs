"use strict";
const {Pool}=require("@neondatabase/serverless");
async function archive(env=process.env,fetcher=fetch){
 if(["DATABASE_URL","GITHUB_BACKUP_TOKEN","GITHUB_BACKUP_REPO"].some(k=>!env[k])){
  console.log("SKIP: independent backup is not configured");return {skipped:true};
 }
 const dest=env.GITHUB_BACKUP_REPO;
 if(!/^[\w.-]+\/[\w.-]+$/.test(dest))throw Error("Invalid backup repository");
 const api="https://api.github.com/repos/"+dest;
 const headers={Authorization:"Bearer "+env.GITHUB_BACKUP_TOKEN,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
 const meta=await fetcher(api,{headers});
 if(!meta.ok||(await meta.json()).private!==true)throw Error("Backup repository must exist and be private");
 const pool=new Pool({connectionString:env.DATABASE_URL});let row;
 try{
  row=(await pool.query("SELECT revision,document FROM zeta_manuscript WHERE id=$1",["book-one"])).rows[0];
  if(!row)throw Error("No source manuscript exists");
 }finally{await pool.end();}
 const path="revisions/revision-"+String(row.revision).padStart(8,"0")+".json",url=api+"/contents/"+path;
 const existing=await fetcher(url,{headers});
 if(existing.status===200){console.log("Revision already backed up:",Number(row.revision));return {exists:true};}
 if(existing.status!==404)throw Error("Backup path check failed");
 const content=Buffer.from(JSON.stringify(row.document,null,2)+"\n","utf8").toString("base64");
 const res=await fetcher(url,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify({message:"Archive ZETA manuscript revision "+row.revision,content})});
 if(res.status!==201)throw Error("Backup write rejected: "+res.status);
 console.log("Archived revision:",Number(row.revision));return {created:true};
}
if(require.main===module)archive().catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={archive};
