import type { NextConfig } from "next";

/**
 * Where this build is mounted, when it is not at a domain root.
 *
 *   SITE_BASE_PATH=/production   previews.<studio>/production/rebellion-a
 *   PAGES_BASE_PATH=/Rebellion   GitHub Pages, which serves a project repo
 *                                under /<repo>/
 *
 * Note this only rewrites what Next controls — routes, `next/image` sources,
 * the asset manifest. Absolute `url()` references inside CSS are not touched,
 * and neither are asset paths built at runtime in client components, which is
 * why the deploy runs scripts/rebase-assets.mjs afterwards.
 */
const basePath =
  process.env.SITE_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  /**
   * Static export.
   *
   * Every route in the site is prerendered — there are no API routes, server
   * actions or dynamic segments — so the build emits plain HTML into `out/`.
   * That deploys correctly on any static host without a framework runtime,
   * which is what `netlify.toml` publishes.
   *
   * Revisit this when the CMS, reservations callbacks or commerce arrive
   * (blueprint §11): server-rendered routes will need Netlify's Next runtime
   * (or Vercel) and this line comes out along with `unoptimized` below.
   */
  output: "export",

  turbopack: {
    root: process.cwd(),
  },

  images: {
    // A static export has no image optimizer. Placeholder photography is
    // already sized by Unsplash through its own `w`/`q` parameters, so nothing
    // is lost today — but when real files land in /public/images they need to
    // be exported at sensible sizes, or this project needs the Next runtime.
    unoptimized: true,
    // Placeholder photography while the brand shoot (blueprint §12, days
    // 01–02) is produced. Swap the entries in lib/images.ts for local files
    // and this can go.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
