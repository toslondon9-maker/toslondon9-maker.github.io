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
  page.push({ kind: "title", text: title });
  used += 34;
  for (const section of sections) {
    const paragraphs = String(section.body).split(/\n\s*\n/);
    const firstParagraphLines = wrap(paragraphs[0]).length;
    ensure(HEADING_LEADING + 4 + (firstParagraphLines * BODY_LEADING) + 8);
    page.push({ kind: "heading", text: section.heading });
    used += HEADING_LEADING + 4;
    for (const paragraph of paragraphs) {
      const lines = wrap(paragraph);
      ensure(lines.length * BODY_LEADING + 8);
      page.push({ kind: "paragraph", lines });
      used += lines.length * BODY_LEADING + 8;
    }
  }
  pushPage();
  return pages;
}

function streamForPage(page, pageNumber, total) {
  let y = TOP_Y;
  const commands = ["BT"];
  for (const item of page) {
    if (item.kind === "title") {
      commands.push(`/F1 18 Tf 1 0 0 1 ${MARGIN_X} ${y} Tm (${escapePdf(item.text)}) Tj`);
      y -= 34;
      continue;
    }
    if (item.kind === "heading") {
      commands.push(`/F1 ${HEADING_SIZE} Tf 1 0 0 1 ${MARGIN_X} ${y} Tm (${escapePdf(item.text)}) Tj`);
      y -= HEADING_LEADING;
      continue;
    }
    commands.push(`/F1 ${BODY_SIZE} Tf`);
    for (const line of item.lines) {
      commands.push(`1 0 0 1 ${MARGIN_X} ${y} Tm (${escapePdf(line)}) Tj`);
      y -= BODY_LEADING;
    }
    y -= 8;
  }
  commands.push(`/F1 9 Tf 1 0 0 1 ${MARGIN_X} 34 Tm (Unleash Your Power with Tariq - ${pageNumber} / ${total}) Tj`);
  commands.push("ET");
  return commands.join("\n");
}

export function writePdf(filename, title, sections) {
  const output = path.resolve(filename);
  const pages = makePages(title, sections);
  const objects = [];
  const add = (value) => { objects.push(value); return objects.length; };
  const pagesId = add(null);
  const catalogId = add(null);
  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];
  pages.forEach((page, index) => {
    const stream = streamForPage(page, index + 1, pages.length);
    const streamId = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`));
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
