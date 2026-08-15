import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/collage/Masthead";
import {
  BottleShopBand,
  DarkBand,
  HappeningsStrip,
  Statement,
  Trio,
} from "@/components/collage/Sections";
import { FooterCollage } from "@/components/collage/FooterCollage";
import { ScrollMotion } from "@/components/collage/ScrollMotion";
import { FloatingReserve } from "@/components/site/FloatingReserve";

export const metadata: Metadata = {
  title: "Direction Two — Collage",
  description:
    "A second art direction for the Rebellion homepage: paper-first, torn frames, handwritten marginalia.",
  robots: { index: false, follow: false },
};

/**
 * Art direction two, for comparison against `/` — same content, same data, same
 * palette and type, different treatment.
 *
 * Where the first direction is photograph-led, with paper interrupting dark
 * bands, this one is paper-led: every photograph is a sheet torn out and laid
 * down, half of them printed as ink, and the margins carry handwriting. The
 * dark chapter is a single interruption rather than the spine of the page.
 *
 * Both read from the same `lib/site.ts` and `lib/images.ts`, so content edits
 * land in both and there is nothing to keep in sync while the direction is
 * being chosen.
 */
export default function CollageDirectionPage() {
  return (
    <>
      {/* Gates the cinematic layout before first paint — hydration is too late
          and the still hero would flash. Scoped to this route rather than the
          root layout, since it is the only page with a stage. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('cine-on')}catch(e){}",
        }}
      />
      <ScrollMotion />
      <Masthead />
      <main id="main">
        <Statement />
        <Trio />
        <DarkBand />
        <BottleShopBand />
        <HappeningsStrip />
      </main>
      <FooterCollage />
      {/* The stage runs 400vh; hold the control until the film releases. */}
      <FloatingReserve after={3.4} />

      <Link
        href="/directions"
        className="micro fixed bottom-4 left-4 z-40 border border-ink/25 bg-bone/90 px-4 py-2.5 text-ink backdrop-blur-sm"
      >
        ← Compare directions
      </Link>
    </>
  );
}
