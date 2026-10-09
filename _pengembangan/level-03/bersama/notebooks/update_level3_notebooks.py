from pathlib import Path
import re
import nbformat
from nbformat.v4 import new_markdown_cell, new_code_cell

ROOT = Path('/Users/daf2a/Documents/python/level-03')
TOPIC_DIRS = {
    'perbandingan_komposisi': '01-perbandingan-komposisi',
    'visualisasi_tren_perubahan': '02-tren-perubahan',
    'visualisasi_distribusi': '03-distribusi',
    'visualisasi_hubungan_pola_lokasi': '04-hubungan-pola-lokasi',
}


def notebook_path(stem, suffix):
    folder = 'solusi' if suffix else 'notebooks'
    return ROOT / TOPIC_DIRS[stem] / folder / f'{stem}{suffix}.ipynb'



def source(cell):
    return cell.get('source', '')


def find_cell(nb, prefix):
    for i, cell in enumerate(nb.cells):
        if cell.cell_type == 'markdown' and source(cell).startswith(prefix):
            return i
    raise ValueError(f'Cell not found: {prefix}')


def find_code_after(nb, marker, offset=1):
    i = find_cell(nb, marker) + offset
    while i < len(nb.cells) and nb.cells[i].cell_type != 'code':
        i += 1
    if i == len(nb.cells):
        raise ValueError(f'Code cell not found after {marker}')
    return i


def insert_pair(stem, before_prefix, cells):
    for suffix in ['', '_solution']:
        path = notebook_path(stem, suffix)
        nb = nbformat.read(path, as_version=4)
        i = find_cell(nb, before_prefix)
        nb.cells[i:i] = [new_markdown_cell(md) if typ == 'md' else new_code_cell(code) for typ, md, code in cells]
        nbformat.write(nb, path)


def update_pair(stem, edit):
    for suffix in ['', '_solution']:
        path = notebook_path(stem, suffix)
        nb = nbformat.read(path, as_version=4)
        edit(nb)
        for cell in nb.cells:
            if cell.cell_type == 'code':
                cell.outputs = []
                cell.execution_count = None
        nbformat.write(nb, path)

# Meeting 1 starts directly with lesson material, consistent with the PPT.
def remove_learning_outcomes(nb):
    nb.cells = [c for c in nb.cells if not (c.cell_type == 'markdown' and source(c).startswith('## Hasil belajar'))]

update_pair('perbandingan_komposisi', remove_learning_outcomes)

# Remove unused setup code and keep only the libraries each lesson uses.
def clean_trend_setup(nb):
    i = find_cell(nb, '## Persiapan') + 1
    prep = source(nb.cells[i])
    nb.cells[i].source = prep.replace('Notebook ini memakai pandas, Matplotlib, dan Plotly.', 'Notebook ini memakai pandas dan Matplotlib.')
    ci = find_code_after(nb, '## Persiapan')
    code = source(nb.cells[ci])
    code = code.replace('import numpy as np\n', '').replace('import plotly.express as px\n', '')
    code = re.sub(r'\ndef kde_gaussian\(values, grid\):\n(?:    .*\n)+', '\n', code)
    nb.cells[ci].source = code

update_pair('visualisasi_tren_perubahan', clean_trend_setup)

# Percentage stacked area is an important distinct choice. Add it as a runnable
# example before the waterfall material, then add a second, independent waterfall
# example and a compact chart-selection guide before the final practice.
trend_cells = [
    ('md', '### Stacked area 100% membandingkan proporsi\n\nSetiap bulan dinormalisasi menjadi 100%. Grafik ini memperlihatkan perubahan komposisi, sedangkan perubahan total tidak tampak.', ''),
    ('code', '', "total_bulanan = penjualan[['Utara', 'Tengah', 'Selatan']].sum(axis=1)\npersentase_bulanan = penjualan[['Utara', 'Tengah', 'Selatan']].div(total_bulanan, axis=0) * 100\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.stackplot(\n    penjualan['Bulan'],\n    persentase_bulanan['Utara'],\n    persentase_bulanan['Tengah'],\n    persentase_bulanan['Selatan'],\n    labels=['Utara', 'Tengah', 'Selatan'],\n    colors=['#4FB6E8', '#F5D36A', '#55B77A'],\n)\nax.set(title='Komposisi Penjualan per Bulan', xlabel='Bulan', ylabel='Persentase total')\nax.set_ylim(0, 100)\nax.legend(loc='upper left', ncol=3)\nplt.show()"),
]
insert_pair('visualisasi_tren_perubahan', '### Waterfall merangkai', trend_cells)

waterfall_cells = [
    ('md', '### Contoh waterfall saldo acara\n\nSetiap baris adalah perubahan saldo kas, dalam ribuan rupiah. Nilai positif menambah saldo dan nilai negatif menguranginya.', ''),
    ('code', '', "perubahan_acara = pd.Series(\n    [-120, -80, 60, -45],\n    index=['Sewa tempat', 'Konsumsi', 'Sponsor', 'Perlengkapan'],\n)\nsaldo_awal = 500\nsaldo_berjalan = saldo_awal\nfig, ax = plt.subplots(figsize=(9, 4))\nax.bar(0, saldo_awal, color='#196B9B')\nfor posisi, nilai_perubahan in enumerate(perubahan_acara, start=1):\n    dasar = saldo_berjalan if nilai_perubahan >= 0 else saldo_berjalan + nilai_perubahan\n    warna = '#55B77A' if nilai_perubahan >= 0 else '#D99A37'\n    ax.bar(posisi, abs(nilai_perubahan), bottom=dasar, color=warna)\n    saldo_berjalan += nilai_perubahan\nax.bar(len(perubahan_acara) + 1, saldo_berjalan, color='#196B9B')\nlabel_tahap = ['Saldo awal', *perubahan_acara.index, 'Saldo akhir']\nax.set_xticks(range(len(label_tahap)), label_tahap, rotation=20)\nax.set(title='Perubahan Saldo Kas Acara', ylabel='Rupiah (ribu)')\nplt.show()\nprint(f'Saldo akhir: Rp{saldo_berjalan} ribu')"),
    ('md', '## Memilih grafik tren dan perubahan\n\nLine chart menonjolkan nilai pada waktu berurutan, sedangkan area menekankan besar nilai. Stacked area cocok untuk komponen nonnegatif yang dapat dijumlahkan, stacked area 100% untuk komposisi, dan waterfall untuk perubahan bertahap. Periksa urutan waktu, satuan, serta arti penjumlahan sebelum membaca pola.', ''),
]
insert_pair('visualisasi_tren_perubahan', '## Practice Akhir:', waterfall_cells)

# Distribution: use the public SciPy estimator instead of teaching a custom KDE
# implementation, and align the three-group examples with the PPT.
def clean_distribution_setup(nb):
    i = find_cell(nb, '## Persiapan') + 1
    prep = source(nb.cells[i])
    nb.cells[i].source = prep.replace('pandas, Matplotlib, dan Plotly', 'pandas, Matplotlib, dan SciPy')
    ci = find_code_after(nb, '## Persiapan')
    code = source(nb.cells[ci])
    code = code.replace('import plotly.express as px\n', 'from scipy.stats import gaussian_kde\n')
    code = re.sub(r'\ndef kde_gaussian\(values, grid\):\n(?:    .*\n)+', '\n', code)
    nb.cells[ci].source = code
    # Keep the explanation compact and clarify the role of bandwidth.
    mi = find_cell(nb, '### KDE memperhalus frekuensi')
    nb.cells[mi].source = '### KDE memperhalus frekuensi menjadi kurva kepadatan\n\nKDE merangkum area nilai yang relatif padat. Bandwidth mengatur kehalusan kurva dan dapat menyamarkan puncak yang berdekatan.'
    for cell in nb.cells:
        if cell.cell_type == 'code':
            cell.source = cell.source.replace('kde_gaussian(nilai, rentang)', 'gaussian_kde(nilai)(rentang)')
            cell.source = cell.source.replace('kde_gaussian(waktu, rentang_waktu)', 'gaussian_kde(waktu)(rentang_waktu)')
            cell.source = cell.source.replace('kde_gaussian(semua_nilai, rentang_semua)', 'gaussian_kde(semua_nilai)(rentang_semua)')
    # Three-group code now matches the PPT comparison data.
    box_i = find_code_after(nb, '## Box plot merangkum')
    nb.cells[box_i].source = "kelas_merah = [62, 66, 68, 70, 71, 73, 74, 76, 81, 92]\nkelas_biru = [55, 60, 64, 67, 70, 74, 78, 82, 86, 89]\nkelas_hijau = [48, 55, 59, 62, 64, 67, 69, 72, 80, 94]\nnilai_per_kelas = [kelas_merah, kelas_biru, kelas_hijau]\nnama_kelas = ['Merah', 'Biru', 'Hijau']\n\nfig, ax = plt.subplots(figsize=(8, 4))\nplot = ax.boxplot(nilai_per_kelas, tick_labels=nama_kelas, patch_artist=True)\nfor kotak, warna in zip(plot['boxes'], ['#EAF6FC', '#FFF7D6', '#E8F4EC']):\n    kotak.set_facecolor(warna)\nax.set(title='Ringkasan Nilai per Kelas', ylabel='Nilai')\nplt.show()"
    violin_i = find_code_after(nb, '### Violin plot menggabungkan')
    nb.cells[violin_i].source = "fig, ax = plt.subplots(figsize=(8, 4))\nplot = ax.violinplot(nilai_per_kelas, showmedians=True, showextrema=True)\nfor badan, warna in zip(plot['bodies'], ['#4FB6E8', '#F5D36A', '#55B77A']):\n    badan.set_facecolor(warna)\n    badan.set_alpha(0.62)\nax.set_xticks([1, 2, 3], nama_kelas)\nax.set(title='Bentuk Distribusi Nilai per Kelas', ylabel='Nilai')\nplt.show()"

update_pair('visualisasi_distribusi', clean_distribution_setup)

interpretation_cells = [
    ('md', '### Median serupa dapat menyembunyikan sebaran berbeda\n\nSetiap angka adalah nilai satu peserta dari dua kelompok contoh. Median keduanya sama, tetapi histogram menunjukkan lebar sebaran yang berbeda.', ''),
    ('code', '', "nilai_renggang = np.array([55, 60, 65, 70, 74, 78, 85, 90, 95, 100])\nnilai_rapat = np.array([68, 72, 73, 74, 76, 76, 77, 78, 79, 82])\nbins_nilai = [50, 60, 70, 80, 90, 100, 110]\n\nfig, axes = plt.subplots(1, 2, figsize=(10, 4), sharex=True, sharey=True)\nfor ax, data, nama, warna in zip(\n    axes,\n    [nilai_renggang, nilai_rapat],\n    ['Sebaran renggang', 'Nilai terkumpul'],\n    ['#4FB6E8', '#F5D36A'],\n):\n    median = np.median(data)\n    ax.hist(data, bins=bins_nilai, color=warna, edgecolor='white')\n    ax.axvline(median, color='#196B9B', linestyle='--', label=f'Median {median:.0f}')\n    ax.set(title=nama, xlabel='Nilai', ylabel='Jumlah peserta')\n    ax.legend()\nplt.tight_layout()\nplt.show()"),
    ('md', '### Nilai di luar whisker perlu diperiksa\n\nAturan IQR menandai kandidat pencilan, bukan kesalahan data. Periksa nilai mentah, satuan, dan proses pengumpulan sebelum membuat keputusan.', ''),
    ('code', '', "waktu_penyelesaian = pd.Series([28, 31, 32, 33, 34, 35, 35, 36, 37, 39, 45, 92], name='Menit')\nq1 = waktu_penyelesaian.quantile(0.25)\nq3 = waktu_penyelesaian.quantile(0.75)\niqr = q3 - q1\nbatas_bawah = q1 - 1.5 * iqr\nbatas_atas = q3 + 1.5 * iqr\nkandidat = waktu_penyelesaian[(waktu_penyelesaian < batas_bawah) | (waktu_penyelesaian > batas_atas)]\n\nfig, ax = plt.subplots(figsize=(7, 3.5))\nax.boxplot(waktu_penyelesaian, tick_labels=['Waktu kuis'], showfliers=True)\nax.set(title='Waktu Penyelesaian Kuis', ylabel='Menit')\nplt.show()\nprint('Kandidat pencilan menurut aturan IQR:', kandidat.tolist())"),
    ('md', '## Membaca pusat, sebaran, dan bentuk bersama\n\nMedian atau rata-rata merangkum pusat, kuartil atau rentang menunjukkan sebaran, dan histogram, KDE, serta violin membantu membaca bentuk. Baca ringkasan tersebut bersama data mentah dan konteksnya.', ''),
]
insert_pair('visualisasi_distribusi', '### Memilih grafik distribusi', interpretation_cells)

# Relationship lesson: remove unrelated KDE setup and align caution/selection
# notes with the final practice sequence.
def clean_relationship_setup(nb):
    i = find_cell(nb, '## Persiapan') + 1
    prep = source(nb.cells[i])
    nb.cells[i].source = prep.replace('import', 'import')
    ci = find_code_after(nb, '## Persiapan')
    code = source(nb.cells[ci])
    code = code.replace('def kde_gaussian(values, grid):\n    values = np.asarray(values, dtype=float)\n    bandwidth = 1.06 * values.std(ddof=1) * len(values) ** (-1 / 5)\n    z = (np.asarray(grid)[:, None] - values[None, :]) / bandwidth\n    return np.exp(-0.5 * z ** 2).sum(axis=1) / (len(values) * bandwidth * np.sqrt(2 * np.pi))\n\n', '')
    code = code.replace('import numpy as np\n', '')
    nb.cells[ci].source = code
    bubble_i = find_cell(nb, '### Bubble chart menambahkan')
    nb.cells[bubble_i].source = '### Bubble chart menambahkan variabel melalui ukuran titik\n\nPosisi menunjukkan dua nilai dan ukuran gelembung mewakili variabel ketiga. Pada Matplotlib, parameter `s` mengatur luas marker, bukan diameternya, jadi skala ukuran perlu dibatasi.'
    heat_i = find_cell(nb, '## Heatmap memperlihatkan')
    nb.cells[heat_i].source = '## Heatmap memperlihatkan pola pada matriks\n\nWarna menunjukkan nilai pada perpotongan dua kelompok. Label angka dan colorbar membantu membaca nilai, terutama saat warna berdekatan.'
    chorus_i = find_cell(nb, '### Choropleth membandingkan')
    nb.cells[chorus_i].source = '### Choropleth membandingkan nilai antarwilayah\n\nKolom `locations` berisi kode wilayah ISO-3. Gunakan satu baris per wilayah dengan nilai ringkasan yang sesuai. Nilai pada contoh ini bukan statistik negara yang sebenarnya.'

update_pair('visualisasi_hubungan_pola_lokasi', clean_relationship_setup)

causality_cells = [
    ('md', '### Hubungan pada grafik tidak membuktikan sebab-akibat\n\nScatter plot menunjukkan pola pada data yang diamati. Variabel ketiga, cara pengumpulan, atau faktor lain dapat ikut menjelaskan pola tersebut.', ''),
]
insert_pair('visualisasi_hubungan_pola_lokasi', '## Practice Tengah:', causality_cells)

selection_cells = [
    ('md', '## Memilih visualisasi hubungan, matriks, dan lokasi\n\nScatter dan bubble membandingkan nilai numerik, heatmap membaca matriks, dan pair plot melihat beberapa pasangan variabel. Point map mempertahankan titik koordinat, sedangkan choropleth memakai satu ringkasan per wilayah. Periksa satuan, agregasi, dan skala warna atau ukuran sebelum membandingkan hasil.', ''),
]
insert_pair('visualisasi_hubungan_pola_lokasi', '## Practice Akhir:', selection_cells)

# Clear outputs from all edited code cells so execution can rebuild them consistently.
for path in ROOT.rglob('*.ipynb'):
    nb = nbformat.read(path, as_version=4)
    for cell in nb.cells:
        if cell.cell_type == 'code':
            cell.outputs = []
            cell.execution_count = None
    nbformat.write(nb, path)
print('Updated all eight Level 3 notebooks')
