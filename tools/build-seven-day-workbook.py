from pathlib import Path
import sys

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    Flowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


NAVY = HexColor("#07192B")
DEEP_NAVY = HexColor("#03111F")
GOLD = HexColor("#C79A45")
CREAM = HexColor("#F7F0E3")
INK = HexColor("#152334")
MUTED = HexColor("#5D6670")


LESSONS = [
    {
        "title": "See What's Running Your Life",
        "teaching": "Much of a day can be shaped by thoughts and reactions that happen before you consciously choose them. Awareness creates a pause: not to judge what appears, but to see it clearly enough to choose your response.",
        "observe": "Notice one moment when a thought, feeling or habit seems to take over. Name what happened, what you told yourself and what you did next.",
        "reflect": "Which automatic reaction most often pulls you away from the way you want to act?",
        "action": "Pause once today before reacting. Take one slow breath and choose your next response deliberately.",
    },
    {
        "title": "Take Back Your Attention",
        "teaching": "Attention is not something you either have or lack; it is something you can practise directing. Each time you notice distraction and return to your chosen focus, you make a deliberate choice.",
        "observe": "Notice what most often captures your attention without permission. Observe the trigger and how long it takes you to realise your focus has moved.",
        "reflect": "What deserves more of your attention than it currently receives?",
        "action": "Choose one ordinary activity and give it your full attention for five minutes. When your mind wanders, return without criticising yourself.",
    },
    {
        "title": "Recognise What Keeps Repeating",
        "teaching": "Repeated outcomes often have a repeated mental pattern behind them: an assumption, interpretation or familiar response. Recognising the pattern gives you useful information; it does not require you to blame yourself.",
        "observe": "When a familiar situation appears today, look for the first thought that follows it and the behaviour that usually comes next.",
        "reflect": "Which repeated thought seems to lead towards a response you would like to change?",
        "action": "Write one pattern as a simple sequence: trigger, thought, response. Add one alternative response you could try next time.",
    },
    {
        "title": "Give Your Mind a Direction",
        "teaching": "A vague wish is difficult to hold in mind or act upon. A clear intention names a direction you can return to and helps you recognise choices that support it.",
        "observe": "Notice where you use broad words such as better, more or different. Ask what that would look like in one real part of your day.",
        "reflect": "If you could give your attention one clear direction for the next week, what would it be?",
        "action": "Write one intention in a single sentence beginning, 'I choose to...'. Keep it specific enough to guide one decision today.",
    },
    {
        "title": "Become Someone You Can Rely On",
        "teaching": "Self-trust grows when your actions match a commitment you have chosen carefully. Begin small: a specific promise you can keep matters more than an ambitious promise you abandon.",
        "observe": "Notice how you speak to yourself before and after a commitment. Look for excuses, unrealistic standards and evidence that you followed through.",
        "reflect": "What small commitment would help you trust your own word a little more?",
        "action": "Choose one action that takes no more than ten minutes, decide when you will do it and keep that appointment with yourself.",
    },
    {
        "title": "Change From the Inside Out",
        "teaching": "Outward behaviour is influenced by the inner meaning you give to a situation. Working from the inside out means noticing that meaning, choosing a more useful direction and then expressing it through action.",
        "observe": "In one challenging moment, notice the assumption beneath your first response. Ask whether it is a fact, an interpretation or an old expectation.",
        "reflect": "What inner assumption would you like to meet with a more deliberate response?",
        "action": "Choose one useful sentence that supports your intention from Day 4. Recall it before one relevant action today, then act in line with it.",
    },
    {
        "title": "Make It Part of How You Live",
        "teaching": "A sustainable practice is small enough to repeat and flexible enough to return to after a missed day. You can keep practising independently and consider the 24-week programme only if structured support feels appropriate.",
        "observe": "Look back across the week and notice which exercise fitted naturally into your life, which required effort and which you would willingly repeat.",
        "reflect": "Which simple daily practice would help you keep choosing your attention and actions deliberately?",
        "action": "Choose one practice from these seven days, set a realistic time for it tomorrow and decide when you will review whether it still serves you.",
    },
]


class WritingLines(Flowable):
    def __init__(self, count=4, width=165 * mm, spacing=8 * mm):
        super().__init__()
        self.count = count
        self.width = width
        self.spacing = spacing
        self.height = count * spacing

    def draw(self):
        self.canv.setStrokeColor(HexColor("#B9AA8B"))
        self.canv.setLineWidth(0.5)
        for line in range(self.count):
            y = self.height - ((line + 1) * self.spacing)
            self.canv.line(0, y, self.width, y)


def page_background(canvas, document):
    width, height = A4
    page = canvas.getPageNumber()
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 15 * mm, width, 15 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1)
    canvas.line(18 * mm, 13 * mm, width - 18 * mm, 13 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8 * mm, "UNLEASH YOUR POWER")
    page_text = f"{page}"
    canvas.drawString(width - 18 * mm - stringWidth(page_text, "Helvetica", 8), 8 * mm, page_text)
    canvas.restoreState()


def cover_background(canvas, document):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(DEEP_NAVY)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.2)
    canvas.rect(14 * mm, 14 * mm, width - 28 * mm, height - 28 * mm, fill=0, stroke=1)
    canvas.setFillColor(GOLD)
    canvas.circle(width / 2, height - 38 * mm, 4 * mm, fill=0, stroke=1)
    canvas.line(38 * mm, height - 38 * mm, width / 2 - 7 * mm, height - 38 * mm)
    canvas.line(width / 2 + 7 * mm, height - 38 * mm, width - 38 * mm, height - 38 * mm)
    canvas.restoreState()


def build_workbook(output_path):
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=23 * mm,
        bottomMargin=20 * mm,
        title="7 Days to Change the Way You Use Your Mind - Workbook",
        author="Tariq Saddique",
        subject="A practical seven-day Master Key System inspired workbook",
    )

    styles = getSampleStyleSheet()
    cover_kicker = ParagraphStyle("CoverKicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=GOLD, alignment=TA_CENTER, spaceAfter=16)
    cover_title = ParagraphStyle("CoverTitle", parent=styles["Title"], fontName="Times-Bold", fontSize=31, leading=36, textColor=CREAM, alignment=TA_CENTER, spaceAfter=18)
    cover_subtitle = ParagraphStyle("CoverSubtitle", parent=styles["Normal"], fontName="Times-Italic", fontSize=16, leading=22, textColor=GOLD, alignment=TA_CENTER, spaceAfter=22)
    cover_body = ParagraphStyle("CoverBody", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=17, textColor=CREAM, alignment=TA_CENTER, spaceAfter=14)
    day_label = ParagraphStyle("DayLabel", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=12, textColor=GOLD, spaceAfter=5)
    day_title = ParagraphStyle("DayTitle", parent=styles["Heading1"], fontName="Times-Bold", fontSize=25, leading=29, textColor=NAVY, spaceAfter=10)
    intro = ParagraphStyle("Intro", parent=styles["BodyText"], fontName="Times-Roman", fontSize=11.5, leading=16, textColor=INK, spaceAfter=11)
    section = ParagraphStyle("Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=9, leading=11, textColor=GOLD, spaceBefore=3, spaceAfter=4)
    prompt = ParagraphStyle("Prompt", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.2, leading=14, textColor=INK, spaceAfter=4)
    note = ParagraphStyle("Note", parent=styles["BodyText"], fontName="Helvetica-Oblique", fontSize=8.5, leading=11, textColor=MUTED, spaceBefore=8)

    story = [
        Spacer(1, 50 * mm),
        Paragraph("FREE 7-DAY TASTER WORKBOOK", cover_kicker),
        Paragraph("7 Days to Change the Way You Use Your Mind", cover_title),
        Paragraph("Where timeless wisdom meets modern transformation.", cover_subtitle),
        Paragraph("A practical week of observation, focus, direction, self-trust and inner change.", cover_body),
        Spacer(1, 12 * mm),
        Paragraph("TARIQ SADDIQUE", cover_kicker),
        Paragraph("An independent coaching experience inspired by the Master Key System.", cover_body),
        Spacer(1, 14 * mm),
        Paragraph("toslondon9-maker.github.io", cover_body),
        PageBreak(),
    ]

    for index, lesson in enumerate(LESSONS, start=1):
        story.extend([
            Paragraph(f"DAY {index} OF 7", day_label),
            Paragraph(lesson["title"], day_title),
            Paragraph(lesson["teaching"], intro),
            Paragraph("WHAT TO OBSERVE TODAY", section),
            Paragraph(lesson["observe"], prompt),
            WritingLines(count=3),
            Spacer(1, 3 * mm),
            Paragraph("YOUR REFLECTION", section),
            Paragraph(lesson["reflect"], prompt),
            WritingLines(count=5),
            Spacer(1, 3 * mm),
            Paragraph("ONE PRACTICAL ACTION", section),
            Paragraph(lesson["action"], prompt),
            WritingLines(count=3),
            Paragraph("[ ] I completed today's practice", note),
            Paragraph("Keep your answers for yourself. Nothing written here is sent to or stored by Tariq.", note),
        ])
        if index < len(LESSONS):
            story.append(PageBreak())

    document.build(story, onFirstPage=cover_background, onLaterPages=page_background)


if __name__ == "__main__":
    destination = sys.argv[1] if len(sys.argv) > 1 else "downloads/seven-day-experience-workbook-en.pdf"
    build_workbook(destination)
