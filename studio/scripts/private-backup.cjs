"use strict";
// A second-provider JSON backup. Reads via Cloudflare's authenticated API;
// does not require direct database credentials or a SQL driver.
async function archive(env=process.env,fetcher=fetch){
 const needed=["STUDIO_URL","STUDIO_OWNER_TOKEN","GITHUB_BACKUP_TOKEN","GITHUB_BACKUP_REPO"];
 if(needed.some(key=>!env[key])){
  console.log("SKIP: independent private manuscript backup is not fully configured");
  return {skipped:true};
 }
 const dest=env.GITHUB_BACKUP_REPO;
 if(!/^[\w.-]+\/[\w.-]+$/.test(dest))throw Error("Invalid backup repository name");
 const api="https://api.github.com/repos/"+dest;
 const headers={Authorization:"Bearer "+env.GITHUB_BACKUP_TOKEN,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
 const meta=await fetcher(api,{headers});
 if(!meta.ok||(await meta.json()).private!==true)throw Error("Backup destination must exist and be private");
 const url=new URL(env.STUDIO_URL);
 if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash)throw Error("Invalid HTTPS studio URL");
 const studioHeaders={Authorization:"Bearer "+env.STUDIO_OWNER_TOKEN,Accept:"application/json"};
 if(env.CF_ACCESS_CLIENT_ID&&env.CF_ACCESS_CLIENT_SECRET){
  studioHeaders["CF-Access-Client-Id"]=env.CF_ACCESS_CLIENT_ID;
  studioHeaders["CF-Access-Client-Secret"]=env.CF_ACCESS_CLIENT_SECRET;
 }
 const copy=await fetcher(new URL("/api/manuscript",url).href,{headers:studioHeaders});
 if(!copy.ok)throw Error("Server manuscript backup fetch refused (HTTP "+copy.status+")");
 const latest=await copy.json();
 if(!Number.isSafeInteger(latest.revision)||latest.revision<1||
    !latest.document||typeof latest.document!=="object")throw Error("No confirmed manuscript revision to back up");
 const path="revisions/revision-"+String(latest.revision).padStart(8,"0")+".json";
 const target=api+"/contents/"+path,existing=await fetcher(target,{headers});
 if(existing.status===200){console.log("Private backup already contains revision",latest.revision);return {exists:true,revision:latest.revision};}
 if(existing.status!==404)throw Error("Unable to inspect destination path");
 const body=JSON.stringify({
  message:"Archive ZETA manuscript revision "+latest.revision,
  content:Buffer.from(JSON.stringify(latest.document,null,2)+"\n","utf8").toString("base64")
 });
 const put=await fetcher(target,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body});
 if(put.status!==201)throw Error("Private backup write failed (HTTP "+put.status+")");
 console.log("Private snapshot archived at revision",latest.revision);
 return {created:true,revision:latest.revision};
}
if(require.main===module)archive().catch(e=>{console.error("Backup failed:",e.message);process.exitCode=1;});
module.exports={archive};
