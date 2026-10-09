import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
const out = "/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan/smoke";
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = p.slides.add();
slide.background.fill = "#FFFFFF";
slide.charts.add("boxWhisker", {
  position: { left: 80, top: 80, width: 1120, height: 560 },
  title: "Box plot nilai dua kelas",
  categories: ["Kelas X", "Kelas XI"],
  series: [
    { name: "Siswa 1", values: [60, 55] },
    { name: "Siswa 2", values: [65, 62] },
    { name: "Siswa 3", values: [68, 67] },
    { name: "Siswa 4", values: [70, 72] },
    { name: "Siswa 5", values: [74, 75] },
    { name: "Siswa 6", values: [78, 79] },
    { name: "Siswa 7", values: [80, 86] },
    { name: "Siswa 8", values: [85, 92] },
  ],
  hasLegend: false,
  boxWhiskerOptions: { showMeanMarker: true, showOutliers: true },
  xAxis: { title: "Kelas" },
  yAxis: { min: 40, max: 100, majorUnit: 10, title: "Nilai" },
});
const png = await p.export({ slide, format: "png", scale: 1 });
await fs.writeFile(path.join(out, "box-trial.png"), new Uint8Array(await png.arrayBuffer()));
await (await PresentationFile.exportPptx(p)).save(path.join(out, "box-trial.pptx"));
console.log("BoxWhisker export passed");
