"use strict";
const fs=require("node:fs"),path=require("node:path");
const base=path.resolve(__dirname,".."),output=path.join(base,"dist");
fs.mkdirSync(output,{recursive:true});
for(const file of ["index.html","app.js","cloud.js","styles.css"]){
 fs.copyFileSync(path.join(base,file),path.join(output,file));
}
console.log("Built four public assets; manuscripts, server source and credentials are excluded.");
