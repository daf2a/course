import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const s = p.slides.add();
const chart = s.charts.add("waterfall", {
  position: { left: 80, top: 80, width: 1100, height: 540 },
  categories: ["Awal", "Pembelian", "Biaya", "Pengembalian", "Akhir"],
  series: [{ name: "Saldo", values: [120, -35, -20, 18, 83], fill: "#4FB6E8" }],
  hasLegend: false,
});
chart.xAxis = { visible: true, title: "Tahap", position: "bottom", textStyle: { fill: "#4B5868", fontSize: 14 }, majorGridlines: null };
chart.yAxis = { visible: true, title: "Rupiah", position: "left", min: 0, max: 140, majorUnit: 20, textStyle: { fill: "#4B5868", fontSize: 14 }, majorGridlines: { style: "solid", fill: "#E7EAEE", width: 1 } };
const png = await p.export({ slide: s, format: "png", scale: 1 });
await fs.writeFile("/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan/smoke/waterfall-axes.png", new Uint8Array(await png.arrayBuffer()));
await (await PresentationFile.exportPptx(p)).save("/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan/smoke/waterfall-axes.pptx");
console.log("done");
