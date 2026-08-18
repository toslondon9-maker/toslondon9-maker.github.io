import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(siteRoot, "index.html");
const rscPath = path.join(siteRoot, "index.rsc");
const cssPath = path.join(siteRoot, "assets", "index-Bgwsdhov.css");

const preludeHtml = '<div class="journeyPrelude"><span aria-hidden="true">◇</span><h2>Where timeless wisdom meets modern <em>transformation.</em></h2><p>Inspired by <em>The Master Key System</em> and guided for today’s world, this journey helps you build <strong>clarity, focus, discipline and aligned action.</strong></p></div>';
const preludeRsc = ["$", "div", null, { className: "journeyPrelude", children: [
  ["$", "span", null, { "aria-hidden": "true", children: "◇" }],
  ["$", "h2", null, { children: ["Where timeless wisdom meets modern ", ["$", "em", null, { children: "transformation." }]] }],
  ["$", "p", null, { children: ["Inspired by ", ["$", "em", null, { children: "The Master Key System" }], " and guided for today’s world, this journey helps you build ", ["$", "strong", null, { children: "clarity, focus, discipline and aligned action." }]] }]
] }];

function findByClass(node, className) {
  if (!Array.isArray(node)) return null;
  if (node[3]?.className === className) return node;
  for (const child of node) {
    const found = findByClass(child, className);
    if (found) return found;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      for (const value of Object.values(child)) {
        const nested = findByClass(value, className);
        if (nested) return nested;
      }
    }
  }
  return null;
}

function escapeRscLine(line) {
  return `${line.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("&", "\\u0026").replaceAll("<", "\\u003c").replaceAll(">", "\\u003e")}\\n`;
}

let html = readFileSync(htmlPath, "utf8");
let rsc = readFileSync(rscPath, "utf8");
let css = readFileSync(cssPath, "utf8");

if (!html.includes('class="journeyPrelude"')) {
  const storyOpening = '<div class="heroJourneyStory">';
  if (!html.includes(storyOpening)) throw new Error("The homepage journey story was not found.");
  html = html.replace(storyOpening, `${storyOpening}${preludeHtml}`);
}

const rscLines = rsc.split(/\r?\n/);
const mainLineIndex = rscLines.findIndex((line) => line.startsWith("1:"));
if (mainLineIndex < 0) throw new Error("The homepage RSC record was not found.");
const oldMainLine = rscLines[mainLineIndex];
const mainPayload = JSON.parse(oldMainLine.slice(2));
const story = findByClass(mainPayload, "heroJourneyStory");
if (!story) throw new Error("The homepage journey story was not found in the RSC record.");
const storyChildren = story[3].children;
if (!storyChildren.some((child) => Array.isArray(child) && child[3]?.className === "journeyPrelude")) {
  storyChildren.unshift(preludeRsc);
}
const newMainLine = `1:${JSON.stringify(mainPayload)}`;
rscLines[mainLineIndex] = newMainLine;
rsc = rscLines.join("\n");

const oldEmbeddedLine = escapeRscLine(oldMainLine);
const newEmbeddedLine = escapeRscLine(newMainLine);
if (oldMainLine !== newMainLine) {
  if (!html.includes(oldEmbeddedLine)) throw new Error("The embedded homepage RSC record was not found.");
  html = html.replace(oldEmbeddedLine, newEmbeddedLine);
}

const cssMarker = "/* Homepage cream and navy message panels */";
if (!css.includes(cssMarker)) {
  css += `\n\n${cssMarker}\n.heroJourneyStory{display:flex;flex-direction:column}.journeyPrelude{margin-bottom:clamp(.75rem,1.7vw,1.15rem);padding:clamp(1.35rem,3vw,2.55rem);text-align:center;background:radial-gradient(circle at 50% 0,#fffdf8,#f5efe3 75%);color:#0b1624;border:1px solid rgba(190,139,61,.5);border-radius:3.5rem 3.5rem 0 0;box-shadow:0 16px 42px rgba(14,24,34,.12)}.journeyPrelude>span{display:flex;align-items:center;justify-content:center;gap:.8rem;color:#c19350;font-size:1.55rem}.journeyPrelude>span:before,.journeyPrelude>span:after{content:"";width:min(28%,8rem);height:1px;background:linear-gradient(90deg,transparent,#c19350)}.journeyPrelude>span:after{background:linear-gradient(90deg,#c19350,transparent)}.journeyPrelude h2{max-width:650px;margin:.45rem auto 1rem;color:#0b1624;font-size:clamp(1.55rem,2.9vw,2.8rem);line-height:1.08}.journeyPrelude h2 em{color:#b8843e;font-style:normal}.journeyPrelude p{max-width:590px;margin:0 auto;color:#475463;font-size:clamp(.76rem,1.12vw,.98rem);line-height:1.6}.journeyPrelude p em{font-family:Georgia,serif}.journeyPrelude p strong{color:#a87837}.journeyPortraitGrid{order:2}.journeyPrelude{order:1}.journeyMessage{order:3}@media(max-width:480px){.journeyPrelude{border-radius:2rem 2rem 0 0;padding:1.25rem .9rem}.journeyPrelude h2{font-size:1.45rem}.journeyPrelude p{font-size:.76rem}}\n`;
}

writeFileSync(htmlPath, html);
writeFileSync(rscPath, rsc);
writeFileSync(cssPath, css);
