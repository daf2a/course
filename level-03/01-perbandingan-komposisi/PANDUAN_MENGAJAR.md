# Panduan Mengajar: Level 3, Pertemuan 1

Materi: **Visualisasi Data, Perbandingan dan Komposisi**.

Panduan ini mengikuti deck **Visualisasi_Data_Perbandingan_dan_Komposisi_dengan_Kode.pptx**, sebanyak 21 slide. Tujuh slide tambahan berisi kode saja dan ditempatkan tepat setelah slide grafik. Notebook siswa dan editorial yang sudah ada tetap menjadi sumber latihan.

## Persiapan pengajar

Buka deck, notebook siswa, dan notebook editorial. Jalankan notebook editorial dari atas ke bawah sebelum kelas. Saat kelas, gunakan notebook siswa untuk demonstrasi dan latihan, lalu lihat editorial untuk memeriksa jawaban.

- [Notebook siswa di Colab](https://daf2a.com/course/notebook/3/perbandingan_komposisi.ipynb)
- [Notebook editorial di Colab](https://daf2a.com/course/notebook/3/perbandingan_komposisi_editorial.ipynb)
- File lokal siswa: `notebooks/perbandingan_komposisi.ipynb`
- File lokal editorial: `notebooks/perbandingan_komposisi_editorial.ipynb`

Cara menyampaikan materi: **ajukan pertanyaan, baca grafik, periksa bentuk data, baru jelaskan kode**. Setelah demonstrasi, minta siswa menyebutkan satu kesimpulan dengan angka dan satu batasan kesimpulannya. Siswa tidak harus menghafal semua parameter tampilan.

### Peta blok kode notebook

Nomor blok di bawah menghitung **code cell saja**, dimulai dari 1. Nomor ini sama pada notebook siswa dan editorial. Cell Markdown pengantar editorial membuat nomor cell keseluruhan berbeda.

| Blok kode | Isi | Slide terkait |
|---|---|---|
| 1 | Import pustaka dan data `penjualan` | 2 |
| 2 | Total unit per kategori | 4–5 |
| 3 | Bar vertikal dan horizontal | 4–5 |
| 4 | Frekuensi kategori pesanan | 6–7 |
| 5 | Pivot dan grouped bar | 8–9 |
| 6 | Data pilihan ekstrakurikuler | 10 |
| 7 | Jawaban practice tengah | 10 |
| 8 | Stacked bar dan persentase | 11–12 |
| 9 | Pie dan donut | 13–14 |
| 10 | Treemap Plotly | 15–16 |
| 11 | Radar | 17–18 |
| 12 | Data bazar | 19 |
| 13 | Jawaban practice akhir | 19 |

Pada notebook siswa, blok 7 dan 13 disediakan untuk dikerjakan siswa. Solusi lengkap berada pada blok yang sama di editorial. Cuplikan di slide memadatkan kode untuk dibaca di kelas, terutama judul, warna, dan pengaturan label. Penjelasan di bawah juga mencakup kode lengkap notebook.

## Panduan per slide

### Slide 1: Visualisasi Data, Perbandingan dan Komposisi

**Tujuan:** siswa membedakan membandingkan nilai, menghitung pengamatan, dan membaca bagian dari total.

**Kalimat pembuka:**

> Hari ini kita memakai data penjualan festival. Ada pertanyaan tentang produk paling laku, perbedaan antar cabang, dan bagian setiap produk dari total penjualan. Kita akan memilih grafik berdasarkan pertanyaannya.

**Cara menyampaikan:** tawarkan tiga pertanyaan itu sebelum menyebutkan nama grafik. Minta siswa menebak apakah semuanya dapat dijawab dengan satu tampilan yang sama.

**Pertanyaan kelas:** “Kalau saya bilang paling laku, apa yang perlu kita pastikan?”

**Jawaban acuan:** ukuran yang dipakai, misalnya unit terjual, jumlah pesanan, atau pendapatan. Dataset ini memiliki unit terjual. Harga dan laba tidak tersedia.

### Slide 2: Data penjualan festival sekolah

**Notebook:** blok 1. Satu baris adalah ringkasan **satu kategori pada satu cabang**. Lima kategori dikalikan tiga cabang menghasilkan 15 baris. Satu baris bukan satu transaksi.

**Kalimat pengajar:**

> Baris Utara, Buku, 32 berarti 32 unit buku terjual di cabang Utara. Saat membaca data, pertanyaan pertama saya adalah: satu baris mewakili apa? Jawabannya menentukan apakah nanti kita menjumlahkan unit atau menghitung baris.

**Pahami kode awal:**

- `numpy as np` dipakai untuk membuat sudut pada radar.
- `pandas as pd` membuat dan mengolah tabel.
- `matplotlib.pyplot as plt` membuat grafik bar, pie, dan radar.
- `plotly.express as px` membuat treemap interaktif.
- `pd.DataFrame([...], columns=["Cabang", "Kategori", "Unit"])` menyusun tuple menjadi tabel dengan tiga kolom bernama.
- `penjualan.head()` menampilkan lima baris awal. Ini pemeriksaan singkat, bukan seluruh dataset.
- `len(penjualan)` menghitung baris, hasilnya **15**.
- `f"Jumlah baris: {len(penjualan)}"` menyisipkan hasil perhitungan ke dalam teks.

**Demo:** jalankan blok 1, tunjuk satu baris, lalu minta siswa membacanya dengan satu kalimat.

**Pertanyaan:** “Kalau setiap kategori muncul tiga kali, apakah penjualan semua kategori sama?”

**Jawaban:** jumlah baris per kategori sama, tetapi nilai `Unit` berbeda. Kita harus menjumlahkan kolom `Unit`.

### Slide 3: Bentuk data memberi petunjuk awal

**Kalimat pengajar:**

> Kita mulai dari pertanyaan dan bentuk data. Satu nilai per kategori dapat dibandingkan dengan bar. Jawaban mentah satu per siswa dapat dihitung frekuensinya. Bagian yang membentuk total membutuhkan grafik komposisi.

**Cara menyampaikan:** baca satu baris tabel pemilihan grafik, lalu minta siswa memberi contoh pertanyaan nyata. Jangan langsung masuk ke sintaks.

| Pertanyaan | Pengolahan awal | Grafik |
|---|---|---|
| Kategori mana paling banyak unitnya? | Jumlahkan unit per kategori | Bar |
| Pilihan mana paling sering muncul? | Hitung frekuensi jawaban | Count plot |
| Bagaimana kategori berbeda antar cabang? | Susun kategori × cabang | Grouped bar |
| Bagian apa yang membentuk total? | Kelompokkan komponen total | Stacked bar, pie, donut |
| Bagaimana komposisi relatif antar cabang? | Hitung persen per cabang | 100% stacked bar |
| Bagaimana bagian tersusun bertingkat? | Tentukan hierarki dan ukuran | Treemap |
| Bagaimana profil beberapa kelompok? | Samakan kategori dan skala | Radar |

**Pertanyaan:** “Mengapa kita perlu memikirkan satuan pada sumbu?”

**Jawaban:** angka 30 bisa berarti 30 unit, 30 siswa, atau 30 persen. Kesimpulannya berbeda.

### Slide 4: Bar chart membandingkan kategori

Grafik di slide memakai **bar horizontal**. Notebook blok 3 menunjukkan versi vertikal dan horizontal dari nilai yang sama.

Cuplikan pendek pada slide grafik asli menggunakan nama generik `data`. Pada notebook dan slide kode berikutnya, tabel tersebut bernama `penjualan`. Gunakan nama `penjualan` saat menjalankan contoh di Colab.

**Kalimat pengajar:**

> Panjang batang menunjukkan jumlah unit. Makanan berada pada 119 unit, sedangkan Aksesori 64 unit. Kita sudah menjumlahkan penjualan tiga cabang, sehingga setiap kategori memiliki satu nilai.

**Angka untuk memeriksa hasil:**

| Kategori | Total unit |
|---|---:|
| Makanan | 119 |
| Minuman | 92 |
| Alat Tulis | 87 |
| Buku | 80 |
| Aksesori | 64 |
| **Total** | **442** |

**Cara menyampaikan:** tunjuk sumbu angka, lalu dua batang. Minta siswa membandingkan dengan angka, misalnya Makanan lebih banyak **55 unit** daripada Aksesori.

**Pertanyaan:** “Mengapa memakai batang horizontal?”

**Jawaban:** label kategori yang panjang lebih mudah dibaca. Nilai dan makna datanya sama dengan versi vertikal.

### Slide 5: Kode bar chart

**Notebook:** blok 2–3. Jalankan setelah data `penjualan` dibuat.

```python
total_kategori = (
    penjualan.groupby("Kategori", as_index=False)["Unit"]
    .sum()
    .sort_values("Unit", ascending=False)
)
urut = total_kategori.sort_values("Unit")
fig, ax = plt.subplots(figsize=(8, 4))
ax.barh(urut["Kategori"], urut["Unit"], color="#4FB6E8")
ax.set_xlabel("Unit terjual")
ax.set_ylabel("Kategori")
plt.tight_layout()
plt.show()
```

**Baca kode dengan urutan data → ringkasan → grafik:**

1. `groupby("Kategori")` mengumpulkan baris dengan kategori yang sama.
2. `["Unit"].sum()` menjumlahkan unit di setiap kumpulan. Makanan: `40 + 35 + 44 = 119`.
3. `as_index=False` membuat `Kategori` tetap menjadi kolom hasil sehingga dapat diambil dengan `total_kategori["Kategori"]`.
4. `ascending=False` mengurutkan dari terbesar. Variabel `urut` mengurutkan naik untuk bar horizontal sehingga nilai terbesar berada di atas.
5. `plt.subplots()` membuat tempat gambar `fig` dan bidang grafik `ax`. `barh()` memakai kategori pada sumbu vertikal dan unit pada sumbu horizontal.
6. `tight_layout()` mengatur jarak elemen. `show()` menampilkan gambar.

Notebook menggunakan `plt.subplots(1, 2, figsize=(12, 4))`: satu baris, dua bidang grafik. `axes[0]` membuat bar vertikal dengan `.bar()`, `axes[1]` membuat bar horizontal dengan `.barh()`. `figsize` memakai inci. `tick_params(axis="x", rotation=25)` memiringkan label sumbu x.

**Kalimat pengajar:**

> Saya pisahkan pengolahan datanya dari menggambar. Kita periksa tabel total lebih dulu. Kalau tabelnya salah, grafik yang rapi tetap akan memberikan kesimpulan yang salah.

**Demo:** tampilkan `total_kategori` sebelum grafik. Minta siswa menghitung satu kategori secara manual.

**Pertanyaan:** “Apakah `.count()` bisa menggantikan `.sum()` di sini?”

**Jawaban:** `.count()` menghitung nilai yang tidak kosong, sehingga hasil tiap kategori menjadi 3. Yang diminta adalah unit terjual, jadi gunakan `.sum()`.

Semantik pengelompokan dan `as_index` mengacu pada [dokumentasi Pandas groupby](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html).

### Slide 6: Count plot menghitung banyaknya pengamatan

**Notebook:** blok 4. Data contoh ini adalah **21 pesanan**, masing-masing diwakili satu nama kategori.

**Kalimat pengajar:**

> Pada contoh sebelumnya kita menjumlahkan unit dari tabel ringkasan. Sekarang setiap elemen daftar adalah satu pesanan. Kita menghitung berapa kali kategori muncul. Makanan muncul tujuh kali, jadi ada tujuh pesanan Makanan pada contoh ini.

| Kategori | Jumlah pesanan |
|---|---:|
| Makanan | 7 |
| Alat Tulis | 5 |
| Buku | 4 |
| Minuman | 3 |
| Aksesori | 2 |
| **Total** | **21** |

**Perlu dijelaskan:** data pesanan dan data unit penjualan merupakan dua contoh terpisah. Kita tidak memiliki hubungan transaksi yang menghubungkan keduanya, sehingga tidak dapat menghitung rata-rata unit per pesanan dari kedua tabel ini.

**Pertanyaan:** “Tujuh pesanan Makanan berarti tujuh unit Makanan?”

**Jawaban:** belum tentu. Satu pesanan bisa berisi beberapa unit. Contoh ini hanya menyimpan kategori pesanan.

### Slide 7: Kode count plot

Daftar `kategori_pesanan` sudah disediakan pada blok 4. Slide menampilkan daftar itu agar sumber hitungannya terlihat.

```python
frekuensi = pd.Series(kategori_pesanan).value_counts()
print(frekuensi)
ax = frekuensi.plot(kind="bar", color="#F5D36A", figsize=(7, 4))
ax.set_xlabel("Kategori")
ax.set_ylabel("Jumlah pesanan")
plt.xticks(rotation=25, ha="right")
plt.tight_layout()
plt.show()
```

**Penjelasan:** `pd.Series(...)` mengubah daftar menjadi struktur satu kolom. `value_counts()` menghitung kemunculan setiap nilai. Hasilnya berupa Series dengan kategori sebagai label dan frekuensi sebagai nilai. `.plot(kind="bar")` menggambar hasil hitungan tersebut. `ha="right"` meratakan teks label ke kanan setelah diputar.

**Kalimat pengajar:**

> Count plot tetap terlihat seperti bar chart. Perbedaannya terletak pada nilai yang dihitung: frekuensi pengamatan. Bentuk gambar saja belum cukup untuk mengetahui arti angkanya.

**Demo:** minta siswa menghitung tiga kemunculan Minuman pada daftar, lalu periksa hasil `value_counts()`.

### Slide 8: Grouped bar membandingkan beberapa kelompok

**Notebook:** blok 5. Ada beberapa batang untuk setiap kategori karena nilai cabang tetap dipisahkan.

**Kalimat pengajar:**

> Pada bar total, kita menggabungkan cabang. Sekarang kita ingin melihat perbedaannya, jadi nilai Utara, Tengah, dan Selatan tetap berdiri sendiri. Bandingkan ketiga batang Makanan, lalu bacalah legenda untuk mengetahui cabangnya.

**Jawaban acuan:** Makanan: Utara **40**, Tengah **35**, Selatan **44** unit. Alat Tulis: Utara **25**, Tengah **34**, Selatan **28** unit.

**Pertanyaan:** “Apakah cabang dengan Makanan terbanyak juga pasti memiliki Buku terbanyak?”

**Jawaban:** tidak. Makanan terbesar di Selatan, sedangkan Buku terbesar di Utara, sebanyak 32 unit.

### Slide 9: Kode grouped bar

```python
tabel_cabang = penjualan.pivot(
    index="Kategori", columns="Cabang", values="Unit"
)
print(tabel_cabang)
ax = tabel_cabang.plot(kind="bar", figsize=(9, 4))
ax.set_xlabel("Kategori")
ax.set_ylabel("Unit terjual")
ax.legend(title="Cabang")
plt.xticks(rotation=20, ha="right")
plt.tight_layout()
plt.show()
```

**Penjelasan:** `pivot()` menyusun ulang tabel, tanpa menjumlahkan data. `index` menentukan baris, `columns` menentukan kolom, dan `values` menentukan isi sel. Hasilnya lima kategori × tiga cabang. Saat DataFrame digambar sebagai bar, baris menjadi kelompok pada sumbu x dan kolom menjadi seri pada legenda.

Hasil pivot notebook berurutan seperti ini:

| Kategori | Selatan | Tengah | Utara |
|---|---:|---:|---:|
| Aksesori | 25 | 21 | 18 |
| Alat Tulis | 28 | 34 | 25 |
| Buku | 22 | 26 | 32 |
| Makanan | 44 | 35 | 40 |
| Minuman | 31 | 28 | 33 |

**Kalimat pengajar:**

> Saya ingin setiap kategori menjadi satu kelompok batang. Karena itu kategori menjadi baris, cabang menjadi kolom. Cara membaca tabel pivot sama dengan cara membaca grafiknya.

**Demo:** tunjuk sel baris Makanan, kolom Selatan, lalu cari batang yang bernilai 44.

**Catatan warna dan urutan:** slide asli memakai urutan label tertentu. Notebook mengikuti urutan hasil pivot dan urutan daftar warna. Warna biru pada notebook grouped bar mewakili Selatan karena kolom pertama adalah Selatan. Selalu baca legenda, warna bukan identitas cabang yang berlaku otomatis di semua grafik.

**Pertanyaan:** “Apa yang terjadi kalau ada dua baris untuk kombinasi kategori dan cabang yang sama?”

**Jawaban:** `pivot()` tidak bisa memilih satu nilai dan akan memberi error duplikasi. Jika kedua baris perlu dijumlahkan, gunakan `pivot_table(..., aggfunc="sum")`. Lihat latihan akhir.

Perbedaan menyusun ulang data dan agregasi mengacu pada [dokumentasi Pandas pivot](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot.html).

### Slide 10: Practice Tengah, pilihan ekstrakurikuler

**Notebook:** blok 6 adalah data 26 jawaban siswa, blok 7 adalah tempat latihan atau solusi editorial. Satu baris mewakili satu jawaban siswa.

**Instruksi pengajar:** minta siswa membuat frekuensi total, grouped bar per kelas, lalu menyebutkan pilihan terbanyak. Beri petunjuk bentuk data sebelum menunjukkan solusi.

**Kalimat pengajar:**

> Data ini masih berupa jawaban satu per siswa. Untuk pilihan total, hitung frekuensi. Untuk perbandingan kelas, kita membutuhkan tabel yang memperlihatkan jumlah jawaban pada setiap kombinasi kegiatan dan kelas.

**Bagian inti solusi editorial:**

```python
frekuensi_pilihan = pilihan_siswa["Ekstrakurikuler"].value_counts()
pilihan_per_kelas = pd.crosstab(
    pilihan_siswa["Ekstrakurikuler"], pilihan_siswa["Kelas"]
)
frekuensi_pilihan.plot(kind="bar")
plt.show()
pilihan_per_kelas.plot(kind="bar")
plt.show()
pilihan_teratas = frekuensi_pilihan.idxmax()
jumlah_teratas = int(frekuensi_pilihan.max())
print(pilihan_teratas, jumlah_teratas)
```

`crosstab()` membuat tabel frekuensi silang. Argumen pertama menjadi baris, argumen kedua menjadi kolom. `idxmax()` mengambil **label** dengan nilai terbesar, `max()` mengambil **angkanya**, dan `int()` mengubahnya ke integer Python untuk dicetak.

| Kegiatan | X | XI | XII | Total |
|---|---:|---:|---:|---:|
| Sains | 4 | 5 | 2 | **11** |
| Seni | 2 | 3 | 4 | **9** |
| Olahraga | 1 | 2 | 3 | **6** |
| **Jumlah jawaban** | **7** | **10** | **9** | **26** |

**Jawaban akhir:** Sains, 11 siswa.

**Pertanyaan lanjutan:** “Kelas XI punya lima pemilih Sains dan kelas X punya empat. Apakah persentase peminat Sains lebih besar di XI?”

**Jawaban:** tidak. XI `5/10 = 50%`, sedangkan X `4/7 ≈ 57,14%`. Jumlah responden tiap kelas berbeda. Ini pengantar yang baik menuju komposisi relatif.

Semantik tabel frekuensi silang mengacu pada [dokumentasi Pandas crosstab](https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html).

### Slide 11: Stacked bar menunjukkan komposisi

**Notebook:** blok 8. Grafik kiri menunjukkan total unit dan komponennya. Grafik kanan menunjukkan persentase komponen, dengan tinggi setiap batang 100%.

**Kalimat pengajar:**

> Batang kiri menumpuk unit tiap kategori. Tinggi total Selatan adalah 150 unit, Utara 148, Tengah 144. Pada grafik kanan, setiap cabang dinormalisasi menjadi 100 persen sehingga kita membandingkan komposisinya.

**Contoh:** Makanan Utara `40/148 × 100 ≈ 27,03%`. Makanan Selatan `44/150 × 100 ≈ 29,33%`.

**Pertanyaan:** “Kalau semua batang grafik kanan sama tinggi, apakah penjualan cabang sama?”

**Jawaban:** tidak. Tingginya sama karena setiap total dijadikan 100%. Grafik kanan tidak memperlihatkan perbedaan total unit.

**Catatan membaca:** segmen yang berada di tengah tumpukan lebih sulit dibandingkan secara presisi karena posisi awalnya berbeda. Gunakan grouped bar jika fokusnya selisih angka kategori tertentu antar cabang.

### Slide 12: Kode stacked bar dan 100% stacked bar

```python
per_cabang = tabel_cabang.T
total_cabang = per_cabang.sum(axis=1)
persentase = per_cabang.div(total_cabang, axis=0) * 100
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
per_cabang.plot(kind="bar", stacked=True, ax=axes[0])
persentase.plot(kind="bar", stacked=True, ax=axes[1])
axes[0].set_ylabel("Unit terjual")
axes[1].set_ylabel("Bagian dari total cabang (%)")
axes[1].set_ylim(0, 100)
plt.tight_layout()
plt.show()
```

Cuplikan slide memecah rumus dan menempatkan grafik berdampingan. Notebook menggambar dua grafik secara terpisah dengan rumus setara:

```python
persentase = tabel_cabang.T.div(tabel_cabang.T.sum(axis=1), axis=0) * 100
```

**Bagian yang paling perlu dipahami:**

1. `.T` adalah transpose: baris dan kolom bertukar. Tabel lima kategori × tiga cabang menjadi tiga cabang × lima kategori. Cabang sekarang menjadi batang, kategori menjadi segmen.
2. `sum(axis=1)` menjumlahkan **kolom-kolom pada setiap baris**. Hasilnya satu total untuk setiap cabang: Selatan 150, Tengah 144, Utara 148.
3. `div(total_cabang, axis=0)` mencocokkan label Series total dengan **label baris**. Seluruh nilai pada baris Utara dibagi 148.
4. `* 100` mengubah pecahan menjadi persen.
5. `stacked=True` menumpuk seri, `set_ylim(0, 100)` menetapkan rentang sumbu persentase.

`axis=1` pada `sum` memilih arah penjumlahan. `axis=0` pada `div` memilih arah penyelarasan label pembagi. Keduanya melakukan operasi berbeda, jadi jangan menghafalnya sebagai satu aturan “axis selalu berarti ini”.

**Kalimat pengajar:**

> Kita balik tabel supaya satu baris menjadi satu cabang. Lalu hitung total tiap baris. Persentase setiap kategori dihitung terhadap total cabang yang sama, sehingga satu batang berjumlah 100 persen.

**Demo tanpa grafik tambahan:** tampilkan `per_cabang`, `total_cabang`, dan `persentase.round(2)`. Periksa `persentase.sum(axis=1)`, hasil tiap cabang mendekati 100. Pecahan komputer bisa menghasilkan selisih pembulatan yang sangat kecil.

Penyelarasan pembagi berdasarkan label baris mengacu pada [dokumentasi Pandas div](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.div.html).

### Slide 13: Pie chart dan donut chart

**Notebook:** blok 9. Keduanya memakai komposisi cabang Utara, dengan total 148 unit.

**Kalimat pengajar:**

> Satu lingkaran mewakili seluruh penjualan Utara. Irisan Makanan mewakili 40 dari 148 unit, sekitar 27 persen. Donut memakai data yang sama, hanya bagian tengahnya diberi lubang.

| Kategori Utara | Unit | Persentase, satu desimal |
|---|---:|---:|
| Buku | 32 | 21,6% |
| Alat Tulis | 25 | 16,9% |
| Makanan | 40 | 27,0% |
| Minuman | 33 | 22,3% |
| Aksesori | 18 | 12,2% |

**Pertanyaan:** “Apakah donut memberi angka yang berbeda dari pie?”

**Jawaban:** tidak. Keduanya menggambarkan bagian dari total yang sama.

**Cara menyampaikan:** sebutkan total lingkarannya terlebih dulu. Batasi kategori agar label masih terbaca. Untuk membandingkan nilai yang dekat, gunakan bar chart.

### Slide 14: Kode pie chart dan donut chart

```python
utara = tabel_cabang["Utara"]
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
axes[0].pie(utara, labels=utara.index,
            autopct="%1.1f%%", startangle=90)
axes[1].pie(utara, labels=utara.index,
            autopct="%1.1f%%", startangle=90,
            wedgeprops={"width": 0.42})
axes[0].set_title("Pie: cabang Utara")
axes[1].set_title("Donut: cabang Utara")
plt.tight_layout()
plt.show()
```

**Penjelasan:** `["Utara"]` mengambil kolom Utara dari tabel pivot dan menghasilkan Series. `utara.index` berisi nama kategori. `pie()` membagi setiap nilai dengan jumlah semua nilai untuk menentukan besar irisannya. `autopct="%1.1f%%"` menampilkan satu angka di belakang koma dan tanda persen. `startangle=90` memutar titik awal gambar, tanpa mengubah nilai.

`wedgeprops={"width": 0.42}` mengatur tebal cincin donut. Nilai itu merupakan pengaturan bentuk irisan, bukan persentase data. Notebook menambahkan judul yang lebih panjang tetapi memakai parameter inti yang sama.

**Demo:** cetak `utara.sum()`, hasilnya 148. Hitung `utara["Makanan"] / utara.sum() * 100` sebelum menjalankan grafik.

Normalisasi irisan dan parameter label mengacu pada [dokumentasi Matplotlib pie](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pie.html).

### Slide 15: Treemap menampilkan kategori bertingkat

**Kalimat pengajar:**

> Treemap memakai luas kotak untuk menunjukkan unit. Pada slide, kategori menjadi kelompok besar dan cabang menjadi bagian di dalamnya. Kotak Makanan paling luas karena totalnya 119 unit. Di dalam Makanan, Selatan menyumbang 44 unit.

**Cara menyampaikan:** tunjuk kotak besar terlebih dulu, baru kotak anaknya. Pastikan siswa membedakan **luas kotak** dan **warna**.

**Perbedaan yang perlu disampaikan saat beralih ke notebook:**

- Slide memakai hierarki **Kategori → Cabang**, dengan warna membedakan kategori. Slide kode berikut memberi contoh hierarki ini.
- Notebook blok 10 memakai **Semua Penjualan → Cabang → Kategori**, dengan gradasi biru berdasarkan `Unit`.
- Nilai unit sumbernya sama. Susunan kelompok dan arti warnanya berbeda karena argumen `path` dan `color` berbeda.

**Pertanyaan:** “Kalau kotak lebih gelap pada notebook, apakah itu kategori berbeda?”

**Jawaban:** pada notebook, warna ditentukan oleh angka `Unit`. Pada slide, warna membedakan nama kategori. Makna warna harus dibaca dari pengaturan grafiknya.

### Slide 16: Kode treemap

**Contoh mengikuti hierarki slide:**

```python
fig = px.treemap(
    penjualan,
    path=["Kategori", "Cabang"],
    values="Unit",
    color="Kategori",
    title="Unit terjual menurut kategori dan cabang",
)
fig.show()
```

**Kode yang sudah ada pada notebook blok 10:**

```python
fig = px.treemap(
    penjualan,
    path=[px.Constant("Semua Penjualan"), "Cabang", "Kategori"],
    values="Unit",
    color="Unit",
    color_continuous_scale="Blues",
    title="Unit terjual menurut cabang dan kategori",
)
fig.show()
```

**Penjelasan:** `path` dibaca dari induk ke anak. `px.Constant(...)` menambahkan satu akar untuk seluruh data. `values="Unit"` menentukan luas kotak. `color="Kategori"` memberi warna kategori, sedangkan `color="Unit"` memakai skala angka. `color_continuous_scale="Blues"` memilih palet gradasi biru. `fig.show()` milik objek Plotly, berbeda dari `plt.show()` pada Matplotlib.

**Kalimat pengajar:**

> Hierarki adalah keputusan analisis. Jika kita ingin menelusuri kategori lalu cabang, urutannya Kategori, Cabang. Jika pertanyaannya komposisi tiap cabang, kita dapat menaruh Cabang lebih dulu, seperti notebook.

**Demo:** jalankan kode notebook dan gunakan hover untuk melihat label serta unit. Jika mencoba varian slide, ganti `path` dan `color` bersama, lalu jelaskan dua perubahan itu. Tata letak dan palet persisnya dapat berbeda dari gambar PowerPoint.

Penggunaan `path`, `values`, dan warna mengacu pada [dokumentasi Plotly treemap](https://plotly.com/python/treemaps/).

### Slide 17: Radar chart membandingkan profil beberapa kelompok

**Notebook:** blok 11. Dua cabang yang dibandingkan adalah Utara dan Tengah. Semua sumbu menggunakan **persentase**, dengan kategori yang sama untuk kedua cabang.

**Kalimat pengajar:**

> Setiap arah adalah satu kategori. Semakin jauh titik dari pusat, semakin besar persentase kategori itu pada cabangnya. Radar membantu melihat profil. Utara memiliki persentase Buku sekitar 21,62 persen, Tengah sekitar 18,06 persen.

**Contoh kedua:** Alat Tulis Utara sekitar **16,89%**, Tengah **23,61%**.

**Pertanyaan:** “Apakah bentuk yang terlihat lebih luas berarti total penjualan lebih besar?”

**Jawaban:** tidak. Grafik ini memakai persentase dan bentuknya dipengaruhi urutan kategori. Untuk membandingkan total unit, lihat data total atau bar chart.

**Cara menyampaikan:** baca satu sumbu untuk dua cabang, baru lihat pola keseluruhan. Jangan menyimpulkan salah satu cabang “lebih baik” tanpa ukuran tujuan yang jelas.

### Slide 18: Kode radar chart

```python
pangsa = tabel_cabang.T.div(tabel_cabang.T.sum(axis=1), axis=0) * 100
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
ax.legend()
plt.tight_layout()
plt.show()
```

**Baca dalam tiga langkah:**

1. **Siapkan nilai:** hitung persentase dan ambil nama kategori dalam urutan kolom. `pangsa.loc[cabang]` memilih baris berdasarkan nama cabang.
2. **Siapkan sudut:** satu lingkaran adalah `2 * np.pi` radian. Lima kategori mendapat lima sudut berjarak sama. `endpoint=False` tidak memasukkan sudut akhir 2π yang sama arahnya dengan 0.
3. **Gambar dan tutup:** tambahkan sudut pertama dan nilai pertama di akhir daftar. Titik terakhir tersambung kembali ke titik pertama.

`.tolist()` menghasilkan list Python. Karena itu `sudut + sudut[:1]` menyambung daftar, bukan menjumlahkan sudut satu per satu. `[:1]` mengambil daftar berisi elemen pertama. Array NumPy memakai perilaku penambahan berbeda.

`subplot_kw={"polar": True}` memakai bidang koordinat sudut dan radius. `ax.plot()` menggambar garis, `ax.fill(..., alpha=0.12)` mengisi area transparan, dan `set_xticklabels()` memberi nama kategori pada arah sudut. Rentang `0–40` berarti 0–40 persen untuk data contoh ini. Jika data baru melewati 40%, batasnya harus disesuaikan supaya titik tidak terpotong.

**Kalimat pengajar:**

> Kita menggunakan dua daftar dengan panjang yang sama: daftar sudut dan daftar nilai. Setelah titik awal ditambahkan di akhir keduanya, garis dapat menutup menjadi profil radar.

**Demo tanpa grafik tambahan:** cetak `kategori`, `len(sudut)`, dan `len(sudut_tutup)`, hasilnya lima kategori, lima sudut, dan enam titik penutup. Seluruh cabang harus memakai urutan kategori yang sama. Urutan dan posisi awal pada notebook dapat berbeda dari slide.

Pengaturan titik akhir mengacu pada [dokumentasi NumPy linspace](https://numpy.org/doc/stable/reference/generated/numpy.linspace.html).

### Slide 19: Practice Akhir, komposisi penjualan bazar

**Notebook:** blok 12 menyiapkan 24 baris data, blok 13 adalah latihan atau solusi editorial. Satu baris merangkum satu produk pada satu stan. Setiap kelompok memiliki dua produk.

**Kalimat pengajar:**

> Kita memakai data baru agar pemilihan grafiknya benar-benar dipahami. Sekarang ada stan, kelompok, produk, dan unit. Sebelum membuat grafik, tentukan level detail yang dibutuhkan. Untuk membandingkan kelompok per stan, dua produk dalam kelompok yang sama harus dijumlahkan.

**Urutan membimbing:** susun tabel kelompok per stan, periksa hasilnya, buat grouped bar dan dua stacked bar, ambil satu stan untuk pie/donut, ringkas produk untuk treemap, lalu bandingkan dua profil persentase dengan radar.

**Inti pengolahan dalam editorial:**

```python
total_per_kelompok = bazar.groupby("Kelompok")["Unit"].sum()
tabel_bazar = bazar.pivot_table(
    index="Stan", columns="Kelompok", values="Unit", aggfunc="sum"
)
persen_bazar = tabel_bazar.div(tabel_bazar.sum(axis=1), axis=0) * 100
unit_aula = tabel_bazar.loc["Aula"]
rincian_produk = bazar.groupby(
    ["Kelompok", "Produk"], as_index=False
)["Unit"].sum()
```

**Mengapa `pivot_table`, bukan `pivot`:** Aula + Buku memiliki baris Komik dan Ensiklopedia. Kedua nilai harus digabung menjadi `18 + 12 = 30`. `aggfunc="sum"` menentukan penggabungan tersebut. Default agregasi `pivot_table` adalah rata-rata, jadi menghilangkan `aggfunc="sum"` menghasilkan jawaban berbeda.

| Stan | Alat Tulis | Buku | Makanan | Minuman | Total |
|---|---:|---:|---:|---:|---:|
| Aula | 26 | 30 | 32 | 30 | **118** |
| Lapangan | 30 | 30 | 39 | 36 | **135** |
| Taman | 34 | 22 | 30 | 30 | **116** |
| **Total** | **90** | **82** | **101** | **96** | **369** |

**Bagian menggambar pada blok 13:**

- `tabel_bazar.T.plot(kind="bar")`: baris menjadi kelompok produk dan seri menjadi stan.
- `tabel_bazar.plot(kind="bar", stacked=True)`: batang adalah stan, segmen adalah kelompok produk.
- `persen_bazar.plot(kind="bar", stacked=True)`: bentuk yang sama dengan angka persentase.
- `tabel_bazar.loc["Aula"]`: ambil **baris** Aula untuk pie dan donut. Pada data festival, `tabel_cabang["Utara"]` mengambil **kolom** Utara. Pilihan sintaks mengikuti posisi label pada tabel.
- `groupby(["Kelompok", "Produk"])`: jumlahkan produk yang sama dari semua stan. Treemap memakai hierarki Semua Produk → Kelompok → Produk. Grafik ini tidak lagi memisahkan stan.
- Radar mengulang pola blok 11 menggunakan `persen_bazar`, empat kelompok, dan stan Aula serta Taman. Setelah titik penutup, ada lima titik per profil.
- `total_per_kelompok.idxmax()` memberi nama Makanan, `max()` memberi 101.

**Kunci angka komposisi:**

| Stan | Alat Tulis | Buku | Makanan | Minuman |
|---|---:|---:|---:|---:|
| Aula | 22,03% | 25,42% | 27,12% | 25,42% |
| Lapangan | 22,22% | 22,22% | 28,89% | 26,67% |
| Taman | 29,31% | 18,97% | 25,86% | 25,86% |

Persentase yang sudah dibulatkan mungkin tidak tepat berjumlah 100 pada tampilan. Periksa jumlah menggunakan nilai asli.

**Kunci treemap produk:** Komik 46, Ensiklopedia 36, Pensil 49, Buku Catatan 41, Roti 61, Kue 40, Air Mineral 48, dan Jus 48 unit.

**Jawaban kesimpulan:** Makanan memiliki total tertinggi, **101 unit**. Lapangan memiliki total stan tertinggi, **135 unit**. Data unit belum cukup untuk menentukan stan dengan laba terbesar.

**Pertanyaan pemahaman:** “Mengapa pie Aula membagi nilai Makanan dengan 118, bukan 369?”

**Jawaban:** lingkaran tersebut mewakili total Aula. Angka 369 adalah total semua stan, yang menjawab pertanyaan lain.

Agregasi dan default rata-rata mengacu pada [dokumentasi Pandas pivot_table](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pivot_table.html).

### Slide 20: Ringkasan pemilihan grafik

**Kalimat pengajar:**

> Kita sudah mencoba beberapa grafik. Saat menerima data baru, jangan mulai dari nama grafik. Tulis pertanyaannya, tentukan satuan dan bentuk datanya, lalu pilih tampilan yang memudahkan membaca jawaban.

**Cara menyampaikan:** minta siswa menyebutkan grafik dan alasan untuk tiga kasus: total unit tiap kategori, jumlah pilihan siswa tiap kelas, dan komposisi relatif antar stan.

**Jawaban acuan:** bar untuk total kategori, grouped bar dari crosstab untuk pilihan per kelas, dan 100% stacked bar untuk komposisi relatif.

**Pesan terakhir tentang grafik:** pastikan label, legenda, dan satuan jelas. Gunakan nilai tabel untuk memeriksa kesimpulan angka yang presisi.

### Slide 21: Cek pemahaman

Gunakan pertanyaan pada slide sebagai penutup. Minta alasan pemilihan grafik dan pengolahan data yang diperlukan, bukan hanya nama grafik.

| Pertanyaan slide | Jawaban dan alasan |
|---|---|
| Kategori minuman mana yang paling banyak dibeli? | Bar dari total unit per kategori jika “dibeli” berarti unit. Jika maksudnya jumlah pesanan, hitung frekuensi pesanan terlebih dulu. Dataset festival hanya memiliki satu kategori bernama Minuman dan tidak memisahkan jenis minuman. |
| Bagaimana pilihan kegiatan berbeda antar kelas? | Grouped bar dari crosstab kegiatan × kelas. Bandingkan proporsi jika ukuran kelas berbeda. |
| Bagaimana bagian produk membentuk total pada satu stan? | Pie/donut untuk komposisi satu stan dengan sedikit kategori, atau stacked bar untuk komponen yang ditumpuk. |
| Produk mana saja yang membentuk kelompok bertingkat? | Treemap dengan path Kelompok → Produk dan values Unit. |

**Kalimat penutup:**

> Sebutkan dulu apa yang dihitung: unit, pesanan, siswa, atau persen. Setelah itu, jelaskan mengapa grafik pilihan kalian membantu menjawab pertanyaannya.

## Catatan cepat saat mendampingi siswa

| Gejala | Penyebab yang mungkin | Langkah pengajar |
|---|---|---|
| `NameError: penjualan/tabel_cabang is not defined` | Cell prasyarat belum dijalankan atau runtime direset | Jalankan import dan data, lalu cell pembentuk tabel secara berurutan |
| Pivot memberi error duplikasi | Lebih dari satu baris untuk pasangan baris–kolom | Periksa makna baris dan gunakan `pivot_table(..., aggfunc="sum")` jika perlu menjumlahkan |
| Total terlalu kecil pada bazar | `pivot_table` memakai default rata-rata | Tambahkan `aggfunc="sum"`, periksa Aula + Buku = 30 |
| Setiap kategori menghasilkan angka 3 | Menghitung baris festival, bukan menjumlahkan unit | Gunakan `["Unit"].sum()` |
| Batang terpisah padahal ingin komposisi | `stacked=True` belum dipakai | Pastikan bentuk tabel juga sesuai: satu baris per cabang/stan |
| Persentase tidak mendekati 100 per cabang | Total pembagi atau penyelarasan label salah | Cetak tabel, total baris, lalu hasil `.div(..., axis=0)` |
| Warna atau urutan berbeda dari slide | Urutan kolom pivot dan daftar warna berbeda | Baca legenda dan label, periksa nilai numeriknya |
| `KeyError` saat mengambil cabang/stan | Mengambil baris dengan sintaks kolom atau salah label | Cetak `.index` dan `.columns`, pilih `.loc[...]` untuk baris |
| Radar tidak menutup atau jumlah titik berbeda | Titik pertama ditambahkan pada satu daftar saja | Tambahkan titik pertama pada sudut dan nilai |
| Radar berubah bentuk setelah kategori diurutkan | Posisi sumbu berubah | Pakai urutan kategori yang sama untuk seluruh profil |
| Treemap kosong pada tampilan notebook | Cell belum berjalan atau renderer tidak tampil | Jalankan cell Plotly di Colab, periksa error dan tabel sumbernya |

### Cara menjawab kalau lupa sintaks saat kelas

> Saya periksa bentuk tabelnya dulu. Yang kita perlukan adalah satu total per kategori, jadi langkahnya mengelompokkan kategori lalu menjumlahkan Unit. Setelah hasilnya benar, baru kita cocokkan sintaks grafiknya.

Cara ini menunjukkan proses berpikir yang dapat ditiru siswa. Anda boleh melihat notebook editorial untuk detail API sambil tetap menjelaskan tujuan setiap langkah.

## Pemeriksaan panduan

Hasil angka dalam panduan diperiksa dengan menjalankan seluruh 13 blok kode notebook editorial. Kode pada slide juga diperiksa terhadap data sumber. Pemeriksaan Plotly memeriksa pembentukan objek grafik, tanpa menguji seluruh interaksi hover di Colab. Deck dirender untuk pemeriksaan tampilan. Notebook sumber dan deck asli dipertahankan.
