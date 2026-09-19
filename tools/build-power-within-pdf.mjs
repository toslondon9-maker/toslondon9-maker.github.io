import { readFileSync } from "node:fs";
import { writePdf } from "./pdf-layout.mjs";

const markdown = readFileSync("content/insights-article-power-within.md", "utf8");
const sections = [];
let heading = ""; let body = [];
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith("# ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.slice(2); body = []; }
  else if (line.startsWith("## ") || line.startsWith("### ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.replace(/^###? /, ""); body = []; }
  else if (line.trim()) body.push(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
}
if (heading) sections.push({ heading, body: body.join(" ") });
writePdf("downloads/the-power-within-charles-haanel-foreword.pdf", sections[0]?.heading ?? "The Power Within: What Charles Haanel's Foreword Reveals About Changing Your Life", sections.slice(1));
