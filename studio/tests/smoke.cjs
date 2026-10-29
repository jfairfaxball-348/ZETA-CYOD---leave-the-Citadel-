const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dom = new JSDOM(source, {
  url: "https://studio.test/",
  pretendToBeVisual: true,
  runScripts: "outside-only",
});
const { window: w } = dom;
w.requestAnimationFrame = (fn) => fn();
w.confirm = () => true;
w.prompt = () => "New test scene";
w.eval(fs.readFileSync(path.join(root, "app.js"), "utf8"));

const $ = (selector) => w.document.querySelector(selector);
function click(selector) {
  const element = $(selector);
  assert.ok(element, "Missing UI element: " + selector);
  element.click();
}
function chooseRoute(index,expected){
  click("#playBtn");
  click(".choices button:nth-child("+index+")");
  click(".choices button");
  assert.match($(".reader h1").textContent, /Beyond the Citadel/);
  click(".choices button");
  assert.match($(".reader h1").textContent, /deferred gateway/);
  click(".choices button");
  assert.match($(".reader h1").textContent, expected);
  click("#closeReader");
}
assert.equal(w.document.querySelectorAll(".scene-frame").length,6);
assert.equal(w.document.querySelectorAll(".node-card").length,6);
chooseRoute(1,/number/i);
chooseRoute(2,/topology/i);
chooseRoute(3,/combinatorics/i);
click('[data-focus="s-opening"]');
const first = $(".node-card");
first.dispatchEvent(new w.PointerEvent("pointerdown", { bubbles:true, button:0, clientX:100, clientY:100 }));
assert.ok($("#passageTitle"),"Editor should open on passage selection");
const title=$("#passageTitle");
title.value="Edited opening";
title.dispatchEvent(new w.Event("input", { bubbles:true }));
assert.match(w.localStorage.getItem("zeta-studio-w004-poc-v1"),/Edited opening/);
click("#addPassageBtn");
assert.match($("#passageTitle").value,/Untitled passage/);
click("#auditBtn");
assert.ok($(".dialog"),"Graph audit should open");
console.log("PASS: canvas groups, three deferred-mark paths, editor, browser autosave, passage creation, audit");
