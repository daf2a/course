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
  md("# For Loop dan While Loop\n\nNotebook ringkas untuk menjalankan instruksi berulang dengan `for`, `range()`, `while`, `break`, dan `continue`.", "title"),
  md("## Materi\n\nJalankan setiap cell dari atas ke bawah. Setiap konsep berada dalam satu cell code agar mudah dicoba dan diubah.", "instructions"),
  code(`# 1. for loop\n# for membaca setiap item dari sebuah kumpulan data.\n\nwarna = [\"biru\", \"kuning\", \"hijau\"]\n\nfor item in warna:\n    print(\"Warna hari ini:\", item)`, "for_list"),
  code(`# 2. for dengan list\n# Variable \`pemain\` menyimpan satu nilai berbeda pada setiap putaran.\n\npemain = [\"Alya\", \"Bima\", \"Citra\"]\n\nfor nama in pemain:\n    print(\"Halo,\", nama)`, "for_names"),
  code(`# 3. range()\n# range(1, 6) menghasilkan angka 1 sampai 5.\n\nfor nomor in range(1, 6):\n    print(\"Nomor antrean:\", nomor)`, "for_range"),
  code(`# 4. Menghitung total dengan for\n# Nilai total diperbarui pada setiap putaran.\n\nharga = [12000, 15000, 8000]\ntotal = 0\n\nfor nilai in harga:\n    total = total + nilai\n\nprint(\"Total belanja:\", total)`, "for_total"),
  code(`# 5. while loop\n# while mengulang selama kondisi masih bernilai True.\n\nenergi = 3\n\nwhile energi > 0:\n    print(\"Robot bergerak\")\n    energi = energi - 1\n\nprint(\"Energi habis\")`, "while_basic"),
  code(`# 6. Counter pada while\n# Counter perlu berubah agar loop dapat berhenti.\n\nputaran = 1\n\nwhile putaran <= 3:\n    print(\"Putaran\", putaran)\n    putaran = putaran + 1`, "while_counter"),
  code(`# 7. break\n# break menghentikan loop ketika tujuan sudah ditemukan.\n\nkapsul = [\"biru\", \"hijau\", \"emas\", \"merah\"]\n\nfor warna in kapsul:\n    if warna == \"emas\":\n        print(\"Stiker langka ditemukan!\")\n        break\n    print(\"Belum langka:\", warna)`, "break_example"),
  code(`# 8. continue\n# continue melewati satu item lalu melanjutkan ke item berikutnya.\n\nstiker = [\"bintang\", \"duplikat\", \"roket\", \"duplikat\"]\n\nfor item in stiker:\n    if item == \"duplikat\":\n        continue\n    print(\"Simpan stiker:\", item)`, "continue_example"),
  code(`# 9. Memilih loop\n# Gunakan for jika item atau jumlah putaran sudah diketahui.\n# Gunakan while jika perulangan bergantung pada kondisi yang berubah.\n\ncontoh_for = \"membaca setiap item dalam daftar menu\"\ncontoh_while = \"bermain selama nyawa masih ada\"\n\nprint(\"for:\", contoh_for)\nprint(\"while:\", contoh_while)`, "choose_loop"),
  md("## Practice\n\nSetiap practice berisi data awal dan target program. Tulis solusi pada cell kosong di bawahnya. Tidak ada jawaban yang disediakan.", "practice_section"),
  md("### Practice 1: Playlist Pagi\n\nGunakan `for` untuk menampilkan setiap lagu dalam daftar. Tampilkan format `Memutar: <nama lagu>`.", "practice_playlist"),
  code(`# Data awal\nplaylist = [\"Langit Pagi\", \"Kopi Hangat\", \"Jalan Santai\"]\n\n# Tulis solusi Practice 1 di bawah ini`, "practice_playlist_answer"),
  md("### Practice 2: Nomor Booth Festival\n\nGunakan `range()` untuk menampilkan nomor booth dari 1 sampai 8. Untuk setiap nomor, tampilkan `Booth <nomor> siap dibuka`.", "practice_booth"),
  code(`# Tulis solusi Practice 2 di bawah ini`, "practice_booth_answer"),
  md("### Practice 3: Mesin Arcade\n\nPemain memiliki sejumlah koin. Gunakan `while` untuk memainkan satu ronde selama koin masih lebih dari 0. Kurangi satu koin setiap ronde dan tampilkan sisa koin.", "practice_arcade"),
  code(`# Data awal\nkoin = 4\n\n# Tulis solusi Practice 3 di bawah ini`, "practice_arcade_answer"),
  md("### Practice 4: Berburu Stiker Langka\n\nPeriksa kapsul satu per satu dengan `for`. Lewati `duplikat` menggunakan `continue`. Hentikan pencarian dengan `break` ketika menemukan `langka`. Tampilkan setiap stiker yang disimpan.", "practice_sticker"),
  code(`# Data awal\nkapsul = [\"bunga\", \"duplikat\", \"bintang\", \"langka\", \"roket\"]\n\n# Tulis solusi Practice 4 di bawah ini`, "practice_sticker_answer"),
  md("### Practice 5: Robot Kurir Mini\n\nRobot memeriksa setiap paket dengan `for`. Gunakan `continue` untuk melewati paket `rusak`. Robot memiliki baterai yang berkurang satu setiap paket yang berhasil diproses. Gunakan `break` jika baterai habis. Tampilkan paket yang berhasil dikirim dan sisa baterai.", "practice_robot"),
  code(`# Data awal\npaket = [\"buku\", \"rusak\", \"stiker\", \"poster\", \"kartu\"]\nbaterai = 3\n\n# Tulis solusi Practice 5 di bawah ini`, "practice_robot_answer")
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
