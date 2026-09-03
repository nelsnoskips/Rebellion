import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/lib/shop-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Rebellion merch — tees, tanks, hats and the mug. Wear the rebellion home from Cocoa Beach.",
};

/**
 * The catalogue, in our design; the sale itself happens on the store.
 *
 * Every product is a variable one — sizes and colours are chosen on the
 * WooCommerce product page — so the seam is at the buy click rather than in the
 * middle of a checkout we would otherwise have to rebuild here. Browsing, which
 * is where the brand impression is made, stays on this site.
 *
 * Content comes from scripts/fetch-shop.mjs. Re-run it when stock changes.
 */
export default function ShopPage() {
  return (
    <PageShell
      eyebrow="Shop"
      title="Wear the rebellion"
      intro="Tees, tanks, a hoodie for the walk back from the beach, and the mug that started an argument. Printed for us, sold at both bars."
      image="takeItHome"
    >
      <div className="paper-grain bg-bone">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 lg:py-24">
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal as="li" key={product.slug} index={i % 3} className="group">
                <a
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col"
                >
                  <span className="art-frame relative block aspect-square overflow-hidden bg-white">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                      className="object-contain p-6 transition-transform duration-[var(--dur-editorial)] ease-[var(--ease-expressive)] group-hover:scale-[1.04]"
                    />
                  </span>

                  <span className="mt-5 flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{product.name}</span>
                    <span className="micro figure shrink-0 text-oxblood">
                      {product.price}
                    </span>
                  </span>

                  {product.design ? (
                    <span className="mt-1 block text-sm text-ink-mute">
                      {product.design}
                    </span>
                  ) : null}

                  <span className="micro mt-3 block text-ink-mute">
                    {[product.colors.join(", "), product.sizes.join(" · ")]
                      .filter(Boolean)
                      .join("  —  ")}
                  </span>

                  <span className="micro accent mt-4 inline-flex items-center gap-2 self-start text-oxblood">
                    <span className="border-b border-oxblood/50 pb-1">
                      Choose a size
                    </span>
                    <span aria-hidden="true">→</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-16 border-t border-rule pt-10">
            <p className="max-w-[62ch] text-sm text-ink-mute">
              Sizes are picked and orders are taken on our store, which runs on a
              separate system — that is the link on every item above. Everything
              is printed for us and sold at both bars, so you can also just ask
              for it at the counter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={site.storeUrl}
                target="_blank"
                rel="noreferrer"
                className="micro bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
              >
                Go to the store
              </a>
              <Link
                href="/visit"
                className="micro border border-ink/25 px-8 py-4 transition-colors duration-[var(--dur-micro)] hover:border-ink hover:bg-ink hover:text-bone"
              >
                Find us
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </PageShell>
  );
}
