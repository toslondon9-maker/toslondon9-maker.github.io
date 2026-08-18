import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(siteRoot, "index.html");
const rscPath = path.join(siteRoot, "index.rsc");
const cssPath = path.join(siteRoot, "assets", "index-Bgwsdhov.css");
const legacyRanges = [["Weeks 5–9", "Weeks 5–11"], ["Weeks 10–18", "Weeks 12–18"]];

const valueHtml = '<article class="programmeValueCard" data-offer="complete"><div><p class="eyebrow">BEST COMPLETE VALUE</p><h3>Complete 24-Week Programme</h3><p>Experience the full progressive journey with every stage working together.</p></div><div class="programmeCompletePrice"><span>Founding member investment</span><strong>£997</strong></div><div class="programmeSavings"><p>Four stages separately: <b>£1,188</b> <em>Save £191</em></p><p>Full combined MSRP: <b>£1,788</b> <em>Save £791</em></p></div><strong class="programmeDiscount">44% off full MSRP</strong><a class="primary full" href="mailto:toslondon9@gmail.com?subject=Complete%2024-Week%20Master%20Key%20Programme&amp;body=Hello%20Tariq%2C%0A%0AI%27m%20interested%20in%20the%20complete%2024-week%20programme%20at%20%C2%A3997.%0A%0AMy%20main%20goal%20is%3A%20">Choose the Complete Journey →</a></article>';

const valueRsc = ["$", "article", null, { className: "programmeValueCard", "data-offer": "complete", children: [
  ["$", "div", null, { children: [
    ["$", "p", null, { className: "eyebrow", children: "BEST COMPLETE VALUE" }],
    ["$", "h3", null, { children: "Complete 24-Week Programme" }],
    ["$", "p", null, { children: "Experience the full progressive journey with every stage working together." }],
  ] }],
  ["$", "div", null, { className: "programmeCompletePrice", children: [
    ["$", "span", null, { children: "Founding member investment" }],
    ["$", "strong", null, { children: "£997" }],
  ] }],
  ["$", "div", null, { className: "programmeSavings", children: [
    ["$", "p", null, { children: ["Four stages separately: ", ["$", "b", null, { children: "£1,188" }], " ", ["$", "em", null, { children: "Save £191" }]] }],
    ["$", "p", null, { children: ["Full combined MSRP: ", ["$", "b", null, { children: "£1,788" }], " ", ["$", "em", null, { children: "Save £791" }]] }],
  ] }],
  ["$", "strong", null, { className: "programmeDiscount", children: "44% off full MSRP" }],
  ["$", "a", null, { className: "primary full", href: "mailto:toslondon9@gmail.com?subject=Complete%2024-Week%20Master%20Key%20Programme&body=Hello%20Tariq%2C%0A%0AI%27m%20interested%20in%20the%20complete%2024-week%20programme%20at%20%C2%A3997.%0A%0AMy%20main%20goal%20is%3A%20", children: "Choose the Complete Journey →" }],
] }];

const valueCss = `

/* Complete programme value comparison */
.programmeValueCard{display:grid;grid-template-columns:minmax(240px,1.35fr) minmax(170px,.55fr) minmax(230px,1fr) auto;gap:clamp(1rem,2.5vw,2rem);align-items:center;margin-top:1.25rem;padding:clamp(1.35rem,3vw,2.25rem);background:linear-gradient(135deg,#f8f2e7,#efe2c8);color:#0d1b2a;border:2px solid #b88332;box-shadow:0 20px 50px rgba(13,27,42,.14)}.programmeValueCard h3{margin:.3rem 0 .45rem;font-family:Georgia,serif;font-size:clamp(1.6rem,2.5vw,2.5rem);color:#0d1b2a}.programmeValueCard>div:first-child>p:last-child{margin:0;color:#56616b;line-height:1.55}.programmeCompletePrice{display:flex;flex-direction:column;text-align:center}.programmeCompletePrice span{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#78613c}.programmeCompletePrice strong{font-family:Georgia,serif;font-size:clamp(3rem,5vw,4.75rem);line-height:1;color:#9a6823}.programmeSavings{display:grid;gap:.55rem}.programmeSavings p{margin:0;color:#394653}.programmeSavings b{color:#0d1b2a}.programmeSavings em{display:block;margin-top:.1rem;color:#8a5d21;font-style:normal;font-weight:800}.programmeDiscount{justify-self:center;padding:.65rem .8rem;text-align:center;background:#071525;color:#e8c377;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}.programmeValueCard .primary{grid-column:1/-1;text-align:center}@media(max-width:900px){.programmeValueCard{grid-template-columns:1fr 1fr}.programmeValueCard>div:first-child{grid-column:1/-1}.programmeDiscount{justify-self:stretch}}@media(max-width:560px){.programmeValueCard{grid-template-columns:1fr;text-align:center}.programmeValueCard>div:first-child,.programmeValueCard .primary{grid-column:1}.programmeSavings{padding-top:.85rem;border-top:1px solid rgba(184,131,50,.38)}}
`;

function findByClass(node, className) {
  if (Array.isArray(node)) {
    if (node[3]?.className === className) return node;
    for (const child of node) {
      const match = findByClass(child, className);
      if (match) return match;
    }
  } else if (node && typeof node === "object") {
    for (const child of Object.values(node)) {
      const match = findByClass(child, className);
      if (match) return match;
    }
  }
  return null;
}

function serializeProgrammeChunkRecord(line) {
  return JSON.stringify(`${line}\n`).slice(1, -1);
}

let html = readFileSync(htmlPath, "utf8");
let rsc = readFileSync(rscPath, "utf8");
let css = readFileSync(cssPath, "utf8");

const rscLines = rsc.split(/\r?\n/);
const programmeLineIndex = rscLines.findIndex((line) => line.includes('17:["$","section",null,{"className":"programme section"'));
if (programmeLineIndex < 0) throw new Error("The programme RSC record was not found.");
const oldProgrammeLine = rscLines[programmeLineIndex];
const programmeRecordStart = oldProgrammeLine.indexOf("17:");
const programmeLinePrefix = oldProgrammeLine.slice(0, programmeRecordStart);
const oldProgrammeRecord = oldProgrammeLine.slice(programmeRecordStart);
const programmePayload = JSON.parse(oldProgrammeRecord.slice(3));
const pricingPanel = findByClass(programmePayload, "pricingPanel");
if (!pricingPanel) throw new Error("The pricing panel was not found in the programme RSC record.");
const pricingChildren = pricingPanel[3].children;
if (!findByClass(programmePayload, "programmeValueCard")) {
  const launchNoteIndex = pricingChildren.findIndex((child) => child?.[3]?.className === "launchNote");
  if (launchNoteIndex < 0) throw new Error("The programme launch note was not found.");
  pricingChildren.splice(launchNoteIndex, 0, valueRsc);
}
const newProgrammeRecord = `17:${JSON.stringify(programmePayload)}`;
rscLines[programmeLineIndex] = `${programmeLinePrefix}${newProgrammeRecord}`;
rsc = rscLines.join("\n");

const oldEmbeddedProgramme = serializeProgrammeChunkRecord(oldProgrammeRecord);
if (!html.includes(oldEmbeddedProgramme)) throw new Error("The embedded programme RSC record was not found.");
html = html.replace(oldEmbeddedProgramme, serializeProgrammeChunkRecord(newProgrammeRecord));

const programmeStart = html.indexOf('<section class="programme section" id="programme">');
const programmeEnd = html.indexOf('<section class="cta">', programmeStart);
if (programmeStart < 0 || programmeEnd < 0) throw new Error("The visible programme section was not found.");
let visibleProgramme = html.slice(programmeStart, programmeEnd);
if (!visibleProgramme.includes('class="programmeValueCard"')) {
  const insertionPoint = '<p class="launchNote">';
  if (!visibleProgramme.includes(insertionPoint)) throw new Error("The visible programme launch note was not found.");
  visibleProgramme = visibleProgramme.replace(insertionPoint, `${valueHtml}${insertionPoint}`);
}
html = `${html.slice(0, programmeStart)}${visibleProgramme}${html.slice(programmeEnd)}`;

for (const [legacy, approved] of legacyRanges) {
  html = html.replaceAll(legacy, approved);
  rsc = rsc.replaceAll(legacy, approved);
}

if (!css.includes("/* Complete programme value comparison */")) css += valueCss;

writeFileSync(htmlPath, html);
writeFileSync(rscPath, rsc);
writeFileSync(cssPath, css);
