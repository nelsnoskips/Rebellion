import type { Metadata } from "next";
import { CollageHome } from "@/components/collage/CollageHome";
import { DirectionSwitch } from "@/components/site/DirectionSwitch";

export const metadata: Metadata = {
  title: "Direction B",
  robots: { index: false, follow: false },
};

/** Direction B — collage. */
export default function RebellionBPage() {
  return (
    <>
      <CollageHome />
      <DirectionSwitch current="b" />
    </>
  );
}
