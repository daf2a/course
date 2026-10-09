import fs from "node:fs/promises"

const outputPath = "/Users/daf2a/Documents/python/level-01/03-perulangan/notebooks/for_while_loop.ipynb"

const md = (source, id) => ({
  cell_type: "markdown",
  id,
  metadata: {},
  source: source.split("\n").map((line, index, lines) => index < lines.length - 1 ? `${line}\n` : line)
})

const code = (source, id) => ({
  cell_type: "code",
  execution_count: null,
  id,
  metadata: {},
  outputs: [],
  source: source.split("\n").map((line, index, lines) => index < lines.length - 1 ? `${line}\n` : line)
})

const cells = [
  md("# For Loop dan While Loop\n\nMengolah list, membangun pola, mencari data, dan mengulang proses sampai kondisi selesai.", "title"),
  md("## Materi\n\nSetiap subtitle menjelaskan tujuan cell code setelahnya. Jalankan cell dari atas ke bawah, lalu ubah datanya untuk melihat hasil yang berbeda.", "instructions"),

  md("### 1. `for` dengan list sederhana\n\n`for` mengambil satu item dari list pada setiap putaran.", "basic_for_list_heading"),
  code(`warna = [\"biru\", \"kuning\", \"hijau\"]\n\nfor item in warna:\n    print(\"Warna:\", item)`, "basic_for_list"),

  md("### 2. `for` dengan `range()`\n\n`range(1, 4)` menghasilkan angka 1 sampai 3 untuk menentukan jumlah putaran.", "basic_range_heading"),
  code(`for nomor in range(1, 4):\n    print(\"Putaran ke-\", nomor)`, "basic_range"),

  md("### 3. `while` dengan counter\n\n`while` terus berjalan selama kondisi benar. Counter perlu diperbarui agar loop dapat berhenti.", "basic_while_heading"),
  code(`langkah = 1\n\nwhile langkah <= 3:\n    print(\"Langkah\", langkah)\n    langkah = langkah + 1`, "basic_while"),

  md("### 4. Nomor urut dengan `enumerate()`\n\n`enumerate()` memberi nomor urut sekaligus nilai dari sebuah list.", "enumerate_heading"),
  code(`playlist = [\"Langit Pagi\", \"Kota Hujan\", \"Jalan Pulang\"]\n\nfor urutan, lagu in enumerate(playlist, start=1):\n    print(f\"{urutan}. {lagu}\")`, "enumerate_playlist"),

  md("### 5. Rekap data dari list\n\nLoop dapat menghitung total dan mencari nilai tertinggi dalam satu kali pembacaan list.", "summary_heading"),
  code(`skor_turnamen = [72, 88, 91, 65, 84]\ntotal_skor = 0\nskor_tertinggi = skor_turnamen[0]\n\nfor skor in skor_turnamen:\n    total_skor = total_skor + skor\n    if skor > skor_tertinggi:\n        skor_tertinggi = skor\n\nrata_rata = total_skor / len(skor_turnamen)\nprint(\"Rata-rata:\", rata_rata)\nprint(\"Tertinggi:\", skor_tertinggi)`, "list_summary"),

  md("### 6. Filter item dari list\n\nSimpan hanya nilai yang memenuhi kondisi ke list baru.", "filter_heading"),
  code(`nilai = [54, 78, 91, 62, 88, 45]\nnilai_lulus = []\n\nfor skor in nilai:\n    if skor >= 75:\n        nilai_lulus.append(skor)\n\nprint(\"Nilai lulus:\", nilai_lulus)`, "filter_list"),

  md("### 7. `range()` dengan langkah dan hitung mundur\n\nParameter ketiga pada `range()` menentukan besar langkah perubahan angka.", "range_heading"),
  code(`for detik in range(10, 0, -2):\n    print(f\"Mulai dalam {detik} detik\")\n\nprint(\"Mulai!\")`, "range_countdown"),

  md("### 8. Nested loop untuk membuat pola\n\nLoop luar membuat baris. Loop dalam menambahkan simbol pada setiap baris.", "nested_pattern_heading"),
  code(`tinggi = 5\n\nfor baris in range(1, tinggi + 1):\n    pola = \"\"\n    for kolom in range(baris):\n        pola = pola + \"*\"\n    print(pola)`, "nested_pattern"),

  md("### 9. Nested loop untuk semua kombinasi\n\nSetiap makanan dipasangkan dengan setiap minuman.", "nested_combinations_heading"),
  code(`makanan = [\"Roti\", \"Donat\"]\nminuman = [\"Teh\", \"Susu\", \"Kopi\"]\n\nfor menu in makanan:\n    for minum in minuman:\n        print(f\"Paket: {menu} + {minum}\")`, "nested_combinations"),

  md("### 10. `while` untuk proses berbasis kondisi\n\nSelama baterai masih ada, robot terus mengantar paket.", "while_heading"),
  code(`baterai = 4\n\nwhile baterai > 0:\n    print(f\"Robot mengantar paket. Baterai: {baterai}\")\n    baterai = baterai - 1\n\nprint(\"Robot kembali ke stasiun pengisian daya\")`, "while_state"),

  md("### 11. `break` dan `continue` saat mencari data\n\n`continue` melewati data yang tidak dipakai. `break` menghentikan pencarian ketika target ditemukan.", "break_continue_heading"),
  code(`kartu = [\"duplikat\", \"bunga\", \"rusak\", \"langka\", \"roket\"]\n\nfor item in kartu:\n    if item == \"duplikat\" or item == \"rusak\":\n        continue\n    if item == \"langka\":\n        print(\"Kartu langka ditemukan!\")\n        break\n    print(\"Simpan kartu:\", item)`, "break_continue_search"),

  md("### 12. Memilih loop yang tepat\n\nGunakan `for` saat list atau jumlah putaran sudah jelas. Gunakan `while` saat proses berhenti karena kondisi berubah.", "choose_loop_heading"),
  code(`contoh_for = \"memeriksa setiap kursi dalam daftar kursi\"\ncontoh_while = \"mengantar paket selama baterai masih ada\"\n\nprint(\"for:\", contoh_for)\nprint(\"while:\", contoh_while)`, "choose_loop"),

  md("## Practice: Cetak Pola\n\nSemua practice berfokus pada pola. Gunakan nested `for`, `range()`, kondisi, atau gabungannya. Cell solusi tidak memiliki jawaban.", "practice_section"),

  md("### Practice 1: Tangga Bintang\n\nCetak pola tangga setinggi `tinggi`. Jangan menggunakan perkalian string.\n\n```text\n*\n**\n***\n****\n*****\n```", "practice_staircase"),
  code(`tinggi = 5\n\n`, "practice_staircase_answer"),

  md("### Practice 2: Papan Catur Mini\n\nCetak papan berukuran `ukuran` × `ukuran`. Gunakan `#` dan `.` secara bergantian. Baris pertama dimulai dari `#`.\n\n```text\n#.#.#\n.#.#.\n#.#.#\n.#.#.\n#.#.#\n```", "practice_checkerboard"),
  code(`ukuran = 5\n\n`, "practice_checkerboard_answer"),

  md("### Practice 3: Piramida Lampu\n\nCetak piramida dengan simbol `*`. Gunakan spasi di depan setiap baris agar piramidanya berada di tengah.\n\n```text\n    *\n   ***\n  *****\n *******\n*********\n```", "practice_pyramid"),
  code(`tinggi = 5\n\n`, "practice_pyramid_answer"),

  md("### Practice 4: Bingkai Arena\n\nCetak bingkai berukuran `tinggi` × `lebar`. Gunakan `@` pada tepi dan `.` di bagian dalam.\n\n```text\n@@@@@@@\n@.....@\n@.....@\n@.....@\n@@@@@@@\n```", "practice_frame"),
  code(`tinggi = 5\nlebar = 7\n\n`, "practice_frame_answer"),

  md("### Practice 5: Peta Taman Mini\n\nCetak peta taman berukuran `ukuran` × `ukuran`. Gunakan `T` sebagai pohon di tepi, `~` sebagai kolam pada bagian dalam, dan `.` untuk jalur tengah. Jalur tengah adalah satu kolom di tengah peta.\n\n```text\nTT.TT\nT~.~T\nT~.~T\nT~.~T\nTT.TT\n```", "practice_garden"),
  code(`ukuran = 5\n\n`, "practice_garden_answer")
]

const notebook = {
  cells,
  metadata: {
    colab: { name: "for_while_loop.ipynb", provenance: [] },
    kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
    language_info: { name: "python", version: "3.12" }
  },
  nbformat: 4,
  nbformat_minor: 5
}

await fs.writeFile(outputPath, `${JSON.stringify(notebook, null, 2)}\n`)
console.log(outputPath)
