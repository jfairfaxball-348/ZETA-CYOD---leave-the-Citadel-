const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dom = new JSDOM(source, {url:"https://studio.test/",pretendToBeVisual:true,runScripts:"outside-only"});
const { window: w } = dom;
w.requestAnimationFrame = fn => fn();
w.confirm = () => true;
w.prompt = () => "New test scene";
w.eval(fs.readFileSync(path.join(root, "app.js"), "utf8"));
const $ = selector => w.document.querySelector(selector);
function click(selector) {
  const element = $(selector);
  assert.ok(element, "Missing UI element: " + selector);
  element.click();
}
function chooseRoute(index, expected) {
  click("#playBtn");
  click(".choices button:nth-child(" + index + ")");
  click(".choices button");
  assert.match($(".reader h1").textContent, /Beyond the Citadel/);
  click(".choices button");
  assert.match($(".reader h1").textContent, /deferred gateway/);
  click(".choices button");
  assert.match($(".reader h1").textContent, expected);
  click("#closeReader");
}
assert.equal($(".overview").hidden, false, "Overview first");
assert.equal(w.document.querySelectorAll(".scene-tile").length, 6);
assert.equal(w.document.querySelectorAll(".act-column").length, 3);
assert.equal($("#viewport").hidden, true, "No graph complexity on entry");
chooseRoute(1, /number/i);
chooseRoute(2, /topology/i);
chooseRoute(3, /combinatorics/i);
click('[data-open-scene="s-opening"]');
assert.equal($("#viewport").hidden, false, "Scene opens graph");
assert.equal($(".overview").hidden, true);
assert.equal(w.document.querySelectorAll(".node-card").length, 4, "Only one expanded scene");
const first = $(".node-card");
first.dispatchEvent(new w.PointerEvent("pointerdown", {bubbles:true,button:0,clientX:100,clientY:100}));
assert.ok($("#passageTitle"), "Passage editor opens");
assert.ok(w.document.body.classList.contains("editor-open"));
const title = $("#passageTitle");
title.value = "Edited opening";
title.dispatchEvent(new w.Event("input", {bubbles:true}));
assert.match(w.localStorage.getItem("zeta-studio-w004-poc-v1"), /Edited opening/);
click("#closeEditor");
assert.ok(!w.document.body.classList.contains("editor-open"));
click("#addPassageBtn");
assert.match($("#passageTitle").value, /Untitled passage/);
click("#closeEditor");
click("#backBtn");
assert.equal($("#overview").hidden, false, "Returns to calm Act overview");
click("#auditBtn");
assert.ok($(".dialog"), "Graph audit available under More menu");
console.log("PASS: simple overview, scene drilldown, three mark routes, writing, autosave, add, audit");
