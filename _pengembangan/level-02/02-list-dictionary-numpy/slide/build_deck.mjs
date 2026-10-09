import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const workspaceDir = '/Users/daf2a/Documents/python';
const skillDir = '/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const buildDir = path.join(workspaceDir, '_pengembangan/level-02/02-list-dictionary-numpy/slide');
const stagingDir = path.join(buildDir, '_pengembangan/level-01/03-perulangan/validasi-slide');
const outputDir = path.join(workspaceDir, 'level-02/02-list-dictionary-numpy/slide');
const candidatePath = path.join(stagingDir, 'candidate.pptx');
const finalPath = path.join(outputDir, 'List_Dictionary_NumPy_Python_v3.pptx');
const runtimeNodeModules = '/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const runtimePython = '/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const coverPath = path.join(workspaceDir, 'level-02/01-fungsi-statistika/aset/function-statistika-cover.png');
const referencePath = path.join(workspaceDir, 'level-02/01-fungsi-statistika/slide/function_statistika_deskriptif.pptx');

const { finalizePresentation } = await import(
  pathToFileURL(path.join(skillDir, 'container_tools/artifact_tool_utils.mjs')).href,
);

const FONT = 'Calibri';
const CODE_FONT = 'Menlo';
const C = {
  bg: '#FFFFFF',
  ink: '#111A30',
  muted: '#4B5868',
  quiet: '#7D8793',
  line: '#E7EAEE',
  blue: '#4FB6E8',
  blueDark: '#196B9B',
  blueSoft: '#EAF6FC',
  navy: '#111A30',
  yellow: '#F5D36A',
  yellowSoft: '#FFF7D6',
  green: '#55B77A',
  greenSoft: '#E9F7EE',
  coral: '#E96B6B',
};

function addText(slide, value, left, top, width, height, style = {}) {
  const box = slide.shapes.add({
    geometry: 'textbox',
    position: { left, top, width, height },
    fill: 'none',
    line: { fill: 'none', width: 0 },
  });
  box.text = value;
  box.text.style = {
    typeface: style.font ?? FONT,
    fontSize: style.fontSize ?? 16,
    bold: style.bold ?? false,
    color: style.color ?? C.ink,
    verticalAlignment: style.verticalAlignment ?? 'top',
    autoFit: 'none',
  };
  return box;
}

function addRect(slide, left, top, width, height, fill, radius = 'roundRect', lineFill = fill) {
  return slide.shapes.add({
    geometry: radius,
    position: { left, top, width, height },
    fill,
    line: { fill: lineFill, width: lineFill === 'none' ? 0 : 1 },
  });
}

function addFooter(slide, number) {
  addText(slide, `Slide ${String(number).padStart(2, '0')}`, 72, 688, 120, 20, {
    fontSize: 10,
    color: C.quiet,
  });
  addText(slide, 'EKKA / PYTHON', 1080, 688, 128, 20, {
    fontSize: 10,
    color: C.quiet,
  });
}

function baseSlide(presentation, number, kicker, title, subtitle) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addText(slide, kicker, 72, 30, 520, 24, {
    fontSize: 14,
    bold: true,
    color: C.blueDark,
  });
  addText(slide, title, 72, 58, 1136, 58, {
    fontSize: 34,
    bold: true,
    color: C.ink,
  });
  addRect(slide, 72, 128, 1136, 2, C.line, 'rect', C.line);
  addText(slide, subtitle, 72, 144, 1136, 34, {
    fontSize: 16,
    color: C.muted,
  });
  addFooter(slide, number);
  return slide;
}

function addNotes(slide, body, sources = []) {
  const sourceText = sources.length > 0
    ? `\n\n[Sources]\n${sources.map((source) => `- ${source}`).join('\n')}`
    : '';
  slide.speakerNotes.textFrame.setText(`${body}${sourceText}`);
  slide.speakerNotes.setVisible(true);
}

function codeCard(slide, code, left, top, width, height, fontSize = 17, fill = C.navy) {
  addRect(slide, left, top, width, height, fill, 'roundRect', fill);
  addRect(slide, left + 18, top + 15, 10, 10, C.coral, 'ellipse');
  addRect(slide, left + 34, top + 15, 10, 10, C.yellow, 'ellipse');
  addRect(slide, left + 50, top + 15, 10, 10, C.green, 'ellipse');
  addText(slide, code, left + 24, top + 42, width - 48, height - 56, {
    font: CODE_FONT,
    fontSize,
    color: '#FFFFFF',
  });
}

function callout(slide, text, left, top, width, height, fill = C.yellowSoft, line = C.yellow, color = C.ink) {
  addRect(slide, left, top, width, height, fill, 'roundRect', line);
  addText(slide, text, left + 16, top + 10, width - 32, height - 18, {
    fontSize: 15,
    color,
  });
}

function labeledRow(slide, label, description, left, top, labelWidth = 180, fill = C.blueSoft) {
  addRect(slide, left, top, labelWidth, 48, fill, 'roundRect', C.blue);
  addText(slide, label, left + 14, top + 12, labelWidth - 28, 24, {
    fontSize: 15,
    bold: true,
    color: C.ink,
  });
  const descriptionWidth = Math.max(180, 1208 - (left + labelWidth + 20));
  addText(slide, description, left + labelWidth + 20, top + 8, descriptionWidth, 34, {
    fontSize: 15,
    color: C.muted,
  });
}

function badge(slide, number, left, top, fill = C.blue) {
  addRect(slide, left, top, 34, 34, fill, 'roundRect', fill);
  addText(slide, String(number), left + 9, top + 7, 18, 22, {
    fontSize: 15,
    bold: true,
    color: C.ink,
    verticalAlignment: 'middle',
  });
}

function objective(slide, number, title, description, left, top, fill = C.blue) {
  badge(slide, number, left, top, fill);
  addText(slide, title, left + 48, top - 1, 450, 26, {
    fontSize: 16,
    bold: true,
  });
  addText(slide, description, left + 48, top + 26, 450, 38, {
    fontSize: 14,
    color: C.muted,
  });
}

async function main() {
  await fs.mkdir(buildDir, { recursive: true });
  await fs.mkdir(stagingDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  const nodeModulesLink = path.join(buildDir, 'node_modules');
  try {
    await fs.lstat(nodeModulesLink);
  } catch {
    await fs.symlink(runtimeNodeModules, nodeModulesLink, 'dir');
  }

  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const coverBytes = await fs.readFile(coverPath);

  // Slide 1: cover
  {
    const slide = presentation.slides.add();
    slide.background.fill = C.bg;
    slide.images.add({
      blob: coverBytes,
      contentType: 'image/png',
      alt: 'Meja belajar dengan laptop dan catatan pengolahan data',
      fit: 'cover',
      position: { left: 0, top: 0, width: 1280, height: 720 },
    });
    addText(slide, 'LEVEL 1  •  PERTEMUAN 5', 72, 38, 360, 24, {
      fontSize: 14,
      bold: true,
      color: C.blueDark,
    });
    addText(slide, 'List, Dictionary,\ndan NumPy', 72, 132, 520, 126, {
      fontSize: 42,
      bold: true,
      color: C.ink,
    });
    addText(slide, 'Dari data sederhana menuju dataset', 72, 300, 470, 60, {
      fontSize: 20,
      color: C.muted,
    });
    addRect(slide, 72, 408, 122, 3, C.blue, 'rect', C.blue);
    addText(slide, 'Indexing · nested list · dictionary · NumPy', 72, 432, 520, 30, {
      fontSize: 15,
      color: C.muted,
    });
    callout(slide, 'Membaca, menyusun, dan menghitung data', 72, 520, 420, 42, C.yellowSoft, C.yellow);
    addFooter(slide, 1);
    addNotes(slide, 'Buka dengan menghubungkan materi sebelumnya. Siswa sudah memakai list, loop, dan function. Sesi ini memperluas bentuk data lalu menunjukkan bagaimana NumPy membantu perhitungan numerik.', [
      'Python documentation, Data Structures, https://docs.python.org/3/tutorial/datastructures.html',
      'NumPy documentation, Statistics, https://numpy.org/doc/stable/reference/routines.statistics.html',
    ]);
  }

  // Slide 2: targets
  {
    const slide = baseSlide(presentation, 2, 'TARGET BELAJAR', 'Data berubah bentuk saat kita mengolahnya', 'Mulai dari list, lalu susun menjadi dataset dan array numerik.');
    objective(slide, 1, 'Review list', 'Indexing, slicing, method, dan function bawaan.', 72, 212);
    objective(slide, 2, 'Nested list', 'Membaca data berbentuk baris dan kolom.', 650, 212);
    objective(slide, 3, 'Dictionary', 'Menghubungkan key dengan value.', 72, 336);
    objective(slide, 4, 'Dataset dan NumPy', 'Mengolah list of dictionary dan statistik dasar.', 650, 336);
    callout(slide, 'Data masuk, struktur membantu, perhitungan menghasilkan informasi.', 72, 512, 1136, 70, C.blueSoft, C.blue);
    addNotes(slide, 'Gunakan slide ini sebagai peta sesi. Tekankan urutannya. Kita mulai dengan struktur yang sudah dikenal, kemudian memperkenalkan struktur data baru sebelum NumPy.', [
      'Materi rujukan pengguna: for_while_loop.ipynb, conditional_statement.ipynb, function_statistic.ipynb',
    ]);
  }

  // Slide 3: list review
  {
    const slide = baseSlide(presentation, 3, 'REVIEW LIST', 'List menyimpan urutan nilai', 'Indexing mengambil item, slicing mengambil bagian, method mengubah isi list.');
    codeCard(slide, 'warna = ["biru", "kuning", "hijau", "merah"]\n\nprint(warna[0])\nprint(warna[-1])\nprint(warna[1:3])\n\nwarna.append("ungu")\nwarna.remove("kuning")\nitem = warna.pop()', 72, 200, 570, 340, 15);
    labeledRow(slide, 'indexing', 'mengambil item berdasarkan posisi', 704, 206, 174);
    labeledRow(slide, 'negative', 'mengambil dari posisi belakang', 704, 282, 174, C.yellowSoft);
    labeledRow(slide, 'slicing', 'mengambil sebagian urutan', 704, 358, 174, C.greenSoft);
    labeledRow(slide, 'method', 'menambah atau menghapus item', 704, 434, 174, C.blueSoft);
    callout(slide, '`append()` menambah, `remove()` mencari nilai, `pop()` mengambil item.', 72, 568, 570, 50);
    addNotes(slide, 'Minta siswa memprediksi hasil tiga print sebelum menjalankan code. Bedakan posisi pertama yang dimulai dari 0 dengan posisi terakhir yang dapat diakses menggunakan -1.', [
      'Python documentation, More on Lists, https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
    ]);
  }

  // Slide 4: built-ins
  {
    const slide = baseSlide(presentation, 4, 'REVIEW LIST', 'Function bawaan membantu membaca list', 'Beberapa operasi dasar sudah tersedia di Python.');
    codeCard(slide, 'nilai = [72, 85, 90, 68]\n\nprint(len(nilai))\nprint(min(nilai))\nprint(max(nilai))\nprint(sum(nilai))\nprint(sorted(nilai))\nprint(sum(nilai) / len(nilai))', 72, 200, 560, 330, 16);
    labeledRow(slide, 'len()', 'menghitung banyak item', 704, 206, 160);
    labeledRow(slide, 'min() / max()', 'mencari nilai ekstrem', 704, 282, 160, C.yellowSoft);
    labeledRow(slide, 'sum()', 'menghitung total nilai', 704, 358, 160, C.greenSoft);
    labeledRow(slide, 'sorted()', 'membuat urutan baru', 704, 434, 160, C.blueSoft);
    callout(slide, 'Rata-rata manual dapat ditulis sebagai `sum(nilai) / len(nilai)`.', 72, 568, 1136, 50, C.yellowSoft, C.yellow);
    addNotes(slide, 'Hubungkan kembali dengan function statistik sebelumnya. Sebelum memakai library, siswa perlu memahami bahwa mean dapat dibangun dari total dibagi jumlah data.', [
      'Python documentation, Built-in Functions, https://docs.python.org/3/library/functions.html',
    ]);
  }

  // Slide 5: nested list
  {
    const slide = baseSlide(presentation, 5, 'NESTED LIST', 'Nested list menyimpan data 2 dimensi', 'Index pertama memilih baris. Index kedua memilih item di dalam baris.');
    codeCard(slide, 'nilai = [\n    [80, 90, 85],\n    [70, 75, 80],\n    [90, 95, 88]\n]\n\nprint(nilai[0])\nprint(nilai[0][1])', 72, 200, 570, 330, 16);
    addText(slide, 'Contoh akses', 704, 206, 300, 30, { fontSize: 17, bold: true });
    addRect(slide, 704, 254, 190, 52, C.blueSoft, 'roundRect', C.blue);
    addText(slide, 'nilai[0]', 720, 268, 158, 24, { font: CODE_FONT, fontSize: 16, bold: true });
    addRect(slide, 918, 254, 270, 52, C.greenSoft, 'roundRect', C.green);
    addText(slide, '[80, 90, 85]', 934, 268, 238, 24, { font: CODE_FONT, fontSize: 16 });
    addRect(slide, 704, 344, 190, 52, C.yellowSoft, 'roundRect', C.yellow);
    addText(slide, 'nilai[0][1]', 720, 358, 158, 24, { font: CODE_FONT, fontSize: 16, bold: true });
    addRect(slide, 918, 344, 270, 52, C.greenSoft, 'roundRect', C.green);
    addText(slide, '90', 934, 358, 238, 24, { font: CODE_FONT, fontSize: 16 });
    callout(slide, 'Satu nested list dapat mewakili tabel sederhana.', 72, 568, 1136, 50, C.blueSoft, C.blue);
    addNotes(slide, 'Tulis dua index secara terpisah ketika menjelaskan. `nilai[0]` mengambil baris pertama. `nilai[0][1]` mengambil item kedua dari baris tersebut.', [
      'Python documentation, Lists, https://docs.python.org/3/tutorial/introduction.html#lists',
    ]);
  }

  // Slide 6: nested loops
  {
    const slide = baseSlide(presentation, 6, 'NESTED LIST', 'Loop membaca setiap baris data', 'Setiap putaran dapat menghitung statistik untuk satu siswa.');
    codeCard(slide, 'for siswa in nilai:\n    rata_rata = sum(siswa) / len(siswa)\n    print(rata_rata)', 72, 200, 570, 250, 17);
    addText(slide, 'Contoh hasil', 704, 206, 300, 30, { fontSize: 17, bold: true });
    labeledRow(slide, 'siswa 1', '85.0', 704, 254, 150, C.blueSoft);
    labeledRow(slide, 'siswa 2', '75.0', 704, 330, 150, C.yellowSoft);
    labeledRow(slide, 'siswa 3', '91.0', 704, 406, 150, C.greenSoft);
    callout(slide, 'Loop luar membaca baris. Function list menghitung isi baris.', 72, 520, 1136, 58, C.yellowSoft, C.yellow);
    addNotes(slide, 'Minta siswa membaca variable `siswa` pada setiap putaran. Nilainya berubah dari list pertama ke list kedua, lalu ke list ketiga. Perhitungan masih menggunakan operasi yang sudah dikenal.', [
      'Python documentation, for Statements, https://docs.python.org/3/tutorial/controlflow.html#for-statements',
    ]);
  }

  // Slide 7: dictionary
  {
    const slide = baseSlide(presentation, 7, 'DICTIONARY', 'Dictionary menghubungkan key dan value', 'Gunakan key untuk mengambil data yang memiliki arti.');
    codeCard(slide, 'siswa = {\n    "nama": "Alya",\n    "umur": 16,\n    "nilai": [80, 90, 85]\n}\n\nprint(siswa["nama"])\nprint(siswa["nilai"])', 72, 200, 570, 330, 16);
    addText(slide, 'Isi dictionary', 704, 206, 300, 30, { fontSize: 17, bold: true });
    labeledRow(slide, '"nama"', 'Alya', 704, 254, 150, C.blueSoft);
    labeledRow(slide, '"umur"', '16', 704, 330, 150, C.yellowSoft);
    labeledRow(slide, '"nilai"', '[80, 90, 85]', 704, 406, 150, C.greenSoft);
    callout(slide, 'Value dapat berupa angka, teks, atau list.', 72, 568, 570, 50, C.yellowSoft, C.yellow);
    addNotes(slide, 'Bandingkan list dan dictionary. List menekankan posisi. Dictionary menekankan nama key. Tunjukkan bahwa value `nilai` masih dapat berupa list.', [
      'Python documentation, Dictionaries, https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
    ]);
  }

  // Slide 8: items
  {
    const slide = baseSlide(presentation, 8, 'DICTIONARY', '`.items()` membaca pasangan data', 'Loop dapat membaca key dan value sekaligus.');
    codeCard(slide, 'for key, value in siswa.items():\n    print(key, value)', 72, 200, 570, 205, 17);
    addRect(slide, 704, 200, 444, 250, C.blueSoft, 'roundRect', C.blue);
    addText(slide, 'Output', 728, 224, 150, 28, { fontSize: 17, bold: true });
    addText(slide, 'nama  Alya\numur  16\nnilai  [80, 90, 85]', 728, 274, 380, 130, {
      font: CODE_FONT,
      fontSize: 16,
      color: C.ink,
    });
    callout(slide, '`.items()` cocok untuk memeriksa seluruh isi dictionary.', 72, 520, 1136, 58, C.yellowSoft, C.yellow);
    addNotes(slide, 'Jalankan loop dan minta siswa melihat pasangan yang dicetak. Pada bagian berikutnya, pola ini akan dipakai untuk membaca setiap dictionary di dalam list.', [
      'Python documentation, Looping Techniques, https://docs.python.org/3/tutorial/datastructures.html#looping-techniques',
    ]);
  }

  // Slide 9: practice 1
  {
    const slide = baseSlide(presentation, 9, 'PRACTICE 1  •  10 MENIT', 'Rekap nested list dan dictionary', 'Gunakan index, loop, sum(), dan len().');
    addRect(slide, 72, 204, 520, 340, C.yellowSoft, 'roundRect', C.yellow);
    addText(slide, 'Data', 96, 228, 140, 28, { fontSize: 17, bold: true });
    codeCard(slide, 'nilai = [\n    [80, 90, 85],\n    [70, 75, 80],\n    [90, 95, 88]\n]', 96, 278, 472, 180, 15);
    addRect(slide, 626, 204, 582, 340, C.blueSoft, 'roundRect', C.blue);
    addText(slide, 'Tugas', 650, 228, 160, 28, { fontSize: 17, bold: true });
    addText(slide, '1  Tampilkan nilai siswa pertama.\n2  Tampilkan nilai kedua siswa pertama.\n3  Hitung rata-rata setiap siswa.\n4  Buat satu dictionary siswa.', 650, 278, 500, 190, { fontSize: 16, color: C.muted });
    callout(slide, 'Kerjakan di notebook. Belum perlu memakai NumPy.', 650, 482, 500, 42, C.yellowSoft, C.yellow);
    addNotes(slide, 'Berikan waktu untuk menulis solusi. Periksa apakah siswa membedakan `nilai[0]` dan `nilai[0][1]`. Minta beberapa siswa menjelaskan mengapa `sum(siswa) / len(siswa)` dapat dipakai pada setiap baris.', [
      'Materi rujukan pengguna: function_statistic.ipynb dan for_while_loop.ipynb',
    ]);
  }

  // Slide 10: list of dictionaries
  {
    const slide = baseSlide(presentation, 10, 'LIST OF DICTIONARY', 'List of dictionary mulai terasa seperti dataset', 'Satu dictionary dapat mewakili satu baris data.');
    codeCard(slide, 'data_siswa = [\n    {"nama": "Alya", "nilai": 85},\n    {"nama": "Budi", "nilai": 72},\n    {"nama": "Citra", "nilai": 91}\n]', 72, 200, 620, 260, 16);
    addText(slide, 'Contoh akses', 760, 206, 300, 30, { fontSize: 17, bold: true });
    labeledRow(slide, 'data_siswa[0]', 'Alya', 760, 254, 190, C.blueSoft);
    labeledRow(slide, 'data_siswa[2]', 'Citra', 760, 330, 190, C.greenSoft);
    labeledRow(slide, '["nilai"]', '91', 760, 406, 190, C.yellowSoft);
    callout(slide, 'Key dapat dibaca sebagai nama kolom dataset.', 72, 520, 1136, 58, C.blueSoft, C.blue);
    addNotes(slide, 'Gunakan analogi tabel dengan hati-hati. List of dictionary belum menjadi DataFrame, tetapi bentuknya mulai menyerupai dataset dengan kolom dan baris.', [
      'Python documentation, Dictionaries, https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
    ]);
  }

  // Slide 11: dataset loop
  {
    const slide = baseSlide(presentation, 11, 'LIST OF DICTIONARY', 'Loop mengolah setiap baris dataset', 'Struktur data dan loop bekerja bersama untuk mencari informasi.');
    codeCard(slide, 'total = 0\ntertinggi = data_siswa[0]\n\nfor siswa in data_siswa:\n    total += siswa["nilai"]\n    if siswa["nilai"] > tertinggi["nilai"]:\n        tertinggi = siswa\n\nprint(total / len(data_siswa))\nprint(tertinggi["nama"])', 72, 200, 620, 360, 14);
    addRect(slide, 760, 200, 390, 300, C.greenSoft, 'roundRect', C.green);
    addText(slide, 'Hasil', 784, 224, 150, 28, { fontSize: 17, bold: true });
    addText(slide, 'Rata-rata\n82.67', 784, 274, 160, 74, { fontSize: 20, bold: true });
    addText(slide, 'Nilai tertinggi\nCitra', 984, 274, 160, 74, { fontSize: 20, bold: true });
    callout(slide, 'Kita masih memakai list, dictionary, dan loop yang sudah dipelajari.', 72, 588, 1078, 42, C.yellowSoft, C.yellow);
    addNotes(slide, 'Jalankan kode secara perlahan. Tanyakan kapan variable `tertinggi` berubah. Tekankan bahwa yang disimpan adalah dictionary lengkap, bukan hanya nilai angkanya.', [
      'Python documentation, for Statements, https://docs.python.org/3/tutorial/controlflow.html#for-statements',
    ]);
  }

  // Slide 12: bridge to NumPy
  {
    const slide = baseSlide(presentation, 12, 'INTRO NUMPY', 'NumPy merapikan perhitungan yang berulang', 'Proses manual tetap menjadi dasar untuk memahami hasil library.');
    addText(slide, 'Manual', 72, 200, 220, 30, { fontSize: 17, bold: true });
    codeCard(slide, 'data = [72, 85, 90, 68]\ntotal = 0\n\nfor nilai in data:\n    total += nilai\n\nmean = total / len(data)', 72, 240, 520, 300, 15);
    addText(slide, 'Dengan NumPy', 704, 200, 260, 30, { fontSize: 17, bold: true });
    codeCard(slide, 'import numpy as np\n\ndata = np.array([72, 85, 90, 68])\nmean = np.mean(data)', 704, 240, 504, 300, 15);
    callout(slide, 'Library membantu kita menulis proses yang sama dengan lebih ringkas.', 72, 568, 1136, 50, C.yellowSoft, C.yellow);
    addNotes(slide, 'Tunjukkan dua code block secara berurutan. Siswa perlu melihat bahwa `np.mean(data)` menggantikan proses manual yang baru saja mereka tulis.', [
      'NumPy documentation, Quickstart, https://numpy.org/doc/stable/user/quickstart.html',
    ]);
  }

  // Slide 13: NumPy statistics
  {
    const slide = baseSlide(presentation, 13, 'INTRO NUMPY', 'Array NumPy punya function statistik', 'Satu array dapat dipakai untuk menghitung mean, median, dan standar deviasi.');
    codeCard(slide, 'import numpy as np\n\ndata = np.array([72, 85, 90, 68])\n\nprint(np.mean(data))\nprint(np.median(data))\nprint(np.std(data))', 72, 200, 570, 320, 16);
    addText(slide, 'Contoh hasil', 720, 206, 300, 30, { fontSize: 17, bold: true });
    labeledRow(slide, 'np.mean(data)', '78.75', 720, 254, 190, C.blueSoft);
    labeledRow(slide, 'np.median(data)', '78.5', 720, 330, 190, C.yellowSoft);
    labeledRow(slide, 'np.std(data)', '≈ 9.04', 720, 406, 190, C.greenSoft);
    callout(slide, 'Operasi menjadi ringkas, tetapi arti statistiknya tetap perlu dipahami.', 72, 568, 1136, 50, C.blueSoft, C.blue);
    addNotes(slide, 'Sebutkan bahwa `np.std` pada contoh ini memakai standar deviasi populasi default NumPy. Untuk pengantar, fokuskan siswa pada makna hasil dan perbandingan dengan proses manual.', [
      'NumPy documentation, Statistics, https://numpy.org/doc/stable/reference/routines.statistics.html',
    ]);
  }

  // Slide 14: practice 2
  {
    const slide = baseSlide(presentation, 14, 'PRACTICE 2  •  15 MENIT', 'Bandingkan loop manual dan NumPy', 'Gunakan satu dataset yang sama untuk kedua cara.');
    addRect(slide, 72, 204, 520, 340, C.yellowSoft, 'roundRect', C.yellow);
    addText(slide, 'Data latihan', 96, 228, 180, 28, { fontSize: 17, bold: true });
    codeCard(slide, 'data_nilai = [72, 85, 90, 68, 88, 76]', 96, 284, 472, 110, 15);
    addText(slide, 'Bandingkan hasil mean manual dengan `np.mean()`.', 96, 432, 430, 56, { fontSize: 15, color: C.muted });
    addRect(slide, 626, 204, 582, 340, C.blueSoft, 'roundRect', C.blue);
    addText(slide, 'Tugas', 650, 228, 160, 28, { fontSize: 17, bold: true });
    addText(slide, '1  Hitung mean dengan loop.\n2  Hitung mean, median, dan standar deviasi dengan NumPy.\n3  Bandingkan hasil mean.\n4  Jelaskan arti standar deviasi.', 650, 278, 500, 190, { fontSize: 16, color: C.muted });
    callout(slide, 'Tulis solusi di notebook. Gunakan data yang sama.', 650, 482, 500, 42, C.yellowSoft, C.yellow);
    addNotes(slide, 'Minta siswa menyelesaikan proses manual terlebih dahulu, lalu mengulang dengan NumPy. Diskusi terakhir cukup satu kalimat per siswa tentang besar kecilnya standar deviasi.', [
      'NumPy documentation, Statistics, https://numpy.org/doc/stable/reference/routines.statistics.html',
    ]);
  }

  // Slide 15: summary
  {
    const slide = baseSlide(presentation, 15, 'INTI MATERI', 'Bentuk data menentukan cara kita membacanya', 'Struktur data menjadi fondasi sebelum masuk ke Pandas dan preprocessing.');
    badge(slide, 1, 72, 214, C.blue);
    addText(slide, 'List', 128, 210, 240, 26, { fontSize: 17, bold: true });
    addText(slide, 'urutan item dan operasi dasar', 128, 238, 400, 26, { fontSize: 15, color: C.muted });
    badge(slide, 2, 72, 302, C.yellow);
    addText(slide, 'Nested list', 128, 298, 240, 26, { fontSize: 17, bold: true });
    addText(slide, 'baris dan kolom dalam list', 128, 326, 400, 26, { fontSize: 15, color: C.muted });
    badge(slide, 3, 650, 214, C.green);
    addText(slide, 'Dictionary', 706, 210, 240, 26, { fontSize: 17, bold: true });
    addText(slide, 'key dan value yang bermakna', 706, 238, 400, 26, { fontSize: 15, color: C.muted });
    badge(slide, 4, 650, 302, C.blue);
    addText(slide, 'Dataset dan NumPy', 706, 298, 300, 26, { fontSize: 17, bold: true });
    addText(slide, 'data terstruktur dan statistik ringkas', 706, 326, 430, 26, { fontSize: 15, color: C.muted });
    callout(slide, 'Pahami proses manual sebelum memakai library.', 72, 500, 1136, 70, C.yellowSoft, C.yellow);
    addNotes(slide, 'Gunakan slide ini untuk mengulang jalur pembelajaran. Tanyakan bentuk data apa yang dipakai pada setiap bagian dan mengapa bentuk tersebut sesuai.', [
      'Materi rujukan pengguna: function_statistic.ipynb',
    ]);
  }

  // Slide 16: exit ticket
  {
    const slide = baseSlide(presentation, 16, 'EXIT TICKET', 'Cek pemahaman', 'Jawab dengan kalimat singkat atau contoh code.');
    badge(slide, 1, 72, 226, C.blue);
    addText(slide, 'Apa yang diambil oleh `nilai[0][1]`?', 144, 232, 900, 30, { fontSize: 17 });
    badge(slide, 2, 72, 312, C.yellow);
    addText(slide, 'Kapan dictionary lebih membantu daripada list biasa?', 144, 318, 900, 30, { fontSize: 17 });
    badge(slide, 3, 72, 398, C.green);
    addText(slide, 'Apa hubungan proses manual dengan `np.mean()`?', 144, 404, 900, 30, { fontSize: 17 });
    callout(slide, 'List memberi urutan. Dictionary memberi arti. NumPy membantu menghitung.', 72, 510, 1136, 70, C.blueSoft, C.blue);
    addNotes(slide, 'Gunakan pertanyaan ini sebagai penutup lisan atau tulisan. Minta siswa menjawab dengan kata-kata sendiri sebelum membuka notebook untuk melihat kembali code.', [
      'Python documentation, Data Structures, https://docs.python.org/3/tutorial/datastructures.html',
      'NumPy documentation, Statistics, https://numpy.org/doc/stable/reference/routines.statistics.html',
    ]);
  }

  await (await PresentationFile.exportPptx(presentation)).save(candidatePath);
  const requirements = {
    explicitTotalSlideCount: 16,
    requiredNativeTableOwnerSlides: [],
    requiredNativeChartOwnerSlides: [],
    fontPolicy: {
      basis: 'design',
      families: [FONT, CODE_FONT],
    },
  };
  const result = await finalizePresentation({
    ...requirements,
    workspaceDir,
    candidatePath,
    finalPath,
    pythonExecutable: runtimePython,
    integrityValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_package_integrity.py'),
    layoutValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_layout_geometry.py'),
    layoutArgs: [
      '--expected-slide-size-emu', '12192000,6858000',
      '--validate-bullet-geometry',
      '--validate-heading-fit',
    ],
    fontPolicy: requirements.fontPolicy,
    verifyArtifactToolImport: true,
    receiptPath: path.join(stagingDir, `${path.basename(finalPath)}.validation.json`),
  });
  console.log(JSON.stringify({ finalPath, result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
