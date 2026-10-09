import { Presentation, PresentationFile } from '@oai/artifact-tool';

const OUT = '/Users/daf2a/Documents/python/level-01/01-python-dasar/slide/python_dasar_practice.pptx';
const FONT = 'SF Pro Display';
const C = { bg: '#FAF9F6', ink: '#1F2937', muted: '#6B7280', accent: '#B45309', line: '#DDD6CC' };
const SOURCES = '[Sources]\n- https://www.w3schools.com/python/python_variables.asp\n- https://www.w3schools.com/python/python_datatypes.asp\n- https://www.w3schools.com/python/python_casting.asp\n- https://www.w3schools.com/python/python_conditions.asp\n- https://www.w3schools.com/python/python_match.asp';

function text(slide, value, x, y, width, height, style = {}) {
  const item = slide.shapes.add({
    geometry: 'textbox',
    position: { left: x, top: y, width, height },
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 },
  });
  item.text = value;
  item.text.style = {
    fontFace: FONT,
    fontSize: style.fontSize ?? 28,
    bold: style.bold ?? false,
    color: style.color ?? C.ink,
    verticalAlignment: 'top',
  };
  return item;
}

function base(p, title, description, source) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  text(slide, title, 112, 112, 1000, 65, { fontSize: 48, bold: true });
  text(slide, description, 112, 202, 1030, 58, { fontSize: 27, color: C.muted });
  slide.speakerNotes.textFrame.setText(`${SOURCES}\n- ${source}`);
  slide.speakerNotes.setVisible(true);
  return slide;
}

function simpleTable(slide, values, top) {
  const table = slide.tables.add({ rows: values.length, columns: 2, left: 112, top, width: 800, height: values.length * 60, values });
  table.borders.assign({ style: 'solid', fill: C.line, width: 1 });
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 2 }).assign({
    fill: '#F2EFE9',
    textStyle: { fontFace: FONT, fontSize: 23, bold: true, color: C.ink },
  });
  table.cells.block({ row: 1, column: 0, rowCount: values.length - 1, columnCount: 2 }).assign({
    fill: C.bg,
    textStyle: { fontFace: FONT, fontSize: 23, color: C.ink },
  });
  return table;
}

async function main() {
  const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });

  let s = base(p, 'python dasar', 'nilai, keputusan, dan pilihan dalam Python.', 'Slide pembuka berdasarkan cakupan tutorial Python W3Schools.');
  text(s, 'data types  ·  variable  ·  casting  ·  kondisi', 112, 334, 980, 42, { fontSize: 26, color: C.accent });

  s = base(p, 'data types', 'setiap nilai memiliki tipe data.', 'https://www.w3schools.com/python/python_datatypes.asp');
  simpleTable(s, [['tipe', 'contoh'], ['str', '"Alya"'], ['int', '17'], ['float', '12.5'], ['bool', 'True'], ['list', '["biru"]']], 316);

  s = base(p, 'variable', 'variable menyimpan nilai agar bisa digunakan lagi.', 'https://www.w3schools.com/python/python_variables.asp');
  text(s, 'nama = "Alya"', 112, 340, 820, 46, { fontSize: 32, color: C.accent });
  text(s, 'usia = 17', 112, 414, 820, 46, { fontSize: 32, color: C.accent });

  s = base(p, 'casting', 'casting mengubah tipe nilai.', 'https://www.w3schools.com/python/python_casting.asp');
  simpleTable(s, [['bentuk', 'hasil'], ['int("25")', '25'], ['float("3.5")', '3.5'], ['str(8)', '"8"']], 332);

  s = base(p, 'if', 'blok dijalankan jika kondisi bernilai True.', 'https://www.w3schools.com/python/python_conditions.asp');
  text(s, 'nilai = 80', 112, 340, 880, 44, { fontSize: 31, color: C.accent });
  text(s, 'if nilai >= 75:  print("Lulus")', 112, 414, 980, 44, { fontSize: 31, color: C.ink });

  s = base(p, 'else dan elif', 'else untuk kondisi lain; elif untuk pilihan tambahan.', 'https://www.w3schools.com/python/python_conditions.asp');
  text(s, 'if nilai >= 90:  "A"', 112, 330, 930, 43, { fontSize: 30, color: C.accent });
  text(s, 'elif nilai >= 75:  "B"', 112, 398, 930, 43, { fontSize: 30, color: C.ink });
  text(s, 'else:  "C"', 112, 466, 930, 43, { fontSize: 30, color: C.ink });

  s = base(p, 'pass', 'pass membuat blok kosong tetap valid.', 'https://www.w3schools.com/python/python_conditions.asp');
  text(s, 'if fitur_baru:  pass', 112, 356, 920, 46, { fontSize: 32, color: C.accent });

  s = base(p, 'match/case', 'match membandingkan satu nilai dengan beberapa case.', 'https://www.w3schools.com/python/python_match.asp');
  text(s, 'menu = "makan"', 112, 328, 920, 43, { fontSize: 30, color: C.accent });
  text(s, 'case "makan":  "Nasi goreng"', 112, 396, 980, 43, { fontSize: 30, color: C.ink });
  text(s, 'case _:  "Menu lain"', 112, 464, 920, 43, { fontSize: 30, color: C.ink });

  s = base(p, 'inti materi', 'nilai punya tipe. casting mengubah tipe. kondisi memilih tindakan.', 'Ringkasan konsep yang dirujuk dari tutorial Python W3Schools.');
  text(s, 'data  →  bentuk  →  keputusan', 112, 354, 970, 48, { fontSize: 33, color: C.accent });

  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(OUT);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
