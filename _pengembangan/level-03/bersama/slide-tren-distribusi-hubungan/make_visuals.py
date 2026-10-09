from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import plotly.express as px

OUT = Path("/Users/daf2a/Documents/python/_pengembangan/level-03/bersama/slide-tren-distribusi-hubungan/visuals")
OUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "axes.titlecolor": "#111A30",
    "axes.labelcolor": "#4B5868",
    "xtick.color": "#4B5868",
    "ytick.color": "#4B5868",
    "axes.edgecolor": "#D8E0E6",
    "grid.color": "#E7EAEE",
    "figure.facecolor": "white",
    "axes.facecolor": "white",
})

scores_a = [62, 66, 68, 70, 71, 73, 74, 76, 81, 92]
scores_b = [55, 60, 64, 67, 70, 74, 78, 82, 86, 89]
scores_c = [48, 55, 59, 62, 64, 67, 69, 72, 80, 94]
scores = [52, 58, 61, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 80, 82, 86]

hours = np.array([1, 2, 2, 3, 3, 4, 4, 5, 5, 6])
scores_scatter = np.array([55, 60, 64, 67, 70, 72, 78, 79, 88, 91])
attendance = np.array([62, 75, 82, 68, 90, 78, 88, 84, 96, 91])
fig, ax = plt.subplots(figsize=(7.8, 3.8), dpi=180)
ax.scatter(hours, scores_scatter, s=attendance * 4, color="#4FB6E8", alpha=0.66, edgecolors="white", linewidths=1.2)
ax.set(title="Jam Belajar, Nilai, dan Kehadiran", xlabel="Jam belajar", ylabel="Nilai", xlim=(0, 7), ylim=(40, 100))
ax.grid(True)
fig.tight_layout()
fig.savefig(OUT / "bubble.png", bbox_inches="tight")
plt.close(fig)

fig, ax = plt.subplots(figsize=(7.8, 3.8), dpi=180)
ax.hist(scores, bins=6, color="#4FB6E8", edgecolor="white")
ax.set(title="Distribusi Nilai Ujian", xlabel="Nilai", ylabel="Jumlah peserta")
ax.grid(axis="y")
fig.tight_layout()
fig.savefig(OUT / "histogram_main.png", bbox_inches="tight")
plt.close(fig)

values_spread = [55, 60, 65, 70, 74, 78, 85, 90, 95, 100]
values_clustered = [68, 72, 73, 74, 76, 76, 77, 78, 79, 82]
bins_comparison = [50, 60, 70, 80, 90, 100, 110]
fig, axes = plt.subplots(1, 2, figsize=(10.5, 4.0), dpi=180, sharex=True, sharey=True)
for ax, values, label, color in zip(
    axes,
    [values_spread, values_clustered],
    ["Sebaran lebih lebar", "Nilai lebih terkumpul"],
    ["#4FB6E8", "#F5D36A"],
):
    median = float(np.median(values))
    ax.hist(values, bins=bins_comparison, color=color, edgecolor="white")
    ax.axvline(median, color="#196B9B", linestyle="--", linewidth=1.8, label=f"Median {median:.0f}")
    ax.set(title=label, xlabel="Nilai", ylabel="Jumlah peserta")
    ax.legend()
    ax.grid(axis="y")
fig.suptitle("Median sama, sebaran berbeda", color="#111A30", fontsize=14)
fig.tight_layout()
fig.savefig(OUT / "distribution_comparison.png", bbox_inches="tight")
plt.close(fig)

fig, axes = plt.subplots(1, 2, figsize=(10.8, 3.8), dpi=180, sharey=True)
for ax, bins, color in zip(axes, [4, 6], ["#4FB6E8", "#F5D36A"]):
    ax.hist(scores, bins=bins, color=color, edgecolor="white")
    ax.set(title=f"{bins} bins", xlabel="Nilai", ylabel="Jumlah peserta")
    ax.grid(axis="y")
fig.suptitle("Dampak Jumlah Bins pada Histogram", color="#111A30", fontsize=14)
fig.tight_layout()
fig.savefig(OUT / "histogram_bins.png", bbox_inches="tight")
plt.close(fig)

fig, ax = plt.subplots(figsize=(7.8, 3.8), dpi=180)
bp = ax.boxplot([scores_a, scores_b, scores_c], tick_labels=["Merah", "Biru", "Hijau"], patch_artist=True, showfliers=True)
for patch, color in zip(bp["boxes"], ["#EAF6FC", "#FFF7D6", "#E8F4EC"]):
    patch.set_facecolor(color)
for part in ["medians", "whiskers", "caps"]:
    for artist in bp[part]:
        artist.set_color("#196B9B" if part == "medians" else "#7B8794")
ax.set(title="Nilai per Kelas", ylabel="Nilai")
ax.set_ylim(40, 100)
ax.grid(axis="y")
fig.tight_layout()
fig.savefig(OUT / "boxplot.png", bbox_inches="tight")
plt.close(fig)

fig, ax = plt.subplots(figsize=(7.8, 3.8), dpi=180)
vp = ax.violinplot([scores_a, scores_b, scores_c], showmedians=True, showextrema=True, widths=0.72)
for body, color in zip(vp["bodies"], ["#4FB6E8", "#F5D36A", "#55B77A"]):
    body.set_facecolor(color)
    body.set_edgecolor("#196B9B")
    body.set_alpha(0.62)
vp["cmedians"].set_color("#111A30")
ax.set_xticks([1, 2, 3], ["Merah", "Biru", "Hijau"])
ax.set(title="Bentuk Kepadatan Nilai per Kelas", ylabel="Nilai")
ax.set_ylim(40, 100)
ax.grid(axis="y")
fig.tight_layout()
fig.savefig(OUT / "violin.png", bbox_inches="tight")
plt.close(fig)

pair_df = pd.DataFrame({
    "Jam belajar": [1, 2, 2, 3, 3, 4, 4, 5, 5, 6],
    "Kehadiran": [62, 75, 82, 68, 90, 78, 88, 84, 96, 91],
    "Nilai": [55, 60, 64, 67, 70, 72, 78, 79, 88, 91],
})
axes = pd.plotting.scatter_matrix(pair_df, figsize=(7.2, 5.3), diagonal="hist", color="#196B9B", alpha=0.72, marker="o", grid=True, hist_kwds={"color": "#4FB6E8", "edgecolor": "white"})
fig = axes[0, 0].get_figure()
fig.suptitle("Pair Plot Tiga Variabel", color="#111A30", fontsize=15, y=1.02)
fig.tight_layout()
fig.savefig(OUT / "pairplot.png", bbox_inches="tight")
plt.close(fig)

cities = pd.DataFrame({
    "Kota": ["Jakarta", "Bandung", "Semarang", "Yogyakarta", "Surabaya", "Denpasar"],
    "Lat": [-6.2088, -6.9175, -6.9667, -7.7956, -7.2575, -8.6500],
    "Lon": [106.8456, 107.6191, 110.4167, 110.3695, 112.7521, 115.2167],
    "Kunjungan": [120, 78, 64, 92, 110, 58],
})
point_map = px.scatter_geo(cities, lat="Lat", lon="Lon", size="Kunjungan", color="Kunjungan", text="Kota", hover_name="Kota", projection="natural earth", color_continuous_scale="Blues", title="Contoh Sebaran Kunjungan per Kota")
point_map.update_geos(fitbounds="locations", visible=True, showland=True, landcolor="#F4F7F9", showcountries=True, countrycolor="#B6C7D5", showocean=True, oceancolor="#EAF6FC")
point_map.update_traces(textposition="top center", marker={"line": {"color": "white", "width": 1}})
point_map.write_html(OUT / "point_map.html", include_plotlyjs=True, full_html=True)

regions = pd.DataFrame({"Negara": ["IDN", "MYS", "SGP", "THA", "PHL", "VNM"], "IndeksContoh": [72, 64, 81, 58, 60, 67]})
choropleth = px.choropleth(regions, locations="Negara", locationmode="ISO-3", color="IndeksContoh", hover_name="Negara", color_continuous_scale="Blues", range_color=[55, 85], title="Indeks Contoh per Negara")
choropleth.update_geos(fitbounds="locations", visible=True, showland=True, landcolor="#F4F7F9", showcountries=True, countrycolor="#B6C7D5", showocean=True, oceancolor="#EAF6FC")
choropleth.write_html(OUT / "choropleth.html", include_plotlyjs=True, full_html=True)

print(OUT)
