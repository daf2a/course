import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
import { chromium } from "playwright";

const SKILL_DIR = "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations";
const TASK_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan";
const RUNTIME_PYTHON = "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const NODE_CHROMIUM = "/Users/daf2a/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const referencePath = "/Users/daf2a/.codex/skills/artifact-template-materi-ekka/assets/reference.pptx";
const referenceSha256 = "7bf8bffbccc67d7f85811a43c435e7e5269d5882207e8f97bf5f5131ed003ca8";
const colors = {
  navy: "#111A30", secondary: "#4B5868", blue: "#4FB6E8", blueDark: "#196B9B",
  bluePale: "#EAF6FC", yellow: "#F5D36A", yellowPale: "#FFF7D6", green: "#55B77A",
  orange: "#D99A37", rule: "#E7EAEE", white: "#FFFFFF", slate: "#B6C7D5",
};
const FONT_DISPLAY = "SF Pro Display";
const FONT_TEXT = "SF Pro Text";
const FONT_MONO = "SF Mono";
const SW = 1280;
const SH = 720;
const LEFT = 72;
const RIGHT = 1208;

const { finalizePresentation, makeNativeBulletParagraphs, applyPresentationChartFont } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href
);

const VISUAL_DIR = path.join(TASK_DIR, "visuals");
const COVER_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/aset";
const pyResult = spawnSync(RUNTIME_PYTHON, [path.join(TASK_DIR, "make_visuals.py")], {
  encoding: "utf8",
  env: {
    ...process.env,
    PYTHONPATH: "/Users/daf2a/Documents/python/_arsip/proses-lain/visualisasi-python-deps:/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python",
  },
});
if (pyResult.status !== 0) throw new Error(`Visual preparation failed: ${pyResult.stderr}`);

const browser = await chromium.launch({ headless: true, executablePath: NODE_CHROMIUM });
for (const name of ["point_map", "choropleth"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 700 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(VISUAL_DIR, `${name}.html`)).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(4800);
  await page.screenshot({ path: path.join(VISUAL_DIR, `${name}.png`) });
  await page.close();
}
await browser.close();

function addText(slide, value, box, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox", position: box, fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: style.typeface ?? FONT_TEXT,
    fontSize: style.fontSize ?? 20,
    color: style.color ?? colors.secondary,
    bold: style.bold ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
    wrap: "square", autoFit: style.autoFit ?? "shrinkText",
    lineSpacing: style.lineSpacing ?? 1.06, insets: style.insets ?? 0,
  };
  return shape;
}

function addSlide(presentation, title, subtitle) {
  const slide = presentation.slides.add();
  slide.background.fill = colors.white;
  addText(slide, title, { left: LEFT, top: 42, width: 1136, height: 54 }, {
    typeface: FONT_DISPLAY, fontSize: 38, color: colors.navy, bold: true, verticalAlignment: "middle",
  });
  addText(slide, subtitle, { left: LEFT, top: 103, width: 1136, height: 42 }, {
    fontSize: 19, color: colors.secondary, verticalAlignment: "middle",
  });
  slide.shapes.add({
    geometry: "line", position: { left: LEFT, top: 164, width: 1136, height: 0 }, fill: "none",
    line: { style: "solid", fill: colors.rule, width: 1.25 },
  });
  return slide;
}

function addBullets(slide, items, box, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox", position: box, fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = makeNativeBulletParagraphs(items, {
    marginLeftPoints: options.marginLeftPoints ?? 18,
    hangingPoints: options.hangingPoints ?? 9,
    spaceAfterPoints: options.spaceAfterPoints ?? 11,
  });
  shape.text.style = {
    typeface: FONT_TEXT, fontSize: options.fontSize ?? 20,
    color: options.color ?? colors.secondary, autoFit: "shrinkText",
    wrap: "square", insets: 0, lineSpacing: 1.08,
  };
  return shape;
}

function addCode(slide, value, box, fontSize = 16) {
  const shape = slide.shapes.add({
    geometry: "textbox", position: box, fill: colors.navy,
    line: { style: "solid", fill: colors.navy, width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT_MONO, fontSize, color: colors.white,
    autoFit: "shrinkText", wrap: "square",
    insets: { top: 13, right: 15, bottom: 13, left: 15 }, lineSpacing: 1.03,
  };
  return shape;
}

function addTable(slide, matrix, box, options = {}) {
  const rowCount = matrix.length;
  const columnCount = matrix[0].length;
  const table = slide.tables.add({
    rows: rowCount, columns: columnCount, left: box.left, top: box.top,
    width: box.width, height: box.height, values: matrix, columnWidths: options.columnWidths,
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
        typeface: FONT_TEXT, fontSize: options.fontSize ?? 18,
        color: header ? colors.white : colors.navy,
        bold: header || (options.boldFirstColumn !== false && column === 0),
        alignment: header || column === 0 || options.firstColumnLeft ? "left" : "center",
        verticalAlignment: "middle", wrap: "square", autoFit: "shrinkText",
        insets: { top: 7, right: 9, bottom: 7, left: 9 },
      };
    }
  }
  return table;
}

function addChart(slide, type, config) {
  const chart = slide.charts.add(type, {
    chartFill: colors.white, plotAreaFill: colors.white,
    chartLine: { style: "solid", fill: "none", width: 0 },
    plotAreaLine: { style: "solid", fill: "none", width: 0 },
    titlePlacement: "aboveChart",
    titleTextStyle: { fill: colors.navy, fontSize: 17, bold: true },
    ...config,
  });
  applyPresentationChartFont(chart, { fontFamily: FONT_TEXT });
  return chart;
}

async function addImage(slide, file, position, alt) {
  const bytes = await fs.readFile(file);
  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  slide.images.add({ blob, contentType: "image/png", alt, fit: "contain", position });
}

async function addCover(presentation, title, file, alt) {
  const slide = presentation.slides.add();
  slide.background.fill = colors.white;
  await addImage(slide, file, { left: 0, top: 0, width: SW, height: SH }, alt);
  addText(slide, title, { left: 78, top: 225, width: 470, height: 260 }, {
    typeface: FONT_DISPLAY, fontSize: 52, color: colors.navy, bold: true, verticalAlignment: "middle",
  });
  return slide;
}

function notes(slide, lines) { slide.speakerNotes.text = lines.join("\n"); }
function axis(title, max, step = undefined) {
  return {
    title, ...(max === undefined ? {} : { min: 0, max }),
    ...(step === undefined ? {} : { majorUnit: step }),
    textStyle: { fill: colors.secondary, fontSize: 13 },
    majorGridlines: { style: "solid", fill: colors.rule, width: 1 },
  };
}

const salesMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
const seriesSales = [
  { name: "Utara", values: [42, 47, 45, 56, 62, 60], fill: colors.blueDark, line: { style: "solid", fill: colors.blueDark, width: 3 }, marker: { symbol: "circle", size: 7, fill: colors.blueDark } },
  { name: "Tengah", values: [35, 39, 44, 43, 51, 57], fill: colors.orange, line: { style: "solid", fill: colors.orange, width: 3 }, marker: { symbol: "circle", size: 7, fill: colors.orange } },
  { name: "Selatan", values: [28, 33, 31, 40, 44, 49], fill: colors.green, line: { style: "solid", fill: colors.green, width: 3 }, marker: { symbol: "circle", size: 7, fill: colors.green } },
];

async function buildMeeting2() {
  const taskDir = path.join(TASK_DIR, "meeting2");
  const outputDir = "/Users/daf2a/Documents/python/level-03/02-tren-perubahan/slide";
  const finalPath = path.join(outputDir, "Visualisasi_Data_Tren_dan_Perubahan_skillupdate.pptx");
  await fs.mkdir(path.join(taskDir, "rendered"), { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  const p = Presentation.create({ slideSize: { width: SW, height: SH } });
  await addCover(p, "Visualisasi Data\nTren dan Perubahan", path.join(COVER_DIR, "cover-2.png"), "Ilustrasi visualisasi tren, area, dan perubahan bertahap");
  const chartSlides = [];
  const tableSlides = [];

  {
    const s = addSlide(p, "Line chart membaca satu tren", "Setiap titik adalah nilai pada satu periode yang berurutan");
    addChart(s, "line", { position: { left: 92, top: 188, width: 750, height: 440 }, title: "Penjualan Cabang Utara", categories: salesMonths, series: [seriesSales[0]], hasLegend: false, xAxis: { title: "Bulan", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: axis("Unit", 70, 10) });
    addBullets(s, ["Cocok untuk satu seri waktu.", "Lonjakan dan penurunan terlihat dari kemiringan garis.", "Gunakan titik awal sumbu yang sesuai konteks."], { left: 875, top: 236, width: 310, height: 280 }, { fontSize: 19 });
    chartSlides.push(2);
    notes(s, ["Contoh penjualan merupakan data sintetis.", "Dokumentasi Matplotlib: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html"]);
  }
  {
    const s = addSlide(p, "Multi-line membandingkan tren kelompok", "Warna dan legenda membantu membedakan cabang pada periode yang sama");
    addChart(s, "line", { position: { left: 92, top: 188, width: 760, height: 440 }, title: "Unit Terjual per Cabang", categories: salesMonths, series: seriesSales, hasLegend: true, legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 14 } }, xAxis: { title: "Bulan", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: axis("Unit", 70, 10) });
    addBullets(s, ["Bandingkan nilai pada bulan yang sama.", "Perhatikan perubahan arah dan jarak antargaris.", "Batasi jumlah garis agar pola tetap terbaca."], { left: 880, top: 240, width: 300, height: 280 }, { fontSize: 19 });
    chartSlides.push(3);
    notes(s, ["Contoh penjualan merupakan data sintetis.", "Pandas line plot: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.line.html"]);
  }
  {
    const s = addSlide(p, "Sebelum membandingkan garis, periksa datanya", "Pastikan sumbu waktu dan unit seragam");
    addTable(s, [
      ["Periksa", "Alasan"],
      ["Urutan periode", "Garis mengikuti urutan waktu, bukan urutan label alfabetis."],
      ["Unit dan skala", "Seri dengan unit atau skala berbeda dapat menyesatkan."],
      ["Jumlah garis", "Terlalu banyak warna membuat legenda dan pola sulit dibaca."],
      ["Nilai kosong", "Jeda dapat berarti data tidak tersedia, bukan nilai nol."],
    ], { left: 100, top: 207, width: 1080, height: 380 }, { columnWidths: [280, 800], fontSize: 19, firstColumnLeft: true });
    tableSlides.push(4);
    notes(s, ["Gunakan unit yang sebanding saat membaca tren."]);
  }
  {
    const s = addSlide(p, "Practice Tengah: kunjungan perpustakaan", "Bandingkan perubahan mingguan pada tiga cabang");
    addTable(s, [
      ["Minggu", "Barat", "Timur", "Pusat"], [1, 120, 98, 150], [2, 132, 105, 145], [3, 128, 111, 158], [4, 150, 109, 166], [5, 164, 122, 171], [6, 159, 136, 180], [7, 181, 132, 176], [8, 190, 148, 195],
    ], { left: 82, top: 204, width: 492, height: 392 }, { columnWidths: [132, 120, 120, 120], fontSize: 18 });
    addBullets(s, ["Buat line chart untuk Cabang Barat.", "Buat multi-line untuk membandingkan tiga cabang.", "Tuliskan satu pengamatan yang didukung grafik."], { left: 640, top: 260, width: 500, height: 250 }, { fontSize: 21 });
    tableSlides.push(5);
    notes(s, ["Dataset latihan merupakan contoh buatan."]);
  }
  {
    const s = addSlide(p, "Area chart menekankan besar nilai", "Area di bawah garis membantu melihat besaran dari waktu ke waktu");
    addChart(s, "area", { position: { left: 100, top: 190, width: 740, height: 440 }, title: "Unit Terjual Cabang Utara", categories: salesMonths, series: [seriesSales[0]], hasLegend: false, xAxis: { title: "Bulan", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: axis("Unit", 70, 10) });
    addBullets(s, ["Cocok untuk satu deret waktu.", "Area memberi penekanan visual pada besaran.", "Pertahankan baseline nol saat membandingkan luas."], { left: 875, top: 252, width: 300, height: 246 }, { fontSize: 19 });
    chartSlides.push(6);
    notes(s, ["Contoh penjualan merupakan data sintetis.", "Matplotlib fill_between: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html"]);
  }
  {
    const s = addSlide(p, "Stacked area memperlihatkan total dan kontribusi", "Lapisan menunjukkan bagian masing-masing cabang dalam total bulanan");
    addChart(s, "area", { position: { left: 90, top: 190, width: 805, height: 440 }, title: "Kontribusi Unit Terjual per Cabang", categories: salesMonths, series: seriesSales, hasLegend: true, legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 14 } }, areaOptions: { grouping: "stacked" }, xAxis: { title: "Bulan", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: axis("Total unit", 180, 30) });
    addBullets(s, ["Gunakan saat komponen dapat dijumlahkan.", "Lapisan atas memakai baseline yang bergerak.", "Bandingkan kontribusi dengan hati-hati."], { left: 920, top: 250, width: 260, height: 250 }, { fontSize: 18 });
    chartSlides.push(7);
    notes(s, ["Total merupakan penjumlahan seri penjualan buatan.", "Pandas area plot: https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.area.html"]);
  }
  {
    const s = addSlide(p, "Stacked area 100% membandingkan proporsi", "Gunakan ketika pertanyaan utamanya adalah perubahan komposisi");
    addChart(s, "area", { position: { left: 100, top: 190, width: 790, height: 430 }, title: "Proporsi Unit Terjual per Cabang", categories: salesMonths, series: seriesSales, hasLegend: true, legend: { position: "bottom", overlay: false, textStyle: { fill: colors.secondary, fontSize: 14 } }, areaOptions: { grouping: "percentStacked" }, xAxis: { title: "Bulan", textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: { ...axis("Proporsi", 1, 0.2), numberFormatCode: "0%" } });
    addBullets(s, ["Setiap periode dinormalisasi menjadi 100%.", "Perubahan total tidak lagi terlihat.", "Baca proporsi, bukan jumlah unit."], { left: 918, top: 252, width: 260, height: 240 }, { fontSize: 19 });
    chartSlides.push(8);
    notes(s, ["Persentase dihitung dari seri contoh pada tiap bulan."]);
  }
  {
    const s = addSlide(p, "Waterfall merangkai perubahan menuju saldo akhir", "Batang antara menunjukkan tambahan atau pengurang dari saldo berjalan");
    addChart(s, "bar", { position: { left: 95, top: 188, width: 830, height: 440 }, title: "Perubahan Saldo Kas", categories: ["Saldo awal", "Pembelian", "Biaya", "Pengembalian", "Saldo akhir"], series: [
      { name: "Posisi awal batang", values: [0, 85, 65, 65, 0], fill: colors.white },
      { name: "Saldo / perubahan", values: [120, 35, 20, 18, 83], fill: colors.blueDark, points: [
        { idx: 0, fill: colors.blueDark }, { idx: 1, fill: colors.orange }, { idx: 2, fill: colors.orange }, { idx: 3, fill: colors.green }, { idx: 4, fill: colors.blueDark },
      ] },
    ], hasLegend: false, barOptions: { direction: "column", grouping: "stacked", gapWidth: 65, overlap: 100 }, xAxis: { textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: null }, yAxis: axis("Rupiah (ribu)", 140, 20) });
    addBullets(s, ["Batang awal dan akhir menunjukkan total.", "Batang hijau menambah saldo.", "Batang kuning mengurangi saldo."], { left: 950, top: 260, width: 235, height: 250 }, { fontSize: 19 });
    chartSlides.push(9);
    notes(s, ["Saldo awal 120, pembelian -35, biaya -20, pengembalian +18, saldo akhir 83 ribu.", "Waterfall dibuat sebagai stacked column dengan batang dasar tersembunyi supaya grafik tetap berupa chart PowerPoint native dan editable."]);
  }
  {
    const s = addSlide(p, "Susun komponen waterfall sebagai perubahan bersih", "Tentukan saldo awal, nilai tiap perubahan, lalu saldo akhir");
    addTable(s, [["Tahap", "Perubahan (ribu)"], ["Saldo awal", 500], ["Sewa tempat", -120], ["Konsumsi", -80], ["Sponsor", 60], ["Perlengkapan", -45], ["Saldo akhir", 315]], { left: 112, top: 210, width: 550, height: 366 }, { columnWidths: [340, 210], fontSize: 19 });
    addBullets(s, ["Tambahkan perubahan berurutan.", "Gunakan tanda positif dan negatif dengan konsisten.", "Cek bahwa saldo akhir sama dengan hasil hitung."], { left: 740, top: 280, width: 420, height: 210 }, { fontSize: 20 });
    tableSlides.push(10);
  }
  {
    const s = addSlide(p, "Pilih grafik dari bentuk pertanyaannya", "Urutan waktu, komposisi, dan perubahan bertahap membutuhkan penekanan berbeda");
    addTable(s, [
      ["Pertanyaan", "Grafik yang sesuai"],
      ["Bagaimana satu nilai berubah tiap bulan?", "Line atau area"],
      ["Bagaimana tren cabang dibandingkan?", "Multi-line"],
      ["Bagaimana komponen membentuk total dari waktu ke waktu?", "Stacked area"],
      ["Bagaimana saldo berubah dari awal ke akhir?", "Waterfall"],
      ["Apakah proporsi komponen berubah?", "Stacked area 100%"],
    ], { left: 90, top: 205, width: 1100, height: 390 }, { columnWidths: [680, 420], fontSize: 18, firstColumnLeft: true });
    tableSlides.push(11);
  }
  {
    const s = addSlide(p, "Hindari kesalahan saat membaca tren", "Grafik yang rapi tetap perlu data yang tersusun dan skala yang tepat");
    addBullets(s, ["Jangan urutkan label bulan secara alfabetis.", "Jangan menyamakan area bertumpuk dengan tren satu seri.", "Jangan memakai stacked area jika nilai dapat negatif.", "Jangan membaca waterfall tanpa memeriksa tanda perubahan.", "Jangan memakai terlalu banyak garis pada satu panel."], { left: 120, top: 220, width: 1040, height: 360 }, { fontSize: 22, spaceAfterPoints: 16 });
  }
  {
    const s = addSlide(p, "Tentukan grafik sebelum menulis kode", "Perhatikan urutan, jumlah seri, dan arti nilai yang dijumlahkan");
    addCode(s, "df.plot.line(x='Bulan', y='Unit')\nax.fill_between(bulan, nilai, alpha=0.3)\nax.stackplot(bulan, seri_a, seri_b)\nax.bar(posisi, perubahan, bottom=awal)", { left: 92, top: 215, width: 680, height: 250 }, 17);
    addBullets(s, ["Baris mengikuti periode.", "Setiap seri memakai unit yang konsisten.", "Latihan ada di notebook siswa dan versi solusi."], { left: 830, top: 245, width: 340, height: 225 }, { fontSize: 20 });
  }
  {
    const s = addSlide(p, "Practice Akhir: pendaftaran dan saldo acara", "Gabungkan grafik waktu, kontribusi, dan perubahan bersih");
    addTable(s, [["Bulan", "Web", "Sekolah", "Komunitas"], ["Jan", 32, 24, 18], ["Feb", 38, 29, 20], ["Mar", 42, 31, 26], ["Apr", 55, 35, 28], ["Mei", 61, 41, 34], ["Jun", 66, 45, 37]], { left: 82, top: 198, width: 520, height: 290 }, { columnWidths: [120, 125, 140, 135], fontSize: 17 });
    addBullets(s, ["Buat area total peserta dan stacked area per kanal.", "Buat waterfall dari saldo awal 500 ribu dan perubahan pada tabel berikutnya.", "Tambahkan judul, satuan, legenda, serta interpretasi singkat."], { left: 655, top: 220, width: 530, height: 300 }, { fontSize: 19 });
    addTable(s, [["Tahap", "Ribu"], ["Saldo awal", 500], ["Sewa", -120], ["Konsumsi", -80], ["Sponsor", 60], ["Perlengkapan", -45]], { left: 82, top: 510, width: 520, height: 142 }, { columnWidths: [330, 190], fontSize: 14 });
    tableSlides.push(14);
    notes(s, ["Semua angka pada latihan merupakan contoh buatan."]);
  }
  {
    const s = addSlide(p, "Cek pemahaman", "Sebutkan pilihan grafik dan alasan berdasarkan data");
    addTable(s, [["Kondisi data", "Grafik"], ["Nilai bulanan satu cabang", ""], ["Tiga cabang dengan skala yang sama", ""], ["Total dan bagian tiap kanal", ""], ["Saldo awal dengan pemasukan dan biaya", ""]], { left: 96, top: 220, width: 1080, height: 360 }, { columnWidths: [720, 360], fontSize: 20, firstColumnLeft: true });
    tableSlides.push(15);
  }

  const rendered = [];
  for (const [i, slide] of p.slides.items.entries()) {
    const file = path.join(taskDir, "rendered", `slide-${String(i + 1).padStart(2, "0")}.png`);
    const blob = await p.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
    rendered.push(file);
  }
  const candidatePath = path.join(taskDir, "candidate.pptx");
  await (await PresentationFile.exportPptx(p)).save(candidatePath);
  const finalization = await finalizePresentation({
    workspaceDir: "/Users/daf2a/Documents/python", candidatePath, finalPath,
    materializeLiteralChartWorkbooks: true, pythonExecutable: RUNTIME_PYTHON,
    integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
    layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
    layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit", ...tableSlides.flatMap((n) => ["--require-native-table-slide", String(n)])],
    explicitTotalSlideCount: 15, requiredNativeTableOwnerSlides: tableSlides, requiredNativeChartOwnerSlides: chartSlides,
    fontPolicy: { basis: "reference", families: [FONT_DISPLAY, FONT_TEXT, FONT_MONO], referencePath, referenceSha256 },
    verifyArtifactToolImport: true, receiptPath: path.join(taskDir, "validation_skillupdate.json"),
  });
  return { finalPath, slideCount: rendered.length, finalization };
}

const scores = [52, 58, 61, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 82, 86];
function gaussianKde(values, grid) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1);
  const bandwidth = Math.sqrt(variance) * values.length ** (-1 / 5);
  return grid.map((x) => Number((values.reduce((sum, v) => sum + Math.exp(-0.5 * ((x - v) / bandwidth) ** 2), 0) / (values.length * bandwidth * Math.sqrt(2 * Math.PI))).toFixed(6)));
}

async function buildMeeting3() {
  const taskDir = path.join(TASK_DIR, "meeting3");
  const outputDir = "/Users/daf2a/Documents/python/level-03/03-distribusi/slide";
  const finalPath = path.join(outputDir, "Visualisasi_Data_Distribusi_skillupdate.pptx");
  await fs.mkdir(path.join(taskDir, "rendered"), { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  const p = Presentation.create({ slideSize: { width: SW, height: SH } });
  await addCover(p, "Visualisasi Data\nDistribusi", path.join(COVER_DIR, "cover-3.png"), "Ilustrasi histogram, kurva kepadatan, box plot, dan violin plot");
  const chartSlides = [];
  const tableSlides = [];

  {
    const s = addSlide(p, "Skor tersebar pada beberapa rentang", "Histogram merangkum jumlah peserta dalam tiap rentang nilai");
    addText(s, "Batang tertinggi menandai rentang dengan peserta terbanyak.", { left: 90, top: 260, width: 360, height: 90 }, { typeface: FONT_DISPLAY, fontSize: 25, color: colors.navy, bold: true });
    addBullets(s, ["Bandingkan tinggi batang antar-rentang.", "Periksa rentang nilai dan label sumbu sebelum membaca pola."], { left: 90, top: 382, width: 365, height: 150 }, { fontSize: 20 });
    await addImage(s, path.join(VISUAL_DIR, "histogram_main.png"), { left: 500, top: 190, width: 680, height: 440 }, "Histogram enam bins untuk nilai ujian contoh");
    notes(s, ["Data nilai merupakan contoh buatan.", "Matplotlib histogram API: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html"]);
  }
  {
    const s = addSlide(p, "Jumlah bins mengubah detail histogram", "Bins terlalu sedikit menyembunyikan pola, bins terlalu banyak membuat grafik bergerigi");
    await addImage(s, path.join(VISUAL_DIR, "histogram_bins.png"), { left: 82, top: 198, width: 1110, height: 410 }, "Perbandingan histogram empat dan enam bins");
    notes(s, ["Kedua grafik memakai data yang sama. Perubahan bins mengubah tingkat detail yang tampak."]);
  }
  {
    const s = addSlide(p, "KDE menonjolkan bentuk kepadatan", "Kurva halus membantu melihat area nilai yang lebih padat");
    const grid = Array.from({ length: 15 }, (_, i) => 45 + i * 4);
    const density = gaussianKde(scores, grid);
    addChart(s, "line", { position: { left: 94, top: 193, width: 730, height: 425 }, title: "Kepadatan Nilai Ujian", categories: grid.map(String), series: [{ name: "Kepadatan", values: density, fill: colors.blueDark, line: { style: "solid", fill: colors.blueDark, width: 3 }, marker: { symbol: "none", size: 2 } }], hasLegend: false, lineOptions: { smooth: true }, xAxis: { title: "Nilai", textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: null }, yAxis: { title: "Kepadatan", min: 0, max: 0.05, majorUnit: 0.01, numberFormatCode: "0.00", textStyle: { fill: colors.secondary, fontSize: 13 }, majorGridlines: { style: "solid", fill: colors.rule, width: 1 } } });
    addBullets(s, ["Y-axis adalah kepadatan, bukan hitungan siswa.", "Lebar bandwidth memengaruhi kehalusan kurva.", "Kurva merangkum pola dan bukan nilai individual."], { left: 865, top: 242, width: 320, height: 250 }, { fontSize: 19 });
    chartSlides.push(4);
    notes(s, ["KDE memakai kernel Gaussian dan bandwidth Scott seperti scipy.stats.gaussian_kde pada notebook.", "Rujukan: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gaussian_kde.html"]);
  }
  {
    const s = addSlide(p, "Practice Tengah: waktu menyelesaikan kuis", "Bandingkan histogram dengan bins berbeda dan satu KDE");
    addTable(s, [["Peserta", "Menit", "Peserta", "Menit"], [1, 8, 10, 13], [2, 9, 11, 14], [3, 10, 12, 14], [4, 10, 13, 15], [5, 11, 14, 16], [6, 11, 15, 17], [7, 12, 16, 18], [8, 12, 17, 21], [9, 13, 18, 25]], { left: 80, top: 206, width: 480, height: 386 }, { columnWidths: [140, 100, 140, 100], fontSize: 16 });
    addBullets(s, ["Buat dua histogram dengan jumlah bins berbeda.", "Tambahkan satu kurva KDE.", "Jelaskan apa yang berubah dan apa yang tetap terlihat."], { left: 620, top: 260, width: 555, height: 230 }, { fontSize: 21 });
    tableSlides.push(5);
    notes(s, ["Dataset waktu merupakan contoh buatan."]);
  }
  {
    const s = addSlide(p, "Box plot merangkum pusat dan sebaran", "Median, kuartil, whisker, dan titik jauh memberi ringkasan kelompok");
    await addImage(s, path.join(VISUAL_DIR, "boxplot.png"), { left: 88, top: 190, width: 680, height: 425 }, "Box plot nilai buatan per kelas");
    addBullets(s, ["Garis dalam box adalah median.", "Batas box adalah kuartil pertama dan ketiga.", "Titik jauh ditandai sebagai calon pencilan, bukan otomatis kesalahan data."], { left: 810, top: 220, width: 365, height: 300 }, { fontSize: 20 });
    notes(s, ["Grafik box plot statis disematkan sebagai gambar data. Notebook berisi kode yang dapat dijalankan dan diedit.", "Dokumentasi Matplotlib: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html"]);
  }
  {
    const s = addSlide(p, "Bandingkan box plot dengan unit yang sama", "Median berdekatan, tetapi lebar rentang antarkelompok berbeda");
    await addImage(s, path.join(VISUAL_DIR, "boxplot.png"), { left: 96, top: 190, width: 760, height: 428 }, "Perbandingan box plot tiga kelas");
    addBullets(s, ["Biru memiliki rentang tengah yang lebih rapat.", "Hijau memiliki rentang nilai terlebar.", "Periksa jumlah observasi serta nilai asal sebelum memberi kesimpulan."], { left: 890, top: 240, width: 290, height: 260 }, { fontSize: 19 });
  }
  {
    const s = addSlide(p, "Violin plot memperlihatkan bentuk kepadatan", "Lebar violin menunjukkan area nilai yang relatif lebih padat");
    await addImage(s, path.join(VISUAL_DIR, "violin.png"), { left: 92, top: 190, width: 745, height: 430 }, "Violin plot nilai buatan per kelas");
    addBullets(s, ["Bentuk lebar memberi petunjuk kepadatan.", "Median membantu membaca pusat nilai.", "Lebar bukan jumlah peserta."], { left: 870, top: 252, width: 300, height: 235 }, { fontSize: 20 });
    notes(s, ["Grafik violin statis disematkan sebagai gambar data. Notebook berisi kode yang dapat dijalankan dan diedit.", "Dokumentasi Matplotlib: https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html"]);
  }
  {
    const s = addSlide(p, "Median serupa dapat menyembunyikan sebaran berbeda", "Histogram membantu membandingkan bentuk dan lebar sebaran");
    await addImage(s, path.join(VISUAL_DIR, "distribution_comparison.png"), { left: 86, top: 190, width: 1100, height: 430 }, "Dua histogram dengan median sama dan sebaran berbeda");
    notes(s, ["Kedua kelompok contoh memiliki median 76, tetapi rentang dan bentuk histogram berbeda.", "Visual dibuat dari data yang sama dengan contoh notebook."]);
  }
  {
    const s = addSlide(p, "Jangan simpulkan pencilan dari grafik saja", "Titik jauh adalah petunjuk untuk diperiksa dalam konteks");
    addBullets(s, ["Periksa salah input, satuan, dan proses pengumpulan.", "Tanyakan apakah kelompok memang memiliki variasi lebih besar.", "Laporkan aturan pencilan yang dipakai.", "Jangan menghapus nilai hanya agar grafik terlihat rapi."], { left: 115, top: 228, width: 1050, height: 330 }, { fontSize: 22, spaceAfterPoints: 15 });
  }
  {
    const s = addSlide(p, "Bentuk distribusi memberi konteks pada ringkasan", "Median yang sama belum tentu berarti pola data yang sama");
    addText(s, "Baca bersama", { left: 100, top: 224, width: 260, height: 45 }, { fontSize: 23, color: colors.blueDark, bold: true });
    addBullets(s, ["Pusat: median atau rata-rata.", "Sebaran: kuartil, rentang, atau simpangan baku.", "Bentuk: satu puncak, beberapa puncak, kemencengan.", "Nilai jauh: perlu pengecekan konteks."], { left: 100, top: 280, width: 540, height: 260 }, { fontSize: 20 });
    addCode(s, "ax.hist(nilai, bins=6)\nax.plot(x_grid, density)\nax.boxplot(daftar_nilai)\nax.violinplot(daftar_nilai)", { left: 720, top: 250, width: 455, height: 220 }, 17);
  }
  {
    const s = addSlide(p, "Kapan memakai histogram, KDE, box, atau violin?", "Pertanyaan menentukan banyaknya detail yang dibutuhkan");
    addTable(s, [["Grafik", "Menonjolkan", "Catatan"], ["Histogram", "Frekuensi per rentang", "Peka pada jumlah bins"], ["KDE", "Bentuk kepadatan halus", "Peka pada bandwidth"], ["Box plot", "Median dan rentang kuartil", "Tidak memperlihatkan semua bentuk"], ["Violin", "Kepadatan dan pusat", "Lebar bukan hitungan" ]], { left: 92, top: 205, width: 1098, height: 385 }, { columnWidths: [205, 450, 443], fontSize: 18, firstColumnLeft: true });
    tableSlides.push(12);
  }
  {
    const s = addSlide(p, "Practice Akhir: nilai tiga kelas", "Gunakan grafik ringkasan untuk membandingkan distribusi");
    addTable(s, [["Kelas", "Nilai siswa"], ["Merah", "54, 60, 63, 65, 67, 68, 70, 73, 78, 90"], ["Biru", "61, 64, 66, 68, 69, 70, 71, 72, 75, 77"], ["Hijau", "48, 55, 59, 62, 64, 67, 69, 72, 80, 94"]], { left: 82, top: 225, width: 570, height: 275 }, { columnWidths: [140, 430], fontSize: 17, firstColumnLeft: true });
    addBullets(s, ["Buat histogram gabungan dan satu KDE.", "Bandingkan box plot dan violin per kelas.", "Tuliskan perbedaan median dan sebaran.", "Periksa nilai ekstrem sebelum menyebut pencilan."], { left: 710, top: 232, width: 470, height: 300 }, { fontSize: 19 });
    tableSlides.push(13);
  }
  {
    const s = addSlide(p, "Cek pemahaman", "Pilih grafik untuk kebutuhan berikut dan jelaskan alasannya");
    addTable(s, [["Kebutuhan", "Grafik"], ["Hitung frekuensi per rentang nilai", ""], ["Lihat kurva kepadatan yang halus", ""], ["Bandingkan median beberapa kelas", ""], ["Bandingkan bentuk distribusi kelompok", ""]], { left: 92, top: 220, width: 1090, height: 360 }, { columnWidths: [740, 350], fontSize: 20, firstColumnLeft: true });
    tableSlides.push(14);
  }

  const rendered = [];
  for (const [i, slide] of p.slides.items.entries()) {
    const file = path.join(taskDir, "rendered", `slide-${String(i + 1).padStart(2, "0")}.png`);
    const blob = await p.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
    rendered.push(file);
  }
  const candidatePath = path.join(taskDir, "candidate.pptx");
  await (await PresentationFile.exportPptx(p)).save(candidatePath);
  const finalization = await finalizePresentation({
    workspaceDir: "/Users/daf2a/Documents/python", candidatePath, finalPath,
    materializeLiteralChartWorkbooks: true, pythonExecutable: RUNTIME_PYTHON,
    integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
    layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
    layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit", ...tableSlides.flatMap((n) => ["--require-native-table-slide", String(n)])],
    explicitTotalSlideCount: 14, requiredNativeTableOwnerSlides: tableSlides, requiredNativeChartOwnerSlides: chartSlides,
    fontPolicy: { basis: "reference", families: [FONT_DISPLAY, FONT_TEXT, FONT_MONO], referencePath, referenceSha256 },
    verifyArtifactToolImport: true, receiptPath: path.join(taskDir, "validation_skillupdate.json"),
  });
  return { finalPath, slideCount: rendered.length, finalization };
}

async function buildMeeting4() {
  const taskDir = path.join(TASK_DIR, "meeting4");
  const outputDir = "/Users/daf2a/Documents/python/level-03/04-hubungan-pola-lokasi/slide";
  const finalPath = path.join(outputDir, "Visualisasi_Data_Hubungan_Pola_dan_Lokasi_skillupdate.pptx");
  await fs.mkdir(path.join(taskDir, "rendered"), { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  const p = Presentation.create({ slideSize: { width: SW, height: SH } });
  await addCover(p, "Visualisasi Data\nHubungan, Pola,\ndan Lokasi", path.join(COVER_DIR, "cover-4.png"), "Ilustrasi scatter plot, heatmap, dan peta titik");
  const chartSlides = [];
  const tableSlides = [];

  {
    const s = addSlide(p, "Scatter plot melihat hubungan dua variabel", "Setiap titik mewakili satu pengamatan");
    addChart(s, "scatter", { position: { left: 92, top: 190, width: 760, height: 435 }, title: "Jam Belajar dan Nilai", series: [{ name: "Peserta", xValues: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6], values: [55, 60, 64, 67, 70, 72, 78, 79, 88, 91], fill: colors.blueDark, marker: { symbol: "circle", size: 8, fill: colors.blueDark } }], hasLegend: false, scatterOptions: { style: "marker" }, xAxis: { title: "Jam belajar", min: 0, max: 7, textStyle: { fill: colors.secondary, fontSize: 14 }, majorGridlines: null }, yAxis: { ...axis("Nilai", 100, 10), min: 40 } });
    addBullets(s, ["Arah pola: positif, negatif, atau tidak tampak.", "Bentuk pola: linear, melengkung, atau berkelompok.", "Periksa titik yang jauh dari pola umum."], { left: 885, top: 246, width: 300, height: 270 }, { fontSize: 19 });
    chartSlides.push(2);
    notes(s, ["Contoh jam dan nilai adalah data sintetis."]);
  }
  {
    const s = addSlide(p, "Bubble chart menambahkan variabel ketiga", "Posisi menunjukkan dua angka, ukuran gelembung menunjukkan angka tambahan");
    await addImage(s, path.join(VISUAL_DIR, "bubble.png"), { left: 92, top: 190, width: 760, height: 435 }, "Bubble chart menunjukkan jam belajar, nilai, dan ukuran berdasarkan kehadiran");
    addBullets(s, ["Ukuran mewakili kehadiran (%).", "Skala ukuran harus dijelaskan.", "Hindari titik besar yang menutupi data lain."], { left: 885, top: 246, width: 300, height: 260 }, { fontSize: 19 });
    notes(s, ["Bubble chart statis disematkan sebagai gambar data karena adapter workbook PowerPoint tidak mendukung ukuran literal bubble. Notebook menyediakan kode yang dapat dijalankan dan diedit.", "Bubble size menggunakan jumlah persentase pada data buatan. Ukuran sebaiknya dibaca sebagai area."]);
  }
  {
    const s = addSlide(p, "Hubungan tidak sama dengan sebab-akibat", "Scatter plot menunjukkan pola pada data yang diamati");
    addBullets(s, ["Titik dapat bergerak bersama tanpa hubungan sebab-akibat.", "Variabel ketiga bisa menjelaskan sebagian pola.", "Periksa rentang sumbu dan jumlah titik.", "Jangan paksa garis lurus jika pola melengkung."], { left: 130, top: 225, width: 1020, height: 325 }, { fontSize: 22, spaceAfterPoints: 14 });
  }
  {
    const s = addSlide(p, "Practice Tengah: durasi latihan dan skor", "Tambahkan jumlah latihan sebagai ukuran bubble");
    addTable(s, [["Peserta", "Durasi (menit)", "Latihan", "Skor"], [1, 15, 2, 50], [2, 20, 3, 55], [3, 22, 4, 59], [4, 28, 3, 62], [5, 30, 5, 66], [6, 35, 5, 69], [7, 38, 6, 73], [8, 42, 7, 78], [9, 48, 6, 80], [10, 55, 8, 88]], { left: 82, top: 198, width: 530, height: 375 }, { columnWidths: [126, 166, 105, 133], fontSize: 17 });
    addBullets(s, ["Buat scatter untuk durasi dan skor.", "Buat bubble dengan jumlah latihan sebagai ukuran.", "Jelaskan pola tanpa menyimpulkan sebab-akibat."], { left: 680, top: 250, width: 490, height: 255 }, { fontSize: 20 });
    tableSlides.push(5);
  }
  {
    const s = addSlide(p, "Heatmap memperlihatkan pola dalam matriks", "Warna merangkum nilai pada perpotongan dua kategori");
    const matrix = [
      ["Hari / Jam", "08.00", "10.00", "12.00", "14.00"],
      ["Senin", 3, 5, 8, 7], ["Selasa", 4, 9, 12, 8], ["Rabu", 6, 11, 10, 5],
    ];
    const table = addTable(s, matrix, { left: 240, top: 230, width: 800, height: 300 }, { columnWidths: [220, 145, 145, 145, 145], fontSize: 20, firstColumnLeft: true });
    const numeric = [3, 5, 8, 7, 4, 9, 12, 8, 6, 11, 10, 5];
    const min = Math.min(...numeric), max = Math.max(...numeric);
    function mixHex(a, b, t) {
      const av = a.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
      const bv = b.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16));
      return "#" + av.map((v, i) => Math.round(v + (bv[i] - v) * t).toString(16).padStart(2, "0")).join("");
    }
    for (let r = 1; r < matrix.length; r += 1) {
      for (let c = 1; c < matrix[0].length; c += 1) {
        const value = matrix[r][c];
        const t = (value - min) / (max - min);
        const cell = table.getCell(r, c);
        cell.fill = mixHex("#EAF6FC", "#4FB6E8", t);
        cell.text.style = { typeface: FONT_TEXT, fontSize: 21, color: t > 0.62 ? colors.navy : colors.navy, alignment: "center", verticalAlignment: "middle", wrap: "square", autoFit: "shrinkText", insets: { top: 7, right: 9, bottom: 7, left: 9 } };
      }
    }
    addText(s, "Contoh jumlah kunjungan. Sel paling gelap menunjukkan nilai tertinggi pada matriks ini.", { left: 240, top: 566, width: 800, height: 38 }, { fontSize: 18, color: colors.blueDark, alignment: "center" });
    tableSlides.push(6);
    notes(s, ["Tabel heatmap merupakan komponen native yang dapat diedit."]);
  }
  {
    const s = addSlide(p, "Pair plot membandingkan beberapa pasangan", "Diagonal menunjukkan distribusi, panel lain menunjukkan pasangan variabel");
    await addImage(s, path.join(VISUAL_DIR, "pairplot.png"), { left: 94, top: 180, width: 760, height: 455 }, "Pair plot tiga variabel peserta");
    addBullets(s, ["Cari pola berulang pada pasangan variabel.", "Diagonal membantu membaca sebaran masing-masing variabel.", "Mulai dengan sedikit variabel numerik."], { left: 888, top: 250, width: 288, height: 250 }, { fontSize: 19 });
    notes(s, ["Pair plot statis disematkan sebagai gambar data karena rangkaian panel bukan satu tipe chart native PowerPoint. Notebook menyediakan kode Plotly yang dapat dijalankan dan diubah.", "Plotly scatter matrix: https://plotly.com/python/splom/"]);
  }
  {
    const s = addSlide(p, "Point map menempatkan data pada koordinat", "Gunakan lintang dan bujur untuk membaca sebaran lokasi");
    await addImage(s, path.join(VISUAL_DIR, "point_map.png"), { left: 92, top: 178, width: 800, height: 452 }, "Peta titik kota Indonesia dengan ukuran titik menunjukkan kunjungan contoh");
    addBullets(s, ["Titik menunjukkan kota.", "Ukuran atau warna menunjukkan jumlah kunjungan contoh.", "Arahkan perhatian pada sebaran geografis, bukan batas wilayah."], { left: 920, top: 242, width: 260, height: 280 }, { fontSize: 18 });
    notes(s, ["Peta memakai koordinat kota yang nyata tetapi jumlah kunjungan adalah contoh buatan.", "Peta titik Plotly: https://plotly.com/python/scatter-plots-on-maps/", "Konfigurasi peta: https://plotly.com/python/map-configuration/"]);
  }
  {
    const s = addSlide(p, "Choropleth mewarnai wilayah berdasarkan nilai", "Bandingkan indeks contoh antarnegara menggunakan batas wilayah");
    await addImage(s, path.join(VISUAL_DIR, "choropleth.png"), { left: 95, top: 178, width: 800, height: 452 }, "Choropleth Asia Tenggara dengan indeks contoh buatan");
    addBullets(s, ["Setiap poligon menunjukkan satu wilayah.", "Warna mewakili nilai yang diagregasi per wilayah.", "Indeks pada contoh ini bukan statistik negara."], { left: 922, top: 242, width: 260, height: 280 }, { fontSize: 18 });
    notes(s, ["Batas wilayah berasal dari data geografis Plotly. Nilai warna adalah angka contoh buatan.", "Choropleth Plotly: https://plotly.com/python/choropleth-maps/", "Kode lokasi: https://plotly.com/python/outline-map-locations/"]);
  }
  {
    const s = addSlide(p, "Heatmap membutuhkan label yang mudah dibaca", "Warna membantu pola, angka dan skala membantu interpretasi");
    addBullets(s, ["Urutkan baris dan kolom berdasarkan kebutuhan analisis.", "Gunakan skala warna yang konsisten.", "Tambahkan nilai jika matriks kecil.", "Jelaskan apakah angka mentah atau sudah dinormalisasi."], { left: 126, top: 230, width: 1040, height: 320 }, { fontSize: 22, spaceAfterPoints: 14 });
  }
  {
    const s = addSlide(p, "Point map dan choropleth menjawab pertanyaan berbeda", "Pilih titik atau wilayah berdasarkan bentuk data lokasi");
    addTable(s, [["Data", "Grafik", "Pertanyaan"], ["Lokasi pengamatan, lintang dan bujur", "Point map", "Di mana titik terkumpul?"], ["Nilai per wilayah administrasi", "Choropleth", "Wilayah mana bernilai lebih tinggi?"], ["Jumlah titik per area", "Agregasi lalu choropleth", "Area mana memiliki kepadatan lebih tinggi?" ]], { left: 84, top: 210, width: 1110, height: 365 }, { columnWidths: [430, 230, 450], fontSize: 18, firstColumnLeft: true });
    tableSlides.push(11);
  }
  {
    const s = addSlide(p, "Pilih visualisasi dari struktur datanya", "Tentukan variabel, satuan, dan lokasi sebelum memilih kode");
    addTable(s, [["Pertanyaan", "Grafik"], ["Hubungan dua angka", "Scatter"], ["Hubungan dua angka dan satu nilai tambahan", "Bubble"], ["Nilai di dua dimensi kategori", "Heatmap"], ["Banyak pasangan variabel numerik", "Pair plot"], ["Titik kejadian dengan koordinat", "Point map"], ["Nilai yang diringkas per wilayah", "Choropleth"]], { left: 90, top: 196, width: 1100, height: 410 }, { columnWidths: [750, 350], fontSize: 18, firstColumnLeft: true });
    tableSlides.push(12);
  }
  {
    const s = addSlide(p, "Periksa skala dan agregasi sebelum membaca", "Peta dan matriks ikut mewarisi pilihan pengolahan data");
    addBullets(s, ["Bubble memakai ukuran area, bukan diameter, untuk mewakili besaran.", "Choropleth lebih bermakna bila nilai dinormalisasi sesuai pertanyaan.", "Heatmap perlu skala warna yang dapat dibandingkan.", "Pair plot dapat ramai jika terlalu banyak variabel."], { left: 120, top: 226, width: 1050, height: 330 }, { fontSize: 21, spaceAfterPoints: 13 });
  }
  {
    const s = addSlide(p, "Practice Akhir: ringkasan indikator kota", "Buat heatmap, pair plot, point map, dan choropleth");
    addTable(s, [["Kota", "Akses", "Partisipasi", "Layanan", "Kunjungan"], ["Jakarta", 74, 81, 78, 130], ["Bandung", 82, 76, 84, 82], ["Semarang", 70, 69, 75, 68], ["Yogyakarta", 88, 83, 91, 98], ["Surabaya", 79, 80, 80, 118], ["Denpasar", 85, 73, 88, 60]], { left: 74, top: 194, width: 660, height: 354 }, { columnWidths: [168, 105, 150, 105, 132], fontSize: 16 });
    addBullets(s, ["Heatmap: tiga indeks dengan skala 0-100.", "Pair plot: tiga indeks numerik.", "Point map: lintang, bujur, dan jumlah kunjungan.", "Choropleth: indeks contoh per negara."], { left: 800, top: 236, width: 390, height: 270 }, { fontSize: 19 });
    addText(s, "Gunakan judul, satuan, dan catatan bahwa angka adalah data contoh.", { left: 80, top: 582, width: 1110, height: 32 }, { fontSize: 18, color: colors.blueDark, bold: true });
    tableSlides.push(14);
  }
  {
    const s = addSlide(p, "Cek pemahaman", "Pilih grafik yang paling sesuai dan sebutkan variabel yang dipakai");
    addTable(s, [["Kebutuhan", "Grafik"], ["Hubungan jam belajar dan nilai", ""], ["Menambahkan kehadiran sebagai variabel ketiga", ""], ["Membaca nilai pada perpotongan hari dan jam", ""], ["Melihat sebaran lokasi dengan koordinat", ""], ["Membandingkan skor yang diringkas per wilayah", ""]], { left: 90, top: 215, width: 1100, height: 390 }, { columnWidths: [760, 340], fontSize: 19, firstColumnLeft: true });
    tableSlides.push(15);
  }

  const rendered = [];
  for (const [i, slide] of p.slides.items.entries()) {
    const file = path.join(taskDir, "rendered", `slide-${String(i + 1).padStart(2, "0")}.png`);
    const blob = await p.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
    rendered.push(file);
  }
  const candidatePath = path.join(taskDir, "candidate.pptx");
  await (await PresentationFile.exportPptx(p)).save(candidatePath);
  const finalization = await finalizePresentation({
    workspaceDir: "/Users/daf2a/Documents/python", candidatePath, finalPath,
    materializeLiteralChartWorkbooks: true, pythonExecutable: RUNTIME_PYTHON,
    integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
    layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
    layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit", ...tableSlides.flatMap((n) => ["--require-native-table-slide", String(n)])],
    explicitTotalSlideCount: 15, requiredNativeTableOwnerSlides: tableSlides, requiredNativeChartOwnerSlides: chartSlides,
    fontPolicy: { basis: "reference", families: [FONT_DISPLAY, FONT_TEXT, FONT_MONO], referencePath, referenceSha256 },
    verifyArtifactToolImport: true, receiptPath: path.join(taskDir, "validation_skillupdate.json"),
  });
  return { finalPath, slideCount: rendered.length, finalization };
}

console.log(JSON.stringify(await buildMeeting2(), null, 2));
console.log(JSON.stringify(await buildMeeting3(), null, 2));
console.log(JSON.stringify(await buildMeeting4(), null, 2));
