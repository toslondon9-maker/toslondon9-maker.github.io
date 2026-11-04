import fs from "node:fs";
import { writePdf } from "./pdf-layout.mjs";

const markdown = fs.readFileSync("content/insights-article-does-any-of-this-feel-familiar.md", "utf8");
const sections = [];
let heading = "";
let body = [];
const flush = () => {
  if (heading) sections.push({ heading, body: body.join("\n\n").replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1: $2") });
  body = [];
};
for (const line of markdown.split(/\r?\n/)) {
  if (line.startsWith("# ")) {
    if (!heading) { heading = line.slice(2); continue; }
    flush();
    heading = line.slice(2);
    continue;
  }
  if (line.startsWith("## ") || line.startsWith("### ")) {
    flush();
    heading = line.replace(/^#{2,3} /, "");
    continue;
  }
  if (line === "---" || line.startsWith("![") || line.startsWith("**SEO title:**") || line.startsWith("**Meta description:**") || line.startsWith("**Suggested excerpt:**")) continue;
  if (/^- /.test(line)) body.push(line.slice(2));
  else body.push(line);
}
flush();
writePdf("downloads/does-any-of-this-feel-familiar.pdf", "Does Any of This Feel Familiar? - Unleash Your Power", sections);
