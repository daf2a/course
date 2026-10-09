"""Check the guide examples, inserted code, outputs, and original source bytes."""
import ast
import hashlib
import json
import re
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from plotly.basedatatypes import BaseFigure

ROOT = Path("/Users/daf2a/Documents/python")
TOPIC = ROOT / "level-03/01-perbandingan-komposisi"
WORK = ROOT / "_pengembangan/level-03/01-perbandingan-komposisi/panduan"
expected = {
    "notebooks/perbandingan_komposisi.ipynb": "b4203e6a0ba8bb9385ac4ee3c56e7edd0b63db466a15d38771587560b8837af3",
    "notebooks/perbandingan_komposisi_editorial.ipynb": "49e666a614c4283b808b8670dc48fa73bb7c5fa93c904696242d972284c17136",
    "slide/Visualisasi_Data_Perbandingan_dan_Komposisi.pptx": "e1679ea20c74cf9b5009ef00cfc01b0f6299ef2b26ad9a085ff728ffbde2a63c",
}
for filename, digest in expected.items():
    assert hashlib.sha256((TOPIC / filename).read_bytes()).hexdigest() == digest, filename

plt.show = lambda *args, **kwargs: plt.close("all")
BaseFigure.show = lambda *args, **kwargs: None
namespace = {}
notebook = json.loads((TOPIC / "notebooks/perbandingan_komposisi_editorial.ipynb").read_text())
cells = ["".join(cell["source"]) for cell in notebook["cells"] if cell["cell_type"] == "code"]
for source in cells:
    ast.parse(source)
    exec(compile(source, "existing-editorial", "exec"), namespace)

assert namespace["total_kategori"].set_index("Kategori")["Unit"].to_dict() == {
    "Makanan": 119, "Minuman": 92, "Alat Tulis": 87, "Buku": 80, "Aksesori": 64
}
assert namespace["frekuensi"].to_dict() == {
    "Makanan": 7, "Alat Tulis": 5, "Buku": 4, "Minuman": 3, "Aksesori": 2
}
assert namespace["frekuensi_pilihan"].to_dict() == {"Sains": 11, "Seni": 9, "Olahraga": 6}
assert namespace["tabel_cabang"].sum().to_dict() == {"Selatan": 150, "Tengah": 144, "Utara": 148}
assert namespace["tabel_bazar"].sum(axis=1).to_dict() == {"Aula": 118, "Lapangan": 135, "Taman": 116}
assert namespace["total_per_kelompok"].to_dict() == {"Alat Tulis": 90, "Buku": 82, "Makanan": 101, "Minuman": 96}
assert namespace["kelompok_teratas"] == "Makanan"
assert namespace["jumlah_unit_teratas"] == 101
assert abs(namespace["persentase"].sum(axis=1) - 100).max() < 1e-10
assert abs(namespace["persen_bazar"].sum(axis=1) - 100).max() < 1e-10

guide = (TOPIC / "PANDUAN_MENGAJAR.md").read_text()
sections = re.findall(r"^### Slide (\d+):", guide, flags=re.MULTILINE)
assert sections == [str(number) for number in range(1, 22)]
assert "\u2014" not in guide
assert ";" not in guide
examples = re.findall(r"```python\n(.*?)\n```", guide, flags=re.DOTALL)
for number, source in enumerate(examples, 1):
    ast.parse(source)
    exec(compile(source, f"guide-example-{number}", "exec"), namespace)
print(f"Validated {len(cells)} editorial code cells and {len(examples)} guide examples")

additions = json.loads((WORK / "slide-code-examples.json").read_text())
for addition in additions:
    source = addition.get("code") or addition["leftCode"] + "\n" + addition["rightCode"]
    ast.parse(source)
    exec(compile(source, f"slide-{addition['number']}", "exec"), namespace)
    plt.close("all")
print("Validated all 7 inserted code examples")
print("Original notebooks and original deck are byte-identical")
