#!/usr/bin/env python3
"""Generate public Student Voice WebP assets and the frontend manifest."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import quote

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover - reported with a useful message at runtime.
    Image = None
    ImageOps = None

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_METC_ROOT = ROOT / "public" / "resources" / "METC"
GENERATED = ROOT / "src" / "data" / "resources" / "generated" / "feedbacks.json"
ACCENTS = {"coral", "sun", "sky", "mint", "rose", "lavender"}
ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def public_url(path: Path, metc_root: Path) -> str:
    relative = path.relative_to(metc_root).as_posix()
    content_version = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    return "/METC-website/resources/METC/" + quote(relative, safe="/") + f"?v={content_version}"


def require_text(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty string")
    return value.strip()


def localized(value: object, field: str) -> dict[str, str]:
    if not isinstance(value, dict):
        raise ValueError(f"{field} must contain zh and en strings")
    return {
        "zh": require_text(value.get("zh"), f"{field}.zh"),
        "en": require_text(value.get("en"), f"{field}.en"),
    }


def convert_heic(source: Path, destination: Path) -> None:
    sips = shutil.which("sips")
    if not sips:
        raise RuntimeError("HEIC input requires macOS sips; convert the approved source to JPG first")
    with tempfile.TemporaryDirectory(prefix="metc-feedback-") as temp_name:
        jpeg = Path(temp_name) / "source.jpg"
        subprocess.run(
            [sips, "-s", "format", "jpeg", str(source), "--out", str(jpeg)],
            check=True,
            capture_output=True,
            text=True,
        )
        convert_webp(jpeg, destination)


def convert_webp(source: Path, destination: Path) -> None:
    if Image is None or ImageOps is None:
        raise RuntimeError("Pillow is required: install it with `python3 -m pip install Pillow`")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image.thumbnail((2400, 2400))
        image.save(destination, format="WEBP", quality=82, method=6)


def generate(metc_root: Path, output: Path) -> list[dict]:
    feedback_root = metc_root / "听ta们说"
    config_path = feedback_root / "feedback.config.json"
    if not config_path.exists():
        raise FileNotFoundError(
            f"Missing {config_path}. Copy tools/resource_pipeline/templates/student-feedback.config.json first."
        )
    payload = json.loads(config_path.read_text(encoding="utf-8"))
    items = payload.get("items")
    if not isinstance(items, list):
        raise ValueError("feedback.config.json must contain an items array")

    seen: set[str] = set()
    manifest: list[dict] = []
    for position, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"items[{position - 1}] must be an object")
        identifier = require_text(item.get("id"), f"items[{position - 1}].id")
        if not ID_PATTERN.fullmatch(identifier):
            raise ValueError(f"{identifier}: id must use lowercase letters, numbers, and hyphens")
        if identifier in seen:
            raise ValueError(f"Duplicate feedback id: {identifier}")
        seen.add(identifier)
        if item.get("approvedForPublicUse") is not True:
            raise ValueError(f"{identifier}: approvedForPublicUse must be true before public generation")

        source_relative = Path(require_text(item.get("source"), f"{identifier}.source"))
        if source_relative.is_absolute() or ".." in source_relative.parts:
            raise ValueError(f"{identifier}: source must stay inside the Student Voice resource directory")
        source = feedback_root / source_relative
        if not source.is_file():
            raise FileNotFoundError(f"{identifier}: source file not found: {source}")
        suffix = source.suffix.lower()
        if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".heic"}:
            raise ValueError(f"{identifier}: unsupported image type {suffix}")

        accent = require_text(item.get("accent", "coral"), f"{identifier}.accent")
        if accent not in ACCENTS:
            raise ValueError(f"{identifier}: unsupported accent {accent}")
        if item.get("variant", "envelope") != "envelope":
            raise ValueError(f"{identifier}: variant must be envelope")

        destination = feedback_root / "demonstration" / f"{identifier}.webp"
        if not destination.exists() or destination.stat().st_mtime < source.stat().st_mtime:
            if suffix == ".heic":
                convert_heic(source, destination)
            else:
                convert_webp(source, destination)

        entry = {
            "id": identifier,
            "imageSrc": public_url(destination, metc_root),
            "objectKey": "resources/METC/" + destination.relative_to(metc_root).as_posix(),
            "imageAlt": localized(item.get("imageAlt"), f"{identifier}.imageAlt"),
            "accent": accent,
            "variant": "envelope",
        }
        if item.get("grade") is not None:
            entry["grade"] = localized(item.get("grade"), f"{identifier}.grade")
        manifest.append(entry)

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--metc-root", type=Path, default=DEFAULT_METC_ROOT)
    parser.add_argument("--output", type=Path, default=GENERATED)
    args = parser.parse_args()
    manifest = generate(args.metc_root.resolve(), args.output.resolve())
    print(f"Generated {len(manifest)} Student Voice item(s) in {args.output}.")


if __name__ == "__main__":
    main()
