"use strict";
const {processRequest,HttpError}=require("../lib/manuscript.cjs");
const repository=require("../lib/repository.cjs");

module.exports=async function handler(req,res) {
  res.setHeader("Cache-Control","private, no-store, max-age=0");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("Vary","Authorization");
  try {
    const response=await processRequest(req,repository,process.env);
    res.status(200).json(response);
  } catch(err) {
    const known=err instanceof HttpError;
    // No unpublished manuscript, token or database details are logged or reflected.
    res.status(known ? err.status : 503).json({error:known?err.code:"STORAGE_UNAVAILABLE"});
  }
};
