import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writePdf } from "./pdf-layout.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const markdown = fs.readFileSync(path.join(root, "content/insights-article-master-key-deep-dive.md"), "utf8");
const sections = [];
let heading = "";
let body = [];
const flush = () => {
  if (heading) {
    const cleaned = body.join("\n\n")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1: $2")
      .replace(/^\|.*\|$/gm, (row) => row.replaceAll("|", " ").replaceAll("---", " "))
      .replace(/^[-*]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replaceAll("**", "")
      .replaceAll("*", "");
    sections.push({ heading, body: cleaned });
  }
  body = [];
};
for (const line of markdown.split(/\r?\n/)) {
  if (line.trim() === "---") break;
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
  if (line.startsWith("> ")) body.push(line.slice(2));
  else if (line.startsWith("![")) {
    const match = line.match(/^!\[([^\]]+)\]\(\s*(\/images\/mks-[^)]+)\s*\)$/);
    if (match) {
      flush();
      heading = "Illustrated study diagram";
      const variant = match[2].includes("weeks-1-4") ? "foundation"
        : match[2].includes("weeks-5-10") ? "visualisation"
        : match[2].includes("weeks-11-24") ? "contemplation"
        : "progression";
      sections.push({ heading: match[1], body: "A visual summary of the source sequence.", diagram: variant });
      heading = "";
    }
  }
  else if (line.startsWith("**SEO title:**") || line.startsWith("**Meta description:**") || line.startsWith("**Suggested excerpt:**")) continue;
  else body.push(line);
}
flush();

writePdf(
  path.join(root, "downloads/master-key-system-24-week-deep-dive.pdf"),
  "The Master Key System: A 24-Week Deep Dive | Unleash Your Power",
  sections,
  { brand: true },
);
