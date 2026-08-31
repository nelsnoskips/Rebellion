/**
 * Site content.
 *
 * Placeholder copy and data live here so the CMS wiring (blueprint §11) has a
 * single shape to target later. Anything marked PLACEHOLDER is unverified and
 * must be confirmed with the client before launch — the blueprint's source
 * caution in §15 applies to hours, address, phone, capacities and prices.
 */

import { images, type ImageName } from "./images";

export const site = {
  name: "Rebellion Beachside Bar & Bistro",
  shortName: "Rebellion Beachside",
  /* What the mark on the page actually reads. The header carries the script
     alone, so this — not the full trading name — is the accessible name for
     it: alt text on a logo should say what a sighted visitor sees, and the
     full name would announce two lines that are not there. `name` still
     governs the metadata, the title and the structured data. */
  markName: "Rebellion",
  parent: "Rebellion Restaurants",
  tagline: "Rebel against the ordinary.",
  description:
    "A chef-driven beachside bistro, private gathering place, and bottle shop for people who would rather not do the expected.",
  /* Address and phone taken from rebellionrestaurants.com, which corrects the
     values in the design comp (200 N Orlando Ave / 321.784.9463 — comp dummy
     text). Still worth a final check against the Google Business Profile, since
     NAP has to match everywhere for local search (blueprint §11). */
  address: {
    street: "26 N Orlando Ave",
    city: "Cocoa Beach",
    state: "FL",
    zip: "32931",
  },
  phone: "321.613.2210",
  phoneHref: "tel:+13216132210",
  email: "hello@rebellionbeachside.com",
  /* Where private-event inquiries land, confirmed by the client. Separate from
     the general address on purpose: the events inbox is watched to a
     same-business-day promise and the general one is not. */
  eventsEmail: "michelle@rebellionwinebar.com",
  /* Every Reserve CTA points here rather than straight out to the booking
     platform, so campaigns land on a page we control and can measure
     (blueprint §06 measurement layer). See `reservations` below. */
  reserveUrl: "/reserve",
  mapUrl: "https://maps.google.com/?q=26+N+Orlando+Ave+Cocoa+Beach+FL+32931",
  social: {
    instagram: "https://www.instagram.com/rebellionbeachside/",
    facebook: "https://www.facebook.com/",
  },
} as const;

/**
 * Reservations (blueprint §11).
 *
 * Filling in `venueId` and `apiKey` for a booking target turns its inline Resy
 * widget on. Until then that target falls back to the deep link if it has one,
 * and to calling the restaurant if it doesn't — the reserve path never dead-ends
 * on missing configuration.
 *
 * Both values are public by design: Resy's embed runs client-side and the key
 * only identifies the venue to the widget. Nothing secret belongs here.
 *
 * `bookings` is a map because more than one thing can be bookable — the dining
 * room and any separate space or ticketed series each get their own entry, and
 * `<ResyWidget booking="…" />` picks one.
 */
export const reservations = {
  platform: "resy" as const,
  /** Resy's embed script. Loaded lazily, only on pages that mount a widget. */
  embedScript: "https://widgets.resy.com/embed.js",
  bookings: {
    diningRoom: {
      label: "Dining room",
      /* Both come from the restaurant's Resy dashboard (Widgets), or from the
         Resy account team. Filling them in swaps the link below for the inline
         booking widget — no other change needed. */
      venueId: null as number | null,
      apiKey: null as string | null,
      /** The venue's live Resy page. Used until the widget keys are in, and as
          the path that still works if the embed script fails. */
      deepLink:
        "https://resy.com/cities/cocoa-beach-fl/venues/rebellion-beachside-bar-and-bistro" as
          | string
          | null,
    },
  },
} as const;

export type BookingKey = keyof typeof reservations.bookings;

/* PLACEHOLDER — sourced from public listings, not yet confirmed with the
   restaurant. Hours drift constantly, so verify these (and happy hour, kitchen
   close and the brunch window) before launch. */
export const hours = [
  { days: "Mon – Thu", time: "3:30PM – 9PM" },
  { days: "Fri", time: "3:30PM – 10PM" },
  { days: "Sat", time: "3:30PM – 12AM" },
  { days: "Sun", time: "11AM – 9PM" },
];

/**
 * What is switched on.
 *
 * `bottleShop` is off while the site is merged into the client's hosting. The
 * code stays whole — the route, the section, the card, the footer link — and
 * flipping this back to true restores all of it at once. Hiding it by deleting
 * pages would mean rebuilding them later from memory.
 */
export const flags = {
  bottleShop: false,

  /**
   * Whether search engines may index this build.
   *
   * Off for previews and for the merge rehearsal, so a staging copy cannot
   * outrank the client's live pages or get indexed at the wrong URL. Turn it
   * on — or set NEXT_PUBLIC_INDEXABLE=true — as the last step of going live,
   * after the URL is final.
   */
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === "true",
} as const;

/** Primary navigation — blueprint §06, ordered by intent, not department. */
export const nav = [
  { label: "Menus", href: "/menus" },
  { label: "Happenings", href: "/happenings" },
  { label: "Private Events", href: "/private-events" },
  ...(flags.bottleShop ? [{ label: "Bottle Shop", href: "/bottle-shop" }] : []),
  { label: "Story", href: "/story" },
  { label: "Visit", href: "/visit" },
];

/** Module 02 — "Choose your Rebellion". Three ways in, no more. */
export const experiences: {
  key: string;
  title: string;
  line: string;
  cta: string;
  href: string;
  image: ImageName;
}[] = [
  {
    key: "dine",
    title: "Dine",
    line: "Chef-driven menus, craft cocktails & thoughtful wines.",
    cta: "Explore menus",
    href: "/menus",
    image: "dine",
  },
  {
    key: "gather",
    title: "Gather",
    line: "From date nights to big celebrations, we've got you.",
    cta: "Private events",
    href: "/private-events",
    image: "gather",
  },
  ...(flags.bottleShop
    ? [
        {
          key: "take-it-home",
          title: "Take It Home",
          line: "Curated wines, cocktails & provisions to enjoy anywhere.",
          cta: "Shop bottle shop",
          href: "/bottle-shop",
          image: "takeItHome" as const,
        },
      ]
    : []),
];

/** Module 04–06 — the three feature panels beneath the experience cards. */
export const features: {
  key: string;
  eyebrow: string;
  lines: string[];
  cta: string;
  href: string;
  image: ImageName;
  tone: "ink" | "ink-soft" | "oxblood";
}[] = [
  {
    key: "food",
    eyebrow: "Featured Food",
    lines: ["Seasonal ingredients.", "Big flavors.", "Zero shortcuts."],
    cta: "See what's cooking",
    href: "/menus",
    image: "featuredFood",
    tone: "ink",
  },
  {
    key: "cocktails",
    eyebrow: "Featured Cocktails",
    lines: ["Original pours,", "fresh ingredients,", "rebel spirit."],
    cta: "View cocktails",
    href: "/menus#cocktails",
    image: "featuredCocktail",
    tone: "ink-soft",
  },
  {
    key: "events",
    eyebrow: "Private Events",
    lines: [
      "Birthdays, anniversaries,",
      "rehearsals, or full buyouts.",
      "Make it unforgettable.",
    ],
    cta: "Plan your event",
    href: "/private-events",
    image: "privateEvents",
    tone: "oxblood",
  },
];

export type Happening = {
  slug: string;
  /** ISO date. The calendar, homepage rail, event page and structured data all
      read this one source (blueprint §11, "single event data source"). */
  date: string;
  kind: string;
  title: string;
  time: string;
  blurb: string;
  image: ImageName;
  ticketed?: boolean;
};

/* PLACEHOLDER — replace with the live events calendar feed. */
export const happenings: Happening[] = [
  {
    slug: "live-music-the-saltbacks",
    date: "2026-09-11",
    kind: "Live Music",
    title: "The Saltbacks",
    time: "7PM – 10PM",
    blurb: "Three pieces, no set list, one very loud opinion about Tom Petty.",
    image: "eventLiveMusic",
  },
  {
    slug: "wine-dinner-old-world-new-stories",
    date: "2026-09-19",
    kind: "Wine Dinner",
    title: "Old World, New Stories",
    time: "6PM – 9PM",
    blurb: "Five courses, five bottles, and the arguments that produced them.",
    image: "eventWineDinner",
    ticketed: true,
  },
  {
    slug: "brunch-club-vinyl-and-mimosas",
    date: "2026-09-26",
    kind: "Brunch Club",
    title: "Vinyl & Mimosas",
    time: "11AM – 2PM",
    blurb: "Records on the turntable, citrus on the bar, nobody in a hurry.",
    image: "eventBrunch",
  },
  {
    slug: "cocktail-class-stirred-not-taught",
    date: "2026-10-03",
    kind: "Cocktail Class",
    title: "Stirred, Not Taught",
    time: "3PM – 5PM",
    blurb: "Build three classics with our bar team. You keep the technique.",
    image: "eventCocktailClass",
    ticketed: true,
  },
  {
    slug: "live-music-the-driftline",
    date: "2026-10-10",
    kind: "Live Music",
    title: "The Driftline",
    time: "7PM – 10PM",
    blurb: "Beach soul with the amps turned toward the water.",
    image: "eventBuyout",
  },
];

/* PLACEHOLDER — menus are illustrative. Real menus must be indexable HTML,
   never PDFs (blueprint §11, SEO/AEO). */
export const menuSections = [
  {
    id: "to-start",
    name: "To Start",
    note: "Built for the middle of the table.",
    items: [
      {
        name: "Gulf Shrimp Toast",
        desc: "Brioche, chili butter, preserved lemon, chives",
        price: "18",
      },
      {
        name: "Charred Octopus",
        desc: "Smoked potato, romesco, pickled fresno",
        price: "21",
      },
      {
        name: "The Board",
        desc: "Three cheeses, two cures, honeycomb, whatever the chef is pickling",
        price: "26",
      },
      {
        name: "Oysters on Ice",
        desc: "Half dozen, cucumber mignonette, hot sauce we make here",
        price: "22",
      },
    ],
  },
  {
    id: "mains",
    name: "Mains",
    note: "Seasonal ingredients. Big flavors. Zero shortcuts.",
    items: [
      {
        name: "Seared Scallops",
        desc: "Black garlic, charred broccolini, brown butter",
        price: "39",
      },
      {
        name: "Berkshire Pork Chop",
        desc: "Stone fruit mostarda, mustard greens, jus",
        price: "42",
      },
      {
        name: "Local Catch",
        desc: "Ask your server — it changes with the boats",
        price: "MP",
      },
      {
        name: "Cacio e Pepe, Our Way",
        desc: "Hand-cut pasta, three peppers, cured yolk",
        price: "28",
      },
    ],
  },
  {
    id: "cocktails",
    name: "Cocktails",
    note: "Original pours, fresh ingredients, rebel spirit.",
    items: [
      {
        name: "The Ordinary (Refused)",
        desc: "Rye, amaro, burnt orange, black walnut",
        price: "16",
      },
      {
        name: "Beachside Spritz",
        desc: "Sparkling wine, grapefruit cordial, sea salt",
        price: "14",
      },
      {
        name: "Low Tide",
        desc: "Mezcal, pineapple, lime, ancho",
        price: "16",
      },
      {
        name: "No Proof, Still Loud",
        desc: "Zero-proof: hibiscus, verjus, tonic",
        price: "11",
      },
    ],
  },
  {
    id: "wine",
    name: "Wine",
    note: "Forty by the glass. Four hundred more downstairs.",
    items: [
      {
        name: "Coastal Whites",
        desc: "Albariño, Assyrtiko, Muscadet — anything that likes salt",
        price: "14+",
      },
      {
        name: "Chillable Reds",
        desc: "Gamay, Trousseau, Frappato — served at the right temperature",
        price: "15+",
      },
      {
        name: "Bubbles",
        desc: "Grower Champagne, Pét-Nat, Cava de Paraje",
        price: "16+",
      },
      {
        name: "The List",
        desc: "Ask for the book. Somebody read every page of it.",
        price: "—",
      },
    ],
  },
];

/** Blueprint §08 — private-events occasions. */
export const occasions = [
  {
    title: "Rehearsal Dinners",
    line: "Long table, one menu, no seating-chart drama.",
  },
  { title: "Milestone Celebrations", line: "Birthdays and anniversaries that earn a room." },
  { title: "Corporate Gatherings", line: "Off-sites, client dinners, and quiet deals." },
  { title: "Holiday Parties", line: "Company nights out and seasonal celebrations." },
  { title: "Wine Dinners", line: "Producer-led, paired, and properly poured." },
  { title: "Launches & Press", line: "Standing service, passed plates, full bar." },
  { title: "Full Buyouts", line: "The whole building, exactly your way." },
];

/* PLACEHOLDER — capacities and minimums require the venue walkthrough. */
export const venueFacts = [
  { label: "Seated", value: "Up to 60" },
  { label: "Standing", value: "Up to 90" },
  { label: "Full buyout", value: "Up to 150" },
  { label: "Response time", value: "Same business day" },
];

/** Blueprint §09 — the bottle shop opens as a merchant's edit, not a catalog. */
export const collections = [
  { name: "Chillable Reds", count: 6 },
  { name: "Beachside Whites", count: 7 },
  { name: "Bubbles", count: 5 },
  { name: "Under $30", count: 9 },
  { name: "Staff Picks", count: 4 },
];

/* PLACEHOLDER — inventory, pricing and fulfillment come from the commerce
   platform selected in blueprint §11. */
export const bottles = [
  {
    name: "Sanguine Gamay",
    producer: "Domaine Coteaux",
    region: "Beaujolais, France",
    vintage: "2023",
    style: "Chillable red",
    price: "28",
    note: "Serve it cold. Argue with anyone who says otherwise.",
  },
  {
    name: "Salt & Slate Albariño",
    producer: "Bodega Ría",
    region: "Rías Baixas, Spain",
    vintage: "2024",
    style: "Coastal white",
    price: "24",
    note: "Tastes like the wind coming off the water at 5pm.",
  },
  {
    name: "Pét-Nat No. 4",
    producer: "Ferment Collective",
    region: "Loire Valley, France",
    vintage: "2024",
    style: "Sparkling",
    price: "32",
    note: "Cloudy, a little feral, gone by Sunday.",
  },
  {
    name: "Old Vine Carignan",
    producer: "Casa Vieja",
    region: "Maule, Chile",
    vintage: "2022",
    style: "Structured red",
    price: "26",
    note: "Eighty-year-old vines and a price that makes no sense.",
  },
];

/** Editorial marquee, blueprint §08. */
export const marqueeWords = [
  "Food",
  "Wine",
  "Cocktails",
  "Gatherings",
  "Cocoa Beach",
];

export { images };
