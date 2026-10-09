from __future__ import annotations

from pathlib import Path
import copy
import nbformat as nbf


OUT = Path("/Users/daf2a/Documents/python/level-03")
OUT.mkdir(parents=True, exist_ok=True)


def md(text: str, cell_id: str | None = None):
    cell = nbf.v4.new_markdown_cell(text)
    if cell_id:
        cell["id"] = cell_id
    return cell


def code(text: str, cell_id: str | None = None, tags=None):
    cell = nbf.v4.new_code_cell(text)
    if cell_id:
        cell["id"] = cell_id
    if tags:
        cell.metadata["tags"] = tags
    return cell


def common_metadata(filename: str, role: str):
    return {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3"},
        "colab": {"name": filename, "provenance": []},
        "course": {"language": "id", "level": 3, "role": role},
    }


def notebook(session: dict, solution: bool):
    filename = session["filename"] + ("_solution.ipynb" if solution else ".ipynb")
    role = "instructor" if solution else "student"
    cells = []
    cells.append(md(f"# {session['title']}\n\n{session['intro']}"))
    if solution:
        cells[0].source += "\n\n**Versi Solusi**"
    for item in session["setup"]:
        cells.append(md(item["text"]) if item["kind"] == "markdown" else code(item["text"]))

    practice_ids = set()
    for section in session["sections"]:
        for item in section:
            if item["kind"] == "markdown":
                cells.append(md(item["text"], item.get("id")))
            elif item["kind"] == "code":
                cells.append(code(item["text"], item.get("id")))
            elif item["kind"] == "practice":
                cells.append(md(item["intro"], item["id"] + "_brief"))
                practice_ids.add(item["id"])
                if solution:
                    cells.append(code(item["answer"], item["id"], tags=["solution", "practice-answer"]))
                else:
                    cells.append(code("# Tulis jawabanmu di sini.", item["id"], tags=["practice-answer"]))

    for index, cell in enumerate(cells):
        if not cell.get("id", "").startswith("practice_"):
            cell["id"] = f"cell-{index:03d}"
    nb = nbf.v4.new_notebook(cells=cells, metadata=common_metadata(filename, role))
    nb.metadata["course"]["practice_cell_ids"] = sorted(practice_ids)
    return nb


def build_sessions():
    setup = [
        {"kind": "markdown", "text": "## Persiapan\n\nNotebook ini memakai pandas, Matplotlib, dan Plotly. Data yang dipakai adalah contoh buatan untuk latihan membaca pola."},
        {"kind": "code", "text": "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport plotly.express as px\n\ndef kde_gaussian(values, grid):\n    values = np.asarray(values, dtype=float)\n    bandwidth = 1.06 * values.std(ddof=1) * len(values) ** (-1 / 5)\n    z = (np.asarray(grid)[:, None] - values[None, :]) / bandwidth\n    return np.exp(-0.5 * z ** 2).sum(axis=1) / (len(values) * bandwidth * np.sqrt(2 * np.pi))\n\nplt.style.use('seaborn-v0_8-whitegrid')\npd.set_option('display.max_columns', 20)\npd.set_option('display.width', 100)"},
    ]

    s2 = {
        "filename": "visualisasi_tren_perubahan",
        "title": "Visualisasi Data: Tren dan Perubahan",
        "intro": "Kita akan memilih grafik untuk data yang memiliki urutan waktu, membandingkan tren beberapa kelompok, dan menunjukkan perubahan bertahap.",
        "setup": setup,
        "sections": [
            [
                {"kind": "markdown", "text": "## Membaca data berurutan waktu\n\nSatu baris mewakili satu cabang pada satu bulan. Urutan bulan perlu dibuat eksplisit sebelum menggambar garis."},
                {"kind": "code", "text": "bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']\npenjualan = pd.DataFrame({\n    'Bulan': bulan,\n    'Utara': [42, 47, 45, 56, 62, 60],\n    'Tengah': [35, 39, 44, 43, 51, 57],\n    'Selatan': [28, 33, 31, 40, 44, 49],\n})\npenjualan"},
                {"kind": "markdown", "text": "### Line chart menampilkan perubahan satu nilai sepanjang waktu\n\nPakai line chart saat urutan waktu penting dan fokusnya satu seri."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(8, 4))\nax.plot(penjualan['Bulan'], penjualan['Utara'], marker='o', color='#196B9B')\nax.set(title='Penjualan Cabang Utara', xlabel='Bulan', ylabel='Unit terjual')\nplt.show()"},
                {"kind": "markdown", "text": "### Multi-line membandingkan tren beberapa kelompok\n\nGunakan warna dan legenda untuk membedakan seri. Terlalu banyak garis membuat pola sulit dibaca."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(8, 4))\nfor cabang, warna in zip(['Utara', 'Tengah', 'Selatan'], ['#196B9B', '#D99A37', '#55B77A']):\n    ax.plot(penjualan['Bulan'], penjualan[cabang], marker='o', label=cabang, color=warna)\nax.set(title='Tren Penjualan per Cabang', xlabel='Bulan', ylabel='Unit terjual')\nax.legend(title='Cabang')\nplt.show()"},
                {"kind": "practice", "id": "practice_tengah_tren", "intro": "## Practice Tengah: kunjungan perpustakaan\n\nSetiap baris adalah jumlah kunjungan mingguan. Buat line chart untuk Cabang Barat, lalu multi-line untuk membandingkan tiga cabang. Urutkan minggu dan tulis satu pengamatan yang didukung grafik.", "answer": "kunjungan = pd.DataFrame({\n    'Minggu': [1, 2, 3, 4, 5, 6, 7, 8],\n    'Barat': [120, 132, 128, 150, 164, 159, 181, 190],\n    'Timur': [98, 105, 111, 109, 122, 136, 132, 148],\n    'Pusat': [150, 145, 158, 166, 171, 180, 176, 195],\n})\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(kunjungan['Minggu'], kunjungan['Barat'], marker='o', color='#196B9B')\nax.set(title='Kunjungan Cabang Barat', xlabel='Minggu', ylabel='Kunjungan')\nplt.show()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nfor cabang, warna in zip(['Barat', 'Timur', 'Pusat'], ['#196B9B', '#D99A37', '#55B77A']):\n    ax.plot(kunjungan['Minggu'], kunjungan[cabang], marker='o', label=cabang, color=warna)\nax.set(title='Perbandingan Kunjungan Mingguan', xlabel='Minggu', ylabel='Kunjungan')\nax.legend(title='Cabang')\nplt.show()\nprint('Cabang Barat meningkat dari 120 menjadi 190 kunjungan. Cabang Pusat memiliki kunjungan tertinggi pada minggu ke-8.')"},
            ],
            [
                {"kind": "markdown", "text": "## Area chart menunjukkan besar nilai sepanjang waktu\n\nArea memberi penekanan visual pada besaran. Untuk satu seri, area membantu melihat perubahan total dari waktu ke waktu."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(8, 4))\nax.fill_between(penjualan['Bulan'], penjualan['Utara'], color='#4FB6E8', alpha=0.45)\nax.plot(penjualan['Bulan'], penjualan['Utara'], marker='o', color='#196B9B')\nax.set(title='Area Penjualan Cabang Utara', xlabel='Bulan', ylabel='Unit terjual')\nplt.show()"},
                {"kind": "markdown", "text": "### Stacked area menunjukkan total dan kontribusi seri\n\nSetiap lapisan menambah nilai ke total. Cocok ketika kelompok tidak negatif dan penjumlahan antarkelompok bermakna."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(8, 4))\nax.stackplot(penjualan['Bulan'], penjualan['Utara'], penjualan['Tengah'], penjualan['Selatan'], labels=['Utara', 'Tengah', 'Selatan'], colors=['#4FB6E8', '#F5D36A', '#55B77A'], alpha=0.9)\nax.set(title='Kontribusi Penjualan per Cabang', xlabel='Bulan', ylabel='Total unit terjual')\nax.legend(loc='upper left', ncol=3)\nplt.show()"},
                {"kind": "markdown", "text": "### Waterfall merangkai kenaikan dan penurunan menuju total\n\nBatang menunjukkan kontribusi positif atau negatif secara bertahap. Grafik ini cocok untuk menjelaskan bagaimana saldo awal berubah menjadi saldo akhir."},
                {"kind": "code", "text": "perubahan = pd.Series([120, -35, -20, 18, 12], index=['Saldo awal', 'Pembelian', 'Biaya', 'Pengembalian', 'Penyesuaian'])\nawal = perubahan.iloc[0]\nberjalan = awal\nfig, ax = plt.subplots(figsize=(9, 4))\nax.bar(0, awal, color='#196B9B')\nfor posisi, nilai in enumerate(perubahan.iloc[1:], start=1):\n    bawah = berjalan if nilai >= 0 else berjalan + nilai\n    ax.bar(posisi, abs(nilai), bottom=bawah, color='#55B77A' if nilai >= 0 else '#D99A37')\n    berjalan += nilai\nax.bar(len(perubahan), berjalan, color='#196B9B')\nax.set_xticks(range(len(perubahan) + 1), list(perubahan.index) + ['Saldo akhir'], rotation=20)\nax.set(title='Perubahan Saldo Kas', ylabel='Rupiah (ribu)')\nplt.show()\nprint(f'Saldo akhir: Rp{berjalan:.0f} ribu')"},
                {"kind": "practice", "id": "practice_akhir_tren", "intro": "## Practice Akhir: pendaftaran dan saldo acara\n\nTabel pertama berisi peserta baru per bulan dan kanal. Buat area untuk total pendaftaran dan stacked area untuk kontribusi tiap kanal. Tabel kedua berisi saldo awal dan perubahan kas. Buat waterfall yang menunjukkan saldo akhir. Beri judul, label sumbu, legenda, dan satu interpretasi.", "answer": "pendaftaran = pd.DataFrame({\n    'Bulan': ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],\n    'Web': [32, 38, 42, 55, 61, 66],\n    'Sekolah': [24, 29, 31, 35, 41, 45],\n    'Komunitas': [18, 20, 26, 28, 34, 37],\n})\nfig, ax = plt.subplots(figsize=(8, 4))\nax.fill_between(pendaftaran['Bulan'], pendaftaran[['Web', 'Sekolah', 'Komunitas']].sum(axis=1), color='#4FB6E8', alpha=0.45)\nax.plot(pendaftaran['Bulan'], pendaftaran[['Web', 'Sekolah', 'Komunitas']].sum(axis=1), marker='o', color='#196B9B')\nax.set(title='Total Peserta Baru', xlabel='Bulan', ylabel='Peserta')\nplt.show()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.stackplot(pendaftaran['Bulan'], pendaftaran['Web'], pendaftaran['Sekolah'], pendaftaran['Komunitas'], labels=['Web', 'Sekolah', 'Komunitas'], colors=['#4FB6E8', '#F5D36A', '#55B77A'])\nax.set(title='Peserta Baru per Kanal', xlabel='Bulan', ylabel='Peserta')\nax.legend(loc='upper left', ncol=3)\nplt.show()\n\nperubahan_acara = pd.Series([500, -120, -80, 60, -45], index=['Saldo awal', 'Sewa tempat', 'Konsumsi', 'Sponsor', 'Perlengkapan'])\nberjalan = perubahan_acara.iloc[0]\nfig, ax = plt.subplots(figsize=(9, 4))\nax.bar(0, berjalan, color='#196B9B')\nfor posisi, nilai in enumerate(perubahan_acara.iloc[1:], start=1):\n    ax.bar(posisi, abs(nilai), bottom=berjalan if nilai >= 0 else berjalan + nilai, color='#55B77A' if nilai >= 0 else '#D99A37')\n    berjalan += nilai\nax.bar(len(perubahan_acara), berjalan, color='#196B9B')\nax.set_xticks(range(len(perubahan_acara) + 1), list(perubahan_acara.index) + ['Saldo akhir'], rotation=20)\nax.set(title='Perubahan Saldo Acara', ylabel='Rupiah (ribu)')\nplt.show()\nprint(f'Saldo akhir acara adalah Rp{berjalan:.0f} ribu. Total peserta baru bertambah dari 74 pada Januari menjadi 148 pada Juni.')"},
            ],
        ],
    }

    s3 = {
        "filename": "visualisasi_distribusi",
        "title": "Visualisasi Data: Distribusi",
        "intro": "Kita akan membaca bentuk sebaran nilai, membandingkan kelompok, dan memilih grafik yang menunjukkan frekuensi, kepadatan, serta ringkasan distribusi.",
        "setup": setup,
        "sections": [
            [
                {"kind": "markdown", "text": "## Mengenali bentuk distribusi\n\nSatu baris mewakili satu peserta dan satu nilai ujian. Data contoh sengaja memuat beberapa nilai rendah dan sebagian besar nilai di rentang menengah sampai tinggi."},
                {"kind": "code", "text": "nilai = pd.Series([52, 58, 61, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 82, 86], name='Nilai')\nprint(nilai.describe().round(1))"},
                {"kind": "markdown", "text": "### Histogram mengelompokkan nilai ke dalam bins\n\nTinggi batang menunjukkan frekuensi pada rentang nilai. Lebar dan jumlah bins memengaruhi detail pola yang terlihat."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(8, 4))\nax.hist(nilai, bins=6, color='#4FB6E8', edgecolor='white')\nax.set(title='Distribusi Nilai Ujian', xlabel='Nilai', ylabel='Jumlah peserta')\nplt.show()"},
                {"kind": "markdown", "text": "### KDE memperhalus frekuensi menjadi kurva kepadatan\n\nKDE adalah estimasi kepadatan kernel. Kurva yang lebih tinggi menandakan area nilai yang relatif lebih padat, bukan jumlah peserta langsung."},
                {"kind": "code", "text": "rentang = np.linspace(nilai.min() - 5, nilai.max() + 5, 250)\nkepadatan = kde_gaussian(nilai, rentang)\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(rentang, kepadatan, color='#196B9B', linewidth=2.5)\nax.fill_between(rentang, kepadatan, color='#4FB6E8', alpha=0.25)\nax.set(title='Kepadatan Nilai Ujian', xlabel='Nilai', ylabel='Kepadatan')\nplt.show()"},
                {"kind": "practice", "id": "practice_tengah_distribusi", "intro": "## Practice Tengah: waktu menyelesaikan kuis\n\nSetiap angka adalah waktu peserta dalam menit. Buat dua histogram dengan jumlah bins berbeda dan satu KDE. Bandingkan informasi yang ditonjolkan histogram dan kurva KDE. Jangan menghapus nilai ekstrem tanpa alasan.", "answer": "waktu = pd.Series([8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 17, 18, 21, 25], name='Menit')\nfig, axes = plt.subplots(1, 2, figsize=(11, 4), sharey=True)\nfor ax, jumlah_bins in zip(axes, [5, 10]):\n    ax.hist(waktu, bins=jumlah_bins, color='#4FB6E8', edgecolor='white')\n    ax.set(title=f'{jumlah_bins} bins', xlabel='Waktu (menit)', ylabel='Peserta')\nplt.tight_layout()\nplt.show()\n\nrentang_waktu = np.linspace(waktu.min() - 3, waktu.max() + 3, 250)\nkepadatan_waktu = kde_gaussian(waktu, rentang_waktu)\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(rentang_waktu, kepadatan_waktu, color='#196B9B', linewidth=2.5)\nax.fill_between(rentang_waktu, kepadatan_waktu, color='#4FB6E8', alpha=0.25)\nax.set(title='KDE Waktu Kuis', xlabel='Waktu (menit)', ylabel='Kepadatan')\nplt.show()\nprint('Histogram memperlihatkan hitungan per rentang dan bentuknya berubah saat jumlah bins berubah. KDE memberi ringkasan bentuk yang lebih halus. Beberapa peserta menyelesaikan kuis lebih lama dari mayoritas.')"},
            ],
            [
                {"kind": "markdown", "text": "## Box plot merangkum median, kuartil, dan pencilan\n\nBox menunjukkan kuartil pertama sampai ketiga, garis di dalamnya adalah median, dan whisker merangkum rentang sesuai aturan plot. Titik di luar whisker ditandai sebagai calon pencilan."},
                {"kind": "code", "text": "kelas_a = [62, 66, 68, 70, 71, 73, 74, 76, 81, 92]\nkelas_b = [55, 60, 64, 67, 70, 74, 78, 82, 86, 89]\nfig, ax = plt.subplots(figsize=(7, 4))\nax.boxplot([kelas_a, kelas_b], tick_labels=['Kelas A', 'Kelas B'], patch_artist=True, boxprops={'facecolor': '#EAF6FC'})\nax.set(title='Ringkasan Nilai per Kelas', ylabel='Nilai')\nplt.show()"},
                {"kind": "markdown", "text": "### Violin plot menggabungkan ringkasan kelompok dan bentuk kepadatan\n\nLebar violin menunjukkan kepadatan relatif nilai. Median dan kuartil membantu membaca pusat dan sebaran di dalam bentuk tersebut."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(7, 4))\nax.violinplot([kelas_a, kelas_b], showmedians=True, showextrema=True)\nax.set_xticks([1, 2], ['Kelas A', 'Kelas B'])\nax.set(title='Bentuk Distribusi Nilai per Kelas', ylabel='Nilai')\nplt.show()"},
                {"kind": "markdown", "text": "### Memilih grafik distribusi\n\nHistogram cocok untuk membaca frekuensi. KDE menonjolkan bentuk yang halus. Box plot meringkas pusat dan sebaran beberapa kelompok. Violin plot menambahkan bentuk kepadatan, tetapi perlu dijelaskan agar lebarnya tidak disalahartikan sebagai jumlah data."},
                {"kind": "practice", "id": "practice_akhir_distribusi", "intro": "## Practice Akhir: nilai tiga kelas\n\nSetiap angka adalah nilai siswa. Buat histogram total, KDE total, box plot per kelas, dan violin plot per kelas. Bandingkan median dan rentang sebaran. Periksa nilai ekstrem sebelum menyimpulkan adanya pencilan.", "answer": "nilai_kelas = {\n    'Merah': [54, 60, 63, 65, 67, 68, 70, 73, 78, 90],\n    'Biru': [61, 64, 66, 68, 69, 70, 71, 72, 75, 77],\n    'Hijau': [48, 55, 59, 62, 64, 67, 69, 72, 80, 94],\n}\nsemua_nilai = np.concatenate(list(nilai_kelas.values()))\nfig, ax = plt.subplots(figsize=(8, 4))\nax.hist(semua_nilai, bins=8, color='#4FB6E8', edgecolor='white')\nax.set(title='Distribusi Nilai Tiga Kelas', xlabel='Nilai', ylabel='Jumlah siswa')\nplt.show()\n\nrentang_semua = np.linspace(semua_nilai.min() - 5, semua_nilai.max() + 5, 250)\nkepadatan_semua = kde_gaussian(semua_nilai, rentang_semua)\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(rentang_semua, kepadatan_semua, color='#196B9B', linewidth=2.5)\nax.fill_between(rentang_semua, kepadatan_semua, color='#4FB6E8', alpha=0.25)\nax.set(title='KDE Nilai Tiga Kelas', xlabel='Nilai', ylabel='Kepadatan')\nplt.show()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.boxplot(list(nilai_kelas.values()), tick_labels=list(nilai_kelas.keys()), patch_artist=True, boxprops={'facecolor': '#EAF6FC'})\nax.set(title='Box Plot Nilai per Kelas', ylabel='Nilai')\nplt.show()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.violinplot(list(nilai_kelas.values()), showmedians=True, showextrema=True)\nax.set_xticks([1, 2, 3], list(nilai_kelas.keys()))\nax.set(title='Violin Plot Nilai per Kelas', ylabel='Nilai')\nplt.show()\nringkasan = pd.DataFrame({kelas: pd.Series(skor).describe() for kelas, skor in nilai_kelas.items()}).loc[['50%', 'min', 'max']].T\nprint(ringkasan.rename(columns={'50%': 'Median'}).round(1))\nprint('Median ketiga kelas berdekatan. Kelas Hijau memiliki rentang terluas, tetapi nilai ekstrem perlu diperiksa dalam konteks sebelum diberi label pencilan.')"},
            ],
        ],
    }

    s4 = {
        "filename": "visualisasi_hubungan_pola_lokasi",
        "title": "Visualisasi Data: Hubungan, Pola, dan Lokasi",
        "intro": "Kita akan memilih grafik untuk melihat hubungan dua variabel, pola pada matriks, serta sebaran nilai menurut lokasi.",
        "setup": setup,
        "sections": [
            [
                {"kind": "markdown", "text": "## Membaca hubungan dua variabel\n\nSatu baris mewakili satu peserta. Jam belajar, kehadiran, dan nilai adalah angka contoh, bukan data siswa nyata."},
                {"kind": "code", "text": "peserta = pd.DataFrame({\n    'JamBelajar': [1, 2, 2, 3, 3, 4, 4, 5, 5, 6],\n    'Kehadiran': [62, 75, 82, 68, 90, 78, 88, 84, 96, 91],\n    'Nilai': [55, 60, 64, 67, 70, 72, 78, 79, 88, 91],\n})\npeserta"},
                {"kind": "markdown", "text": "### Scatter plot membandingkan dua variabel numerik\n\nSetiap titik mewakili satu pengamatan. Perhatikan arah, bentuk, kelompok, dan titik yang jauh dari pola umum."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(7, 4))\nax.scatter(peserta['JamBelajar'], peserta['Nilai'], color='#196B9B', alpha=0.8)\nax.set(title='Jam Belajar dan Nilai', xlabel='Jam belajar', ylabel='Nilai')\nplt.show()"},
                {"kind": "markdown", "text": "### Bubble chart menambahkan variabel melalui ukuran titik\n\nPosisi menunjukkan dua nilai. Ukuran gelembung mewakili variabel ketiga. Skala ukuran perlu dibatasi agar perbedaan tetap terbaca."},
                {"kind": "code", "text": "fig, ax = plt.subplots(figsize=(7, 4))\nukuran = peserta['Kehadiran'] * 5\nscatter = ax.scatter(peserta['JamBelajar'], peserta['Nilai'], s=ukuran, c=peserta['Kehadiran'], cmap='Blues', alpha=0.6, edgecolor='white')\nfig.colorbar(scatter, ax=ax, label='Kehadiran (%)')\nax.set(title='Jam Belajar, Nilai, dan Kehadiran', xlabel='Jam belajar', ylabel='Nilai')\nplt.show()"},
                {"kind": "practice", "id": "practice_tengah_hubungan", "intro": "## Practice Tengah: durasi latihan dan skor\n\nSetiap baris adalah satu peserta. Buat scatter plot untuk durasi dan skor, lalu bubble chart dengan variabel ukuran yang mewakili jumlah latihan. Tambahkan label dan tulis hubungan yang tampak tanpa menyimpulkan sebab-akibat.", "answer": "latihan = pd.DataFrame({\n    'DurasiMenit': [15, 20, 22, 28, 30, 35, 38, 42, 48, 55],\n    'JumlahLatihan': [2, 3, 4, 3, 5, 5, 6, 7, 6, 8],\n    'Skor': [50, 55, 59, 62, 66, 69, 73, 78, 80, 88],\n})\nfig, ax = plt.subplots(figsize=(7, 4))\nax.scatter(latihan['DurasiMenit'], latihan['Skor'], color='#196B9B', alpha=0.8)\nax.set(title='Durasi Latihan dan Skor', xlabel='Durasi (menit)', ylabel='Skor')\nplt.show()\n\nfig, ax = plt.subplots(figsize=(7, 4))\nukuran_latihan = latihan['JumlahLatihan'] * 35\nscatter = ax.scatter(latihan['DurasiMenit'], latihan['Skor'], s=ukuran_latihan, c=latihan['JumlahLatihan'], cmap='Blues', alpha=0.6, edgecolor='white')\nfig.colorbar(scatter, ax=ax, label='Jumlah latihan')\nax.set(title='Durasi, Skor, dan Jumlah Latihan', xlabel='Durasi (menit)', ylabel='Skor')\nplt.show()\nprint('Skor cenderung lebih tinggi pada durasi latihan yang lebih lama. Grafik ini menunjukkan hubungan, tetapi tidak membuktikan bahwa durasi menyebabkan skor naik.')"},
            ],
            [
                {"kind": "markdown", "text": "## Heatmap memperlihatkan pola pada matriks\n\nWarna mewakili besarnya nilai pada perpotongan dua kelompok. Label angka menjaga nilai tetap dapat dibaca."},
                {"kind": "code", "text": "kunjungan_jam = pd.DataFrame([[3, 5, 8, 7], [4, 9, 12, 8], [6, 11, 10, 5]], index=['Senin', 'Selasa', 'Rabu'], columns=['08.00', '10.00', '12.00', '14.00'])\nfig, ax = plt.subplots(figsize=(7, 3.5))\nimage = ax.imshow(kunjungan_jam, cmap='Blues')\nax.set_xticks(range(len(kunjungan_jam.columns)), kunjungan_jam.columns)\nax.set_yticks(range(len(kunjungan_jam.index)), kunjungan_jam.index)\nfor baris in range(kunjungan_jam.shape[0]):\n    for kolom in range(kunjungan_jam.shape[1]):\n        ax.text(kolom, baris, kunjungan_jam.iloc[baris, kolom], ha='center', va='center', color='#111A30')\nfig.colorbar(image, ax=ax, label='Kunjungan')\nax.set(title='Kunjungan per Hari dan Jam', xlabel='Jam', ylabel='Hari')\nplt.show()"},
                {"kind": "markdown", "text": "### Pair plot membandingkan beberapa pasangan variabel\n\nDiagonal menunjukkan distribusi masing-masing variabel. Panel lain menunjukkan hubungan setiap pasangan variabel numerik."},
                {"kind": "code", "text": "fig = px.scatter_matrix(peserta, dimensions=['JamBelajar', 'Kehadiran', 'Nilai'], color='Nilai', color_continuous_scale='Blues', title='Pair Plot Variabel Peserta')\nfig.update_traces(showupperhalf=True, marker={'size': 8, 'opacity': 0.75})\nfig.show()"},
                {"kind": "markdown", "text": "## Memetakan lokasi\n\nPeta titik menunjukkan lokasi pengamatan dan ukuran/warna suatu nilai. Choropleth mewarnai wilayah berdasarkan nilai yang diringkas per wilayah. Contoh di bawah memakai angka buatan."},
                {"kind": "markdown", "text": "### Point map menempatkan pengamatan pada koordinat\n\nGunakan kolom lintang dan bujur. Peta ini menunjukkan sebaran lokasi, bukan batas administrasi."},
                {"kind": "code", "text": "lokasi_kota = pd.DataFrame({\n    'Kota': ['Jakarta', 'Bandung', 'Semarang', 'Yogyakarta', 'Surabaya', 'Denpasar'],\n    'Lat': [-6.2088, -6.9175, -6.9667, -7.7956, -7.2575, -8.6500],\n    'Lon': [106.8456, 107.6191, 110.4167, 110.3695, 112.7521, 115.2167],\n    'Kunjungan': [120, 78, 64, 92, 110, 58],\n})\nfig = px.scatter_geo(lokasi_kota, lat='Lat', lon='Lon', size='Kunjungan', color='Kunjungan', text='Kota', hover_name='Kota', projection='natural earth', title='Contoh Sebaran Kunjungan per Kota')\nfig.update_geos(fitbounds='locations', visible=True)\nfig.show()"},
                {"kind": "markdown", "text": "### Choropleth membandingkan nilai antarwilayah\n\nKolom `locations` berisi kode wilayah ISO-3. Nilai dibuat khusus untuk contoh, bukan statistik negara yang sebenarnya."},
                {"kind": "code", "text": "nilai_wilayah = pd.DataFrame({\n    'Negara': ['IDN', 'MYS', 'SGP', 'THA', 'PHL', 'VNM'],\n    'IndeksContoh': [72, 64, 81, 58, 60, 67],\n})\nfig = px.choropleth(nilai_wilayah, locations='Negara', locationmode='ISO-3', color='IndeksContoh', hover_name='Negara', color_continuous_scale='Blues', title='Indeks Contoh per Negara')\nfig.show()"},
                {"kind": "practice", "id": "practice_akhir_hubungan", "intro": "## Practice Akhir: ringkasan indikator kota\n\nData pertama berisi indeks contoh per kota pada skala 0 sampai 100 dan jumlah kunjungan buatan. Buat heatmap untuk tiga indeks, pair plot untuk indeks numerik, dan point map dengan ukuran titik menurut jumlah kunjungan. Data kedua berisi indeks buatan per negara. Buat choropleth. Tambahkan judul dan jelaskan satu pola yang terlihat. Jangan menyebut angka sebagai statistik faktual.", "answer": "indikator_kota = pd.DataFrame({\n    'Kota': ['Jakarta', 'Bandung', 'Semarang', 'Yogyakarta', 'Surabaya', 'Denpasar'],\n    'Akses': [74, 82, 70, 88, 79, 85],\n    'Partisipasi': [81, 76, 69, 83, 80, 73],\n    'Layanan': [78, 84, 75, 91, 80, 88],\n    'Kunjungan': [130, 82, 68, 98, 118, 60],\n    'Lat': [-6.2088, -6.9175, -6.9667, -7.7956, -7.2575, -8.6500],\n    'Lon': [106.8456, 107.6191, 110.4167, 110.3695, 112.7521, 115.2167],\n})\nmatriks = indikator_kota.set_index('Kota')[['Akses', 'Partisipasi', 'Layanan']]\nfig, ax = plt.subplots(figsize=(7, 4))\nimage = ax.imshow(matriks, cmap='Blues', aspect='auto')\nax.set_xticks(range(len(matriks.columns)), matriks.columns, rotation=15)\nax.set_yticks(range(len(matriks.index)), matriks.index)\nfor baris in range(matriks.shape[0]):\n    for kolom in range(matriks.shape[1]):\n        ax.text(kolom, baris, matriks.iloc[baris, kolom], ha='center', va='center', color='#111A30', fontsize=8)\nfig.colorbar(image, ax=ax, label='Nilai contoh')\nax.set(title='Heatmap Indikator Kota')\nplt.show()\n\nfig = px.scatter_matrix(indikator_kota, dimensions=['Akses', 'Partisipasi', 'Layanan'], color='Kota', title='Pair Plot Indikator Kota')\nfig.update_traces(showupperhalf=True, marker={'size': 7, 'opacity': 0.75})\nfig.show()\n\nfig = px.scatter_geo(indikator_kota, lat='Lat', lon='Lon', size='Kunjungan', color='Layanan', text='Kota', hover_name='Kota', projection='natural earth', title='Contoh Indikator Kota di Indonesia')\nfig.update_geos(fitbounds='locations', visible=True)\nfig.show()\n\nindeks_negara = pd.DataFrame({'Negara': ['IDN', 'MYS', 'SGP', 'THA', 'PHL', 'VNM'], 'IndeksContoh': [70, 66, 85, 60, 62, 68]})\nfig = px.choropleth(indeks_negara, locations='Negara', locationmode='ISO-3', color='IndeksContoh', hover_name='Negara', color_continuous_scale='Blues', title='Indeks Contoh per Negara')\nfig.show()\nprint('Skor heatmap menunjukkan perbedaan indeks yang skalanya sebanding. Pair plot membantu memeriksa hubungan antarvariabel. Peta menunjukkan nilai contoh pada lokasi, bukan kesimpulan sebab-akibat atau statistik resmi.')"},
            ],
        ],
    }
    return [s2, s3, s4]


REFERENCES = {
    "visualisasi_tren_perubahan": [
        "[Matplotlib Axes.plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html)",
        "[Matplotlib Axes.fill_between](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.fill_between.html)",
        "[Pandas DataFrame.plot.area](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.area.html)",
    ],
    "visualisasi_distribusi": [
        "[Matplotlib Axes.hist](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html)",
        "[Matplotlib Axes.boxplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.boxplot.html)",
        "[Matplotlib Axes.violinplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html)",
        "[SciPy gaussian_kde concept reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gaussian_kde.html)",
    ],
    "visualisasi_hubungan_pola_lokasi": [
        "[Matplotlib Axes.scatter](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html)",
        "[Plotly scatter matrix](https://plotly.com/python/splom/)",
        "[Plotly point maps](https://plotly.com/python/scatter-plots-on-maps/)",
        "[Plotly choropleth maps](https://plotly.com/python/choropleth-maps/)",
    ],
}


for session in build_sessions():
    student = notebook(session, solution=False)
    solved = notebook(session, solution=True)
    reference_md = "## Rujukan API\n\n" + "\n".join("- " + url for url in REFERENCES[session['filename']])
    student.cells.append(md(reference_md, "api_references"))
    solved.cells.append(md(reference_md, "api_references"))
    topic_names = {
        "visualisasi_tren_perubahan": "02-tren-perubahan",
        "visualisasi_distribusi": "03-distribusi",
        "visualisasi_hubungan_pola_lokasi": "04-hubungan-pola-lokasi",
    }
    topic = OUT / topic_names[session["filename"]]
    student_path = topic / "notebooks" / (session["filename"] + ".ipynb")
    solution_path = topic / "solusi" / (session["filename"] + "_solution.ipynb")
    student_path.parent.mkdir(parents=True, exist_ok=True)
    solution_path.parent.mkdir(parents=True, exist_ok=True)
    nbf.write(student, student_path)
    nbf.write(solved, solution_path)
    print(student_path)
