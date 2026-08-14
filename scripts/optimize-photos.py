#!/usr/bin/env python3
"""
Turn the brand photography into web-ready assets.

Originals go in `photos/` at the repo root (any filename, full resolution —
straight off the camera or the phone is fine). This writes sized, compressed
WebP into `public/images/`, which is what `lib/images.ts` points at.

    python3 scripts/optimize-photos.py

The site is a static export, so there is no image optimizer at request time
(see next.config.ts). That makes the width chosen here the width the visitor
downloads — hence one derivative per role rather than one file for everything:

    hero     2400px   full-bleed mastheads
    feature  1600px   half- and third-width section images
    card      900px   cards, gallery tiles
    thumb     420px   the happenings rail

`lib/images.ts` picks the role that matches where a slot is used. Re-running is
safe and deterministic: existing derivatives are overwritten in place.
"""

from __future__ import annotations

import pathlib
import sys

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "photos"
OUT = ROOT / "public" / "images"

# role -> (max width, WebP quality)
ROLES = {
    "hero": (2400, 80),
    "feature": (1600, 82),
    "card": (900, 82),
    "thumb": (420, 80),
}

SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic"}


def derive(img: Image.Image, name: str, role: str) -> None:
    width, quality = ROLES[role]
    out = img.copy()
    if out.width > width:
        height = round(out.height * width / out.width)
        out = out.resize((width, height), Image.LANCZOS)
    path = OUT / f"{name}-{role}.webp"
    out.save(path, "WEBP", quality=quality, method=6)
    print(f"  {path.name:38s} {out.width}×{out.height}  {path.stat().st_size // 1024}KB")


def main() -> None:
    if not SOURCE.is_dir():
        sys.exit(f"No {SOURCE.relative_to(ROOT)}/ directory — put the originals there first.")

    files = sorted(p for p in SOURCE.iterdir() if p.suffix.lower() in SUFFIXES)
    if not files:
        sys.exit(f"No images found in {SOURCE.relative_to(ROOT)}/.")

    OUT.mkdir(parents=True, exist_ok=True)
    roles = sys.argv[1:] or list(ROLES)
    for role in roles:
        if role not in ROLES:
            sys.exit(f"Unknown role {role!r}. Choose from: {', '.join(ROLES)}")

    for path in files:
        # exif_transpose honours the orientation tag, so phone shots do not
        # come out rotated.
        img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        name = path.stem.lower().replace(" ", "-").replace("_", "-")
        print(f"{path.name}  ({img.width}×{img.height})")
        for role in roles:
            derive(img, name, role)


if __name__ == "__main__":
    main()
