/**
 * Pull the live menu from Dishio and regenerate lib/menu-data.ts.
 *
 * The client maintains the menu in Dishio (the QR-code menu behind the tables),
 * so that is the source of truth — not this repo. Re-run whenever they change
 * it:
 *
 *     node scripts/fetch-menu.mjs
 *
 * The public menu comes off the same tRPC procedure the dish.io page itself
 * calls, so what we render is exactly what a guest scanning the QR code sees.
 */
import { writeFileSync } from "node:fs";

const MENU_ID = process.env.DISHIO_MENU_ID ?? "cm8iyo4q200cum3etqzes05ku";
const ENDPOINT = "https://dish.io/api/trpc/menu.getMenuV2Public";

/** Dishio hides a section, a subsection or a dish by flag rather than removing it. */
const live = (node) => !node.hidden && !node.deleted && !node.deletedGlobal;

const bySortIndex = (a, b) => (a.sortingIndex ?? 0) - (b.sortingIndex ?? 0);

/**
 * Dishio stores price as a free-text string, and the restaurant uses three
 * conventions in it: a plain number, a `glass/bottle` pair on the wine list,
 * and zero for anything priced at market. `hiddenPrice` means the dish is
 * deliberately listed without one.
 */
function formatPrice(product) {
  if (product.hiddenPrice) return null;
  const raw = String(product.price ?? "").trim();
  if (!raw) return null;

  const pair = raw.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (pair) return `${trimZeros(pair[1])} / ${trimZeros(pair[2])}`;

  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  if (n === 0) return "MP";
  return trimZeros(raw);
}

const trimZeros = (s) => String(Number(s));

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Dishio's copy arrives with smart quotes and stray trailing whitespace. */
const clean = (s) => (s ?? "").replace(/\s+/g, " ").trim();

/**
 * Dishio's own ordering is whatever the kitchen last dragged things into, which
 * is not how a menu reads. These are the running orders a restaurant would
 * print: food before drinks, a course order within each meal, desserts last,
 * and the back-bar reference list at the very end.
 *
 * Anything Dishio grows that is not named here keeps its own position and
 * sorts to the end, so a new section appears on the site rather than vanishing.
 */
const CATEGORY_ORDER = [
  "Main Menu",
  "Brunch",
  "Cocktails Menu",
  "Drinks Menu",
  "Wine Menu",
  "Spirits Menu",
];

const SUBSECTION_ORDER = {
  // Courses, in the order they arrive at the table.
  "Main Menu": ["Hors D\u2019Oeuvres", "Mains", "Mains with Frites", "Sides", "Desserts"],
  Brunch: ["Brunch", "Sides"],
  // House drinks first, zero-proof last.
  "Cocktails Menu": [
    "Signature Cocktails",
    "Seasonal Cocktails",
    "Bold and Boozy",
    "Bitter and Botanical",
    "Fresh and Sour",
    "Mocktails",
  ],
  // By the glass, poured lightest to heaviest, then beer.
  "Drinks Menu": ["Sparkling", "White", "Ros\u00e9", "Orange", "Red", "Beers", "Seltzer"],
  // France by region as a wine list runs it, then the new world.
  // Two of these names are truncated in Dishio; they have to match exactly.
  "Wine Menu": [
    "Burgundy, Champagne & Beaujola",
    "Bordeaux & Southwest France",
    "Rhone Valley, Provence & Langu",
    "Loire Valley",
    "Alsace, Savoy & The Jura",
    "New World Wines",
  ],
  // Back bar, in the order a bartender would walk it.
  "Spirits Menu": [
    "Vodka",
    "Gin",
    "Rum",
    "Tequila",
    "Bourbon/Whiskey",
    "Rye",
    "Scotch",
    "Cognac/Armagnac",
    "Cordials",
  ],
};

/**
 * Dishio truncates a subsection name at 30 characters, which is fine in their
 * admin and looks like a bug on a printed-feeling menu ("Burgundy, Champagne &
 * Beaujola"). Only the wine list runs long enough to hit it. These restore the
 * region names in full; the keys are the truncated strings Dishio returns.
 */
const DISPLAY_NAME = {
  "Burgundy, Champagne & Beaujola": "Burgundy, Champagne & Beaujolais",
  "Rhone Valley, Provence & Langu": "Rhone Valley, Provence & Languedoc",
};

/** Known names sort by the lists above; everything else keeps Dishio's order, after them. */
function byNamedOrder(names, getName) {
  return (a, b) => {
    const ia = names.indexOf(getName(a));
    const ib = names.indexOf(getName(b));
    if (ia === -1 && ib === -1) return (a.sortingIndex ?? 0) - (b.sortingIndex ?? 0);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  };
}

async function main() {
  const input = encodeURIComponent(
    JSON.stringify({ 0: { json: { menuId: MENU_ID } } }),
  );
  const res = await fetch(`${ENDPOINT}?batch=1&input=${input}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Dishio returned ${res.status}`);

  const menu = (await res.json())[0].result.data.json;

  const categories = menu.categories
    .filter(live)
    .sort(byNamedOrder(CATEGORY_ORDER, (c) => clean(c.sectionName)))
    .map((category) => ({
      id: slug(category.sectionName),
      name: clean(category.sectionName),
      subsections: category.subcategories
        .filter(live)
        .sort(
          byNamedOrder(
            SUBSECTION_ORDER[clean(category.sectionName)] ?? [],
            (sub) => clean(sub.subsectionName),
          ),
        )
        .map((sub) => ({
          name:
            DISPLAY_NAME[clean(sub.subsectionName)] ?? clean(sub.subsectionName),
          items: sub.products
            .filter(live)
            .sort(bySortIndex)
            .map((product) => {
              const desc = clean(product.description);
              const price = formatPrice(product);
              return {
                name: clean(product.productName),
                ...(desc ? { desc } : {}),
                ...(price ? { price } : {}),
              };
            }),
        }))
        .filter((sub) => sub.items.length > 0),
    }))
    .filter((category) => category.subsections.length > 0);

  const count = categories.reduce(
    (n, c) => n + c.subsections.reduce((m, s) => m + s.items.length, 0),
    0,
  );

  const file = `// Generated by scripts/fetch-menu.mjs — do not edit by hand.
// Source: the client's live Dishio menu (${MENU_ID}).
// Re-run \`node scripts/fetch-menu.mjs\` after they change it.
//
// ${categories.length} sections, ${count} dishes, pulled ${new Date().toISOString().slice(0, 10)}.

export type MenuItem = {
  name: string;
  desc?: string;
  /** Absent when the kitchen lists the dish without a price. */
  price?: string;
};

export type MenuSubsection = { name: string; items: MenuItem[] };

export type MenuCategory = {
  id: string;
  name: string;
  subsections: MenuSubsection[];
};

export const menuCategories: MenuCategory[] = ${JSON.stringify(categories, null, 2)};
`;

  writeFileSync(new URL("../lib/menu-data.ts", import.meta.url), file);
  console.log(`Wrote lib/menu-data.ts — ${categories.length} sections, ${count} dishes.`);
  for (const c of categories) {
    const n = c.subsections.reduce((m, s) => m + s.items.length, 0);
    console.log(`  ${c.name} (${n})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
