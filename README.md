# Course Python

Materi Python tersusun berdasarkan level, lalu materi. Repository publik: [daf2a/course](https://github.com/daf2a/course). Git berada langsung di folder Python, jadi update dan push dilakukan dari folder ini.

## Buka notebook di Colab

Setiap link berikut langsung membuka Google Colab:

- Notebook siswa: https://daf2a.com/course/notebook/1/python_fundamental.ipynb
- Notebook jawaban: https://daf2a.com/course/notebook/1/python_fundamental_editorial.ipynb
- Semua notebook: https://daf2a.com/course/

Format link: `https://daf2a.com/course/notebook/{level}/{nama_notebook}.ipynb`. Level pada URL menggunakan angka seperti `1`, `2`, atau `3`. Suffix `_editorial` menandai notebook dengan jawaban.

| Level | Materi | Notebook siswa | Jawaban |
| --- | --- | --- | --- |
| 1 | 01-python-dasar | [meeting-01.ipynb](https://daf2a.com/course/notebook/1/meeting-01.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/meeting-01_editorial.ipynb) |
| 1 | 01-python-dasar | [python_fundamental.ipynb](https://daf2a.com/course/notebook/1/python_fundamental.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/python_fundamental_editorial.ipynb) |
| 1 | 02-kondisional | [conditional_statement.ipynb](https://daf2a.com/course/notebook/1/conditional_statement.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/conditional_statement_editorial.ipynb) |
| 1 | 02-kondisional | [meeting-02.ipynb](https://daf2a.com/course/notebook/1/meeting-02.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/meeting-02_editorial.ipynb) |
| 1 | 03-perulangan | [for_while_loop.ipynb](https://daf2a.com/course/notebook/1/for_while_loop.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/for_while_loop_editorial.ipynb) |
| 1 | 03-perulangan | [meeting-03.ipynb](https://daf2a.com/course/notebook/1/meeting-03.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/meeting-03_editorial.ipynb) |
| 1 | 04-fungsi-dictionary | [meeting-04.ipynb](https://daf2a.com/course/notebook/1/meeting-04.ipynb) | [Editorial](https://daf2a.com/course/notebook/1/meeting-04_editorial.ipynb) |
| 2 | 01-fungsi-statistika | [function_statistic.ipynb](https://daf2a.com/course/notebook/2/function_statistic.ipynb) | [Editorial](https://daf2a.com/course/notebook/2/function_statistic_editorial.ipynb) |
| 2 | 02-list-dictionary-numpy | [list_dictionary_numpy.ipynb](https://daf2a.com/course/notebook/2/list_dictionary_numpy.ipynb) | [Editorial](https://daf2a.com/course/notebook/2/list_dictionary_numpy_editorial.ipynb) |
| 2 | 03-analisis-data-numpy | [analysis_with_numpy.ipynb](https://daf2a.com/course/notebook/2/analysis_with_numpy.ipynb) | [Editorial](https://daf2a.com/course/notebook/2/analysis_with_numpy_editorial.ipynb) |
| 2 | 03-analisis-data-numpy | [analysis_with_numpy_2.ipynb](https://daf2a.com/course/notebook/2/analysis_with_numpy_2.ipynb) | [Editorial](https://daf2a.com/course/notebook/2/analysis_with_numpy_2_editorial.ipynb) |
| 2 | 04-evaluasi-python-numpy | [python_numpy_reevaluation.ipynb](https://daf2a.com/course/notebook/2/python_numpy_reevaluation.ipynb) | [Editorial](https://daf2a.com/course/notebook/2/python_numpy_reevaluation_editorial.ipynb) |
| 3 | 01-perbandingan-komposisi | [perbandingan_komposisi.ipynb](https://daf2a.com/course/notebook/3/perbandingan_komposisi.ipynb) | [Editorial](https://daf2a.com/course/notebook/3/perbandingan_komposisi_editorial.ipynb) |
| 3 | 02-pie-dan-stacked-bar | [pie_dan_stacked_bar.ipynb](https://daf2a.com/course/notebook/3/pie_dan_stacked_bar.ipynb) | [Editorial](https://daf2a.com/course/notebook/3/pie_dan_stacked_bar_editorial.ipynb) |

## Struktur lokal

```text
python/
├── level-01/              # Dasar Python, kondisional, loop, function
├── level-02/              # Statistika, list, dictionary, NumPy
├── level-03/              # Visualisasi data
├── _pengembangan/         # Skrip sumber dan runtime lokal
├── _arsip/                # Salinan lama, inventaris, hasil sementara
├── .github/workflows/     # Validasi dan publikasi otomatis
├── .git/
├── .gitignore
└── README.md
```

Setiap materi memiliki folder `notebooks/` untuk notebook siswa dan `_editorial`, serta `slide/`, `aset/`, `preview/`, atau `kuis/` jika ada. Cache, runtime, arsip, dan `.build/` diabaikan oleh Git. Materi, slide, aset, kuis, dan skrip sumber tetap dilacak.

Notebook siswa dan editorial untuk materi Level 1 sampai 3 disimpan pada folder `notebooks/` di materi masing-masing dalam repo ini. GitHub Actions memvalidasi notebook dari branch `main`, lalu menerbitkan salinannya ke branch `notebooks` untuk Colab dan memperbarui halaman redirect.

## Update dan publikasi

```bash
cd /Users/daf2a/Documents/python
git add level-01 level-02 level-03
git commit -m "Update materi Python"
git push origin main
```

[GitHub Actions](https://github.com/daf2a/course/actions/workflows/publish.yml) memvalidasi seluruh notebook, menjalankan semua editorial beserta checker, mengekspor notebook dan aset ke branch `notebooks`, lalu menerbitkan halaman redirect ke GitHub Pages. Branch `main` memuat struktur materi lokal. Branch `notebooks` merupakan hasil publikasi otomatis untuk Colab.

File notebook publik berada di `notebook/{level}/{nama}.ipynb` pada branch `notebooks`. URL gambar dalam salinan publik diarahkan ke aset repository ini. Notebook siswa lokal tetap identik dengan versi distribusi asli. Repo `daf2a/notebooks` tetap tersedia sebagai publikasi lama.

## Validasi lokal

```bash
python3 -m pip install -r .github/requirements-notebooks.txt
python3 _pengembangan/publikasi/build.py
python3 _pengembangan/publikasi/validate_editorials.py
```

GitHub Actions menggunakan notebook di `level-XX/<materi>/notebooks/` dalam repo ini sebagai sumber publikasi. Buat perubahan pada salinan tersebut agar validasi dan deploy otomatis memakai versi terbaru. Notebook jawaban memakai suffix `_editorial`.
