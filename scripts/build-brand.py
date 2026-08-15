#!/usr/bin/env python3
"""
Turn the supplied brand artwork into web assets.

Sources live in `brand/`; derivatives go to `public/brand/`, which is what the
components reference. Keeping the two separate means a re-supplied file is a
drop-in — nothing hand-edits the original.

Note `brand/rebellion-lockup.svg` is not vector: it wraps two embedded rasters
at the same resolution as the PNG, so the PNG is the better source. If true
vector artwork turns up, point SOURCES at it and raise the width.

    python3 scripts/build-brand.py

Also prints the dominant watercolour hues sampled from the artwork, so the
palette tokens in app/globals.css can be checked against the real thing rather
than approximated.
"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "brand"
OUT = ROOT / "public" / "brand"

# Source file -> (output stem, max width). The full lockup is only ever used on
# paper, so it keeps its colour; the 1C wordmark is what goes on dark grounds.
SOURCES = {
    "rebellion-lockup.png": ("rebellion-lockup", 1000),
}


def trim(img: Image.Image) -> Image.Image:
    """Crop to the artwork's alpha bounding box, so layout controls the margin."""
    box = img.getchannel("A").getbbox()
    return img.crop(box) if box else img


def sample_palette(img: Image.Image, swatches: int = 6) -> list[tuple[str, float]]:
    """
    The watercolour hues actually present, ignoring the ink linework, the
    crimson wordmark and the paper. Quantising to a coarse grid keeps this
    stable across re-runs.
    """
    small = img.convert("RGBA").resize((220, 260), Image.LANCZOS)
    a = np.asarray(small, dtype=np.int16)
    rgb, alpha = a[..., :3], a[..., 3]

    mx = rgb.max(axis=-1)
    mn = rgb.min(axis=-1)
    sat = mx - mn

    # Washes: visible, not near-black ink, not near-white paper, and tinted.
    keep = (alpha > 90) & (mx > 110) & (mn < 245) & (sat > 14)
    px = rgb[keep]
    if px.size == 0:
        return []

    quant = (px // 24) * 24
    keys, counts = np.unique(quant.reshape(-1, 3), axis=0, return_counts=True)
    order = np.argsort(-counts)[:swatches]
    total = counts.sum()
    return [
        ("#%02x%02x%02x" % tuple(int(c) for c in keys[i]), counts[i] / total * 100)
        for i in order
    ]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for filename, (stem, max_width) in SOURCES.items():
        path = SRC / filename
        if not path.is_file():
            print(f"  missing: brand/{filename} — skipped")
            continue

        img = trim(Image.open(path).convert("RGBA"))
        if img.width > max_width:
            height = round(img.height * max_width / img.width)
            img = img.resize((max_width, height), Image.LANCZOS)

        target = OUT / f"{stem}.webp"
        img.save(target, "WEBP", quality=90, method=6)
        print(f"  {target.name:32s} {img.width}×{img.height}  "
              f"{target.stat().st_size // 1024}KB")

        print("  watercolour sampled from the artwork:")
        for hexcode, share in sample_palette(img):
            print(f"    {hexcode}  {share:5.1f}%")


if __name__ == "__main__":
    main()
