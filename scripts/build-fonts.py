#!/usr/bin/env python3
"""Convert the client's supplied desktop OTFs into subset WOFF2 web fonts.

The three faces come from the Rébellion house style guide (see
brand/Rebellion_Wine_Bar_Style_Guide.pdf, "TYPOGRAPHY"):

    Festivo Letters No. 18   headline type   (light monoline caps)
    Trade Supply Textured    subhead style   (heavy condensed textured caps)
    Minion Pro               editorial serif (stand-in for Archer, see below)

Archer — the guide's specified body face — is a Hoefler&Co licence and was not
supplied. Body copy stays on the current sans until a web licence exists.

The desktop OTFs carry glyph coverage the site will never render (Minion Pro
alone ships 1686 glyphs), so each face is subset to the Latin range the site
actually sets. That takes Trade Supply from 331 KB to a fraction of it, which
matters because these load in the critical path.

    python3 scripts/build-fonts.py

Licensing: these are desktop licences. Self-hosting as web fonts is a separate
grant in every one of these foundries' EULAs. See docs/brand-compliance.md.
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand" / "fonts"
OUT = ROOT / "app" / "fonts"

# Latin-1 plus the punctuation the site actually sets: the é in Rébellion, the
# ampersand, em/en dashes, curly quotes, the ellipsis and the bullet.
UNICODES = "U+0020-007E,U+00A0-00FF,U+2010-2015,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2013,U+2014,U+00E9,U+00C9"

FACES = ["FestivoLettersNo18", "TradeSupplyTextured", "MinionProRegular"]


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for stem in FACES:
        src = SRC / f"{stem}.otf"
        if not src.exists():
            print(f"missing {src}", file=sys.stderr)
            return 1
        dst = OUT / f"{stem}.woff2"
        subprocess.run(
            [
                sys.executable, "-m", "fontTools.subset", str(src),
                f"--unicodes={UNICODES}",
                "--layout-features=kern,liga,calt,smcp,c2sc,onum,lnum",
                "--flavor=woff2",
                "--desubroutinize",
                f"--output-file={dst}",
            ],
            check=True,
        )
        before = src.stat().st_size / 1024
        after = dst.stat().st_size / 1024
        print(f"{stem:24s} {before:7.0f} KB otf -> {after:6.0f} KB woff2")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
