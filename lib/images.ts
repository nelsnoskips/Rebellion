/**
 * The site's photography.
 *
 * Every image is addressed by a *slot name*, never by URL, so re-shooting a
 * subject is a one-line change here rather than an edit in every component
 * that happens to show it. Slots follow the blueprint §12 shot list.
 *
 * All of it is the client's own. The originals are 6000×4000 frames from their
 * commissioned lookbook, OpenTable and bar shoots, archived at 3000px in
 * /photos and sized for the web by scripts/optimize-photos.py. Nothing here is
 * stock and nothing is generated — where a subject has not been photographed
 * yet the `brief` says so and the slot borrows the closest true frame rather
 * than inventing the shot.
 */

export type ImageSlot = {
  /** What the real photograph should show — the shot-list note. */
  brief: string;
  src: string;
  alt: string;
};

export const images = {
  /* --- Hero + brand ----------------------------------------------------- */
  hero: {
    brief: "Shoot day 01 — dining room in motion: server crossing frame, full tables, warm light. Not an isolated plate.",
    src: "/images/short-rib-booth-hero.webp",
    alt: "A braised short rib on gnocchi in a candlelit booth, with red wine and a charcuterie board alongside",
  },
  chefPass: {
    brief:
      "The craft moment, hands and concentration. This one renders in a very " +
      "tall, narrow column, so it needs a single upright subject — a wide " +
      "photograph loses most of itself to the crop there.",
    src: "/images/bartender-flame-feature.webp",
    alt: "A bartender flaming the surface of a layered cocktail behind the bar",
  },

  /**
   * The people behind it. Separate from `chefPass` on purpose: this is a
   * two-person photograph and it needs a frame wide enough to hold both, which
   * the homepage's narrow column is not.
   */
  hosts: {
    brief:
      "The hosts, in front of the painted wall. Shot 3:4 into a 4:5 frame, so " +
      "the crop only takes a sliver off the height and both of them stay in.",
    src: "/images/owners-mural-feature.webp",
    alt: "Two hosts in front of the Rebellion mural, each holding a bottle from the list",
  },

  /* --- Choose your Rebellion (blueprint §07 module 02) ------------------- */
  dine: {
    brief: "Shoot day 01 — one finished plate, close, dark ground.",
    src: "/images/squid-ink-pasta-card.webp",
    alt: "Squid ink pasta with mussels and a whole prawn in a shallow bowl",
  },
  gather: {
    brief: "Shoot day 01 — guests mid-toast, real celebration energy.",
    src: "/images/long-table-dinner-card.webp",
    alt: "A long table of guests sharing charcuterie and wine while a server pours",
  },
  takeItHome: {
    brief: "Shoot day 02 — bottle pour or wrapped bottles ready for pickup.",
    src: "/images/bourgogne-radicchio-card.webp",
    alt: "A bottle of Bourgogne and a poured glass beside a radicchio salad by the window",
  },

  /* --- Feature triptych (blueprint §07 modules 04–06) -------------------- */
  featuredFood: {
    brief: "Shoot day 01 — the seasonal signature dish, hero crop.",
    src: "/images/burger-fries-neon-feature.webp",
    alt: "A burger with arugula and hand-cut fries under the neon of the bar",
  },
  featuredCocktail: {
    brief: "Shoot day 01 — cocktail finished at the bar, backlit.",
    src: "/images/espresso-martini-neon-feature.webp",
    alt: "A coupe of espresso martini on the bar, the red Rebel neon burning behind it",
  },
  privateEvents: {
    brief: "Shoot day 02 — the Annex set for a long-table dinner, candles lit. This is a two-top rather than the long table; a set-room frame is still to come.",
    src: "/images/table-brick-candle-feature.webp",
    alt: "A candlelit table laid against exposed brick",
  },

  /* --- Rooms + retail ---------------------------------------------------- */
  diningRoom: {
    brief: "Shoot day 01 — wide room, warm, occupied.",
    src: "/images/dining-room-full-feature.webp",
    alt: "The dining room full of guests, art hung frame to frame on the walls",
  },
  bar: {
    brief: "Shoot day 01 — back bar, bottles, working bartender.",
    src: "/images/bartender-back-bar-feature.webp",
    alt: "A bartender at the back bar, bottles stacked to the ceiling behind him",
  },
  bottleShop: {
    brief: "Shoot day 02 — shelves, labels, hands pulling a bottle. Not photographed yet; this is the bar rather than the retail shelf.",
    src: "/images/bar-pour-guests-feature.webp",
    alt: "Guests at the bar while a bartender pours",
  },
  beachside: {
    brief: "Shoot day 01 — exterior and terrace at golden hour. No exterior frame exists yet; the painted wall does the work of saying where you are.",
    src: "/images/mural-wall-room-feature.webp",
    alt: "The dining room with the Rebellion mural painted across the back wall",
  },
  annexRoom: {
    brief: "Shoot day 02 — the Annex, second configuration, guests present.",
    src: "/images/mirror-diners-feature.webp",
    alt: "Guests at dinner, caught in the reflection of a wall mirror",
  },
  table: {
    brief: "Shoot day 01 — shared table, several dishes, hands reaching.",
    src: "/images/pappardelle-ragu-hero.webp",
    alt: "Pappardelle in ragù under a blanket of shaved cheese and thyme",
  },
  board: {
    brief: "Shoot day 01 — the board, dark ground, built for the middle of the table.",
    src: "/images/shared-board-feature.webp",
    alt: "A shared board of dips, fries, cured meat and pickles spread across the table",
  },

  /* --- Happenings (blueprint §07 module 03) ------------------------------ */
  eventLiveMusic: {
    brief: "Shoot day 01 — the trio playing in the corner of the room. Not photographed yet; this is the bar in service.",
    src: "/images/bartender-pour-card.webp",
    alt: "A bartender building a drink at the bar",
  },
  eventWineDinner: {
    brief: "Shoot day 01 — pour at a seated wine dinner, glasses lined up.",
    src: "/images/table-candle-detail-card.webp",
    alt: "A candle burning on a laid table, glasses waiting",
  },
  eventBrunch: {
    brief: "Shoot day 01 — brunch spread in daylight.",
    src: "/images/skillet-cornbread-card.webp",
    alt: "Cornbread baked and served in a cast-iron skillet",
  },
  eventCocktailClass: {
    brief: "Shoot day 01 — finished cocktails on the bar rail.",
    src: "/images/cocktail-quartet-card.webp",
    alt: "Four cocktails arranged together, garnished and lit from above",
  },
  eventBuyout: {
    brief: "Shoot day 02 — full-room celebration, people occupying the space.",
    src: "/images/bar-crowd-card.webp",
    alt: "A full bar of guests talking over drinks",
  },
} satisfies Record<string, ImageSlot>;

export type ImageName = keyof typeof images;
