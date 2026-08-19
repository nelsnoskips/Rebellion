import type { Metadata } from "next";
import { CollageHome } from "@/components/collage/CollageHome";

export const metadata: Metadata = {
  title: "Collage direction",
  robots: { index: false, follow: false },
};

/**
 * The collage direction, kept as an archive.
 *
 * The client chose the editorial direction, so nothing links here any more and
 * this is no longer maintained against the brand book or the photography. It
 * stays because the masthead's scroll choreography is the most involved thing
 * in the project and is worth having to hand — not because it is still on the
 * table.
 */
export default function CollageArchivePage() {
  return <CollageHome />;
}
