import Link from "next/link";
import { ShoppingBag, UtensilsCrossed, Wine } from "lucide-react";
import { experiences, happenings, site } from "@/lib/site";
import { ArrowLink } from "@/components/ui/Button";
import { Bloom, InkSplatter } from "@/components/ui/Artwork";
import { Reveal } from "@/components/ui/Reveal";
import { eventDate } from "@/lib/utils";
import { Note, PencilRule, Pin, Stamp, Tape, TornPhoto } from "@/components/collage/kit";

/** The kitchen statement — torn ink portrait against paper. */
export function Statement() {
  return (
    <section className="paper-grain relative overflow-hidden bg-bone">
      <Bloom
        variant="c"
        opacity={45}
        className="-top-20 right-[6%] h-[380px] w-[420px] text-wash-sky"
      />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-6 py-14 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="relative">
          <TornPhoto
            name="chefPass"
            tear="landscape"
            ink
            tilt={-1}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="aspect-[4/3] w-full"
          />
          <Tape className="-top-2 left-8" />
        </Reveal>

        <Reveal index={1}>
          <h2 className="display max-w-[20ch] text-[clamp(1.7rem,3vw,2.6rem)]">
            A chef-driven bistro, wine destination, and gathering place in Cocoa
            Beach.
          </h2>
          <div className="mt-7 flex flex-wrap items-end gap-x-12 gap-y-5">
            <ArrowLink href="/story">Our story</ArrowLink>
            <Note tilt={-5} className="max-w-[16ch]">
              Seasonal. Intentional. Uncompromising.
            </Note>
          </div>
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <PencilRule className="text-ink/25" />
      </div>
    </section>
  );
}

const icons = {
  dine: UtensilsCrossed,
  gather: Wine,
  "take-it-home": ShoppingBag,
} as const;

const captions: Record<string, string> = {
  dine: "Chef-driven menus.",
  gather: "Good people. Great wine.",
  "take-it-home": "Curated wines & provisions.",
};

/** Three ways in, as three torn cuttings. */
export function Trio() {
  return (
    <section className="paper-grain relative overflow-hidden bg-bone">
      <InkSplatter
        variant="b"
        opacity={12}
        className="top-4 left-[42%] hidden h-40 w-40 text-wash-blush lg:block"
      />
      <ul className="relative mx-auto grid max-w-[1500px] gap-x-10 gap-y-12 px-6 py-14 md:px-10 lg:grid-cols-3">
        {experiences.map((exp, i) => {
          const Icon = icons[exp.key as keyof typeof icons];
          return (
            <Reveal
              as="li"
              key={exp.key}
              index={i}
              className="group relative lg:border-l lg:border-ink/12 lg:pl-10 lg:first:border-0 lg:first:pl-0"
            >
              <Link href={exp.href} className="block">
                <span className="flex items-center gap-3">
                  <Icon size={20} aria-hidden className="shrink-0 text-oxblood" />
                  <span className="display text-3xl">{exp.title}</span>
                </span>

                <span className="relative mt-6 block">
                  <TornPhoto
                    name={exp.image}
                    tear={i === 1 ? "landscape" : "square"}
                    tilt={i === 1 ? 1 : -1}
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="aspect-[5/4] w-full transition-transform duration-[var(--dur-editorial)] ease-[var(--ease-expressive)] group-hover:scale-[1.02]"
                  />
                </span>

                <span className="mt-5 flex items-end justify-between gap-6">
                  <span className="block max-w-[24ch] text-sm leading-relaxed text-ink-mute">
                    {exp.line}
                  </span>
                  <Note tilt={-6} className="shrink-0 text-right">
                    {captions[exp.key]}
                  </Note>
                </span>

                <span className="micro mt-6 flex items-center gap-2 text-oxblood">
                  <span className="border-b border-oxblood/40 pb-1">
                    {exp.cta}
                  </span>
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--dur-micro)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

/** The dark chapter: food, cocktails, and the events card pinned over it. */
export function DarkBand() {
  return (
    <section className="relative overflow-hidden bg-ink text-bone">
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-3 lg:gap-10 lg:py-20">
        <Reveal>
          <h2 className="display text-[clamp(1.7rem,2.6vw,2.2rem)]">
            Featured Food
          </h2>
          <Note tone="bone" tilt={-4} className="mt-5 max-w-[14ch] opacity-80">
            Seasonal ingredients. Big flavors. Zero shortcuts.
          </Note>
          <div className="relative mt-7">
            <TornPhoto
              name="featuredFood"
              tear="landscape"
              tilt={-1}
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="aspect-[4/3] w-full"
            />
          </div>
          <Link
            href="/menus"
            className="micro mt-6 inline-flex items-center gap-2 text-signal"
          >
            <span className="border-b border-signal/50 pb-1">
              See what&apos;s cooking
            </span>
            <span aria-hidden>→</span>
          </Link>
        </Reveal>

        <Reveal index={1}>
          <h2 className="display text-[clamp(1.7rem,2.6vw,2.2rem)]">Cocktails</h2>
          <Note tone="bone" tilt={-3} className="mt-5 max-w-[13ch] opacity-80">
            Original pours. Fresh ingredients. Rebel spirit.
          </Note>
          <div className="relative mt-7">
            <TornPhoto
              name="featuredCocktail"
              tear="portrait"
              tilt={1}
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="aspect-[4/5] w-full"
            />
          </div>
          <Link
            href="/menus#cocktails"
            className="micro mt-6 inline-flex items-center gap-2 text-signal"
          >
            <span className="border-b border-signal/50 pb-1">View cocktails</span>
            <span aria-hidden>→</span>
          </Link>
        </Reveal>

        {/* An oxblood card torn out and pinned to the page. */}
        <Reveal index={2} className="relative self-start lg:mt-10">
          <div className="torn relative bg-oxblood p-9 pb-14">
            <h2 className="display text-[clamp(1.7rem,2.6vw,2.2rem)]">
              Private Events
            </h2>
            <Note tone="bone" tilt={-3} className="mt-5 max-w-[18ch]">
              Birthdays, anniversaries, rehearsals, or full buyouts. Make it
              unforgettable.
            </Note>
            <Link
              href="/private-events"
              className="micro mt-8 inline-flex items-center gap-2 text-bone"
            >
              <span className="border-b border-bone/50 pb-1">
                Plan your event
              </span>
              <span aria-hidden>→</span>
            </Link>
            <Stamp
              text="Make it unforgettable"
              className="absolute right-4 -bottom-2 h-32 w-32 text-bone"
            />
          </div>
          <Pin className="top-3 left-1/2 -translate-x-1/2" />
        </Reveal>
      </div>
    </section>
  );
}

/** Bottle shop: bottles torn out, the room behind them in ink. */
export function BottleShopBand() {
  return (
    <section className="paper-grain relative overflow-hidden bg-bone">
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <h2 className="display text-[clamp(1.9rem,3.2vw,2.8rem)]">
            Bottle Shop
          </h2>
          <Note tilt={-5} className="mt-5 max-w-[16ch]">
            Curated. Interesting. Always changing.
          </Note>
          <p className="mt-6 max-w-[38ch] text-sm leading-relaxed text-ink-mute">
            Two dozen bottles we actually drink, with notes written like
            recommendations instead of distributor copy. Pickup at the bar, or
            local delivery in {site.address.city}.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/bottle-shop"
              className="micro bg-ink px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-oxblood"
            >
              Shop the drop
            </Link>
            <span className="relative inline-block">
              <Note tilt={-7} size="sm" className="max-w-[12ch] px-3 py-2">
                Local delivery available
              </Note>
              <span
                aria-hidden
                className="absolute inset-0 rounded-[50%] border border-oxblood/50"
                style={{ transform: "rotate(-4deg) scale(1.15)" }}
              />
            </span>
          </div>
        </Reveal>

        <Reveal index={1} className="grid grid-cols-2 gap-5">
          <div className="relative">
            <TornPhoto
              name="takeItHome"
              tear="portrait"
              tilt={-1.5}
              sizes="(max-width: 1024px) 50vw, 28vw"
              className="aspect-[4/5] w-full"
            />
            <Note tilt={-6} size="sm" className="mt-4 max-w-[18ch]">
              Bright. Acid. Mineral. Try with crudo.
            </Note>
          </div>
          <div className="relative">
            <TornPhoto
              name="privateEvents"
              tear="portrait"
              ink
              tilt={1.5}
              sizes="(max-width: 1024px) 50vw, 28vw"
              className="aspect-[4/5] w-full"
            />
            <Note tilt={5} size="sm" className="mt-4 max-w-[16ch]">
              New arrivals weekly.
            </Note>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Happenings as a strip of frames taped to a dark board. */
export function HappeningsStrip() {
  return (
    <section
      aria-labelledby="collage-happenings"
      className="relative overflow-hidden bg-ink text-bone"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-14 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="collage-happenings" className="display text-3xl">
            Happenings
          </h2>
          <ArrowLink href="/happenings" tone="light">
            View calendar
          </ArrowLink>
        </div>

        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3">
          {happenings.map((event, i) => {
            const date = eventDate(event.date);
            return (
              <Reveal
                as="li"
                key={event.slug}
                index={i}
                className="w-[260px] shrink-0 snap-start"
              >
                <Link href={`/happenings#${event.slug}`} className="group block">
                  <TornPhoto
                    name={event.image}
                    tear="landscape"
                    tilt={i % 2 ? 1 : -1}
                    sizes="260px"
                    className="aspect-[4/3] w-full"
                  />
                  <span className="mt-4 flex items-baseline gap-3">
                    <time dateTime={date.iso} className="micro text-signal">
                      {date.month} {date.day}
                    </time>
                    <span className="hand text-[19px] text-bone">
                      {event.kind}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-bone/60">
                    {event.title}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
