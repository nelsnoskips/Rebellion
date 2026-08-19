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
    // A static export has no image optimizer, so every file is served exactly
    // as it sits in /public/images. That is fine because nothing goes in there
    // by hand: scripts/optimize-photos.py sizes each photograph to the widths
    // its slot actually renders at. No remote hosts are allowed — all of the
    // photography is the client's own and is served from this origin.
    unoptimized: true,
  },
};

export default nextConfig;
