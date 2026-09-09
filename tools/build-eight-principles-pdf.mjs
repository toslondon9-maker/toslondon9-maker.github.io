import fs from "node:fs";
import path from "node:path";

const output = path.resolve("downloads/eight-principles-master-key-system.pdf");
const pages = [
  ["UNLEASH YOUR POWER", "The Eight Principles of the Master Key System", "An independent study guide for examining eight principles with practical attention."],
  ["1. Truth", "Truth begins with seeing what is actually present. Separate an observation from an assumption and notice where a story has been added. Truth is not harshness; it is the willingness to meet facts, feelings and choices honestly before deciding what to do next."],
  ["2. Tact", "Tact is thoughtful judgement in relationship with other people. It includes sympathy, understanding and the ability to consider the likely consequences of an action before taking it. Tact is not weakness or people-pleasing. It lets you speak clearly while remembering that another person has a perspective, context and dignity of their own."],
  ["3. Loyalty", "Loyalty is steadiness toward a chosen value, promise or relationship. It is tested by ordinary repetition: keeping an agreement, returning to a practice and acting consistently when enthusiasm changes. Loyalty should include discernment; it does not require remaining in a harmful situation or abandoning your boundaries."],
  ["4. Individuality", "Individuality means developing your own understanding and responsibility. Study can offer a map, but it cannot make your decisions for you. Notice which interpretations help you think and act more deliberately, then make room for your own experience rather than copying someone else’s identity or method."],
  ["5. Courage", "Courage is the capacity to take a considered step while uncertainty is still present. It may mean asking an honest question, changing a familiar response or beginning an exercise without knowing exactly what you will discover. A brave action can be small, informed and reversible."],
  ["6. Accumulation", "Accumulation describes how repeated attention and practice build a pattern over time. A single reflection may feel modest, yet a series of observations can reveal what supports your direction. The principle points toward patient consistency, not instant results or a promise that effort produces a particular outcome."],
  ["7. Constructiveness", "Constructiveness asks whether your thinking leads toward useful action. It is not forced optimism. It means identifying what can be built, repaired, clarified or practised next, even when a situation is imperfect. Constructive attention turns reflection into a choice that can be tested in real life."],
  ["8. Sagacity", "Sagacity is practical wisdom: the ability to weigh context, timing and consequences before choosing. It grows through experience, honest review and a willingness to revise an idea when new information appears. Sagacity keeps principles grounded, so insight can become a measured and responsible next action."],
  ["A practical reflection", "Choose one principle that feels relevant today. Write down one situation in which it already appears, one situation in which you would like to practise it differently and one small action you can take within the next 24 hours.\n\nSeven-minute exercise: Set a timer for seven quiet minutes. Read your chosen principle once, breathe normally and notice the first practical situation that comes to mind. Finish by writing: The next constructive step I can take is…\n\nContinue with the free seven-day experience: https://unleashyourpowerwithtariq.com/start-free/\n\nUnleash Your Power is independent study and coaching inspired by the Master Key System. It is not affiliated with or endorsed by the historical authors discussed here. Individual outcomes depend on circumstances, participation and consistent practice."],
];

function escapePdf(text) { return text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)"); }
function pageStream(lines) {
  let y = 760;
  const commands = ["BT", "/F1 11 Tf"];
  for (const line of lines) {
    for (const wrapped of String(line).split("\n")) {
      commands.push(`1 0 0 1 54 ${y} Tm (${escapePdf(wrapped)}) Tj`);
      y -= 18;
      if (y < 60) break;
    }
    y -= 10;
  }
  commands.push("ET");
  return commands.join("\n");
}

function buildPdf() {
  const objects = [];
  const add = (value) => { objects.push(value); return objects.length; };
  const pagesId = add(null);
  const catalogId = add(null);
  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds = [];
  for (const page of pages) {
    const stream = pageStream(page);
    const streamId = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`));
  }
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

buildPdf();
