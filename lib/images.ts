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
   * The owners. Kept separate from `chefPass` because it is a two-person
   * photograph and needs a frame wide enough to hold both — which is why the
   * homepage section it appears in had its grid rebalanced to suit it.
   */
  hosts: {
    brief:
      "The owners in the dining room. Built from a 678x452 original: sides " +
      "taken in, upscaled to 2K, then extended top and bottom so it stands " +
      "as a portrait. The ceiling and the floor below their knees are " +
      "generated — see docs/brand-compliance.md. Replace the whole thing if " +
      "the camera original turns up.",
    src: "/images/owners-extended-feature.webp",
    alt: "The owners in the dining room, each holding a bottle from the list",
  },

  /* --- Choose your Rebellion (blueprint §07 module 02) ------------------- */
  dine: {
    brief:
      "Shoot day 03 — a plate that looks like the kitchen it came from, shot on the pass rather than styled.",
    src: "/images/peach-burrata-card.webp",
    alt: "Prosciutto, burrata and peach with rocket and crushed pistachio in a wide bowl",
  },

  gather: {
    brief:
      "Shoot day 03 — a standing reception in the private room, cocktail tables " +
      "and the wine wall. Used with the client's confirmation; guests are " +
      "recognisable.",
    src: "/images/wine-room-reception-card.webp",
    alt: "Guests standing at cocktail tables by the wine wall, string lights across the pressed-tin ceiling above",
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
    brief:
      "Shoot day 03 — the private room laid and lit, before guests arrive. Set " +
      "rather than full on purpose: someone planning a party needs to picture " +
      "their own people in it, not somebody else's. Cropped from a wider frame " +
      "to drop a mirror that reflected two guests' faces.",
    src: "/images/wine-room-set-feature.webp",
    alt: "The private room laid for dinner — green banquette, candlelit tables, the Rebellion mark on the wall under a pressed-tin ceiling",
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
    brief:
      "Shoot day 02 — the room, wide. A crop of the original frame: the full " +
      "shot showed guests at the near table and was withdrawn in October 2026 " +
      "when one of them asked us to take it down. Any replacement wide shot " +
      "needs an empty room, or consent from everyone recognisable in it.",
    src: "/images/rebellion-wall-feature.webp",
    alt: "The Rebellion wordmark sprayed across the lit brick wall of the dining room, punk flyers papering the wall above",
  },

  /**
   * Sent by the client in October 2026 to replace the withdrawn frame. Shot on
   * a phone rather than at the lookbook shoot, which is why it is here and not
   * in scripts/optimize-photos.py — there is no 3000px original to re-size
   * from. Nobody is in it.
   */
  barCoupe: {
    brief: "The bar, looking down the counter. A drink in the foreground, the collage wall behind, no guests in frame.",
    src: "/images/bar-coupe-feature.webp",
    alt: "A coupe of pale pink cocktail on the bar counter, the back bar and collage wall behind it",
  },


  annexRoom: {
    brief:
      "Shoot day 03 — the private room with a party in it, which is the other " +
      "half of what someone booking needs to see. Used with the client's " +
      "confirmation: the guests in it are recognisable.",
    src: "/images/wine-room-party-feature.webp",
    alt: "The private room full for a celebration — guests along the banquette and at the bar under string lights and a pressed-tin ceiling",
  },

  table: {
    brief: "Shoot day 01 — shared table, several dishes, hands reaching.",
    src: "/images/pappardelle-ragu-hero.webp",
    alt: "Pappardelle in ragù under a blanket of shaved cheese and thyme",
  },
  board: {
    brief:
      "Shoot day 03 — several plates waiting on the pass, which says kitchen rather than table.",
    src: "/images/pass-bowls-feature.webp",
    alt: "Three bowls of a seafood course lined up on the stainless pass, ready to go out",
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
