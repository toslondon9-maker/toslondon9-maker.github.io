import fs from "node:fs";
import path from "node:path";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 58;
const TOP_Y = 770;
const BOTTOM_Y = 62;
const BODY_SIZE = 10.5;
const BODY_LEADING = 15;
const HEADING_SIZE = 15;
const HEADING_LEADING = 19;
const HEADING_GAP = 15;
const CHAR_WIDTH = 5.35;
const MAX_CHARS = Math.floor((PAGE_WIDTH - (MARGIN_X * 2)) / CHAR_WIDTH);

function ascii(value) {
  return String(value)
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("…", "...")
    .replaceAll("•", "-")
    .replaceAll("→", "->")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapePdf(value) {
  return ascii(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function wrap(text, max = MAX_CHARS) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (!line) { line = word; continue; }
    if ((line.length + 1 + word.length) <= max) line += ` ${word}`;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function makePages(title, sections) {
  const pages = [];
  let page = [];
  let used = 0;
  const pushPage = () => { if (page.length) pages.push(page); page = []; used = 0; };
  const ensure = (height) => { if (used + height > (TOP_Y - BOTTOM_Y)) pushPage(); };
  const titleLines = wrap(title, Math.floor((PAGE_WIDTH - (MARGIN_X * 2)) / 8.7));
  page.push({ kind: "title", lines: titleLines });
  used += titleLines.length * 22 + 12;
  for (const section of sections) {
    const paragraphs = String(section.body).split(/\n\s*\n/);
    const headingLines = wrap(section.heading, Math.floor((PAGE_WIDTH - (MARGIN_X * 2)) / 7.5));
    const firstParagraphLines = wrap(paragraphs[0]).length;
    const diagramHeight = section.diagram ? 150 : 0;
    ensure(HEADING_GAP + headingLines.length * HEADING_LEADING + 4 + (firstParagraphLines * BODY_LEADING) + diagramHeight + 8);
    page.push({ kind: "heading", lines: headingLines });
    used += HEADING_GAP + headingLines.length * HEADING_LEADING + 4;
    if (section.diagram) {
      page.push({ kind: "diagram", variant: section.diagram });
      used += diagramHeight;
    }
    for (const paragraph of paragraphs) {
      const lines = wrap(paragraph);
      let remaining = lines;
      while (remaining.length) {
        const availableLines = Math.max(1, Math.floor((TOP_Y - BOTTOM_Y - used - 8) / BODY_LEADING));
        if (availableLines === 1 && used > 0) { pushPage(); continue; }
        const chunk = remaining.slice(0, availableLines);
        page.push({ kind: "paragraph", lines: chunk });
        used += chunk.length * BODY_LEADING + 8;
        remaining = remaining.slice(chunk.length);
        if (remaining.length) pushPage();
      }
    }
  }
  pushPage();
  return pages;
}

function streamForPage(page, pageNumber, total, { brand = false } = {}) {
  let y = TOP_Y;
  const commands = [];
  const links = [];
  if (brand) {
    commands.push("q 0.969 0.953 0.918 rg 0 0 595 842 re f Q");
    commands.push("0.71 0.54 0.26 RG 0.8 w 58 790 m 537 790 l S");
    commands.push("BT /F1 8 Tf 0.71 0.54 0.26 rg 1 0 0 1 58 806 Tm (UNLEASH YOUR POWER | INSIGHTS & GUIDES) Tj ET");
  }
  commands.push("BT");
  const addLine = (line, x, baseline, size) => {
    const urlMatch = line.match(/https?:\/\/\S+/);
    if (urlMatch) {
      const start = x + (urlMatch.index * CHAR_WIDTH);
      const width = Math.max(24, urlMatch[0].length * CHAR_WIDTH);
      links.push({ url: urlMatch[0], rect: [start, baseline - 3, Math.min(PAGE_WIDTH - MARGIN_X, start + width), baseline + size + 2] });
    }
    commands.push(`1 0 0 1 ${x} ${baseline} Tm (${escapePdf(line)}) Tj`);
  };
  for (const item of page) {
    if (item.kind === "title") {
      commands.push(brand ? "0.08 0.14 0.23 rg" : "0 0 0 rg");
      commands.push("/F1 18 Tf");
      for (const line of item.lines) {
        addLine(line, MARGIN_X, y, 18);
        y -= 22;
      }
      y -= 12;
      continue;
    }
    if (item.kind === "heading") {
      commands.push(brand ? "0.71 0.54 0.26 rg" : "0 0 0 rg");
      commands.push(`/F1 ${HEADING_SIZE} Tf`);
      for (const line of item.lines) {
        addLine(line, MARGIN_X, y, HEADING_SIZE);
        y -= HEADING_LEADING;
      }
      y -= HEADING_GAP;
      continue;
    }
    if (item.kind === "diagram") {
      commands.push("ET");
      const x0 = MARGIN_X;
      const boxY = y - 102;
      const navy = "0.09 0.16 0.24";
      const mid = "0.14 0.23 0.34";
      const gold = "0.71 0.54 0.26";
      const cream = "0.969 0.953 0.918";
      const drawBox = (x, yy, w, h, fill, label, sub = "") => {
        commands.push(`${fill} rg ${x} ${yy} ${w} ${h} re f`);
        commands.push("BT /F1 8.5 Tf 0.98 0.97 0.93 rg");
        commands.push(`1 0 0 1 ${x + 7} ${yy + h - 17} Tm (${escapePdf(label)}) Tj`);
        if (sub) {
          commands.push("/F1 6.8 Tf");
          commands.push(`1 0 0 1 ${x + 7} ${yy + 12} Tm (${escapePdf(sub)}) Tj`);
        }
        commands.push("ET");
      };
      if (item.variant === "visualisation") {
        const labels = [["WEEK 5","Place"],["WEEK 6","Photograph"],["WEEK 7","Friend"],["WEEK 8","Battleship"],["WEEK 9","Flower"],["WEEK 10","Geometric form"]];
        labels.forEach(([a,b], i) => drawBox(x0 + (i % 3) * 160, boxY - Math.floor(i / 3) * 60, 150, 48, i % 2 ? mid : navy, a, b));
        y -= 128;
      } else if (item.variant === "contemplation") {
        drawBox(x0, boxY - 20, 225, 112, navy, "WEEKS 11-16", "Faith, unity, observation, harmony, insight");
        drawBox(x0 + 245, boxY - 20, 234, 112, mid, "WEEKS 17-24", "Repose, creation, Silence, Truth, service");
        y -= 128;
      } else {
        const labels = item.variant === "foundation"
          ? [["01","Stillness"],["02","Inhibit thought"],["03","Relax"],["04","Mental release"]]
          : [["1-4","Foundation"],["5-10","Visualisation"],["11-16","Application"],["17-24","Contemplation"]];
        const w = 112;
        labels.forEach(([a,b], i) => drawBox(x0 + i * 120, boxY, w, 72, i === 3 ? gold : i === 0 ? navy : mid, a, b));
        y -= 92;
      }
      commands.push("BT");
      continue;
    }
    commands.push(brand ? "0.14 0.20 0.28 rg" : "0 0 0 rg");
    commands.push(`/F1 ${BODY_SIZE} Tf`);
    for (const line of item.lines) {
      addLine(line, MARGIN_X, y, BODY_SIZE);
      y -= BODY_LEADING;
    }
    y -= 8;
  }
  commands.push(brand ? "0.71 0.54 0.26 rg" : "0 0 0 rg");
  commands.push(`/F1 9 Tf 1 0 0 1 ${MARGIN_X} 34 Tm (Unleash Your Power with Tariq - ${pageNumber} / ${total}) Tj`);
  commands.push("ET");
  return { stream: commands.join("\n"), links };
}

export function writePdf(filename, title, sections, options = {}) {
  const output = path.resolve(filename);
  const pages = makePages(title, sections);
  const objects = [];
  const add = (value) => { objects.push(value); return objects.length; };
  const pagesId = add(null);
  const catalogId = add(null);
  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];
  pages.forEach((page, index) => {
    const rendered = streamForPage(page, index + 1, pages.length, options);
    const streamId = add(`<< /Length ${Buffer.byteLength(rendered.stream)} >>\nstream\n${rendered.stream}\nendstream`);
    const annotationIds = rendered.links.map(({ url, rect }) => add(`<< /Type /Annot /Subtype /Link /Rect [${rect.join(" ")}] /Border [0 0 0] /A << /Type /Action /S /URI /URI (${escapePdf(url)}) >> >>`));
    const annots = annotationIds.length ? ` /Annots [${annotationIds.map((id) => `${id} 0 R`).join(" ")}]` : "";
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R${annots} >>`));
  });
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets[index + 1] = Buffer.byteLength(pdf); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, pdf);
}
