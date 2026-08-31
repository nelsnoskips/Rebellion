import type { MetadataRoute } from "next";
import { flags } from "@/lib/site";

/**
 * Emitted as sitemap.xml by the static export.
 *
 * URLs are absolute and built from NEXT_PUBLIC_SITE_URL, so a build made for a
 * subdirectory lists itself at the right address — a sitemap that advertises
 * the wrong host is worse than none, because search engines will follow it.
 *
 * Sections that are switched off are left out rather than listed and 404ing.
 */
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebellionbeachside.com").replace(/\/+$/, "");

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/menus", priority: 0.9, changeFrequency: "weekly" },
    { path: "/happenings", priority: 0.8, changeFrequency: "daily" },
    { path: "/private-events", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reserve", priority: 0.7, changeFrequency: "monthly" },
    { path: "/visit", priority: 0.7, changeFrequency: "monthly" },
    { path: "/story", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "monthly" },
    ...(flags.bottleShop
      ? [{ path: "/bottle-shop", priority: 0.6, changeFrequency: "weekly" as const }]
      : []),
  ];

  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
