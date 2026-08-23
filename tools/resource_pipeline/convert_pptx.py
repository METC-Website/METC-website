#!/usr/bin/env python3
"""Convert course PPTX/PDF materials to slide PNGs for the web viewer."""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
METC = Path(os.environ.get("METC_RESOURCE_ROOT", ROOT / "resources" / "METC"))
COURSES = METC / "课程设计"
PRESENTATIONS = {".pptx", ".ppt", ".pdf"}


def command(name: str) -> str:
    found = shutil.which(name)
    if not found:
        raise RuntimeError(f"Required command not found: {name}")
    return found


def human_title(path: Path) -> str:
    return re.sub(r"^[Ll]esson\s*\d+[-_. ]*|^[Ll]\d+[-_. ]*|^\d+[-_. ]*", "", path.stem).strip() or path.stem


def to_pdf(source: Path, workdir: Path) -> Path:
    if source.suffix.lower() == ".pdf":
        return source
    office = command("soffice") if shutil.which("soffice") else command("libreoffice")
    environment = os.environ.copy()
    fontconfig = Path(__file__).with_name("fontconfig.conf")
    if fontconfig.exists():
        environment["FONTCONFIG_FILE"] = str(fontconfig)
    subprocess.run([office, "--headless", "--convert-to", "pdf", "--outdir", str(workdir), str(source)], check=True, capture_output=True, text=True, env=environment)
    pdf = workdir / f"{source.stem}.pdf"
    if not pdf.exists():
        raise RuntimeError(f"LibreOffice did not produce PDF for {source}")
    return pdf


def convert(source: Path, destination: Path, index: int) -> dict:
    folder = destination / f"lesson{index}"
    slides = folder / "slides"
    if folder.exists():
        shutil.rmtree(folder)
    slides.mkdir(parents=True)
    with tempfile.TemporaryDirectory(prefix="metc-pptx-") as temp_name:
        pdf = to_pdf(source, Path(temp_name))
        preview_pdf = folder / "preview.pdf"
        if pdf.resolve() != preview_pdf.resolve():
            shutil.copy2(pdf, preview_pdf)
        prefix = slides / "slide"
        subprocess.run([command("pdftoppm"), "-png", "-r", "150", str(preview_pdf), str(prefix)], check=True, capture_output=True, text=True)
    generated = sorted(slides.glob("slide-*.png"))
    if not generated:
        raise RuntimeError(f"No slide images generated for {source}")
    final: list[str] = []
    for position, slide in enumerate(generated, start=1):
        name = f"{position:03d}.png"
        slide.rename(slides / name)
        final.append(f"slides/{name}")
    data = {"id": f"lesson{index}", "source": source.name, "pdf": "preview.pdf", "title": human_title(source), "slides": final, "slideCount": len(final)}
    (folder / "preview.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--course", help="Convert only this course directory name")
    args = parser.parse_args()
    roots = [COURSES / args.course] if args.course else sorted(path for path in COURSES.iterdir() if path.is_dir())
    converted = 0
    for course in roots:
        source_files = sorted(path for path in (course / "source").iterdir() if path.suffix.lower() in PRESENTATIONS)
        for index, source in enumerate(source_files, start=1):
            data = convert(source, course / "demonstration", index)
            converted += 1
            print(f"PPT  {source.relative_to(METC)} -> {course.name}/demonstration/{data['id']} ({data['slideCount']} slides)")
    print(f"Converted {converted} presentation(s).")


if __name__ == "__main__":
    main()
