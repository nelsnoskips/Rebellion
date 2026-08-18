import type { Metadata } from "next";
import { EditorialHome } from "@/components/home/EditorialHome";
import { DirectionSwitch } from "@/components/site/DirectionSwitch";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * The project root shows Direction A rather than a menu of directions — a
 * client arriving here should land on work, not on a chooser.
 *
 * Rendered, not redirected: `redirect()` has no runtime to execute in a static
 * export and prerenders an error page instead, which builds green and ships
 * broken.
 */
export default function IndexPage() {
  return (
    <>
      <EditorialHome />
      <DirectionSwitch current="a" />
    </>
  );
}
