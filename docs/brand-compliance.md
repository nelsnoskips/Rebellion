# The house style guide, and where the site stands against it

Source: `brand/Rebellion_Wine_Bar_Style_Guide.pdf`, supplied by the client, ten
pages. Everything below is read off that document. A rendered version of the
same material lives at **`/rebellion-brand`**, which is a reference sheet, not
a third direction — directions A and B do not link to it and are not styled by
it.

Two things to hold in mind before reading the rest:

- **The guide is the Wine Bar's.** The site is Beachside Bar & Bistro, which
  has its own lockup (`public/brand/rebellion-lockup.webp`). The palette, the
  type and the graphic elements carry across the house. The mark does not, and
  no page of the site uses the Wine Bar's mark.
- **The guide splits its values by medium.** Page 4: *"Reference PMS and CMYK
  color values for print and promotional use. Reference Web and RGB color
  values for digital media."* So the hexes below govern here, and the Pantone
  references are carried only so print and web can be reconciled later.

---

## Colour

The six approved colours are now tokens in `app/globals.css` and Tailwind
utilities (`bg-brand-red`, `text-brand-plum`, and so on).

| Guide name  | Pantone           | Hex       | Token                 |
| ----------- | ----------------- | --------- | --------------------- |
| Bold        | PMS 1945 C        | `#A60A3D` | `--brand-red`         |
| Comfortable | PMS 5125 C        | `#693C5E` | `--brand-plum`        |
| Stylish     | Process Black     | `#000000` | `--brand-black`       |
| Accessible  | PMS 5503 C        | `#34657F` | `--brand-blue`        |
| Dependable  | PMS Cool Gray 7 C | `#97999B` | `--brand-gray`        |
| Versatile   | PMS 142 C         | `#F1BE48` | `--brand-gold`        |

**One discrepancy to put to the client.** PMS 5503 C is written as `#34657F` —
a deep slate blue — but the swatch printed beside it on page 4 reads `#91B6BC`,
and the reversed logo panel on page 2 uses that same pale teal, not the deep
one. Both are carried: `--brand-blue` holds the written value,
`--brand-blue-tint` holds the printed one. Ask which is canonical before any
print work goes out.

### What the two directions still use

Directions A and B were signed off on the blueprint's palette, which predates
this guide. Their surfaces are untouched, so what the client has already seen
is what they will see again. The one value worth a decision:

- `--oxblood` is `#742a32`, a deeper and browner red than the house
  `#A60A3D`. Pointing `--oxblood` at `var(--brand-red)` is a one-line change in
  `app/globals.css` and every accent, rule, button and hover state follows it.
  Left as it is for now, deliberately.

The watercolour washes are a second, smaller gap. The guide's watercolour runs
violet, coral and tan; the site's washes are blush, sky and sage, sampled from
the bistro's own lockup artwork. Both are defensible — the bistro lockup is the
bistro's — but they are not the same palette.

## Type

| Guide role      | Face                   | Status       | Where it lands                            |
| --------------- | ---------------------- | ------------ | ----------------------------------------- |
| Headline type   | Festivo Letters No. 18 | supplied     | `.display` — every headline in direction A |
| Subhead style   | Trade Supply Textured  | supplied     | `.micro`, `.micro-wide`, `.display-collage` |
| Body copy       | Archer                 | **missing**  | — |
| (not in guide)  | Minion Pro             | supplied     | `.display-soft` — pull quotes, statements |

The three supplied faces are converted from the desktop OTFs in `brand/fonts/`
to subset WOFF2 by `scripts/build-fonts.py` and loaded through
`next/font/local` in `app/layout.tsx`.

Notes on the mapping:

- **Festivo is caps-only.** It has no true lowercase, so it can only take roles
  that are already uppercase. Sentence-case editorial voice goes to Minion Pro.
- **Direction B's masthead is Trade Supply, not Festivo.** The collage comp was
  drawn with heavy display type, and Festivo is a light monoline face. Trade
  Supply keeps the weight the composition needs and is the same lettering as
  the "BEACHSIDE BAR & BISTRO" line of the bistro's own lockup.
- **Trade Supply ships one weight.** Anything above 400 synthesises a bold and
  smears the distressed edges that are the whole point of the face, so every
  rule that sets it pins the weight.
- **Archer needs a licence.** Hoefler&Co, not in the hand-off. Body and
  interface copy run on Inter until there is one. The `AdobeFnt*.lst` files
  from the client's InDesign folder also reference Avenir throughout, which was
  likewise not supplied — it is a macOS system font and has the same problem.

### Licensing

The three OTFs are **desktop licences**. Serving a font from a web server is a
separate grant in the terms of every foundry involved, including Adobe's for
Minion Pro. This is fine for a private, unindexed preview — which is what
`/rebellion-a`, `/rebellion-b` and `/rebellion-brand` are, all three marked
`noindex` — and needs settling before a public launch. Minion Pro in particular
is normally served through Adobe Fonts rather than self-hosted.

## Graphic elements

Page 6 sanctions three. All three are now extracted from the guide itself by
`scripts/extract-brand-kit.py` rather than approximated:

| Element           | File                                | Form                          |
| ----------------- | ----------------------------------- | ----------------------------- |
| Splats            | `public/brand/splat-1…5.png`        | alpha masks, tint with `text-*` |
| Watercolor texture| `public/brand/watercolor.webp`      | full colour |
| Signature pattern | `public/brand/signature-pattern.png`| alpha mask, one block |

`Splat` and `SignaturePattern` in `components/ui/Artwork.tsx` render them.
Neither direction uses them yet — the procedural artwork in `public/artwork/`
still carries A and B, and swapping it out would change work the client has
already reviewed.

The house lockup is extracted too: `wine-bar-lockup.webp` (full colour, on
white, which the guide names as preferred) and `wine-bar-logotype.png` (a mask,
so one file serves black-on-white and every reversed use).

## The mark

- Full colour is always preferred; white is the preferred ground.
- Reversed out of a solid palette colour where white is not possible.
- Never altered.
- Clear space on every side equals the height and width of the *N* in
  Rébellion.

The bistro header holds clear space with fixed padding on the lockup, which
comes to the same distance at every size the mark is used, rather than
recalculating per breakpoint.

## Open, in order of what blocks what

1. **Archer web licence.** Blocks body copy matching the guide.
2. **Web licences for Festivo, Trade Supply and Minion Pro.** Blocks public
   launch, not the preview.
3. **PMS 5503 C — `#34657F` or `#91B6BC`?** Blocks print consistency.
4. **Move the interface onto the house red?** One line. Client's call.
