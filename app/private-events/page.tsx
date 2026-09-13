import type { Metadata } from "next";
import Image from "next/image";
import { EventsContactLink } from "@/components/events/EventsContactLink";
import { EventInquiry } from "@/components/events/EventInquiry";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Bloom } from "@/components/ui/Artwork";
import { eventPackages, eventProof, images, occasions, site, venueFacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Events",
  description:
    "The Wine Room at Rebellion — a bookable private-events room in Cocoa Beach for rehearsal dinners, celebrations, corporate gatherings and full buyouts.",
};

/* "The Wine Room" is the client's name for the private room, replacing the
   working name "The Annex at Rebellion". Deliberately not "Rebellion Wine Bar":
   that is the group's separate venue in Cocoa Village, and reusing it for a room
   inside the Cocoa Beach bistro would point guests at the wrong address. */


export default function PrivateEventsPage() {
  return (
    <PageShell
      eyebrow="The Wine Room"
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
                {eventProof.map((p) => (
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


      <section className="paper-grain relative overflow-hidden bg-bone">
        <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:px-10 lg:py-24">
          <Reveal>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.6rem)]">
              Three ways to do it
            </h2>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-mute">
              Every menu below is an example. We finalise the selections with you
              before the date, against whatever the kitchen is cooking that month.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-8 lg:grid-cols-3">
            {eventPackages.map((pkg, i) => (
              <Reveal as="li" key={pkg.id} index={i} className="flex">
                <div className="flex w-full flex-col border border-ink/15 bg-paper p-8">
                  <h3 className="display-soft text-2xl">{pkg.name}</h3>
                  <p className="micro figure mt-3 text-oxblood">{pkg.price}</p>
                  {pkg.priceNote ? (
                    <p className="mt-1 text-xs text-ink-mute">{pkg.priceNote}</p>
                  ) : null}

                  <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                    {pkg.line}
                  </p>
                  <p className="mt-2 text-sm text-ink-mute">{pkg.best}</p>

                  <div className="mt-7 space-y-5 border-t border-rule pt-6">
                    {pkg.courses.map((course) => (
                      <div key={course.heading}>
                        <h4 className="micro-wide text-ink-mute">{course.heading}</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {course.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#enquire"
                    className="micro accent mt-auto inline-flex items-center gap-2 self-start pt-8 text-oxblood"
                  >
                    <span className="border-b border-oxblood/50 pb-1">
                      Enquire about this
                    </span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section className="paper-grain relative overflow-hidden bg-paper">
        <Bloom variant="c" opacity={45} className="-right-32 -bottom-32 h-[460px] w-[500px] text-wash-tan" />
        <div id="enquire" className="relative mx-auto grid max-w-[1200px] gap-12 scroll-mt-28 px-6 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
          <Reveal>
            <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">
              Plan your event
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-mute">
              Pick a format, tell us the date and the headcount, and Michelle
              comes back with availability and a proposal — from one person, not
              a form letter.
            </p>
          </Reveal>

          <Reveal index={1}>
            <EventInquiry />
            <p className="mt-5 text-sm text-ink-mute">
              Would rather just write to us? <EventsContactLink className="font-semibold text-oxblood underline underline-offset-4" />
              {" "}or call{" "}
              <a href={site.phoneHref} className="font-semibold text-oxblood underline underline-offset-4">
                {site.phone}
              </a>
              . We reply by the end of the next business day.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
