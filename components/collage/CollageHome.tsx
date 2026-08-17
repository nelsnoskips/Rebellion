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

/**
 * Direction two — collage. Same content and tokens as the editorial direction,
 * treated as a scrapbook: every photograph is a sheet torn out and laid down,
 * half printed as ink, handwriting in the margins, and a cinematic hero the
 * visitor scrubs through as the page assembles itself.
 */
export function CollageHome() {
  return (
    <>
      {/* Gates the cinematic layout before first paint — hydration is too late
          and the still hero would flash. */}
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
    </>
  );
}
