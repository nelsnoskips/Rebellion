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

# Where the final N of the script line sits, as fractions of the trimmed art.
# Left/right of the N proper, and from the top down to just under its baseline,
# clear of the splatter that follows it and of the BEACHSIDE line below.
N_WINDOW = (0.775, 0.0, 0.915, 0.46)


def render() -> Image.Image:
    page = pymupdf.open(SOURCE)[0]
    pix = page.get_pixmap(dpi=RENDER_DPI, alpha=True)
    art = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
    box = art.getchannel("A").getbbox()
    return art.crop(box)


def measure_n(art: Image.Image) -> tuple[int, int]:
    """The N's height and width, in pixels of the trimmed art."""
    w, h = art.size
    x0, y0, x1, y1 = N_WINDOW
    window = art.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
    box = window.getchannel("A").getbbox()
    if box is None:
        raise SystemExit("N_WINDOW found no ink — the artwork changed shape")
    return box[3] - box[1], box[2] - box[0]


def tint(art: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    """Repaint the art in one colour, keeping its alpha.

    The vector is a single flat colour, so this is a recolour and not a
    conversion: no edge is softened and no shape moves. It is the only way to
    get an ink copy and a knockout copy that register to the pixel.
    """
    out = Image.new("RGBA", art.size, (*rgb, 0))
    out.putalpha(art.getchannel("A"))
    return out


def main() -> None:
    art = render()
    n_h, n_w = measure_n(art)
    print(f"trimmed art  {art.width}x{art.height}")
    print(f"the N        {n_w}x{n_h}  ({n_w / art.width:.1%} wide, {n_h / art.height:.1%} tall)")

    padded = Image.new("RGBA", (art.width + 2 * n_w, art.height + 2 * n_h), (0, 0, 0, 0))
    padded.paste(art, (n_w, n_h))
    print(f"with clear space  {padded.width}x{padded.height}  "
          f"(aspect {padded.width / padded.height:.4f})")

    for name, rgb in (("rebellion-logotype.png", INK), ("rebellion-logotype-knockout.png", KNOCKOUT)):
        path = OUT / name
        tint(padded, rgb).save(path, optimize=True)
        print(f"{name:34s} {padded.width}x{padded.height}  {path.stat().st_size // 1024}KB")

    # Sanity: the two must be identical in geometry or the cross-fade shifts.
    a = np.asarray(Image.open(OUT / "rebellion-logotype.png").getchannel("A"))
    b = np.asarray(Image.open(OUT / "rebellion-logotype-knockout.png").getchannel("A"))
    assert a.shape == b.shape and np.array_equal(a, b), "the two copies do not register"
    print("both copies register exactly")


if __name__ == "__main__":
    main()
