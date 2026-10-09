import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const BUILD_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-01/02-kondisional/slide";
const OUTPUT = "/Users/daf2a/Documents/python/level-01/02-kondisional/slide/Conditional_Statements_Python.pptx";
const RENDER_DIR = path.join(BUILD_DIR, "artifact-previews");
const PHOTO = path.join(BUILD_DIR, "assets", "forked-path.jpg");

const W = 1280;
const H = 720;
const C = {
  bg: "#F8FAFC",
  white: "#FFFFFF",
  ink: "#0F172A",
  muted: "#475569",
  faint: "#E2E8F0",
  blue: "#306998",
  blueSoft: "#E8F1F8",
  yellow: "#FFD43B",
  yellowSoft: "#FFF7CC",
  green: "#15803D",
  greenSoft: "#DCFCE7",
  red: "#B91C1C",
  redSoft: "#FEE2E2",
  code: "#111827",
  codeMuted: "#CBD5E1",
};

const FONT = "SF Pro Display";
const FONT_TEXT = "SF Pro Text";
const FONT_CODE = "SF Mono";
const SRC_CONTROL = "https://docs.python.org/3/tutorial/controlflow.html";
const SRC_COMPARE = "https://docs.python.org/3/reference/expressions.html#comparisons";
const SRC_COMPOUND = "https://docs.python.org/3/reference/compound_stmts.html";
const SRC_MATCH310 = "https://docs.python.org/3.10/tutorial/controlflow.html#match-statements";
const SRC_PHOTO = "https://unsplash.com/photos/u0vgcIOQG08";

function box(slide, name, x, y, w, h, fill = C.white, lineFill = C.faint, radius = "rounded-xl") {
  return slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: lineFill, width: 1.5 },
    borderRadius: radius,
  });
}

function text(slide, name, value, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontSize: opts.fontSize ?? 24,
    typeface: opts.typeface ?? FONT_TEXT,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    alignment: opts.alignment ?? "left",
    wrap: opts.wrap ?? "square",
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  };
  return shape;
}

function title(slide, value, subtitle) {
  text(slide, "slide-title", value, 72, 48, 1136, 64, {
    fontSize: 48,
    typeface: FONT,
    bold: true,
    color: C.ink,
    wrap: "none",
  });
  slide.shapes.add({
    geometry: "rect",
    name: "title-accent",
    position: { left: 72, top: 120, width: 68, height: 5 },
    fill: C.yellow,
    line: { style: "solid", fill: "none", width: 0 },
  });
  if (subtitle) {
    text(slide, "slide-subtitle", subtitle, 160, 113, 920, 34, {
      fontSize: 22,
      color: C.muted,
      wrap: "none",
    });
  }
}

function codeBlock(slide, name, code, x, y, w, h, fontSize = 22) {
  box(slide, `${name}-frame`, x, y, w, h, C.code, C.code, "rounded-xl");
  slide.shapes.add({
    geometry: "ellipse",
    name: `${name}-dot-1`,
    position: { left: x + 22, top: y + 20, width: 10, height: 10 },
    fill: "#FB7185",
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "ellipse",
    name: `${name}-dot-2`,
    position: { left: x + 40, top: y + 20, width: 10, height: 10 },
    fill: C.yellow,
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "ellipse",
    name: `${name}-dot-3`,
    position: { left: x + 58, top: y + 20, width: 10, height: 10 },
    fill: "#4ADE80",
    line: { style: "solid", fill: "none", width: 0 },
  });
  text(slide, `${name}-code`, code, x + 24, y + 52, w - 48, h - 68, {
    fontSize,
    typeface: FONT_CODE,
    color: "#F8FAFC",
  });
}

function node(slide, name, label, x, y, w, h, opts = {}) {
  const s = slide.shapes.add({
    geometry: opts.geometry ?? "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? C.white,
    line: { style: "solid", fill: opts.line ?? C.blue, width: opts.lineWidth ?? 2 },
    ...(opts.geometry === "diamond" ? {} : { borderRadius: "rounded-xl" }),
  });
  s.text = label;
  s.text.style = {
    fontSize: opts.fontSize ?? 24,
    typeface: opts.typeface ?? FONT_TEXT,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? true,
    alignment: "center",
    anchor: 2,
    wrap: "square",
    insets: { left: 12, right: 12, top: 8, bottom: 8 },
  };
  return s;
}

function connect(slide, from, to, opts = {}) {
  return slide.shapes.connect(from, to, {
    kind: opts.kind ?? "elbow",
    fromSide: opts.fromSide,
    toSide: opts.toSide,
    line: { style: "solid", fill: opts.color ?? C.muted, width: opts.width ?? 2.5 },
    tail: { type: "arrow", width: "med", length: "med" },
  });
}

function notes(slide, lines, sources) {
  const sourceLines = sources.map((s) => `- ${s}`).join("\n");
  slide.speakerNotes.textFrame.setText(`${lines.join("\n\n")}\n\n[Sources]\n${sourceLines}`);
  slide.speakerNotes.setVisible(true);
}

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function main() {
  await fs.mkdir(RENDER_DIR, { recursive: true });
  const p = Presentation.create({ slideSize: { width: W, height: H } });

  // Slide 1
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    const photoBytes = await fs.readFile(PHOTO);
    s.images.add({
      blob: photoBytes,
      contentType: "image/jpeg",
      alt: "Jalur hutan bercabang sebagai metafora pengambilan keputusan",
      fit: "cover",
      position: { left: 760, top: 0, width: 520, height: 720 },
    });
    s.shapes.add({
      geometry: "rect",
      name: "photo-blue-rail",
      position: { left: 742, top: 0, width: 18, height: 720 },
      fill: C.blue,
      line: { style: "solid", fill: "none", width: 0 },
    });
    text(s, "deck-kicker", "PYTHON FUNDAMENTALS", 72, 104, 560, 28, {
      fontSize: 20,
      bold: true,
      color: C.blue,
      wrap: "none",
    });
    text(s, "deck-title", "Conditional\nStatements", 72, 158, 610, 180, {
      fontSize: 72,
      typeface: FONT,
      bold: true,
      color: C.ink,
      lineSpacing: 92,
    });
    text(s, "deck-subtitle", "Membuat program memilih aksi berdasarkan kondisi", 72, 374, 590, 78, {
      fontSize: 30,
      color: C.muted,
      lineSpacing: 115,
    });
    const chip = box(s, "topic-chip", 72, 520, 520, 64, C.yellowSoft, C.yellow, "rounded-xl");
    chip.text = "if · elif · else · pass · match–case";
    chip.text.style = {
      fontSize: 23,
      typeface: FONT_CODE,
      color: C.ink,
      bold: true,
      alignment: "center",
      anchor: 2,
      insets: { left: 12, right: 12, top: 8, bottom: 8 },
    };
    notes(s, [
      "Buka dengan gagasan sederhana: program bisa menghadapi sebuah pilihan, sama seperti kita memilih jalan di persimpangan.",
      "Jelaskan bahwa pelajaran ini berfokus pada cara Python mengubah hasil kondisi True atau False menjadi aksi yang berbeda.",
    ], [SRC_CONTROL, `${SRC_PHOTO} (photo by Jens Lelie, Unsplash)`]);
  }

  // Slide 2
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "if–else adalah decision tree dalam kode", "Kondisi menentukan cabang yang dijalankan");
    const condition = node(s, "rain-condition", "Apakah\nhujan?", 490, 188, 300, 150, {
      geometry: "diamond",
      fill: C.yellowSoft,
      line: C.yellow,
      fontSize: 28,
    });
    const yes = node(s, "rain-yes", "Bawa payung", 185, 470, 300, 96, {
      fill: C.blueSoft,
      line: C.blue,
      color: C.blue,
      fontSize: 26,
    });
    const no = node(s, "rain-no", "Tidak perlu payung", 795, 470, 300, 96, {
      fill: C.white,
      line: C.faint,
      color: C.muted,
      fontSize: 26,
    });
    connect(s, condition, yes, { fromSide: "bottom", toSide: "top", color: C.green });
    connect(s, condition, no, { fromSide: "bottom", toSide: "top", color: C.red });
    text(s, "yes-label", "True / Ya", 295, 388, 130, 28, { fontSize: 21, bold: true, color: C.green, alignment: "center" });
    text(s, "no-label", "False / Tidak", 855, 388, 160, 28, { fontSize: 21, bold: true, color: C.red, alignment: "center" });
    text(s, "decision-summary", "kondisi  →  keputusan  →  aksi", 390, 618, 500, 36, {
      fontSize: 28,
      typeface: FONT_CODE,
      color: C.muted,
      alignment: "center",
    });
    notes(s, [
      "Gunakan contoh hujan untuk menunjukkan pola universal: evaluasi kondisi, pilih satu cabang, lalu jalankan aksinya.",
      "Hubungkan decision tree ini dengan sintaks Python: pertanyaan menjadi kondisi setelah if; cabang Ya menjadi blok if; cabang Tidak menjadi blok else.",
    ], [SRC_CONTROL]);
  }

  // Slide 3
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    title(s, "Setiap kondisi menghasilkan True atau False", "Boolean adalah sinyal untuk memilih cabang");
    text(s, "boolean-intro", "Python mengevaluasi ekspresi perbandingan menjadi nilai Boolean.", 72, 172, 670, 58, {
      fontSize: 29,
      color: C.muted,
    });
    const t = node(s, "true-card", "True", 780, 170, 190, 100, { fill: C.greenSoft, line: C.green, color: C.green, fontSize: 38 });
    const f = node(s, "false-card", "False", 1000, 170, 190, 100, { fill: C.redSoft, line: C.red, color: C.red, fontSize: 38 });
    codeBlock(s, "boolean-code", "age = 20\n\nage >= 17     # True\nage < 17      # False", 72, 294, 610, 270, 26);
    text(s, "boolean-flow", "age >= 17", 786, 342, 384, 46, { fontSize: 34, typeface: FONT_CODE, bold: true, alignment: "center" });
    s.shapes.add({
      geometry: "downArrow",
      name: "boolean-arrow",
      position: { left: 941, top: 406, width: 70, height: 80 },
      fill: C.blue,
      line: { style: "solid", fill: "none", width: 0 },
    });
    node(s, "boolean-result", "True", 850, 512, 250, 76, { fill: C.blueSoft, line: C.blue, color: C.blue, fontSize: 30 });
    text(s, "boolean-takeaway", "Jika hasilnya True, blok kode dijalankan.", 754, 620, 450, 34, { fontSize: 24, color: C.muted, alignment: "center" });
    notes(s, [
      "Tekankan bahwa kondisi tidak selalu ditulis sebagai kata True atau False; sering kali kondisi berupa perbandingan seperti age >= 17.",
      "Ajak peserta menebak hasil dua ekspresi sebelum memperlihatkan jawabannya. Ini melatih pembacaan kondisi sebelum masuk ke sintaks if.",
    ], [SRC_COMPARE]);
  }

  // Slide 4
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "Comparison operators membentuk pertanyaan", "Enam simbol dasar yang paling sering dipakai");
    const ops = [
      ["==", "sama dengan"],
      ["!=", "tidak sama dengan"],
      [">", "lebih besar"],
      ["<", "lebih kecil"],
      [">=", "lebih besar atau sama"],
      ["<=", "lebih kecil atau sama"],
    ];
    ops.forEach(([op, label], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 72 + col * 440;
      const y = 176 + row * 126;
      const opBox = node(s, `op-${i}`, op, x, y, 118, 84, { fill: C.blue, line: C.blue, color: C.white, fontSize: 34, typeface: FONT_CODE });
      text(s, `op-label-${i}`, label, x + 144, y + 22, 260, 44, { fontSize: 25, color: C.ink, bold: true });
    });
    box(s, "comparison-example", 952, 176, 256, 336, C.white, C.faint, "rounded-xl");
    text(s, "comparison-example-title", "Contoh", 984, 208, 192, 34, { fontSize: 28, bold: true, color: C.blue, alignment: "center" });
    text(s, "comparison-example-code", "score = 80\n\nscore >= 75\n\n→ True", 980, 278, 200, 178, { fontSize: 27, typeface: FONT_CODE, bold: true, alignment: "center", lineSpacing: 130 });
    box(s, "equal-warning", 72, 574, 1136, 78, C.yellowSoft, C.yellow, "rounded-xl");
    text(s, "equal-warning-text", "Ingat:  =  memberi nilai, sedangkan  ==  membandingkan nilai.", 104, 595, 1072, 38, { fontSize: 27, bold: true, color: C.ink, alignment: "center", typeface: FONT_CODE });
    notes(s, [
      "Baca simbol sebagai pertanyaan: apakah dua nilai sama, berbeda, lebih besar, atau lebih kecil.",
      "Berikan perhatian khusus pada = dan ==. Kesalahan satu tanda sama dengan sangat umum pada pemula: = adalah assignment, sedangkan == adalah comparison.",
    ], [SRC_COMPARE]);
  }

  // Slide 5
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    title(s, "if menjalankan blok hanya saat kondisi benar", "Indentasi menunjukkan kode yang termasuk di dalam if");
    codeBlock(s, "if-code", "score = 82\n\nif score >= 75:\n    print(\"Lulus\")", 72, 176, 600, 330, 27);
    const cond = node(s, "if-condition", "score >= 75?", 810, 190, 300, 118, { geometry: "diamond", fill: C.yellowSoft, line: C.yellow, fontSize: 26, typeface: FONT_CODE });
    const action = node(s, "if-action", "print(\"Lulus\")", 830, 432, 260, 84, { fill: C.greenSoft, line: C.green, color: C.green, fontSize: 23, typeface: FONT_CODE });
    connect(s, cond, action, { fromSide: "bottom", toSide: "top", color: C.green });
    text(s, "if-true-label", "True", 1010, 348, 90, 28, { fontSize: 21, bold: true, color: C.green, alignment: "center" });
    text(s, "if-false-label", "False → lewati blok", 744, 550, 420, 34, { fontSize: 24, color: C.muted, alignment: "center" });
    const checks = ["kondisi", "titik dua :", "indentasi 4 spasi"];
    checks.forEach((label, i) => {
      text(s, `if-check-${i}`, `✓ ${label}`, 92 + i * 330, 584, 300, 36, { fontSize: 24, bold: true, color: i === 2 ? C.blue : C.muted, alignment: "center" });
    });
    notes(s, [
      "Jelaskan struktur baris if: keyword if, kondisi, lalu titik dua. Baris yang menjorok adalah bagian dari blok yang dikontrol oleh kondisi.",
      "Ubah score menjadi 60 saat demonstrasi. Program tidak mencetak apa pun karena kondisi False dan belum ada cabang else.",
    ], [SRC_CONTROL]);
  }

  // Slide 6
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "if–else menjamin satu dari dua cabang berjalan", "else menangani semua kondisi yang tidak lolos if");
    codeBlock(s, "if-else-code", "temperature = 31\n\nif temperature > 30:\n    print(\"Nyalakan kipas\")\nelse:\n    print(\"Kipas tidak diperlukan\")", 72, 166, 620, 420, 23);
    const cond = node(s, "temp-condition", "temperature > 30?", 812, 174, 350, 130, { geometry: "diamond", fill: C.yellowSoft, line: C.yellow, fontSize: 22, typeface: FONT_CODE });
    const on = node(s, "fan-on", "Nyalakan kipas", 720, 456, 230, 82, { fill: C.blueSoft, line: C.blue, color: C.blue, fontSize: 23 });
    const off = node(s, "fan-off", "Tidak diperlukan", 1020, 456, 220, 82, { fill: C.white, line: C.faint, color: C.muted, fontSize: 23 });
    connect(s, cond, on, { fromSide: "bottom", toSide: "top", color: C.green });
    connect(s, cond, off, { fromSide: "bottom", toSide: "top", color: C.red });
    text(s, "fan-true", "True", 754, 374, 90, 28, { fontSize: 21, bold: true, color: C.green, alignment: "center" });
    text(s, "fan-false", "False", 1110, 374, 90, 28, { fontSize: 21, bold: true, color: C.red, alignment: "center" });
    text(s, "if-else-rule", "Satu kondisi · Dua kemungkinan · Satu cabang dipilih", 728, 602, 500, 36, { fontSize: 24, color: C.muted, alignment: "center" });
    notes(s, [
      "else tidak memerlukan kondisi tambahan. Ia menjadi jalur cadangan ketika kondisi if menghasilkan False.",
      "Uji dua nilai: 31 memilih blok if, sedangkan 28 memilih blok else. Tegaskan bahwa hanya satu cabang yang dijalankan.",
    ], [SRC_CONTROL]);
  }

  // Slide 7
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    title(s, "elif memeriksa kondisi dari atas ke bawah", "Pemeriksaan berhenti pada kondisi pertama yang benar");
    codeBlock(s, "elif-code", "score = 84\n\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelif score >= 70:\n    grade = \"C\"\nelse:\n    grade = \"D\"", 72, 162, 570, 486, 21);
    const steps = [
      [">= 90?", "A", C.blue, C.blueSoft],
      [">= 80?", "B", C.green, C.greenSoft],
      [">= 70?", "C", "#B7791F", C.yellowSoft],
      ["lainnya", "D", C.muted, C.bg],
    ];
    steps.forEach(([condition, grade, color, fill], i) => {
      const y = 186 + i * 110;
      const condNode = node(s, `elif-condition-${i}`, condition, 748, y, 230, 72, { fill: C.white, line: color, color, fontSize: 24, typeface: FONT_CODE });
      const gradeNode = node(s, `elif-grade-${i}`, grade, 1080, y, 92, 72, { fill, line: color, color, fontSize: 30, typeface: FONT_CODE });
      if (i < 3) {
        text(s, `elif-yes-${i}`, "True", 996, y + 22, 64, 26, { fontSize: 19, bold: true, color: C.green, alignment: "center" });
      }
      connect(s, condNode, gradeNode, { fromSide: "right", toSide: "left", color });
      if (i < steps.length - 1) {
        text(s, `elif-false-${i}`, "False ↓", 802, y + 76, 130, 26, { fontSize: 18, color: C.red, alignment: "center" });
      }
    });
    box(s, "elif-result", 738, 620, 454, 48, C.greenSoft, C.green, "rounded-xl");
    text(s, "elif-result-text", "score = 84  →  grade = \"B\"", 758, 631, 414, 26, { fontSize: 23, typeface: FONT_CODE, bold: true, color: C.green, alignment: "center" });
    notes(s, [
      "Python mengecek kondisi dari atas ke bawah. Saat score 84, kondisi >= 90 gagal, kondisi >= 80 benar, lalu pemeriksaan berhenti.",
      "Urutan kondisi penting. Mulailah dari batas paling tinggi agar nilai 95 tidak berhenti pada kondisi >= 70.",
    ], [SRC_CONTROL]);
  }

  // Slide 8
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "pass menjaga blok kosong tetap valid", "Placeholder sementara—bukan logika akhir");
    codeBlock(s, "pass-code", "is_admin = True\n\nif is_admin:\n    pass  # implementasi menyusul\nelse:\n    print(\"Akses terbatas\")", 72, 176, 660, 356, 24);
    const placeholder = box(s, "pass-placeholder", 812, 188, 350, 238, C.white, C.faint, "rounded-xl");
    text(s, "pass-braces", "{  }", 870, 216, 234, 78, { fontSize: 68, typeface: FONT_CODE, bold: true, color: C.blue, alignment: "center" });
    text(s, "pass-placeholder-text", "Blok dicadangkan\nuntuk nanti", 844, 312, 286, 78, { fontSize: 27, bold: true, color: C.ink, alignment: "center", lineSpacing: 112 });
    const statements = [
      ["✓", "Tidak melakukan aksi", C.green],
      ["✓", "Mencegah SyntaxError", C.green],
      ["!", "Jangan dibiarkan permanen", "#B7791F"],
    ];
    statements.forEach(([symbol, label, color], i) => {
      text(s, `pass-symbol-${i}`, symbol, 806, 478 + i * 54, 44, 34, { fontSize: 28, bold: true, color, alignment: "center" });
      text(s, `pass-label-${i}`, label, 862, 480 + i * 54, 320, 32, { fontSize: 23, color: C.muted });
    });
    notes(s, [
      "pass adalah pernyataan yang tidak melakukan apa pun, tetapi tetap memenuhi kebutuhan sintaks Python untuk memiliki isi blok.",
      "Gunakan saat menyusun kerangka program atau menunda implementasi. Ingatkan peserta untuk menggantinya dengan logika nyata sebelum fitur dianggap selesai.",
    ], [SRC_CONTROL]);
  }

  // Slide 9
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    title(s, "Nested if memeriksa syarat secara bertingkat", "Kondisi kedua baru relevan setelah kondisi awal terpenuhi");
    codeBlock(s, "nested-code", "age = 20\nhas_ticket = True\n\nif age >= 18:\n    if has_ticket:\n        print(\"Boleh masuk\")\n    else:\n        print(\"Tiket diperlukan\")\nelse:\n    print(\"Usia belum cukup\")", 72, 162, 560, 490, 19);
    const age = node(s, "age-condition", "age >= 18?", 830, 170, 240, 102, { geometry: "diamond", fill: C.yellowSoft, line: C.yellow, fontSize: 23, typeface: FONT_CODE });
    const ticket = node(s, "ticket-condition", "has_ticket?", 690, 360, 268, 96, { geometry: "diamond", fill: C.blueSoft, line: C.blue, fontSize: 20, typeface: FONT_CODE });
    const tooYoung = node(s, "too-young", "Usia belum cukup", 1018, 372, 220, 74, { fill: C.redSoft, line: C.red, color: C.red, fontSize: 21 });
    const enter = node(s, "enter", "Boleh masuk", 668, 566, 190, 70, { fill: C.greenSoft, line: C.green, color: C.green, fontSize: 21 });
    const needTicket = node(s, "need-ticket", "Tiket diperlukan", 892, 566, 210, 70, { fill: C.white, line: C.faint, color: C.muted, fontSize: 21 });
    connect(s, age, ticket, { fromSide: "bottom", toSide: "top", color: C.green });
    connect(s, age, tooYoung, { fromSide: "right", toSide: "top", color: C.red });
    connect(s, ticket, enter, { fromSide: "bottom", toSide: "top", color: C.green });
    connect(s, ticket, needTicket, { fromSide: "bottom", toSide: "top", color: C.red });
    text(s, "nested-true-1", "True", 730, 296, 70, 26, { fontSize: 18, bold: true, color: C.green, alignment: "center" });
    text(s, "nested-false-1", "False", 1110, 310, 70, 26, { fontSize: 18, bold: true, color: C.red, alignment: "center" });
    text(s, "nested-true-2", "True", 668, 496, 70, 26, { fontSize: 18, bold: true, color: C.green, alignment: "center" });
    text(s, "nested-false-2", "False", 976, 496, 70, 26, { fontSize: 18, bold: true, color: C.red, alignment: "center" });
    notes(s, [
      "Kondisi has_ticket hanya diperiksa jika age >= 18 sudah benar. Ini adalah alasan logis untuk menempatkan if kedua di dalam blok pertama.",
      "Peringatkan bahwa nesting terlalu dalam sulit dibaca. Jika sudah banyak tingkat, pertimbangkan memecah logika menjadi fungsi atau menggabungkan kondisi dengan operator logika.",
    ], [SRC_COMPOUND]);
  }

  // Slide 10
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "match–case memilih aksi berdasarkan pola", "Tersedia mulai Python 3.10");
    codeBlock(s, "match-code", "command = \"start\"\n\nmatch command:\n    case \"start\":\n        print(\"Program dimulai\")\n    case \"stop\":\n        print(\"Program berhenti\")\n    case _:\n        print(\"Perintah tidak dikenal\")", 72, 154, 610, 512, 20);
    const input = node(s, "match-input", "command", 820, 174, 260, 78, { fill: C.blue, line: C.blue, color: C.white, fontSize: 25, typeface: FONT_CODE });
    const start = node(s, "match-start", "\"start\"\nProgram dimulai", 740, 378, 220, 110, { fill: C.greenSoft, line: C.green, color: C.green, fontSize: 21, typeface: FONT_CODE });
    const stop = node(s, "match-stop", "\"stop\"\nProgram berhenti", 1008, 378, 220, 110, { fill: C.redSoft, line: C.red, color: C.red, fontSize: 21, typeface: FONT_CODE });
    const fallback = node(s, "match-fallback", "_\nFallback", 874, 554, 220, 88, { fill: C.white, line: C.faint, color: C.muted, fontSize: 22, typeface: FONT_CODE });
    connect(s, input, start, { fromSide: "bottom", toSide: "top", color: C.green });
    connect(s, input, stop, { fromSide: "bottom", toSide: "top", color: C.red });
    connect(s, input, fallback, { fromSide: "bottom", toSide: "top", color: C.muted });
    notes(s, [
      "match mengevaluasi satu ekspresi, lalu membandingkannya dengan pola case secara berurutan. Case pertama yang cocok akan dijalankan.",
      "case _ adalah wildcard atau fallback untuk nilai yang tidak cocok dengan pola sebelumnya. Tekankan bahwa match lebih kuat daripada switch sederhana karena mendukung pattern matching.",
    ], [SRC_MATCH310, SRC_CONTROL]);
  }

  // Slide 11
  {
    const s = p.slides.add();
    s.background.fill = C.white;
    title(s, "Satu case dapat menerima beberapa pola", "Gunakan | untuk menggabungkan alternatif");
    codeBlock(s, "multi-pattern-code", "day = \"Sat\"\n\nmatch day:\n    case \"Sat\" | \"Sun\":\n        category = \"Weekend\"\n    case \"Mon\" | \"Tue\" | \"Wed\" | \"Thu\" | \"Fri\":\n        category = \"Weekday\"\n    case _:\n        category = \"Unknown\"", 72, 160, 720, 490, 18);
    text(s, "pattern-day", "day", 914, 168, 180, 42, { fontSize: 32, typeface: FONT_CODE, bold: true, color: C.blue, alignment: "center" });
    node(s, "weekend", "Sat  |  Sun\nWeekend", 842, 258, 330, 112, { fill: C.yellowSoft, line: C.yellow, color: C.ink, fontSize: 24, typeface: FONT_CODE });
    node(s, "weekday", "Mon · Tue · Wed\nThu · Fri\nWeekday", 842, 410, 330, 144, { fill: C.blueSoft, line: C.blue, color: C.blue, fontSize: 22, typeface: FONT_CODE });
    node(s, "unknown", "_  →  Unknown", 878, 596, 258, 60, { fill: C.bg, line: C.faint, color: C.muted, fontSize: 21, typeface: FONT_CODE });
    notes(s, [
      "Operator | di dalam pola berarti salah satu alternatif boleh cocok. Sat atau Sun menghasilkan kategori Weekend.",
      "Letakkan wildcard _ terakhir. Jika wildcard ditempatkan lebih awal, pola setelahnya tidak akan mendapat kesempatan untuk diperiksa.",
    ], [SRC_CONTROL]);
  }

  // Slide 12
  {
    const s = p.slides.add();
    s.background.fill = C.bg;
    title(s, "Pilih struktur yang paling mudah dibaca", "Mulai sederhana, tambah cabang hanya ketika diperlukan");
    const choices = [
      ["if", "Satu kondisi", C.blue],
      ["if–else", "Dua cabang", C.green],
      ["if–elif–else", "Banyak kondisi / rentang", "#B7791F"],
      ["nested if", "Syarat bertingkat", C.red],
      ["match–case", "Satu nilai, banyak pola", "#7C3AED"],
    ];
    choices.forEach(([name, use, color], i) => {
      const y = 164 + i * 78;
      text(s, `choice-name-${i}`, name, 84, y + 13, 240, 34, { fontSize: 25, typeface: FONT_CODE, bold: true, color });
      s.shapes.add({ geometry: "rect", name: `choice-line-${i}`, position: { left: 326, top: y + 29, width: 70, height: 4 }, fill: color, line: { style: "solid", fill: "none", width: 0 } });
      text(s, `choice-use-${i}`, use, 420, y + 13, 390, 34, { fontSize: 25, color: C.ink });
    });
    box(s, "exercise-box", 842, 164, 366, 410, C.white, C.faint, "rounded-xl");
    text(s, "exercise-title", "Latihan", 882, 200, 286, 42, { fontSize: 33, typeface: FONT, bold: true, color: C.blue, alignment: "center" });
    text(s, "exercise-prompt", "Buat program status suhu:", 882, 270, 286, 38, { fontSize: 25, bold: true, color: C.ink, alignment: "center" });
    text(s, "exercise-rules", "< 20     → Dingin\n20–29  → Nyaman\n≥ 30     → Panas", 902, 334, 246, 138, { fontSize: 25, typeface: FONT_CODE, color: C.muted, lineSpacing: 130 });
    box(s, "exercise-hint", 878, 500, 294, 48, C.yellowSoft, C.yellow, "rounded-xl");
    text(s, "exercise-hint-text", "Petunjuk: if–elif–else", 894, 511, 262, 26, { fontSize: 21, typeface: FONT_CODE, bold: true, color: C.ink, alignment: "center" });
    text(s, "closing", "Tujuan akhirnya: logika benar dan kode tetap mudah dibaca.", 72, 626, 1136, 38, { fontSize: 28, bold: true, color: C.blue, alignment: "center" });
    notes(s, [
      "Gunakan daftar ini sebagai aturan praktis, bukan hukum mutlak. Pilih struktur yang paling jelas menjelaskan niat program.",
      "Berikan waktu peserta menyusun latihan suhu. Jawaban yang diharapkan menggunakan if untuk < 20, elif untuk < 30, lalu else untuk semua nilai 30 ke atas.",
      "Tutup dengan meminta peserta menjelaskan alur kodenya sebagai decision tree sebelum mengetik sintaks.",
    ], [SRC_CONTROL, SRC_COMPARE, SRC_COMPOUND]);
  }

  for (const [i, slide] of p.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    await writeBlob(path.join(RENDER_DIR, `${stem}.png`), await p.export({ slide, format: "png", scale: 1 }));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(RENDER_DIR, `${stem}.layout.json`), await layout.text());
  }
  await writeBlob(path.join(RENDER_DIR, "deck-montage.webp"), await p.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(OUTPUT);
  console.log(`Created ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
