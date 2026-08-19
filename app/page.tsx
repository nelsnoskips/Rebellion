import type { Metadata } from "next";
import { EditorialHome } from "@/components/home/EditorialHome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * The homepage. The client picked the editorial direction, so this is now the
 * site rather than one of two options — the A/B switch is gone and `/` is the
 * front door.
 *
 * Rendered, not redirected: `redirect()` has no runtime to execute in a static
 * export and prerenders an error page instead, which builds green and ships
 * broken.
 *
 * Still noindex until the client is ready to launch.
 */
export default function IndexPage() {
  return <EditorialHome />;
}
