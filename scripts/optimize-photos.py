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

# Which derivatives each photo actually needs, keyed by filename stem and
# following the slot it fills in lib/images.ts. Generating every role for every
# photo quadruples what ships for no benefit, so anything listed here gets only
# the roles named; anything unlisted gets all of them, which is the right
# default for a photo that has just arrived and has no slot yet.
# Framing, applied to the original before anything is sized from it. Fractions
# of the source: (left, top, right, bottom).
#
# This is for photographs whose subject is off-centre in a way no CSS crop can
# fix — `object-position` can only slide the visible window inside whatever the
# frame's aspect leaves over, and when the frame and the source are nearly the
# same shape that is almost nothing. Cutting the dead ground here moves the
# subject in every frame at once, desktop, tablet and mobile.
#
# Kept as data rather than done to the file, so the original stays whole and
# the decision is legible.
CROP = {
    # The owners stand right of centre with the painted wall filling the left
    # of the frame, and there is a band of ceiling above them. Taking 28% off
    # the left and 10% off the top does three things at once: brings them from
    # 68% across to 56%, drops the ceiling, and scales them about 10% larger in
    # every frame. The result is 1506x2509 — an aspect of exactly 0.600, which
    # is what the homepage frame measures, so that render crops nothing.
    "owners-mural": (0.28, 0.10, 1.0, 1.0),
}

PLAN = {
    # --- Nelson's originals ---------------------------------------------
    "short-rib-booth": ["hero"],        # hero
    "pappardelle-ragu": ["hero"],       # table — menus masthead
    "burger-fries-neon": ["feature"],   # featuredFood
    "squid-ink-pasta": ["card"],        # dine
    "long-table-dinner": ["card"],      # gather
    "bourgogne-radicchio": ["card"],    # takeItHome
    # --- The client's commissioned shoot ---------------------------------
    # Lookbook, OpenTable and bar sets, 6000x4000 originals in their Drive.
    "espresso-martini-neon": ["feature"],   # featuredCocktail
    "owners-mural": ["feature"],            # hosts
    "bartender-flame": ["feature"],         # chefPass
    # Kept as a source but not placed: the web-resolution copy of the hosts
    # that owners-mural replaced.
    "owners-dining-room": [],
    "bartender-back-bar": ["feature"],      # bar
    "bartender-pour": ["card"],             # eventLiveMusic
    "cocktail-quartet": ["card"],           # eventCocktailClass
    "skillet-cornbread": ["card"],          # eventBrunch
    "shared-board": ["feature"],            # board
    "dining-room-full": ["feature"],        # diningRoom
    "mural-wall-room": ["feature"],         # beachside
    "mirror-diners": ["feature"],           # annexRoom
    "table-brick-candle": ["feature"],      # privateEvents
    "bar-pour-guests": ["feature"],         # bottleShop
    "bar-crowd": ["card"],                  # eventBuyout
    "table-candle-detail": ["card"],        # eventWineDinner
    # Held for later: extra plates from the same shoot, not yet placed.
    "roast-barley-plate": ["card"],
    "steak-frites": ["card"],
    "pasta-arugula-plate": ["card"],
    "old-fashioned": ["card"],
}


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
    override = sys.argv[1:]
    for role in override:
        if role not in ROLES:
            sys.exit(f"Unknown role {role!r}. Choose from: {', '.join(ROLES)}")

    for path in files:
        # exif_transpose honours the orientation tag, so phone shots do not
        # come out rotated.
        img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        name = path.stem.lower().replace(" ", "-").replace("_", "-")
        if name in CROP:
            l, t, r, b = CROP[name]
            before = img.size
            img = img.crop((round(l * img.width), round(t * img.height),
                            round(r * img.width), round(b * img.height)))
            print(f"  framed {before[0]}×{before[1]} -> {img.width}×{img.height}")
        roles = override or PLAN.get(name, list(ROLES))
        print(f"{path.name}  ({img.width}×{img.height})")
        for role in roles:
            derive(img, name, role)


if __name__ == "__main__":
    main()
