#!/usr/bin/env python3
"""Pull the approved graphic elements out of the client's house style guide.

The guide's GRAPHIC ELEMENTS page (p6) names three sanctioned assets — SPLATS,
WATERCOLOR TEXTURE and SIGNATURE PATTERN — and p1 carries the full-colour
logo with illustration. All four are extracted here so the brand kit on the
site is the client's own artwork rather than an approximation of it.

    python3 scripts/extract-brand-kit.py

The splats and the pattern are pure black line art, so they come out as alpha
masks: transparent where the paper is, opaque where the ink is. That drops
them straight into the `.art-mask` system in app/globals.css, which paints
`currentColor` through a mask and so can tint them to any palette colour
without shipping a recoloured copy of each one.

The watercolour and the logo keep their colour and ship as WebP.
"""

import io
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
GUIDE = ROOT / "brand" / "Rebellion_Wine_Bar_Style_Guide.pdf"
OUT = ROOT / "public" / "brand"

DPI = 300
PT = DPI / 72.0

# Regions on the GRAPHIC ELEMENTS page, in PDF points on a 792x612 page.
SPLAT_BAND = (78, 130, 700, 225)
PATTERN_BOX = (404, 300, 706, 540)

# The logo itself is vector on both pages, so it is re-rendered rather than
# lifted out as a raster: page 1 for the full-colour lockup with illustration,
# page 2 for the one-colour logotype. Note these are the WINE BAR marks. The
# bistro carries its own lockup (public/brand/rebellion-lockup.webp); these sit
# alongside it as the house reference the guide governs.
LOCKUP_BOX = (270, 95, 530, 400)
LOGOTYPE_BOX = (541, 250, 690, 320)


def render(page, box, alpha=False):
    pix = page.get_pixmap(dpi=DPI, clip=pymupdf.Rect(*box), alpha=alpha)
    mode = "RGBA" if alpha else "RGB"
    return Image.frombytes(mode, (pix.width, pix.height), pix.samples)


def to_mask(rgb, floor=0.06):
    """Black line art on white paper -> an alpha mask of the ink."""
    luma = np.asarray(rgb, dtype=np.float32)[..., :3].mean(axis=2) / 255.0
    alpha = np.clip(1.0 - luma, 0.0, 1.0)
    # Kill the near-white noise the JPEG-backed page picks up, then renormalise
    # so the darkest ink is fully opaque.
    alpha[alpha < floor] = 0.0
    peak = alpha.max()
    if peak > 0:
        alpha = np.clip(alpha / peak, 0.0, 1.0)
    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(mask, pad=8):
    box = mask.getchannel("A").getbbox()
    if not box:
        return mask
    x0, y0, x1, y1 = box
    return mask.crop(
        (max(0, x0 - pad), max(0, y0 - pad), min(mask.width, x1 + pad), min(mask.height, y1 + pad))
    )


def split_columns(mask, gap=40):
    """Cut a row of separate splats apart on the blank columns between them."""
    ink = np.asarray(mask.getchannel("A")) > 4
    cols = ink.any(axis=0)
    runs, start = [], None
    blank = 0
    for x, filled in enumerate(cols):
        if filled:
            if start is None:
                start = x
            blank = 0
        elif start is not None:
            blank += 1
            if blank >= gap:
                runs.append((start, x - blank))
                start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    return runs


def fit(img, longest):
    scale = longest / max(img.size)
    if scale >= 1:
        return img
    return img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(GUIDE)

    # --- SPLATS -----------------------------------------------------------
    band = to_mask(render(doc[5], SPLAT_BAND))
    for i, (x0, x1) in enumerate(split_columns(band), start=1):
        splat = fit(trim(band.crop((x0, 0, x1, band.height))), 900)
        splat.save(OUT / f"splat-{i}.png")
        print(f"splat-{i}.png            {splat.width}x{splat.height}")

    # --- SIGNATURE PATTERN ------------------------------------------------
    pattern = fit(to_mask(render(doc[5], PATTERN_BOX), floor=0.10), 1400)
    pattern.save(OUT / "signature-pattern.png")
    print(f"signature-pattern.png   {pattern.width}x{pattern.height}")

    # --- WATERCOLOUR TEXTURE ----------------------------------------------
    for xref, *_ in doc[2].get_images(full=True):
        info = doc.extract_image(xref)
        if (info["width"], info["height"]) != (1827, 1933):
            continue
        art = fit(Image.open(io.BytesIO(info["image"])).convert("RGB"), 1600)
        art.save(OUT / "watercolor.webp", quality=88, method=6)
        print(f"watercolor.webp         {art.width}x{art.height}")
        break

    # --- THE HOUSE LOCKUP --------------------------------------------------
    # Flattened onto the page white rather than rendered with alpha. The
    # watercolour underlay sits on a soft grey plate in the PDF, and pulling
    # transparency out of it drags that plate along as a visible rectangle.
    # No loss: the guide's preferred background for the full-colour mark is
    # white, and the one-colour logotype below covers every other ground.
    lockup = fit(render(doc[0], LOCKUP_BOX), 1100)
    lockup.save(OUT / "wine-bar-lockup.webp", quality=90, method=6)
    print(f"wine-bar-lockup.webp    {lockup.width}x{lockup.height}")

    # The one-colour logotype becomes a mask, so a single file serves both the
    # black-on-white and the reversed-out uses on p2.
    logotype = fit(trim(to_mask(render(doc[1], LOGOTYPE_BOX), floor=0.12), pad=4), 1000)
    logotype.save(OUT / "wine-bar-logotype.png")
    print(f"wine-bar-logotype.png   {logotype.width}x{logotype.height}")

    doc.close()


if __name__ == "__main__":
    main()
