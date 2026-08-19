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

### How the interface uses them

Both directions now run on these colours. The blueprint's palette is gone: each
role in `app/globals.css` points at the approved colour that fits it, so a
component still asks for `text-signal` or `bg-oxblood` and gets a house colour.

| Role         | Was       | Now       | Approved colour |
| ------------ | --------- | --------- | --------------- |
| `--ink`      | `#181817` | `#000000` | Process Black   |
| `--oxblood`  | `#742a32` | `#A60A3D` | PMS 1945 C      |
| `--signal`   | `#d25a43` | `#693C5E` | PMS 5125 C      |
| `--atlantic` | `#284c54` | `#34657F` | PMS 5503 C      |
| `--brass`    | `#b6955b` | `#F1BE48` | PMS 142 C       |
| `--ink-mute` | `#6d6a64` | `#68696C` | Cool Gray 7, darkened |
| `--rule`     | `#ddd4c5` | `#D8D5D0` | Cool Gray 7 at 30% over paper |

**Two of the six cannot carry text.** Against the paper ground PMS 142 lands at
1.5:1 and Cool Gray 7 at 2.5:1 — both far under the 4.5:1 that body copy needs,
and using them as written would have made prices and captions unreadable. Each
keeps its exact value for fills, borders and artwork; type moves to a darkened
companion at the same hue (`--brass-ink` `#85600A` at 5.0:1, `--ink-mute`
`#68696C` at 4.8:1). Every other role was checked and clears AA on paper:
`--oxblood` 6.7:1, `--signal` 7.6:1, `--atlantic` 5.5:1.

**The washes are the guide's watercolour now.** `--wash-coral`, `--wash-violet`
and `--wash-tan` are the median pigment value in each hue family of
`public/brand/watercolor.webp`, held a shade stronger because they paint at
40–60% opacity. They replace the blush/sky/sage sampled from the bistro lockup.

**The paper ground is the one deliberate hold.** The guide names white as the
preferred background *for the logo* and says nothing about a page ground. The
warm paper is the substrate both directions are built on, and the watercolour
and torn-paper artwork only reads against it. Setting `--bone` and `--paper` to
`#fff` goes white if the client wants that.

## Type

| Guide role      | Face                   | Status       | Where it lands                            |
| --------------- | ---------------------- | ------------ | ----------------------------------------- |
| Headline type   | Festivo Letters No. 18 | supplied     | `.display` — every headline in direction A |
| Subhead style   | Trade Supply Textured  | supplied     | `.micro`, `.micro-wide`, `.display-collage` |
| Body copy       | Archer                 | **missing**  | stood in by Bitter — `--font-body` |
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
  interface copy run on **Bitter** — the same geometric slab construction and
  softened terminals, drawn for screen text at the sizes body copy actually
  runs at. It is a stand-in and reads as one; point `--font-body` at the real
  Archer and every paragraph on the site follows. The `AdobeFnt*.lst` files
  from the client's InDesign folder also reference Avenir throughout, which was
  likewise not supplied — it is a macOS system font and has the same problem.
- **Figures stay on the body face.** Trade Supply's numerals are condensed and
  distressed, which is right on a label and wrong down a column of prices, so
  anything scanned rather than read takes `.figure` and keeps tabular spacing.

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

1. **Archer web licence.** Blocks body copy being the real thing rather than a
   stand-in.
2. **Web licences for Festivo, Trade Supply and Minion Pro.** Blocks public
   launch, not the preview.
3. **PMS 5503 C — `#34657F` or `#91B6BC`?** Blocks print consistency. The site
   runs on the written value.
4. **White page ground, or keep the paper?** Two tokens. Client's call, and it
   changes the character of both directions more than anything else on this
   list.
