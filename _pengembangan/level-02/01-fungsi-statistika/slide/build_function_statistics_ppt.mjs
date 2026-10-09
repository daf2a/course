import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "/Users/daf2a/Documents/python";
const tmpDir = "/Users/daf2a/Documents/python/_pengembangan/level-02/01-fungsi-statistika/slide";
const coverPath = "/Users/daf2a/Documents/python/level-02/01-fungsi-statistika/aset/function-statistika-cover.png";
const candidatePath = path.join(tmpDir, "function_statistika_deskriptif_candidate.pptx");
const slidesDir = path.join(tmpDir, "slides");
const skillDir = "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";

const { makeNativeBulletParagraphs } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href,
);

const W = 1280;
const H = 720;

const COLORS = {
  navy: "#111A30",
  navy2: "#0E2841",
  body: "#4B5868",
  blue: "#4FB6E8",
  blueDark: "#196B9B",
  bluePale: "#EAF6FC",
  yellow: "#F5D36A",
  yellowPale: "#FFF7D6",
  green: "#55B77A",
  greenPale: "#E9F7EE",
  red: "#E96B6B",
  redPale: "#FFF0F0",
  grey: "#E7EAEE",
  grey2: "#F4F5F6",
  white: "#FFFFFF",
  black: "#0B1220",
};

const FONTS = {
  display: "SF Pro Display",
  text: "SF Pro Text",
  mono: "SF Mono",
};

function setTextStyle(shape, style = {}) {
  shape.text.style = {
    typeface: style.typeface ?? FONTS.text,
    fontSize: style.fontSize ?? 20,
    color: style.color ?? COLORS.body,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
    autoFit: style.autoFit ?? "shrinkText",
  };
  return shape;
}

function addText(slide, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  return setTextStyle(shape, style);
}

function addBox(slide, position, fill, line = { style: "solid", fill: "none", width: 0 }, geometry = "roundRect", name) {
  return slide.shapes.add({ geometry, name, position, fill, line, borderRadius: geometry === "roundRect" ? "rounded-xl" : undefined });
}

function addLine(slide, x1, y1, x2, y2, color = COLORS.grey, width = 1) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: "solid", fill: color, width },
  });
}

function addCircle(slide, left, top, size, fill, line = { style: "solid", fill: "none", width: 0 }, name) {
  return slide.shapes.add({ geometry: "ellipse", name, position: { left, top, width: size, height: size }, fill, line });
}

function addKicker(slide, text) {
  addText(slide, text.toUpperCase(), { left: 72, top: 30, width: 520, height: 24 }, {
    typeface: FONTS.text,
    fontSize: 14,
    color: COLORS.blueDark,
    bold: true,
  });
}

function addTitle(slide, title, subtitle = "") {
  addText(slide, title, { left: 72, top: 58, width: 1136, height: 58 }, {
    typeface: FONTS.display,
    fontSize: 34,
    color: COLORS.navy,
    bold: true,
  });
  addLine(slide, 72, 128, 1208, 128, COLORS.grey, 1);
  if (subtitle) {
    addText(slide, subtitle, { left: 72, top: 144, width: 1136, height: 34 }, {
      typeface: FONTS.text,
      fontSize: 17,
      color: COLORS.body,
    });
  }
}

function addFooter(slide, number) {
  return undefined;
}

function addCodeBlock(slide, code, position, options = {}) {
  const block = addBox(slide, position, COLORS.navy, { style: "solid", fill: COLORS.navy, width: 0 }, "roundRect", options.name);
  block.borderRadius = 16;
  addCircle(slide, position.left + 18, position.top + 15, 10, COLORS.red, undefined, `${options.name ?? "code"}-dot-1`);
  addCircle(slide, position.left + 34, position.top + 15, 10, COLORS.yellow, undefined, `${options.name ?? "code"}-dot-2`);
  addCircle(slide, position.left + 50, position.top + 15, 10, COLORS.green, undefined, `${options.name ?? "code"}-dot-3`);
  addText(slide, code, {
    left: position.left + 24,
    top: position.top + 46,
    width: position.width - 48,
    height: position.height - 58,
  }, {
    typeface: FONTS.mono,
    fontSize: options.fontSize ?? 18,
    color: COLORS.white,
    autoFit: "shrinkText",
  });
  return block;
}

function addBulletList(slide, items, position, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = makeNativeBulletParagraphs(items, {
    marginLeftPoints: options.marginLeftPoints ?? 18,
    hangingPoints: options.hangingPoints ?? 9,
    spaceAfterPoints: options.spaceAfterPoints ?? 7,
  });
  setTextStyle(shape, {
    typeface: options.typeface ?? FONTS.text,
    fontSize: options.fontSize ?? 20,
    color: options.color ?? COLORS.body,
    autoFit: "shrinkText",
  });
  return shape;
}

function addCallout(slide, text, position, fill = COLORS.yellowPale, line = COLORS.yellow, color = COLORS.navy) {
  const box = addBox(slide, position, fill, { style: "solid", fill: line, width: 1 }, "roundRect");
  box.borderRadius = 12;
  addText(slide, text, { left: position.left + 16, top: position.top + 10, width: position.width - 32, height: position.height - 20 }, {
    typeface: FONTS.text,
    fontSize: 17,
    color,
    bold: true,
    verticalAlignment: "middle",
  });
  return box;
}

function addNumberedItem(slide, number, title, description, left, top, width = 520) {
  addBox(slide, { left, top, width: 34, height: 34 }, COLORS.blue, { style: "solid", fill: COLORS.blue, width: 0 }, "roundRect");
  addText(slide, String(number), { left: left + 9, top: top + 6, width: 18, height: 22 }, {
    typeface: FONTS.text,
    fontSize: 17,
    color: COLORS.navy,
    bold: true,
    alignment: "center",
  });
  addText(slide, title, { left: left + 48, top: top - 1, width: width - 48, height: 26 }, {
    typeface: FONTS.text,
    fontSize: 19,
    color: COLORS.navy,
    bold: true,
  });
  addText(slide, description, { left: left + 48, top: top + 26, width: width - 48, height: 34 }, {
    typeface: FONTS.text,
    fontSize: 15,
    color: COLORS.body,
  });
}

function addArrow(slide, left, top, width, height, fill = "#A9C1D3") {
  return addBox(slide, { left, top, width, height }, fill, { style: "solid", fill, width: 0 }, "rightArrow");
}

function addDotPlot(slide, values, position, options = {}) {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const width = position.width;
  const y = position.top + 48;
  addLine(slide, position.left, y, position.left + width, y, COLORS.navy, 2);
  const ticks = options.ticks ?? [min, (min + max) / 2, max];
  for (const tick of ticks) {
    const x = position.left + ((tick - min) / (max - min)) * width;
    addLine(slide, x, y - 8, x, y + 8, COLORS.navy, 1);
    addText(slide, String(tick), { left: x - 20, top: y + 14, width: 40, height: 20 }, {
      typeface: FONTS.text,
      fontSize: 12,
      color: COLORS.body,
      alignment: "center",
    });
  }
  for (const value of values) {
    const x = position.left + ((value - min) / (max - min)) * width;
    addCircle(slide, x - 8, y - 8, 16, options.dotColor ?? COLORS.blue, { style: "solid", fill: COLORS.white, width: 1 });
  }
}

function addSimpleHistogram(slide, values, position, options = {}) {
  const maxValue = Math.max(...values);
  const barWidth = position.width / values.length - 12;
  addLine(slide, position.left, position.top + position.height, position.left + position.width, position.top + position.height, COLORS.navy, 2);
  addLine(slide, position.left, position.top, position.left, position.top + position.height, COLORS.navy, 2);
  values.forEach((value, index) => {
    const height = (value / maxValue) * (position.height - 12);
    const x = position.left + index * (barWidth + 12) + 6;
    const y = position.top + position.height - height;
    addBox(slide, { left: x, top: y, width: barWidth, height }, options.fill ?? COLORS.blue, { style: "solid", fill: options.fill ?? COLORS.blue, width: 0 }, "rect");
  });
}

function setNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
}

const presentation = Presentation.create({ slideSize: { width: W, height: H } });
const coverBytes = new Uint8Array(await fs.readFile(coverPath));
let slideNumber = 0;

function newContentSlide(kicker, title, subtitle = "") {
  const slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  slideNumber += 1;
  addKicker(slide, kicker);
  addTitle(slide, title, subtitle);
  addFooter(slide, slideNumber);
  return slide;
}

// Slide 1: cover
{
  const slide = presentation.slides.add();
  slideNumber += 1;
  slide.background.fill = COLORS.white;
  slide.images.add({
    blob: coverBytes,
    contentType: "image/png",
    alt: "Laptop with abstract Python code and numerical data on a clean desk",
    fit: "cover",
    position: { left: 0, top: 0, width: W, height: H },
  });
  addText(slide, "Function untuk\nMengolah Data", { left: 72, top: 132, width: 520, height: 126 }, {
    typeface: FONTS.display,
    fontSize: 44,
    color: COLORS.navy,
    bold: true,
  });
  addText(slide, "Mean, median, modus, variasi,\ndan standar deviasi", { left: 72, top: 300, width: 470, height: 60 }, {
    typeface: FONTS.text,
    fontSize: 22,
    color: COLORS.body,
  });
  addLine(slide, 72, 408, 194, 408, COLORS.blue, 6);
  addText(slide, "Menggunakan function Python untuk membaca data", { left: 72, top: 432, width: 470, height: 30 }, {
    typeface: FONTS.text,
    fontSize: 16,
    color: COLORS.body,
  });
  setNotes(slide, "Buka dengan menghubungkan materi sebelumnya tentang loop dengan function. Function akan menjadi alat untuk membungkus proses pengolahan data.");
}

// Slide 2: objectives
{
  const slide = newContentSlide("TARGET BELAJAR", "Function dan statistik dasar", "Di akhir sesi, siswa dapat membuat function untuk mengolah list angka");
  addNumberedItem(slide, 1, "Membuat function", "Menggunakan def, nama function, dan blok instruksi.", 72, 212, 500);
  addNumberedItem(slide, 2, "Mengembalikan nilai", "Membedakan print() dengan return.", 650, 212, 500);
  addNumberedItem(slide, 3, "Mengolah data", "Menghitung mean, median, modus, dan rentang.", 72, 336, 500);
  addNumberedItem(slide, 4, "Membaca penyebaran", "Menjelaskan variasi dan standar deviasi.", 650, 336, 500);
  addCallout(slide, "Data masuk, function menghitung, hasil membantu kita membaca data.", { left: 72, top: 512, width: 1136, height: 70 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  setNotes(slide, "Gunakan slide ini sebagai peta sesi. Tekankan bahwa function menjadi jembatan dari Python dasar ke pengolahan data.");
}

// Slide 3: function concept
{
  const slide = newContentSlide("FUNCTION", "Function menyimpan langkah yang dipakai berulang", "Loop mengulang langkah. Function memberi nama pada langkah tersebut");
  addCodeBlock(slide, `def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Alya")`, { left: 72, top: 200, width: 560, height: 290 }, { name: "function-code", fontSize: 19 });
  addText(slide, "Satu function memiliki tiga bagian penting", { left: 714, top: 202, width: 430, height: 28 }, { typeface: FONTS.text, fontSize: 21, color: COLORS.navy, bold: true });
  const parts = [
    ["def", "kata kunci untuk membuat function", COLORS.bluePale, COLORS.blueDark],
    ["sapa", "nama yang dipanggil saat function digunakan", COLORS.yellowPale, COLORS.navy],
    ["nama", "input yang diterima function", COLORS.greenPale, COLORS.navy],
  ];
  parts.forEach(([label, desc, fill, color], index) => {
    const y = 260 + index * 78;
    addBox(slide, { left: 714, top: y, width: 130, height: 48 }, fill, { style: "solid", fill: color, width: 1 }, "roundRect");
    addText(slide, label, { left: 728, top: y + 12, width: 102, height: 24 }, { typeface: FONTS.mono, fontSize: 19, color, bold: true, alignment: "center" });
    addText(slide, desc, { left: 870, top: y + 8, width: 300, height: 38 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.body });
  });
  addCallout(slide, "Function dipanggil dengan menuliskan namanya.", { left: 72, top: 540, width: 560, height: 58 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  setNotes(slide, "Hubungkan dengan loop sebelumnya. Siswa sudah belajar menulis instruksi berulang. Sekarang instruksi dapat dibungkus dalam nama yang bisa dipanggil kembali.");
}

// Slide 4: print vs return
{
  const slide = newContentSlide("RETURN", "print() menampilkan, return mengembalikan", "Untuk function statistik, hasil perlu dikembalikan agar bisa dipakai lagi");
  addBox(slide, { left: 72, top: 202, width: 520, height: 310 }, COLORS.bluePale, { style: "solid", fill: COLORS.blue, width: 1 }, "roundRect");
  addText(slide, "print()", { left: 96, top: 224, width: 200, height: 34 }, { typeface: FONTS.display, fontSize: 26, color: COLORS.blueDark, bold: true });
  addText(slide, "Hasil terlihat di layar", { left: 96, top: 264, width: 360, height: 26 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.body });
  addCodeBlock(slide, `def luas_print(p, l):\n    print(p * l)\n\nluas_print(4, 3)`, { left: 96, top: 316, width: 462, height: 160 }, { name: "print-code", fontSize: 16 });
  addBox(slide, { left: 688, top: 202, width: 520, height: 310 }, COLORS.yellowPale, { style: "solid", fill: COLORS.yellow, width: 1 }, "roundRect");
  addText(slide, "return", { left: 712, top: 224, width: 200, height: 34 }, { typeface: FONTS.display, fontSize: 26, color: COLORS.navy, bold: true });
  addText(slide, "Nilai bisa disimpan dan dihitung lagi", { left: 712, top: 264, width: 400, height: 26 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.body });
  addCodeBlock(slide, `def luas_return(p, l):\n    return p * l\n\nhasil = luas_return(4, 3)\nprint(hasil + 2)`, { left: 712, top: 316, width: 462, height: 160 }, { name: "return-code", fontSize: 16 });
  addCallout(slide, "print() → layar        return → nilai yang bisa dipakai", { left: 72, top: 548, width: 1136, height: 58 }, COLORS.grey2, COLORS.grey, COLORS.navy);
  setNotes(slide, "Tekankan perbedaan perilaku. Untuk function mean, median, dan standar deviasi, siswa harus memakai return karena hasil perhitungan akan dipakai di luar function.");
}

// Slide 5: parameter
{
  const slide = newContentSlide("PARAMETER", "Parameter membuat function bisa dipakai untuk banyak data", "Parameter adalah nama untuk input yang diterima function");
  addCodeBlock(slide, `def luas_persegi(panjang, lebar):\n    return panjang * lebar\n\nluas_persegi(4, 3)\nluas_persegi(10, 2)`, { left: 72, top: 208, width: 590, height: 300 }, { name: "parameter-code", fontSize: 18 });
  addText(slide, "Parameter dan argument", { left: 752, top: 214, width: 380, height: 30 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  const rows = [
    ["Parameter", "panjang, lebar", COLORS.bluePale],
    ["Argument", "4, 3 atau 10, 2", COLORS.yellowPale],
    ["Hasil", "12 atau 20", COLORS.greenPale],
  ];
  rows.forEach(([label, value, fill], index) => {
    const y = 288 + index * 76;
    addBox(slide, { left: 752, top: y, width: 152, height: 52 }, fill, { style: "solid", fill: COLORS.grey, width: 1 }, "rect");
    addText(slide, label, { left: 768, top: y + 15, width: 120, height: 22 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.navy, bold: true });
    addBox(slide, { left: 918, top: y, width: 250, height: 52 }, COLORS.white, { style: "solid", fill: COLORS.grey, width: 1 }, "rect");
    addText(slide, value, { left: 936, top: y + 15, width: 214, height: 22 }, { typeface: FONTS.mono, fontSize: 16, color: COLORS.navy });
  });
  addCallout(slide, "Satu function, banyak kemungkinan input.", { left: 752, top: 530, width: 416, height: 58 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  setNotes(slide, "Gunakan contoh luas untuk menunjukkan bahwa parameter membuat function tidak terikat pada satu angka tertentu. Hubungkan dengan data list pada slide mean.");
}

// Slide 6: mean example
{
  const slide = newContentSlide("CONTOH FUNCTION", "Mean menjadi function pertama untuk data", "Function menerima list, menghitung jumlah, lalu mengembalikan rata-rata");
  addCodeBlock(slide, `def hitung_mean(data):\n    total = 0\n\n    for nilai in data:\n        total += nilai\n\n    return total / len(data)\n\nnilai = [70, 80, 75, 90]\nprint(hitung_mean(nilai))`, { left: 72, top: 192, width: 600, height: 370 }, { name: "mean-code", fontSize: 17 });
  addText(slide, "Rumus mean", { left: 756, top: 204, width: 300, height: 30 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  addCallout(slide, "mean = jumlah seluruh nilai / banyak data", { left: 756, top: 252, width: 420, height: 60 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  addText(slide, "Proses function", { left: 756, top: 348, width: 300, height: 28 }, { typeface: FONTS.display, fontSize: 22, color: COLORS.navy, bold: true });
  const flow = [
    ["list", "70, 80, 75, 90", COLORS.bluePale],
    ["jumlah", "315", COLORS.yellowPale],
    ["mean", "78.75", COLORS.greenPale],
  ];
  flow.forEach(([label, value, fill], index) => {
    const x = 756 + index * 140;
    addBox(slide, { left: x, top: 402, width: 112, height: 70 }, fill, { style: "solid", fill: COLORS.grey, width: 1 }, "roundRect");
    addText(slide, label, { left: x + 8, top: 414, width: 96, height: 20 }, { typeface: FONTS.text, fontSize: 15, color: COLORS.body, bold: true, alignment: "center" });
    addText(slide, value, { left: x + 8, top: 440, width: 96, height: 20 }, { typeface: FONTS.mono, fontSize: 15, color: COLORS.navy, alignment: "center" });
    if (index < flow.length - 1) addArrow(slide, x + 116, 426, 18, 20, "#B6C7D5");
  });
  addText(slide, "Perulangan dari pertemuan sebelumnya membantu menjumlahkan nilai.", { left: 756, top: 520, width: 414, height: 44 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.body });
  setNotes(slide, "Gunakan contoh ini untuk memperlihatkan bahwa function dapat menggabungkan konsep def, parameter, for loop, return, dan list.");
}

// Slide 7: hands-on 1
{
  const slide = newContentSlide("HANDS-ON 1  •  10 MENIT", "Tiga statistik sederhana", "Tulis function yang mengembalikan median, modus, dan rentang");
  addBox(slide, { left: 72, top: 204, width: 520, height: 328 }, COLORS.yellowPale, { style: "solid", fill: COLORS.yellow, width: 1 }, "roundRect");
  addText(slide, "Dataset", { left: 96, top: 228, width: 180, height: 28 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  addCodeBlock(slide, `data_nilai = [72, 85, 72,\n              90, 68, 75,\n              85, 72, 88]`, { left: 96, top: 278, width: 462, height: 146 }, { name: "hands-on-one-data", fontSize: 17 });
  addText(slide, "Gunakan data baru ini. Jangan menyalin function mean.", { left: 96, top: 454, width: 440, height: 44 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.body, bold: true });
  addBox(slide, { left: 654, top: 204, width: 554, height: 328 }, COLORS.bluePale, { style: "solid", fill: COLORS.blue, width: 1 }, "roundRect");
  addText(slide, "Tugas", { left: 680, top: 228, width: 180, height: 28 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  addBulletList(slide, [
    "Buat hitung_median(data)",
    "Buat hitung_modus(data)",
    "Buat hitung_rentang(data)",
    "Gunakan return dan parameter data",
    "Tampilkan hasil dengan print()",
  ], { left: 680, top: 278, width: 480, height: 184 }, { fontSize: 18, color: COLORS.body, spaceAfterPoints: 5 });
  addCallout(slide, "Batasan: jangan gunakan statistics.median atau statistics.mode.", { left: 680, top: 474, width: 480, height: 42 }, COLORS.white, COLORS.blue, COLORS.navy);
  addText(slide, "Ingat", { left: 72, top: 550, width: 120, height: 24 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.blueDark, bold: true });
  const definitions = [
    ["Median", "nilai tengah setelah data diurutkan", COLORS.bluePale, COLORS.blue],
    ["Modus", "nilai yang paling sering muncul", COLORS.yellowPale, COLORS.yellow],
    ["Rentang", "nilai terbesar dikurangi nilai terkecil", COLORS.greenPale, COLORS.green],
  ];
  definitions.forEach(([term, description, fill, line], index) => {
    const left = 72 + index * 378;
    addBox(slide, { left, top: 578, width: 350, height: 70 }, fill, { style: "solid", fill: line, width: 1 }, "roundRect");
    addText(slide, term, { left: left + 16, top: 590, width: 110, height: 22 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.navy, bold: true });
    addText(slide, description, { left: left + 16, top: 616, width: 318, height: 24 }, { typeface: FONTS.text, fontSize: 15, color: COLORS.body });
  });
  setNotes(slide, "Jangan tampilkan jawaban di slide. Sediakan starter cell di notebook hanya berisi dataset dan nama function. Minta siswa mengetik implementasinya sendiri.");
}

// Slide 8: recursion
{
  const slide = newContentSlide("EXTENSION", "Recursive function memanggil dirinya sendiri", "Setiap pemanggilan harus mendekati kondisi berhenti");
  addCodeBlock(slide, `def hitung_mundur(n):\n    if n == 0:\n        return\n\n    print(n)\n    hitung_mundur(n - 1)\n\nhitung_mundur(3)`, { left: 72, top: 200, width: 560, height: 340 }, { name: "recursive-code", fontSize: 17 });
  addText(slide, "Pola recursive", { left: 716, top: 214, width: 300, height: 28 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  const steps = [
    ["3", "cetak 3", COLORS.bluePale],
    ["2", "cetak 2", COLORS.bluePale],
    ["1", "cetak 1", COLORS.greenPale],
    ["0", "berhenti", COLORS.redPale],
  ];
  steps.forEach(([n, label, fill], index) => {
    const y = 276 + index * 66;
    addBox(slide, { left: 716, top: y, width: 78, height: 42 }, fill, { style: "solid", fill: COLORS.grey, width: 1 }, "roundRect");
    addText(slide, n, { left: 730, top: y + 9, width: 50, height: 24 }, { typeface: FONTS.mono, fontSize: 20, color: COLORS.navy, bold: true, alignment: "center" });
    addText(slide, label, { left: 824, top: y + 9, width: 210, height: 24 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.body, bold: index === 3 });
    if (index < steps.length - 1) addArrow(slide, 748, y + 46, 16, 12, "#B6C7D5");
  });
  addCallout(slide, "Kondisi berhenti mencegah function berjalan tanpa akhir.", { left: 716, top: 560, width: 430, height: 52 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  setNotes(slide, "Sampaikan sebagai extension. Fokus pada dua ide: base case dan recursive call. Tidak perlu menghubungkan recursion ke perhitungan statistik pada sesi ini.");
}

// Slide 9: Fibonacci demo
{
  const slide = newContentSlide("DEMO PRACTICE", "Bilangan Fibonacci", "Setiap angka berasal dari dua angka sebelumnya");
  addCodeBlock(slide, `def fibonacci(n):
    if n <= 1:
        return n

    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(8):
    print(fibonacci(i))`, { left: 72, top: 194, width: 560, height: 350 }, { name: "fibonacci-code", fontSize: 17 });
  addText(slide, "Pola angka", { left: 704, top: 204, width: 240, height: 28 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  addText(slide, "0, 1, 1, 2, 3, 5, 8, 13", { left: 704, top: 248, width: 450, height: 34 }, { typeface: FONTS.mono, fontSize: 22, color: COLORS.navy, bold: true });
  const sequence = [0, 1, 1, 2, 3, 5, 8, 13];
  sequence.forEach((value, index) => {
    const left = 704 + index * 59;
    const fill = index < 2 ? COLORS.bluePale : (index % 2 ? COLORS.yellowPale : COLORS.greenPale);
    addCircle(slide, left, 322, 42, fill, { style: "solid", fill: COLORS.grey, width: 1 });
    addText(slide, String(value), { left: left + 4, top: 333, width: 34, height: 20 }, { typeface: FONTS.mono, fontSize: 15, color: COLORS.navy, bold: true, alignment: "center" });
    if (index < sequence.length - 1) addArrow(slide, left + 44, 337, 12, 10, "#B6C7D5");
  });
  addText(slide, "angka baru = dua angka sebelumnya dijumlahkan", { left: 704, top: 386, width: 456, height: 26 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.body, bold: true });
  addCallout(slide, "fibonacci(5) = fibonacci(4) + fibonacci(3)", { left: 704, top: 438, width: 456, height: 60 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  addText(slide, "Gunakan slide ini sebagai persiapan demo recursive call.", { left: 704, top: 526, width: 456, height: 28 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.body });
  setNotes(slide, "Gunakan pola angka sebagai pembuka. Lalu jalankan fibonacci(5) dan gambarkan pemanggilan function secara manual. Fokuskan demo pada base case dan dua pemanggilan sebelumnya.");
}

// Slide 10: variation
{
  const slide = newContentSlide("VARIASI", "Variasi menunjukkan seberapa menyebar data", "Dua dataset dapat memiliki mean yang sama dengan penyebaran yang berbeda");
  addText(slide, "Data A", { left: 112, top: 214, width: 160, height: 28 }, { typeface: FONTS.display, fontSize: 23, color: COLORS.navy, bold: true });
  addText(slide, "49, 50, 51", { left: 112, top: 248, width: 220, height: 24 }, { typeface: FONTS.mono, fontSize: 17, color: COLORS.body });
  addDotPlot(slide, [49, 50, 51], { left: 112, top: 290, width: 430, height: 100 }, { min: 0, max: 100, ticks: [0, 50, 100], dotColor: COLORS.blue });
  addCallout(slide, "Mean = 50\nVariasi kecil", { left: 112, top: 420, width: 260, height: 70 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  addText(slide, "Data B", { left: 678, top: 214, width: 160, height: 28 }, { typeface: FONTS.display, fontSize: 23, color: COLORS.navy, bold: true });
  addText(slide, "20, 50, 80", { left: 678, top: 248, width: 220, height: 24 }, { typeface: FONTS.mono, fontSize: 17, color: COLORS.body });
  addDotPlot(slide, [20, 50, 80], { left: 678, top: 290, width: 430, height: 100 }, { min: 0, max: 100, ticks: [0, 50, 100], dotColor: COLORS.yellow });
  addCallout(slide, "Mean = 50\nVariasi besar", { left: 678, top: 420, width: 260, height: 70 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  addCallout(slide, "Mean memberi tahu pusat data. Variasi memberi tahu seberapa jauh data menyebar.", { left: 112, top: 550, width: 996, height: 56 }, COLORS.grey2, COLORS.grey, COLORS.navy);
  setNotes(slide, "Gunakan dot plot untuk menunjukkan bahwa mean saja belum cukup. Siswa perlu melihat posisi setiap nilai terhadap pusat data.");
}

// Slide 10: use of variation
{
  const slide = newContentSlide("PENGOLAHAN DATA", "Variasi membantu membaca kondisi data", "Ukuran penyebaran membantu kita memahami konsistensi dan nilai yang tidak biasa");
  addText(slide, "Contoh: dua kelas memiliki mean 80", { left: 72, top: 202, width: 440, height: 28 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  addText(slide, "Kelas A", { left: 112, top: 264, width: 160, height: 24 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.navy, bold: true });
  addDotPlot(slide, [78, 79, 80, 81, 82], { left: 112, top: 292, width: 420, height: 100 }, { min: 50, max: 110, ticks: [50, 80, 110], dotColor: COLORS.blue });
  addText(slide, "Kelas B", { left: 112, top: 420, width: 160, height: 24 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.navy, bold: true });
  addDotPlot(slide, [60, 70, 80, 90, 100], { left: 112, top: 448, width: 420, height: 100 }, { min: 50, max: 110, ticks: [50, 80, 110], dotColor: COLORS.yellow });
  addBulletList(slide, [
    "Membandingkan konsistensi kelompok",
    "Mendeteksi nilai yang jauh dari pusat data",
    "Membantu menentukan kebutuhan standardisasi",
    "Membaca noise dalam pengukuran",
  ], { left: 676, top: 264, width: 470, height: 210 }, { fontSize: 19, color: COLORS.body, spaceAfterPoints: 7 });
  addCallout(slide, "Kelas A lebih konsisten karena nilai-nilainya lebih dekat dengan mean.", { left: 676, top: 510, width: 470, height: 64 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  setNotes(slide, "Tekankan bahwa variasi memiliki fungsi praktis dalam pengolahan data. Data dengan mean sama dapat memiliki tingkat konsistensi yang berbeda.");
}

// Slide 11: standard deviation
{
  const slide = newContentSlide("STANDAR DEVIASI", "Standar deviasi mengukur jarak data dari mean", "Standar deviasi adalah akar dari variansi");
  addText(slide, "Rumus", { left: 72, top: 204, width: 150, height: 28 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  addCallout(slide, "variansi = Σ(xᵢ - μ)² / n", { left: 72, top: 252, width: 500, height: 62 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  addCallout(slide, "standar deviasi = √variansi", { left: 72, top: 334, width: 500, height: 62 }, COLORS.yellowPale, COLORS.yellow, COLORS.navy);
  addText(slide, "Contoh kecil", { left: 72, top: 438, width: 200, height: 26 }, { typeface: FONTS.display, fontSize: 22, color: COLORS.navy, bold: true });
  addText(slide, "Data: 3, 5, 7     Mean: 5", { left: 72, top: 474, width: 500, height: 26 }, { typeface: FONTS.mono, fontSize: 17, color: COLORS.body });
  addText(slide, "Selisih: -2, 0, +2     Kuadrat: 4, 0, 4", { left: 72, top: 512, width: 560, height: 26 }, { typeface: FONTS.mono, fontSize: 16, color: COLORS.body });
  addText(slide, "Langkah perhitungan", { left: 704, top: 204, width: 320, height: 28 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  const calc = [
    ["1", "Hitung mean", COLORS.bluePale],
    ["2", "Cari selisih setiap nilai", COLORS.bluePale],
    ["3", "Kuadratkan selisih", COLORS.yellowPale],
    ["4", "Hitung variansi", COLORS.yellowPale],
    ["5", "Ambil akar kuadrat", COLORS.greenPale],
  ];
  calc.forEach(([num, label, fill], index) => {
    const y = 264 + index * 62;
    addBox(slide, { left: 704, top: y, width: 40, height: 40 }, fill, { style: "solid", fill: COLORS.grey, width: 1 }, "roundRect");
    addText(slide, num, { left: 714, top: y + 8, width: 20, height: 22 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.navy, bold: true, alignment: "center" });
    addText(slide, label, { left: 770, top: y + 8, width: 360, height: 24 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.body });
  });
  addCallout(slide, "Satuannya kembali ke satuan data asli.", { left: 704, top: 590, width: 430, height: 42 }, COLORS.grey2, COLORS.grey, COLORS.navy);
  setNotes(slide, "Jelaskan bahwa variansi memakai kuadrat agar selisih negatif dan positif tidak saling menghapus. Akar kuadrat mengembalikan skala ke satuan asli.");
}

// Slide 12: use of standard deviation
{
  const slide = newContentSlide("PENGOLAHAN DATA", "Standar deviasi membantu membaca penyebaran", "Nilai standar deviasi kecil menunjukkan data yang lebih rapat di sekitar mean");
  addText(slide, "Penyebaran kecil", { left: 88, top: 210, width: 220, height: 26 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.navy, bold: true });
  addSimpleHistogram(slide, [2, 5, 9, 12, 9, 5, 2], { left: 88, top: 254, width: 440, height: 180 }, { fill: COLORS.blue });
  addText(slide, "Penyebaran besar", { left: 88, top: 472, width: 220, height: 26 }, { typeface: FONTS.text, fontSize: 18, color: COLORS.navy, bold: true });
  addSimpleHistogram(slide, [8, 8, 8, 8, 8, 8, 8], { left: 88, top: 516, width: 440, height: 120 }, { fill: COLORS.yellow });
  addText(slide, "Kegunaan", { left: 680, top: 210, width: 240, height: 30 }, { typeface: FONTS.display, fontSize: 25, color: COLORS.navy, bold: true });
  addBulletList(slide, [
    "Membandingkan konsistensi data",
    "Mendeteksi nilai yang jauh dari mean",
    "Mengukur variasi hasil pengukuran",
    "Membantu standardisasi fitur",
  ], { left: 680, top: 264, width: 470, height: 190 }, { fontSize: 19, color: COLORS.body, spaceAfterPoints: 8 });
  addCallout(slide, "z = (nilai - mean) / standar deviasi", { left: 680, top: 492, width: 470, height: 62 }, COLORS.bluePale, COLORS.blue, COLORS.navy);
  addText(slide, "z-score menunjukkan posisi sebuah nilai relatif terhadap mean.", { left: 680, top: 580, width: 470, height: 32 }, { typeface: FONTS.text, fontSize: 16, color: COLORS.body });
  setNotes(slide, "Grafik di kiri bersifat ilustratif. Fokuskan pembahasan pada bentuk penyebaran, bukan pada nilai statistik grafik.");
}

// Slide 13: hands-on 2
{
  const slide = newContentSlide("HANDS-ON 2  •  10 MENIT", "Function variansi dan standar deviasi", "Gunakan kembali function mean untuk membangun perhitungan berikutnya");
  addBox(slide, { left: 72, top: 204, width: 492, height: 324 }, COLORS.bluePale, { style: "solid", fill: COLORS.blue, width: 1 }, "roundRect");
  addText(slide, "Data", { left: 96, top: 228, width: 140, height: 28 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  addCodeBlock(slide, `data_a = [28, 30, 31, 29, 32]\ndata_b = [10, 20, 30, 40, 50]`, { left: 96, top: 280, width: 438, height: 122 }, { name: "hands-on-two-data", fontSize: 17 });
  addText(slide, "Kedua data memiliki mean yang sama.", { left: 96, top: 438, width: 390, height: 28 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.body, bold: true });
  addText(slide, "Bandingkan standar deviasinya.", { left: 96, top: 474, width: 390, height: 28 }, { typeface: FONTS.text, fontSize: 17, color: COLORS.body });
  addBox(slide, { left: 626, top: 204, width: 582, height: 324 }, COLORS.yellowPale, { style: "solid", fill: COLORS.yellow, width: 1 }, "roundRect");
  addText(slide, "Tugas", { left: 650, top: 228, width: 160, height: 28 }, { typeface: FONTS.display, fontSize: 24, color: COLORS.navy, bold: true });
  addBulletList(slide, [
    "Buat hitung_variansi(data)",
    "Buat hitung_standar_deviasi(data)",
    "Panggil kembali hitung_mean(data)",
    "Gunakan math.sqrt untuk akar kuadrat",
    "Tentukan data yang lebih menyebar",
  ], { left: 650, top: 278, width: 500, height: 190 }, { fontSize: 18, color: COLORS.body, spaceAfterPoints: 5 });
  addCallout(slide, "Jangan gunakan statistics.pvariance, statistics.stdev, atau numpy.std.", { left: 650, top: 482, width: 500, height: 42 }, COLORS.white, COLORS.yellow, COLORS.navy);
  setNotes(slide, "Sediakan starter cell yang berisi import math, dua dataset, dan function kosong. Siswa mengetik implementasinya. Minta mereka membandingkan hasil, bukan hanya mencetak angka.");
}

await fs.mkdir(tmpDir, { recursive: true });
await fs.mkdir(slidesDir, { recursive: true });
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

for (let index = 0; index < presentation.slides.items.length; index += 1) {
  const slide = presentation.slides.items[index];
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(slidesDir, `slide-${String(index + 1).padStart(2, "0")}.png`), new Uint8Array(await preview.arrayBuffer()));
  const layout = await presentation.export({ slide, format: "layout" });
  await fs.writeFile(path.join(slidesDir, `slide-${String(index + 1).padStart(2, "0")}.layout.json`), await layout.text());
}

console.log(JSON.stringify({ candidatePath, slidesDir, slideCount: presentation.slides.items.length }, null, 2));
