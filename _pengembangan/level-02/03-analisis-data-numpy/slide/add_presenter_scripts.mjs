import path from 'node:path';
import { createHash } from 'node:crypto';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
import { pathToFileURL } from 'node:url';

const workspaceDir = '/Users/daf2a/Documents/python';
const SKILL_DIR = '/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const sourcePath = path.join(workspaceDir, 'level-02/03-analisis-data-numpy/slide/NumPy_Analisis_Data_Penjualan_Python.pptx');
const candidatePath = path.join(workspaceDir, '_pengembangan/level-02/03-analisis-data-numpy/slide/speaker-script-candidate.pptx');
const finalPath = path.join(workspaceDir, 'level-02/03-analisis-data-numpy/slide/NumPy_Analisis_Data_Penjualan_Python_Speaker_Notes.pptx');
const receiptPath = path.join(workspaceDir, '_pengembangan/level-02/03-analisis-data-numpy/validasi-slide/NumPy_Analisis_Data_Penjualan_Python_Speaker_Notes.validation.json');

const speakerScripts = [
`SLIDE 1 | NumPy untuk Analisis Data
Durasi: sekitar 1 menit

NASKAH
“Hari ini kita melanjutkan belajar NumPy untuk analisis data. Kita akan memakai data penjualan empat cabang. Kita mulai dari data Januari sampai Maret, lalu menambahkan April sebagai skenario. Di akhir, kita akan menjawab dua pertanyaan: cabang mana yang mencapai target, dan bulan mana yang mencatat total tertinggi?”

CATATAN
Angka pada kasus ini bersifat simulasi dan dinyatakan dalam juta rupiah.`,

`SLIDE 2 | Target belajar
Durasi: sekitar 2 menit

NASKAH
“Pada pertemuan sebelumnya kita sudah mengenal array satu dimensi dan ringkasan statistik dasar. Sekarang kita naik satu langkah. Kita akan membaca susunan matriks, mengambil bagian data, menerapkan operasi pada banyak nilai sekaligus, lalu membuat filter dan ringkasan. Semua itu akan dipakai untuk menjawab pertanyaan bisnis yang ada di kanan.”

TANYAKAN
“Kalau ingin membandingkan penjualan per cabang, informasi apa yang harus kita punya?”

ARAHKAN KE
Kita perlu tahu baris mana mewakili cabang, kolom mana mewakili bulan, dan aturan target yang dipakai.`,

`SLIDE 3 | Dataset penjualan
Durasi: sekitar 2 menit

NASKAH
“Ini tabel dasar kita. Setiap baris adalah satu cabang, sedangkan setiap kolom adalah satu bulan. Contohnya, angka 120 menunjukkan penjualan Jakarta pada Januari sebesar 120 juta rupiah. Data ini contoh untuk latihan, bukan laporan perusahaan nyata. Sebelum menghitung, biasakan membaca label baris dan kolom supaya angka tidak tertukar.”

CEK PEMAHAMAN
Minta siswa menyebutkan angka penjualan Surabaya pada Maret. Jawabannya 152 juta rupiah.`,

`SLIDE 4 | Struktur array
Durasi: sekitar 2 menit

NASKAH
“Array bulan berisi satu urutan dengan tiga nilai, jadi bentuknya satu dimensi dan shape-nya (3,). Matriks penjualan memiliki empat baris dan tiga kolom, jadi shape-nya (4, 3). NumPy menyimpan nilai dan bentuknya, tetapi tidak otomatis memahami bahwa baris itu cabang atau kolom itu bulan. Label tetap perlu kita cocokkan sendiri.”

TUNJUKKAN
Arahkan dari header Cabang ke baris Jakarta, lalu dari header Jan ke kolom pertama. Nanti posisi sel ditulis sebagai [baris, kolom].`,

`SLIDE 5 | Properti array
Durasi: sekitar 3 menit

NASKAH
“Kita bisa memeriksa array sebelum mengolahnya. ndim memberi jumlah dimensi. shape menunjukkan panjang setiap dimensi, di sini empat baris dan tiga kolom. size menghitung jumlah seluruh nilai, yaitu 12. dtype memberi tipe data. Karena data awal berisi bilangan bulat, tipenya integer. Setelah kita kalikan dengan faktor desimal, hasil proyeksi akan menggunakan bilangan desimal.”

CEK PEMAHAMAN
“Twelve berasal dari mana?” Arahkan ke empat cabang dikali tiga bulan. Tekankan bahwa size berbeda dari ndim.`,

`SLIDE 6 | Indexing dan slicing
Durasi: sekitar 4 menit

NASKAH
“Indeks NumPy mulai dari nol. Jadi penjualan[0, 1] mengambil baris pertama dan kolom kedua, yaitu Jakarta pada Februari dengan nilai 135. Tanda titik dua sebelum koma mengambil semua cabang pada Januari. Pada contoh terakhir, baris 1 sampai sebelum 4 dengan langkah 2 berarti baris Bandung dan Medan. Bagian 1: setelah koma mengambil Februari sampai Maret.”

HASIL CONTOH
penjualan[0, 1] menghasilkan 135.
penjualan[:, 0] menghasilkan [120, 98, 145, 87].
penjualan[1:4:2, 1:] menghasilkan [[108, 112], [95, 103]].

MISKONSEPSI
Angka setelah tanda titik dua adalah batas akhir dan tidak ikut terambil.

REFERENSI
https://numpy.org/doc/stable/user/basics.indexing.html`,

`SLIDE 7 | Reshape dan transpose
Durasi: sekitar 4 menit

NASKAH
“raw berisi 12 nilai dalam satu urutan. reshape(4, 3) membacanya kembali sebagai empat baris dan tiga kolom. Karena nilai ditulis per cabang, hasilnya kembali menjadi tabel cabang dan bulan. Setelah itu, .T menukar baris dan kolom, sehingga bulan menjadi baris. Nilainya tidak bertambah atau hilang. Bentuk baru harus tetap memiliki 12 tempat.”

TUNJUKKAN
Bandingkan shape (12,), (4, 3), dan (3, 4). Ingatkan bahwa reshape bergantung pada urutan nilai di raw.

REFERENSI
https://numpy.org/doc/stable/reference/generated/numpy.reshape.html`,

`SLIDE 8 | Practice tengah
Durasi: 15 menit

NASKAH
“Sekarang kerjakan latihan ini di notebook. Susun raw menjadi matriks empat kali tiga, ambil kolom Februari, pilih baris Jakarta dan Surabaya, lalu transpose. Jangan langsung menjalankan kode. Pastikan dulu urutan nilai di raw sesuai urutan cabang yang diberikan. Kerjakan sendiri atau berpasangan. Setelah itu kita cocokkan bentuk dan maknanya bersama.”

PANDUAN PENGAJAR
Beri waktu sekitar 10 menit untuk mencoba, lalu gunakan sisa waktu untuk membahas hasil dan kesalahan indeks.

KUNCI JAWABAN
matriks = raw.reshape(4, 3)
kolom_februari = matriks[:, 1] menghasilkan [151, 112, 129, 108].
baris_pilihan = matriks[0:3:2, :] menghasilkan [[145, 151, 162], [132, 129, 140]].
tampilan_bulan = matriks.T memiliki shape (3, 4).

TRANSISI
“Sekarang kita sudah bisa memilih dan menyusun data. Berikutnya kita ubah semua nilainya dengan satu operasi.”`,

`SLIDE 9 | Operasi vektor
Durasi: sekitar 3 menit

NASKAH
“Perkalian ini dilakukan pada setiap nilai di dalam matriks. Faktor 0.95 berarti setiap angka turun lima persen, sedangkan 1.05 berarti naik lima persen. Misalnya, 120 dikali 1.05 menjadi 126. Kita tidak perlu menulis loop untuk mengalikan sel satu per satu. Bentuk matriks hasil tetap sama, yaitu empat kali tiga.”

CATATAN
Faktor ini hanya asumsi skenario untuk belajar operasi vektor, bukan perubahan aktual pada penjualan.`,

`SLIDE 10 | Broadcasting per bulan
Durasi: sekitar 4 menit

NASKAH
“Sekarang setiap bulan memiliki faktor berbeda. Januari dikali 1.00, Februari dikali 1.04, dan Maret dikali 1.08. Karena faktor memiliki tiga nilai, NumPy mencocokkannya dengan tiga kolom terakhir pada matriks. Faktor yang sama dipakai untuk semua cabang pada bulan tersebut. Misalnya, Jakarta pada Februari menjadi 135 dikali 1.04, hasilnya 140.40. Shape hasil tetap (4, 3).”

CEK PEMAHAMAN
Tanyakan: faktor 1.08 diterapkan ke cabang yang mana? Jawabannya semua cabang pada kolom Maret.

REFERENSI
https://numpy.org/doc/stable/user/basics.broadcasting.html`,

`SLIDE 11 | Broadcasting per cabang
Durasi: sekitar 5 menit

NASKAH
“Kalau kita punya satu faktor untuk setiap cabang, tujuan kita adalah mengalikan satu baris penuh dengan satu faktor. Vektor faktor awal berbentuk (4,). Bentuk itu disejajarkan dari dimensi paling kanan dengan (4, 3), sehingga angka empat dibandingkan dengan tiga dan tidak cocok. Kita bentuk ulang vektornya menjadi (4, 1). Dimensi satu ini bisa menyesuaikan ke tiga bulan, sementara empat baris tetap cocok dengan empat cabang.”

TUNJUKKAN
Bandingkan bentuk (4,) dengan (4, 3), lalu (4, 1) dengan (4, 3). Beri satu contoh: faktor Jakarta 1.05 diterapkan ke ketiga nilai pada baris Jakarta.

REFERENSI
https://numpy.org/doc/stable/user/basics.broadcasting.html`,

`SLIDE 12 | Boolean mask
Durasi: sekitar 4 menit

NASKAH
“Perbandingan menghasilkan nilai True atau False. Contoh pertama memeriksa penjualan Januari yang minimal 100 juta. Hasilnya True untuk Jakarta dan Surabaya, lalu mask itu dipakai untuk memilih nama cabang. Contoh kedua membandingkan seluruh proyeksi dengan target tiap bulan. target_bulan berbentuk tiga nilai sehingga cocok dengan tiga kolom. Saat matriks diambil menggunakan satu mask Boolean, nilai yang lolos dikumpulkan sebagai pilihan satu dimensi.”

CEK PEMAHAMAN
Untuk Januari, mask-nya [True, False, True, False], jadi cabang yang dipilih Jakarta dan Surabaya.

REFERENSI
https://numpy.org/doc/stable/user/basics.indexing.html`,

`SLIDE 13 | np.where
Durasi: sekitar 3 menit

NASKAH
“Kalau kita ingin mempertahankan bentuk matriks tetapi mengganti setiap sel menjadi label, gunakan np.where. Fungsi ini membaca kondisi, lalu memilih label pertama saat kondisi benar dan label kedua saat kondisi salah. Contohnya, proyeksi Bandung pada Maret sebesar 120.96, lebih besar dari target 120, jadi statusnya mencapai target. Medan pada Maret sebesar 111.24, jadi statusnya di bawah target. Hasilnya tetap berbentuk empat kali tiga.”

PESAN UTAMA
Mask membantu memilih nilai. np.where membantu menghasilkan nilai atau label pada setiap posisi.

REFERENSI
https://numpy.org/doc/stable/reference/generated/numpy.where.html`,

`SLIDE 14 | Agregasi dengan axis
Durasi: sekitar 4 menit

NASKAH
“axis menentukan dimensi mana yang kita jumlahkan. Untuk total per cabang, kita menjumlahkan kolom pada setiap baris dengan axis=1. Hasilnya satu angka untuk tiap cabang dan shape-nya (4,). Untuk total per bulan, kita menjumlahkan baris pada setiap kolom dengan axis=0. Hasilnya tiga angka dan shape-nya (3,). np.argmax memberi posisi nilai terbesar. Kita pakai posisi itu untuk mengambil nama cabang atau bulan.”

HASIL PADA PROYEKSI Q1
Total cabang sekitar [398.64, 331.28, 452.68, 297.04]. Surabaya tertinggi.
Total bulan sekitar [450.00, 495.04, 534.60]. Maret tertinggi.

REFERENSI
https://numpy.org/doc/stable/reference/generated/numpy.argmax.html`,

`SLIDE 15 | Menggabungkan array
Durasi: sekitar 4 menit

NASKAH
“Untuk menambahkan April sebagai kolom baru, array April perlu memiliki satu nilai untuk setiap cabang. Karena masih berupa vektor dengan shape (4,), kita ubah menjadi kolom dengan shape (4, 1). Setelah digabungkan dengan data Januari sampai Maret pada axis=1, bentuknya menjadi (4, 4). Jumlah baris harus tetap sama karena kita menggabungkan kolom. Nilai April di sini masih nilai dasar sebelum faktor April diterapkan.”

CEK PEMAHAMAN
Tanyakan apa yang terjadi jika April berisi lima nilai. Bentuk barisnya tidak cocok dengan matriks empat cabang.

REFERENSI
https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html`,

`SLIDE 16 | Practice akhir
Durasi: 24 menit

NASKAH
“Gunakan semua konsep hari ini untuk menilai skenario Januari sampai April. Gabungkan nilai dasar April, kalikan setiap bulan dengan faktornya, hitung total per cabang dan per bulan, lalu periksa target. Perhatikan bahwa target_bulan berlaku pada setiap sel di kolom bulan yang sama. target_cabang dibandingkan dengan total empat bulan per cabang. Sisakan waktu untuk menulis kesimpulan dengan angka pendukung.”

PANDUAN PENGAJAR
Berikan waktu 18 menit untuk mengerjakan dan 6 menit untuk membahas hasil. Jika siswa kesulitan, beri petunjuk bertahap: ubah April menjadi kolom, gunakan concatenate dengan axis=1, lalu kalikan dengan faktor berbentuk (4,).

KUNCI JAWABAN
Shape matriks setelah April ditambahkan: (4, 4).
Proyeksi per baris:
Jakarta [120.00, 140.40, 138.24, 145.20].
Bandung [98.00, 112.32, 120.96, 128.70].
Surabaya [145.00, 143.52, 164.16, 176.00].
Medan [87.00, 98.80, 111.24, 118.80].
Total per cabang: [543.84, 459.98, 628.68, 415.84]. Jakarta, Bandung, dan Surabaya mencapai target cabang. Medan kurang 4.16 juta dari target 420.
Total per bulan: [450.00, 495.04, 534.60, 568.70]. April memberi total tertinggi. Surabaya memiliki total cabang tertinggi.

CONTOH KESIMPULAN
“Medan perlu diperhatikan karena total proyeksinya 415.84 juta, sedikit di bawah target 420 juta. Surabaya menjadi cabang dengan total tertinggi, yaitu 628.68 juta, sedangkan April menjadi bulan dengan total tertinggi.”`,

`SLIDE 17 | Ringkasan
Durasi: sekitar 3 menit

NASKAH
“Kita sudah bergerak dari membaca bentuk array sampai merangkum skenario penjualan. Shape membantu memastikan susunan data. Broadcasting menerapkan faktor sesuai arah yang kita inginkan. Mask dan np.where memeriksa target, sedangkan axis menentukan arah ringkasan. Sebelum selesai, jawab dua pertanyaan exit ticket ini dengan melihat kembali bentuk matriksnya.”

JAWABAN EXIT TICKET
axis=1 menjumlahkan kolom pada setiap baris, sehingga memberi satu total per cabang. Faktor per cabang dibentuk menjadi (4, 1) agar setiap faktor sejajar dengan satu baris dan dapat diterapkan ke semua kolom bulan.

PENUTUP
Minta siswa menyebutkan satu hasil numerik dari practice akhir yang mendukung kesimpulan mereka.`
];

if (speakerScripts.length !== 17) throw new Error(`Expected 17 scripts, received ${speakerScripts.length}`);
const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));
const actualSlideCount = presentation.slides.items?.length ?? presentation.slides.count ?? 0;
if (actualSlideCount && actualSlideCount !== speakerScripts.length) {
  throw new Error(`Deck has ${actualSlideCount} slides, expected ${speakerScripts.length}`);
}
for (let index = 0; index < speakerScripts.length; index += 1) {
  const slide = presentation.slides.getItem(index);
  slide.speakerNotes.textFrame.setText(speakerScripts[index]);
  slide.speakerNotes.setVisible(true);
}
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, 'container_tools/artifact_tool_utils.mjs')).href);
const sourceSha256 = createHash('sha256').update(await (await import('node:fs/promises')).readFile(sourcePath)).digest('hex');
const result = await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: '/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',
  integrityValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(SKILL_DIR, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: [
    '--expected-slide-size-emu', '12192000,6858000',
    '--expected-slide-count', '17',
    '--validate-bullet-geometry',
    '--validate-heading-fit',
    '--require-native-table-slide', '3',
  ],
  explicitTotalSlideCount: 17,
  requiredNativeTableOwnerSlides: [3],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: {
    basis: 'reference',
    families: ['SF Pro Display', 'SF Pro Text', 'SF Mono'],
    referencePath: sourcePath,
    referenceSha256: sourceSha256,
  },
  verifyArtifactToolImport: true,
  receiptPath,
});
console.log(JSON.stringify({ finalPath, actualSlideCount: speakerScripts.length, result }, null, 2));
