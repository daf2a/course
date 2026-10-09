import fs from "node:fs/promises";
import path from "node:path";

const workspaceDir = "/Users/daf2a/Documents/python";
const outputPath = path.join(workspaceDir, "level-02/01-fungsi-statistika/notebooks/function_statistika_deskriptif_practice.ipynb");

function sourceLines(text) {
  const lines = text.split("\n");
  return lines.map((line, index) => index < lines.length - 1 ? `${line}\n` : line);
}

function markdown(text) {
  return {
    cell_type: "markdown",
    metadata: {},
    source: sourceLines(text),
  };
}

function code(text = "") {
  return {
    cell_type: "code",
    execution_count: null,
    metadata: {},
    outputs: [],
    source: sourceLines(text),
  };
}

const cells = [
  markdown("# Function dan Statistika Deskriptif dengan Python\n\nPractice notebook mengikuti alur materi PPT."),

  markdown(`## Persiapan

### Function populer yang dipakai

| Function | Kegunaan |
| --- | --- |
| print(...) | menampilkan hasil |
| len(data) | menghitung jumlah item |
| sum(data) | menjumlahkan nilai |
| min(data) | mencari nilai terkecil |
| max(data) | mencari nilai terbesar |
| sorted(data) | mengurutkan data |
| enumerate(data, start=1) | memberi nomor pada item |
| range(...) | membuat urutan angka |
| math.sqrt(x) | menghitung akar kuadrat |`),
  code("import math"),

  markdown("## 1. Function\n\n### Function memberi nama pada langkah yang bisa dipakai berulang"),
  code(`def tampilkan_rekap_nilai(nama_kelas, daftar_nilai):
    print("Kelas:", nama_kelas)
    for nomor, nilai in enumerate(daftar_nilai, start=1):
        print("Nilai", nomor, ":", nilai)

nilai_kelas_a = [72, 85, 90]
nilai_kelas_b = [68, 75, 88]

tampilkan_rekap_nilai("Kelas A", nilai_kelas_a)
tampilkan_rekap_nilai("Kelas B", nilai_kelas_b)`),

  markdown("### Use case: menghitung luas persegi"),
  code(`def hitung_luas_persegi(sisi):
    return sisi * sisi

print(hitung_luas_persegi(4))
print(hitung_luas_persegi(7))`),

  markdown("## 2. Return\n\n### print() menampilkan, return mengembalikan nilai"),
  code(`def luas_dengan_print(sisi):
    print(sisi * sisi)

def luas_dengan_return(sisi):
    return sisi * sisi

hasil_print = luas_dengan_print(4)
hasil_return = luas_dengan_return(4)

print("hasil_print:", hasil_print)
print("hasil_return:", hasil_return)
print("hasil_return + 1:", hasil_return + 1)`),

  markdown("### Function tanpa return"),
  code(`def tampilkan_status():
    print("Selesai")

hasil = tampilkan_status()
print("nilai hasil:", hasil)`),

  markdown("## 3. Parameter\n\n### Function dengan beberapa parameter"),
  code(`def hitung_total_belanja(keranjang, pajak):
    subtotal = 0
    for harga_satuan, jumlah in keranjang:
        subtotal = subtotal + harga_satuan * jumlah

    return subtotal + subtotal * pajak

keranjang = [(15000, 2), (12000, 1), (8000, 3)]
print(hitung_total_belanja(keranjang, 0.11))`),

  markdown("### Function dengan parameter data dan batas nilai"),
  code(`def buat_rekap_nilai(nama, daftar_nilai, batas_lulus):
    rata_rata = sum(daftar_nilai) / len(daftar_nilai)

    if rata_rata >= batas_lulus:
        status = "Lulus"
    else:
        status = "Perlu latihan"

    return nama, rata_rata, status

print(buat_rekap_nilai("Alya", [78, 85, 90], 75))
print(buat_rekap_nilai("Bima", [60, 72, 68], 75))`),

  markdown("### Validasi input"),
  code(`def bagi(total, jumlah):
    if jumlah == 0:
        return None
    return total / jumlah

print(bagi(10, 2))
print(bagi(10, 0))`),

  markdown("## 4. Mean\n\n### Function mean dengan for loop"),
  code(`def hitung_mean(data):
    if len(data) == 0:
        return None

    total = 0
    for nilai in data:
        total = total + nilai

    return total / len(data)

data_nilai = [72, 85, 72, 90, 68, 75, 85, 72, 88]
print(hitung_mean(data_nilai))`),

  markdown("## 5. Hands-on: median, modus, dan rentang\n\n### Data latihan"),
  code(`data_nilai = [72, 85, 72, 90, 68, 75, 85, 72, 88]
print(data_nilai)`),

  markdown("### Practice 1: hitung median\n\nGunakan nilai tengah setelah data diurutkan. Coba jumlah data ganjil dan genap."),
  code(`def hitung_median(data):
    pass

print(hitung_median(data_nilai))`),

  markdown("### Practice 2: hitung modus\n\nCari nilai yang paling sering muncul."),
  code(`def hitung_modus(data):
    pass

print(hitung_modus(data_nilai))`),

  markdown("### Practice 3: hitung rentang\n\nRentang adalah nilai terbesar dikurangi nilai terkecil."),
  code(`def hitung_rentang(data):
    pass

print(hitung_rentang(data_nilai))`),

  markdown("## 6. Recursive function\n\n### Function memanggil dirinya sendiri"),
  code(`def hitung_mundur(n):
    if n <= 0:
        return

    print(n)
    hitung_mundur(n - 1)

hitung_mundur(3)`),

  markdown("## 7. Bilangan Fibonacci\n\n### Setiap angka berasal dari dua angka sebelumnya"),
  code(`def fibonacci(n):
    if n <= 1:
        return n

    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(8):
    print(fibonacci(i), end=" ")`),

  markdown("### Coba ubah input"),
  code("# Coba fibonacci(5), fibonacci(8), atau buat pola pemanggilan sendiri."),

  markdown("### Use case: jumlah cara naik tangga"),
  code(`def jumlah_cara_naik(jumlah_tangga):
    if jumlah_tangga <= 1:
        return 1

    return jumlah_cara_naik(jumlah_tangga - 1) + jumlah_cara_naik(jumlah_tangga - 2)

for jumlah_tangga in range(1, 8):
    print(jumlah_tangga, jumlah_cara_naik(jumlah_tangga))`),

  markdown("## 8. Variasi\n\n### Practice: hitung variansi"),
  code(`data_a = [28, 30, 31, 29, 32]
data_b = [10, 20, 30, 40, 50]

def hitung_variansi(data):
    pass

print(hitung_variansi(data_a))
print(hitung_variansi(data_b))`),

  markdown("## 9. Standar deviasi\n\n### Practice: hitung standar deviasi"),
  code(`data_a = [28, 30, 31, 29, 32]
data_b = [10, 20, 30, 40, 50]

def hitung_standar_deviasi(data):
    pass

print(hitung_standar_deviasi(data_a))
print(hitung_standar_deviasi(data_b))`),

  markdown("### Bandingkan hasil"),
  code(`print("Data A lebih rapat atau lebih menyebar?")
print("Data B lebih rapat atau lebih menyebar?")`),

];

const notebook = {
  cells: cells.map((cell, index) => ({ ...cell, id: `cell-${String(index + 1).padStart(3, "0")}` })),
  metadata: {
    colab: {
      name: path.basename(outputPath),
      provenance: [],
    },
    kernelspec: {
      display_name: "Python 3",
      language: "python",
      name: "python3",
    },
    language_info: {
      name: "python",
      version: "3.12",
    },
    course: {
      lessonId: "python-function-statistika-deskriptif",
      contentVersion: "2.0.0",
      runtime: "Python 3",
      seed: null,
      libraries: ["math"],
      language: "id",
      role: "student",
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

await fs.writeFile(outputPath, `${JSON.stringify(notebook, null, 1)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, cellCount: cells.length, codeCells: cells.filter((cell) => cell.cell_type === "code").length }, null, 2));
