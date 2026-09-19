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
    ensure(HEADING_GAP + headingLines.length * HEADING_LEADING + 4 + (firstParagraphLines * BODY_LEADING) + 8);
    page.push({ kind: "heading", lines: headingLines });
    used += HEADING_GAP + headingLines.length * HEADING_LEADING + 4;
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

function streamForPage(page, pageNumber, total) {
  let y = TOP_Y;
  const commands = ["BT"];
  const links = [];
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
      commands.push(`/F1 18 Tf`);
      for (const line of item.lines) {
        addLine(line, MARGIN_X, y, 18);
        y -= 22;
      }
      y -= 12;
      continue;
    }
    if (item.kind === "heading") {
      commands.push(`/F1 ${HEADING_SIZE} Tf`);
      for (const line of item.lines) {
        addLine(line, MARGIN_X, y, HEADING_SIZE);
        y -= HEADING_LEADING;
      }
      y -= HEADING_GAP;
      continue;
    }
    commands.push(`/F1 ${BODY_SIZE} Tf`);
    for (const line of item.lines) {
      addLine(line, MARGIN_X, y, BODY_SIZE);
      y -= BODY_LEADING;
    }
    y -= 8;
  }
  commands.push(`/F1 9 Tf 1 0 0 1 ${MARGIN_X} 34 Tm (Unleash Your Power with Tariq - ${pageNumber} / ${total}) Tj`);
  commands.push("ET");
  return { stream: commands.join("\n"), links };
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
    const rendered = streamForPage(page, index + 1, pages.length);
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
