#!/usr/bin/env node
/**
 * Prefix absolute asset URLs in the exported site with a base path.
 *
 *     node scripts/rebase-assets.mjs out /Rebellion
 *
 * Next's `basePath` rewrites the things Next controls — routes, the asset
 * manifest, script and stylesheet tags. It does not rewrite:
 *
 *   - `url()` references inside CSS (the artwork masks), which are authored as
 *     absolute paths in app/globals.css, and
 *   - `next/image` sources, because `images.unoptimized` passes the src through
 *     untouched rather than routing it via the optimizer.
 *
 * Both would 404 on GitHub Pages, which serves a project repo under `/<repo>/`.
 * Netlify serves at the root and never runs this.
 *
 * Idempotent: an already-prefixed path is left alone.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [dir, rawBase] = process.argv.slice(2);
if (!dir || !rawBase) {
  console.error("usage: rebase-assets.mjs <out-dir> </base-path>");
  process.exit(1);
}

const base = rawBase.replace(/\/+$/, "");
if (!base) {
  // Mounted at a domain root: nothing to rebase.
  console.log("no base path — asset URLs left as they are");
  process.exit(0);
}
// `.js` is included because client components build mask and image URLs at
// runtime from string literals in the bundle, which no build step rewrites.
const PUBLIC_DIRS = ["images", "brand", "artwork"];
const EXTENSIONS = new Set([".html", ".css", ".js", ".txt", ".json"]);

// A quote or opening paren, then /<public dir>/ — but not one already rebased.
const pattern = new RegExp(
  `(["'(])\\/(?!${base.slice(1)}\\/)(${PUBLIC_DIRS.join("|")})\\/`,
  "g",
);

let files = 0;
let edits = 0;

const walk = (path) => {
  for (const entry of readdirSync(path)) {
    const full = join(path, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = entry.slice(entry.lastIndexOf("."));
    if (!EXTENSIONS.has(ext)) continue;

    const before = readFileSync(full, "utf8");
    const after = before.replace(pattern, `$1${base}/$2/`);
    if (after === before) continue;

    writeFileSync(full, after);
    files += 1;
    edits += before.match(pattern)?.length ?? 0;
  }
};

walk(dir);
console.log(`rebased ${edits} asset URLs across ${files} files onto ${base}/`);
