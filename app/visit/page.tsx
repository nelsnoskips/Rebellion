import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Bloom, InkSplatter } from "@/components/ui/Artwork";
import { faqs, hours, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Hours, parking, accessibility and directions for Rebellion Beachside Bar & Bistro in Cocoa Beach, Florida.",
};

/**
 * The questions, marked up as questions.
 *
 * These seven answers are the ones guests actually ask, and they are exactly
 * what an assistant is asked in turn — whether there is parking, whether kids
 * are welcome, what corkage costs. As plain prose a model has to infer that the
 * page is a Q&A; as FAQPage it can quote an answer and attribute it here.
 *
 * Built from the same `faqs` array the page renders, so the markup cannot drift
 * away from what a visitor reads. Link text is folded back into the answer
 * because schema takes plain text, not markup.
 */
function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: [f.a, f.link?.text, f.link?.after]
          .filter(Boolean)
          .join("")
          .replace(/\s+/g, " ")
          .trim(),
      },
    })),
  };
}


export default function VisitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    <PageShell
      eyebrow="Visit"
      title="Two blocks from the water"
      intro="Hours, parking, access and the answers people ask for most."
      image="beachside"
    >
      <section className="paper-grain relative overflow-hidden bg-bone">
        <Bloom variant="c" opacity={50} className="-top-32 right-[6%] h-[440px] w-[480px] text-wash-tan" />
        <InkSplatter variant="spray" opacity={9} className="-bottom-8 left-[8%] hidden h-40 w-40 text-ink lg:block" />
        <div className="relative mx-auto max-w-[1100px] px-6 py-16 md:px-10 lg:py-24">
          <div className="grid gap-10 border-b border-rule pb-14 sm:grid-cols-3">
            <Reveal>
              <h2 className="micro text-ink-mute">Address</h2>
              <address className="mt-4 leading-relaxed not-italic">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </address>
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="micro mt-4 inline-block text-oxblood underline underline-offset-4"
              >
                Get directions
              </a>
            </Reveal>

            <Reveal index={1}>
              <h2 className="micro text-ink-mute">Hours</h2>
              <dl className="mt-4 space-y-2">
                {hours.map((h) => (
                  <div key={h.days} className="flex gap-5">
                    <dt className="w-24 shrink-0 text-ink-mute">{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal index={2}>
              <h2 className="micro text-ink-mute">Contact</h2>
              <p className="mt-4">
                <a href={site.phoneHref} className="font-semibold">
                  {site.phone}
                </a>
                <br />
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink-mute underline underline-offset-4"
                >
                  {site.email}
                </a>
              </p>
              <Link
                href={site.reserveUrl}
                className="micro mt-5 inline-flex bg-oxblood px-7 py-3.5 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
              >
                Reserve a table
              </Link>
            </Reveal>
          </div>

          <Reveal className="pt-14">
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">
              Good to know
            </h2>
            <dl className="mt-8 divide-y divide-rule border-y border-rule">
              {faqs.map((f) => (
                <div key={f.q} className="grid gap-2 py-6 md:grid-cols-[0.9fr_1.4fr] md:gap-8">
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="text-sm leading-relaxed text-ink-mute">
                    {f.a}
                    {f.link ? (
                      <>
                        <a
                          href={f.link.href}
                          {...(f.link.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                          className="font-medium text-oxblood underline decoration-oxblood/40 underline-offset-4 hover:decoration-oxblood"
                        >
                          {f.link.text}
                        </a>
                        {f.link.after}
                      </>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </PageShell>
    </>
  );
}
