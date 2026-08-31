import type { Metadata } from "next";
import { EditorialHome } from "@/components/home/EditorialHome";
import { flags } from "@/lib/site";

export const metadata: Metadata = {
  robots: { index: flags.indexable, follow: flags.indexable },
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
 * Indexable only when flags.indexable says so — see lib/site.ts.
 */
export default function IndexPage() {
  return <EditorialHome />;
}
