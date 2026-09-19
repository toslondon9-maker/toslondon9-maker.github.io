import { readFileSync } from "node:fs";
import { writePdf } from "./pdf-layout.mjs";

const markdown = readFileSync("content/insights-article-haanel-biography.md", "utf8");
const sections = [];
let heading = ""; let body = [];
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith("# ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.slice(2); body = []; }
  else if (line.startsWith("## ") || line.startsWith("### ")) { if (heading) sections.push({ heading, body: body.join(" ") }); heading = line.replace(/^###? /, ""); body = []; }
  else if (line.trim() && line.trim() !== "---" && !/^\**\[(START THE FREE SEVEN-DAY EXPERIENCE|EXPLORE THE MASTER KEY SYSTEM|BOOK A FREE 15-MINUTE CALL)\]\**$/.test(line.trim())) body.push(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").replaceAll("**", "").replaceAll("*", ""));
}
if (heading) sections.push({ heading, body: body.join(" ") });
writePdf("downloads/who-was-charles-f-haanel-life-and-legacy.pdf", sections[0]?.heading ?? "Who Was Charles F. Haanel? The Life and Legacy Behind The Master Key System", sections.slice(1));
