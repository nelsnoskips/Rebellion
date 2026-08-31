#!/usr/bin/env node
/**
 * Build a drop-in bundle for the client's Apache/WordPress host.
 *
 *     SITE_BASE_PATH=/rebellionbistro \
 *     NEXT_PUBLIC_SITE_URL=https://rebellionrestaurants.com/rebellionbistro \
 *     npm run package
 *
 * Produces dist/<name>.zip containing the whole site, ready to unzip into that
 * directory on the server. Everything the deploy needs is inside it: the
 * exported pages, the assets, and the two .htaccess files that stop WordPress
 * from swallowing the URLs.
 *
 * The base path has to be known at build time — Next bakes it into the routes
 * and the asset manifest — so this drives the build rather than post-processing
 * a generic one. Getting it wrong produces a site that loads a blank page and
 * 404s every asset, which is the single most common way this deploy fails.
 */

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const base = (process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const out = "out";
const dist = "dist";

if (base && !base.startsWith("/")) {
  console.error(`SITE_BASE_PATH must start with a slash — got ${base}`);
  process.exit(1);
}
if (!siteUrl) {
  console.warn(
    "! NEXT_PUBLIC_SITE_URL is not set, so canonical and Open Graph URLs will\n" +
    "  fall back to the default domain. Set it to where this will actually live.",
  );
}

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: "inherit", env: process.env });

console.log(`\nBuilding for ${base || "the domain root"}\n`);
rmSync(out, { recursive: true, force: true });
run("npx", ["next", "build"]);

// Next's basePath does not reach CSS url(), unoptimized next/image sources or
// paths built at runtime in client bundles. This fixes those.
if (base) run("node", ["scripts/rebase-assets.mjs", out, base]);

// Routes that are switched off do not belong in the bundle at all — see
// deploy/hidden-routes.json for why a file left in place is worse than none.
const hidden = JSON.parse(readFileSync("deploy/hidden-routes.json", "utf8")).hidden ?? [];
for (const route of hidden) {
  const stem = route.replace(/^\//, "");
  let removed = 0;
  for (const target of [`${stem}.html`, `${stem}.txt`, stem]) {
    const path = join(out, target);
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      removed += 1;
    }
  }
  console.log(`pruned ${route} (${removed} path${removed === 1 ? "" : "s"})`);
}

// Apache config, with the base path substituted in.
const htaccess = readFileSync("deploy/htaccess", "utf8").replaceAll("__BASE__", base);
writeFileSync(join(out, ".htaccess"), htaccess);
const staticDir = join(out, "_next", "static");
if (existsSync(staticDir)) {
  cpSync("deploy/htaccess-static", join(staticDir, ".htaccess"));
}

// A note for whoever opens the zip six months from now.
writeFileSync(
  join(out, "DEPLOY-README.txt"),
  [
    "Rebellion Beachside — static site bundle",
    "",
    `Built for:      ${base || "/"} `,
    `Canonical URL:  ${siteUrl || "(not set)"}`,
    `Built at:       ${new Date().toISOString()}`,
    "",
    "Unzip the CONTENTS of this archive into that directory on the server.",
    "The two .htaccess files are required and are easy to lose — many FTP",
    "clients hide dotfiles by default. Check they arrived.",
    "",
    "This bundle is built for one path. Serving it from anywhere else means",
    "rebuilding it; the path is baked into the routes and the asset manifest.",
    "",
    "Full instructions: docs/deploy-wordpress.md in the repository.",
    "",
  ].join("\n"),
);

mkdirSync(dist, { recursive: true });
const name = `rebellion${base.replaceAll("/", "-")}-${new Date().toISOString().slice(0, 10)}.zip`;
const zip = join(dist, name);
rmSync(zip, { force: true });
// -y keeps symlinks as symlinks rather than following them; there are none,
// but a surprise symlink in a zip aimed at a shared host is worth ruling out.
execFileSync("zip", ["-r", "-q", "-y", join("..", zip), "."], {
  stdio: "inherit",
  cwd: out,
  env: process.env,
});

console.log(`\nWrote ${zip}`);
