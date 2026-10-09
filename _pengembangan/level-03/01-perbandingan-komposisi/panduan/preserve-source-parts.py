"""Preserve original OOXML charts/workbooks while adding Artifact Tool slides.

Artifact Tool authors all new slide and note content. Its PPTX round trip drops
externalData links on the imported charts, so keep the original package parts.
"""
import copy
import hashlib
import json
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path("/Users/daf2a/Documents/python")
WORK = ROOT / "_pengembangan/level-03/01-perbandingan-komposisi/panduan"
SOURCE = ROOT / "level-03/01-perbandingan-komposisi/slide/Visualisasi_Data_Perbandingan_dan_Komposisi.pptx"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG = "http://schemas.openxmlformats.org/package/2006/relationships"
CT = "http://schemas.openxmlformats.org/package/2006/content-types"
ET.register_namespace("p", P)
ET.register_namespace("r", R)

def xml_bytes(root):
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)

with zipfile.ZipFile(SOURCE) as source, zipfile.ZipFile(WORK / "candidate.pptx") as authored:
    output = {name: source.read(name) for name in source.namelist()}
    presentation = ET.fromstring(output["ppt/presentation.xml"])
    slide_list = presentation.find(f"{{{P}}}sldIdLst")
    old_ids = list(slide_list)
    assert len(old_ids) == 14
    presentation_rels = ET.fromstring(output["ppt/_rels/presentation.xml.rels"])
    content_types = ET.fromstring(output["[Content_Types].xml"])
    content_type_by_part = {element.get("PartName"): element.get("ContentType")
                            for element in ET.fromstring(authored.read("[Content_Types].xml"))}
    code_positions = [5, 7, 9, 12, 14, 16, 18]
    old_to_position = {1:1, 2:2, 3:3, 4:4, 5:6, 6:8, 7:10,
                       8:11, 9:13, 10:15, 11:17, 12:19, 13:20, 14:21}
    ids_by_position = {position: copy.deepcopy(old_ids[old-1])
                       for old, position in old_to_position.items()}
    next_id = max(int(element.get("id")) for element in old_ids) + 1

    # Replace note text with Artifact Tool's authored notes. Original slide and
    # chart relationship files are left intact.
    for old, position in old_to_position.items():
        output[f"ppt/notesSlides/notesSlide{old}.xml"] = authored.read(
            f"ppt/notesSlides/notesSlide{position}.xml")

    for index, position in enumerate(code_positions, 15):
        slide_name = f"ppt/slides/slide{index}.xml"
        note_name = f"ppt/notesSlides/notesSlide{index}.xml"
        output[slide_name] = authored.read(f"ppt/slides/slide{position}.xml")
        output[note_name] = authored.read(f"ppt/notesSlides/notesSlide{position}.xml")
        relationships = ET.fromstring(authored.read(f"ppt/slides/_rels/slide{position}.xml.rels"))
        for relationship in relationships:
            if relationship.get("Type").endswith("/notesSlide"):
                relationship.set("Target", "/" + note_name)
            elif relationship.get("Type").endswith("/slideLayout"):
                assert relationship.get("Target").lstrip("/") in output
            else:
                raise AssertionError("Code-only slide unexpectedly has an asset relationship")
        output[f"ppt/slides/_rels/slide{index}.xml.rels"] = xml_bytes(relationships)
        note_rels = ET.fromstring(authored.read(f"ppt/notesSlides/_rels/notesSlide{position}.xml.rels"))
        for relationship in note_rels:
            if relationship.get("Type").endswith("/slide"):
                relationship.set("Target", "/" + slide_name)
            elif relationship.get("Type").endswith("/notesMaster"):
                assert relationship.get("Target").lstrip("/") in output
            else:
                raise AssertionError("Unexpected note asset relationship")
        output[f"ppt/notesSlides/_rels/notesSlide{index}.xml.rels"] = xml_bytes(note_rels)
        relationship_id = f"RcourseCode{index}"
        ET.SubElement(presentation_rels, f"{{{PKG}}}Relationship", {
            "Type": R + "/slide", "Target": "/" + slide_name, "Id": relationship_id
        })
        ids_by_position[position] = ET.Element(f"{{{P}}}sldId", {
            "id": str(next_id), f"{{{R}}}id": relationship_id
        })
        next_id += 1
        for name, authored_name in [(slide_name, f"/ppt/slides/slide{position}.xml"),
                                    (note_name, f"/ppt/notesSlides/notesSlide{position}.xml")]:
            ET.SubElement(content_types, f"{{{CT}}}Override", {
                "PartName": "/" + name, "ContentType": content_type_by_part[authored_name]
            })
    slide_list[:] = [ids_by_position[position] for position in range(1, 22)]
    output["ppt/presentation.xml"] = xml_bytes(presentation)
    output["ppt/_rels/presentation.xml.rels"] = xml_bytes(presentation_rels)
    ET.register_namespace("", CT)
    output["[Content_Types].xml"] = xml_bytes(content_types)
    app = ET.fromstring(output["docProps/app.xml"])
    count = app.find("{http://schemas.openxmlformats.org/officeDocument/2006/extended-properties}Slides")
    if count is not None:
        count.text = "21"
    output["docProps/app.xml"] = xml_bytes(app)

    preserved = [name for name in source.namelist()
                 if "/charts/" in name or "/extendedCharts/" in name
                 or "/embeddings/" in name or name.startswith("ppt/media/")
                 or (name.startswith("ppt/slides/") and name.endswith(".xml"))]
    for name in preserved:
        assert output[name] == source.read(name), name
    with zipfile.ZipFile(WORK / "candidate-preserved.pptx", "w", zipfile.ZIP_DEFLATED) as package:
        for name, value in output.items():
            package.writestr(name, value)
    (WORK / "preserved-parts.json").write_text(json.dumps({
        "source": str(SOURCE), "source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "preserved_parts": preserved, "original_slide_xml_unchanged": 14,
        "added_code_positions": code_positions, "slide_count": 21,
    }, indent=2))
    print(f"Preserved {len(preserved)} source slide/chart/workbook/media parts")
