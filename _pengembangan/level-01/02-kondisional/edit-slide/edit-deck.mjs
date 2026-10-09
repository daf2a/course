import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const STARTER = "/Users/daf2a/Documents/python/_pengembangan/level-01/02-kondisional/edit-slide/template-starter.pptx";
const OUTPUT = "/Users/daf2a/Documents/python/level-01/02-kondisional/slide/Conditional_Statements_Python.pptx";
const PREVIEW_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-01/02-kondisional/edit-slide/final-render";
const LAYOUT_DIR = "/Users/daf2a/Documents/python/_pengembangan/level-01/02-kondisional/edit-slide/final-layout/final";

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function shapeByName(slide, name) {
  const shape = slide.shapes.items.find((item) => item.name === name);
  if (!shape) throw new Error(`Shape not found on slide 5: ${name}`);
  return shape;
}

function rewrite(slide, name, oldText, newText) {
  const shape = shapeByName(slide, name);
  shape.text.replace(oldText, newText);
}

async function main() {
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });

  const presentation = await PresentationFile.importPptx(await FileBlob.load(STARTER));
  const slide = presentation.slides.getItem(4);

  rewrite(slide, "slide-title", "Comparison operators membentuk pertanyaan", "Gabungkan kondisi dengan and, or, dan not");
  rewrite(slide, "slide-subtitle", "Enam simbol dasar yang paling sering dipakai", "Python memakai keyword, bukan &&, ||, atau !");

  rewrite(slide, "op-0", "==", "&&");
  rewrite(slide, "op-label-0", "sama dengan", "Python: and");
  rewrite(slide, "op-1", "!=", "||");
  rewrite(slide, "op-label-1", "tidak sama dengan", "Python: or");
  rewrite(slide, "op-2", ">", "!");
  rewrite(slide, "op-label-2", "lebih besar", "Python: not");
  rewrite(slide, "op-3", "<", "and");
  rewrite(slide, "op-label-3", "lebih kecil", "semua kondisi harus True");
  rewrite(slide, "op-4", ">=", "or");
  rewrite(slide, "op-label-4", "lebih besar atau sama", "minimal satu kondisi True");
  rewrite(slide, "op-5", "<=", "not");
  rewrite(slide, "op-label-5", "lebih kecil atau sama", "membalik nilai Boolean");

  rewrite(slide, "comparison-example-title", "Contoh", "Kondisi gabungan");
  const exampleCode = shapeByName(slide, "comparison-example-code");
  exampleCode.text = "age = 20\nticket = True\nage >= 18\nand ticket\n→ True";
  exampleCode.text.style = {
    fontSize: 27,
    typeface: "SF Mono",
    color: "#0F172A",
    bold: true,
    alignment: "center",
    wrap: "square",
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  rewrite(
    slide,
    "equal-warning-text",
    "Ingat:  =  memberi nilai, sedangkan  ==  membandingkan nilai.",
    "Di Python gunakan  and, or, not — bukan  &&, ||, !",
  );

  slide.speakerNotes.textFrame.setText(
    "Jelaskan bahwa hasil beberapa comparison dapat digabungkan menjadi satu kondisi. Python menggunakan keyword and, or, dan not—bukan simbol &&, ||, atau ! seperti pada beberapa bahasa lain.\n\n" +
      "and memerlukan semua kondisi bernilai True. or cukup memiliki minimal satu kondisi True. not membalik nilai Boolean.\n\n" +
      "Demonstrasikan contoh umur >= 18 and punya_tiket, lalu ubah punya_tiket menjadi False agar peserta melihat hasil gabungan berubah.\n\n" +
      "[Sources]\n- https://docs.python.org/3/reference/expressions.html#boolean-operations",
  );
  slide.speakerNotes.setVisible(true);

  for (const [index, item] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await presentation.export({ slide: item, format: "png", scale: 1 }));
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await (await item.export({ format: "layout" })).text());
  }

  await writeBlob(
    "/Users/daf2a/Documents/python/_pengembangan/level-01/02-kondisional/edit-slide/final-montage.webp",
    await presentation.export({ format: "webp", montage: true, scale: 1 }),
  );

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUTPUT);
  console.log(`Updated ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
