import fs from "node:fs";
import { writePdf } from "./pdf-layout.mjs";

const markdown = fs.readFileSync("content/insights-article-how-to-study-master-key-system.md", "utf8");
const lines = markdown.split(/\r?\n/);
const sections = [];
let heading = "";
let body = [];
const flush = () => { if (heading) sections.push({ heading, body: body.join("\n\n") }); body = []; };
for (const line of lines) {
  if (line.startsWith("# ")) { if (!heading) { heading = line.slice(2); continue; } flush(); heading = line.slice(2); continue; }
  if (line.startsWith("## ") || line.startsWith("### ")) { flush(); heading = line.replace(/^#{2,3} /, ""); continue; }
  if (/^\|/.test(line)) { body.push(line.replace(/\|/g, " ")); continue; }
  if (/^- /.test(line)) { body.push(line.slice(2)); continue; }
  body.push(line);
}
flush();
writePdf("downloads/how-to-study-the-master-key-system.pdf", "How to Study the Master Key System: A Practical Daily Routine", sections);
