import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const workspaceDir = '/Users/daf2a/Documents/python';
const buildDir = path.join(workspaceDir, '_pengembangan/level-02/04-evaluasi-python-numpy/slide');
const outputDir = path.join(workspaceDir, 'level-02/04-evaluasi-python-numpy/slide');
const skillDir = '/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const finalPath = path.join(outputDir, 'Python_NumPy_Reevaluation_Summary_v3.pptx');
const fontReference = path.join(workspaceDir, 'level-02/03-analisis-data-numpy/slide/NumPy_Analisis_Data_Penjualan_Python_Speaker_Notes.pptx');
await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const { resolvePresentationFont, finalizePresentation } = await import(pathToFileURL(path.join(skillDir, 'container_tools/artifact_tool_utils.mjs')).href);
const FONT_DISPLAY = resolvePresentationFont({ sourceFont: 'SF Pro Display' });
const FONT_TEXT = resolvePresentationFont({ sourceFont: 'SF Pro Text' });
const FONT_CODE = resolvePresentationFont({ sourceFont: 'SF Mono' });
const C = {
  navy: '#111A30', blue: '#196B9B', cyan: '#4FB6E8', grey: '#4B5868', muted: '#7D8793',
  line: '#E7EAEE', white: '#FFFFFF', paleBlue: '#EAF6FC', paleYellow: '#FFF7D6',
  yellow: '#F5D36A', paleGreen: '#E9F7EE', green: '#55B77A', paleRed: '#FCEBEC', red: '#E96B6B',
};
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const elementsBySlide = new Map();
const fixedHeadingElements = new WeakSet();

function rect(slide, name, x, y, w, h, fill = 'none', stroke = 'none', sw = 0, radius = 0) {
  const element = slide.shapes.add({ geometry: radius ? 'roundRect' : 'rect', name, position: { left: x, top: y, width: w, height: h }, fill, line: { style: 'solid', fill: stroke, width: sw }, ...(radius ? { borderRadius: radius } : {}) });
  if (!elementsBySlide.has(slide)) elementsBySlide.set(slide, []);
  elementsBySlide.get(slide).push(element);
  return element;
}
function line(slide, name, x1, y1, x2, y2, color = C.line, width = 2) {
  return slide.shapes.add({ geometry: 'line', name, position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }, fill: 'none', line: { style: 'solid', fill: color, width } });
}
function txt(slide, name, x, y, w, h, value, opts = {}) {
  const el = rect(slide, name, x, y, w, h);
  el.text = value;
  el.text.style = {
    typeface: opts.font ?? FONT_TEXT, fontSize: opts.size ?? 22, color: opts.color ?? C.grey,
    bold: opts.bold ?? false, alignment: opts.align ?? 'left', verticalAlignment: opts.valign ?? 'top',
    autoFit: 'shrinkText', wrap: 'square', insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return el;
}
function panel(slide, name, x, y, w, h, fill = C.paleBlue, stroke = C.cyan) { return rect(slide, name, x, y, w, h, fill, stroke, 1.3, 10); }
function code(slide, name, x, y, w, h, value, size = 20) {
  panel(slide, `${name}-bg`, x, y, w, h, C.navy, C.navy);
  txt(slide, `${name}-text`, x + 25, y + 22, w - 50, h - 44, value, { font: FONT_CODE, size, color: C.white });
}
function base(title, subtitle) {
  const slide = deck.slides.add();
  slide.background.fill = C.white;
  const titleElement = txt(slide, 'slide-title', 72, 54, 1136, 72, title, { font: FONT_DISPLAY, size: 42, color: C.navy, bold: true });
  const subtitleElement = txt(slide, 'slide-subtitle', 72, 139, 1136, 52, subtitle, { size: 24, color: C.grey });
  const dividerElement = rect(slide, 'title-divider', 72, 213, 1136, 3, C.line, C.line);
  fixedHeadingElements.add(titleElement);
  fixedHeadingElements.add(subtitleElement);
  fixedHeadingElements.add(dividerElement);
  return slide;
}
function label(slide, name, x, y, w, value, color = C.blue) { txt(slide, name, x, y, w, 30, value, { size: 19, color, bold: true }); }
function table(slide, name, x, y, widths, rows, rowH = 52, opts = {}) {
  const fullW = widths.reduce((a, b) => a + b, 0);
  rows.forEach((row, r) => {
    let cx = x;
    if (r === 0) rect(slide, `${name}-head-bg`, x, y, fullW, rowH, C.navy, C.navy, 1, 4);
    else if (r % 2 === 0) rect(slide, `${name}-band-${r}`, x, y + r * rowH, fullW, rowH, opts.band ?? C.paleBlue, 'none', 0);
    row.forEach((cell, c) => {
      const cellW = widths[c];
      txt(slide, `${name}-r${r}-c${c}`, cx + 13, y + r * rowH + 11, cellW - 24, rowH - 16, String(cell), {
        size: r === 0 ? 19 : (opts.fontSize ?? 20), color: r === 0 ? C.white : C.navy,
        bold: r === 0 || c === 0 && opts.firstColBold, font: r === 0 ? FONT_DISPLAY : (opts.monoFirst && c === 0 ? FONT_CODE : FONT_TEXT), valign: 'middle',
      });
      if (c > 0) line(slide, `${name}-v${r}-${c}`, cx, y + r * rowH + 4, cx, y + (r + 1) * rowH - 4, r === 0 ? '#31405C' : C.line, 1);
      cx += cellW;
    });
    if (r > 0) line(slide, `${name}-h${r}`, x, y + r * rowH, x + fullW, y + r * rowH, C.line, 1);
  });
  return fullW;
}
function card(slide, name, x, y, w, h, head, body, fill = C.paleBlue, stroke = C.cyan) {
  panel(slide, `${name}-panel`, x, y, w, h, fill, stroke);
  txt(slide, `${name}-head`, x + 22, y + 14, w - 44, 32, head, { font: FONT_DISPLAY, size: 22, color: C.navy, bold: true });
  txt(slide, `${name}-body`, x + 22, y + 51, w - 44, h - 62, body, { size: 20, color: C.grey });
}

// 1. Variables and data types
{
  const s = base('Variabel dan tipe data', 'Variabel memberi nama pada nilai yang kita simpan dan olah.');
  table(s, 'types', 90, 255, [220, 205, 595], [
    ['Tipe', 'Contoh', 'Kegunaan dalam data'], ['int', '12', 'Jumlah barang atau peserta'], ['float', '0.35', 'Berat atau hasil rata-rata'], ['str', '"Jakarta"', 'Nama cabang atau kategori'], ['bool', 'True', 'Status aktif atau hasil kondisi'], ['list', '[80, 75, 90]', 'Kumpulan nilai berurutan'],
  ], 55, { monoFirst: true, fontSize: 19 });
}
// 2. Statements, comments, indentation
{
  const s = base('Statement, komentar, dan indentation', 'Statement dijalankan berurutan. Komentar memberi konteks, indentation membentuk blok.');
  code(s, 'syntax', 90, 260, 660, 300, 'total = harga * jumlah\n\n# proses pesanan\nif stok >= jumlah:\n    stok = stok - jumlah');
  card(s, 'statement', 800, 264, 340, 118, 'Statement', 'total = harga * jumlah');
  card(s, 'comment', 800, 405, 340, 138, 'Komentar', 'Baris yang diawali # tidak dijalankan.');
  txt(s, 'indent-note', 105, 594, 1030, 40, 'Indentation menentukan baris mana yang menjadi isi blok if.', { size: 21, color: C.blue, bold: true });
}
// 3. Input, casting, output
{
  const s = base('Input, casting, dan output', 'input() selalu menerima teks. Ubah tipe sebelum melakukan operasi numerik.');
  const items = [['Masukan', 'input()\n"3"'], ['Konversi', 'int("3")\n3'], ['Perhitungan', '3 × 0.35\n1.05'], ['Keluaran', 'print(...)\nmenampilkan hasil']];
  items.forEach((it, i) => { const x = 82 + i * 286; panel(s, `flow-${i}`, x, 300, 250, 210, i % 2 ? C.paleYellow : C.paleBlue, i % 2 ? C.yellow : C.cyan); txt(s, `flow-title-${i}`, x + 18, 323, 215, 35, it[0], { font: FONT_DISPLAY, size: 22, bold: true, color: C.navy }); txt(s, `flow-copy-${i}`, x + 18, 378, 215, 96, it[1], { size: 22, font: i < 3 ? FONT_CODE : FONT_TEXT, color: C.grey }); if (i < 3) line(s, `flow-link-${i}`, x + 251, 402, x + 282, 402, C.blue, 3); });
  txt(s, 'casting-detail', 100, 557, 1080, 45, 'int(3.8) menghasilkan 3. Konversi ini memotong bagian desimal, bukan membulatkan.', { size: 20, color: C.grey });
}
// 4. Arithmetic
{
  const s = base('Operasi aritmatika', 'Operator dasar membantu menghitung total, selisih, harga, dan ukuran turunan.');
  table(s, 'arithmetic', 120, 265, [210, 260, 600], [
    ['Operator', 'Contoh', 'Hasil'], ['+', '10 + 3', '13'], ['−', '10 − 3', '7'], ['×', '10 * 3', '30'], ['/', '10 / 4', '2.5'], ['**', '3 ** 2', '9'],
  ], 54, { fontSize: 22 });
  txt(s, 'python-operator-note', 125, 616, 1040, 35, 'Di Python, perkalian ditulis dengan * dan pembagian dengan /.', { size: 20, color: C.blue, bold: true });
}
// 5. Floor division, modulo, precedence
{
  const s = base('Pembagian bulat dan urutan hitung', 'Pembagian bulat memberi kelompok penuh. Modulo memberi sisa pembagian.');
  label(s, 'ten-items', 110, 264, 560, '10 barang dibagi menjadi kelompok berisi 4');
  for (let i = 0; i < 10; i++) { const x = 125 + (i % 5) * 90; const y = 315 + Math.floor(i / 5) * 82; rect(s, `unit-${i}`, x, y, 60, 54, i < 8 ? C.paleBlue : C.paleYellow, i < 8 ? C.cyan : C.yellow, 1, 8); txt(s, `unit-label-${i}`, x, y + 11, 60, 32, String(i + 1), { size: 20, align: 'center', color: C.navy, bold: true }); }
  txt(s, 'group-result', 122, 490, 500, 55, '10 // 4 = 2 kelompok    10 % 4 = 2 sisa', { font: FONT_CODE, size: 21, color: C.navy });
  card(s, 'precedence', 700, 290, 440, 244, 'Urutan operasi', '2 + 3 * 4 = 14\n(2 + 3) * 4 = 20\n\nTanda kurung mengubah urutan.', C.paleYellow, C.yellow);
}
// 6. Comparisons
{
  const s = base('Operator pembanding', 'Setiap perbandingan menghasilkan True atau False.');
  table(s, 'comparators', 155, 272, [220, 380, 470], [
    ['Operator', 'Arti', 'Contoh'], ['==', 'sama dengan', 'status == "aktif"'], ['!=', 'tidak sama', 'status != "batal"'], ['>', 'lebih besar', 'jumlah > stok'], ['<', 'lebih kecil', 'stok < minimum'], ['>=', 'sekurangnya', 'nilai >= 80'], ['<=', 'paling banyak', 'jumlah <= stok'],
  ], 49, { fontSize: 19, monoFirst: true });
  txt(s, 'equals-note', 165, 635, 1020, 30, '= memberi atau memperbarui nilai. == membandingkan dua nilai.', { size: 19, color: C.blue, bold: true });
}
// 7. If / elif / else
{
  const s = base('if, elif, dan else', 'Dalam satu rangkaian, Python menjalankan cabang pertama yang kondisinya benar.');
  code(s, 'stock-check', 95, 272, 505, 295, 'if jumlah <= 0:\n    status = "tidak valid"\nelif jumlah > stok:\n    status = "stok kurang"\nelse:\n    status = "diterima"', 18);
  const nodes = [['jumlah <= 0', C.paleYellow], ['jumlah > stok', C.paleRed], ['pesanan diterima', C.paleGreen]];
  nodes.forEach((n, i) => { const y = 278 + i * 112; panel(s, `decision-${i}`, 700, y, 400, 72, n[1], i === 1 ? C.red : (i === 2 ? C.green : C.yellow)); txt(s, `decision-text-${i}`, 725, y + 20, 350, 34, n[0], { size: 23, align: 'center', color: C.navy, bold: true }); if (i < 2) line(s, `decision-link-${i}`, 900, y + 74, 900, y + 106, C.blue, 2); });
}
// 8. Logic
{
  const s = base('and, or, dan not', 'Gabungkan kondisi untuk menyatakan aturan yang melibatkan beberapa syarat.');
  table(s, 'logic', 110, 270, [225, 225, 260, 260], [
    ['Aktif', 'Stok cukup', 'and', 'or'], ['True', 'True', 'True', 'True'], ['True', 'False', 'False', 'True'], ['False', 'True', 'False', 'True'], ['False', 'False', 'False', 'False'],
  ], 58, { fontSize: 21 });
  panel(s, 'not-logic', 350, 585, 570, 70, C.paleYellow, C.yellow);
  txt(s, 'not-logic-copy', 375, 605, 520, 34, 'not membalik True menjadi False, dan sebaliknya.', { size: 20, color: C.navy, bold: true, align: 'center' });
}
// 9. Nested versus independent checks
{
  const s = base('Kondisi bertingkat dan kondisi terpisah', 'Pilih bentuk kondisi berdasarkan hubungan antaraturan.');
  card(s, 'nested-if', 105, 278, 500, 265, 'Bertingkat', 'Validasi berat\n    lalu cek stok\n\nLangkah kedua hanya perlu jika berat lolos.', C.paleBlue, C.cyan);
  card(s, 'independent-if', 675, 278, 500, 265, 'Terpisah', 'Cek kemasan\nCek label\n\nKedua masalah dapat dicatat sekaligus.', C.paleYellow, C.yellow);
  txt(s, 'condition-example', 118, 582, 1030, 42, 'Contoh batas: 480 <= berat <= 520 menerima nilai 480 dan 520.', { font: FONT_CODE, size: 19, color: C.navy });
}
// 10. match/case and pass
{
  const s = base('match/case dan pass', 'match/case memilih tindakan berdasarkan satu nilai yang memiliki beberapa kemungkinan.');
  code(s, 'match-code', 100, 268, 630, 335, 'match kode_layanan:\n    case "REG":\n        tarif = 12000\n    case "EXP":\n        tarif = 20000\n    case _:\n        tarif = None', 18);
  card(s, 'case-default', 800, 284, 340, 135, 'case _', 'Pilihan default untuk nilai lain.');
  card(s, 'pass', 800, 450, 340, 135, 'pass', 'Placeholder. Blok valid, belum menjalankan tindakan.', C.paleYellow, C.yellow);
}
// 11. Loops
{
  const s = base('for dan while', 'for mengikuti urutan data. while berjalan selama kondisi masih benar.');
  card(s, 'for-loop', 105, 285, 500, 270, 'for', 'for transaksi in penjualan:\n    total += transaksi\n\nSetiap item diproses satu kali.', C.paleBlue, C.cyan);
  card(s, 'while-loop', 675, 285, 500, 270, 'while', 'while stok > 0:\n    layani_pesanan()\n    stok -= 1\n\nKeadaan berubah hingga loop berhenti.', C.paleYellow, C.yellow);
}
// 12. range
{
  const s = base('range', 'range(start, stop, step) membuat urutan bilangan. Nilai stop tidak disertakan.');
  const seqs = [['range(1, 5)', '1   2   3   4'], ['range(0, 6, 2)', '0   2   4'], ['range(5, 0, -2)', '5   3   1']];
  seqs.forEach((r, i) => { const y = 266 + i * 122; txt(s, `range-expr-${i}`, 145, y, 400, 42, r[0], { font: FONT_CODE, size: 24, color: C.blue, bold: true }); panel(s, `range-bg-${i}`, 575, y - 5, 520, 70, i === 1 ? C.paleYellow : C.paleBlue, i === 1 ? C.yellow : C.cyan); txt(s, `range-sequence-${i}`, 605, y + 12, 460, 42, r[1], { font: FONT_CODE, size: 25, color: C.navy }); });
  txt(s, 'range-dimensions', 150, 650, 940, 32, 'start menentukan awal, step menentukan jarak antarangka.', { size: 20, color: C.grey });
}
// 13. enumerate
{
  const s = base('enumerate', 'enumerate(data) menghasilkan indeks bersama nilai pada setiap item.');
  table(s, 'enumerate-table', 205, 280, [240, 300, 360], [
    ['Indeks', 'Nama', 'Nomor tampilan'], ['0', 'Rani', '1'], ['1', 'Dimas', '2'], ['2', 'Salsa', '3'], ['3', 'Bagas', '4'],
  ], 58, { fontSize: 22 });
  code(s, 'enumerate-code', 320, 602, 620, 65, 'enumerate(nama, start=1)', 20);
}
// 14. Accumulator and max
{
  const s = base('Total dan nilai terbesar', 'Accumulator menggabungkan nilai. Kandidat maksimum diperbarui saat nilai baru lebih besar.');
  table(s, 'scan', 145, 280, [150, 200, 230, 230], [
    ['Dibaca', 'Nilai', 'Total sementara', 'Terbesar'], ['1', '12', '12', '12'], ['2', '8', '20', '12'], ['3', '15', '35', '15'],
  ], 60, { fontSize: 21 });
  txt(s, 'scan-note', 170, 570, 930, 68, 'Mulai total dari 0. Untuk mencari maksimum pada data yang tidak kosong, mulai dari item pertama.', { size: 20, color: C.grey });
}
// 15. Nested loops
{
  const s = base('Nested loops', 'Loop luar memilih baris. Loop dalam membaca setiap kursi pada baris itu.');
  const grid = [['A1', 'A2', 'A3', 'A4'], ['B1', 'B2', 'B3', 'B4'], ['C1', 'C2', 'C3', 'C4']];
  grid.forEach((row, r) => row.forEach((v, c) => { const x = 160 + c * 135, y = 275 + r * 90; panel(s, `seat-${r}-${c}`, x, y, 110, 64, v === 'B2' ? C.paleYellow : C.paleBlue, v === 'B2' ? C.yellow : C.cyan); txt(s, `seat-label-${r}-${c}`, x, y + 15, 110, 35, v, { align: 'center', size: 22, color: C.navy, bold: true }); }));
  code(s, 'nested-loop', 790, 280, 340, 300, 'for baris in denah:\n    for kursi in baris:\n        baca(kursi)', 18);
  txt(s, 'nested-loop-note', 176, 586, 900, 38, 'Setiap kursi dikunjungi satu kali oleh loop bagian dalam.', { size: 20, color: C.grey });
}
// 16. break and continue
{
  const s = base('break dan continue', 'Keduanya mengubah alur loop, tetapi pada titik yang berbeda.');
  table(s, 'loop-control', 130, 282, [240, 395, 400], [
    ['Instruksi', 'Pengaruh', 'Contoh pemakaian'], ['break', 'Keluar dari loop saat ini', 'Hentikan layanan jika antrean berikutnya tak bisa dipenuhi'], ['continue', 'Lewati sisa iterasi ini', 'Lewati transaksi batal saat menjumlahkan penjualan'],
  ], 90, { fontSize: 20, firstColBold: true });
  panel(s, 'loop-control-key', 375, 590, 540, 66, C.paleYellow, C.yellow);
  txt(s, 'loop-control-key-text', 402, 610, 486, 35, 'break berhenti    continue melewati satu putaran', { size: 20, color: C.navy, bold: true });
}
// 17. function and parameter
{
  const s = base('Function dan parameter', 'Parameter adalah nama input pada definisi. Argument adalah nilai saat pemanggilan.');
  code(s, 'function-example', 110, 270, 620, 250, 'def ringkasan(nilai, batas_lulus):\n    return nilai >= batas_lulus\n\nlulus = ringkasan(82, 75)', 20);
  panel(s, 'function-map', 805, 295, 325, 190, C.paleBlue, C.cyan);
  txt(s, 'param-title', 830, 323, 275, 36, 'Input function', { font: FONT_DISPLAY, size: 22, color: C.navy, bold: true });
  txt(s, 'param-body', 830, 374, 275, 90, 'parameter: nilai, batas_lulus\nargument: 82, 75', { size: 19, font: FONT_CODE, color: C.grey });
  txt(s, 'function-purpose', 145, 566, 970, 45, 'Satu aturan dapat dipakai ulang untuk data atau batas yang berbeda.', { size: 21, color: C.blue, bold: true });
}
// 18. print and return
{
  const s = base('print dan return', 'print menampilkan nilai. return mengirim nilai kembali kepada pemanggil.');
  code(s, 'print-versus-return', 110, 278, 525, 270, 'def cetak_total(data):\n    print(sum(data))\n\ndef hitung_total(data):\n    return sum(data)', 18);
  card(s, 'display', 725, 285, 375, 105, 'print(...)', 'Hasil terlihat di output.', C.paleBlue, C.cyan);
  card(s, 'return', 725, 420, 375, 105, 'return', 'Hasil dapat disimpan atau dipakai lagi.', C.paleYellow, C.yellow);
  txt(s, 'none-note', 160, 590, 940, 36, 'Function tanpa return eksplisit mengembalikan None.', { size: 21, color: C.blue, bold: true });
}
// 19. Recursion
{
  const s = base('Recursion dan base case', 'Function rekursif memanggil dirinya untuk masalah yang lebih kecil.');
  code(s, 'fibonacci', 95, 275, 440, 300, 'def fib(n):\n    if n == 0: return 0\n    if n == 1: return 1\n    return fib(n-1) + fib(n-2)', 17);
  const fibs = [['f(0)', '0'], ['f(1)', '1'], ['f(2)', '1'], ['f(3)', '2'], ['f(4)', '3']];
  fibs.forEach((a, i) => { const x = 590 + i * 112; panel(s, `fib-${i}`, x, 354, 94, 116, i < 2 ? C.paleYellow : C.paleBlue, i < 2 ? C.yellow : C.cyan); txt(s, `fib-name-${i}`, x, 373, 94, 35, a[0], { font: FONT_CODE, size: 18, color: C.navy, align: 'center' }); txt(s, `fib-value-${i}`, x, 418, 94, 40, a[1], { font: FONT_DISPLAY, size: 25, color: C.navy, bold: true, align: 'center' }); });
  txt(s, 'base-case-note', 610, 513, 500, 56, 'f(0) dan f(1) menghentikan pemanggilan berulang.', { size: 20, color: C.grey });
}
// 20. Mean and median
{
  const s = base('Mean dan median', 'Mean memakai seluruh nilai. Median adalah nilai tengah setelah data diurutkan.');
  const vals = [2, 4, 6];
  vals.forEach((v, i) => { const x = 205 + i * 160; panel(s, `mean-value-${i}`, x, 294, 112, 75, C.paleBlue, C.cyan); txt(s, `mean-v-${i}`, x, 314, 112, 36, String(v), { size: 24, color: C.navy, bold: true, align: 'center' }); });
  card(s, 'mean', 190, 420, 430, 137, 'Mean', '(2 + 4 + 6) / 3 = 4', C.paleBlue, C.cyan);
  card(s, 'median', 665, 420, 430, 137, 'Median', 'Nilai di tengah = 4', C.paleYellow, C.yellow);
  txt(s, 'median-even', 240, 592, 820, 42, 'Untuk 2, 4, 6, 8, median = (4 + 6) / 2 = 5.', { font: FONT_CODE, size: 20, color: C.navy });
}
// 21. Mode and range
{
  const s = base('Mode dan range', 'Mode menunjukkan nilai yang paling sering muncul. Range merentang dari minimum ke maksimum.');
  table(s, 'mode-values', 130, 267, [255, 235], [['Nilai', 'Frekuensi'], ['8', '2'], ['10', '1'], ['11', '1'], ['12', '1'], ['15', '1'], ['20', '1']], 48, { fontSize: 21, monoFirst: true });
  card(s, 'mode-range-summary', 720, 330, 400, 205, 'Ringkasan', 'Mode = 8\nFrekuensi = 2\nRange = 20 − 8 = 12', C.paleYellow, C.yellow);
  txt(s, 'mode-multimodal', 190, 620, 920, 34, 'Data dapat memiliki lebih dari satu mode jika frekuensi tertinggi sama.', { size: 20, color: C.grey });
}
// 22. Variance
{
  const s = base('Variansi populasi', 'Variansi merangkum kuadrat jarak setiap nilai dari mean.');
  table(s, 'variance', 275, 280, [230, 275, 300], [['Nilai x', 'x − mean', '(x − mean)²'], ['2', '−2', '4'], ['4', '0', '0'], ['6', '2', '4'], ['Jumlah', '', '8']], 58, { fontSize: 21 });
  panel(s, 'variance-result', 430, 606, 440, 60, C.paleYellow, C.yellow);
  txt(s, 'variance-result-text', 460, 623, 380, 34, 'variance = 8 / 3 ≈ 2.67', { size: 21, font: FONT_CODE, color: C.navy, bold: true, align: 'center' });
}
// 23. Standard deviation
{
  const s = base('Standard deviation', 'Akar variansi mengukur penyebaran dengan satuan yang sama seperti data.');
  const series = [{ title: 'A', values: [28, 29, 30, 31, 32], y: 325, fill: C.cyan }, { title: 'B', values: [20, 25, 30, 35, 40], y: 455, fill: '#E5B834' }];
  series.forEach((series, r) => {
    txt(s, `sd-${r}-title`, 115, series.y + 9, 60, 34, series.title, { size: 22, font: FONT_DISPLAY, color: C.navy, bold: true });
    line(s, `sd-${r}-axis`, 220, series.y + 31, 1050, series.y + 31, C.line, 3);
    series.values.forEach((v, i) => { const x = 220 + (v - 20) * 40; rect(s, `sd-dot-${r}-${i}`, x, series.y + 17, 28, 28, series.fill, series.fill, 1, 14); txt(s, `sd-val-${r}-${i}`, x - 3, series.y + 57, 34, 26, String(v), { size: 18, color: C.grey, align: 'center' }); });
  });
  txt(s, 'sd-label-a', 1080, 337, 90, 30, 'lebih rapat', { size: 18, color: C.blue });
  txt(s, 'sd-label-b', 1080, 468, 90, 30, 'lebih tersebar', { size: 18, color: C.blue });
  txt(s, 'sd-note', 220, 585, 860, 42, 'Keduanya bermean 30. Data B memiliki standard deviation lebih besar.', { size: 20, color: C.navy, bold: true });
}
// 24. List indexing and slicing
{
  const s = base('Indexing dan slicing list', 'Indeks dimulai dari 0. Batas akhir pada slicing tidak ikut diambil.');
  const names = ['Rani', 'Dimas', 'Salsa', 'Bagas'];
  names.forEach((v, i) => { const x = 120 + i * 260; panel(s, `name-cell-${i}`, x, 320, 220, 110, i % 2 ? C.paleBlue : C.paleYellow, i % 2 ? C.cyan : C.yellow); txt(s, `name-index-${i}`, x, 337, 220, 26, `index ${i}   /   ${i - names.length}`, { size: 17, color: C.blue, align: 'center' }); txt(s, `name-value-${i}`, x, 375, 220, 38, v, { size: 22, color: C.navy, bold: true, align: 'center' }); });
  code(s, 'list-slice', 235, 495, 810, 136, 'nama[0]     # Rani\nnama[-1]    # Bagas\nnama[:2]    # ["Rani", "Dimas"]', 18);
}
// 25. List methods
{
  const s = base('Perubahan isi list', 'Method menambah atau menghapus item dan dapat menggeser posisi item berikutnya.');
  table(s, 'list-methods', 90, 262, [220, 380, 480], [['Operasi', 'Pengaruh', 'Contoh'], ['append(item)', 'Tambah ke akhir', 'antrean.append("Tono")'], ['remove(item)', 'Hapus kemunculan pertama', 'antrean.remove("Salsa")'], ['pop(indeks)', 'Hapus dan ambil item pada indeks', 'dilayani = antrean.pop(0)'], ['pop()', 'Hapus dan ambil item terakhir', 'item = antrean.pop()'], ['copy()', 'Salin list luar', 'ringkasan = antrean.copy()']], 58, { fontSize: 18, monoFirst: true });
  txt(s, 'list-shift-note', 145, 628, 1000, 33, 'Setelah penghapusan, indeks item di belakangnya berubah.', { size: 20, color: C.blue, bold: true });
}
// 26. Nested lists
{
  const s = base('Nested list', 'List di dalam list dapat menyimpan tabel dengan susunan baris dan kolom.');
  table(s, 'nested-grid', 260, 285, [115, 200, 200, 200], [['', 'Ujian 1', 'Ujian 2', 'Ujian 3'], ['Rani', '78', '84', '88'], ['Dimas', '90', '76', '82'], ['Salsa', '85', '89', '91']], 65, { fontSize: 21 });
  code(s, 'nested-access', 365, 580, 540, 72, 'nilai[1][2] = 82', 21);
}
// 27. Dictionaries
{
  const s = base('Dictionary dan items()', 'Dictionary memetakan key ke value. items() membaca keduanya sebagai pasangan.');
  code(s, 'dict-code', 115, 270, 470, 260, 'produk = {\n    "nama": "Pensil",\n    "stok": 8,\n    "minimum": 15\n}\n\nproduk["stok"]', 18);
  const pairs = [['nama', 'Pensil'], ['stok', '8'], ['minimum', '15']];
  pairs.forEach((p, i) => { const y = 292 + i * 82; panel(s, `kv-${i}`, 690, y, 420, 60, i === 1 ? C.paleYellow : C.paleBlue, i === 1 ? C.yellow : C.cyan); txt(s, `kv-k-${i}`, 710, y + 15, 140, 32, p[0], { font: FONT_CODE, size: 20, color: C.blue }); txt(s, `kv-v-${i}`, 870, y + 15, 210, 32, p[1], { size: 21, color: C.navy, bold: true }); });
  txt(s, 'items-code', 700, 555, 395, 34, 'for key, value in produk.items():', { font: FONT_CODE, size: 17, color: C.grey });
}
// 28. Records and summaries
{
  const s = base('Record dan ringkasan data', 'List of dictionaries menyimpan satu record pada setiap dictionary.');
  code(s, 'records', 95, 270, 560, 300, 'produk = [\n  {"nama": "Pensil", "stok": 8, "min": 15},\n  {"nama": "Buku", "stok": 24, "min": 10},\n  {"nama": "Penghapus", "stok": 6, "min": 12}\n]', 17);
  const steps = [['Pilih', 'stok < minimum'], ['Ringkas', 'len, sum, min, max'], ['Urutkan', 'sorted(...)']];
  steps.forEach((st, i) => card(s, `record-step-${i}`, 735, 270 + i * 120, 390, 92, st[0], st[1], i === 1 ? C.paleYellow : C.paleBlue, i === 1 ? C.yellow : C.cyan));
  txt(s, 'record-output', 130, 605, 1030, 35, 'Hasil pilihan: Pensil dan Penghapus perlu diperiksa stoknya.', { size: 20, color: C.blue, bold: true });
}
// 29. Array properties
{
  const s = base('Properti array', 'ndim menghitung dimensi. shape memberi ukuran tiap dimensi. size menghitung semua elemen.');
  table(s, 'array-props', 115, 272, [230, 330, 470], [['Properti', 'Nilai untuk shape (4, 3)', 'Makna'], ['ndim', '2', 'Dua dimensi'], ['shape', '(4, 3)', 'Empat baris dan tiga kolom'], ['size', '12', 'Jumlah seluruh elemen'], ['dtype', 'int64 / float64', 'Tipe elemen array']], 66, { fontSize: 20, monoFirst: true });
  txt(s, 'array-props-example', 205, 635, 900, 32, 'Array cocok untuk operasi numerik yang konsisten pada banyak nilai.', { size: 19, color: C.blue });
}
// 30. Three dimensions
{
  const s = base('Array lebih dari dua dimensi', 'Shape (2, 4, 3) mewakili 2 periode, 4 stasiun, dan 3 hari.');
  const periodNames = ['Periode 1', 'Periode 2'];
  periodNames.forEach((p, n) => {
    txt(s, `period-title-${n}`, 125 + n * 550, 265, 460, 36, p, { size: 23, color: C.blue, bold: true, font: FONT_DISPLAY });
    for (let r = 0; r < 4; r++) {
      const y = 316 + r * 60;
      txt(s, `period-station-${n}-${r}`, 125 + n * 550, y + 10, 115, 28, `Stasiun ${r + 1}`, { size: 17, color: C.grey });
      for (let c = 0; c < 3; c++) { const x = 250 + n * 550 + c * 96; panel(s, `period-cell-${n}-${r}-${c}`, x, y, 78, 46, (r + c + n) % 2 ? C.paleBlue : C.paleYellow, (r + c + n) % 2 ? C.cyan : C.yellow); txt(s, `period-val-${n}-${r}-${c}`, x, y + 9, 78, 28, String(20 + n * 12 + r * 3 + c), { size: 18, color: C.navy, align: 'center' }); }
    }
  });
  txt(s, '3d-index', 360, 575, 550, 36, 'data[periode, stasiun, hari]', { size: 22, color: C.navy, font: FONT_CODE, align: 'center' });
  txt(s, '3d-note', 340, 624, 600, 29, 'ndim = 3    shape = (2, 4, 3)    size = 24', { size: 18, color: C.grey, font: FONT_CODE, align: 'center' });
}
// 31. Array indexing and slicing
{
  const s = base('Indexing dan slicing array', 'Pilih baris dan kolom dengan satu indeks untuk setiap dimensi.');
  const values = [[72, 85, 90], [82, 76, 88], [91, 84, 79], [65, 93, 87]];
  txt(s, 'slice-row-axis', 245, 262, 700, 30, 'kolom:     0        1        2', { size: 18, color: C.blue, font: FONT_CODE });
  values.forEach((row, r) => { txt(s, `slice-row-${r}`, 165, 316 + r * 68, 74, 30, `baris ${r}`, { size: 17, color: C.grey }); row.forEach((v, c) => { const x = 255 + c * 152, y = 304 + r * 68; const selected = (r === 1) || c === 1; panel(s, `slice-cell-${r}-${c}`, x, y, 125, 53, selected ? C.paleYellow : C.paleBlue, selected ? C.yellow : C.cyan); txt(s, `slice-value-${r}-${c}`, x, y + 11, 125, 32, String(v), { align: 'center', color: C.navy, size: 21, bold: selected }); }); });
  code(s, 'slice-exprs', 755, 333, 370, 206, 'data[0, 1]     # 85\ndata[:, 1]     # kolom 1\ndata[1:3, :]  # baris 1 dan 2', 17);
  txt(s, 'slice-stop', 250, 613, 770, 35, 'Batas akhir slicing tidak ikut diambil.', { size: 20, color: C.blue, bold: true });
}
// 32. reshape and transpose
{
  const s = base('reshape dan transpose', 'reshape mengubah susunan. transpose menukar baris dan kolom.');
  const matrix = (x, y, rows, cols, vals, prefix) => { for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) { const bx=x+c*67, by=y+r*52; panel(s, `${prefix}-${r}-${c}`, bx, by, 56, 42, C.paleBlue, C.cyan); txt(s, `${prefix}-val-${r}-${c}`, bx, by+8, 56, 26, String(vals[r][c]), { size: 17, align: 'center', color: C.navy }); } };
  txt(s, 'reshape-a', 125, 276, 280, 35, '12 nilai', { size: 21, color: C.blue, bold: true });
  for (let i=0;i<12;i++) { const x=130+(i%6)*58, y=329+Math.floor(i/6)*58; panel(s,`reshape-flat-${i}`,x,y,46,42,C.paleBlue,C.cyan); txt(s,`reshape-flat-t-${i}`,x,y+8,46,25,String(i+1),{size:16,align:'center',color:C.navy}); }
  txt(s, 'reshape-b', 550, 276, 250, 35, 'shape (4, 3)', { size: 21, color: C.blue, bold: true }); matrix(555, 328, 4, 3, [[1,2,3],[4,5,6],[7,8,9],[10,11,12]], 'reshape-m');
  txt(s, 'reshape-c', 880, 276, 250, 35, 'transpose (3, 4)', { size: 21, color: C.blue, bold: true }); matrix(885, 328, 3, 4, [[1,4,7,10],[2,5,8,11],[3,6,9,12]], 'transpose-m');
  txt(s, 'reshape-rule', 280, 595, 740, 44, 'Jumlah elemen tetap 12. Bentuknya berubah.', { size: 22, color: C.navy, bold: true, align: 'center' });
}
// 33. Vector operations
{
  const s = base('Operasi vektor', 'Operasi NumPy diterapkan per elemen pada array.');
  table(s, 'vector', 145, 296, [260, 300, 300], [['Produk', 'Terjual', 'Pendapatan'], ['Pensil', '2 × 10', '20'], ['Buku', '3 × 15', '45'], ['Map', '4 × 12', '48']], 72, { fontSize: 21 });
  code(s, 'vector-code', 340, 610, 600, 60, 'jumlah * harga_produk', 20);
}
// 34. Broadcasting by column
{
  const s = base('Broadcasting per kolom', 'Shape (3,) cocok dengan (4, 3) karena nilainya mengikuti tiga kolom.');
  const matrix = [[100,110,120],[90,105,125],[120,115,130],[80,100,110]];
  txt(s, 'column-factors', 280, 258, 700, 35, 'Faktor kolom:  1.00   1.04   1.08', { font: FONT_CODE, size: 20, color: C.blue, align: 'center' });
  matrix.forEach((row,r)=>row.forEach((v,c)=>{const x=280+c*154,y=310+r*62;panel(s,`broadcast-col-${r}-${c}`,x,y,130,48,(r+c)%2?C.paleBlue:C.paleYellow,(r+c)%2?C.cyan:C.yellow);txt(s,`broadcast-col-v-${r}-${c}`,x,y+9,130,30,String(v),{size:20,align:'center',color:C.navy});}));
  code(s, 'broadcast-column-code', 775, 351, 350, 148, 'sales.shape      # (4, 3)\nfaktor.shape     # (3,)\nhasil.shape      # (4, 3)', 17);
  txt(s, 'broadcast-rules', 220, 602, 840, 40, 'Dari kanan ke kiri, ukuran dimensi harus sama atau salah satunya 1.', { size: 19, color: C.grey, align: 'center' });
}
// 35. Broadcasting by row
{
  const s = base('Broadcasting per baris', 'Bentuk (4, 1) memasangkan satu faktor dengan setiap baris.');
  const factors = ['0.95','1.00','1.05','0.90'];
  factors.forEach((f,r)=>{const y=292+r*73;panel(s,`row-factor-${r}`,135,y,170,54,r===1?C.paleYellow:C.paleBlue,r===1?C.yellow:C.cyan);txt(s,`row-factor-value-${r}`,135,y+12,170,30,f,{font:FONT_CODE,size:21,align:'center',color:C.navy});for(let c=0;c<3;c++){const x=365+c*155;panel(s,`row-factor-cell-${r}-${c}`,x,y,130,54,C.paleBlue,C.cyan);txt(s,`row-factor-t-${r}-${c}`,x,y+12,130,30,`data[${r}, ${c}]`,{font:FONT_CODE,size:16,align:'center',color:C.navy});}});
  txt(s, 'row-label-factor', 140, 252, 190, 27, 'satu faktor tiap baris', { size: 17, color: C.blue });
  code(s, 'row-factor-code', 860, 290, 300, 230, 'faktor = np.array(\n    [0.95, 1.00,\n     1.05, 0.90]\n).reshape(4, 1)\n\n(4, 3) * (4, 1)\n= (4, 3)', 18);
  txt(s, 'row-incompatible', 215, 608, 860, 36, '(4,) tidak cocok dengan (4, 3), karena 4 dibandingkan dengan 3.', { size: 19, color: C.red, bold: true, align: 'center' });
}
// 36. Boolean masks and where
{
  const s = base('Boolean mask dan np.where', 'Kondisi menghasilkan mask True/False yang dapat memilih atau memberi label data.');
  table(s, 'mask', 145, 278, [220, 230, 210, 340], [['Siswa', 'Nilai', 'Nilai >= 80', 'np.where(...)'], ['Rani', '70', 'False', 'Belum lulus'], ['Dimas', '85', 'True', 'Lulus'], ['Salsa', '90', 'True', 'Lulus'], ['Bagas', '76', 'False', 'Belum lulus']], 58, { fontSize: 19 });
  code(s, 'mask-code', 320, 580, 650, 88, 'status = np.where(nilai >= 80,\n                   "Lulus", "Belum lulus")', 18);
}
// 37. Aggregation and axis
{
  const s = base('Agregasi dengan axis', 'axis menentukan sumbu yang diringkas dan dimensi yang tetap terlihat di hasil.');
  table(s, 'axis-data', 95, 270, [185, 130, 130, 130], [['Cabang', 'Jan', 'Feb', 'Mar'], ['A', '10', '20', '30'], ['B', '5', '15', '25'], ['C', '8', '12', '16'], ['D', '7', '9', '11']], 49, { fontSize: 18 });
  card(s, 'axis0', 735, 288, 395, 135, 'sum(axis=0)', '[30, 56, 82]\nSatu total tiap bulan.', C.paleBlue, C.cyan);
  card(s, 'axis1', 735, 458, 395, 135, 'sum(axis=1)', '[60, 45, 36, 27]\nSatu total tiap cabang.', C.paleYellow, C.yellow);
}
// 38. argmax
{
  const s = base('Indeks nilai terbesar', 'argmax mengembalikan posisi nilai maksimum. Gunakan posisi itu untuk mengambil label.');
  const branches = [['Jakarta','920000'],['Bandung','1110000'],['Surabaya','1215000']];
  branches.forEach((b,i)=>{const x=165+i*325;panel(s,`max-branch-${i}`,x,314,275,145,i===2?C.paleYellow:C.paleBlue,i===2?C.yellow:C.cyan);txt(s,`max-branch-title-${i}`,x+20,336,235,35,b[0],{font:FONT_DISPLAY,size:22,color:C.navy,bold:true,align:'center'});txt(s,`max-branch-value-${i}`,x+15,394,245,35,b[1],{font:FONT_CODE,size:21,color:C.grey,align:'center'});});
  code(s, 'argmax-code', 365, 518, 550, 80, 'i = np.argmax(penjualan)\ncabang[i]  # Surabaya', 18);
}
// 39. Concatenate
{
  const s = base('Menggabungkan array', 'concatenate menambah baris atau kolom. Dimensi lain harus tetap cocok.');
  card(s, 'concat-row', 105, 286, 500, 225, 'Tambah satu siswa', '(4, 3) + (1, 3)\naxis=0\n\nhasil (5, 3)', C.paleBlue, C.cyan);
  card(s, 'concat-col', 675, 286, 500, 225, 'Tambah satu bulan', '(4, 3) + (4, 1)\naxis=1\n\nhasil (4, 4)', C.paleYellow, C.yellow);
  txt(s, 'concat-rule', 165, 573, 950, 48, 'Axis 0 menambah baris. Axis 1 menambah kolom.', { size: 23, color: C.navy, bold: true, align: 'center' });
}

const alignmentAudit = [];
for (const slide of deck.slides.items) {
  const body = (elementsBySlide.get(slide) ?? []).filter(element => !fixedHeadingElements.has(element));
  const boxes = body.map(element => element.position);
  const left = Math.min(...boxes.map(box => box.left));
  const right = Math.max(...boxes.map(box => box.left + box.width));
  const top = Math.min(...boxes.map(box => box.top));
  const bottom = Math.max(...boxes.map(box => box.top + box.height));
  const dx = 640 - (left + right) / 2;
  const dy = 450 - (top + bottom) / 2;
  for (const element of body) {
    const position = element.position;
    element.position = { left: position.left + dx, top: position.top + dy, width: position.width, height: position.height };
  }
  alignmentAudit.push({ left: Math.round(left + dx), right: Math.round(right + dx), top: Math.round(top + dy), bottom: Math.round(bottom + dy), dx: Math.round(dx), dy: Math.round(dy) });
}
if (alignmentAudit.some(b => b.left < 60 || b.right > 1220 || b.top < 220 || b.bottom > 690)) {
  throw new Error(`Balanced content exceeded slide margins: ${JSON.stringify(alignmentAudit)}`);
}

const candidatePath = path.join(buildDir, 'candidate.pptx');
await (await PresentationFile.exportPptx(deck)).save(candidatePath);
const referenceHash = createHash('sha256').update(await fs.readFile(fontReference)).digest('hex');
const finalizerDir = path.join(workspaceDir, '_pengembangan/level-02/04-evaluasi-python-numpy/validasi-slide');
await fs.mkdir(finalizerDir, { recursive: true });
const requirements = { explicitTotalSlideCount: 39, requiredNativeTableOwnerSlides: [], requiredNativeChartOwnerSlides: [] };
const result = await finalizePresentation({
  ...requirements, workspaceDir, candidatePath, finalPath,
  pythonExecutable: '/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',
  integrityValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-bullet-geometry', '--validate-heading-fit'],
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: 'reference', families: ['SF Pro Display', 'SF Pro Text', 'SF Mono'], referencePath: fontReference, referenceSha256: referenceHash },
  verifyArtifactToolImport: true,
  receiptPath: path.join(finalizerDir, 'Python_NumPy_Reevaluation_Summary_v3.validation.json'),
});
console.log(JSON.stringify({ finalPath, candidatePath, slideCount: deck.slides.items.length, alignmentAudit, result }, null, 2));
