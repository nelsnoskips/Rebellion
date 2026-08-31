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

The 2021 guide is the source of the brand's *character*, not a web typography
spec. Forcing all four of its faces into equal service is what makes a website
look like a brand manual instead of a restaurant, so the display voice is a
modern editorial serif the guide never had, and the guide's own faces do the
work they are actually good at.

| Role      | Face                   | Where |
| --------- | ---------------------- | ----- |
| Display   | Cormorant Garamond     | headlines only — `.display`, `.display-soft` |
| Editorial | Archer Book / Medium   | paragraphs and descriptions — the body default |
| Interface | Festivo Letters No. 1  | navigation, buttons, labels — `.micro`, `.micro-wide` |
| Texture   | Trade Supply Textured  | accents only — `.accent` |

Three of the four are the brand's own faces. Archer and Festivo No. 1 were
never in the hand-off and ran on open-licence substitutes until it turned out
**the client publishes both from their own domain** — the *Use Any Font*
WordPress plugin serves them at
`rebellionrestaurants.com/wp-content/uploads/useanyfont/`, and their live site
sets its body copy and navigation in exactly these two. See
`brand/fonts/web/README.md`.

**Display — Cormorant Garamond, Medium and Semibold.** A high-contrast
editorial serif. It is not in the guide, and it is the right call anyway: it
reads premium in a way the 2021 system does not, which is what a chef-driven
bistro and wine room needs in 2026. Headlines only. At paragraph or label sizes
the hairlines disappear. Canela and Editorial New are the premium options and the
client wants one of them. Neither is in their Drive — I searched — and neither
can be fetched from anywhere legitimate, so the site ships on Cormorant and
there is a door built for the licensed face to walk through:

```bash
# 1. drop the licensed files in
cp Canela-Medium.otf Canela-Semibold.otf brand/fonts/display/
# 2. install
python3 scripts/build-display-font.py
```

Every headline switches over and nothing else changes — the site asks for one
family name, `Rebellion Display`, and only that folder decides what answers to
it. While the folder is empty the generated stylesheet is empty too, the name
resolves to nothing, and `--font-display` falls through to Cormorant with no
failed request. See `brand/fonts/display/README.md`.

**The licence is a real purchase, not a formality.** Canela is Commercial Type,
Editorial New is Pangram Pangram, and a *web font* licence is separate from a
desktop one — usually priced on monthly pageviews. A `noindex` preview is not
the same as shipping, so this needs settling before launch.

**Editorial — Archer, actually Archer.** The most useful face in the original
system: warm, conversational, slightly unconventional, far more Rebellion than
a neutral sans. Book is 400 and Medium is 500; Medium is declared again at 600
so anything asking for Semibold — which the client never deployed — lands on a
real weight rather than a synthesised one. **Archer Light is deliberately
unused**: it vanishes on photographs and at mobile sizes.

The licence question is real and is *not* settled by the files existing. `Use
Any Font` is a self-hosting plugin — it uploads what you give it and serves it
publicly; it neither checks nor grants anything. A Hoefler&Co **web** licence
is a separate purchase from a desktop one, so those files are evidence of a
deployment, not of a licence. Reusing the client's own file for the same
client's own site does not change their exposure either way, but it does not
fix it. Confirm with Hoefler&Co before launch; if there is no licence, repoint
`--font-body` and every paragraph follows.

Getting more of the page onto this face is the single change that connects the
site back to the brand book, so it is the body default — everything unstyled
inherits it.

**Interface — Festivo Letters No. 1.** The heavy condensed uppercase cut, and
the "Festivo Basic" the spec asked for in navigation and buttons. It was not
in the hand-off either; it came off the client's own server, where their live
site already uses it for exactly this. One drawn weight, declared across the
range so nothing synthesises a bold on a face that is already heavy. Uppercase,
`letter-spacing: 0.09em`, per the spec.

Festivo Letters No. 18 — the light monoline cut that *was* supplied — stays out
of the interface. It is a decorative display face and an 11px navigation bar
set in it is an unreadable navigation bar.

**Texture — Trade Supply Textured, rationed.** It is ink applied to the page,
never the page's default; at small sizes its distress turns to noise. It is
used in exactly five places and nowhere else:

- the Happenings event categories (`LIVE MUSIC`, `WINE DINNER`, `BRUNCH`)
- the same categories on `/happenings`
- the `TICKETED` stamped callout
- the Bottle Shop section mark
- the bottle style labels (`CHILLABLE RED`, `SPARKLING`)

**Handwriting — removed, and worth knowing why it is not coming back cheaply.**
The marginalia was set in a stock script face, and a recognisable Canva-style
handwriting cheapens artwork this considered.

Two facts settle the question. First, `.hand` was only ever used in the
**collage** direction — `components/collage/*`. The editorial direction the
client chose never had handwritten annotation at all, so nothing was lost from
the live design. Second, the client's own site has **no script or handwritten
face anywhere in its stack**: it loads Archer Book, Archer Medium, Festivo
No. 1, Festivo No. 18 and Trade Supply, and that is the entire list.

So there is no handwriting to restore — there is handwriting to *commission*.
The proper answer remains six to eight phrases ("Seasonal. Intentional.
Uncompromising.") drawn from the logo's own brush character and shipped as
SVG. That is a lettering job, not a font swap: the logo's script only contains
R, E, B, L, I, O and N, so the phrases cannot be assembled from it, and any
font picked to stand in for the brush would be exactly the recognisable
handwriting the spec rules out.

**Festivo Letters No. 18 and Minion Pro** are loaded but unused on the site.
They are set as specimens on `/rebellion-brand` so the client can see their own
faces rendered; `preload` is off, so no other page pays for them.

### Licensing

The three supplied OTFs are **desktop licences**. Serving a font from a web
server is a separate grant in every foundry's terms, Adobe's included. Only
Trade Supply is actually in service on the site, so that is the one to settle
before launch. Cormorant Garamond is open licence and carries no
restriction. Archer is the one to settle — see above.

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

## Generated imagery

One image on the site is not wholly photographic, and it is recorded here
rather than left for someone to notice.

**`hosts` — the owners in the dining room.** The original is 678×452, a web
copy with no EXIF. It is the sharpest picture of the two of them that exists in
any source we have, but far too small for the frames it needs to fill. It was
rebuilt in three steps:

1. sides taken in to centre the pair, and the compression damage cleaned up
   locally (`RESTORE` in `scripts/optimize-photos.py`);
2. upscaled to 2K through Higgsfield;
3. extended top and bottom through Higgsfield's outpaint, to 1696×2528, so it
   stands as a portrait instead of a letterbox.

**The ceiling above them and the floor below roughly their knees are
generated.** Everything from about knee height to the ceiling line — the two of
them, the bottles, the brick, the mirrors, the banquettes, the laid tables — is
the photograph. The invented parquet is plausible but has not been checked
against the real floor, which is worth doing before launch.

This is the line the project has held elsewhere: no generated food, no
generated room, no generated people. Extending the ceiling and floor of a real
photograph of real owners in their own dining room is a different thing from
inventing a dish or a space that nobody has eaten in or sat in. The camera
original would still be better than all of it, and `photos/owners-dining-room.jpg`
is kept unplaced so the rebuild can be redone from scratch if one appears.

## Decisions taken

**Shipping with Archer, licence to be confirmed afterwards** — the studio's
call, August 2026, made knowingly.

The reasoning is worth keeping, because "we did not realise" stops being
available once it is written down. The client's own live site already serves
Archer from their own server through a self-hosting plugin that neither checks
nor grants anything, so this build does not create the exposure — it inherits
it. Launching does not make it worse, and holding a launch over paperwork that
can be settled in parallel would have been the wrong trade.

What that leaves: someone should establish what the client actually owns. The
files reached that server somehow, so the 2021 brand designer and whoever built
the current WordPress site are the two people who would know. Desktop and web
are separate purchases at typography.com and a web licence is scoped to
domains and to a pageview tier, so a desktop licence from the branding project
— the most likely thing to exist — would not cover this.

If it turns out there is no licence, the fix is small: repoint `--font-body` at
an open-licence slab and lose some warmth. It is not a rebuild.

**The generated floor in the owners photograph is accepted** as it stands
(same date), so the note under *Generated imagery* is a record rather than an
outstanding question.

## Open, in order of what blocks what

1. **Confirm what the client owns for Archer**, per the decision above. Not a
   blocker; a loose end with a known fix.
2. **A web licence for Trade Supply**, the one supplied face actually in
   service. Same position as Archer, smaller surface — it is used for five
   accents rather than every paragraph.
3. **A Canela or Editorial New web licence.** The slot is built; the font is
   not. Until then headlines run on Cormorant Garamond.
4. **Custom handwritten SVG marks**, to replace the removed script face with
   something proprietary.
5. **PMS 5503 C — `#34657F` or `#91B6BC`?** Blocks print consistency. The site
   runs on the written value.
6. **White page ground, or keep the paper?** Two tokens. Client's call, and it
   changes the character of both directions more than anything else on this
   list.
