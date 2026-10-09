import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const out = "/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan/smoke";
const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const palette = ["#4FB6E8", "#F5D36A", "#55B77A"];
const categories = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
const titles = [];
function add(title, type, config) {
  const slide = p.slides.add();
  slide.background.fill = "#FFFFFF";
  const header = slide.shapes.add({ geometry: "textbox", position: { left: 60, top: 25, width: 1100, height: 48 }, fill: "none", line: { fill: "none", width: 0 } });
  header.text = `${title} (${type})`;
  header.text.style = { typeface: "Arial", fontSize: 30, color: "#111A30", bold: true };
  slide.charts.add(type, { position: { left: 80, top: 95, width: 1100, height: 540 }, chartFill: "#FFFFFF", plotAreaFill: "#FFFFFF", title: `${title}`, titleTextStyle: { fill: "#111A30", fontSize: 18 }, ...config });
  titles.push(title);
}
add("Line", "line", { categories, series: [{ name: "Utara", values: [45, 52, 49, 61, 65, 70], fill: palette[0] }], hasLegend: false });
add("Area", "area", { categories, series: [{ name: "Utara", values: [45, 52, 49, 61, 65, 70], fill: palette[0] }], hasLegend: false });
add("Stacked area", "area", { categories, series: [{ name: "Utara", values: [20, 25, 21, 30, 32, 34], fill: palette[0] }, { name: "Tengah", values: [12, 14, 16, 18, 20, 21], fill: palette[1] }, { name: "Selatan", values: [8, 10, 12, 15, 18, 20], fill: palette[2] }], hasLegend: true, legend: { position: "bottom", overlay: false }, areaOptions: { grouping: "stacked" } });
add("Histogram", "histogram", { categories: ["Nilai"], series: [{ name: "Skor", values: [50, 54, 57, 60, 63, 65, 68, 70, 72, 74, 76, 78, 80, 83, 85, 88, 91, 94], fill: palette[0] }], hasLegend: false, histogramOptions: { binCount: 8 } });
add("Box", "boxWhisker", { categories: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"], series: [{ name: "Kelas X", values: [60, 65, 68, 70, 74, 78, 80, 85], fill: palette[0] }, { name: "Kelas XI", values: [55, 62, 67, 72, 75, 79, 86, 92], fill: palette[1] }], hasLegend: true, boxWhiskerOptions: { showMeanMarker: true, showOutliers: true }, xAxis: { title: "Kelas" }, yAxis: { min: 40, max: 100, majorUnit: 10, title: "Nilai" } });
add("Waterfall", "waterfall", { categories: ["Pendapatan", "Produk", "Operasional", "Tambahan", "Laba"], series: [{ name: "Rupiah", values: [120, -50, -25, 8, 53], fill: palette[0] }], hasLegend: false });
add("Map", "map", { categories: ["Indonesia", "Malaysia", "Thailand", "Jepang"], series: [{ name: "Indeks", values: [45, 30, 25, 52], fill: palette[0] }], hasLegend: false, mapOptions: { mapArea: "world", dataLevel: "countryOrRegion", labelLayout: "bestFit" } });
add("Scatter", "scatter", { series: [{ name: "Siswa", xValues: [1, 2, 3, 4, 5, 6], values: [56, 60, 63, 71, 75, 82], fill: palette[0], marker: { symbol: "circle", size: 8, fill: palette[0] } }], hasLegend: false, scatterOptions: { style: "marker" }, xAxis: { min: 0, max: 7 }, yAxis: { min: 45, max: 90 } });
add("Bubble", "bubble", { series: [{ name: "Kelas", xValues: [1, 2, 3, 4, 5, 6], values: [56, 60, 63, 71, 75, 82], bubbleSizes: [20, 50, 35, 90, 40, 70], fill: palette[0] }], hasLegend: false, bubbleOptions: { scale: 120, sizeRepresents: "area" } });
add("Violin outline", "scatter", { series: [{ name: "Batas kiri", xValues: [1, 0.8, 0.5, 0.25, 0.3, 0.55, 0.8, 1], values: [50, 60, 70, 80, 90, 100, 110, 120], line: { style: "solid", fill: palette[0], width: 2 }, marker: { symbol: "none", size: 2 } }, { name: "Batas kanan", xValues: [1, 1.2, 1.5, 1.75, 1.7, 1.45, 1.2, 1], values: [50, 60, 70, 80, 90, 100, 110, 120], line: { style: "solid", fill: palette[0], width: 2 }, marker: { symbol: "none", size: 2 } }], hasLegend: false, scatterOptions: { style: "smooth" }, xAxis: { min: 0, max: 2 }, yAxis: { min: 45, max: 125 } });
for (const [i, slide] of p.slides.items.entries()) {
  const png = await p.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(out, `chart-${i + 1}.png`), new Uint8Array(await png.arrayBuffer()));
}
await (await PresentationFile.exportPptx(p)).save(path.join(out, "smoke.pptx"));
console.log(titles.join("\n"));
