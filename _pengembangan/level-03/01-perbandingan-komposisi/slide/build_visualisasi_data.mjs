import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SKILL_DIR = "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations";
const TASK_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-03/01-perbandingan-komposisi/slide";
const OUTPUT_DIR = "/Users/daf2a/Documents/python/level-03/01-perbandingan-komposisi/slide";
const FINAL_PPTX = path.join(OUTPUT_DIR, "Visualisasi_Data_Perbandingan_dan_Komposisi_skillupdate.pptx");
const referencePath = "/Users/daf2a/.codex/skills/artifact-template-materi-ekka/assets/reference.pptx";
const referenceSha256 = "7bf8bffbccc67d7f85811a43c435e7e5269d5882207e8f97bf5f5131ed003ca8";
const RUNTIME_PYTHON = "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const colors = {
  navy: "#111A30",
  secondary: "#4B5868",
  blue: "#4FB6E8",
  blueDark: "#196B9B",
  bluePale: "#EAF6FC",
  yellow: "#F5D36A",
  yellowPale: "#FFF7D6",
  green: "#55B77A",
  orange: "#D99A37",
  rule: "#E7EAEE",
  white: "#FFFFFF",
  slate: "#B6C7D5",
};
const FONT_DISPLAY = "SF Pro Display";
const FONT_TEXT = "SF Pro Text";
const FONT_MONO = "SF Mono";
const SW = 1280;
const SH = 720;
const LEFT = 72;
const RIGHT = 1208;
const CONTENT_TOP = 188;
const CONTENT_BOTTOM = 660;

const { finalizePresentation, makeNativeBulletParagraphs, applyPresentationChartFont } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href
);

await fs.mkdir(TASK_DIR, { recursive: true });
await fs.mkdir(path.join(TASK_DIR, "rendered"), { recursive: true });
await fs.mkdir(OUTPUT_DIR, { recursive: true });

const presentation = Presentation.create({ slideSize: { width: SW, height: SH } });

function addText(slide, value, box, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: box,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: style.typeface ?? FONT_TEXT,
    fontSize: style.fontSize ?? 21,
    color: style.color ?? colors.secondary,
    bold: style.bold ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
    wrap: "square",
    autoFit: style.autoFit ?? "shrinkText",
    lineSpacing: style.lineSpacing ?? 1.06,
    insets: style.insets ?? 0,
  };
  return shape;
}

function addSlide(title, subtitle) {
  const slide = presentation.slides.add();
  slide.background.fill = colors.white;
  addText(slide, title, { left: LEFT, top: 44, width: 1136, height: 56 }, {
    typeface: FONT_DISPLAY,
    fontSize: 40,
    color: colors.navy,
    bold: true,
    verticalAlignment: "middle",
  });
  addText(slide, subtitle, { left: LEFT, top: 106, width: 1136, height: 42 }, {
    fontSize: 20,
    color: colors.secondary,
    verticalAlignment: "middle",
  });
  slide.shapes.add({
    geometry: "line",
    position: { left: LEFT, top: 165, width: 1136, height: 0 },
    fill: "none",
    line: { style: "solid", fill: colors.rule, width: 1.25 },
  });
  return slide;
}

function addBullets(slide, items, box, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: box,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = makeNativeBulletParagraphs(items, {
    marginLeftPoints: options.marginLeftPoints ?? 20,
    hangingPoints: options.hangingPoints ?? 10,
    spaceAfterPoints: options.spaceAfterPoints ?? 12,
  });
  shape.text.style = {
    typeface: FONT_TEXT,
    fontSize: options.fontSize ?? 21,
    color: options.color ?? colors.secondary,
    autoFit: "shrinkText",
    wrap: "square",
    insets: 0,
    lineSpacing: 1.1,
  };
  return shape;
}

function addCode(slide, value, box) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: box,
    fill: colors.navy,
    line: { style: "solid", fill: colors.navy, width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT_MONO,
    fontSize: 16,
    color: colors.white,
    autoFit: "shrinkText",
    wrap: "square",
    insets: { top: 14, right: 16, bottom: 14, left: 16 },
    lineSpacing: 1.05,
  };
  return shape;
}

function addTable(slide, matrix, box, options = {}) {
  const rowCount = matrix.length;
  const columnCount = matrix[0].length;
  const table = slide.tables.add({
    rows: rowCount,
    columns: columnCount,
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
    values: matrix,
    columnWidths: options.columnWidths,
  });
  table.styleOptions = { headerRow: false, bandedRows: false };
  table.borders.assign({ style: "solid", fill: colors.rule, width: 1 });
  const rowHeight = box.height / rowCount;
  for (let row = 0; row < rowCount; row += 1) {
    table.rows[row].height = rowHeight;
    for (let column = 0; column < columnCount; column += 1) {
      const cell = table.getCell(row, column);
      const header = row === 0;
      cell.fill = header ? colors.navy : (row % 2 === 1 ? colors.bluePale : colors.white);
      cell.text.style = {
        typeface: FONT_TEXT,
        fontSize: options.fontSize ?? 18,
        color: header ? colors.white : colors.navy,
        bold: header || column === 0,
        alignment: column === 0 ? "left" : "center",
        verticalAlignment: "middle",
        wrap: "square",
        autoFit: "shrinkText",
        insets: { top: 8, right: 10, bottom: 8, left: 10 },
      };
    }
  }
  return table;
}

function addChart(slide, type, config) {
  const chart = slide.charts.add(type, {
    chartFill: colors.white,
    plotAreaFill: colors.white,
    chartLine: { style: "solid", fill: "none", width: 0 },
    plotAreaLine: { style: "solid", fill: "none", width: 0 },
    titlePlacement: "aboveChart",
    titleTextStyle: { fill: colors.navy, fontSize: 18, bold: true },
    ...config,
  });
  applyPresentationChartFont(chart, { fontFamily: FONT_TEXT });
  return chart;
}

function setNotes(slide, lines) {
  slide.speakerNotes.text = lines.join("\n");
}

async function addCover(title, file, alt) {
  const slide = presentation.slides.add();
  slide.background.fill = colors.white;
  const bytes = await fs.readFile(file);
  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  slide.images.add({ blob, contentType: "image/png", alt, fit: "contain", position: { left: 0, top: 0, width: SW, height: SH } });
  addText(slide, title, { left: 78, top: 228, width: 470, height: 260 }, {
    typeface: FONT_DISPLAY, fontSize: 52, color: colors.navy, bold: true, verticalAlignment: "middle",
  });
  return slide;
}

const branchColors = [colors.blue, colors.yellow, colors.green];
const categoryColors = [colors.blue, colors.yellow, colors.green, colors.blueDark, colors.orange];
const categories = ["Buku", "Alat Tulis", "Makanan", "Minuman", "Aksesori"];
const branchValues = {
  Utara: [32, 25, 40, 33, 18],
  Tengah: [26, 34, 35, 28, 21],
  Selatan: [22, 28, 44, 31, 25],
};
const totalsByCategory = [80, 87, 119, 92, 64];
const sortedCategoryNames = ["Makanan", "Minuman", "Alat Tulis", "Buku", "Aksesori"];
const sortedCategoryValues = [119, 92, 87, 80, 64];

await addCover("Visualisasi Data\nPerbandingan dan Komposisi", path.join("/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/aset", "cover-1.png"), "Ilustrasi visualisasi perbandingan kategori dan komposisi");

// Slide 2
{
  const slide = addSlide(
    "Data penjualan festival sekolah",
    "Setiap baris merangkum unit terjual pada satu cabang dan satu kategori",
  );
  addTable(slide, [
    ["Cabang", "Buku", "Alat Tulis", "Makanan", "Minuman", "Aksesori"],
    ["Utara", 32, 25, 40, 33, 18],
    ["Tengah", 26, 34, 35, 28, 21],
    ["Selatan", 22, 28, 44, 31, 25],
  ], { left: 82, top: 224, width: 1116, height: 252 }, {
    columnWidths: [166, 170, 202, 190, 190, 198],
    fontSize: 19,
  });
  addText(slide, "Dataset contoh ini memakai jumlah barang terjual dalam satuan unit.", {
    left: 84, top: 520, width: 1100, height: 42,
  }, { fontSize: 19, color: colors.secondary });
  addText(slide, "Cabang dan kategori adalah label. Unit adalah nilai yang dibandingkan.", {
    left: 84, top: 568, width: 1100, height: 42,
  }, { fontSize: 20, color: colors.blueDark, bold: true });
}

// Slide 3
{
  const slide = addSlide(
    "Bentuk data memberi petunjuk awal",
    "Tentukan apa yang akan dibandingkan sebelum memilih jenis grafik",
  );
  addTable(slide, [
    ["Pertanyaan", "Susunan data", "Grafik yang cocok"],
    ["Nilai mana yang lebih besar?", "Kategori dan jumlah", "Bar chart"],
    ["Berapa banyak tiap pilihan?", "Satu baris per jawaban", "Count plot"],
    ["Bagaimana kategori berbeda antar cabang?", "Kategori, cabang, dan jumlah", "Grouped bar"],
    ["Bagaimana bagian membentuk total?", "Kategori sebagai bagian dari satu total", "Pie atau donut"],
    ["Bagaimana komposisi beberapa total?", "Kategori dan kelompok", "Stacked bar"],
    ["Bagaimana nilai terbagi secara bertingkat?", "Kelompok dan subkelompok", "Treemap"],
    ["Bagaimana profil kelompok pada indikator sama?", "Beberapa kelompok dan indikator", "Radar chart"],
  ], { left: 80, top: 194, width: 1120, height: 444 }, {
    columnWidths: [470, 390, 260],
    fontSize: 16,
  });
  setNotes(slide, [
    "Aturan pemilihan grafik merangkum bentuk data dan pertanyaan latihan.",
    "API agregasi Pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html",
    "API tabel pivot Pandas: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html",
  ]);
}

// Slide 4
{
  const slide = addSlide(
    "Bar chart membandingkan kategori",
    "Panjang atau tinggi batang menunjukkan nilai setiap kategori",
  );
  addChart(slide, "bar", {
    position: { left: 92, top: 198, width: 720, height: 420 },
    title: "Total unit per kategori",
    categories: sortedCategoryNames,
    series: [{ name: "Unit", values: sortedCategoryValues, fill: colors.blue }],
    hasLegend: false,
    barOptions: { direction: "bar", grouping: "clustered", gapWidth: 55 },
    dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: colors.navy, fontSize: 15 } },
    xAxis: { title: "Unit terjual", min: 0, majorGridlines: { style: "solid", fill: colors.rule, width: 1 }, textStyle: { fill: colors.secondary, fontSize: 14 } },
    yAxis: { textStyle: { fill: colors.secondary, fontSize: 15 }, majorGridlines: null },
  });
  addText(slide, "Perlu satu nilai untuk setiap kategori? Ringkas data dahulu, lalu tampilkan hasilnya.", {
    left: 850, top: 274, width: 320, height: 110,
  }, { fontSize: 22, color: colors.navy, bold: true });
  addCode(slide, 'ringkasan = (\n    data.groupby("Kategori", as_index=False)["Unit"]\n    .sum()\n)', { left: 850, top: 418, width: 325, height: 154 });
  addText(slide, "Gunakan bar chart horizontal ketika nama kategori panjang.", {
    left: 850, top: 594, width: 325, height: 50,
  }, { fontSize: 18, color: colors.secondary });
  setNotes(slide, [
    "Contoh API agregasi menggunakan Pandas DataFrame.groupby dan sum.",
    "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html",
    "Matplotlib bar chart: https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.bar.html",
  ]);
}

// Slide 5
{
  const slide = addSlide(
    "Count plot menghitung banyaknya pengamatan",
    "Satu baris mentah di sini mewakili satu pesanan",
  );
  addChart(slide, "bar", {
    position: { left: 80, top: 205, width: 690, height: 410 },
    title: "Jumlah pesanan per kategori",
    categories: ["Buku", "Alat Tulis", "Makanan", "Minuman", "Aksesori"],
    series: [{ name: "Pesanan", values: [4, 5, 7, 3, 2], fill: colors.yellow }],
    hasLegend: false,
    barOptions: { direction: "column", grouping: "clustered", gapWidth: 65 },
    dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: colors.navy, fontSize: 15 } },
    xAxis: { textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: null },
    yAxis: { title: "Jumlah pesanan", min: 0, majorGridlines: { style: "solid", fill: colors.rule, width: 1 }, textStyle: { fill: colors.secondary, fontSize: 14 } },
  });
  addTable(slide, [
    ["Kategori", "Unit", "Pesanan"],
    ["Buku", 80, 4],
    ["Alat Tulis", 87, 5],
    ["Makanan", 119, 7],
    ["Minuman", 92, 3],
    ["Aksesori", 64, 2],
  ], { left: 808, top: 225, width: 380, height: 330 }, {
    columnWidths: [176, 102, 102],
    fontSize: 17,
  });
  addText(slide, "Pesanan adalah frekuensi. Unit adalah jumlah barang.", {
    left: 812, top: 585, width: 370, height: 52,
  }, { fontSize: 19, color: colors.blueDark, bold: true });
  setNotes(slide, [
    "Count plot menghitung observasi mentah per kategori.",
    "Pandas Series.value_counts: https://pandas.pydata.org/docs/reference/api/pandas.Series.value_counts.html",
  ]);
}

// Slide 6
{
  const slide = addSlide(
    "Grouped bar membandingkan beberapa kelompok",
    "Batang berdampingan memudahkan perbandingan cabang pada kategori sama",
  );
  addChart(slide, "bar", {
    position: { left: 95, top: 205, width: 1085, height: 405 },
    title: "Unit terjual per kategori dan cabang",
    categories,
    series: [
      { name: "Utara", values: branchValues.Utara, fill: colors.blue },
      { name: "Tengah", values: branchValues.Tengah, fill: colors.yellow },
      { name: "Selatan", values: branchValues.Selatan, fill: colors.green },
    ],
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 15 } },
    barOptions: { direction: "column", grouping: "clustered", gapWidth: 85, overlap: 0 },
    xAxis: { title: "Kategori", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null },
    yAxis: { title: "Unit terjual", min: 0, majorGridlines: { style: "solid", fill: colors.rule, width: 1 }, textStyle: { fill: colors.secondary, fontSize: 14 } },
  });
  addText(slide, "Pivot menyusun kategori sebagai baris dan cabang sebagai seri grafik.", {
    left: 94, top: 624, width: 1080, height: 32,
  }, { fontSize: 18, color: colors.secondary });
  setNotes(slide, [
    "Pandas DataFrame.pivot menyusun ulang data tanpa agregasi karena setiap pasangan cabang dan kategori unik.",
    "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html",
  ]);
}

// Slide 7
{
  const slide = addSlide(
    "Practice Tengah: pilihan ekstrakurikuler",
    "Setiap respons siswa adalah satu baris data",
  );
  addTable(slide, [
    ["Kelas", "Sains", "Seni", "Olahraga"],
    ["X", 4, 2, 1],
    ["XI", 5, 3, 2],
    ["XII", 2, 4, 3],
  ], { left: 86, top: 228, width: 500, height: 258 }, {
    columnWidths: [140, 120, 120, 120],
    fontSize: 20,
  });
  addText(slide, "Ringkasan jumlah respons", { left: 90, top: 197, width: 500, height: 30 }, {
    fontSize: 18, color: colors.blueDark, bold: true,
  });
  addBullets(slide, [
    "Buat count plot untuk menghitung jumlah pilihan tiap ekstrakurikuler.",
    "Buat grouped bar untuk membandingkan pilihan antar kelas.",
    "Sebutkan pilihan terbanyak dan jumlah siswanya.",
  ], { left: 660, top: 229, width: 510, height: 310 }, { fontSize: 20, spaceAfterPoints: 18 });
  addText(slide, "Pada notebook, gunakan data satu respons per baris.", {
    left: 88, top: 536, width: 500, height: 44,
  }, { fontSize: 18, color: colors.secondary });
}

// Slide 8
{
  const slide = addSlide(
    "Stacked bar menunjukkan komposisi",
    "Jumlah total dan persentase menjawab dua pertanyaan berbeda",
  );
  addChart(slide, "bar", {
    position: { left: 72, top: 202, width: 552, height: 398 },
    title: "Stacked bar: jumlah unit",
    categories: ["Utara", "Tengah", "Selatan"],
    series: categories.map((name, index) => ({ name, values: [branchValues.Utara[index], branchValues.Tengah[index], branchValues.Selatan[index]], fill: categoryColors[index] })),
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 12 } },
    barOptions: { direction: "column", grouping: "stacked", gapWidth: 100, overlap: 100 },
    xAxis: { title: "Cabang", textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: null },
    yAxis: { title: "Unit terjual", min: 0, majorGridlines: { style: "solid", fill: colors.rule, width: 1 }, textStyle: { fill: colors.secondary, fontSize: 12 } },
  });
  const pct = [
    [21.6, 16.9, 27.0, 22.3, 12.2],
    [18.1, 23.6, 24.3, 19.4, 14.6],
    [14.7, 18.7, 29.3, 20.7, 16.7],
  ];
  addChart(slide, "bar", {
    position: { left: 650, top: 202, width: 558, height: 398 },
    title: "100% stacked bar: persentase",
    categories: ["Utara", "Tengah", "Selatan"],
    series: categories.map((name, index) => ({ name, values: pct.map((row) => row[index]), fill: categoryColors[index] })),
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 12 } },
    barOptions: { direction: "column", grouping: "stacked", gapWidth: 100, overlap: 100 },
    xAxis: { title: "Cabang", textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: null },
    yAxis: { title: "Bagian dari total cabang", min: 0, max: 100, numberFormatCode: "0", majorGridlines: { style: "solid", fill: colors.rule, width: 1 }, textStyle: { fill: colors.secondary, fontSize: 12 } },
  });
  addText(slide, "Stacked bar menampilkan jumlah. Versi 100% membandingkan proporsi.", {
    left: 88, top: 615, width: 1090, height: 34,
  }, { fontSize: 18, color: colors.blueDark, bold: true });
}

// Slide 9
{
  const slide = addSlide(
    "Pie chart dan donut chart menunjukkan bagian dari satu total",
    "Gunakan untuk membaca komposisi pada satu kelompok dengan sedikit kategori",
  );
  addChart(slide, "pie", {
    position: { left: 82, top: 196, width: 535, height: 430 },
    title: "Pie chart: cabang Utara",
    categories,
    series: [{ name: "Unit", values: branchValues.Utara, fill: colors.blue }],
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 13 } },
    dataLabels: { showPercent: true, textStyle: { fill: colors.navy, fontSize: 14 } },
  });
  addChart(slide, "doughnut", {
    position: { left: 650, top: 196, width: 548, height: 430 },
    title: "Donut chart: cabang Utara",
    categories,
    series: [{ name: "Unit", values: branchValues.Utara, fill: colors.blue }],
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 13 } },
    doughnutOptions: { holeSize: 52 },
    dataLabels: { showPercent: true, textStyle: { fill: colors.navy, fontSize: 14 } },
  });
  addText(slide, "Irisan berasal dari total 148 unit pada cabang Utara.", {
    left: 85, top: 633, width: 1090, height: 28,
  }, { fontSize: 17, color: colors.secondary });
}

// Slide 10
{
  const slide = addSlide(
    "Treemap menampilkan kategori bertingkat",
    "Ukuran kotak mengikuti jumlah unit pada cabang dan kategori",
  );
  addChart(slide, "treemap", {
    position: { left: 86, top: 195, width: 1100, height: 445 },
    title: "Unit terjual menurut cabang dan kategori",
    categories: branchValues.Utara.map((_, index) => categories[index]).concat(branchValues.Tengah.map((_, index) => categories[index]), branchValues.Selatan.map((_, index) => categories[index])),
    series: [{
      name: "Unit",
      values: branchValues.Utara.concat(branchValues.Tengah, branchValues.Selatan),
      categoryPaths: [
        ...categories.map((item) => ["Penjualan", "Utara", item]),
        ...categories.map((item) => ["Penjualan", "Tengah", item]),
        ...categories.map((item) => ["Penjualan", "Selatan", item]),
      ],
      fill: colors.blue,
    }],
    hasLegend: false,
    treemapOptions: { parentLabelLayout: "banner" },
    dataLabels: { showCategoryName: true, showValue: true, position: "center", textStyle: { fill: colors.navy, fontSize: 13 } },
  });
  addText(slide, "Warna membedakan kategori. Kotak di dalamnya menunjukkan cabang.", {
    left: 90, top: 637, width: 1080, height: 28,
  }, { fontSize: 18, color: colors.secondary });
  setNotes(slide, [
    "Treemap merepresentasikan data bertingkat sebagai persegi panjang bersarang.",
    "Dokumentasi Plotly Express: https://plotly.com/python/treemaps/",
  ]);
}

// Slide 11
{
  const slide = addSlide(
    "Radar chart membandingkan profil beberapa kelompok",
    "Setiap sumbu adalah kategori yang sama dan semua nilai memakai skala persentase",
  );
  const radarValues = [
    { name: "Utara", values: [21.6, 16.9, 27.0, 22.3, 12.2], line: { style: "solid", fill: colors.blueDark, width: 3 }, marker: { symbol: "circle", size: 6, fill: colors.blueDark } },
    { name: "Tengah", values: [18.1, 23.6, 24.3, 19.4, 14.6], line: { style: "solid", fill: colors.orange, width: 3 }, marker: { symbol: "circle", size: 6, fill: colors.orange } },
  ];
  addChart(slide, "radar", {
    position: { left: 230, top: 194, width: 820, height: 438 },
    title: "Persentase komposisi per cabang",
    categories,
    series: radarValues,
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 15 } },
    radarOptions: { style: "marker", varyColors: true },
    yAxis: { min: 0, max: 40, majorUnit: 10, textStyle: { fill: colors.secondary, fontSize: 12 }, majorGridlines: { style: "solid", fill: colors.rule, width: 1 } },
  });
  addText(slide, "Radar membantu membaca bentuk profil. Bar chart lebih mudah untuk membandingkan angka secara presisi.", {
    left: 90, top: 636, width: 1100, height: 32,
  }, { fontSize: 17, color: colors.secondary });
}

// Slide 12
{
  const slide = addSlide(
    "Practice Akhir: komposisi penjualan bazar",
    "Gunakan data baru untuk membandingkan stan dan kelompok produk",
  );
  addText(slide, "Ringkasan unit terjual", { left: 82, top: 196, width: 500, height: 32 }, {
    fontSize: 19, color: colors.blueDark, bold: true,
  });
  addTable(slide, [
    ["Stan", "Buku", "Alat Tulis", "Makanan", "Minuman"],
    ["Aula", 30, 26, 32, 30],
    ["Taman", 22, 34, 30, 30],
    ["Lapangan", 30, 30, 39, 36],
  ], { left: 80, top: 232, width: 526, height: 258 }, {
    columnWidths: [120, 70, 112, 112, 112],
    fontSize: 18,
  });
  addBullets(slide, [
    "Buat grouped bar untuk membandingkan kelompok produk antarstan.",
    "Buat stacked bar dan versi 100% stacked bar.",
    "Tampilkan bagian satu stan dengan pie dan donut.",
    "Gunakan treemap untuk melihat kelompok serta produk.",
    "Bandingkan profil persentase dua stan dengan radar chart.",
  ], { left: 660, top: 218, width: 530, height: 392 }, { fontSize: 18, spaceAfterPoints: 10 });
  addText(slide, "Di notebook tersedia rincian produk untuk setiap stan.", {
    left: 82, top: 524, width: 526, height: 38,
  }, { fontSize: 17, color: colors.secondary });
}

// Slide 13
{
  const slide = addSlide(
    "Ringkasan pemilihan grafik",
    "Baca pertanyaan dan bentuk data sebelum menulis kode",
  );
  addTable(slide, [
    ["Grafik", "Gunakan saat", "Yang dibandingkan"],
    ["Bar chart", "Membandingkan kategori", "Panjang batang"],
    ["Count plot", "Menghitung baris per kategori", "Frekuensi"],
    ["Grouped bar", "Membandingkan kelompok", "Batang berdampingan"],
    ["Stacked bar", "Melihat jumlah dan komponen", "Segmen dan total"],
    ["Pie atau donut", "Melihat bagian dari satu total", "Proporsi kategori"],
    ["Treemap", "Menampilkan kategori bertingkat", "Luas kotak"],
    ["Radar", "Membandingkan profil sekelompok indikator", "Bentuk profil"],
  ], { left: 82, top: 200, width: 1116, height: 436 }, {
    columnWidths: [210, 515, 391],
    fontSize: 17,
  });
}

// Slide 14
{
  const slide = addSlide(
    "Cek pemahaman",
    "Pilih grafik yang paling sesuai untuk setiap pertanyaan",
  );
  addTable(slide, [
    ["Pertanyaan", "Pilihan grafik"],
    ["Kategori minuman mana yang paling banyak dibeli?", ""],
    ["Bagaimana pilihan kegiatan berbeda antar kelas?", ""],
    ["Bagaimana bagian produk membentuk total pada satu stan?", ""],
    ["Produk mana saja yang membentuk kelompok bertingkat?", ""],
  ], { left: 92, top: 220, width: 1096, height: 330 }, {
    columnWidths: [820, 276],
    fontSize: 20,
  });
  addText(slide, "Jelaskan alasan dengan mengacu pada kategori, kelompok, atau nilai pada data.", {
    left: 94, top: 590, width: 1080, height: 44,
  }, { fontSize: 19, color: colors.blueDark, bold: true });
}

const slidePngs = [];
for (const [index, slide] of presentation.slides.items.entries()) {
  const filename = `slide-${String(index + 1).padStart(2, "0")}.png`;
  const blob = await presentation.export({ slide, format: "png", scale: 1 });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const imagePath = path.join(TASK_DIR, "rendered", filename);
  await fs.writeFile(imagePath, bytes);
  slidePngs.push(imagePath);
}

// Artifact Tool renders treemap in its slide renderer but currently omits that
// chart type from its PPTX export. Preserve the rendered data chart as an image.
const treemapPreviewPath = path.join(TASK_DIR, "rendered", "slide-10.png");
const treemapImagePath = path.join(TASK_DIR, "treemap-chart.png");
const cropResult = spawnSync(RUNTIME_PYTHON, ["-c", [
  "from PIL import Image",
  "import sys",
  "image = Image.open(sys.argv[1])",
  "image.crop((86, 195, 1186, 640)).save(sys.argv[2])",
].join("; "), treemapPreviewPath, treemapImagePath], { encoding: "utf8" });
if (cropResult.status !== 0) throw new Error(`Treemap image crop failed: ${cropResult.stderr}`);
const treemapBytes = await fs.readFile(treemapImagePath);
const treemapBlob = treemapBytes.buffer.slice(treemapBytes.byteOffset, treemapBytes.byteOffset + treemapBytes.byteLength);
presentation.slides.items[9].images.add({
  blob: treemapBlob,
  contentType: "image/png",
  alt: "Treemap penjualan menurut kategori dan cabang",
  fit: "contain",
  position: { left: 86, top: 195, width: 1100, height: 445 },
});

const candidatePath = path.join(TASK_DIR, "candidate.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const requiredNativeTableOwnerSlides = [2, 3, 7, 12, 13, 14];
const requiredNativeChartOwnerSlides = [4, 5, 6, 8, 9, 11];
const finalization = await finalizePresentation({
  workspaceDir: "/Users/daf2a/Documents/python",
  candidatePath,
  finalPath: FINAL_PPTX,
  materializeLiteralChartWorkbooks: true,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    ...requiredNativeTableOwnerSlides.flatMap((number) => ["--require-native-table-slide", String(number)]),
  ],
  explicitTotalSlideCount: 14,
  requiredNativeTableOwnerSlides,
  requiredNativeChartOwnerSlides,
  fontPolicy: {
    basis: "reference",
    families: [FONT_DISPLAY, FONT_TEXT, FONT_MONO],
    referencePath,
    referenceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath: path.join(TASK_DIR, "validation_skillupdate.json"),
});
console.log(JSON.stringify({ finalPath: FINAL_PPTX, slideCount: slidePngs.length, finalization }, null, 2));
