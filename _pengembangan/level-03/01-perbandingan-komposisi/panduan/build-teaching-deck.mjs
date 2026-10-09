import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

try {
const ROOT = "/Users/daf2a/Documents/python";
const SKILL = "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations";
const WORK = path.join(ROOT, "_pengembangan/level-03/01-perbandingan-komposisi/panduan");
const TOPIC = path.join(ROOT, "level-03/01-perbandingan-komposisi");
const SOURCE = path.join(TOPIC, "slide/Visualisasi_Data_Perbandingan_dan_Komposisi.pptx");
const OUTPUT = path.join(TOPIC, "slide/Visualisasi_Data_Perbandingan_dan_Komposisi_dengan_Kode.pptx");
const PYTHON = "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
process.env.RUNTIME_NODE_MODULES ??= "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
process.env.RUNTIME_NODE ??= process.execPath;
const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL,"container_tools/artifact_tool_utils.mjs")).href);
const deck = await PresentationFile.importPptx(await FileBlob.load(SOURCE));
const original = [...deck.slides.items];
if (original.length !== 14) throw new Error("Expected the original 14-slide deck");
const guide = await fs.readFile(path.join(TOPIC,"PANDUAN_MENGAJAR.md"),"utf8");
const sourceHash = createHash("sha256").update(await fs.readFile(SOURCE)).digest("hex");

const additions = [
  { after:4, number:5, title:"Kode: bar chart", subtitle:"Ringkas unit per kategori, lalu gambar batang horizontal", footer:"Notebook blok 2–3. Data penjualan disiapkan pada blok 1.",
    code:`total_kategori = (
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
plt.show()` },
  { after:5, number:7, title:"Kode: count plot", subtitle:"Setiap elemen daftar mewakili satu pesanan", footer:"Notebook blok 4. value_counts() menghitung kemunculan kategori.",
    code:`kategori_pesanan = [
    "Buku", "Alat Tulis", "Makanan", "Buku", "Minuman", "Makanan",
    "Aksesori", "Alat Tulis", "Makanan", "Minuman", "Buku", "Makanan",
    "Alat Tulis", "Buku", "Makanan", "Aksesori", "Minuman", "Alat Tulis",
    "Makanan", "Makanan", "Alat Tulis",
]
frekuensi = pd.Series(kategori_pesanan).value_counts()
ax = frekuensi.plot(kind="bar", color="#F5D36A", figsize=(7, 4))
ax.set_xlabel("Kategori")
ax.set_ylabel("Jumlah pesanan")
plt.xticks(rotation=25, ha="right")
plt.tight_layout()
plt.show()` },
  { after:6, number:9, title:"Kode: grouped bar", subtitle:"Baris tabel menjadi kategori, kolom menjadi seri cabang", footer:"Notebook blok 5. Periksa hasil pivot dan legenda sebelum membaca warna.",
    code:`tabel_cabang = penjualan.pivot(
    index="Kategori", columns="Cabang", values="Unit"
)
print(tabel_cabang)
ax = tabel_cabang.plot(kind="bar", figsize=(9, 4))
ax.set_xlabel("Kategori")
ax.set_ylabel("Unit terjual")
ax.legend(title="Cabang")
plt.xticks(rotation=20, ha="right")
plt.tight_layout()
plt.show()` },
  { after:8, number:12, title:"Kode: stacked bar dan persentase", subtitle:"Transpose tabel, hitung total baris, lalu bagi setiap komponen", footer:"Notebook blok 8. Stacked bar memakai unit, versi 100% memakai persentase.",
    code:`per_cabang = tabel_cabang.T
total_cabang = per_cabang.sum(axis=1)
persentase = per_cabang.div(total_cabang, axis=0) * 100

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
per_cabang.plot(kind="bar", stacked=True, ax=axes[0])
persentase.plot(kind="bar", stacked=True, ax=axes[1])
axes[0].set_ylabel("Unit terjual")
axes[1].set_ylabel("Bagian dari total cabang (%)")
axes[1].set_ylim(0, 100)
plt.tight_layout()
plt.show()` },
  { after:9, number:14, title:"Kode: pie chart dan donut chart", subtitle:"Ambil satu cabang untuk menentukan total satu lingkaran", footer:"Notebook blok 9. width mengatur tebal cincin, bukan persentase data.",
    code:`utara = tabel_cabang["Utara"]
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
axes[0].pie(utara, labels=utara.index,
            autopct="%1.1f%%", startangle=90)
axes[1].pie(utara, labels=utara.index,
            autopct="%1.1f%%", startangle=90,
            wedgeprops={"width": 0.42})
axes[0].set_title("Pie: cabang Utara")
axes[1].set_title("Donut: cabang Utara")
plt.tight_layout()
plt.show()` },
  { after:10, number:16, title:"Kode: treemap", subtitle:"Kategori menjadi induk, cabang menjadi kotak anak", footer:"Blok 10 notebook memakai variasi Cabang → Kategori dan warna berdasarkan Unit.",
    code:`fig = px.treemap(
    penjualan,
    path=["Kategori", "Cabang"],
    values="Unit",
    color="Kategori",
    title="Unit terjual menurut kategori dan cabang",
)
fig.show()` },
  { after:11, number:18, title:"Kode: radar chart", subtitle:"Samakan kategori dan skala, lalu tutup daftar titik", footer:"Notebook blok 11. Sudut dan nilai sama-sama ditambah titik pertama di akhir.",
    leftLabel:"1. Siapkan persentase dan sudut", rightLabel:"2. Gambar profil tiap cabang",
    leftCode:`pangsa = tabel_cabang.T
pangsa = pangsa.div(
    pangsa.sum(axis=1), axis=0
) * 100
kategori = pangsa.columns.tolist()
sudut = np.linspace(
    0, 2 * np.pi, len(kategori),
    endpoint=False
).tolist()
sudut_tutup = sudut + sudut[:1]`,
    rightCode:`fig, ax = plt.subplots(
    subplot_kw={"polar": True})
for cabang in ["Utara", "Tengah"]:
    nilai = pangsa.loc[cabang].tolist()
    nilai_tutup = nilai + nilai[:1]
    ax.plot(sudut_tutup, nilai_tutup,
            linewidth=2, label=cabang)
    ax.fill(sudut_tutup, nilai_tutup,
            alpha=0.12)
ax.set_xticks(sudut)
ax.set_xticklabels(kategori)
ax.set_ylim(0, 40)
ax.legend()
plt.show()` },
];

function text(slide,name,value,box,style={}) {
  const shape=slide.shapes.add({geometry:"textbox",name,position:box,fill:"none",line:{fill:"none",width:0}});
  shape.text=value;
  shape.text.style={typeface:"SF Pro Text",fontSize:20,color:"#4B5868",alignment:"left",verticalAlignment:"top",wrap:"none",autoFit:"none",lineSpacing:1.05,insets:0,...style};
  return shape;
}
function code(slide,name,value,box,size=24) {
  const shape=text(slide,name,value,box,{typeface:"SF Mono",fontSize:size,color:"#111A30",lineSpacing:1.07});
  return shape;
}
const newByAfter=new Map();
for(const addition of additions){
  const slide=deck.slides.add({background:{fill:"#FFFFFF"}});
  text(slide,"Code slide title",addition.title,{left:72,top:44,width:1136,height:56},{typeface:"SF Pro Display",fontSize:40,color:"#111A30",bold:true,verticalAlignment:"middle"});
  text(slide,"Code slide subtitle",addition.subtitle,{left:72,top:106,width:1136,height:42},{verticalAlignment:"middle"});
  slide.shapes.add({geometry:"line",name:"Title divider",position:{left:72,top:165,width:1136,height:0},fill:"none",line:{fill:"#E7EAEE",width:1.25}});
  if(addition.code){
    code(slide,"Python example",addition.code,{left:88,top:203,width:1104,height:420},24);
  }else{
    text(slide,"Preparation label",addition.leftLabel,{left:72,top:191,width:530,height:30},{fontSize:21,bold:true,color:"#196B9B"});
    text(slide,"Drawing label",addition.rightLabel,{left:657,top:191,width:550,height:30},{fontSize:21,bold:true,color:"#196B9B"});
    code(slide,"Preparation code",addition.leftCode,{left:72,top:233,width:560,height:408},22);
    code(slide,"Drawing code",addition.rightCode,{left:657,top:233,width:551,height:408},22);
  }
  text(slide,"Notebook reference",addition.footer,{left:72,top:651,width:1136,height:32},{fontSize:18,color:"#196B9B"});
  newByAfter.set(addition.after,slide);
}
const ordered=[];
for(let i=0;i<original.length;i++){
  ordered.push(original[i].id);
  const inserted=newByAfter.get(i+1);
  if(inserted)ordered.push(inserted.id);
}
deck.slides.reorder(ordered.map(id => id.startsWith("sl/") ? id : `sl/${id}`));
for(let i=0;i<deck.slides.items.length;i++){
  const slide=deck.slides.items[i];
  const regex=new RegExp(`### Slide ${i+1}:([\\s\\S]*?)(?=\\n### Slide \\d+:|\\n## Catatan cepat|$)`);
  const part=guide.match(regex)?.[0];
  if(!part)throw new Error(`Guide missing slide ${i+1}`);
  const oldNotes=slide.speakerNotes.text;
  slide.speakerNotes.text=(oldNotes?oldNotes+"\n\n":"")+part.replace(/\*\*/g,"").replace(/```python\n|```/g,"");
}
await fs.writeFile(path.join(WORK,"slide-code-examples.json"),JSON.stringify(additions,null,2));
const candidate=path.join(WORK,"candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidate);
console.log("Candidate exported with 21 slides");
const preserved=spawnSync(PYTHON,[path.join(WORK,"preserve-source-parts.py")],{encoding:"utf8"});
if(preserved.status!==0)throw new Error(preserved.stderr||preserved.stdout);
console.log(preserved.stdout.trim());
const result=await finalizePresentation({
  workspaceDir:ROOT,candidatePath:path.join(WORK,"candidate-preserved.pptx"),finalPath:OUTPUT,
  pythonExecutable:PYTHON,
  integrityValidatorPath:path.join(SKILL,"container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath:path.join(SKILL,"container_tools/inspect_presentation_layout_geometry.py"),
  explicitTotalSlideCount:21,
  requiredNativeTableOwnerSlides:[2,3,6,10,19,20,21],
  requiredNativeChartOwnerSlides:[4,6,8,11,13,17],
  requiredEmbeddedWorkbookChartOwnerSlides:[4,6,8,11,13,17],
  layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-heading-fit",
    ...[2,3,6,10,19,20,21].flatMap(number => ["--require-native-table-slide",String(number)])],
  fontPolicy:{basis:"reference",families:["SF Pro Display","SF Pro Text","SF Mono"],referencePath:SOURCE,referenceSha256:sourceHash},
  verifyArtifactToolImport:true,
  receiptPath:path.join(WORK,"validation-final.json"),
});
console.log(JSON.stringify({finalPath:OUTPUT,validationReceipt:path.join(WORK,"validation-final.json")}));
const final=await PresentationFile.importPptx(await FileBlob.load(OUTPUT));
for(let i=0;i<final.slides.items.length;i++){
  const slide=final.slides.items[i];
  const png=await final.export({slide,format:"png",scale:1});
  await fs.writeFile(path.join(WORK,"rendered",`slide-${String(i+1).padStart(2,"0")}.png`),new Uint8Array(await png.arrayBuffer()));
  console.log(`Rendered final ${i+1}`);
}
} catch (error) {
  console.error(error.message);
  console.error(error.stack?.split("\n").slice(1,8).join("\n"));
  process.exitCode = 1;
}
