"""Ekspor notebook Colab dan halaman redirect GitHub Pages."""
import argparse
import ast
import html
import json
import re
import shutil
import warnings
from pathlib import Path
from urllib.parse import quote

import nbformat

ROOT = Path(__file__).resolve().parents[2]
REPOSITORY = "daf2a/course"
BRANCH = "notebooks"
PUBLIC_BASE = "https://daf2a.com/course"
OLD_ASSETS = "https://raw.githubusercontent.com/daf2a/notebooks/main/1/assets/conditional-statement/"
NEW_ASSETS = f"https://raw.githubusercontent.com/{REPOSITORY}/{BRANCH}/assets/conditional-statement/"


def redirect(target, title):
    escaped = html.escape(target, quote=True)
    return f'''<!doctype html>
<html lang="id">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0,url={escaped}">
<title>{html.escape(title)} | Google Colab</title>
<script>location.replace({json.dumps(target)})</script>
<p>Membuka notebook di Google Colab. <a href="{escaped}">Buka di Colab</a></p>
</html>
'''


def build(output):
    # Hapus hanya folder hasil build yang dibuat oleh skrip ini.
    if output.exists():
        if not (output / ".course-build").exists():
            raise ValueError("Folder output sudah ada dan bukan hasil build course")
        shutil.rmtree(output)
    output.mkdir(parents=True)
    (output / ".course-build").touch()
    publication = output / "publication"
    pages = output / "pages"
    publication.mkdir()
    pages.mkdir()
    catalog = []
    seen = set()
    for path in sorted(ROOT.glob("level-*/*/notebooks/*.ipynb")):
        level = str(int(path.parts[-4].removeprefix("level-")))
        public_path = f"notebook/{level}/{path.name}"
        if public_path in seen:
            raise ValueError(f"Nama notebook duplikat dalam level: {public_path}")
        seen.add(public_path)
        notebook = json.loads(path.read_text())
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", nbformat.warnings.MissingIDFieldWarning)
            nbformat.validate(nbformat.from_dict(notebook))
        editorial = path.stem.endswith("_editorial")
        if editorial:
            for index, cell in enumerate(notebook["cells"]):
                if cell["cell_type"] == "code":
                    ast.parse("".join(cell["source"]), filename=f"{path.name}:cell-{index}")
        # Penulisan ulang URL hanya berlaku pada salinan publikasi.
        for cell in notebook["cells"]:
            cell["source"] = [part.replace(OLD_ASSETS, NEW_ASSETS) for part in cell["source"]]
        target = publication / public_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(notebook, ensure_ascii=False, indent=2) + "\n")
        colab = f"https://colab.research.google.com/github/{REPOSITORY}/blob/{BRANCH}/{quote(public_path)}"
        route = pages / public_path / "index.html"
        route.parent.mkdir(parents=True, exist_ok=True)
        route.write_text(redirect(colab, path.name))
        catalog.append({"level": int(level), "material": path.parts[-3], "name": path.name,
                        "editorial": editorial, "source": str(path.relative_to(ROOT)),
                        "path": public_path, "url": f"{PUBLIC_BASE}/{public_path}", "colab": colab})
    assets = next(ROOT.glob("level-01/*/aset/decision-tree-diskon-toko-online-spaced.png")).parent
    shutil.copytree(assets, publication / "assets" / "conditional-statement", ignore=shutil.ignore_patterns(".DS_Store"))
    for entry in catalog:
        notebook = json.loads((publication / entry["path"]).read_text())
        for cell in notebook["cells"]:
            for filename in re.findall(re.escape(NEW_ASSETS) + r'([^\s)"<>]+)', "".join(cell["source"])):
                if not (publication / "assets" / "conditional-statement" / filename).is_file():
                    raise ValueError(f"Aset notebook tidak ditemukan: {filename}")
    for folder in [pages, publication]:
        (folder / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n")
        (folder / ".nojekyll").touch()
    rows = "\n".join(f'<li><a href="./{entry["path"]}/">{html.escape(entry["name"])}</a></li>' for entry in catalog)
    pages.joinpath("index.html").write_text(f'''<!doctype html>
<html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course Python</title><style>body{{font:16px/1.7 system-ui,sans-serif;margin:3rem auto;padding:0 1rem;max-width:900px}}a{{color:#1556a3}}</style>
<h1>Course Python</h1><p>Pilih notebook untuk langsung membukanya di Google Colab. Versi jawaban memakai suffix _editorial.</p><ul>{rows}</ul></html>
''')
    # Fallback untuk URL tanpa trailing slash dan tautan notebook yang dibagikan.
    pages.joinpath("404.html").write_text(r'''<!doctype html><html lang="id"><meta charset="utf-8"><title>Course Python</title>
<script>
const route = decodeURIComponent(location.pathname).replace(/\/$/, "").replace(/^\/course\//, "")
fetch("/course/catalog.json").then(response => response.json()).then(catalog => {
  const notebook = catalog.find(entry => entry.path === route)
  if (notebook) location.replace(notebook.colab)
})
</script><p>Notebook tidak ditemukan. <a href="/course/">Lihat daftar notebook</a></p></html>
''')
    publication.joinpath("README.md").write_text("# Notebook Colab\n\nBranch ini diperbarui otomatis dari branch main. Edit materi dari folder Python pada branch main.\n\n" + "\n".join(f'- [{entry["name"]}]({entry["url"]})' for entry in catalog) + "\n")
    print(f"Validasi dan build selesai: {len(catalog)} notebook, {sum(entry['editorial'] for entry in catalog)} editorial")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / ".build")
    args = parser.parse_args()
    build(args.output.resolve())
