import { readFileSync } from "node:fs";
import { writePdf } from "./pdf-layout.mjs";
const markdown = readFileSync("content/insights-article-imagine-meditation.md", "utf8");
const sections = [];
let heading = ""; let body = [];
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith("# ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.slice(2); body = []; }
  else if (line.startsWith("## ") || line.startsWith("### ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.replace(/^###? /, ""); body = []; }
  else if (line.trim()) body.push(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
}
if (heading) sections.push({ heading, body: body.join(" ") });
writePdf("downloads/imagine-combining-deep-meditation-personal-development.pdf", sections[0]?.heading ?? "IMAGINE!!! Combining Deep Meditation with Profound Personal Development", sections.slice(1));
