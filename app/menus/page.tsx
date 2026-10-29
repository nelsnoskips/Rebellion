import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { BrushRule } from "@/components/ui/Artwork";
import { menuCategories, type MenuSubsection } from "@/lib/menu-data";
import { site } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebellionbeachside.com";

export const metadata: Metadata = {
  /* "rebellion beachside bar and bistro menu" is the biggest brand search
     after the name itself — 312 impressions in 90 days — and the templated
     title ("Menus — Rebellion Beachside") carried neither "menu" in the
     singular nor "Bar and Bistro". Absolute, so the template does not append
     the short name on top of a title that already names the restaurant. */
  title: {
    absolute: "Menu — Rebellion Beachside Bar and Bistro, Cocoa Beach",
  },
  description:
    "Brunch, dinner, cocktails, spirits and wine at Rebellion Beachside Bar & Bistro — the full menu, exactly as it is served.",
};

/**
 * Menu structured data (blueprint §11, SEO/AEO).
 *
 * This page is the most-read on the site and "rebellion beachside bar and
 * bistro menu" is the single most-clicked search term, so what a crawler can
 * see here is worth more than anywhere else. Unmarked, the menu is one page;
 * marked up, it is a list of dishes an assistant can answer a question about.
 *
 * Only the sections whose dishes carry a description are listed item by item.
 * The wine, spirits, beer and cider lists are named but not enumerated: a
 * MenuItem of "2024 Ruge" with no description answers nothing, and 150 of them
 * would add tens of kilobytes to a page that four visitors in five open on a
 * phone. The section names still appear, so the shape of the list is complete.
 *
 * Built from the same `menuCategories` the page renders, so the markup cannot
 * claim a dish the kitchen has taken off.
 */
const DESCRIBED_SECTIONS = new Set(["Main Menu", "Brunch", "Cocktails Menu"]);

/** A glass/bottle pair or an MP dish has no single price to offer. */
function offerFor(price?: string) {
  if (!price || price === "MP" || price.includes("/")) return {};
  return {
    offers: { "@type": "Offer", price, priceCurrency: "USD" },
  };
}

function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${siteUrl}/menus#menu`,
    name: `${site.name} — menus`,
    url: `${siteUrl}/menus`,
    inLanguage: "en-US",
    hasMenuSection: menuCategories.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      ...(DESCRIBED_SECTIONS.has(category.name)
        ? {
            hasMenuSection: category.subsections.map((subsection) => ({
              "@type": "MenuSection",
              name: subsection.name,
              hasMenuItem: subsection.items.map((item) => ({
                "@type": "MenuItem",
                name: item.name,
                ...(item.desc ? { description: item.desc } : {}),
                ...offerFor(item.price),
              })),
            })),
          }
        : {}),
    })),
  };
}

/**
 * A bottle list is not a dinner menu: the spirits and wine sections are name
 * and price, where the kitchen's sections carry a description on every dish.
 * Rendering both as one long single-column list wastes a screen of space on
 * the hundred-odd bottles, so the density follows the content.
 */
function isList(subsection: MenuSubsection) {
  const described = subsection.items.filter((i) => i.desc).length;
  return subsection.items.length > 6 && described / subsection.items.length < 0.4;
}

/** Market-priced dishes carry "MP" rather than a number; wine carries glass / bottle. */
function Price({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span className="micro figure shrink-0 text-oxblood">
      {value === "MP" ? "MP" : `$${value}`}
    </span>
  );
}

/**
 * Menus are HTML, not PDFs — they have to be indexable and readable on a phone
 * in a parking lot (blueprint §11, SEO/AEO). The content is generated from the
 * client's live Dishio menu by scripts/fetch-menu.mjs, so this page and the QR
 * code on the table cannot drift apart.
 */
export default function MenusPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema()) }}
      />
    <PageShell
      eyebrow="Eat & Drink"
      title="Dinner without the usual script"
      intro="Seasonal ingredients, big flavors, zero shortcuts. The menu moves with the season, so a dish you loved may have been replaced by one you'll like more."
      image="table"
    >
      <nav
        aria-label="Menu sections"
        className="sticky top-20 z-30 border-b border-rule bg-bone/95 backdrop-blur-sm md:top-24"
      >
        <ul className="no-scrollbar flex gap-6 overflow-x-auto px-6 py-4 md:px-10">
          {menuCategories.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="micro whitespace-nowrap text-ink-mute transition-colors hover:text-oxblood"
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="paper-grain bg-bone">
        <div className="mx-auto max-w-[900px] px-6 py-16 md:px-10 lg:py-24">
          {menuCategories.map((category) => (
            <Reveal
              as="section"
              key={category.id}
              id={category.id}
              className="mb-20 scroll-mt-40 last:mb-0"
            >
              <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">
                {category.name}
              </h2>
              <BrushRule className="mt-5 h-3 w-28 text-oxblood" variant={1} />

              {category.subsections.map((subsection) => (
                <div key={subsection.name} className="mt-10">
                  <h3 className="micro-wide text-ink-mute">{subsection.name}</h3>

                  {isList(subsection) ? (
                    <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
                      {subsection.items.map((item, i) => (
                        <li
                          key={`${item.name}-${i}`}
                          className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
                        >
                          <span className="min-w-0">{item.name}</span>
                          <Price value={item.price} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="mt-5 divide-y divide-rule">
                      {subsection.items.map((item, i) => (
                        <li
                          key={`${item.name}-${i}`}
                          className="flex items-baseline gap-6 py-5"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.desc ? (
                              <p className="mt-1 text-sm text-ink-mute">
                                {item.desc}
                              </p>
                            ) : null}
                          </div>
                          <Price value={item.price} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Reveal>
          ))}

          <Reveal className="mt-16 border-t border-rule pt-10">
            <p className="text-sm text-ink-mute">
              Dietary needs, allergies, and large parties: tell us when you book
              or call{" "}
              <a href={site.phoneHref} className="text-oxblood underline underline-offset-4">
                {site.phone}
              </a>
              . Wine by the glass and bottle is priced glass / bottle. Dishes
              marked MP are priced at market — ask your server.
            </p>
            {/*
              The kitchen marks dishes served raw or undercooked with an
              asterisk, so the asterisk needs the notice that goes with it —
              Florida food code expects it on the menu, and an unexplained
              asterisk next to a tartare reads as a missing footnote.
            */}
            <p className="mt-4 text-xs text-ink-mute/80">
              *Consuming raw or undercooked meats, poultry, seafood, shellfish
              or eggs may increase your risk of foodborne illness.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={site.reserveUrl}
                className="micro bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
              >
                Reserve a table
              </Link>
              <Link
                href="/happenings"
                className="micro border border-ink/25 px-8 py-4 transition-colors duration-[var(--dur-micro)] hover:border-ink hover:bg-ink hover:text-bone"
              >
                Wine dinners &amp; classes
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </PageShell>
    </>
  );
}
