const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType,
  ShadingType, AlignmentType, LevelFormat, PageBreak, Header, Footer, PageNumber, TableOfContents, ImageRun,
  BorderStyle,
} = require("docx");

const RED = "B3121B";
const DARK = "1E2530";
const W = 9864; // A4 text width at 2 cm margins

const src = fs.readFileSync(path.join(__dirname, "content.txt"), "utf8").split(/\r?\n/);

function runs(text, opts = {}) {
  const out = [];
  text.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
    if (!part) return;
    const bold = part.startsWith("**");
    out.push(new TextRun({ text: bold ? part.slice(2, -2) : part, bold: bold || opts.bold, color: opts.color, size: opts.size }));
  });
  return out;
}

function table(rows) {
  const cols = rows[0].length;
  const weights = cols === 2 ? [2600, W - 2600] : cols === 3 ? [2200, 4900, W - 7100] : cols === 4 ? [900, 6100, 1100, W - 8100] : cols === 5 ? [680, 5520, 760, 1600, W - 8560] : cols === 7 ? [760, 3240, 860, 1400, 960, 1400, W - 8620] : Array(cols).fill(Math.floor(W / cols));
  const border = { style: BorderStyle.SINGLE, size: 4, color: "C9CED6" };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: weights,
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      children: r.map((c, j) => new TableCell({
        width: { size: weights[j], type: WidthType.DXA },
        borders,
        shading: i === 0 ? { type: ShadingType.CLEAR, fill: DARK, color: "auto" } : (i % 2 === 0 ? { type: ShadingType.CLEAR, fill: "F3F4F6", color: "auto" } : undefined),
        margins: { top: 40, bottom: 40, left: 90, right: 90 },
        children: [new Paragraph({ spacing: { after: 0 }, children: runs(c, i === 0 ? { bold: true, color: "FFFFFF", size: 17 } : { size: 17 }) })],
      })),
    })),
  });
}

const body = [];
let tbl = null;
let firstH1 = true;
const flush = () => { if (tbl) { body.push(table(tbl)); body.push(new Paragraph({ spacing: { after: 60 }, children: [] })); tbl = null; } };

for (const raw of src) {
  const line = raw.trimEnd();
  if (line.startsWith("|")) {
    tbl = tbl || [];
    tbl.push(line.slice(1, -1).split("|").map((s) => s.trim()));
    continue;
  }
  flush();
  if (!line.trim()) continue;
  if (line.startsWith("# ")) {
    body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: false, children: [new TextRun(line.slice(2))] }));
    firstH1 = false;
  } else if (line.startsWith("## ")) {
    body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(line.slice(3))] }));
  } else if (line.startsWith("- ")) {
    body.push(new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: runs(line.slice(2)) }));
  } else if (/^\d+\. /.test(line)) {
    body.push(new Paragraph({ numbering: { reference: "nums", level: 0 }, children: runs(line.replace(/^\d+\. /, "")) }));
  } else if (line.startsWith("**ANF-")) {
    body.push(new Paragraph({
      spacing: { before: 20, after: 80 },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: RED, space: 8 } },
      indent: { left: 200 },
      children: runs(line),
    }));
  } else {
    body.push(new Paragraph({ children: runs(line) }));
  }
}
flush();

const cover = [
  new Paragraph({ spacing: { before: 2400, after: 200 }, children: [new TextRun({ text: "RICHARD KABLITZ GMBH", bold: true, color: RED, size: 26, characterSpacing: 60 })] }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Lastenheft", bold: true, size: 64, color: DARK })] }),
  new Paragraph({ spacing: { after: 600 }, children: [new TextRun({ text: "Relaunch des Internetauftritts mit Animationskonzept, 3D-Globus, CMS, News-/Blog-Modul, Anfragemanagement und interner Betriebsplattform", size: 30, color: "4A5260" })] }),
  new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED, space: 4 } }, children: [] }),
  ...[
    ["Dokument", "Projektspezifikation zur Angebotsabgabe"],
    ["Version", "2.0 (ersetzt die bisher übermittelte Anforderungsbeschreibung)"],
    ["Stand", "23. September 2026"],
    ["Auftraggeber", "Richard Kablitz GmbH, Bahnhofstraße 72–78, 97922 Lauda-Königshofen"],
    ["Vertraulichkeit", "Vertraulich – nur zur Angebotserstellung"],
    ["Erstellt von", "______________________________ (Marketing / Vertrieb)"],
    ["Telefon / E-Mail", "______________________________"],
    ["Freigabe", "Geschäftsführung"],
  ].map(([k, v]) => new Paragraph({ spacing: { before: 120, after: 0 }, children: [new TextRun({ text: `${k}: `, bold: true, color: DARK }), new TextRun(v)] })),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Inhaltsverzeichnis", bold: true, size: 36, color: DARK })] }),
  ...src.filter((l) => l.startsWith("# ")).map((l) => new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: l.slice(2), color: DARK })] })),
];

const doc = new Document({
    creator: "Richard Kablitz GmbH",
  title: "Lastenheft Relaunch Internetauftritt",
  styles: {
    default: { document: { run: { font: "Calibri", size: 19 }, paragraph: { spacing: { after: 80, line: 252 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Calibri", size: 28, bold: true, color: DARK }, paragraph: { spacing: { before: 360, after: 140 }, outlineLevel: 0, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: RED, space: 6 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Calibri", size: 22, bold: true, color: RED }, paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 1, keepNext: true } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "nums", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 964, bottom: 907, left: 1021, right: 1021 }, pageNumbers: { start: 1 } }, titlePage: true },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Richard Kablitz GmbH · Lastenheft Relaunch Internetauftritt · Version 2.0", size: 16, color: "808894" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Seite ", size: 16, color: "808894" }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "808894" }), new TextRun({ text: " von ", size: 16, color: "808894" }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "808894" })] })] }) },
    children: [...cover, ...body],
  }],
});

const out = process.argv[2] || path.join(__dirname, "Kablitz_Lastenheft_Relaunch_v2.docx");
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(out, b); console.log("ok", out); });
