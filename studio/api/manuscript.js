"use strict";
const {processRequest,HttpError}=require("../lib/manuscript.cjs");
const createRepository=require("../lib/repository.cjs");

module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","private, no-store, max-age=0");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.setHeader("Referrer-Policy","no-referrer");
 res.setHeader("Vary","Authorization");
 let repo;
 try{
  // Validate auth and configured owner credentials before initiating database access.
  if(process.env.DATABASE_URL)repo=createRepository();
  const response=await processRequest(req,repo,process.env);
  res.status(200).json(response);
 }catch(e){
  const known=e instanceof HttpError;
  // Do not return unpublished prose, database errors, access key or stack traces.
  res.status(known?e.status:503).json({error:known?e.code:"STORAGE_UNAVAILABLE"});
 }finally{if(repo)try{await repo.close();}catch{}}
};
