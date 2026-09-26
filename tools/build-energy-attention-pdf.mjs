import fs from "node:fs";
import { writePdf } from "./pdf-layout.mjs";

const markdown = fs.readFileSync("content/insights-article-energy-attention.md", "utf8");
const sections = [];
let heading = "";
let body = [];
const flush = () => { if (heading) sections.push({ heading, body: body.join("\n\n") }); body = []; };
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith("# ")) { if (!heading) { heading = line.slice(2); continue; } flush(); heading = line.slice(2); continue; }
  if (line.startsWith("## ") || line.startsWith("### ")) { flush(); heading = line.replace(/^#{2,3} /, ""); continue; }
  if (line.startsWith("![")) continue;
  if (line === "---") continue;
  if (/^- /.test(line)) { body.push(line.slice(2)); continue; }
  body.push(line);
}
flush();
writePdf("downloads/energy-goes-where-attention-flows.pdf", "Energy Goes Where Attention Flows: How I Used a 90-Day Vision to Change My Weight", sections);
