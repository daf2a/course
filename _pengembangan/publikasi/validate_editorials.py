"""Jalankan contoh dan jawaban, termasuk pengecekan batas serta error demonstrasi."""
import builtins
import contextlib
import io
import json
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from plotly.basedatatypes import BaseFigure

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_ERRORS = {("meeting-01_editorial", 20): NameError,
                   ("meeting-01_editorial", 21): TypeError,
                   ("meeting-03_editorial", 12): TypeError}


def validate():
    plt.show = lambda *args, **kwargs: plt.close("all")
    BaseFigure.show = lambda *args, **kwargs: None
    results = []
    original_input = builtins.input
    try:
        for path in sorted(ROOT.glob("level-*/*/notebooks/*_editorial.ipynb")):
            namespace = {"__name__": "__main__"}
            values = iter(["Alya", "16", "Alya", "Nasi goreng", "18000", "3", "1000", "1", "Alya", "3", "1000", "ya"])
            builtins.input = lambda prompt="": next(values)
            log = io.StringIO()
            code_count = 0
            with contextlib.redirect_stdout(log):
                for index, cell in enumerate(json.loads(path.read_text())["cells"]):
                    if cell["cell_type"] != "code":
                        continue
                    expected = EXPECTED_ERRORS.get((path.stem, index))
                    try:
                        exec(compile("".join(cell["source"]), f"{path.name}:cell-{index}", "exec"), namespace)
                    except Exception as error:
                        if expected is None or not isinstance(error, expected):
                            raise
                    else:
                        if expected is not None:
                            raise AssertionError("Contoh error tidak menghasilkan error yang dijelaskan")
                    code_count += 1
            assert "FAIL" not in log.getvalue(), f"Checker gagal: {path}"
            if path.stem == "function_statistic_editorial":
                assert namespace["hitung_median"]([]) is None
                assert namespace["hitung_median"]([4, 1, 3, 2]) == 2.5
                assert namespace["hitung_variansi"]([1, 3]) == 1
                assert namespace["hitung_standar_deviasi"]([1, 3]) == 1
                assert namespace["fibonacci"](7) == 13
            if path.stem.startswith("analysis_with_numpy"):
                assert namespace["matriks_latihan"].shape == (4, 3)
                assert list(namespace["nilai_februari"]) == [151, 112, 129, 108]
                assert namespace["proyeksi_4bulan"].shape == (4, 4)
                assert namespace["cabang"][namespace["indeks_cabang_tertinggi"]] == "Surabaya"
            if path.stem == "python_numpy_reevaluation_editorial":
                n = namespace
                assert n["total_pembayaran"] == 241500
                assert n["durasi_menit"] == 500 and math.isclose(n["upah"], 250000)
                assert n["hasil_pesanan"]["P04"] == "Diterima"
                assert n["hasil_ruang"]["R06"] == "Diterima"
                assert len(n["hasil_produk"]["Q03"]) == 2
                assert n["hasil_produk"]["Q02"] == ["Siap dikirim"]
                assert n["terkirim"] == 12 and n["stok"] == 3 and n["menunggu"] == [6, 2]
                assert n["total_tersedia"] == 12 and n["total_dipesan"] == 10
                assert n["hitung_median"]([]) is None and n["median_genap"] == 10
                assert n["ringkasan_kelulusan"]([74, 75, 80], 75)["lulus"] == 2
                assert n["statistik_pengiriman"]([]) is None
                assert n["stasiun_terpanas"] == "Timur" and n["cabang_terbaik"] == "Surabaya"
                assert list(n["cabang_minimal_juta"]) == ["Bandung", "Surabaya"]
            results.append({"notebook": path.name, "code_cells": code_count})
            print("PASS", path.name, code_count, "code cells")
    finally:
        builtins.input = original_input
    print("Semua editorial lolos:", len(results))


if __name__ == "__main__":
    validate()
