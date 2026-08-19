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

Also prints the dominant watercolour hues sampled from this lockup. Note that
the `--wash-*` tokens in app/globals.css no longer come from here: they are
sampled from the guide's own approved watercolour texture instead, which runs
violet, coral and tan. What this prints is the bistro lockup's palette, useful
for checking how far the two have drifted.
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


def skeleton_mask(lockup: Image.Image) -> Image.Image:
    """
    The skeleton alone, as an alpha mask, for the rubber stamp.

    Cropped off the top of the lockup, above the wordmark, then keyed on
    darkness rather than on alpha: the watercolour carries alpha too, and a
    stamp wants the ink linework only.
    """
    crop = lockup.crop((0, 0, lockup.width, int(lockup.height * 0.57)))
    a = np.asarray(crop, dtype=np.float64)
    rgb, alpha = a[..., :3] / 255.0, a[..., 3] / 255.0

    luma = rgb @ np.array([0.2126, 0.7152, 0.0722])
    ink = np.clip((0.55 - luma) / 0.55, 0, 1) ** 0.85 * alpha

    out = (ink * 255).astype("uint8")
    white = np.full(out.shape + (3,), 255, dtype="uint8")
    mask = Image.fromarray(np.dstack([white, out]), mode="RGBA")
    box = mask.getchannel("A").getbbox()
    return mask.crop(box) if box else mask


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

        skel = skeleton_mask(img)
        skel.thumbnail((520, 520), Image.LANCZOS)
        skel_path = OUT / "skeleton-mask.png"
        skel.save(skel_path, optimize=True)
        print(f"  {skel_path.name:32s} {skel.width}×{skel.height}  "
              f"{skel_path.stat().st_size // 1024}KB")

        print("  watercolour sampled from the artwork:")
        for hexcode, share in sample_palette(img):
            print(f"    {hexcode}  {share:5.1f}%")


if __name__ == "__main__":
    main()
