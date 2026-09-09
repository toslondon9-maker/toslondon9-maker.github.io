import fs from "node:fs";
import path from "node:path";

const root = path.resolve("downloads");
const articles = {
  "charles-haanel-master-key-system-introduction.pdf": [
    ["UNLEASH YOUR POWER", "An Introduction to Charles F. Haanel’s Master Key System"],
    ["The Master Key System is a structured study of thought, consciousness, character and purposeful action. It is not simply a book to read once: Haanel presents it as a course requiring patience, reflection and repeated practice."],
    ["The mind as a creative power", "Haanel describes the mind as active and creative. Ideas, beliefs and mental attitudes influence how we interpret the world and the actions we take. A clear idea must be followed by disciplined attention and purposeful action."],
    ["From understanding to action", "Truth, Tact, Loyalty, Individuality, Courage, Accumulation, Constructiveness and Sagacity connect imagination with character, responsibility, judgement and disciplined behaviour. Reading about concentration does not automatically create concentration; practice makes the principle meaningful."],
    ["One energy, different forms", "The illustrations of water, ice and steam show different forms of one substance changed by conditions. Attention, imagination and effort can remain scattered or be consciously organised toward a definite purpose."],
    ["A simple practice for today", "Take ten quiet minutes. Ask what thought pattern has influenced you recently, whether it helps you move towards your purpose and what one action would express clearer thinking. Write your answers and complete one small action before the day ends."],
    ["Studying the Master Key System today", "Each lesson builds on the previous one. Unleash Your Power presents the material as a structured 24-week journey with weekly guidance, exercises, reflection and accountability. Haanel provided the original system; the modern student must test ideas through practice and decide what can be applied constructively."],
    ["Begin your own study", "Free registration is required. No purchase is required. Start the free seven-day experience: https://unleashyourpowerwithtariq.com/start-free/"],
    ["Disclaimer", "Unleash Your Power is an independent coaching experience inspired by Charles F. Haanel’s The Master Key System. It is not affiliated with or endorsed by Charles F. Haanel, his estate or Helmar Rudolph. Individual outcomes depend on personal circumstances, participation and consistent practice."],
  ],
  "world-within-and-world-without.pdf": [
    ["UNLEASH YOUR POWER", "The World Within and the World Without"],
    ["One central idea in The Master Key System is the relationship between the world within and the world without. Haanel invites us to examine the inner patterns influencing how we see, choose and act."],
    ["The world within", "The world within describes thoughts, beliefs, images, emotions and purposes that give direction to action. Thought influences attention, interpretation and action, rather than automatically creating every external event."],
    ["The world without", "The world without is the visible part of life: environment, responsibilities, relationships, habits and results. This does not deny external events or genuine difficulty; it invites examination of the choices and actions over which we do have influence."],
    ["Harmony within", "Harmony means bringing greater agreement between what you believe, want, imagine, say and do. It does not mean life will always feel easy. Greater coherence makes deliberate action easier."],
    ["Thought and action", "The system does not present thought as a substitute for action. A definite purpose needs practical expression through decisions, habits and consistent effort. The world within provides direction; the world without provides opportunity."],
    ["A practical reflection", "Choose one area you want to improve. Write what condition you are experiencing, what thoughts may influence your response, what inner quality would help and what action you can take today."],
    ["Begin your study", "Unleash Your Power presents these ideas as part of a structured 24-week journey. Begin with the free seven-day experience: https://unleashyourpowerwithtariq.com/start-free/"],
    ["Disclaimer", "Unleash Your Power is an independent coaching experience inspired by Charles F. Haanel’s The Master Key System. It is not affiliated with or endorsed by Charles F. Haanel, his estate or Helmar Rudolph. Individual outcomes depend on personal circumstances, participation and consistent practice."],
  ],
};

function esc(value) { return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)"); }
function makePdf(lines) {
  const objects = []; const add = (value) => { objects.push(value); return objects.length; }; const pagesId = add(null); const catalogId = add(null); const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"); const pageIds = [];
  const chunks = []; let chunk = []; let count = 0;
  for (const entry of lines) { for (const line of entry) { if (count >= 34) { chunks.push(chunk); chunk = []; count = 0; } chunk.push(line); count += 2; } }
  chunks.push(chunk);
  for (const chunkLines of chunks) { let y = 760; const cmds = ["BT", "/F1 11 Tf"]; for (const line of chunkLines) { cmds.push(`1 0 0 1 54 ${y} Tm (${esc(line)}) Tj`); y -= 22; } cmds.push("ET"); const stream = cmds.join("\n"); const streamId = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`); pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`)); }
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`; objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  let pdf = "%PDF-1.4\n"; const offsets = [0]; objects.forEach((object, index) => { offsets[index + 1] = Buffer.byteLength(pdf); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`; return pdf;
}
for (const [filename, lines] of Object.entries(articles)) fs.writeFileSync(path.join(root, filename), makePdf(lines));
