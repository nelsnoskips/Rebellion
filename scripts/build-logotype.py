#!/usr/bin/env python3
"""Rebuild the header logotype from the supplied 1C vector.

`brand/rebellion-logotype.pdf` is true vector — 42 paths, one flat colour
(#231F20) — so everything the site serves is derived from it here rather than
hand-exported. Two things this fixes that hand-exported files got wrong:

**Registration.** The ink and knockout PNGs were 832x437 and 1109x583, both
declared to the browser as 1109x583. The header cross-fades one into the other
as the bar turns from transparent to bone, and mismatched geometry made the
mark shift a hair mid-fade. Both are now rendered from the same vector, trimmed
by the same box, at the same size.

**Clear space.** The exported art was trimmed hard to the ink, so the R's
descender and the BISTRO line ran to the very edge of the file. The style guide
(p3) sets clear space at the height and width of the N in Rébellion, and an
asset with no margin cannot honour that no matter how it is placed. The margin
is baked in here instead, so every use inherits it — the header, the footer, an
email signature, anything.

    python3 scripts/build-logotype.py      # needs pymupdf + numpy + pillow

The N is measured, not guessed: it is the last letter of the script line, and
the window below isolates it in fractions of the trimmed art so the measurement
survives a change of resolution.
"""

from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "brand" / "rebellion-logotype.pdf"
OUT = ROOT / "public" / "brand"

# 3x the largest size the mark is ever displayed at, which is the collage
# masthead. Comfortable on a 3x display and still a small file: the art is one
# flat colour, so PNG compresses it hard.
RENDER_DPI = 400

INK = (35, 31, 32)      # #231F20, the vector's own colour
KNOCKOUT = (244, 239, 230)  # --bone

# The vector is one page of 42 paths. Path 40 is the REBELLION script as a
# single compound path and 41 is the ink flick that follows it; 0-39 are the
# BEACHSIDE and BAR & BISTRO lines with their speckle. Splitting on that lets
# the script be lifted out as artwork rather than cropped out of a raster,
# which a crop could not do anyway — the R's descender runs straight down
# through the BAR line and a rectangle cannot separate them.
SCRIPT_PATHS = {40, 41}

# Where the final N sits in each mark, as fractions of the trimmed art. Width
# and height are read from separate windows because the ink flick sits low and
# to the right of the N and would otherwise be measured as part of it: the
# width window stops above the flick, the height window is a narrow column
# through the N's middle strokes that the flick never reaches.
N_WINDOW = {
    "lockup": {"w": (0.775, 0.0, 0.915, 0.46), "h": (0.775, 0.0, 0.915, 0.46)},
    "script": {"w": (0.750, 0.0, 0.915, 0.385), "h": (0.790, 0.0, 0.865, 0.60)},
}


def render(only: set[int] | None = None) -> Image.Image:
    """Rasterise the vector, optionally replaying just some of its paths."""
    page = pymupdf.open(SOURCE)[0]
    if only is None:
        pix = page.get_pixmap(dpi=RENDER_DPI, alpha=True)
    else:
        doc = pymupdf.open()
        blank = doc.new_page(width=page.rect.width, height=page.rect.height)
        for i, drawing in enumerate(page.get_drawings()):
            if i not in only:
                continue
            shape = blank.new_shape()
            for item in drawing["items"]:
                op = item[0]
                if op == "l":
                    shape.draw_line(item[1], item[2])
                elif op == "c":
                    shape.draw_bezier(item[1], item[2], item[3], item[4])
                elif op == "re":
                    shape.draw_rect(item[1])
                elif op == "qu":
                    shape.draw_quad(item[1])
            shape.finish(
                fill=drawing.get("fill"),
                color=drawing.get("color"),
                width=drawing.get("width") or 0,
                even_odd=drawing.get("even_odd", False),
                closePath=drawing.get("closePath", True),
            )
            shape.commit()
        pix = blank.get_pixmap(dpi=RENDER_DPI, alpha=True)
    art = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
    return art.crop(art.getchannel("A").getbbox())


def measure_n(art: Image.Image, mark: str) -> tuple[int, int]:
    """The N's height and width, in pixels of the trimmed art."""
    w, h = art.size

    def ink(window: tuple[float, float, float, float]):
        x0, y0, x1, y1 = window
        crop = art.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
        box = crop.getchannel("A").getbbox()
        if box is None:
            raise SystemExit(f"{mark}: N_WINDOW found no ink — the artwork changed shape")
        return box

    wide = ink(N_WINDOW[mark]["w"])
    tall = ink(N_WINDOW[mark]["h"])
    return tall[3] - tall[1], wide[2] - wide[0]


def tint(art: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    """Repaint the art in one colour, keeping its alpha.

    The vector is a single flat colour, so this is a recolour and not a
    conversion: no edge is softened and no shape moves. It is the only way to
    get an ink copy and a knockout copy that register to the pixel.
    """
    out = Image.new("RGBA", art.size, (*rgb, 0))
    out.putalpha(art.getchannel("A"))
    return out


def build(mark: str, art: Image.Image, stem: str) -> None:
    n_h, n_w = measure_n(art, mark)
    print(f"\n{mark}")
    print(f"  trimmed art   {art.width}x{art.height}")
    print(f"  the N         {n_w}x{n_h}  ({n_w / art.width:.1%} wide, {n_h / art.height:.1%} tall)")

    padded = Image.new("RGBA", (art.width + 2 * n_w, art.height + 2 * n_h), (0, 0, 0, 0))
    padded.paste(art, (n_w, n_h))
    print(f"  clear space   {padded.width}x{padded.height}  "
          f"(aspect {padded.width / padded.height:.4f})")

    for suffix, rgb in (("", INK), ("-knockout", KNOCKOUT)):
        path = OUT / f"{stem}{suffix}.png"
        tint(padded, rgb).save(path, optimize=True)
        print(f"  {path.name:34s} {padded.width}x{padded.height}  {path.stat().st_size // 1024}KB")

    a = np.asarray(Image.open(OUT / f"{stem}.png").getchannel("A"))
    b = np.asarray(Image.open(OUT / f"{stem}-knockout.png").getchannel("A"))
    assert a.shape == b.shape and np.array_equal(a, b), f"{stem}: the two copies do not register"
    print("  both copies register exactly")


def main() -> None:
    # The script alone is what the header and the watermarks carry. The full
    # lockup is still built, because the guide's preferred mark is the whole
    # thing and print will want it.
    build("script", render(SCRIPT_PATHS), "rebellion-script")
    build("lockup", render(), "rebellion-logotype")


if __name__ == "__main__":
    main()
