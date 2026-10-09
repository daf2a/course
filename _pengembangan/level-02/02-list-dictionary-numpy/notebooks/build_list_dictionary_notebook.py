from pathlib import Path

import nbformat as nbf


ROOT = Path('/Users/daf2a/Documents/python')
SOURCE = ROOT / 'level-02/02-list-dictionary-numpy/notebooks/list_dictionary_numpy.ipynb'
DIST = SOURCE


def markdown(text: str):
    return nbf.v4.new_markdown_cell(text)


def code(text: str):
    return nbf.v4.new_code_cell(text, execution_count=None, outputs=[])


cells = [
    markdown('# List, Dictionary, dan NumPy'),
    markdown('Pada materi ini kita mengolah data dari bentuk sederhana sampai array numerik.'),

    markdown('## 1. Review List'),
    markdown('### Indexing, negative indexing, dan slicing'),
    code('''warna = ["biru", "kuning", "hijau", "merah"]

print(warna[0])
print(warna[-1])
print(warna[1:3])'''),
    markdown('### `append()`, `remove()`, dan `pop()`'),
    code('''angka = [10, 20, 30]

angka.append(40)
angka.remove(20)
item_terakhir = angka.pop()

print(angka)
print("Item yang diambil:", item_terakhir)'''),
    markdown('### Function bawaan untuk membaca list'),
    code('''nilai = [72, 85, 90, 68]

print("Jumlah data:", len(nilai))
print("Terendah:", min(nilai))
print("Tertinggi:", max(nilai))
print("Total:", sum(nilai))
print("Urut:", sorted(nilai))
print("Rata-rata:", sum(nilai) / len(nilai))'''),

    markdown('## 2. Nested List'),
    markdown('### Mengambil data dari list dua dimensi'),
    code('''nilai = [
    [80, 90, 85],
    [70, 75, 80],
    [90, 95, 88]
]

print(nilai[0])
print(nilai[0][1])'''),
    markdown('### Loop pada setiap baris data'),
    code('''for siswa in nilai:
    rata_rata = sum(siswa) / len(siswa)
    print(rata_rata)'''),

    markdown('## 3. Dictionary'),
    markdown('### Key dan value'),
    code('''siswa = {
    "nama": "Alya",
    "umur": 16,
    "nilai": [80, 90, 85]
}

print(siswa["nama"])
print(siswa["nilai"])'''),
    markdown('### Membaca pasangan data dengan `.items()`'),
    code('''for key, value in siswa.items():
    print(key, value)'''),

    markdown('## Practice 1: Pilih satu variasi'),
    markdown('### Practice 1A: Rata-rata setiap siswa'),
    markdown('''Gunakan nested list berikut. Tampilkan nilai siswa pertama, nilai kedua siswa pertama, dan rata-rata setiap siswa.'''),
    code('''nilai = [
    [80, 90, 85],
    [70, 75, 80],
    [90, 95, 88]
]

# Tulis solusi di bawah ini.'''),
    markdown('### Practice 1B: Nilai tertinggi'),
    markdown('''Gunakan nested list berikut. Hitung rata-rata setiap siswa, lalu tampilkan rata-rata tertinggi.'''),
    code('''nilai = [
    [78, 85, 90],
    [88, 76, 80],
    [92, 89, 95]
]

# Tulis solusi di bawah ini.'''),
    markdown('### Practice 1C: Dictionary satu siswa'),
    markdown('''Buat dictionary untuk satu siswa. Tampilkan `nama`, `umur`, dan rata-rata dari list `nilai` miliknya.'''),
    code('''siswa = {
    "nama": "Alya",
    "umur": 16,
    "nilai": [80, 90, 85]
}

# Tulis solusi di bawah ini.'''),

    markdown('## 4. List of Dictionary'),
    markdown('### Dataset sederhana'),
    code('''data_siswa = [
    {"nama": "Alya", "nilai": 85},
    {"nama": "Budi", "nilai": 72},
    {"nama": "Citra", "nilai": 91}
]

print(data_siswa[0]["nama"])
print(data_siswa[2]["nilai"])'''),
    markdown('### Mengolah dataset dengan loop'),
    code('''total = 0
tertinggi = data_siswa[0]

for siswa in data_siswa:
    total += siswa["nilai"]

    if siswa["nilai"] > tertinggi["nilai"]:
        tertinggi = siswa

rata_rata = total / len(data_siswa)
print("Rata-rata:", rata_rata)
print("Nilai tertinggi:", tertinggi["nama"])

print("Nilai minimal 80:")
for siswa in data_siswa:
    if siswa["nilai"] >= 80:
        print(siswa["nama"])'''),

    markdown('## 5. Intro NumPy'),
    markdown('### Menghitung rata-rata secara manual'),
    code('''data = [72, 85, 90, 68]

total = 0
for nilai in data:
    total += nilai

mean = total / len(data)
print(mean)'''),
    markdown('### NumPy menyediakan operasi statistik'),
    code('''import numpy as np

data = np.array([72, 85, 90, 68])

print(np.mean(data))
print(np.median(data))
print(np.std(data))'''),
    markdown('### Hasil manual dan NumPy dapat dibandingkan'),
    code('''mean_manual = sum(data) / len(data)
mean_numpy = np.mean(data)

print("Manual:", mean_manual)
print("NumPy:", mean_numpy)
print("Sama:", mean_manual == mean_numpy)'''),

    markdown('## Practice 2: Pilih satu variasi'),
    markdown('### Practice 2A: Statistik list angka'),
    markdown('''Gunakan list berikut. Hitung mean, median, dan standar deviasi dengan NumPy. Tulis satu kalimat tentang arti standar deviasi.'''),
    code('''import numpy as np

data_nilai = [72, 85, 90, 68, 88, 76]

# Tulis solusi di bawah ini.'''),
    markdown('### Practice 2B: Statistik list of dictionary'),
    markdown('''Gunakan dataset berikut. Ambil semua nilai dari list of dictionary, lalu hitung mean dan standar deviasi dengan NumPy. Tampilkan nama siswa dengan nilai minimal 80.'''),
    code('''import numpy as np

data_siswa = [
    {"nama": "Alya", "nilai": 85},
    {"nama": "Budi", "nilai": 72},
    {"nama": "Citra", "nilai": 91},
    {"nama": "Dimas", "nilai": 78}
]

# Tulis solusi di bawah ini.'''),
    markdown('### Practice 2C: Bandingkan proses manual dan NumPy'),
    markdown('''Gunakan data yang sama untuk dua cara. Hitung mean dengan loop manual, hitung mean dengan NumPy, lalu bandingkan hasilnya.'''),
    code('''import numpy as np

data_nilai = [64, 72, 81, 90, 76, 88]

# Tulis solusi di bawah ini.'''),
]


notebook = nbf.v4.new_notebook(
    cells=cells,
    metadata={
        'colab': {'name': 'list_dictionary_numpy.ipynb'},
        'kernelspec': {
            'display_name': 'Python 3',
            'language': 'python',
            'name': 'python3',
        },
        'language_info': {'name': 'python', 'version': '3.11'},
    },
    nbformat=4,
    nbformat_minor=5,
)

SOURCE.write_text(nbf.writes(notebook), encoding='utf-8')

print(SOURCE)
print(DIST)
