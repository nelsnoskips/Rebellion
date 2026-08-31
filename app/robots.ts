import type { MetadataRoute } from "next";
import { flags } from "@/lib/site";

/**
 * Emitted as robots.txt by the static export.
 *
 * Worth knowing where this actually lands: crawlers only read robots.txt from a
 * domain root. Deployed into a subdirectory this file sits at
 * <host>/<dir>/robots.txt and is ignored — the rules that govern this site are
 * whatever WordPress serves at the domain root. It is emitted anyway because
 * the build may also be deployed to its own domain, where it does apply, and
 * because a preview build that is crawlable by accident is a worse outcome
 * than a redundant file.
 *
 * For the subdirectory deploy, the equivalent guard is `flags.indexable`, which
 * puts a noindex meta tag on the page itself. That one a crawler will honour.
 */
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebellionbeachside.com").replace(/\/+$/, "");

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!flags.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: flags.bottleShop ? [] : ["/bottle-shop"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
