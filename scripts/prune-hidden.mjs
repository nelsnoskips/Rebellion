#!/usr/bin/env node
/**
 * Remove switched-off routes from an export.
 *
 *     node scripts/prune-hidden.mjs out
 *
 * A static export cannot return a 404 status: a page that calls notFound()
 * still writes a file, so the host serves it with 200 and a not-found body.
 * That is a soft 404 — indexable, and it reads to a crawler as a real page.
 * Deleting the file is what makes the 404 genuine.
 *
 * Shared by the Plesk bundle and the Netlify build so the two cannot drift.
 * See deploy/hidden-routes.json for what is listed and why.
 */

import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "out";
const { hidden = [] } = JSON.parse(
  readFileSync("deploy/hidden-routes.json", "utf8"),
);

let total = 0;
for (const route of hidden) {
  const stem = route.replace(/^\//, "");
  for (const target of [`${stem}.html`, `${stem}.txt`, stem]) {
    const path = join(dir, target);
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      total += 1;
    }
  }
}
console.log(`pruned ${hidden.length} hidden route(s), ${total} path(s) from ${dir}/`);
