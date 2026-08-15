import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Lockup } from "@/components/ui/Brand";
import { Bloom, InkSplatter } from "@/components/ui/Artwork";
import { Note, Splash, TornPhoto } from "@/components/collage/kit";

/**
 * Collage masthead — the comp, assembled by scroll.
 *
 * Paper leads: the mark sits top-left, the headline is ink on bone, and the
 * photograph is a torn sheet laid into the right corner. Nothing about that
 * changes when the film runs; the scroll only controls *when* each piece
 * arrives, in the order someone would actually lay the page out — washes,
 * mark, photograph, headline line by line, thrown ink, handwriting, buttons.
 *
 * Because the choreography moves the real elements rather than separate act
 * layers, the still frame is free: with no engine, reduced motion, or no
 * JavaScript, everything renders where the CSS puts it, which is exactly where
 * the film ends. See the keyframes in app/globals.css.
 *
 * Navigation and the Reserve control sit outside the choreography so they are
 * available from the first frame — the film never delays a booking.
 */
export function Masthead() {
  return (
    <div className="cine-wrap paper-grain relative bg-bone">
      <div className="cine-stage relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="cine-wash">
          <Bloom
            variant="b"
            opacity={40}
            className="top-[4%] right-[22%] h-[460px] w-[500px] text-wash-sky"
          />
          <Splash
            variant="a"
            opacity={62}
            tilt={-12}
            className="top-[8%] right-[6%] h-[300px] w-[300px] text-wash-blush"
          />
          <Splash
            variant="b"
            opacity={55}
            tilt={20}
            className="top-[30%] right-[30%] h-[220px] w-[220px] text-wash-sky"
          />
          <Splash
            variant="c"
            opacity={45}
            tilt={-6}
            className="bottom-[6%] right-[14%] hidden h-[260px] w-[260px] text-wash-sage lg:block"
          />
          <Splash
            variant="b"
            opacity={40}
            tilt={8}
            className="bottom-[14%] left-[30%] hidden h-[180px] w-[180px] text-wash-blush lg:block"
          />
        </div>

        {/* The photograph, torn and bleeding off the right edge. It starts
            below the nav band rather than at the very top: the links are ink,
            and over a dark frame they were unreadable. */}
        <div className="cine-photo pointer-events-none absolute top-[88px] right-0 bottom-0 hidden w-[60%] lg:block">
          <TornPhoto
            name="hero"
            tear="sweep"
            priority
            sizes="60vw"
            className="absolute inset-y-0 right-[-6%] left-0"
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 md:px-10">
          <nav
            aria-label="Primary"
            className="relative z-20 flex items-center justify-end gap-8 py-6"
          >
            <ul className="hidden items-center gap-7 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="micro text-ink transition-colors duration-[var(--dur-micro)] hover:text-oxblood"
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
          </nav>

          <div className="relative z-10 flex flex-1 flex-col justify-center pb-16 lg:max-w-[52%]">
            <div className="cine-mark">
              <Link href="/" aria-label={`${site.shortName} — home`}>
                <Lockup priority className="w-[190px] md:w-[260px]" />
              </Link>
            </div>

            <h1 className="display-collage mt-8 text-[clamp(2.8rem,6.8vw,5.4rem)] text-ink">
              <span className="cine-l1 block">Rebel</span>
              <span className="cine-l2 block">Against</span>
              <span className="cine-l3 block">The</span>
              <span className="cine-l4 block">
                <span className="relative inline-block">
                  Ordinary.
                  <span className="cine-splat">
                    <InkSplatter
                      variant="b"
                      opacity={90}
                      className="-top-3 -right-9 h-12 w-12 text-oxblood md:-top-4 md:-right-14 md:h-20 md:w-20"
                    />
                  </span>
                </span>
              </span>
            </h1>

            <div className="cine-note mt-6">
              <Note tilt={-6} size="lg" className="max-w-[22ch]">
                Cocoa Beach, after dark
              </Note>
            </div>

            <div className="cine-cta mt-10 flex flex-wrap gap-3">
              <Link
                href={site.reserveUrl}
                className="micro bg-oxblood px-9 py-5 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
              >
                Reserve a table
              </Link>
              <Link
                href="/menus"
                className="micro border border-ink px-9 py-5 text-ink transition-colors duration-[var(--dur-micro)] hover:bg-ink hover:text-bone"
              >
                View menus
              </Link>
            </div>
          </div>
        </div>

        {/* Narrow screens get the photograph in flow rather than in the
            corner, and the same choreography applies to it. */}
        <div className="cine-photo relative z-0 px-6 pb-12 lg:hidden">
          <TornPhoto
            name="hero"
            tear="landscape"
            sizes="100vw"
            className="aspect-[4/3] w-full"
          />
        </div>

        <div
          aria-hidden
          className="cine-hint absolute right-5 bottom-20 hidden flex-col items-center gap-3 lg:flex"
        >
          <span className="micro [writing-mode:vertical-rl] text-ink-mute">
            Scroll
          </span>
          <span className="h-14 w-px bg-ink/30" />
        </div>
      </div>
    </div>
  );
}
