import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHome } from "@/components/home/EditorialHome";
import { CollageHome } from "@/components/collage/CollageHome";
import { direction, isSingleDirection } from "@/lib/direction";

/**
 * The homepage is whichever direction this deploy was built for — see
 * lib/direction.ts. The two client review sites are the same commit with
 * `NEXT_PUBLIC_DIRECTION` set differently.
 *
 * Every build is noindex for now: these are previews of a site that has not
 * launched, carrying placeholder content, and none of it should be indexed.
 * Remove this when the real thing goes live.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <>
      {direction === "collage" ? <CollageHome /> : <EditorialHome />}

      {/* Only the internal review build offers a way across to the other
          direction; a client link shows one site and nothing else. */}
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
