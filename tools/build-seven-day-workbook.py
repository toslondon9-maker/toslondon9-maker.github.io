import html
import json
import sys
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import Flowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer


NAVY = HexColor("#07192B")
GOLD = HexColor("#C79A45")
INK = HexColor("#152334")
MUTED = HexColor("#5D6670")


def resolve_font(*names):
    roots = [Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/msttcorefonts"), Path("/usr/share/fonts/truetype/dejavu")]
    for root in roots:
        for name in names:
            candidate = root / name
            if candidate.exists():
                return candidate
    raise FileNotFoundError(f"Could not find an embedded workbook font: {names}")


def register_fonts():
    pdfmetrics.registerFont(TTFont("UypSans", str(resolve_font("arial.ttf", "Arial.ttf", "DejaVuSans.ttf"))))
    pdfmetrics.registerFont(TTFont("UypSansBold", str(resolve_font("arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf"))))
    pdfmetrics.registerFont(TTFont("UypSerif", str(resolve_font("georgia.ttf", "Georgia.ttf", "DejaVuSerif.ttf"))))
    pdfmetrics.registerFont(TTFont("UypSerifBold", str(resolve_font("georgiab.ttf", "Georgia Bold.ttf", "DejaVuSerif-Bold.ttf"))))
    pdfmetrics.registerFont(TTFont("UypSerifItalic", str(resolve_font("georgiai.ttf", "Georgia Italic.ttf", "DejaVuSerif-Italic.ttf"))))


def load_canonical():
    source = Path(__file__).resolve().parents[1] / "content" / "seven-day-canonical.json"
    return json.loads(source.read_text(encoding="utf-8"))


def safe(value):
    return html.escape(str(value), quote=False)


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
    width, _ = A4
    page = canvas.getPageNumber()
    canvas.saveState()
    canvas.setFillColor(HexColor("#FFFFFF"))
    canvas.rect(0, 0, width, A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1)
    canvas.line(18 * mm, 13 * mm, width - 18 * mm, 13 * mm)
    canvas.setFont("UypSans", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8 * mm, "UNLEASH YOUR POWER")
    page_text = str(page)
    canvas.drawString(width - 18 * mm - stringWidth(page_text, "UypSans", 8), 8 * mm, page_text)
    canvas.restoreState()


def cover_background(canvas, document):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(HexColor("#FFFFFF"))
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
    register_fonts()
    canonical = load_canonical()
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(output_path), pagesize=A4, leftMargin=22 * mm, rightMargin=22 * mm,
        topMargin=23 * mm, bottomMargin=20 * mm,
        title=f"{canonical['title']['en']} - Workbook", author="Tariq Saddique",
        subject="A practical seven-day Master Key System inspired workbook",
    )

    styles = getSampleStyleSheet()
    cover_kicker = ParagraphStyle("CoverKicker", parent=styles["Normal"], fontName="UypSansBold", fontSize=11, leading=14, textColor=GOLD, alignment=TA_CENTER, spaceAfter=16)
    cover_title = ParagraphStyle("CoverTitle", parent=styles["Title"], fontName="UypSerifBold", fontSize=31, leading=36, textColor=NAVY, alignment=TA_CENTER, spaceAfter=18)
    cover_subtitle = ParagraphStyle("CoverSubtitle", parent=styles["Normal"], fontName="UypSerifItalic", fontSize=16, leading=22, textColor=GOLD, alignment=TA_CENTER, spaceAfter=22)
    cover_body = ParagraphStyle("CoverBody", parent=styles["Normal"], fontName="UypSans", fontSize=11, leading=17, textColor=INK, alignment=TA_CENTER, spaceAfter=14)
    day_label = ParagraphStyle("DayLabel", parent=styles["Normal"], fontName="UypSansBold", fontSize=10, leading=12, textColor=GOLD, spaceAfter=5)
    day_title = ParagraphStyle("DayTitle", parent=styles["Heading1"], fontName="UypSerifBold", fontSize=25, leading=29, textColor=NAVY, spaceAfter=10)
    intro = ParagraphStyle("Intro", parent=styles["BodyText"], fontName="UypSerif", fontSize=11.5, leading=16, textColor=INK, spaceAfter=9)
    section = ParagraphStyle("Section", parent=styles["Heading2"], fontName="UypSansBold", fontSize=9, leading=11, textColor=GOLD, spaceBefore=3, spaceAfter=4)
    prompt = ParagraphStyle("Prompt", parent=styles["BodyText"], fontName="UypSans", fontSize=10, leading=13.5, textColor=INK, spaceAfter=4)
    note = ParagraphStyle("Note", parent=styles["BodyText"], fontName="UypSans", fontSize=8.5, leading=11, textColor=MUTED, spaceBefore=6)

    story = [
        Spacer(1, 50 * mm), Paragraph("FREE 7-DAY EXPERIENCE WORKBOOK", cover_kicker),
        Paragraph(safe(canonical["title"]["en"]), cover_title),
        Paragraph("Where timeless wisdom meets modern transformation.", cover_subtitle),
        Paragraph("A practical week of observation, focus, direction, self-trust and inner change, with optional MKS-inspired practice.", cover_body),
        Spacer(1, 12 * mm), Paragraph("TARIQ SADDIQUE", cover_kicker),
        Paragraph("An independent coaching experience inspired by the Master Key System.", cover_body),
        Spacer(1, 14 * mm), Paragraph("unleashyourpowerwithtariq.com", cover_body), PageBreak(),
    ]

    for index, lesson in enumerate(canonical["lessons"], start=1):
        copy = lesson["en"]
        story.extend([
            Paragraph(f"DAY {index} OF 7", day_label), Paragraph(safe(copy["title"]), day_title),
            Paragraph(safe(copy["teaching"]), intro), Paragraph("WHAT TO OBSERVE TODAY", section),
            Paragraph(safe(copy["observation"]), prompt), WritingLines(count=3), Spacer(1, 2 * mm),
            Paragraph("YOUR REFLECTION", section), Paragraph(safe(copy["reflection"]), prompt),
            WritingLines(count=4), Spacer(1, 2 * mm), Paragraph("ONE PRACTICAL ACTION", section),
            Paragraph(safe(copy["action"]), prompt), WritingLines(count=2),
            Paragraph("MASTER KEY CONNECTION", section), Paragraph(safe(copy["mksConnection"]), prompt),
            Paragraph("OPTIONAL MKS PRACTICE", section), Paragraph(safe(copy["optionalPractice"]), prompt),
            Paragraph(f"Optional practice time: {safe(copy['practiceTime'])} · Core lesson: {safe(copy['coreTime'])} · Full optional experience: {safe(copy['fullTime'])}", note),
            Paragraph("[ ] I completed today's core practice", note),
            Paragraph("Keep your answers for yourself. Nothing written here is sent to or stored by Tariq. Optional MKS practice is not required to complete the seven-day experience.", note),
        ])
        if index < len(canonical["lessons"]):
            story.append(PageBreak())

    document.build(story, onFirstPage=cover_background, onLaterPages=page_background)


if __name__ == "__main__":
    destination = sys.argv[1] if len(sys.argv) > 1 else "downloads/seven-day-experience-workbook-en.pdf"
    build_workbook(destination)
