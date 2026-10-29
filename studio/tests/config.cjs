"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const dir=path.resolve(__dirname,"..");

test("Cloudflare Preview configuration exists and targets existing Worker",()=>{
 const config=JSON.parse(fs.readFileSync(path.join(dir,"wrangler.jsonc"),"utf8"));
 assert.equal(config.name,"zeta-cyod---leave-the-citadel");
 assert.deepEqual(config.previews,{},"Preview builds require an explicit previews block");
 assert.equal(config.main,"src/worker.mjs");
 assert.equal(config.assets.directory,"./dist");
 assert.equal(config.assets.binding,"ASSETS");
 assert.ok(config.assets.run_worker_first.includes("/api/*"));
 assert.equal(config.d1_databases[0].binding,"DB");
 assert.equal(config.d1_databases[0].database_name,"zeta-manuscript");
 assert.match(config.d1_databases[0].database_id,/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i);
 assert.notEqual(config.d1_databases[0].database_id,"00000000-0000-0000-0000-000000000000");
 assert.equal(config.previews.d1_databases,undefined,"Previews must not inherit the production manuscript database");
});
