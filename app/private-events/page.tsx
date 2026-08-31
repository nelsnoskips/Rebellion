import type { Metadata } from "next";
import Image from "next/image";
import { EventsContactLink } from "@/components/events/EventsContactLink";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Bloom } from "@/components/ui/Artwork";
import { images, occasions, site, venueFacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "The Annex at Rebellion — a bookable private-events room in Cocoa Beach for rehearsal dinners, celebrations, corporate gatherings and full buyouts.",
};

/* PLACEHOLDER — "The Annex at Rebellion" is a strategic working name only
   (blueprint §08). Domain, corporate, social and trademark clearance must be
   completed before public use. */

const proof = [
  { label: "Layouts", value: "Long table, rounds, standing, or split" },
  { label: "AV", value: "Screen, house sound, microphone on request" },
  { label: "Access", value: "Step-free entry and accessible restrooms" },
  { label: "Parking", value: "On-site lot plus street parking" },
];

export default function PrivateEventsPage() {
  return (
    <PageShell
      eyebrow="The Annex at Rebellion"
      title="Gather differently"
      intro="A room of its own, attached to the bistro. Same kitchen, same cellar, nobody else in the room."
      image="privateEvents"
    >
      <section className="paper-grain relative overflow-hidden bg-bone">
        <Bloom variant="a" opacity={50} className="-top-36 -left-28 h-[500px] w-[540px] text-wash-coral" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:px-10 lg:py-20">
          <Reveal>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-b border-rule pb-12 sm:grid-cols-4">
              {venueFacts.map((f) => (
                <div key={f.label}>
                  <dt className="micro text-ink-mute">{f.label}</dt>
                  <dd className="display mt-2 text-[clamp(1.4rem,2.4vw,2rem)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="grid gap-12 pt-14 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">
                Occasions
              </h2>
              <ul className="mt-8 divide-y divide-rule border-y border-rule">
                {occasions.map((o) => (
                  <li key={o.title} className="py-4">
                    <h3 className="font-semibold">{o.title}</h3>
                    <p className="mt-1 text-sm text-ink-mute">{o.line}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal index={1}>
              <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">
                The room
              </h2>
              <dl className="mt-8 divide-y divide-rule border-y border-rule">
                {proof.map((p) => (
                  <div key={p.label} className="flex gap-6 py-4">
                    <dt className="micro w-24 shrink-0 pt-1 text-ink-mute">
                      {p.label}
                    </dt>
                    <dd className="text-sm">{p.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-ink-mute">
                Capacities, minimums and amenities are placeholders pending the
                venue walkthrough.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery — the blueprint asks for the room in at least three
          configurations before anyone is asked to inquire. */}
      <section aria-label="Venue gallery" className="grid sm:grid-cols-3">
        {(["privateEvents", "annexRoom", "diningRoom"] as const).map((name, i) => {
          const img = images[name];
          return (
            <Reveal
              as="figure"
              key={name}
              index={i}
              className="art-frame relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </Reveal>
          );
        })}
      </section>

      <section className="paper-grain relative overflow-hidden bg-paper">
        <Bloom variant="c" opacity={45} className="-right-32 -bottom-32 h-[460px] w-[500px] text-wash-tan" />
        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
          <Reveal>
            <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">
              Plan your event
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-mute">
              Tell us the date, the headcount and the occasion. We&apos;ll come
              back with availability, formats and pricing — from one person, not
              a form letter.
            </p>
          </Reveal>

          {/* An email address rather than a form, deliberately. The form had no
              backend: it showed a confirmation and dropped what you typed. A
              mailto reaches a person, and the prompts below do the same job the
              form's fields did — they tell you what to say so the first reply
              can be useful. */}
          <Reveal index={1}>
            <div className="border border-ink/15 bg-paper p-8 md:p-10">
              <p className="micro text-oxblood">Events enquiries</p>
              <EventsContactLink className="display-soft mt-4 block text-[clamp(1.35rem,2.6vw,1.9rem)] break-words text-oxblood underline decoration-oxblood/30 underline-offset-[6px] transition-colors hover:decoration-oxblood" />
              <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
                Include your date, how many people, and roughly what kind of
                evening you have in mind. If the date is tight, say so — it
                changes what we can offer.
              </p>
              <p className="mt-6 border-t border-ink/10 pt-6 text-sm text-ink-mute">
                Or call{" "}
                <a
                  href={site.phoneHref}
                  className="font-semibold text-oxblood underline underline-offset-4"
                >
                  {site.phone}
                </a>
                . We reply by the end of the next business day.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
