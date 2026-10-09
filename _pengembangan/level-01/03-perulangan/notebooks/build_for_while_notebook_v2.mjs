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
  md("## Materi\n\nSetiap konsep ada dalam satu code cell yang bisa langsung dijalankan. Ubah data contoh untuk melihat bagaimana loop merespons perubahan data.", "instructions"),
  code(`# 1. for dan enumerate()\n# enumerate() memberi nomor urut sekaligus nilai dari sebuah list.\n\nplaylist = [\"Langit Pagi\", \"Kota Hujan\", \"Jalan Pulang\"]\n\nfor urutan, lagu in enumerate(playlist, start=1):\n    print(f\"{urutan}. {lagu}\")`, "enumerate_playlist"),
  code(`# 2. Rekap data dari list\n# for dapat membaca setiap nilai lalu memperbarui total dan nilai tertinggi.\n\nskor_turnamen = [72, 88, 91, 65, 84]\ntotal_skor = 0\nskor_tertinggi = skor_turnamen[0]\n\nfor skor in skor_turnamen:\n    total_skor = total_skor + skor\n    if skor > skor_tertinggi:\n        skor_tertinggi = skor\n\nrata_rata = total_skor / len(skor_turnamen)\nprint(\"Rata-rata:\", rata_rata)\nprint(\"Tertinggi:\", skor_tertinggi)`, "list_summary"),
  code(`# 3. Filter item dari list\n# Simpan hanya nilai yang memenuhi kondisi ke list baru.\n\nnilai = [54, 78, 91, 62, 88, 45]\nnilai_lulus = []\n\nfor skor in nilai:\n    if skor >= 75:\n        nilai_lulus.append(skor)\n\nprint(\"Nilai lulus:\", nilai_lulus)`, "filter_list"),
  code(`# 4. range() dengan langkah dan hitung mundur\n# Parameter ketiga menentukan langkah perubahan angka.\n\nfor detik in range(10, 0, -2):\n    print(f\"Mulai dalam {detik} detik\")\n\nprint(\"Mulai!\")`, "range_countdown"),
  code(`# 5. Nested loop untuk membuat pola\n# Loop luar membuat baris. Loop dalam menambahkan simbol pada setiap baris.\n\ntinggi = 5\n\nfor baris in range(1, tinggi + 1):\n    pola = \"\"\n    for kolom in range(baris):\n        pola = pola + \"*\"\n    print(pola)`, "nested_pattern"),
  code(`# 6. Nested loop untuk semua kombinasi\n# Setiap makanan dipasangkan dengan setiap minuman.\n\nmakanan = [\"Roti\", \"Donat\"]\nminuman = [\"Teh\", \"Susu\", \"Kopi\"]\n\nfor menu in makanan:\n    for minum in minuman:\n        print(f\"Paket: {menu} + {minum}\")`, "nested_combinations"),
  code(`# 7. while untuk proses yang bergantung pada kondisi\n# Baterai berubah setiap putaran sampai kondisi menjadi False.\n\nbaterai = 4\n\nwhile baterai > 0:\n    print(f\"Robot mengantar paket. Baterai: {baterai}\")\n    baterai = baterai - 1\n\nprint(\"Robot kembali ke stasiun pengisian daya\")`, "while_state"),
  code(`# 8. break dan continue saat mencari data\n# continue melewati data yang tidak bisa dipakai. break menghentikan pencarian saat target ditemukan.\n\nkartu = [\"duplikat\", \"bunga\", \"rusak\", \"langka\", \"roket\"]\n\nfor item in kartu:\n    if item == \"duplikat\" or item == \"rusak\":\n        continue\n    if item == \"langka\":\n        print(\"Kartu langka ditemukan!\")\n        break\n    print(\"Simpan kartu:\", item)`, "break_continue_search"),
  code(`# 9. Memilih loop yang tepat\n# for cocok saat list atau jumlah putaran sudah jelas.\n# while cocok saat proses berhenti karena kondisi berubah.\n\ncontoh_for = \"memeriksa setiap kursi dalam daftar kursi\"\ncontoh_while = \"mengantar paket selama baterai masih ada\"\n\nprint(\"for:\", contoh_for)\nprint(\"while:\", contoh_while)`, "choose_loop"),
  md("## Practice\n\nGunakan data awal dan target program pada setiap practice. Cell solusi sengaja tidak memiliki jawaban.", "practice_section"),
  md("### Practice 1: Papan Skor Turnamen\n\nDari list `skor_pemain`, buat program dengan `for` untuk menghitung total skor, rata-rata, skor tertinggi, dan list `pemain_lulus` untuk skor minimal 75. Tampilkan hasilnya dengan jelas.", "practice_tournament"),
  code(`# Data awal\nskor_pemain = [68, 95, 74, 82, 100, 59, 76]\n\n# Tulis solusi Practice 1 di bawah ini`, "practice_tournament_answer"),
  md("### Practice 2: Pola Lampu Festival\n\nGunakan nested `for` dan `range()` untuk menampilkan pola berikut dengan tinggi 5. Jangan langsung memakai perkalian string.\n\n```text\n*\n**\n***\n****\n*****\n```", "practice_pattern"),
  code(`# Data awal\ntinggi = 5\n\n# Tulis solusi Practice 2 di bawah ini`, "practice_pattern_answer"),
  md("### Practice 3: Generator Paket Kafe\n\nGunakan nested `for` untuk menghasilkan semua kombinasi makanan dan minuman. Tampilkan setiap hasil dengan format `Paket: <makanan> + <minuman>`. Hitung juga jumlah paket yang dibuat.", "practice_cafe"),
  code(`# Data awal\nmakanan = [\"Roti\", \"Pasta\", \"Salad\"]\nminuman = [\"Teh\", \"Kopi\"]\n\n# Tulis solusi Practice 3 di bawah ini`, "practice_cafe_answer"),
  md("### Practice 4: Berburu Kartu Langka\n\nPeriksa isi `koleksi` dengan `for`. Lewati kartu `duplikat` dan `rusak` menggunakan `continue`. Simpan kartu biasa ke list `kartu_disimpan`. Jika menemukan `langka`, tampilkan pesan lalu hentikan pencarian dengan `break`.", "practice_cards"),
  code(`# Data awal\nkoleksi = [\"bunga\", \"duplikat\", \"bintang\", \"rusak\", \"langka\", \"roket\"]\n\n# Tulis solusi Practice 4 di bawah ini`, "practice_cards_answer"),
  md("### Practice 5: Robot Kurir dengan Baterai\n\nGunakan `while` untuk mengantar paket selama `baterai` masih lebih dari 0 dan masih ada paket dalam list. Ambil satu paket dari depan list setiap putaran, kurangi baterai satu, lalu tampilkan paket yang berhasil dikirim dan sisa baterai. Berhenti jika baterai habis atau paket habis.", "practice_robot"),
  code(`# Data awal\npaket = [\"buku\", \"stiker\", \"poster\", \"kartu\", \"boneka\"]\nbaterai = 3\n\n# Tulis solusi Practice 5 di bawah ini`, "practice_robot_answer")
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
