/**
 * Placeholder photography.
 *
 * Every image on the site is addressed by a *slot name*, never by URL. The
 * slots follow the blueprint §12 shot list, so when the two production shoot
 * days land, swapping a slot's `src` to a local `/images/...` file replaces the
 * photograph everywhere it appears — no component edits.
 *
 * Real photography lives in /public/images, sized by
 * scripts/optimize-photos.py from the originals in /photos. Slots still on
 * Unsplash stock are the ones the client has not shot yet; `next.config.ts`
 * allowlists that host, and the remotePattern comes out once the last one is
 * replaced.
 */

export type ImageSlot = {
  /** Blueprint shot-list note — what the real photograph should show. */
  brief: string;
  src: string;
  alt: string;
};

const unsplash = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  /* --- Hero + brand ----------------------------------------------------- */
  hero: {
    brief: "Shoot day 01 — dining room in motion: server crossing frame, full tables, warm light. Not an isolated plate.",
    src: "/images/short-rib-booth-hero.webp",
    alt: "A braised short rib on gnocchi in a candlelit booth, with red wine and a charcuterie board alongside",
  },
  chefPass: {
    brief: "Shoot day 01 — chef at the pass finishing a plate, hands and concentration.",
    src: unsplash("photo-1541557435984-1c79685a082b"),
    alt: "A chef plating a dish at the kitchen pass",
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
    brief: "Shoot day 01 — cocktail being finished at the bar, backlit.",
    src: unsplash("photo-1470337458703-46ad1756a187", 1600),
    alt: "A cocktail being strained over ice at the bar",
  },
  privateEvents: {
    brief: "Shoot day 02 — the Annex set for a long-table dinner, candles lit.",
    src: unsplash("photo-1522336572468-97b06e8ef143", 1600),
    alt: "A long table set for a private dinner in a dark room",
  },

  /* --- Rooms + retail ---------------------------------------------------- */
  diningRoom: {
    brief: "Shoot day 01 — wide room, warm, occupied.",
    src: unsplash("photo-1485686531765-ba63b07845a7", 1800),
    alt: "The warm, art-hung dining room in daylight",
  },
  bar: {
    brief: "Shoot day 01 — back bar, bottles, working bartender.",
    src: unsplash("photo-1514933651103-005eec06c04b", 1800),
    alt: "The back bar, lit and stocked",
  },
  bottleShop: {
    brief: "Shoot day 02 — shelves, labels, hands pulling a bottle.",
    src: unsplash("photo-1516594915697-87eb3b1c14ea", 1800),
    alt: "A shelf of wine bottles lined up label-out",
  },
  beachside: {
    brief: "Shoot day 01 — exterior and terrace at golden hour, Cocoa Beach.",
    src: unsplash("photo-1470158499416-75be9aa0c4db", 1800),
    alt: "Two glasses of wine on a rail at golden hour above the water",
  },
  annexRoom: {
    brief: "Shoot day 02 — the Annex, second configuration, guests present.",
    src: unsplash("photo-1543007630-9710e4a00a20", 1800),
    alt: "A private dining room under warm pendant lights",
  },
  table: {
    brief: "Shoot day 01 — shared table, several dishes, hands reaching.",
    src: "/images/pappardelle-ragu-hero.webp",
    alt: "Pappardelle in ragù under a blanket of shaved cheese and thyme",
  },
  board: {
    brief: "Shoot day 01 — charcuterie and cheese board, dark ground.",
    src: unsplash("photo-1478145046317-39f10e56b5e9", 1400),
    alt: "A charcuterie board with figs, olives and cured meat",
  },

  /* --- Happenings (blueprint §07 module 03) ------------------------------ */
  eventLiveMusic: {
    brief: "Shoot day 01 — the trio playing in the corner of the room.",
    src: unsplash("photo-1493225457124-a3eb161ffa5f", 1200),
    alt: "A musician performing under stage light",
  },
  eventWineDinner: {
    brief: "Shoot day 01 — pour at a seated wine dinner, glasses lined up.",
    src: unsplash("photo-1519671482749-fd09be7ccebf", 1200),
    alt: "Guests tasting wine around a table",
  },
  eventBrunch: {
    brief: "Shoot day 01 — brunch spread in daylight, mimosas in frame.",
    src: unsplash("photo-1533777324565-a040eb52facd", 1200),
    alt: "A brunch spread photographed from above",
  },
  eventCocktailClass: {
    brief: "Shoot day 01 — three finished cocktails on the bar rail.",
    src: unsplash("photo-1551024709-8f23befc6f87", 1200),
    alt: "Three cocktails lined up on a lit bar",
  },
  eventBuyout: {
    brief: "Shoot day 02 — full-room celebration, people occupying the space.",
    src: unsplash("photo-1550966871-3ed3cdb5ed0c", 1200),
    alt: "A banquet room set for a celebration",
  },
} satisfies Record<string, ImageSlot>;

export type ImageName = keyof typeof images;
