import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const root = "/Users/daf2a/Documents/python";
const dir = path.join(root, "_pengembangan/level-03/01-perbandingan-komposisi/panduan");
const source = path.join(root, "level-03/01-perbandingan-komposisi/slide/Visualisasi_Data_Perbandingan_dan_Komposisi.pptx");
const deck = await PresentationFile.importPptx(await FileBlob.load(source));
const slides = deck.slides.items;
console.log(JSON.stringify(slides.map((slide, i) => ({ number: i+1, id: slide.id, charts: slide.charts.items.length, tables: slide.tables.items.length, images: slide.images.items.length, notes: slide.speakerNotes.text })), null, 2));
await fs.writeFile(path.join(dir, "source-inspect.ndjson"), (await deck.inspect({kind:"slide,textbox,shape,image,table,chart",maxChars:50000})).ndjson ?? "");
for (let i = 0; i < slides.length; i++) {
  const png = await deck.export({slide:slides[i],format:"png",scale:1});
  await fs.writeFile(path.join(dir,"source-rendered",`slide-${String(i+1).padStart(2,"0")}.png`),new Uint8Array(await png.arrayBuffer()));
  console.log(`Rendered source ${i+1}`);
}
