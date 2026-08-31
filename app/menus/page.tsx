import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { BrushRule } from "@/components/ui/Artwork";
import { menuCategories, type MenuSubsection } from "@/lib/menu-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menus",
  description:
    "Brunch, dinner, cocktails, spirits and wine at Rebellion Beachside Bar & Bistro — the full menu, exactly as it is served.",
};

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
  );
}
