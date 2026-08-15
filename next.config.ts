import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project repository under `/<repo>/`, so the build needs
 * to know it is not at a domain root. Netlify serves at the root and sets
 * nothing, so this stays empty there and the two deploys share one config.
 *
 * Note this only rewrites what Next controls — routes, `next/image` sources,
 * the asset manifest. Absolute `url()` references inside CSS are not touched,
 * which is why the Pages workflow rewrites them after the build.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

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
