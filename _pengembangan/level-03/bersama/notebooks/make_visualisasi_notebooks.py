from pathlib import Path
import nbformat

output_dir = Path('/Users/daf2a/Documents/python/level-03/01-perbandingan-komposisi')
output_dir.mkdir(parents=True, exist_ok=True)


def markdown(source):
    return nbformat.v4.new_markdown_cell(source)


def code(source, practice=None):
    cell = nbformat.v4.new_code_cell(source)
    if practice:
        cell.metadata['practice_id'] = practice
    return cell


sales_rows = '''[
    ("Utara", "Buku", 32),
    ("Utara", "Alat Tulis", 25),
    ("Utara", "Makanan", 40),
    ("Utara", "Minuman", 33),
    ("Utara", "Aksesori", 18),
    ("Tengah", "Buku", 26),
    ("Tengah", "Alat Tulis", 34),
    ("Tengah", "Makanan", 35),
    ("Tengah", "Minuman", 28),
    ("Tengah", "Aksesori", 21),
    ("Selatan", "Buku", 22),
    ("Selatan", "Alat Tulis", 28),
    ("Selatan", "Makanan", 44),
    ("Selatan", "Minuman", 31),
    ("Selatan", "Aksesori", 25),
]'''

choice_rows = '''[
    ("X", "Sains"), ("X", "Sains"), ("X", "Sains"), ("X", "Sains"),
    ("X", "Seni"), ("X", "Seni"),
    ("X", "Olahraga"),
    ("XI", "Sains"), ("XI", "Sains"), ("XI", "Sains"),
    ("XI", "Sains"), ("XI", "Sains"),
    ("XI", "Seni"), ("XI", "Seni"), ("XI", "Seni"),
    ("XI", "Olahraga"), ("XI", "Olahraga"),
    ("XII", "Sains"), ("XII", "Sains"),
    ("XII", "Seni"), ("XII", "Seni"), ("XII", "Seni"), ("XII", "Seni"),
    ("XII", "Olahraga"), ("XII", "Olahraga"), ("XII", "Olahraga"),
]'''

bazaar_rows = '''[
    ("Aula", "Buku", "Komik", 18),
    ("Aula", "Buku", "Ensiklopedia", 12),
    ("Aula", "Alat Tulis", "Pensil", 15),
    ("Aula", "Alat Tulis", "Buku Catatan", 11),
    ("Aula", "Makanan", "Roti", 20),
    ("Aula", "Makanan", "Kue", 12),
    ("Aula", "Minuman", "Air Mineral", 16),
    ("Aula", "Minuman", "Jus", 14),
    ("Taman", "Buku", "Komik", 12),
    ("Taman", "Buku", "Ensiklopedia", 10),
    ("Taman", "Alat Tulis", "Pensil", 20),
    ("Taman", "Alat Tulis", "Buku Catatan", 14),
    ("Taman", "Makanan", "Roti", 17),
    ("Taman", "Makanan", "Kue", 13),
    ("Taman", "Minuman", "Air Mineral", 12),
    ("Taman", "Minuman", "Jus", 18),
    ("Lapangan", "Buku", "Komik", 16),
    ("Lapangan", "Buku", "Ensiklopedia", 14),
    ("Lapangan", "Alat Tulis", "Pensil", 14),
    ("Lapangan", "Alat Tulis", "Buku Catatan", 16),
    ("Lapangan", "Makanan", "Roti", 24),
    ("Lapangan", "Makanan", "Kue", 15),
    ("Lapangan", "Minuman", "Air Mineral", 20),
    ("Lapangan", "Minuman", "Jus", 16),
]'''

practice_middle_solution = '''frekuensi_pilihan = pilihan_siswa["Ekstrakurikuler"].value_counts()

ax = frekuensi_pilihan.plot(kind="bar", color="#4FB6E8", figsize=(7, 4))
ax.set_title("Jumlah pilihan ekstrakurikuler")
ax.set_xlabel("Ekstrakurikuler")
ax.set_ylabel("Jumlah siswa")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

pilihan_per_kelas = pd.crosstab(
    pilihan_siswa["Ekstrakurikuler"],
    pilihan_siswa["Kelas"],
)
print(pilihan_per_kelas)

ax = pilihan_per_kelas.plot(kind="bar", figsize=(8, 4), color=["#4FB6E8", "#F5D36A", "#55B77A"])
ax.set_title("Pilihan ekstrakurikuler per kelas")
ax.set_xlabel("Ekstrakurikuler")
ax.set_ylabel("Jumlah siswa")
ax.legend(title="Kelas")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

pilihan_teratas = frekuensi_pilihan.idxmax()
jumlah_teratas = int(frekuensi_pilihan.max())
print(f"Pilihan terbanyak adalah {pilihan_teratas}, sebanyak {jumlah_teratas} siswa.")'''

practice_final_solution = '''total_per_kelompok = bazar.groupby("Kelompok")["Unit"].sum()
tabel_bazar = bazar.pivot_table(
    index="Stan",
    columns="Kelompok",
    values="Unit",
    aggfunc="sum",
)
print(tabel_bazar)

ax = tabel_bazar.T.plot(kind="bar", figsize=(8, 4), color=["#4FB6E8", "#F5D36A", "#55B77A"])
ax.set_title("Perbandingan unit per kelompok produk")
ax.set_xlabel("Kelompok produk")
ax.set_ylabel("Unit terjual")
ax.legend(title="Stan")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

ax = tabel_bazar.plot(kind="bar", stacked=True, figsize=(8, 4), color=["#4FB6E8", "#F5D36A", "#55B77A", "#196B9B"])
ax.set_title("Komposisi unit per stan")
ax.set_xlabel("Stan")
ax.set_ylabel("Unit terjual")
ax.legend(title="Kelompok produk")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

persen_bazar = tabel_bazar.div(tabel_bazar.sum(axis=1), axis=0) * 100
ax = persen_bazar.plot(kind="bar", stacked=True, figsize=(8, 4), color=["#4FB6E8", "#F5D36A", "#55B77A", "#196B9B"])
ax.set_title("Persentase komposisi produk per stan")
ax.set_xlabel("Stan")
ax.set_ylabel("Bagian dari total stan (%)")
ax.legend(title="Kelompok produk", bbox_to_anchor=(1.02, 1), loc="upper left")
ax.set_ylim(0, 100)
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

unit_aula = tabel_bazar.loc["Aula"]
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
axes[0].pie(
    unit_aula,
    labels=unit_aula.index,
    autopct="%1.1f%%",
    startangle=90,
)
axes[0].set_title("Pie chart: bagian dari total")
axes[1].pie(
    unit_aula,
    labels=unit_aula.index,
    autopct="%1.1f%%",
    startangle=90,
    wedgeprops={"width": 0.42},
)
axes[1].set_title("Donut chart: bagian dari total")
plt.tight_layout()
plt.show()

rincian_produk = bazar.groupby(["Kelompok", "Produk"], as_index=False)["Unit"].sum()
fig = px.treemap(
    rincian_produk,
    path=[px.Constant("Semua Produk"), "Kelompok", "Produk"],
    values="Unit",
    color="Unit",
    color_continuous_scale="Blues",
    title="Treemap unit terjual menurut kelompok dan produk",
)
fig.show()

pangsa_bazar = persen_bazar
kelompok = pangsa_bazar.columns.tolist()
sudut = np.linspace(0, 2 * np.pi, len(kelompok), endpoint=False).tolist()
sudut_tutup = sudut + sudut[:1]
fig, ax = plt.subplots(figsize=(7, 6), subplot_kw={"polar": True})
for stan in ["Aula", "Taman"]:
    nilai = pangsa_bazar.loc[stan].tolist()
    nilai_tutup = nilai + nilai[:1]
    ax.plot(sudut_tutup, nilai_tutup, linewidth=2, label=stan)
    ax.fill(sudut_tutup, nilai_tutup, alpha=0.12)
ax.set_xticks(sudut)
ax.set_xticklabels(kelompok)
ax.set_ylim(0, 40)
ax.set_title("Radar chart: persentase komposisi dua stan", pad=24)
ax.legend(loc="upper right", bbox_to_anchor=(1.25, 1.15))
plt.tight_layout()
plt.show()

kelompok_teratas = total_per_kelompok.idxmax()
jumlah_unit_teratas = int(total_per_kelompok.max())
print(f"Kelompok dengan unit terbanyak adalah {kelompok_teratas}, sebanyak {jumlah_unit_teratas} unit.")'''

middle_prompt = '''## Practice Tengah: pilihan ekstrakurikuler

Setiap baris mewakili satu jawaban siswa. Buat grafik frekuensi untuk seluruh pilihan, lalu buat grouped bar chart yang membandingkan pilihan antar kelas.

1. Tampilkan jumlah siswa untuk setiap ekstrakurikuler.
2. Bandingkan pilihan per kelas menggunakan grouped bar chart.
3. Tuliskan pilihan terbanyak dengan jumlah siswa sebagai bukti.'''

final_prompt = '''## Practice Akhir: penjualan bazar sekolah

Setiap baris adalah jumlah produk yang terjual pada satu stan. Gunakan data ini untuk membuat grafik yang membantu membandingkan total dan komposisi.

1. Buat grouped bar chart untuk membandingkan kelompok produk antarstan.
2. Buat stacked bar chart, lalu ubah data menjadi persentase dan buat 100% stacked bar chart.
3. Buat pie chart dan donut chart untuk komposisi satu stan.
4. Buat treemap dari kelompok produk dan nama produk.
5. Gunakan radar chart untuk membandingkan persentase kelompok produk pada dua stan.
6. Sebutkan kelompok dengan unit terjual terbanyak dan sertakan nilainya.'''

base_cells = [
    markdown('''# Visualisasi Data: Perbandingan dan Komposisi

Grafik membantu kita membandingkan kategori dan melihat bagian dari keseluruhan. Pilih bentuk grafik berdasarkan pertanyaan dan susunan datanya.'''),
    markdown('''## Hasil belajar

- Memilih grafik untuk membandingkan kategori atau bagian dari keseluruhan.
- Membuat grafik dengan Pandas, Matplotlib, dan Plotly Express.
- Membaca nilai yang ditampilkan dan menyampaikan satu kesimpulan berbasis angka.'''),
    markdown('''## Dataset penjualan festival sekolah

Dataset berikut adalah contoh buatan. Setiap baris merangkum jumlah unit yang terjual pada satu cabang untuk satu kategori selama festival. `Unit` menggunakan satuan barang.'''),
    code(f'''import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px

penjualan = pd.DataFrame(
    {sales_rows},
    columns=["Cabang", "Kategori", "Unit"],
)
print(penjualan.head())
print(f"Jumlah baris: {{len(penjualan)}}")'''),
    markdown('''## Bagian 1. Perbandingan dan frekuensi

Gunakan bar chart untuk membandingkan jumlah. Gunakan grafik frekuensi ketika setiap baris merupakan satu jawaban atau satu transaksi.'''),
    markdown('''### Menjumlahkan data per kategori

`groupby()` mengelompokkan baris yang memiliki kategori sama. `sum()` menjumlahkan unit di dalam setiap kelompok.'''),
    code('''total_kategori = (
    penjualan.groupby("Kategori", as_index=False)["Unit"]
    .sum()
    .sort_values("Unit", ascending=False)
)
print(total_kategori)'''),
    markdown('''### Bar chart vertikal dan horizontal

Bar chart sesuai untuk membandingkan nilai antarkategori. Bar chart horizontal memberi ruang lebih luas untuk nama kategori yang panjang.'''),
    code('''fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].bar(total_kategori["Kategori"], total_kategori["Unit"], color="#4FB6E8")
axes[0].set_title("Bar chart vertikal")
axes[0].set_xlabel("Kategori")
axes[0].set_ylabel("Unit terjual")
axes[0].tick_params(axis="x", rotation=25)

urut = total_kategori.sort_values("Unit")
axes[1].barh(urut["Kategori"], urut["Unit"], color="#196B9B")
axes[1].set_title("Bar chart horizontal")
axes[1].set_xlabel("Unit terjual")
axes[1].set_ylabel("Kategori")
plt.tight_layout()
plt.show()'''),
    markdown('''Bar chart memakai tinggi atau panjang batang untuk menunjukkan nilai. Sumbu nilai sebaiknya dimulai dari nol agar perbedaan panjang batang tidak dibesar-besarkan.'''),
    markdown('''### Grafik frekuensi atau count plot

Count plot menampilkan jumlah baris pada setiap kategori. Pada data mentah, satu baris di sini mewakili satu pesanan.'''),
    code('''kategori_pesanan = [
    "Buku", "Alat Tulis", "Makanan", "Buku", "Minuman", "Makanan",
    "Aksesori", "Alat Tulis", "Makanan", "Minuman", "Buku", "Makanan",
    "Alat Tulis", "Buku", "Makanan", "Aksesori", "Minuman", "Alat Tulis",
    "Makanan", "Makanan", "Alat Tulis",
]
frekuensi = pd.Series(kategori_pesanan).value_counts()
print(frekuensi)

ax = frekuensi.plot(kind="bar", color="#F5D36A", figsize=(7, 4))
ax.set_title("Count plot pesanan per kategori")
ax.set_xlabel("Kategori")
ax.set_ylabel("Jumlah pesanan")
plt.xticks(rotation=25, ha="right")
plt.tight_layout()
plt.show()'''),
    markdown('''Count plot menghitung banyaknya pengamatan. Bar chart biasa dapat menampilkan jumlah, rata-rata, atau ukuran lain yang sudah dihitung.'''),
    markdown('''### Grouped bar chart

Grouped bar chart menempatkan beberapa batang berdampingan pada setiap kategori agar kelompok dapat dibandingkan.'''),
    code('''tabel_cabang = penjualan.pivot(
    index="Kategori",
    columns="Cabang",
    values="Unit",
)
print(tabel_cabang)

ax = tabel_cabang.plot(
    kind="bar",
    figsize=(9, 4),
    color=["#4FB6E8", "#F5D36A", "#55B77A"],
)
ax.set_title("Unit terjual per kategori dan cabang")
ax.set_xlabel("Kategori")
ax.set_ylabel("Unit terjual")
ax.legend(title="Cabang")
plt.xticks(rotation=20, ha="right")
plt.tight_layout()
plt.show()'''),
    markdown('''Warna menunjukkan cabang. Bandingkan batang dengan kategori yang sama untuk mengetahui perbedaan antar cabang.'''),
    markdown(middle_prompt),
    code('''# Data baru untuk practice. Setiap tuple mewakili satu jawaban siswa.
data_pilihan = ''' + choice_rows + '''
pilihan_siswa = pd.DataFrame(
    data_pilihan,
    columns=["Kelas", "Ekstrakurikuler"],
)
print(pilihan_siswa.head())
print(f"Jumlah jawaban: {len(pilihan_siswa)}")'''),
    code('# Tulis kode untuk kedua grafik dan kesimpulan di sini.', practice='middle'),
    markdown('''## Bagian 2. Komposisi

Grafik komposisi menunjukkan bagian dari total. Periksa apakah pertanyaannya meminta jumlah atau persentase sebelum memilih grafik.'''),
    markdown('''### Stacked bar dan 100% stacked bar

Stacked bar menumpuk nilai kategori untuk menunjukkan total dan komponennya. Versi 100% mengubah setiap batang menjadi persentase agar proporsi antarkelompok mudah dibandingkan.'''),
    code('''ax = tabel_cabang.T.plot(
    kind="bar",
    stacked=True,
    figsize=(8, 4),
    color=["#4FB6E8", "#F5D36A", "#55B77A", "#196B9B", "#D99A37"],
)
ax.set_title("Komposisi unit per cabang")
ax.set_xlabel("Cabang")
ax.set_ylabel("Unit terjual")
ax.legend(title="Kategori", bbox_to_anchor=(1.02, 1), loc="upper left")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()

persentase = tabel_cabang.T.div(tabel_cabang.T.sum(axis=1), axis=0) * 100
ax = persentase.plot(
    kind="bar",
    stacked=True,
    figsize=(8, 4),
    color=["#4FB6E8", "#F5D36A", "#55B77A", "#196B9B", "#D99A37"],
)
ax.set_title("Persentase komposisi per cabang")
ax.set_xlabel("Cabang")
ax.set_ylabel("Bagian dari total cabang (%)")
ax.set_ylim(0, 100)
ax.legend(title="Kategori", bbox_to_anchor=(1.02, 1), loc="upper left")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()'''),
    markdown('''Stacked bar membantu melihat total, tetapi perbandingan segmen yang berada di tengah lebih sulit karena tidak memiliki garis dasar bersama. Gunakan 100% stacked bar ketika fokusnya proporsi.'''),
    markdown('''### Pie chart dan donut chart

Pie chart menunjukkan bagian dari satu total. Donut chart memakai bentuk yang sama dengan ruang kosong di tengah. Keduanya lebih mudah dibaca ketika kategori sedikit.'''),
    code('''utara = tabel_cabang["Utara"]
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
axes[0].pie(utara, labels=utara.index, autopct="%1.1f%%", startangle=90)
axes[0].set_title("Pie chart unit cabang Utara")
axes[1].pie(
    utara,
    labels=utara.index,
    autopct="%1.1f%%",
    startangle=90,
    wedgeprops={"width": 0.42},
)
axes[1].set_title("Donut chart unit cabang Utara")
plt.tight_layout()
plt.show()'''),
    markdown('''Persentase setiap irisan dihitung dari jumlah unit cabang Utara. Untuk membandingkan banyak cabang, grouped bar atau 100% stacked bar biasanya lebih praktis daripada membuat banyak pie chart.'''),
    markdown('''### Treemap

Treemap menampilkan data bertingkat melalui persegi panjang. Luas setiap persegi panjang mengikuti nilai yang diringkas.'''),
    code('''fig = px.treemap(
    penjualan,
    path=[px.Constant("Semua Penjualan"), "Cabang", "Kategori"],
    values="Unit",
    color="Unit",
    color_continuous_scale="Blues",
    title="Unit terjual menurut cabang dan kategori",
)
fig.show()'''),
    markdown('''Cabang menjadi kelompok tingkat pertama, lalu kategori menjadi bagian di dalamnya. Periksa legenda warna untuk membaca nilai unit.'''),
    markdown('''### Radar chart

Radar chart membandingkan profil beberapa kelompok pada indikator yang sama. Ubah nilai menjadi persentase per cabang agar perbedaan ukuran total tidak mendominasi bentuknya.'''),
    code('''pangsa = tabel_cabang.T.div(tabel_cabang.T.sum(axis=1), axis=0) * 100
kategori = pangsa.columns.tolist()
sudut = np.linspace(0, 2 * np.pi, len(kategori), endpoint=False).tolist()
sudut_tutup = sudut + sudut[:1]

fig, ax = plt.subplots(figsize=(7, 6), subplot_kw={"polar": True})
for cabang in ["Utara", "Tengah"]:
    nilai = pangsa.loc[cabang].tolist()
    nilai_tutup = nilai + nilai[:1]
    ax.plot(sudut_tutup, nilai_tutup, linewidth=2, label=cabang)
    ax.fill(sudut_tutup, nilai_tutup, alpha=0.12)
ax.set_xticks(sudut)
ax.set_xticklabels(kategori)
ax.set_ylim(0, 40)
ax.set_title("Persentase komposisi dua cabang", pad=24)
ax.legend(loc="upper right", bbox_to_anchor=(1.25, 1.15))
plt.tight_layout()
plt.show()'''),
    markdown('''Gunakan indikator yang sama dan skala yang konsisten untuk semua cabang. Radar chart memberi gambaran profil, sedangkan bar chart lebih tepat untuk membaca angka dengan presisi.'''),
    markdown(final_prompt),
    code('''# Data baru untuk practice. Setiap baris merangkum satu produk pada satu stan.
data_bazar = ''' + bazaar_rows + '''
bazar = pd.DataFrame(
    data_bazar,
    columns=["Stan", "Kelompok", "Produk", "Unit"],
)
print(bazar.head())
print(f"Jumlah baris: {len(bazar)}")'''),
    code('# Tulis kode untuk semua grafik dan kesimpulan di sini.', practice='final'),
    markdown('''## Memilih grafik

- Bar chart membandingkan ukuran antar kategori.
- Count plot menghitung banyaknya baris pada setiap kategori.
- Grouped bar membandingkan kelompok secara berdampingan.
- Stacked bar menunjukkan total dan komponen. Versi 100% membandingkan proporsi.
- Pie atau donut menunjukkan bagian dari satu total.
- Treemap menunjukkan nilai dengan struktur bertingkat.
- Radar membandingkan profil beberapa kelompok pada indikator yang sama.'''),
    markdown('''## Referensi API

- [Pandas `DataFrame.groupby`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html)
- [Pandas `DataFrame.pivot`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html)
- [Matplotlib `pyplot`](https://matplotlib.org/stable/api/pyplot_summary.html)
- [Plotly Treemap](https://plotly.com/python/treemaps/)'''),
]


def make_notebook(filename, role, include_solutions):
    cells = []
    for cell in base_cells:
        clone = nbformat.from_dict(cell)
        practice_id = clone.metadata.get('practice_id') if clone.cell_type == 'code' else None
        if include_solutions and practice_id == 'middle':
            clone.source = practice_middle_solution
        elif include_solutions and practice_id == 'final':
            clone.source = practice_final_solution
        if clone.cell_type == 'code':
            clone.execution_count = None
            clone.outputs = []
        cells.append(clone)
    if include_solutions:
        cells.insert(1, markdown('### Versi Solusi'))
    notebook = nbformat.v4.new_notebook(cells=cells)
    notebook.metadata['kernelspec'] = {
        'display_name': 'Python 3',
        'language': 'python',
        'name': 'python3',
    }
    notebook.metadata['language_info'] = {
        'name': 'python',
        'version': '3',
    }
    notebook.metadata['colab'] = {'name': filename}
    notebook.metadata['course'] = {'language': 'id', 'role': role}
    nbformat.validate(notebook)
    target = output_dir / ('solusi' if include_solutions else 'notebooks') / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    nbformat.write(notebook, target)


make_notebook('perbandingan_komposisi.ipynb', 'student', False)
make_notebook('perbandingan_komposisi_solution.ipynb', 'instructor', True)
print(output_dir / 'notebooks/perbandingan_komposisi.ipynb')
print(output_dir / 'solusi/perbandingan_komposisi_solution.ipynb')
