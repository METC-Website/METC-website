#!/usr/bin/env python3
"""Build course.json, album.json, and the frontend's generated resource indexes."""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import quote

try:
    from PIL import Image
except ImportError:  # The index remains useful even without optional image dimensions.
    Image = None

ROOT = Path(__file__).resolve().parents[2]
METC = Path(os.environ.get("METC_RESOURCE_ROOT", ROOT / "resources" / "METC"))
COURSES = METC / "课程设计"
EXHIBITION = METC / "活动成果展览"
GENERATED = ROOT / "src" / "data" / "resources" / "generated"
MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}

# Pilot scope for the jpg->webp rollout. Empty set = convert every album;
# a non-empty set = only these album folder names emit WebP (others keep their
# original jpg so the live site is never broken mid-rollout).
WEBP_PILOT_ALBUMS: set[str] = set()


def url_for(path: Path) -> str:
    return "/METC-website/resources/METC/" + quote(path.relative_to(METC).as_posix(), safe="/")


def identifier(label: str, prefix: str) -> str:
    normal = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")
    return normal or f"{prefix}-{hashlib.sha1(label.encode()).hexdigest()[:8]}"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def localized_text(value: object, fallback: str) -> dict[str, str]:
    if isinstance(value, dict):
        zh = value.get("zh", fallback)
        return {"zh": str(zh), "en": str(value.get("en", zh))}
    text = str(value) if value is not None else fallback
    return {"zh": text, "en": text}


def localized_list(value: object) -> dict[str, list[str]]:
    if isinstance(value, dict):
        zh = value.get("zh", [])
        en = value.get("en", zh)
        return {
            "zh": [str(item) for item in zh] if isinstance(zh, list) else [],
            "en": [str(item) for item in en] if isinstance(en, list) else [],
        }
    items = [str(item) for item in value] if isinstance(value, list) else []
    return {"zh": items, "en": items}


def syllabus_language(source: Path) -> str:
    return "en" if source.stem.lower().endswith(".en") else "zh"


def image_shape(path: Path) -> tuple[int | None, int | None, str]:
    if Image is None:
        return None, None, "standard"
    try:
        with Image.open(path) as image:
            width, height = image.size
        ratio = width / height if height else 1
        return width, height, "wide" if ratio > 1.35 else "portrait" if ratio < .78 else "standard"
    except Exception:
        return None, None, "standard"


def web_photo(path: Path, album_root: Path) -> Path | None:
    """Return a browser-ready photo while retaining the original HEIC unchanged."""
    if path.suffix.lower() != ".heic":
        return path
    sips = shutil.which("sips")
    if not sips:
        print(f"Skipping HEIC without macOS sips: {path.relative_to(METC)}")
        return None
    destination = album_root / "demonstration" / f"{hashlib.sha1(path.relative_to(album_root).as_posix().encode()).hexdigest()[:12]}.jpg"
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists() or destination.stat().st_mtime < path.stat().st_mtime:
        subprocess.run([sips, "-s", "format", "jpeg", str(path), "--out", str(destination)], check=True, capture_output=True, text=True)
    return destination


def to_webp(original: Path, album_root: Path) -> Path | None:
    """Convert a raster original (jpg/png) to a WebP copy inside demonstration/.

    The original file is never modified. Returns the WebP path, or None when
    Pillow is unavailable or the source is not a convertible raster image.
    """
    if original.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        return None
    if Image is None:
        return None
    destination = album_root / "demonstration" / f"{hashlib.sha1(original.relative_to(album_root).as_posix().encode()).hexdigest()[:12]}.webp"
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists() or destination.stat().st_mtime < original.stat().st_mtime:
        with Image.open(original) as im:
            im.convert("RGB").save(destination, format="WEBP", quality=80)
    return destination


def build_courses() -> list[dict]:
    entries: list[dict] = []
    course_dirs = [path for path in COURSES.iterdir() if path.is_dir()]
    course_dirs.sort(key=lambda path: (read_json(path / "course.config.json").get("order", 999), path.name))
    for position, course_dir in enumerate(course_dirs, start=1):
        config = read_json(course_dir / "course.config.json")
        demonstration = course_dir / "demonstration"
        syllabus: dict[str, str | None] = {"zh": None, "en": None}
        syllabus_assets: dict[str, list[str]] = {"zh": [], "en": []}
        for language in syllabus:
            syllabus_file = demonstration / f"syllabus.{language}.html"
            if syllabus_file.exists():
                syllabus[language] = url_for(syllabus_file)
            assets = demonstration / f"syllabus.{language}-assets"
            if assets.exists():
                syllabus_assets[language] = [
                    url_for(asset)
                    for asset in sorted(assets.iterdir())
                    if asset.is_file() and asset.suffix.lower() in MEDIA_EXTENSIONS | {".svg"}
                ]
        # Keep existing single-language courses working until their next DOCX conversion.
        legacy_syllabus = demonstration / "syllabus.html"
        if legacy_syllabus.exists() and not syllabus["zh"]:
            syllabus["zh"] = url_for(legacy_syllabus)
        decks: list[dict] = []
        lesson_titles = config.get("lessonTitles", [])
        for deck_position, preview in enumerate(sorted(demonstration.glob("lesson*/preview.json")), start=1):
            payload = read_json(preview)
            folder = preview.parent
            decks.append({
                "id": payload.get("id", folder.name),
                "title": lesson_titles[deck_position - 1] if deck_position <= len(lesson_titles) else payload.get("title", folder.name),
                "source": payload.get("source", ""),
                "pdf": url_for(folder / payload["pdf"]) if payload.get("pdf") else None,
                "slideCount": payload.get("slideCount", 0),
                "slides": [url_for(folder / slide) for slide in payload.get("slides", [])]
            })
        syllabus_sources: dict[str, str | None] = {"zh": None, "en": None}
        for source in sorted((course_dir / "source").glob("*.docx")):
            language = syllabus_language(source)
            if syllabus_sources[language]:
                raise RuntimeError(f"More than one {language} syllabus in {course_dir / 'source'}")
            syllabus_sources[language] = source.name
        configured_title = config.get("title", course_dir.name)
        title = localized_text(configured_title, course_dir.name)
        data = {
            "id": config.get("id", identifier(course_dir.name, "course")),
            "catalog": f"METC · {position:02d}",
            "title": title,
            "school": config.get("school", "METC 合作学校"),
            "category": localized_text(config.get("category"), "课程设计"),
            "color": config.get("color", ["coral", "blue", "mint"][min(position - 1, 2)]),
            "icon": config.get("icon", "spark"),
            "summary": localized_text(config.get("summary"), "METC 课程资源。"),
            "contains": localized_list(config.get("contains", [])),
            "hasSyllabus": any(syllabus.values()),
            "syllabus": syllabus,
            "syllabusAssets": syllabus_assets,
            "syllabusSource": syllabus_sources,
            "lessons": decks
        }
        (course_dir / "course.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        entries.append(data)
    return entries


def build_albums() -> list[dict]:
    albums: list[dict] = []
    accents = ["coral", "sky", "mint"]
    for position, folder in enumerate(sorted(path for path in EXHIBITION.iterdir() if path.is_dir()), start=1):
        config = read_json(folder / "album.config.json")
        existing = read_json(folder / "album.json")
        cover_source = config.get("coverPhoto")
        feature_source = config.get("homepageFeaturePhoto")
        photos: list[dict] = []
        pilot = not WEBP_PILOT_ALBUMS or folder.name in WEBP_PILOT_ALBUMS
        candidates = (path for path in folder.rglob("*") if path.is_file() and "demonstration" not in path.relative_to(folder).parts)
        for original in sorted(path for path in candidates if path.suffix.lower() in MEDIA_EXTENSIONS | {".heic"}):
            item = to_webp(original, folder) if pilot else None
            if item is None:
                item = web_photo(original, folder)
            if item is None:
                continue
            width, height, shape = image_shape(item)
            photos.append({
                "id": f"{identifier(folder.name, 'school')}-{len(photos) + 1:03d}",
                "sourceFile": original.relative_to(folder).as_posix(),
                "src": url_for(item),
                "alt": f"{folder.name}课程活动",
                "caption": original.parent.name if original.parent != folder else None,
                "width": width,
                "height": height,
                "size": shape
            })
        cover = next((photo for photo in photos if photo["sourceFile"] == cover_source), None)
        feature = next((photo for photo in photos if photo["sourceFile"] == feature_source), None)
        for photo in photos:
            photo.pop("sourceFile")
        data = {
            "id": identifier(folder.name, "school"),
            "school": folder.name,
            "title": f"{folder.name}课程活动",
            "subtitle": "METC 课堂活动成果",
            "description": "记录学生在讨论、实验、创作与分享中的课堂瞬间。",
            "accent": config.get("accent", existing.get("accent", accents[(position - 1) % len(accents)])),
            "coverPhotoId": cover["id"] if cover else photos[0]["id"] if photos else None,
            "photos": photos
        }
        if feature:
            data["homepageFeaturePhotoId"] = feature["id"]
        (folder / "album.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        albums.append(data)
    return albums


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    courses = build_courses()
    albums = build_albums()
    (GENERATED / "courses.json").write_text(json.dumps(courses, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (GENERATED / "albums.json").write_text(json.dumps(albums, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(courses)} course.json file(s), {len(albums)} album.json file(s), and frontend indexes in {GENERATED.relative_to(ROOT)}.")


if __name__ == "__main__":
    main()
