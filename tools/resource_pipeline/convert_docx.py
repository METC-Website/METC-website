#!/usr/bin/env python3
"""Convert every course DOCX in source/ to a sanitised HTML preview in demonstration/."""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
METC = ROOT / "public" / "resources" / "METC"
COURSES = METC / "课程设计"
ALLOWED = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "strong", "b", "em", "i", "u", "span", "div", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th", "img", "a", "blockquote"}
VOID = {"br", "img"}


class Sanitiser(HTMLParser):
    def __init__(self, assets: Path, asset_prefix: str):
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.assets = assets
        self.asset_prefix = asset_prefix
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        if tag in {"style", "script", "head", "title", "meta", "link"}:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag not in ALLOWED:
            return
        safe: list[str] = []
        values = dict(attrs)
        for key in ("colspan", "rowspan"):
            if values.get(key, "").isdigit():
                safe.append(f' {key}="{values[key]}"')
        if tag == "a" and values.get("href"):
            href = values["href"]
            if urlparse(href).scheme in {"", "http", "https", "mailto"}:
                safe.append(f' href="{html.escape(href, quote=True)}"')
        if tag == "img" and values.get("src"):
            source = Path(values["src"]).name
            if source and (self.assets / source).exists():
                safe.append(f' src="{self.asset_prefix}/{html.escape(source, quote=True)}"')
                safe.append(f' alt="{html.escape(values.get("alt") or "课程大纲图片", quote=True)}"')
                safe.append(' loading="eager" decoding="async"')
            else:
                return
        self.parts.append(f"<{tag}{''.join(safe)}>")

    def handle_endtag(self, tag: str):
        if tag in {"style", "script", "head", "title", "meta", "link"}:
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth:
            return
        if tag in ALLOWED and tag not in VOID:
            self.parts.append(f"</{tag}>")

    def handle_data(self, data: str):
        if not self.skip_depth:
            self.parts.append(html.escape(data))


def converter() -> str:
    return shutil.which("soffice") or shutil.which("libreoffice") or ""


def syllabus_language(source: Path) -> str:
    """Use `syllabus.en.docx` for English; an unlabelled syllabus is Chinese."""
    return "en" if source.stem.lower().endswith(".en") else "zh"


def convert(source: Path, destination: Path, language: str) -> None:
    office = converter()
    if not office:
        raise RuntimeError("LibreOffice/soffice is required to convert DOCX files.")
    with tempfile.TemporaryDirectory(prefix="metc-docx-") as temp_name:
        temp = Path(temp_name)
        subprocess.run([office, "--headless", "--convert-to", "html", "--outdir", str(temp), str(source)], check=True, capture_output=True, text=True)
        html_files = list(temp.glob("*.html")) + list(temp.glob("*.htm"))
        if not html_files:
            raise RuntimeError(f"LibreOffice did not produce HTML for {source}")
        output_name = f"syllabus.{language}"
        assets = destination / f"{output_name}-assets"
        if assets.exists():
            shutil.rmtree(assets)
        assets.mkdir(parents=True, exist_ok=True)
        for file in temp.rglob("*"):
            if file.is_file() and file.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".svg"}:
                shutil.copy2(file, assets / file.name)
        parser = Sanitiser(assets, assets.name)
        parser.feed(html_files[0].read_text(encoding="utf-8", errors="ignore"))
        fragment = re.sub(r"\n{3,}", "\n\n", "".join(parser.parts)).strip()
        fragment = "\n".join(line.rstrip() for line in fragment.splitlines())
        title_match = re.search(r"<h[1-3][^>]*>(.*?)</h[1-3]>", fragment, re.S)
        title = re.sub(r"<[^>]+>", "", title_match.group(1)).strip() if title_match else source.stem
        (destination / f"{output_name}.html").write_text(fragment, encoding="utf-8")
        (destination / f"{output_name}.json").write_text(json.dumps({
            "source": source.name,
            "title": html.unescape(title),
            "language": language,
            "html": f"{output_name}.html",
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--course", help="Convert only this course directory name")
    args = parser.parse_args()
    roots = [COURSES / args.course] if args.course else sorted(path for path in COURSES.iterdir() if path.is_dir())
    converted = 0
    for course in roots:
        sources: dict[str, Path] = {}
        for source in sorted((course / "source").glob("*.docx")):
            language = syllabus_language(source)
            if language in sources:
                raise RuntimeError(f"More than one {language} syllabus in {course / 'source'}")
            sources[language] = source
        for language, source in sources.items():
            destination = course / "demonstration"
            destination.mkdir(parents=True, exist_ok=True)
            convert(source, destination, language)
            converted += 1
            print(f"DOCX  {source.relative_to(METC)} -> {destination.relative_to(METC) / f'syllabus.{language}.html'}")
    print(f"Converted {converted} syllabus document(s).")


if __name__ == "__main__":
    main()
