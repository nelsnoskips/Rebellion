import type { Metadata } from "next";
import { EditorialHome } from "@/components/home/EditorialHome";
import { DirectionSwitch } from "@/components/site/DirectionSwitch";

export const metadata: Metadata = {
  title: "Direction A",
  robots: { index: false, follow: false },
};

/** Direction A — editorial. */
export default function RebellionAPage() {
  return (
    <>
      <EditorialHome />
      <DirectionSwitch current="a" />
    </>
  );
}
