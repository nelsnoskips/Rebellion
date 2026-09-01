import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, UtensilsCrossed, Wine } from "lucide-react";
import { experiences, happenings, images, site } from "@/lib/site";
import { ArrowLink } from "@/components/ui/Button";
import { Bloom, BrushRule, InkSplatter } from "@/components/ui/Artwork";
import { Reveal } from "@/components/ui/Reveal";
import { eventDate } from "@/lib/utils";
import { Doodle, GlassDoodle, Note, Pin, Ringed, Splash, Stamp, Tape, TornEdge, TornPhoto } from "@/components/collage/kit";

/** The kitchen statement — torn ink portrait against paper. */
export function Statement() {
  return (
    <section className="paper-grain relative overflow-hidden bg-bone">
      <TornEdge edge="bottom" className="text-bone" />
      <Splash
        variant="b"
        opacity={55}
        tilt={14}
        className="-top-16 right-[8%] h-[280px] w-[280px] text-wash-violet"
      />
      <Splash
        variant="a"
        opacity={45}
        tilt={-9}
        className="right-[26%] -bottom-10 hidden h-[200px] w-[200px] text-wash-coral lg:block"
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
          <h2 className="display-collage max-w-[20ch] text-[clamp(1.6rem,2.7vw,2.3rem)]">
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
      <TornEdge edge="bottom" className="text-bone" />
      <Splash
        variant="c"
        opacity={48}
        tilt={-15}
        className="top-2 left-[40%] hidden h-[240px] w-[240px] text-wash-tan lg:block"
      />
      <Splash
        variant="a"
        opacity={42}
        tilt={22}
        className="right-[4%] bottom-2 hidden h-[220px] w-[220px] text-wash-coral lg:block"
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
                  <span className="display-collage text-3xl">{exp.title}</span>
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
    <section className="grunge relative overflow-hidden bg-ink text-bone">
      <TornEdge edge="top" className="text-bone" />
      <TornEdge edge="bottom" className="text-bone" />
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-3 lg:gap-10 lg:py-20">
        <Reveal>
          <h2 className="display-collage text-[clamp(1.7rem,2.6vw,2.2rem)]">
            Featured Food
          </h2>
          <div className="mt-5">
            <Note tone="bone" tilt={-4} className="max-w-[14ch] opacity-80">
              Seasonal ingredients. Big flavors. Zero shortcuts.
            </Note>
            <BrushRule variant={2} className="mt-1 h-2 w-24 text-signal" />
          </div>
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
          <h2 className="display-collage text-[clamp(1.7rem,2.6vw,2.2rem)]">Cocktails</h2>
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
            href="/menus#cocktails-menu"
            className="micro mt-6 inline-flex items-center gap-2 text-signal"
          >
            <span className="border-b border-signal/50 pb-1">View cocktails</span>
            <span aria-hidden>→</span>
          </Link>
        </Reveal>

        {/* An oxblood card torn out and pinned to the page. */}
        <Reveal index={2} className="relative self-start lg:mt-10">
          <div className="torn relative bg-oxblood px-12 py-12 pb-16">
            <h2 className="display-collage text-[clamp(1.7rem,2.6vw,2.2rem)]">
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
      <TornEdge edge="bottom" className="text-bone" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <h2 className="display-collage text-[clamp(1.9rem,3.2vw,2.8rem)]">
            Bottle Shop
          </h2>
          <div className="mt-5 flex items-start gap-3">
            <Note tilt={-5} className="max-w-[16ch]">
              Curated. Interesting. Always changing.
            </Note>
            <GlassDoodle className="mt-1 h-12 w-9 shrink-0 text-ink/50" />
            <Doodle className="mt-6 h-7 w-11 shrink-0 text-oxblood" />
          </div>
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
            <Ringed className="text-oxblood" tilt={-5}>
              <Note tilt={0} size="sm" className="max-w-[12ch]">
                Local delivery available
              </Note>
            </Ringed>
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
            <Ringed shape="box" className="mt-4 text-ink/60" tilt={4}>
              <Note tilt={0} size="sm" className="max-w-[16ch]">
                New arrivals weekly.
              </Note>
            </Ringed>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Happenings as a strip of film — perforations, frames, and a date on each. */
export function HappeningsStrip() {
  return (
    <section
      aria-labelledby="collage-happenings"
      className="paper-grain relative overflow-hidden bg-bone"
    >
      <TornEdge edge="bottom" className="text-bone" />
      <div className="relative mx-auto max-w-[1500px] px-6 py-14 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="collage-happenings" className="display-collage text-3xl">
              Happenings
            </h2>
            <BrushRule variant={1} className="mt-2 h-2.5 w-40 text-oxblood" />
          </div>
          <ArrowLink href="/happenings">View calendar</ArrowLink>
        </div>

        <div className="relative mt-8 flex items-center gap-4">
          <StripArrow direction="prev" />

          {/* `grunge` is deliberately not on this element: it also styles
              ::after, which would replace the lower row of perforations. */}
          <div className="filmstrip min-w-0 flex-1 bg-ink py-8">
            <ul className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-4">
              {happenings.map((event, i) => {
                const date = eventDate(event.date);
                return (
                  <Reveal
                    as="li"
                    key={event.slug}
                    index={i}
                    className="w-[210px] shrink-0 snap-start"
                  >
                    <Link href={`/happenings#${event.slug}`} className="group block">
                      <span className="relative block aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={images[event.image].src}
                          alt={images[event.image].alt}
                          fill
                          sizes="210px"
                          className="object-cover transition-transform duration-[var(--dur-editorial)] ease-[var(--ease-expressive)] group-hover:scale-[1.04]"
                        />
                      </span>
                      <span className="mt-3 flex items-baseline gap-2">
                        <time dateTime={date.iso} className="micro text-signal">
                          {date.month} {date.day}
                        </time>
                        <span className="hand text-[18px] text-bone/90">
                          {event.kind}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <StripArrow direction="next" />
        </div>
      </div>
    </section>
  );
}

/** The circular controls at either end of the strip. */
function StripArrow({ direction }: { direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <span
      aria-hidden
      className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/30 text-ink lg:flex"
    >
      <Icon size={18} />
    </span>
  );
}
