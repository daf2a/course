import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
import { pathToFileURL } from 'node:url';

const workspaceDir = '/Users/daf2a/Documents/python';
const SKILL_DIR = '/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const TMP_DIR = path.join(workspaceDir, '_pengembangan/level-02/03-analisis-data-numpy/slide');
const OUTPUT_DIR = path.join(workspaceDir, 'level-02/03-analisis-data-numpy/slide');
const FINAL_PPTX = path.join(OUTPUT_DIR, 'NumPy_Analisis_Data_Penjualan_Python.pptx');
const COVER_IMAGE = '/private/tmp/np_deck_review/cover_ref.png';
const FONT_REFERENCE = path.join(workspaceDir, 'level-02/01-fungsi-statistika/slide/function_statistika_deskriptif_v3.pptx');

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(OUTPUT_DIR, { recursive: true });
const coverBytes = new Uint8Array(await fs.readFile(COVER_IMAGE));
const fontReferenceSha256 = createHash('sha256').update(await fs.readFile(FONT_REFERENCE)).digest('hex');
const { resolvePresentationFont } = await import(pathToFileURL(path.join(SKILL_DIR, 'container_tools/artifact_tool_utils.mjs')).href);

const FONT_DISPLAY = resolvePresentationFont({ sourceFont: 'SF Pro Display' });
const FONT_TEXT = resolvePresentationFont({ sourceFont: 'SF Pro Text' });
const FONT_CODE = resolvePresentationFont({ sourceFont: 'SF Mono' });
const C = {
  navy: '#111A30',
  blue: '#196B9B',
  cyan: '#4FB6E8',
  grey: '#4B5868',
  muted: '#7D8793',
  line: '#E7EAEE',
  white: '#FFFFFF',
  paleBlue: '#EAF6FC',
  paleYellow: '#FFF7D6',
  yellow: '#F5D36A',
  paleGreen: '#E9F7EE',
  green: '#55B77A',
  red: '#E96B6B',
};

const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });

function shape(slide, geometry, name, left, top, width, height, fill = 'none', lineFill = 'none', lineWidth = 0, radius = 0) {
  return slide.shapes.add({
    geometry,
    name,
    position: { left, top, width, height },
    fill,
    line: { style: 'solid', fill: lineFill, width: lineWidth },
    ...(radius ? { borderRadius: radius } : {}),
  });
}

function text(slide, name, left, top, width, height, value, options = {}) {
  const box = shape(slide, 'textbox', name, left, top, width, height, 'none', 'none', 0);
  box.text = value;
  box.text.style = {
    typeface: options.font ?? FONT_TEXT,
    fontSize: options.size ?? 21,
    color: options.color ?? C.grey,
    bold: options.bold ?? false,
    alignment: options.align ?? 'left',
    verticalAlignment: options.valign ?? 'top',
    autoFit: options.autoFit ?? 'shrinkText',
    wrap: 'square',
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return box;
}

function codePanel(slide, name, left, top, width, height, code, fontSize = 19) {
  shape(slide, 'roundRect', `${name}-background`, left, top, width, height, C.navy, C.navy, 1, 12);
  shape(slide, 'ellipse', `${name}-dot-red`, left + 22, top + 17, 12, 12, C.red, C.red, 0);
  shape(slide, 'ellipse', `${name}-dot-yellow`, left + 42, top + 17, 12, 12, C.yellow, C.yellow, 0);
  shape(slide, 'ellipse', `${name}-dot-green`, left + 62, top + 17, 12, 12, C.green, C.green, 0);
  text(slide, `${name}-text`, left + 28, top + 47, width - 52, height - 62, code, {
    font: FONT_CODE, size: fontSize, color: C.white,
  });
}

function footer(slide, number) {
  text(slide, `page-${number}`, 72, 690, 200, 17, `Slide ${String(number).padStart(2, '0')}`, { size: 13, color: C.muted });
  text(slide, `course-${number}`, 1025, 690, 183, 17, 'EKA / PYTHON', { size: 13, color: C.muted, align: 'right' });
}

function contentSlide(number, kicker, titleText, subtitle = '') {
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  text(slide, `kicker-${number}`, 72, 30, 980, 22, kicker.toUpperCase(), { size: 15, color: C.blue, bold: true });
  text(slide, `title-${number}`, 72, 62, 1136, 65, titleText, { size: 40, color: C.navy, bold: true, font: FONT_DISPLAY });
  shape(slide, 'rect', `divider-${number}`, 72, 145, 1136, 3, C.line, C.line, 0);
  if (subtitle) text(slide, `subtitle-${number}`, 72, 166, 1136, 42, subtitle, { size: 21, color: C.grey });
  footer(slide, number);
  return slide;
}

function notes(slide, lines) {
  slide.speakerNotes.textFrame.setText(lines.join('\n'));
  slide.speakerNotes.setVisible(true);
}

function addDataTable(slide) {
  const table = slide.tables.add({
    rows: 5,
    columns: 4,
    left: 86,
    top: 245,
    width: 735,
    height: 310,
    values: [
      ['Cabang', 'Jan', 'Feb', 'Mar'],
      ['Jakarta', '120', '135', '128'],
      ['Bandung', '98', '108', '112'],
      ['Surabaya', '145', '138', '152'],
      ['Medan', '87', '95', '103'],
    ],
  });
  table.styleOptions = { headerRow: true, bandedRows: true, firstColumn: true };
  table.borders.assign({ style: 'solid', fill: C.line, width: 1 });
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 4 }).assign({
    fill: C.navy,
    textStyle: { fontSize: 20, bold: true, color: C.white, typeface: FONT_DISPLAY },
    borders: { style: 'solid', fill: C.navy, width: 1 },
  });
  table.cells.block({ row: 1, column: 0, rowCount: 4, columnCount: 4 }).assign({
    fill: C.white,
    textStyle: { fontSize: 19, color: C.navy, typeface: FONT_TEXT },
    borders: { style: 'solid', fill: C.line, width: 1 },
  });
  for (const row of [2, 4]) {
    table.cells.block({ row, column: 0, rowCount: 1, columnCount: 4 }).assign({ fill: C.paleBlue });
  }
  table.rows[0].height = 52;
  return table;
}

// Slide 1: cover
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  slide.images.add({
    blob: coverBytes,
    contentType: 'image/png',
    alt: 'Ilustrasi laptop dengan kode dan grafik data',
    fit: 'cover',
    position: { left: 0, top: 0, width: 1280, height: 720 },
  });
  text(slide, 'cover-kicker', 78, 50, 570, 25, 'LEVEL 1  •  PERTEMUAN 6', { size: 17, color: C.blue, bold: true });
  text(slide, 'cover-title', 78, 160, 590, 150, 'NumPy untuk\nAnalisis Data', { size: 57, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'cover-subtitle', 80, 345, 560, 48, 'Dari tabel penjualan ke ringkasan bisnis', { size: 26, color: C.grey });
  shape(slide, 'rect', 'cover-accent-line', 80, 455, 128, 4, C.cyan, C.cyan, 0);
  text(slide, 'cover-topics', 80, 480, 600, 30, 'shape  ·  broadcasting  ·  filter  ·  axis', { size: 19, color: C.grey });
  shape(slide, 'roundRect', 'cover-caption-bg', 78, 560, 510, 48, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'cover-caption', 102, 574, 470, 25, 'Kasus: empat cabang dan empat bulan', { size: 18, color: C.navy });
  footer(slide, 1);
  notes(slide, ['Buka dengan pertanyaan: cabang mana yang mencapai target, dan bulan mana yang paling kuat?', 'Ilustrasi cover diambil dari deck List, Dictionary, dan NumPy yang menjadi referensi gaya.']);
}

// Slide 2: outcomes
{
  const slide = contentSlide(2, 'Target belajar', 'Array membantu membaca data sebagai tabel', 'Kita akan mengolah penjualan cabang untuk menjawab pertanyaan bisnis.');
  text(slide, 'goals-left', 90, 244, 640, 300,
    '01   Baca dimensi dan bentuk array.\n\n02   Pilih baris, kolom, dan rentang data.\n\n03   Terapkan operasi vektor dan broadcasting.\n\n04   Filter data dan hitung ringkasan.',
    { size: 24, color: C.navy });
  shape(slide, 'roundRect', 'business-question-panel', 785, 250, 400, 270, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'business-question-title', 820, 282, 335, 38, 'Pertanyaan bisnis', { size: 24, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'business-question-copy', 820, 342, 325, 145,
    'Cabang mana yang mencapai target?\n\nBulan mana yang memberi total penjualan tertinggi?',
    { size: 21, color: C.grey });
  notes(slide, ['Siswa sudah mengenal array satu dimensi dan ringkasan statistik dasar. Hari ini fokusnya membaca susunan data dan mengolah banyak nilai sekaligus.']);
}

// Slide 3: dataset table
{
  const slide = contentSlide(3, 'Studi kasus', 'Dataset penjualan empat cabang', 'Angka dinyatakan dalam juta rupiah. Baris menunjukkan cabang dan kolom menunjukkan bulan.');
  addDataTable(slide);
  text(slide, 'schema-title', 866, 250, 310, 36, 'Makna susunan', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'schema-copy', 866, 302, 320, 120, '4 baris  =  4 cabang\n3 kolom  =  Jan sampai Mar\n12 nilai =  12 pengamatan', { size: 20, color: C.grey });
  shape(slide, 'roundRect', 'dataset-assumption', 858, 458, 332, 90, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'dataset-assumption-text', 882, 480, 288, 55, 'Data ini menjadi dasar skenario proyeksi.', { size: 18, color: C.navy });
  notes(slide, ['Data pada slide ini adalah data ilustratif untuk latihan, bukan data perusahaan nyata. Tekankan bahwa label baris dan kolom menentukan cara membaca setiap angka.']);
}

// Slide 4: 1D vs 2D
{
  const slide = contentSlide(4, 'Struktur array', 'Bentuk array mengikuti susunan data', 'Satu dimensi menyimpan satu urutan. Dua dimensi menyimpan baris dan kolom.');
  shape(slide, 'roundRect', 'one-d-panel', 86, 250, 430, 250, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'one-d-title', 116, 277, 360, 36, 'Array bulan', { size: 24, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'one-d-code', 116, 335, 360, 95, 'bulan = ["Jan", "Feb", "Mar"]\nshape: (3,)', { size: 21, color: C.navy, font: FONT_CODE });
  shape(slide, 'roundRect', 'two-d-panel', 570, 250, 615, 250, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'two-d-title', 602, 277, 520, 36, 'Matriks penjualan', { size: 24, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'two-d-code', 602, 335, 520, 95, '4 cabang × 3 bulan\nshape: (4, 3)', { size: 22, color: C.navy, font: FONT_CODE });
  text(slide, 'two-d-explain', 602, 438, 520, 42, 'Posisi nilai dibaca sebagai [baris, kolom].', { size: 18, color: C.grey });
  notes(slide, ['Gunakan tabel slide sebelumnya untuk menunjuk satu baris dan satu kolom.']);
}

// Slide 5: attributes
{
  const slide = contentSlide(5, 'Properti array', 'Periksa shape sebelum mengolah data', 'Properti array memberi tahu ukuran data dan tipe elemennya.');
  codePanel(slide, 'properties-code', 86, 242, 650, 330,
    'print(penjualan.ndim)\nprint(penjualan.shape)\nprint(penjualan.size)\nprint(penjualan.dtype)', 21);
  shape(slide, 'roundRect', 'properties-result', 790, 260, 392, 275, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'properties-result-title', 824, 292, 315, 36, 'Untuk dataset ini', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'properties-result-copy', 824, 346, 320, 155, 'ndim  →  2\nshape →  (4, 3)\nsize  →  12\ndtype →  integer', { size: 22, color: C.navy, font: FONT_CODE });
  notes(slide, ['Ajak siswa mengaitkan size 12 dengan empat cabang dikali tiga bulan.']);
}

// Slide 6: indexing
{
  const slide = contentSlide(6, 'Indexing dan slicing', 'Pilih data dengan posisi baris dan kolom', 'Index dimulai dari 0. Tanda titik dua mengambil rentang pada suatu sumbu.');
  codePanel(slide, 'index-code', 86, 242, 700, 340,
    'penjualan[0, 1]       # Jakarta, Feb\npenjualan[:, 0]       # semua cabang, Jan\npenjualan[1:4:2, 1:]  # Bandung dan Medan, Feb-Mar', 18);
  shape(slide, 'roundRect', 'index-note', 835, 263, 350, 250, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'index-note-title', 865, 292, 290, 36, 'Cara membaca', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'index-note-copy', 865, 348, 295, 130, 'baris pertama → cabang\nkolom kedua → bulan\n\n`:` → ambil seluruh sumbu', { size: 19, color: C.grey });
  notes(slide, ['Index NumPy dimulai dari nol. Basic indexing dan slicing berlaku pada setiap dimensi array.', 'Dokumentasi: https://numpy.org/doc/stable/user/basics.indexing.html']);
}

// Slide 7: reshape and transpose
{
  const slide = contentSlide(7, 'Transformasi bentuk', 'reshape dan transpose menyusun ulang tampilan', 'Jumlah elemen tetap sama. Urutan data perlu diketahui saat reshape.');
  codePanel(slide, 'reshape-code', 86, 240, 660, 360,
    'raw = np.array([120, 135, 128,\n                 98, 108, 112,\n                 145, 138, 152,\n                 87, 95, 103])\n\ntabel = raw.reshape(4, 3)\ntampilan_bulan = tabel.T', 18);
  shape(slide, 'roundRect', 'reshape-result', 805, 264, 376, 255, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'reshape-result-title', 835, 294, 320, 36, 'Bentuk hasil', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'reshape-result-copy', 835, 350, 315, 105, 'raw               (12,)\ntabel             (4, 3)\ntampilan_bulan    (3, 4)', { size: 18, color: C.navy, font: FONT_CODE });
  text(slide, 'reshape-note', 835, 465, 305, 38, 'Transpose menukar sumbu.', { size: 18, color: C.grey });
  notes(slide, ['Tegaskan bahwa reshape tidak menambah atau membuang nilai. Bentuk baru harus sesuai dengan jumlah elemennya.', 'Dokumentasi: https://numpy.org/doc/stable/reference/generated/numpy.reshape.html']);
}

// Slide 8: middle practice
{
  const slide = contentSlide(8, 'Practice tengah  •  15 menit', 'Bentuk laporan penjualan kuartal', 'Susun ulang data mentah, lalu tampilkan dari dua orientasi.');
  shape(slide, 'roundRect', 'practice-mid-data-bg', 72, 236, 530, 388, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'practice-mid-data-label', 100, 255, 455, 30, 'DATA MENTAH', { size: 15, color: C.blue, bold: true });
  codePanel(slide, 'practice-mid-data-code', 96, 300, 480, 222,
    'raw = np.array([\n  145, 151, 162,\n  102, 112, 118,\n  132, 129, 140,\n   91, 108, 113\n])', 17);
  text(slide, 'practice-mid-branch-list', 100, 545, 455, 50, 'Urutan cabang: Jakarta, Bandung, Surabaya, Medan', { size: 17, color: C.navy });
  shape(slide, 'roundRect', 'practice-mid-task-bg', 632, 236, 576, 388, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'practice-mid-task-title', 665, 260, 505, 34, 'Tugas', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'practice-mid-tasks', 665, 314, 500, 240,
    '1  Bentuk matriks 4 × 3.\n\n2  Ambil nilai semua cabang pada Februari.\n\n3  Pilih baris Jakarta dan Surabaya.\n\n4  Buat tampilan bulan sebagai baris.\n\n5  Cetak shape dan jelaskan maknanya.',
    { size: 19, color: C.grey });
  text(slide, 'practice-mid-note', 665, 568, 500, 36, 'Gunakan slicing, reshape, dan `.T`.', { size: 17, color: C.navy, bold: true });
  notes(slide, ['Practice tengah dikerjakan di notebook. Minta siswa menyebutkan susunan raw sebelum menjalankan reshape.']);
}

// Slide 9: vectorized operations
{
  const slide = contentSlide(9, 'Operasi vektor', 'Satu operasi dapat mengubah seluruh matriks', 'Gunakan skenario penyesuaian yang sama pada setiap nilai penjualan.');
  codePanel(slide, 'vector-code', 86, 248, 700, 310,
    'penjualan_diskon = penjualan * 0.95\npenjualan_skenario = penjualan * 1.05\n\nprint(penjualan_skenario)', 20);
  shape(slide, 'roundRect', 'vector-note', 835, 270, 350, 218, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'vector-note-title', 864, 300, 290, 35, 'Per elemen', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'vector-note-copy', 864, 354, 292, 106, 'Hasil memiliki shape yang sama.\n\nTidak perlu mengambil setiap nilai satu per satu.', { size: 19, color: C.grey });
  notes(slide, ['Faktor 0.95 dan 1.05 adalah asumsi latihan untuk menunjukkan operasi vektor.']);
}

// Slide 10: month broadcast
{
  const slide = contentSlide(10, 'Broadcasting per bulan', 'Terapkan faktor berbeda pada tiap bulan', 'Faktor bulanan diulang untuk setiap baris cabang.');
  codePanel(slide, 'broadcast-month-code', 86, 245, 690, 320,
    'faktor_bulan = np.array([1.00, 1.04, 1.08])\nproyeksi_q1 = penjualan * faktor_bulan\n\npenjualan.shape  # (4, 3)\nfaktor_bulan.shape # (3,)\nproyeksi_q1.shape # (4, 3)', 17);
  shape(slide, 'roundRect', 'broadcast-month-shape', 820, 260, 365, 240, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'broadcast-month-title', 850, 290, 305, 34, 'Pencocokan dimensi', { size: 22, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'broadcast-month-copy', 850, 350, 300, 102, '(4, 3)\n     (3,)\n→ hasil (4, 3)', { size: 24, color: C.navy, font: FONT_CODE });
  text(slide, 'broadcast-month-note', 850, 465, 300, 28, 'Satu faktor untuk setiap kolom.', { size: 18, color: C.grey });
  notes(slide, ['Faktor bulan adalah asumsi skenario. Broadcasting memperluas kecocokan bentuk secara konseptual tanpa perlu mengisi salinan array secara manual.', 'Dokumentasi: https://numpy.org/doc/stable/user/basics.broadcasting.html']);
}

// Slide 11: row broadcasting and shape mismatch
{
  const slide = contentSlide(11, 'Bentuk array', 'Faktor cabang perlu dibentuk sebagai kolom', 'Bentuk faktor menentukan apakah broadcasting cocok dengan matriks.');
  codePanel(slide, 'broadcast-branch-code', 86, 242, 690, 340,
    'faktor_cabang = np.array([\n    1.05, 0.98, 1.08, 0.97\n])\n\nfaktor_kolom = faktor_cabang.reshape(4, 1)\nproyeksi = penjualan * faktor_kolom', 17);
  shape(slide, 'roundRect', 'broadcast-branch-note', 820, 258, 365, 280, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'broadcast-branch-title', 850, 288, 305, 35, 'Bandingkan shape', { size: 22, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'broadcast-branch-copy', 850, 345, 305, 124, 'Faktor awal  (4,)\nFaktor kolom (4, 1)\nPenjualan    (4, 3)\nHasil        (4, 3)', { size: 18, color: C.navy, font: FONT_CODE });
  text(slide, 'broadcast-branch-foot', 850, 486, 300, 36, 'Satu faktor untuk tiap baris cabang.', { size: 17, color: C.grey });
  notes(slide, ['Aturan broadcasting membandingkan ukuran dimensi dari kanan. Bentuk (4,) tidak cocok dengan (4, 3). Setelah diubah menjadi (4, 1), ukuran 1 dapat menyesuaikan sepanjang tiga kolom.', 'Dokumentasi: https://numpy.org/doc/stable/user/basics.broadcasting.html']);
}

// Slide 12: Boolean masks
{
  const slide = contentSlide(12, 'Boolean mask', 'Kondisi menghasilkan pilihan data', 'Bandingkan nilai dengan ambang, lalu pakai hasil perbandingan sebagai mask.');
  codePanel(slide, 'mask-code', 86, 242, 700, 330,
    'mask_januari = penjualan[:, 0] >= 100\ncabang_kuat = cabang[mask_januari]\n\nmask_bulanan = proyeksi_q1 >= target_bulan\nnilai_di_atas_target = proyeksi_q1[mask_bulanan]', 18);
  shape(slide, 'roundRect', 'mask-note', 830, 264, 355, 235, C.paleGreen, C.green, 1, 10);
  text(slide, 'mask-note-title', 860, 294, 295, 35, 'Hasil mask', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'mask-note-copy', 860, 350, 295, 110, 'True  → pilih data\nFalse → lewati data\n\nUrutan baris tetap terjaga.', { size: 19, color: C.grey });
  notes(slide, ['NumPy mendukung Boolean indexing pada array. Untuk array dua dimensi, penggunaan satu mask per elemen menghasilkan pilihan elemen yang memenuhi kondisi.', 'Dokumentasi: https://numpy.org/doc/stable/user/basics.indexing.html']);
}

// Slide 13: np.where
{
  const slide = contentSlide(13, 'Kategori dari kondisi', 'np.where memberi label pada tiap pengamatan', 'Hasil label mempertahankan susunan cabang dan bulan.');
  codePanel(slide, 'where-code', 86, 246, 700, 316,
    'status = np.where(\n    proyeksi_q1 >= target_bulan,\n    "Mencapai target",\n    "Di bawah target"\n)\n\nprint(status.shape)', 18);
  shape(slide, 'roundRect', 'where-result', 830, 270, 355, 220, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'where-result-title', 860, 300, 300, 35, 'Satu label per sel', { size: 22, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'where-result-copy', 860, 354, 295, 102, 'Masukan: matriks 4 × 3\nKondisi: True atau False\nHasil: matriks label 4 × 3', { size: 18, color: C.grey });
  notes(slide, ['np.where memilih antara dua nilai berdasarkan kondisi. Di sini setiap label cocok dengan satu pasangan cabang dan bulan.', 'Dokumentasi: https://numpy.org/doc/stable/reference/generated/numpy.where.html']);
}

// Slide 14: axis and argmax
{
  const slide = contentSlide(14, 'Agregasi array', 'axis menentukan arah ringkasan', 'Pilih sumbu berdasarkan hasil yang ingin dihitung.');
  codePanel(slide, 'axis-code', 86, 245, 650, 340,
    'total_cabang = proyeksi_q1.sum(axis=1)\ntotal_bulan = proyeksi_q1.sum(axis=0)\n\nnama_cabang = cabang[np.argmax(total_cabang)]\nnama_bulan = bulan[np.argmax(total_bulan)]', 17);
  shape(slide, 'roundRect', 'axis-row-panel', 782, 248, 406, 132, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'axis-row-title', 810, 270, 346, 30, 'axis=1  →  satu total per cabang', { size: 20, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'axis-row-copy', 810, 313, 346, 44, 'Gabungkan bulan pada tiap baris.', { size: 18, color: C.grey });
  shape(slide, 'roundRect', 'axis-column-panel', 782, 406, 406, 132, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'axis-column-title', 810, 428, 346, 30, 'axis=0  →  satu total per bulan', { size: 20, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'axis-column-copy', 810, 471, 346, 44, 'Gabungkan cabang pada tiap kolom.', { size: 18, color: C.grey });
  notes(slide, ['axis=1 mengurangi dimensi kolom dan menghasilkan satu total per baris. axis=0 mengurangi baris dan menghasilkan satu total per kolom. np.argmax mengembalikan indeks nilai maksimum.', 'Dokumentasi: https://numpy.org/doc/stable/reference/generated/numpy.argmax.html']);
}

// Slide 15: concatenate
{
  const slide = contentSlide(15, 'Menggabungkan array', 'Tambahkan bulan dengan concatenate', 'Untuk menambah kolom, jumlah baris harus sama.');
  codePanel(slide, 'concat-code', 86, 244, 700, 322,
    'april = np.array([132, 117, 160, 108])\napril = april.reshape(4, 1)\n\npenjualan_4bulan = np.concatenate(\n    (penjualan, april), axis=1\n)', 18);
  shape(slide, 'roundRect', 'concat-note', 830, 274, 355, 220, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'concat-note-title', 860, 304, 295, 35, 'Bentuk array', { size: 22, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'concat-note-copy', 860, 358, 295, 96, '(4, 3) + (4, 1)\naxis=1\n→ (4, 4)', { size: 21, color: C.navy, font: FONT_CODE });
  notes(slide, ['np.concatenate menggabungkan urutan array sepanjang axis yang dipilih. Selain sumbu penggabungan, dimensi lain harus sama.', 'Dokumentasi: https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html']);
}

// Slide 16: final practice
{
  const slide = contentSlide(16, 'Practice akhir  •  24 menit', 'Evaluasi skenario penjualan empat bulan', 'Gunakan asumsi proyeksi untuk mencari cabang dan bulan yang perlu perhatian.');
  shape(slide, 'roundRect', 'practice-end-data-bg', 72, 235, 520, 397, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'practice-end-data-title', 100, 254, 455, 28, 'DATA DAN ASUMSI', { size: 15, color: C.blue, bold: true });
  codePanel(slide, 'practice-end-data-code', 96, 295, 472, 267,
    'april = [132, 117, 160, 108]\nfaktor = [1.00, 1.04, 1.08, 1.10]\n\ntarget_cabang = [540, 450,\n                 620, 420]\ntarget_bulan = [110, 115,\n                120, 130]', 16);
  text(slide, 'practice-end-unit', 100, 580, 450, 28, 'Angka dinyatakan dalam juta rupiah.', { size: 17, color: C.navy });
  shape(slide, 'roundRect', 'practice-end-task-bg', 622, 235, 586, 397, C.paleBlue, C.cyan, 1, 10);
  text(slide, 'practice-end-task-title', 652, 256, 520, 34, 'Tugas', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'practice-end-tasks', 652, 304, 520, 265,
    '1  Tambahkan April ke matriks.\n2  Terapkan faktor tiap bulan.\n3  Hitung total per cabang dan bulan.\n4  Tandai target yang tercapai.\n5  Cari cabang dan bulan tertinggi.\n6  Tulis rekomendasi dengan angka.',
    { size: 18, color: C.grey });
  shape(slide, 'roundRect', 'practice-end-note', 652, 568, 520, 43, C.paleYellow, C.yellow, 1, 8);
  text(slide, 'practice-end-note-text', 670, 579, 482, 25, 'Sertakan satu bukti numerik pada kesimpulan.', { size: 16, color: C.navy, bold: true });
  notes(slide, ['Gunakan penjualan dasar dan label cabang pada slide dataset. Faktor bulan adalah asumsi skenario. Tugas dikerjakan di notebook.', 'Validasi jawaban ada pada catatan pengajar slide 17.']);
}

// Slide 17: close
{
  const slide = contentSlide(17, 'Ringkasan', 'Dari shape menuju kesimpulan bisnis', 'Array membantu menjaga susunan data saat kita menghitung dan memfilter banyak nilai.');
  text(slide, 'summary-points', 90, 248, 650, 285,
    '• `shape` menjelaskan susunan baris dan kolom.\n\n• Broadcasting menerapkan faktor sesuai bentuk array.\n\n• Mask dan `np.where` memilih atau memberi label pada data.\n\n• `axis` menentukan apakah ringkasan dibuat per baris atau kolom.',
    { size: 21, color: C.navy });
  shape(slide, 'roundRect', 'exit-ticket-panel', 790, 252, 395, 275, C.paleYellow, C.yellow, 1, 10);
  text(slide, 'exit-ticket-title', 820, 282, 330, 35, 'Exit ticket', { size: 23, color: C.navy, bold: true, font: FONT_DISPLAY });
  text(slide, 'exit-ticket-copy', 820, 337, 330, 150,
    'Apa arti `axis=1` pada data ini?\n\nMengapa faktor per cabang perlu dibentuk sebagai kolom?',
    { size: 19, color: C.grey });
  notes(slide, [
    'Jawaban practice akhir untuk pengajar. Total proyeksi per cabang sekitar [543.8, 460.0, 628.7, 415.8]. Total per bulan sekitar [450.0, 495.0, 534.6, 568.7].',
    'Jakarta, Bandung, dan Surabaya mencapai target cabang. Medan berada di bawah target. Surabaya memiliki total cabang tertinggi dan April memiliki total bulanan tertinggi.',
  ]);
}

const candidatePath = path.join(TMP_DIR, 'candidate.pptx');
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, 'container_tools/artifact_tool_utils.mjs')).href);
const stagingDir = path.join(workspaceDir, '_pengembangan/level-02/03-analisis-data-numpy/validasi-slide');
await fs.mkdir(stagingDir, { recursive: true });
const requirements = {
  explicitTotalSlideCount: 17,
  requiredNativeTableOwnerSlides: [3],
  requiredNativeChartOwnerSlides: [],
};
const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: '/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',
  integrityValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: [
    '--expected-slide-size-emu', '12192000,6858000',
    '--validate-bullet-geometry',
    '--validate-heading-fit',
    '--require-native-table-slide', '3',
  ],
  requiredNativeTableOwnerSlides: [3],
  fontPolicy: {
    basis: 'reference',
    families: ['SF Pro Display', 'SF Pro Text', 'SF Mono'],
    referencePath: FONT_REFERENCE,
    referenceSha256: fontReferenceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, 'NumPy_Analisis_Data_Penjualan_Python.validation.json'),
});
console.log(JSON.stringify({ finalPath: FINAL_PPTX, candidatePath, result }, null, 2));
