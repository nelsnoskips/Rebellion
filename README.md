# Rebellion Beachside Bar & Bistro — website

First build of the new Rebellion site, following the *Rebellion Brand Book ·
Website Plan · Commerce Blueprint*. Structure, design system and motion tokens
are real; **photography and copy are placeholders** meant to be replaced.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Deploying

`netlify.toml` is the source of truth and overrides whatever is configured in
the Netlify UI:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `out` |

The build is a **static export** (`output: "export"` in `next.config.ts`) —
every route is prerendered, so `out/` holds plain HTML with a real
`index.html` at the root and deploys on any static host.

Publishing `.next` instead is what produces Netlify's "Page not found": that
directory has no servable index at its root, so the deploy succeeds and every
URL 404s.

When server-rendered features arrive — CMS previews, reservation callbacks,
commerce (blueprint §11) — drop `output: "export"` and `images.unoptimized`,
add `@netlify/plugin-nextjs`, and publish `.next`.

## Routes

| Route | Blueprint reference |
| --- | --- |
| `/` | §07 homepage blueprint — hero, choose your Rebellion, tonight strip, editorial, private events, bottle shop, social proof, visit |
| `/menus` | §06 Eat & Drink — indexable HTML menus, never PDFs |
| `/happenings` | §07 module 03 + §11 single event source (also emits Event schema) |
| `/private-events` | §08 venue page and the qualified lead form |
| `/bottle-shop` | §09 merchant's edit + §10 fulfillment gate |
| `/story` | §03 brand foundation |
| `/visit` | §07 module 08 — NAP, hours, access, FAQs |
| `/reserve` | Landing path for the reservation platform embed |

## Where things live

- `app/globals.css` — the whole design system: palette (§05), type scale,
  motion tokens (§08), reduced-motion rules. No component hard-codes a hex or
  a duration.
- `lib/motion.ts` — the same motion tokens for JS (observer thresholds,
  stagger). Mirrors the CSS; don't invent new values elsewhere.
- `lib/images.ts` — every photograph, addressed by **slot name** with the
  shoot-day brief from §12. Swapping a slot's `src` to a local file replaces
  that photo everywhere it appears.
- `lib/site.ts` — nav, hours, NAP, menus, happenings, occasions, bottles.
  This is the shape the CMS should target (§11).
- `components/ui/Reveal.tsx` — the one scroll-reveal primitive.
- `components/ui/Artwork.tsx` — the painted layer (below).

## The painted layer

The identity is watercolour, ink and torn paper, so the site carries real
artwork rather than CSS gradients — washes with granulated edges and pigment
rims, thrown ink with satellites and spray, deckled paper between sections,
painted edges on photographs, and the tooth of the stock under bone surfaces.

`scripts/generate-artwork.py` produces all of it procedurally and
deterministically:

```bash
python3 scripts/generate-artwork.py    # needs numpy + pillow
```

Two conventions make it maintainable:

- **Everything is an alpha mask.** `/public/artwork/*.png` is white with the
  shape in the alpha channel, and the components paint `currentColor` through
  it — so a Tailwind `text-*` class recolours any texture and every tint stays
  on a palette token. One file serves the whole palette (~650KB total).
- **Torn edges belong to the paper.** A `<Deckle>` is rendered inside the
  *dark* section it overlaps, tinted to match the paper doing the tearing.

Components: `<Bloom>`, `<InkSplatter>`, `<Deckle>`, `<BrushRule>`,
`<ChapterMark>`, plus the `art-frame` / `art-frame-portrait` classes for
photographs and `paper-grain` for surfaces. All of it is decorative —
`aria-hidden`, `pointer-events-none`, and hidden entirely where CSS masking
is unsupported rather than degrading into coloured rectangles.

When the illustrator delivers scanned washes and splatters, drop them into
`/public/artwork` following the same mask convention and nothing else needs to
change.

## Brand artwork

Client-supplied artwork lives in `brand/`; `scripts/build-brand.py` derives the
web assets into `public/brand/`, so a re-supplied file is a drop-in and nothing
hand-edits the original.

```bash
python3 scripts/build-brand.py    # needs numpy + pillow
```

Two marks, and they are not interchangeable:

- **`<Lockup>`** — the full artwork: skeleton, watercolour, crimson script.
  Full colour, and therefore paper only.
- **`<Logotype>`** — the 1C wordmark, with a knockout variant. This is what
  goes on ink and oxblood grounds, and in anything nav-bar height.

The script also samples the artwork's watercolour hues, which is where the
`--wash-*` tokens come from. Worth knowing: the script red in the artwork is
about `#a81830`, brighter than the brand book's oxblood `#742a32`. The book
governs the interface; the crimson stays inside the artwork.

`brand/rebellion-lockup.svg` is **not** vector — it wraps two embedded rasters
at the same resolution as the PNG. If true vector turns up, point `SOURCES` at
it and raise the width; the lockup would then be crisp at any size, and the §08
signature moment (ink strokes tracing the skeleton on first entry) becomes
buildable.

## Swapping the placeholder photography

Stock images are served from Unsplash and allowlisted in `next.config.ts`.
Each slot in `lib/images.ts` carries a `brief` describing what the real frame
should show. To replace them:

1. Put the originals — full resolution, any filename — in `photos/` at the
   repo root.
2. Run `python3 scripts/optimize-photos.py` (needs pillow). It writes sized,
   compressed WebP into `public/images/`.
3. Point each slot in `lib/images.ts` at the derivative whose role matches
   where the slot is used, and rewrite its `alt`.
4. Once no slot points at Unsplash, delete the `remotePatterns` entry in
   `next.config.ts`.

The build is a static export, so there is no request-time image optimizer: the
width in the file is the width the visitor downloads. That is why the script
emits one derivative per role — `hero` 2400px, `feature` 1600px, `card` 900px,
`thumb` 420px — instead of a single file for every use.

## Reservations

`reservations` in `lib/site.ts` is the single point of configuration. Filling in
a booking's `venueId` and `apiKey` turns its inline Resy widget on; until then
it falls back to a `deepLink` if one is set, and to calling the restaurant if
not, so the reserve path never dead-ends on missing configuration.

Both values are public by design — Resy's embed is client-side and the key only
identifies the venue. Nothing secret belongs in this file.

`bookings` is a map because more than one thing can be bookable: the dining
room and any separate space or ticketed series each get an entry, and
`<ResyWidget booking="…" />` selects one.

Every Reserve CTA points at `/reserve` rather than straight out to Resy, so
campaigns land on a page we control. `utm_*`, `gclid` and `fbclid` are carried
onto the outbound link, and a `reservation_start` event is pushed to
`dataLayer` — inert until an analytics container is installed (§06).

Confirm the embed snippet against the one Resy issues for the account; if their
entry point differs, `components/reserve/ResyWidget.tsx` is the only file that
changes.

## Art directions

Two homepage treatments run side by side on the same content, the same tokens
and the same photography, so choosing between them is only ever about
treatment. `/directions` compares them.

| Route | Direction |
| --- | --- |
| `/` | **Editorial** — photograph-led. Full-bleed frames, dark bands as the spine of the page, paper tearing between them. |
| `/collage` | **Collage** — paper-led. Every photograph is a sheet torn out and laid down, half printed as ink, handwriting in the margins. Opens on a cinematic scroll-scrubbed hero. |

`/collage` and `/directions` are `noindex`. Once a direction is chosen, delete
the loser along with `components/collage/` (or fold it into `app/page.tsx`) —
nothing else depends on either.

### The cinematic hero

`/collage` opens on a pinned stage the visitor scrubs through while the page
assembles itself — washes bloom, the photograph tears into the corner, the
headline lands line by line, then the thrown ink, the handwriting and the
buttons, in the order someone would actually lay a page out.

The choreography moves the *real* elements of the composition rather than
separate act layers, so the finished frame is the comp itself and the still
frame costs nothing. The mark and the navigation are outside the timeline: the
logo settles rather than fades, and Reserve is live from the first frame.

Two engines and a still fallback:

- **CSS scroll-driven animation** where `animation-timeline: scroll()` is
  supported — no per-frame JavaScript.
- **A damped rAF loop** (`components/collage/ScrollMotion.tsx`) everywhere
  else, mirroring the same keyframe tables. Older Safari and Firefox ignore
  the CSS silently, and a hero that never moves is the failure mode.
- **The finished composition** under `prefers-reduced-motion`, with JavaScript
  off, or for a crawler. The stage unpins and everything renders in place.

Two things worth knowing before editing it:

- **Base styles are the finished frame; only the keyframes hold the start
  state.** At the exact end of `animation-range` Chromium reports the
  animation `finished` and stops filling, so anything depending on `fill:
  both` snaps back to its base style. With the start state as the base, the
  entire hero vanished for the last viewport of the pin.
- **Verify the fallback with the CSS engine disabled, not just with
  `CSS.supports` patched.** Patching only lies to the JavaScript check;
  Chromium's `@supports` block keeps running and will mask a broken fallback.

All three modes were checked by probing computed opacity across the scrub.

If you edit the `@keyframes` in `app/globals.css`, edit the matching table in
`ScrollMotion.tsx`. They are two expressions of one choreography.

## Placeholders that must be confirmed before launch

Everything below is illustrative and marked `PLACEHOLDER` in the source:

- **NAP and hours** (`lib/site.ts`) — verify address, phone and service hours
  against the client's Google Business Profile.
- **Menus and prices** — illustrative.
- **Happenings** — sample events; the real calendar becomes the single source
  feeding the homepage rail, this page and the structured data.
- **Venue capacities, layouts, minimums** — pending the walkthrough.
- **"The Annex at Rebellion"** — a strategic working name only. Trademark,
  domain and handle clearance is required before public use (§08).
- **Bottle shop** — nothing transacts. Inventory, pricing, processor and
  fulfillment are §11 platform decisions, and the delivery radius in
  `components/shop/DeliveryChecker.tsx` is a guess. Licensing, age
  verification, service rules, packaging and recordkeeping must be confirmed
  with Florida ABT and counsel before this page can take an order (§10).
- **Forms** — the newsletter, event inquiry and delivery checker are
  client-side only. The §08 automation (CRM lead, owner notification,
  source/campaign capture, same-business-day SLA task) is not wired.
- **Reservations** — the Resy integration is scaffolded but not configured:
  `venueId` and `apiKey` are null, so `/reserve` still shows the call-us
  panel.
- **Social proof quotes** — written for layout, not attributed to real guests.

## Motion, and what is still to come

Implemented: reveal-on-scroll with stagger, the marquee, card lift and image
crop on hover, the transparent→bone navigation change, the floating Reserve
control after the hero, and a full `prefers-reduced-motion` path that drops
choreography while keeping content and focus.

Not yet built, from §08:

- The signature skeleton moment — ink strokes tracing the illustration on
  first entry, watercolour bloom, one restrained gesture. Needs the skeleton
  artwork (only the 1C logotype was supplied) and a Rive state machine.
- GSAP + ScrollTrigger for hero sequencing and scroll-linked progress. The
  current reveals are CSS + IntersectionObserver, which is lighter; adopt GSAP
  when the hero timeline gets more complex than it is today.
- The ambient hero clip behind the poster frame, deferred until interactive.

## Accessibility

WCAG 2.2 AA is the target (§11). In place: skip link, semantic landmarks,
visible focus rings, keyboard-operable carousel with real buttons and disabled
states, labelled form fields, no hover-only information, no autoplay, and
reduced-motion support. Not yet done: a full audit on real hardware, contrast
verification of the final photography treatments, and form error messaging.
