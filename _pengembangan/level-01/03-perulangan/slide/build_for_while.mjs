import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
import { pathToFileURL } from "node:url"
import { Presentation, PresentationFile } from "@oai/artifact-tool"

const workspaceDir = "/Users/daf2a/Documents/python"
const SKILL_DIR = "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.903.11416/skills/presentations"
const TMP_DIR = path.join(workspaceDir, "_pengembangan/level-01/03-perulangan/slide")
const FINAL_PPTX = path.join(workspaceDir, "level-01/03-perulangan/slide/For_While_Loop_Python.pptx")
const RUNTIME_PYTHON = "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
const sourcePath = path.join(workspaceDir, "level-01/02-kondisional/slide/Conditional_Statements_Python.pptx")
const photoPath = path.join(TMP_DIR, "assets/packages-conveyor.jpg")

const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href)

const C = {
  navy: "#111A30",
  blue: "#306B9D",
  softBlue: "#E8F0F7",
  slate: "#50607A",
  yellow: "#FFD33D",
  paleYellow: "#FFF5C7",
  green: "#DDF7E7",
  greenDark: "#168342",
  red: "#FBE1E1",
  redDark: "#B91C1C",
  code: "#111A2D",
  white: "#FFFFFF",
  line: "#CBD7E4"
}

const fonts = { display: "SF Pro Display", text: "SF Pro Text", mono: "SF Mono" }
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } })
const photoBytes = await fs.readFile(photoPath)

function addText(slide, text, left, top, width, height, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { fill: "none", width: 0 }
  })
  shape.text = text
  shape.text.style = {
    typeface: fonts.text,
    fontSize: 24,
    color: C.navy,
    autoFit: "shrinkText",
    ...style
  }
  return shape
}

function addRect(slide, left, top, width, height, fill, line = { fill: "none", width: 0 }, radius = 0) {
  return slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill,
    line,
    borderRadius: radius
  })
}

function addTitle(slide, title, subtitle = "") {
  addText(slide, title, 72, 34, 1136, 70, { typeface: fonts.display, fontSize: 40, bold: true, color: C.navy })
  addRect(slide, 72, 120, 68, 5, C.yellow)
  if (subtitle) addText(slide, subtitle, 160, 112, 970, 38, { fontSize: 20, color: C.slate })
}

function addCodeFrame(slide, text, left, top, width, height) {
  addRect(slide, left, top, width, height, C.code, { fill: "none", width: 0 }, 16)
  addRect(slide, left + 22, top + 20, 10, 10, "#FA607F", { fill: "none", width: 0 }, 10)
  addRect(slide, left + 40, top + 20, 10, 10, "#FFD34D", { fill: "none", width: 0 }, 10)
  addRect(slide, left + 58, top + 20, 10, 10, "#48D78A", { fill: "none", width: 0 }, 10)
  addText(slide, text, left + 28, top + 62, width - 56, height - 82, {
    typeface: fonts.mono,
    fontSize: 21,
    color: C.white,
    autoFit: "shrinkText"
  })
}

function addPill(slide, text, left, top, width, fill, color = C.navy) {
  const p = addRect(slide, left, top, width, 48, fill, { fill: C.blue, width: 1.5 }, 16)
  p.text = text
  p.text.style = { typeface: fonts.display, fontSize: 20, bold: true, color, autoFit: "shrinkText", textAlign: "center" }
  return p
}

function addArrow(slide, left, top, width, height, color = C.blue) {
  return slide.shapes.add({
    geometry: "rightArrow",
    position: { left, top, width, height },
    fill: color,
    line: { fill: color, width: 0 }
  })
}

function addSource(slide, lines) {
  slide.speakerNotes.textFrame.setText(`[Sources]\n${lines.map(line => `- ${line}`).join("\n")}`)
  slide.speakerNotes.setVisible(true)
}

function flowBox(slide, text, left, top, width, height, fill = C.softBlue, color = C.blue) {
  const box = addRect(slide, left, top, width, height, fill, { fill: color, width: 2 }, 16)
  box.text = text
  box.text.style = { typeface: fonts.display, fontSize: 22, bold: true, color: C.navy, autoFit: "shrinkText", textAlign: "center" }
  return box
}

// Slide 0: cover
{
  const s = deck.slides.add()
  s.background.fill = C.white
  addText(s, "PYTHON FUNDAMENTALS", 72, 108, 590, 36, { typeface: fonts.display, fontSize: 19, bold: true, color: C.blue })
  addText(s, "For Loop\ndan While Loop", 72, 170, 620, 170, { typeface: fonts.display, fontSize: 62, bold: true, color: C.navy })
  addText(s, "Membuat program menjalankan tugas berulang dengan aturan yang jelas", 72, 400, 590, 78, { fontSize: 28, color: C.slate })
  addPill(s, "for · range() · while · break · continue", 72, 540, 520, C.paleYellow)
  addRect(s, 742, 0, 18, 720, C.blue)
  s.images.add({ blob: photoBytes, contentType: "image/jpeg", alt: "Packages moving on a conveyor belt", fit: "cover", position: { left: 760, top: 0, width: 520, height: 720 } })
  addSource(s, [
    "Wikimedia Commons, Packages on UPS conveyor belt.jpg, USDA public domain",
    "https://commons.wikimedia.org/wiki/File:Packages_on_UPS_conveyor_belt.jpg"
  ])
}

// 1: analogy
{
  const s = deck.slides.add()
  addTitle(s, "Perulangan seperti robot memproses paket", "Satu instruksi dapat berlaku berkali-kali")
  addText(s, "Bayangkan robot di gudang. Ia membaca paket satu per satu, lalu melakukan tindakan yang sama pada setiap paket.", 72, 182, 490, 110, { fontSize: 28, color: C.slate })
  flowBox(s, "Paket 1", 620, 218, 160, 86)
  addArrow(s, 795, 242, 74, 38)
  flowBox(s, "Paket 2", 884, 218, 160, 86)
  addArrow(s, 1059, 242, 74, 38)
  flowBox(s, "Paket 3", 1148, 218, 110, 86)
  addText(s, "Loop membantu kita menghindari penulisan instruksi yang sama berulang kali.", 72, 372, 1050, 55, { fontSize: 27, color: C.navy, bold: true })
  addRect(s, 72, 482, 1136, 104, C.paleYellow, { fill: "#E6BC1E", width: 1.5 }, 14)
  addText(s, "Intinya: pilih data atau kondisi yang akan diulang, lalu tulis satu blok instruksi.", 102, 510, 1050, 40, { fontSize: 24, color: C.navy })
  addSource(s, ["Python documentation, More Control Flow Tools", "https://docs.python.org/3/tutorial/controlflow.html"])
}

// 2: choose loop
{
  const s = deck.slides.add()
  addTitle(s, "Dua cara mengulang", "Pilih berdasarkan hal yang ingin diperiksa")
  flowBox(s, "for", 120, 210, 360, 120, C.softBlue)
  addText(s, "Ulangi untuk setiap item\ndalam kumpulan data", 150, 356, 300, 72, { fontSize: 24, color: C.slate, textAlign: "center" })
  addText(s, "Daftar menu, nama siswa, atau angka dalam list", 120, 468, 360, 65, { fontSize: 20, color: C.navy, textAlign: "center" })
  flowBox(s, "while", 800, 210, 360, 120, C.paleYellow, "#E1B400")
  addText(s, "Ulangi selama\nkondisi masih True", 830, 356, 300, 72, { fontSize: 24, color: C.slate, textAlign: "center" })
  addText(s, "Sisa nyawa game, saldo, atau jumlah percobaan", 800, 468, 360, 65, { fontSize: 20, color: C.navy, textAlign: "center" })
  addArrow(s, 546, 258, 184, 42, "#A3B7CB")
  addText(s, "Keduanya mengulang blok kode", 380, 570, 520, 34, { fontSize: 22, color: C.blue, bold: true, textAlign: "center" })
  addSource(s, ["Python documentation, More Control Flow Tools", "https://docs.python.org/3/tutorial/controlflow.html"])
}

// 3: for syntax
{
  const s = deck.slides.add()
  addTitle(s, "for membaca item satu per satu", "Setiap putaran memberi nilai berikutnya kepada variable loop")
  addCodeFrame(s, "menu = [\"Nasi goreng\", \"Mie ayam\", \"Es teh\"]\n\nfor item in menu:\n    print(item)", 72, 176, 610, 326)
  addText(s, "Pada setiap putaran, variable `item` berisi satu nama menu.", 72, 540, 610, 54, { fontSize: 23, color: C.slate })
  flowBox(s, "Nasi goreng", 800, 218, 290, 70, C.green, C.greenDark)
  addArrow(s, 922, 302, 42, 72)
  flowBox(s, "Mie ayam", 800, 390, 290, 70, C.green, C.greenDark)
  addArrow(s, 922, 474, 42, 72)
  flowBox(s, "Es teh", 800, 562, 290, 70, C.green, C.greenDark)
  addSource(s, ["Python documentation, for Statements", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"])
}

// 4: for with list
{
  const s = deck.slides.add()
  addTitle(s, "for cocok untuk daftar yang sudah ada", "Loop berakhir setelah item terakhir selesai diproses")
  addText(s, "Contoh: tampilkan daftar pemain yang sudah mendaftar.", 72, 170, 650, 42, { fontSize: 25, color: C.slate })
  addCodeFrame(s, "pemain = [\"Alya\", \"Bima\", \"Citra\"]\n\nfor nama in pemain:\n    print(\"Halo,\", nama)", 72, 236, 590, 292)
  flowBox(s, "Alya", 776, 220, 310, 70, C.softBlue)
  flowBox(s, "Bima", 776, 326, 310, 70, C.softBlue)
  flowBox(s, "Citra", 776, 432, 310, 70, C.softBlue)
  addText(s, "Tidak perlu membuat counter sendiri.", 766, 562, 350, 40, { fontSize: 22, bold: true, color: C.blue, textAlign: "center" })
  addSource(s, ["Python documentation, for Statements", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"])
}

// 5: range
{
  const s = deck.slides.add()
  addTitle(s, "range() membuat urutan angka", "Gunakan saat jumlah putaran sudah diketahui")
  addCodeFrame(s, "for nomor in range(1, 6):\n    print(\"Antrean\", nomor)", 72, 186, 515, 242)
  const nums = ["1", "2", "3", "4", "5"]
  nums.forEach((n, i) => {
    flowBox(s, n, 656 + i * 108, 260, 76, 76, i === 0 ? C.paleYellow : C.softBlue)
    if (i < nums.length - 1) addArrow(s, 738 + i * 108, 280, 22, 34, "#A3B7CB")
  })
  addRect(s, 72, 510, 1136, 92, C.softBlue, { fill: C.blue, width: 1.5 }, 14)
  addText(s, "range(5) menghasilkan 0 sampai 4. range(1, 6) menghasilkan 1 sampai 5.", 102, 537, 1050, 34, { fontSize: 24, color: C.navy })
  addSource(s, ["Python documentation, The range() Function", "https://docs.python.org/3/tutorial/controlflow.html#the-range-function"])
}

// 6: accumulation
{
  const s = deck.slides.add()
  addTitle(s, "for dapat menghitung total", "Simpan hasil sementara lalu perbarui pada setiap putaran")
  addCodeFrame(s, "harga = [12000, 15000, 8000]\ntotal = 0\n\nfor nilai in harga:\n    total = total + nilai\n\nprint(total)", 72, 168, 610, 376)
  addText(s, "12.000", 820, 208, 220, 40, { fontSize: 27, bold: true, color: C.navy, textAlign: "center" })
  addArrow(s, 895, 258, 62, 38)
  addText(s, "27.000", 820, 320, 220, 40, { fontSize: 27, bold: true, color: C.navy, textAlign: "center" })
  addArrow(s, 895, 370, 62, 38)
  addText(s, "35.000", 820, 432, 220, 40, { fontSize: 27, bold: true, color: C.greenDark, textAlign: "center" })
  addText(s, "Setiap harga ditambahkan ke total yang sudah ada.", 750, 530, 380, 46, { fontSize: 21, color: C.slate, textAlign: "center" })
  addSource(s, ["Python documentation, for Statements", "https://docs.python.org/3/tutorial/controlflow.html#for-statements"])
}

// 7: while syntax
{
  const s = deck.slides.add()
  addTitle(s, "while mengulang selama kondisi benar", "Periksa kondisi sebelum setiap putaran")
  addCodeFrame(s, "energi = 3\n\nwhile energi > 0:\n    print(\"Robot bergerak\")\n    energi = energi - 1", 72, 176, 620, 326)
  flowBox(s, "energi > 0?", 888, 188, 220, 72, C.paleYellow, "#E1B400")
  addArrow(s, 978, 274, 42, 58)
  flowBox(s, "Jalankan aksi", 850, 346, 296, 72, C.softBlue)
  addArrow(s, 978, 432, 42, 58)
  flowBox(s, "Kurangi energi", 850, 504, 296, 72, C.green, C.greenDark)
  addText(s, "Jika kondisi False, loop selesai.", 72, 548, 620, 40, { fontSize: 23, color: C.slate })
  addSource(s, ["Python documentation, while Statements", "https://docs.python.org/3/tutorial/introduction.html#first-steps-towards-programming"])
}

// 8: counter
{
  const s = deck.slides.add()
  addTitle(s, "Counter membantu while berhenti", "Nilai kondisi perlu berubah dari satu putaran ke putaran berikutnya")
  addCodeFrame(s, "putaran = 1\n\nwhile putaran <= 3:\n    print(\"Putaran\", putaran)\n    putaran = putaran + 1", 72, 174, 620, 330)
  const vals = ["1", "2", "3", "4"]
  vals.forEach((v, i) => {
    const fill = i < 3 ? C.green : C.red
    const border = i < 3 ? C.greenDark : C.redDark
    flowBox(s, `putaran = ${v}`, 806, 180 + i * 104, 330, 62, fill, border)
    if (i < 3) addArrow(s, 951, 250 + i * 104, 38, 42, "#A3B7CB")
  })
  addText(s, "Saat nilai menjadi 4, kondisi `putaran <= 3` bernilai False.", 72, 550, 1080, 36, { fontSize: 23, color: C.slate })
  addSource(s, ["Python documentation, while Statements", "https://docs.python.org/3/tutorial/introduction.html#first-steps-towards-programming"])
}

// 9: break continue
{
  const s = deck.slides.add()
  addTitle(s, "break dan continue mengatur jalannya loop", "Keduanya bekerja di dalam blok perulangan")
  flowBox(s, "break", 126, 202, 250, 86, C.red, C.redDark)
  addText(s, "Menghentikan loop sepenuhnya saat tujuan sudah tercapai.", 110, 322, 282, 90, { fontSize: 23, color: C.slate, textAlign: "center" })
  addCodeFrame(s, "if item == \"stiker langka\":\n    break", 80, 454, 340, 126)
  flowBox(s, "continue", 838, 202, 250, 86, C.green, C.greenDark)
  addText(s, "Melewati putaran saat ini, lalu lanjut ke item berikutnya.", 822, 322, 282, 90, { fontSize: 23, color: C.slate, textAlign: "center" })
  addCodeFrame(s, "if item == \"duplikat\":\n    continue", 790, 454, 340, 126)
  addArrow(s, 454, 268, 286, 38, "#A3B7CB")
  addSource(s, ["Python documentation, break and continue Statements", "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements"])
}

// 10: infinite loop
{
  const s = deck.slides.add()
  addTitle(s, "Infinite loop terjadi saat kondisi tidak berubah", "while terus berjalan karena kondisi tetap True")
  addCodeFrame(s, "nyawa = 3\n\nwhile nyawa > 0:\n    print(\"Game berjalan\")\n    # nyawa tidak pernah dikurangi", 72, 180, 600, 310)
  addRect(s, 762, 190, 354, 230, C.red, { fill: C.redDark, width: 2 }, 18)
  addText(s, "nyawa tetap 3\n\nkondisi tetap True\n\nloop tidak selesai", 806, 225, 266, 150, { typeface: fonts.display, fontSize: 25, bold: true, color: C.redDark, textAlign: "center" })
  addRect(s, 72, 544, 1040, 56, C.paleYellow, { fill: "#E6BC1E", width: 1.5 }, 12)
  addText(s, "Periksa apakah nilai dalam kondisi `while` benar-benar berubah.", 98, 557, 980, 30, { fontSize: 22, color: C.navy })
  addSource(s, ["Python documentation, while Statements", "https://docs.python.org/3/tutorial/introduction.html#first-steps-towards-programming"])
}

// 11: comparison table
{
  const s = deck.slides.add()
  addTitle(s, "for atau while", "Pilih struktur yang paling sesuai dengan situasi")
  const table = s.tables.add({
    rows: 4,
    columns: 3,
    left: 72,
    top: 190,
    width: 1136,
    height: 330,
    values: [
      ["Situasi", "Pilihan", "Alasan"],
      ["Membaca semua nama siswa", "for", "Daftar item sudah tersedia"],
      ["Menampilkan nomor 1 sampai 10", "for + range()", "Jumlah putaran sudah jelas"],
      ["Bermain selama nyawa masih ada", "while", "Loop bergantung pada kondisi"],
    ]
  })
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 3 }).assign({
    fill: C.navy,
    textStyle: { typeface: fonts.display, fontSize: 20, bold: true, color: C.white },
    margins: { left: 16, right: 16, top: 12, bottom: 12 }
  })
  table.cells.block({ row: 1, column: 0, rowCount: 3, columnCount: 3 }).assign({
    fill: C.white,
    textStyle: { typeface: fonts.text, fontSize: 18, color: C.navy },
    margins: { left: 16, right: 16, top: 12, bottom: 12 }
  })
  table.getCell(1, 1).fill = C.softBlue
  table.getCell(2, 1).fill = C.softBlue
  table.getCell(3, 1).fill = C.paleYellow
  table.borders.assign({ style: "solid", fill: C.line, width: 1 })
  addText(s, "Aturan singkat: gunakan `for` untuk urutan yang diketahui, gunakan `while` untuk kondisi yang berubah.", 72, 570, 1120, 42, { fontSize: 23, color: C.blue, bold: true })
  addSource(s, ["Python documentation, More Control Flow Tools", "https://docs.python.org/3/tutorial/controlflow.html"])
}

const stagingDir = path.join(workspaceDir, "_pengembangan/level-01/03-perulangan/validasi-slide")
await fs.mkdir(stagingDir, { recursive: true })
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true })
const candidatePath = path.join(stagingDir, "for_while_candidate.pptx")
await (await PresentationFile.exportPptx(deck)).save(candidatePath)
const referenceSha256 = crypto.createHash("sha256").update(await fs.readFile(sourcePath)).digest("hex")
const result = await finalizePresentation({
  explicitTotalSlideCount: 12,
  requiredNativeTableOwnerSlides: [12],
  sourceTemplatePath: sourcePath,
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit", "--require-native-table-slide", "12"],
  fontPolicy: { basis: "reference", families: [fonts.display, fonts.text, fonts.mono], referencePath: sourcePath, referenceSha256 },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "For_While_Loop_Python.validation.json")
})
console.log(JSON.stringify({ finalPath: FINAL_PPTX, warnings: result.warnings ?? [] }, null, 2))
