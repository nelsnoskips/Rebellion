import type { Metadata } from "next";
import Link from "next/link";
import { CollageHome } from "@/components/collage/CollageHome";
import { isSingleDirection } from "@/lib/direction";

export const metadata: Metadata = {
  title: "Direction Two — Collage",
  description:
    "A second art direction for the Rebellion homepage: paper-first, torn frames, handwritten marginalia.",
  robots: { index: false, follow: false },
};

/**
 * The collage direction at a fixed path, for the internal review build where
 * both directions are served side by side. On a single-direction deploy the
 * chosen direction is already at `/`; this route simply mirrors it.
 */
export default function CollageDirectionPage() {
  return (
    <>
      <CollageHome />
      {!isSingleDirection && (
        <Link
          href="/directions"
          className="micro fixed bottom-4 left-4 z-40 border border-ink/25 bg-bone/90 px-4 py-2.5 text-ink backdrop-blur-sm"
        >
          ← Compare directions
        </Link>
      )}
    </>
  );
}
