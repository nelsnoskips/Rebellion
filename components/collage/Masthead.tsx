import Image from "next/image";
import Link from "next/link";
import { images, nav, site } from "@/lib/site";
import { Logotype } from "@/components/ui/Brand";
import { Deckle, InkSplatter } from "@/components/ui/Artwork";
import { Note } from "@/components/collage/kit";

/**
 * Cinematic masthead — a pinned stage the visitor scrubs through in three acts
 * (blueprint §07 module 01, §08 hero choreography).
 *
 *   Act I    the wordmark, huge, over a darkened room
 *   Act II   the promise, as the veil lifts and the room comes to light
 *   Act III  the real hero — headline, note, reservation
 *
 * Act III is the only act that exists without an engine, and it carries the
 * page's only `h1` and the real links. A visitor with reduced motion, no
 * JavaScript, or a browser without scroll-driven animation gets that finished
 * frame rather than a blank stage. Acts I and II are `aria-hidden` duplicates
 * of things said elsewhere.
 *
 * Navigation and the reservation control live outside the acts so they are
 * available and clickable from the very first frame — the film never delays a
 * booking.
 */
export function Masthead() {
  return (
    <header className="cine-wrap bg-ink text-bone">
      <div className="cine-stage">
        <div className="cine-photo">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div aria-hidden className="cine-veil-static" />
        <div aria-hidden className="cine-veil" />

        {/* Above every act, always interactive. */}
        <nav
          aria-label="Primary"
          className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1500px] items-center justify-between gap-8 px-6 py-6 md:px-10"
        >
          <Link
            href="/"
            aria-label={`${site.shortName} — home`}
            className="shrink-0"
          >
            <Logotype knockout priority className="w-[118px] md:w-[142px]" />
          </Link>
          <div className="flex items-center gap-8">
            <ul className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="micro text-bone/85 transition-colors duration-[var(--dur-micro)] hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={site.reserveUrl}
              className="micro bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
            >
              Reserve
            </Link>
          </div>
        </nav>

        <div className="cine-acts">
          {/* Act I — the mark. */}
          <div aria-hidden className="cine-act cine-act-title">
            <Logotype knockout className="w-[min(74vw,760px)]" />
            <Note tone="bone" tilt={-3} size="lg" className="mt-6 opacity-80">
              Cocoa Beach, after dark
            </Note>
          </div>

          {/* Act II — the promise. A visual duplicate of copy the page carries
              in typeset form elsewhere, so it is not announced. */}
          <div aria-hidden className="cine-act cine-act-line">
            <p className="display-soft max-w-[16ch] text-[clamp(2.4rem,6vw,4.6rem)]">
              Dinner without the usual script.
            </p>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-bone/70">
              {site.description}
            </p>
          </div>

          {/* Act III — the hero itself, and the still frame. */}
          <div className="cine-act cine-act-final">
            <div aria-hidden className="cine-final-shade" />
            <div className="relative mx-auto flex h-full w-full max-w-[1500px] flex-col justify-center px-6 pt-24 pb-24 md:px-10">
              <h1 className="display text-[clamp(2.6rem,7.5vw,5.8rem)]">
                {["Rebel", "Against", "The"].map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">
                  <span className="relative inline-block">
                    Ordinary.
                    <InkSplatter
                      variant="b"
                      opacity={95}
                      className="-top-3 -right-10 h-14 w-14 text-signal md:-top-5 md:-right-16 md:h-24 md:w-24"
                    />
                  </span>
                </span>
              </h1>

              <Note
                tone="bone"
                tilt={-5}
                size="lg"
                className="mt-6 max-w-[22ch] opacity-90"
              >
                Cocoa Beach, after dark
              </Note>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={site.reserveUrl}
                  className="micro bg-oxblood px-9 py-5 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
                >
                  Reserve a table
                </Link>
                <Link
                  href="/menus"
                  className="micro border border-bone/50 bg-ink/30 px-9 py-5 text-bone backdrop-blur-sm transition-colors duration-[var(--dur-micro)] hover:bg-bone hover:text-ink"
                >
                  View menus
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden className="cine-hint">
          <span className="micro text-bone/60">Scroll</span>
        </div>

        {/* The paper below tears up into the frame. */}
        <Deckle edge="bottom" variant={1} className="z-10 text-bone" />
      </div>
    </header>
  );
}
