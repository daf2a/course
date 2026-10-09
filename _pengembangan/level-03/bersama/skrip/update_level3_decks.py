from pathlib import Path
import re
import shutil

PYTHON = Path('/Users/daf2a/Documents/python')
TASK = PYTHON / '_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan'
ASSETS = PYTHON / '_pengembangan/level-03/bersama/aset'
ASSETS.mkdir(parents=True, exist_ok=True)
source_assets = [
    Path('/Users/daf2a/.codex/generated_images/01a11f8c-41ec-7be3-9cee-b793ce0518ec/exec-5d8f47f8-987a-4a1d-9230-0704beb5598a.png'),
    Path('/Users/daf2a/.codex/generated_images/01a11f8c-41ec-7be3-9cee-b793ce0518ec/exec-dede0dd2-103d-4138-82c6-fffd338517a1.png'),
    Path('/Users/daf2a/.codex/generated_images/01a11f8c-41ec-7be3-9cee-b793ce0518ec/exec-fb454df1-1085-4bb2-aa11-54933b8d1f23.png'),
    Path('/Users/daf2a/.codex/generated_images/01a11f8c-41ec-7be3-9cee-b793ce0518ec/exec-98e6d0c8-846a-4998-a411-bbc3b6be710d.png'),
]
for i, source in enumerate(source_assets, 1):
    if not source.exists():
        raise FileNotFoundError(source)
    shutil.copy2(source, ASSETS / f'cover-{i}.png')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise ValueError(f'{label}: expected one match, found {count}')
    return text.replace(old, new, 1)

# Decks 2 to 4: add one editable-title cover, remove preview-only opening slides,
# align concept order with each notebook, and move final practice after teaching.
path = TASK / 'build_decks.mjs'
text = path.read_text()
text = replace_once(
    text,
    'const VISUAL_DIR = path.join(TASK_DIR, "visuals");',
    'const VISUAL_DIR = path.join(TASK_DIR, "visuals");\nconst COVER_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/aset";',
    'cover asset directory',
)
text = replace_once(
    text,
    'async function addImage(slide, file, position, alt) {\n  const bytes = await fs.readFile(file);\n  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);\n  slide.images.add({ blob, contentType: "image/png", alt, fit: "contain", position });\n}',
    'async function addImage(slide, file, position, alt) {\n  const bytes = await fs.readFile(file);\n  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);\n  slide.images.add({ blob, contentType: "image/png", alt, fit: "contain", position });\n}\n\nasync function addCover(presentation, title, file, alt) {\n  const slide = presentation.slides.add();\n  slide.background.fill = colors.white;\n  await addImage(slide, file, { left: 0, top: 0, width: SW, height: SH }, alt);\n  addText(slide, title, { left: 78, top: 225, width: 470, height: 260 }, {\n    typeface: FONT_DISPLAY, fontSize: 52, color: colors.navy, bold: true, verticalAlignment: "middle",\n  });\n  return slide;\n}',
    'cover helper',
)

config = {
    2: {
        'cover_title': 'Visualisasi Data\\nTren dan Perubahan',
        'cover_alt': 'Ilustrasi visualisasi tren, area, dan perubahan bertahap',
        'remove': {'Visualisasi Data: Tren dan Perubahan'},
        'order': [
            'Line chart membaca satu tren',
            'Multi-line membandingkan tren kelompok',
            'Sebelum membandingkan garis, periksa datanya',
            'Practice Tengah: kunjungan perpustakaan',
            'Area chart menekankan besar nilai',
            'Stacked area memperlihatkan total dan kontribusi',
            'Stacked area 100% membandingkan proporsi',
            'Waterfall merangkai perubahan menuju saldo akhir',
            'Susun komponen waterfall sebagai perubahan bersih',
            'Pilih grafik dari bentuk pertanyaannya',
            'Hindari kesalahan saat membaca tren',
            'Tentukan grafik sebelum menulis kode',
            'Practice Akhir: pendaftaran dan saldo acara',
            'Cek pemahaman',
        ],
        'count': 15,
        'filename': 'Visualisasi_Data_Tren_dan_Perubahan_skillupdate.pptx',
    },
    3: {
        'cover_title': 'Visualisasi Data\\nDistribusi',
        'cover_alt': 'Ilustrasi histogram, kurva kepadatan, box plot, dan violin plot',
        'remove': set(),
        'order': [
            'Visualisasi Data: Distribusi',
            'Histogram merangkum frekuensi pada bins',
            'KDE menonjolkan bentuk kepadatan',
            'Practice Tengah: waktu menyelesaikan kuis',
            'Box plot merangkum pusat dan sebaran',
            'Bandingkan box plot dengan unit yang sama',
            'Violin plot memperlihatkan bentuk kepadatan',
            'Distribusi yang sama bisa tampak berbeda',
            'Jangan simpulkan pencilan dari grafik saja',
            'Bentuk distribusi memberi konteks pada ringkasan',
            'Kapan memakai histogram, KDE, box, atau violin?',
            'Practice Akhir: nilai tiga kelas',
            'Cek pemahaman',
        ],
        'count': 14,
        'filename': 'Visualisasi_Data_Distribusi_skillupdate.pptx',
    },
    4: {
        'cover_title': 'Visualisasi Data\\nHubungan, Pola,\\ndan Lokasi',
        'cover_alt': 'Ilustrasi scatter plot, heatmap, dan peta titik',
        'remove': {'Visualisasi Data: Hubungan, Pola, dan Lokasi'},
        'order': [
            'Scatter plot melihat hubungan dua variabel',
            'Bubble chart menambahkan variabel ketiga',
            'Hubungan tidak sama dengan sebab-akibat',
            'Practice Tengah: durasi latihan dan skor',
            'Heatmap memperlihatkan pola dalam matriks',
            'Pair plot membandingkan beberapa pasangan',
            'Point map menempatkan data pada koordinat',
            'Choropleth mewarnai wilayah berdasarkan nilai',
            'Heatmap membutuhkan label yang mudah dibaca',
            'Point map dan choropleth menjawab pertanyaan berbeda',
            'Pilih visualisasi dari struktur datanya',
            'Periksa skala dan agregasi sebelum membaca',
            'Practice Akhir: ringkasan indikator kota',
            'Cek pemahaman',
        ],
        'count': 15,
        'filename': 'Visualisasi_Data_Hubungan_Pola_dan_Lokasi_skillupdate.pptx',
    },
}

for meeting, cfg in config.items():
    func_start = text.index(f'async function buildMeeting{meeting}()')
    prefix_end = text.index('  const chartSlides = [];', func_start)
    prefix_end = text.index('  const tableSlides = [];', prefix_end)
    prefix_end = text.index('\n', prefix_end) + 1
    blocks_end = text.index('\n  const rendered = [];', prefix_end)
    segment = text[prefix_end:blocks_end]
    chunks = re.split(r'(?=\n  \{\n    const s = addSlide\(p,)', segment)
    preamble, blocks = chunks[0], chunks[1:]
    title_by_block = {}
    for block in blocks:
        match = re.search(r'const s = addSlide\(p,\s*"([^"\n]+)"', block)
        if not match:
            raise ValueError(f'Could not get slide title in meeting {meeting}: {block[:100]}')
        title_by_block[match.group(1)] = block
    missing = set(cfg['order']) - set(title_by_block)
    unexpected = set(title_by_block) - set(cfg['order']) - cfg['remove']
    if missing or unexpected:
        raise ValueError(f'Meeting {meeting} title mismatch, missing={missing}, unexpected={unexpected}')
    ordered = [title_by_block[title] for title in cfg['order']]

    if meeting == 3:
        intro = ordered[0]
        intro = replace_once(intro,
            'addSlide(p, "Visualisasi Data: Distribusi", "Lihat bentuk, pusat, dan sebaran nilai sebelum membandingkan kelompok")',
            'addSlide(p, "Skor tersebar pada beberapa rentang", "Histogram merangkum jumlah peserta dalam tiap rentang nilai")',
            'distribution opening title')
        intro = replace_once(intro,
            '    addText(s, "Bagaimana nilai tersebar?", { left: 90, top: 235, width: 360, height: 65 }, { typeface: FONT_DISPLAY, fontSize: 29, color: colors.navy, bold: true });\n    addBullets(s, ["Histogram menunjukkan frekuensi per rentang.", "KDE menghaluskan pola kepadatan.", "Box dan violin membandingkan distribusi kelompok."], { left: 90, top: 330, width: 365, height: 210 }, { fontSize: 21 });',
            '    addText(s, "Batang tertinggi menandai rentang dengan peserta terbanyak.", { left: 90, top: 260, width: 360, height: 90 }, { typeface: FONT_DISPLAY, fontSize: 25, color: colors.navy, bold: true });\n    addBullets(s, ["Bandingkan tinggi batang antar-rentang.", "Periksa rentang nilai dan label sumbu sebelum membaca pola."], { left: 90, top: 382, width: 365, height: 150 }, { fontSize: 20 });',
            'distribution opening content')
        ordered[0] = intro
        ordered[1] = replace_once(ordered[1],
            '"Histogram merangkum frekuensi pada bins", "Bins terlalu sedikit menyembunyikan detail, bins terlalu banyak membuat grafik bergerigi"',
            '"Jumlah bins mengubah detail histogram", "Bins terlalu sedikit menyembunyikan pola, bins terlalu banyak membuat grafik bergerigi"',
            'histogram bins title')
        compare = ordered[7]
        compare = replace_once(compare,
            'addSlide(p, "Distribusi yang sama bisa tampak berbeda", "Gunakan lebih dari satu ringkasan ketika bentuk penting")',
            'addSlide(p, "Median serupa dapat menyembunyikan sebaran berbeda", "Histogram membantu membandingkan bentuk dan lebar sebaran")',
            'distribution comparison title')
        compare = replace_once(compare,
            '    await addImage(s, path.join(VISUAL_DIR, "histogram_main.png"), { left: 80, top: 200, width: 530, height: 390 }, "Histogram nilai contoh dengan enam bins");\n    const grid = Array.from({ length: 14 }, (_, i) => 45 + i * 4);\n    addChart(s, "line", { position: { left: 635, top: 200, width: 550, height: 390 }, title: "Kepadatan", categories: grid.map(String), series: [{ name: "KDE", values: gaussianKde(scores, grid), fill: colors.blueDark, line: { style: "solid", fill: colors.blueDark, width: 3 }, marker: { symbol: "none", size: 2 } }], hasLegend: false, lineOptions: { smooth: true }, yAxis: { title: "Kepadatan", min: 0, max: 0.05, majorUnit: 0.01, numberFormatCode: "0.00", textStyle: { fill: colors.secondary, fontSize: 12 }, majorGridlines: { style: "solid", fill: colors.rule, width: 1 } } });\n    chartSlides.push(10);\n    notes(s, ["Kedua grafik menggunakan data nilai yang sama."]);',
            '    await addImage(s, path.join(VISUAL_DIR, "distribution_comparison.png"), { left: 86, top: 190, width: 1100, height: 430 }, "Dua histogram dengan median sama dan sebaran berbeda");\n    notes(s, ["Kedua kelompok contoh memiliki median 76, tetapi rentang dan bentuk histogram berbeda.", "Visual dibuat dari data yang sama dengan contoh notebook."]);',
            'distribution comparison visual')
        ordered[7] = compare

    # Recompute native evidence slide numbers after inserting a cover and reordering.
    for index, block in enumerate(ordered):
        slide_number = index + 2
        block = re.sub(r'(chartSlides|tableSlides)\.push\(\d+\)', lambda m: f'{m.group(1)}.push({slide_number})', block)
        ordered[index] = block

    new_segment = preamble + ''.join(ordered)
    text = text[:prefix_end] + new_segment + text[blocks_end:]

    # Re-find this function after its source segment was replaced.
    func_start = text.index(f'async function buildMeeting{meeting}()')
    func_end = text.index('\n}', func_start) + 2
    function = text[func_start:func_end]
    output_name = cfg['filename']
    function = re.sub(r'const finalPath = path\.join\(outputDir, "[^"]+"\);', f'const finalPath = path.join(outputDir, "{output_name}");', function, count=1)
    function = replace_once(function,
        '  const p = Presentation.create({ slideSize: { width: SW, height: SH } });',
        '  const p = Presentation.create({ slideSize: { width: SW, height: SH } });\n  await addCover(p, "' + cfg['cover_title'] + '", path.join(COVER_DIR, "cover-' + str(meeting) + '.png"), "' + cfg['cover_alt'] + '");',
        f'meeting {meeting} add cover')
    function = re.sub(r'explicitTotalSlideCount: \d+', f'explicitTotalSlideCount: {cfg["count"]}', function, count=1)
    text = text[:func_start] + function + text[func_end:]

# The SciPy default Scott bandwidth is n^-1/5 times the sample standard deviation.
text = replace_once(text,
    'const bandwidth = 1.06 * Math.sqrt(variance) * values.length ** (-1 / 5);',
    'const bandwidth = Math.sqrt(variance) * values.length ** (-1 / 5);',
    'KDE Scott bandwidth')
text = replace_once(text,
    '"KDE pada slide dibuat dengan kernel Gaussian dan bandwidth rule-of-thumb yang sama dengan helper NumPy notebook."',
    '"KDE memakai kernel Gaussian dan bandwidth Scott seperti scipy.stats.gaussian_kde pada notebook."',
    'KDE speaker notes')
path.write_text(text)

# Session 1: a cover followed by the first chart topic, with the learning-outcome
# slide removed. Cover artwork remains separate from editable title text.
path1 = PYTHON / '_pengembangan/level-03/01-perbandingan-komposisi/slide/build_visualisasi_data.mjs'
text = path1.read_text()
text = replace_once(text,
    'const FINAL_PPTX = path.join(OUTPUT_DIR, "Visualisasi_Data_Perbandingan_dan_Komposisi.pptx");',
    'const FINAL_PPTX = path.join(OUTPUT_DIR, "Visualisasi_Data_Perbandingan_dan_Komposisi_skillupdate.pptx");',
    'session 1 final filename')
text = replace_once(text,
    'function setNotes(slide, lines) {\n  slide.speakerNotes.text = lines.join("\\n");\n}',
    'function setNotes(slide, lines) {\n  slide.speakerNotes.text = lines.join("\\n");\n}\n\nasync function addCover(title, file, alt) {\n  const slide = presentation.slides.add();\n  slide.background.fill = colors.white;\n  const bytes = await fs.readFile(file);\n  const blob = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);\n  slide.images.add({ blob, contentType: "image/png", alt, fit: "contain", position: { left: 0, top: 0, width: SW, height: SH } });\n  addText(slide, title, { left: 78, top: 228, width: 470, height: 260 }, {\n    typeface: FONT_DISPLAY, fontSize: 52, color: colors.navy, bold: true, verticalAlignment: "middle",\n  });\n  return slide;\n}',
    'session 1 cover helper')
text = replace_once(text,
    '// Slide 1\n{\n  const slide = addSlide(\n    "Visualisasi Data: Perbandingan dan Komposisi",\n    "Pilih grafik berdasarkan pertanyaan dan susunan data",\n  );',
    'await addCover("Visualisasi Data\\nPerbandingan dan Komposisi", path.join("/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/aset", "cover-1.png"), "Ilustrasi visualisasi perbandingan kategori dan komposisi");\n\n// Slide 2\n{\n  const slide = addSlide(\n    "Bar chart membandingkan kategori",\n    "Panjang batang menunjukkan jumlah unit pada tiap kategori",\n  );',
    'session 1 cover and first topic')
learning_block = re.compile(r'\n// Slide 2\n\{\n  const slide = addSlide\(\n    "Hasil belajar",.*?\n\}\n\n(?=// Slide 3)', re.S)
text, removed = learning_block.subn('\n', text, count=1)
if removed != 1:
    raise ValueError(f'Could not remove session 1 learning slide, removed={removed}')
text = replace_once(text,
    'const requiredNativeChartOwnerSlides = [1, 5, 6, 7, 9, 10, 12];',
    'const requiredNativeChartOwnerSlides = [2, 5, 6, 7, 9, 10, 12];',
    'session 1 native chart slide numbers')
path1.write_text(text)

print('Updated four deck builders and staged four cover assets')
