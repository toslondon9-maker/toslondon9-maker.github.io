import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceImage = process.argv[2];
if (!sourceImage || !existsSync(sourceImage)) throw new Error("Pass the existing source JPEG as the first argument.");

const htmlPath = path.join(siteRoot, "index.html");
const rscPath = path.join(siteRoot, "index.rsc");
const cssPath = path.join(siteRoot, "assets", "index-Bgwsdhov.css");
const destinationImage = path.join(siteRoot, "images", "haanel-tariq-portraits.jpeg");

const visualHtml = '<div class="heroJourneyStory"><div class="journeyPortraitGrid"><article class="journeyPortraitCard"><div class="journeyPortraitCrop journeyPortraitHaanel"><img src="/images/haanel-tariq-portraits.jpeg" alt="Charles F. Haanel, original author of The Master Key System" width="1080" height="806" decoding="async"/></div><div class="journeyPortraitCopy"><span>THE ORIGINS</span><h3 class="journeyName">Charles F. Haanel</h3><p class="journeyRole">Visionary. Author. Teacher.</p><p>Original author of <em>The Master Key System</em>—a timeless path to personal freedom and higher achievement.</p></div></article><article class="journeyPortraitCard"><div class="journeyPortraitCrop journeyPortraitTariq"><img src="/images/haanel-tariq-portraits.jpeg" alt="Tariq Saddique, independent Master Key System inspired coach" width="1080" height="806" decoding="async"/></div><div class="journeyPortraitCopy"><span>YOUR MENTOR</span><h3 class="journeyName">Tariq Saddique</h3><p class="journeyRole">System Coach. Guide. Builder.</p><p>Independent modern coaching that turns insight into results and purpose into meaningful action.</p></div></article></div><div class="journeyMessage"><span aria-hidden="true">◇</span><h2>From inner mastery to <em>purposeful action.</em></h2><p>Timeless wisdom. Focused practice. Modern coaching. Step into a journey that helps you think clearly, act deliberately, and live with purpose.</p><small>An independent coaching experience inspired by <em>The Master Key System</em>.</small></div></div>';

const portraitImage = (alt, cropClass) => ["$", "div", null, { className: `journeyPortraitCrop ${cropClass}`, children: ["$", "img", null, { src: "/images/haanel-tariq-portraits.jpeg", alt, width: 1080, height: 806, decoding: "async" }] }];
const portraitCard = ({ cropClass, alt, label, name, role, description }) => ["$", "article", null, { className: "journeyPortraitCard", children: [portraitImage(alt, cropClass), ["$", "div", null, { className: "journeyPortraitCopy", children: [["$", "span", null, { children: label }], ["$", "h3", null, { className: "journeyName", children: name }], ["$", "p", null, { className: "journeyRole", children: role }], ["$", "p", null, { children: description }]] }]] }];

const visualRsc = ["$", "div", null, { className: "heroJourneyStory", children: [
  ["$", "div", null, { className: "journeyPortraitGrid", children: [
    portraitCard({ cropClass: "journeyPortraitHaanel", alt: "Charles F. Haanel, original author of The Master Key System", label: "THE ORIGINS", name: "Charles F. Haanel", role: "Visionary. Author. Teacher.", description: ["Original author of ", ["$", "em", null, { children: "The Master Key System" }], "—a timeless path to personal freedom and higher achievement."] }),
    portraitCard({ cropClass: "journeyPortraitTariq", alt: "Tariq Saddique, independent Master Key System inspired coach", label: "YOUR MENTOR", name: "Tariq Saddique", role: "System Coach. Guide. Builder.", description: "Independent modern coaching that turns insight into results and purpose into meaningful action." })
  ] }],
  ["$", "div", null, { className: "journeyMessage", children: [
    ["$", "span", null, { "aria-hidden": "true", children: "◇" }],
    ["$", "h2", null, { children: ["From inner mastery to ", ["$", "em", null, { children: "purposeful action." }]] }],
    ["$", "p", null, { children: "Timeless wisdom. Focused practice. Modern coaching. Step into a journey that helps you think clearly, act deliberately, and live with purpose." }],
    ["$", "small", null, { children: ["An independent coaching experience inspired by ", ["$", "em", null, { children: "The Master Key System" }], "."] }]
  ] }]
] }];

function replaceHeroVisual(node) {
  if (!Array.isArray(node)) return false;
  for (let index = 0; index < node.length; index += 1) {
    const child = node[index];
    const className = Array.isArray(child) ? child[3]?.className : null;
    if (className === "heroVisual dualPortraits" || className === "heroJourneyVisual") {
      node[index] = visualRsc;
      return true;
    }
    if (replaceHeroVisual(child)) return true;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      for (const value of Object.values(child)) if (replaceHeroVisual(value)) return true;
    }
  }
  return false;
}

function escapeRscLine(line) {
  return `${line.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("&", "\\u0026").replaceAll("<", "\\u003c").replaceAll(">", "\\u003e")}\\n`;
}

let html = readFileSync(htmlPath, "utf8");
let rsc = readFileSync(rscPath, "utf8");
let css = readFileSync(cssPath, "utf8");

const candidateStarts = [html.indexOf('<div class="heroVisual dualPortraits">'), html.indexOf('<figure class="heroJourneyVisual">')].filter((index) => index >= 0);
const visualStart = Math.min(...candidateStarts);
const heroEnd = html.indexOf('</section><section class="principle">', visualStart);
if (!Number.isFinite(visualStart) || heroEnd < 0) throw new Error("The existing homepage visual was not found.");
html = `${html.slice(0, visualStart)}${visualHtml}${html.slice(heroEnd)}`;

html = html.replace('<link rel="preload" href="/images/homepage-master-key-journey.png" as="image"/>', "");
const preload = '<link rel="preload" href="/images/haanel-tariq-portraits.jpeg" as="image"/>';
if (!html.includes(preload)) html = html.replace('<link rel="preload" href="/images/master-key-wisdom.png" as="image"/>', `$&${preload}`);

const rscLines = rsc.split(/\r?\n/);
const mainLineIndex = rscLines.findIndex((line) => line.startsWith("1:"));
if (mainLineIndex < 0) throw new Error("The homepage RSC record was not found.");
const oldMainLine = rscLines[mainLineIndex];
const mainPayload = JSON.parse(oldMainLine.slice(2));
if (!replaceHeroVisual(mainPayload)) throw new Error("The existing homepage visual was not found in the RSC record.");
const newMainLine = `1:${JSON.stringify(mainPayload)}`;
rscLines[mainLineIndex] = newMainLine;
rsc = rscLines.join("\n");

const oldEmbeddedLine = escapeRscLine(oldMainLine);
const newEmbeddedLine = escapeRscLine(newMainLine);
if (!html.includes(oldEmbeddedLine)) throw new Error("The embedded homepage RSC record was not found.");
html = html.replace(oldEmbeddedLine, newEmbeddedLine);

css = css.replace(/\n*\/\* Combined homepage journey visual \*\/[\s\S]*$/, "");
css += '\n\n/* Responsive Haanel and Tariq journey story */\n.heroJourneyStory{width:min(100%,720px);min-width:0;margin:0;justify-self:center}.journeyPortraitGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(.55rem,1.5vw,1rem)}.journeyPortraitCard{min-width:0;overflow:hidden;background:#071525;color:#fff;border:1px solid rgba(190,139,61,.68);box-shadow:0 20px 55px rgba(14,24,34,.2)}.journeyPortraitCrop{position:relative;overflow:hidden;aspect-ratio:1.28/1;background:#e8dfcf}.journeyPortraitCrop img{display:block;width:216%;max-width:none;height:auto;transform:translateX(-2.8%)}.journeyPortraitTariq img{transform:translateX(-50.9%)}.journeyPortraitCopy{padding:clamp(.75rem,1.7vw,1.2rem);text-align:center}.journeyPortraitCopy>span{display:inline-block;padding:.42rem clamp(.55rem,1.5vw,1rem);margin-top:-2rem;background:linear-gradient(90deg,#d6a959,#f0cf85,#c8913c);color:#102033;font-size:clamp(.55rem,.8vw,.72rem);font-weight:800;letter-spacing:.08em;position:relative}.journeyName{margin:.85rem 0 .35rem;color:#fff;font-family:Georgia,serif;font-size:clamp(.83rem,1.45vw,1.35rem);line-height:1;white-space:nowrap}.journeyRole{min-height:2.4em;margin:.25rem 0 .7rem;color:#dca94f!important;font-weight:700;font-size:clamp(.66rem,1vw,.88rem);line-height:1.25}.journeyPortraitCopy>p:last-child{margin:0;color:#d9e0e5;font-size:clamp(.65rem,.92vw,.82rem);line-height:1.45}.journeyMessage{margin-top:clamp(.75rem,1.7vw,1.15rem);padding:clamp(1.3rem,3vw,2.4rem);text-align:center;background:radial-gradient(circle at 50% 0,#102c46,#071525 70%);color:#fff;border:1px solid rgba(190,139,61,.5);border-radius:0 0 3.5rem 3.5rem}.journeyMessage>span{color:#d8a347;font-size:1.5rem}.journeyMessage h2{margin:.35rem auto .85rem;color:#fff;font-size:clamp(1.45rem,2.8vw,2.65rem);line-height:1.08}.journeyMessage h2 em{display:block;color:#e2ae50}.journeyMessage p{max-width:580px;margin:0 auto 1rem;color:#e4e8ec;line-height:1.55;font-size:clamp(.75rem,1.15vw,.95rem)}.journeyMessage small{display:block;padding-top:.85rem;border-top:1px solid rgba(218,166,75,.72);color:#e2ae50;font-family:Georgia,serif;font-style:italic;font-size:clamp(.72rem,1.12vw,.94rem);letter-spacing:.04em}@media(max-width:1080px){.heroJourneyStory{width:min(100%,760px);margin:0 auto}}@media(max-width:480px){.journeyPortraitGrid{gap:.45rem}.journeyPortraitCopy{padding:.65rem .35rem}.journeyPortraitCopy>span{padding:.35rem .45rem}.journeyPortraitCopy>p:last-child{font-size:.62rem}.journeyMessage{border-radius:0 0 2rem 2rem}}@media(max-width:340px){.journeyPortraitGrid{grid-template-columns:1fr}.journeyName{font-size:1.2rem}.journeyPortraitCopy>p:last-child{font-size:.78rem}}\n';

copyFileSync(sourceImage, destinationImage);
writeFileSync(htmlPath, html);
writeFileSync(rscPath, rsc);
writeFileSync(cssPath, css);
