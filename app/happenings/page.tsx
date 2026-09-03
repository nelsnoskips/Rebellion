import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { Bloom } from "@/components/ui/Artwork";
import { happenings, images, reservations, site, type Happening } from "@/lib/site";
import { eventDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Happenings",
  description:
    "Live music, wine dinners, brunch club and classes at Rebellion Beachside Bar & Bistro in Cocoa Beach.",
};

/**
 * "Get tickets" goes to the tickets, in one click.
 *
 * An event with its own booking page links straight there; everything else
 * links straight to the venue on Resy. Neither routes through /reserve first —
 * that page exists to mount the booking widget, and putting it in the middle of
 * a ticket link just adds two clicks between wanting a seat and picking one.
 */
function EventLink({
  event,
  className,
  children,
}: {
  event: Happening;
  className?: string;
  children: React.ReactNode;
}) {
  const href =
    event.url ?? reservations.bookings.diningRoom.deepLink ?? site.reserveUrl;
  const offSite = href.startsWith("http");

  return offSite ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * One event source (lib/site.happenings) powers this page, the homepage rail
 * and the structured data below — blueprint §11, "single event data source".
 */
export default function HappeningsPage() {
  const eventSchema = happenings.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    description: e.blurb,
    eventStatus: "https://schema.org/EventScheduled",
    ...(e.url ? { url: e.url } : {}),
    location: {
      "@type": "Place",
      name: site.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
      },
    },
  }));

  return (
    <PageShell
      eyebrow="Happenings"
      title="Something is always about to start"
      intro="Live music, wine dinners, brunch club, and classes. Some are ticketed, most are not, and all of them are worth rearranging a Tuesday for."
      image="eventLiveMusic"
    >
      <div className="paper-grain relative overflow-hidden bg-bone">
        <Bloom variant="b" opacity={50} className="-top-36 -right-28 h-[500px] w-[540px] text-wash-violet" />
        <div className="relative mx-auto max-w-[1100px] px-6 py-16 md:px-10 lg:py-24">
          <ul className="divide-y divide-rule border-y border-rule">
            {happenings.map((event, i) => {
              const date = eventDate(event.date);
              const img = images[event.image];
              return (
                <Reveal
                  as="li"
                  key={event.slug}
                  index={i}
                  id={event.slug}
                  className="group scroll-mt-32"
                >
                  <div className="grid items-center gap-6 py-8 sm:grid-cols-[auto_180px_1fr_auto]">
                    <time
                      dateTime={date.iso}
                      className="flex w-16 flex-col items-start text-oxblood"
                    >
                      <span className="micro">{date.month}</span>
                      <span className="display text-4xl leading-none">
                        {date.day}
                      </span>
                      <span className="micro mt-1 text-ink-mute">
                        {date.weekday}
                      </span>
                    </time>

                    <div className="art-frame relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-[var(--dur-editorial)] ease-[var(--ease-expressive)] group-hover:scale-[1.04]"
                      />
                    </div>

                    <div>
                      <p className="micro accent text-oxblood">{event.kind}</p>
                      <h2 className="display-soft mt-2 text-2xl">
                        {event.title}
                      </h2>
                      {event.time ? (
                        <p className="mt-1 text-sm text-ink-mute">{event.time}</p>
                      ) : null}
                      <p className="mt-3 max-w-[46ch] text-sm leading-relaxed">
                        {event.blurb}
                      </p>
                    </div>

                    <EventLink
                      event={event}
                      className="micro shrink-0 self-start border border-ink/25 px-6 py-3.5 transition-colors duration-[var(--dur-micro)] hover:border-ink hover:bg-ink hover:text-bone sm:self-center"
                    >
                      {event.ticketed ? "Get tickets" : "Reserve"}
                    </EventLink>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-12">
            <p className="text-sm text-ink-mute">
              Private bookings and buyouts run alongside the public calendar —{" "}
              <Link
                href="/private-events"
                className="text-oxblood underline underline-offset-4"
              >
                plan an event
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
    </PageShell>
  );
}
