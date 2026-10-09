"""Buat notebook jawaban tanpa mengubah notebook siswa dari dist-notebooks."""
import copy
import json
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[2]


def source(text):
    return dedent(text).strip() + "\n"


def write_editorial(path, notebook):
    notebook = copy.deepcopy(notebook)
    notebook["metadata"].setdefault("colab", {})["name"] = path.name
    notebook["metadata"].setdefault("course", {}).update(role="instructor", variant="editorial")
    for cell in notebook["cells"]:
        if cell["cell_type"] == "code":
            cell["execution_count"] = None
            cell["outputs"] = []
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(notebook, ensure_ascii=False, indent=2) + "\n")


def editorial(name, replacements, additions=None):
    path = next(ROOT.glob(f"level-*/*/notebooks/{name}.ipynb"))
    notebook = json.loads(path.read_text())
    for index, text in replacements.items():
        notebook["cells"][index]["source"] = source(text).splitlines(keepends=True)
    for index, text in (additions or {}).items():
        current = "".join(notebook["cells"][index]["source"])
        notebook["cells"][index]["source"] = (current.rstrip() + "\n\n" + source(text)).splitlines(keepends=True)
    write_editorial(path.with_name(path.stem + "_editorial.ipynb"), notebook)


def main():
    originals = list(ROOT.glob("level-*/*/solusi/**/*.ipynb"))
    originals += list((ROOT / "_arsip" / "solusi-asli-dist-notebooks").glob("level-*/*/solusi/**/*.ipynb"))
    for path in sorted(originals):
        notebook = json.loads(path.read_text())
        stem = path.stem.removesuffix("_solution")
        material = next(parent for parent in path.parents if parent.parent.name.startswith("level-"))
        if stem == "meeting-02":
            notebook["cells"][17]["source"] = ["### Indentation yang sudah diperbaiki\n", "\n", "Pada versi editorial, statement di dalam if diberi indentation yang benar.\n"]
            notebook["cells"][18]["source"] = ["stock = 2\n", "if stock > 0:\n", "    print(\"tersedia\")\n"]
        write_editorial(ROOT / material.parent.name / material.name / "notebooks" / (stem + "_editorial.ipynb"), notebook)

    editorial("python_fundamental", {
        57: '''
            nama_pembeli = input("Nama pembeli: ")
            makanan = input("Nama makanan: ")
            harga = float(input("Harga makanan: "))
            jumlah = int(input("Jumlah pesanan: "))
            layanan = float(input("Biaya layanan: "))
            subtotal = harga * jumlah
            total_bayar = subtotal + layanan
            print("Pembeli:", nama_pembeli)
            print("Makanan:", makanan, "Jumlah:", jumlah)
            print("Subtotal:", subtotal, "Layanan:", layanan)
            print("Total bayar:", total_bayar)
        ''',
        79: '''
            daftar_makanan = ["Nasi goreng", "Mie goreng", "Soto"]
            daftar_harga = [18000, 15000, 20000]
            print("1", daftar_makanan[0], daftar_harga[0])
            print("2", daftar_makanan[1], daftar_harga[1])
            print("3", daftar_makanan[2], daftar_harga[2])
            nomor = int(input("Nomor menu: "))
            nama_pembeli = input("Nama pembeli: ")
            jumlah = int(input("Jumlah pesanan: "))
            layanan = float(input("Biaya layanan: "))
            member = input("Status member: ")
            if nomor == 1:
                makanan, harga = daftar_makanan[0], daftar_harga[0]
            elif nomor == 2:
                makanan, harga = daftar_makanan[1], daftar_harga[1]
            elif nomor == 3:
                makanan, harga = daftar_makanan[2], daftar_harga[2]
            else:
                makanan, harga = "Menu tidak valid", 0
            if 1 <= nomor <= 3 and jumlah > 0:
                subtotal = harga * jumlah
                if subtotal >= 50000:
                    diskon_persen = 0.15
                elif subtotal >= 30000:
                    diskon_persen = 0.10
                else:
                    diskon_persen = 0
                diskon = subtotal * diskon_persen
                total_bayar = subtotal - diskon + layanan
                print("Pembeli:", nama_pembeli, "Member:", member)
                print("Makanan:", makanan, "Jumlah:", jumlah)
                print("Subtotal:", subtotal, "Diskon:", diskon)
                print("Layanan:", layanan, "Total bayar:", total_bayar)
            else:
                print("Nomor menu atau jumlah pesanan tidak valid")
        '''})

    editorial("conditional_statement", {
        31: '''
            total_belanja = 200000
            member = True
            voucher = True
            pembayaran = "e-wallet"
            if total_belanja >= 200000:
                if member and voucher and pembayaran == "e-wallet":
                    diskon_persen = 25
                else:
                    diskon_persen = 20
            elif total_belanja >= 100000:
                diskon_persen = 5
            else:
                diskon_persen = 0
            print("Diskon:", diskon_persen, "%")
        ''',
        33: '''
            hari = "akhir pekan"
            studio = "Premium"
            member = True
            usia = 16
            if hari == "akhir pekan":
                if studio == "Premium":
                    if member:
                        harga_tiket = 70000
                    else:
                        harga_tiket = 80000
                else:
                    if usia < 12 or usia > 60:
                        harga_tiket = 35000
                    else:
                        harga_tiket = 50000
            else:
                harga_tiket = 35000
            print("Harga tiket:", harga_tiket)
        ''',
        35: '''
            pelanggaran = 2
            nilai_ujian = 80
            nilai_tugas = 76
            kehadiran = 85
            if pelanggaran > 3:
                status = "Tidak lulus karena disiplin"
            else:
                rata_rata = (nilai_ujian + nilai_tugas) / 2
                if rata_rata >= 75:
                    if kehadiran >= 80:
                        status = "Lulus"
                    else:
                        status = "Ditunda karena kehadiran"
                elif rata_rata >= 60:
                    status = "Remedial"
                else:
                    status = "Tidak lulus karena nilai"
            print(status)
        ''',
        37: '''
            punya_tiket = True
            tinggi = 120
            usia = 10
            bersama_orang_tua = True
            if not punya_tiket:
                keputusan = "Beli tiket dahulu"
            elif tinggi >= 120:
                if usia >= 12:
                    keputusan = "Boleh masuk wahana"
                else:
                    keputusan = "Boleh masuk dengan pendamping"
            else:
                if usia < 12 and bersama_orang_tua:
                    keputusan = "Boleh masuk wahana anak"
                else:
                    keputusan = "Tidak memenuhi syarat"
            print(keputusan)
        ''',
        39: '''
            hujan = False
            ada_peralatan_gym = True
            energi_tinggi = True
            waktu = 30
            if hujan:
                if not ada_peralatan_gym:
                    olahraga = "Bodyweight di rumah"
                elif energi_tinggi:
                    olahraga = "Latihan beban di gym"
                else:
                    olahraga = "Yoga ringan"
            else:
                if waktu >= 30:
                    if energi_tinggi:
                        olahraga = "Lari di luar"
                    else:
                        olahraga = "Jalan cepat"
                else:
                    olahraga = "HIIT 15 menit"
            print(olahraga)
        '''})

    editorial("for_while_loop", {
        23: "Versi editorial memuat contoh jawaban. Jalankan tiap cell dan ubah ukurannya untuk mencoba pola lain.",
        25: '''
            tinggi = 5
            for baris in range(1, tinggi + 1):
                for kolom in range(baris):
                    print("*", end="")
                print()
        ''',
        27: '''
            tinggi = 5
            for baris in range(1, tinggi + 1):
                for kolom in range(tinggi):
                    if kolom < baris:
                        print("*", end="")
                    else:
                        print("-", end="")
                print()
        ''',
        29: '''
            ukuran = 5
            for baris in range(ukuran):
                for kolom in range(ukuran):
                    if (baris + kolom) % 2 == 0:
                        print("#", end="")
                    else:
                        print(".", end="")
                print()
        ''',
        31: '''
            tinggi = 5
            for baris in range(1, tinggi + 1):
                for spasi in range(tinggi - baris):
                    print(" ", end="")
                for bintang in range(2 * baris - 1):
                    print("*", end="")
                print()
        ''',
        33: '''
            tinggi = 5
            lebar = 7
            for baris in range(tinggi):
                for kolom in range(lebar):
                    if baris == 0 or baris == tinggi - 1 or kolom == 0 or kolom == lebar - 1:
                        print("@", end="")
                    else:
                        print(".", end="")
                print()
        '''})

    mean = '''
        def hitung_mean(data):
            if len(data) == 0:
                return None
            return sum(data) / len(data)
    '''
    median = '''
        def hitung_median(data):
            if len(data) == 0:
                return None
            urut = sorted(data)
            tengah = len(urut) // 2
            if len(urut) % 2 == 1:
                return urut[tengah]
            return (urut[tengah - 1] + urut[tengah]) / 2
    '''
    mode = '''
        def hitung_modus(data):
            if len(data) == 0:
                return None
            frekuensi = {}
            for angka in data:
                frekuensi[angka] = frekuensi.get(angka, 0) + 1
            # Jika frekuensi sama, pilih angka yang muncul lebih dahulu.
            return max(frekuensi, key=frekuensi.get)
    '''
    variance = '''
        def hitung_variansi(data):
            if len(data) == 0:
                return None
            mean = hitung_mean(data)
            return sum((angka - mean) ** 2 for angka in data) / len(data)
    '''
    std = '''
        import math

        def hitung_standar_deviasi(data):
            variansi = hitung_variansi(data)
            if variansi is None:
                return None
            return math.sqrt(variansi)
    '''
    editorial("function_statistic", {
        17: source(mean) + '\ndata_nilai = [72, 85, 72, 90, 68, 75, 85, 72, 88]\nprint(hitung_mean(data_nilai))',
        21: source(median) + '\nprint(hitung_median(data_nilai))',
        23: source(mode) + '\nprint(hitung_modus(data_nilai))',
        25: '''
            def hitung_rentang(data):
                if len(data) == 0:
                    return None
                return max(data) - min(data)

            print(hitung_rentang(data_nilai))
        ''',
        29: '''
            def fibonacci(n):
                if n < 0:
                    raise ValueError("n harus nonnegatif")
                if n <= 1:
                    return n
                return fibonacci(n - 1) + fibonacci(n - 2)

            for i in range(8):
                print(fibonacci(i), end=" ")
            print()
        ''',
        31: source(variance) + '\ndata_a = [28, 30, 31, 29, 32]\ndata_b = [10, 20, 30, 40, 50]\nprint(hitung_variansi(data_a))\nprint(hitung_variansi(data_b))',
        33: source(std) + '\nprint(hitung_standar_deviasi(data_a))\nprint(hitung_standar_deviasi(data_b))',
    })
    editorial("list_dictionary_numpy", {24: '''
        siswa = {"nama": "Alya", "umur": 16, "nilai": [76, 89, 82]}
        print("Nama:", siswa["nama"])
        print("Umur:", siswa["umur"])
        print("Rata-rata:", sum(siswa["nilai"]) / len(siswa["nilai"]))
    '''}, {
        21: '''
            rata_rata_siswa = []
            for nomor, nilai_siswa in enumerate(nilai, start=1):
                rata_rata = sum(nilai_siswa) / len(nilai_siswa)
                rata_rata_siswa.append(rata_rata)
                print("Siswa", nomor, "rata-rata:", rata_rata)
            print("Rata-rata tertinggi:", max(rata_rata_siswa))
        ''',
        40: '''
            array_nilai = np.array(data_nilai)
            print("Mean:", np.mean(array_nilai))
            print("Median:", np.median(array_nilai))
            print("Standard deviation:", np.std(array_nilai))
        ''',
        43: '''
            array_nilai = np.array([siswa["nilai"] for siswa in data_siswa])
            print("Mean:", np.mean(array_nilai))
            print("Standard deviation:", np.std(array_nilai))
            for siswa in data_siswa:
                if siswa["nilai"] >= 80:
                    print(siswa["nama"])
        '''})

    numpy_path = next(ROOT.glob("level-*/*/notebooks/analysis_with_numpy_2.ipynb"))
    numpy_solution = json.loads(numpy_path.read_text())
    answers = {index - 2: "".join(numpy_solution["cells"][index]["source"]) for index in [31, 33, 35, 37]}
    practice_setup = source('''
        raw_latihan = np.array([145, 151, 162, 102, 112, 118, 132, 129, 140, 91, 108, 113])
        cabang_latihan = np.array(["Jakarta", "Bandung", "Surabaya", "Medan"])
        bulan_latihan = np.array(["Jan", "Feb", "Mar"])
    ''')
    practice_answer = "".join(numpy_solution["cells"][12]["source"])
    editorial("analysis_with_numpy", answers, {10: practice_answer})
    editorial("analysis_with_numpy_2", {12: practice_setup + "\n" + practice_answer})

    editorial("python_numpy_reevaluation", {}, {
        3: '''
            subtotal = float(harga_satuan) * int(jumlah_barang)
            diskon = subtotal * float(diskon_persen) / 100
            total_pembayaran = subtotal - diskon + float(ongkos_kirim)
            print("Subtotal:", subtotal, "Diskon:", diskon)
            print("Ongkos kirim:", float(ongkos_kirim), "Total:", total_pembayaran)
        ''',
        5: '''
            kebutuhan_liter = float(jarak_km) / float(efisiensi_km_per_liter)
            biaya_bahan_bakar = kebutuhan_liter * float(harga_per_liter)
            total_biaya = biaya_bahan_bakar + float(biaya_tol)
            biaya_per_orang = total_biaya / int(jumlah_penumpang)
            print("Bahan bakar (liter):", kebutuhan_liter)
            print("Biaya bahan bakar:", biaya_bahan_bakar)
            print("Total biaya:", total_biaya, "Per orang:", biaya_per_orang)
        ''',
        7: '''
            mulai = int(jam_mulai) * 60 + int(menit_mulai)
            selesai = int(jam_selesai) * 60 + int(menit_selesai)
            durasi_menit = selesai - mulai - int(istirahat_menit)
            upah = durasi_menit / 60 * float(upah_per_jam)
            print("Durasi:", durasi_menit // 60, "jam", durasi_menit % 60, "menit")
            print("Upah:", upah)
        ''',
        10: '''
            hasil_pesanan = {}
            for item in pesanan:
                if item["jumlah"] <= 0:
                    status = "Jumlah harus positif"
                elif not item["produk_aktif"]:
                    status = "Produk tidak aktif"
                elif item["stok"] < item["jumlah"]:
                    status = "Stok tidak cukup"
                else:
                    status = "Diterima"
                    print(item["id"], "Subtotal:", item["harga"] * item["jumlah"])
                hasil_pesanan[item["id"]] = status
                print(item["id"], status)
        ''',
        12: '''
            hasil_ruang = {}
            for item in pemesanan:
                if item["peserta"] <= 0:
                    status = "Peserta harus positif"
                elif not 1 <= item["durasi"] <= 4:
                    status = "Durasi harus 1 sampai 4 jam"
                elif not item["tersedia"]:
                    status = "Ruang tidak tersedia"
                elif item["peserta"] > item["kapasitas"]:
                    status = "Kapasitas tidak cukup"
                else:
                    status = "Diterima"
                hasil_ruang[item["id"]] = status
                print(item["id"], status)
        ''',
        14: '''
            hasil_produk = {}
            for item in produk:
                if not 480 <= item["berat"] <= 520:
                    status = ["Ditolak karena berat"]
                else:
                    status = []
                    if not item["kemasan_utuh"]:
                        status.append("Perbaiki kemasan")
                    if not item["label_lengkap"]:
                        status.append("Lengkapi label")
                    if len(status) == 0:
                        status.append("Siap dikirim")
                hasil_produk[item["id"]] = status
                print(item["id"], status)
        ''',
        17: '''
            total_penjualan = 0
            indeks_tertinggi = 0
            for i in range(len(hari)):
                total_penjualan += penjualan[i]
                if penjualan[i] >= target_harian:
                    print(hari[i], penjualan[i])
                if penjualan[i] > penjualan[indeks_tertinggi]:
                    indeks_tertinggi = i
            print("Total:", total_penjualan)
            print("Rata-rata:", total_penjualan / len(penjualan))
            print("Tertinggi:", hari[indeks_tertinggi], penjualan[indeks_tertinggi])
        ''',
        19: '''
            stok = stok_awal
            indeks = 0
            terkirim = 0
            dilayani = []
            while indeks < len(jumlah_pesanan) and stok >= jumlah_pesanan[indeks]:
                jumlah = jumlah_pesanan[indeks]
                stok -= jumlah
                terkirim += jumlah
                dilayani.append(jumlah)
                indeks += 1
            menunggu = jumlah_pesanan[indeks:]
            print("Dilayani:", dilayani, "Terkirim:", terkirim)
            print("Stok:", stok, "Menunggu:", menunggu)
        ''',
        21: '''
            tersedia_per_baris = []
            total_tersedia = 0
            for baris in kursi:
                tersedia = 0
                for posisi in baris:
                    if posisi == 1:
                        print("X", end="")
                    else:
                        print(".", end="")
                        tersedia += 1
                print()
                tersedia_per_baris.append(tersedia)
                total_tersedia += tersedia
            print("Tersedia per baris:", tersedia_per_baris)
            print("Total tersedia:", total_tersedia)
        ''',
        24: '''
            def statistik_pengiriman(data):
                if len(data) == 0:
                    return None
                mean = sum(data) / len(data)
                variance = sum((x - mean) ** 2 for x in data) / len(data)
                return mean, variance, math.sqrt(variance)

            hasil_a = statistik_pengiriman(kurir_a)
            hasil_b = statistik_pengiriman(kurir_b)
            print("Kurir A:", hasil_a)
            print("Kurir B:", hasil_b)
            print("Lebih konsisten:", "A" if hasil_a[2] < hasil_b[2] else "B")
            print("Data kosong:", statistik_pengiriman([]))
        ''',
        26: source(median) + source(mode) + source('''
            median_utama = hitung_median(waktu_tunggu)
            median_genap = hitung_median(waktu_tunggu_genap)
            print("Median:", median_utama, "Mode:", hitung_modus(waktu_tunggu))
            print("Range:", max(waktu_tunggu) - min(waktu_tunggu))
            print("Median genap:", median_genap)
            print("Separuh pelanggan menunggu paling lama", median_genap, "menit pada dataset genap")
            print("Data kosong:", hitung_median([]))
        '''),
        28: '''
            def ringkasan_kelulusan(nilai, batas_lulus):
                if len(nilai) == 0:
                    return None
                lulus = sum(1 for angka in nilai if angka >= batas_lulus)
                return {"jumlah": len(nilai), "lulus": lulus,
                        "belum_lulus": len(nilai) - lulus, "persentase_lulus": lulus / len(nilai) * 100}

            for batas in [75, 80]:
                print("Batas:", batas, "A:", ringkasan_kelulusan(kelas_a, batas))
                print("Batas:", batas, "B:", ringkasan_kelulusan(kelas_b, batas))
            print("Data kosong:", ringkasan_kelulusan([], 75))
            print("Parameter batas_lulus memungkinkan aturan berbeda tanpa menulis ulang function")
        ''',
        31: '''
            pesanan_ulang = []
            total_dipesan = 0
            for item in produk:
                if item["stok"] < item["stok_minimum"]:
                    jumlah = item["stok_minimum"] - item["stok"]
                    pesanan_ulang.append({"nama": item["nama"], "jumlah": jumlah})
                    total_dipesan += jumlah
            print(pesanan_ulang)
            print("Total dipesan:", total_dipesan)
        ''',
        33: '''
            antrean.append("Tono")
            antrean.remove("Salsa")
            orang_dilayani = [antrean.pop(0), antrean.pop(0)]
            dua_berikutnya = antrean[:2]
            ringkasan_antrean = {"dilayani": orang_dilayani, "tersisa": antrean.copy(), "menunggu": len(antrean)}
            print("Dua berikutnya:", dua_berikutnya)
            print(ringkasan_antrean)
        ''',
        35: '''
            rekap_peserta = []
            for item in peserta:
                rata_rata = sum(item["nilai"]) / len(item["nilai"])
                rekap_peserta.append({"nama": item["nama"], "rata_rata": rata_rata})
            for item in rekap_peserta:
                if item["rata_rata"] >= 85:
                    print(item)
            peserta_terbaik = max(rekap_peserta, key=lambda item: item["rata_rata"])
            print("Terbaik:", peserta_terbaik)
        ''',
        38: '''
            suhu_terkoreksi = suhu + koreksi_stasiun.reshape(4, 1)
            rata_stasiun = suhu_terkoreksi.mean(axis=1)
            rata_hari = suhu_terkoreksi.mean(axis=0)
            status_suhu = np.where(suhu_terkoreksi >= 30, "Panas", "Normal")
            stasiun_terpanas = stasiun[np.argmax(rata_stasiun)]
            print(suhu_terkoreksi, status_suhu, sep="\\n")
            print("Per stasiun:", rata_stasiun, "Per hari:", rata_hari)
            print("Stasiun terpanas:", stasiun_terpanas)
        ''',
        40: '''
            pendapatan = jumlah_terjual * harga_produk
            pendapatan_cabang = pendapatan.sum(axis=1)
            pendapatan_produk = pendapatan.sum(axis=0)
            cabang_terbaik = cabang[np.argmax(pendapatan_cabang)]
            cabang_minimal_juta = cabang[pendapatan_cabang >= 1000000]
            print("Pendapatan:", pendapatan)
            print("Per cabang:", pendapatan_cabang, "Per produk:", pendapatan_produk)
            print("Tertinggi:", cabang_terbaik, "Minimal satu juta:", cabang_minimal_juta)
        ''',
        42: '''
            nilai_akhir = (nilai * bobot).sum(axis=1)
            status = np.where(nilai_akhir >= 80, "Lulus", "Belum lulus")
            print(siswa, nilai_akhir, status)
            print("Terbaik:", siswa[np.argmax(nilai_akhir)])
            siswa_lengkap = np.concatenate((siswa, siswa_baru))
            nilai_lengkap = np.concatenate((nilai, nilai_baru), axis=0)
            nilai_akhir_lengkap = (nilai_lengkap * bobot).sum(axis=1)
            status_lengkap = np.where(nilai_akhir_lengkap >= 80, "Lulus", "Belum lulus")
            print(siswa_lengkap, nilai_akhir_lengkap, status_lengkap)
            print("Terbaik setelah penambahan:", siswa_lengkap[np.argmax(nilai_akhir_lengkap)])
        '''})
    print("Editorial tersedia:", len(list(ROOT.glob("level-*/*/notebooks/*_editorial.ipynb"))))


if __name__ == "__main__":
    main()
