/**
 * Monthly technical SEO / AEO audit of the live site.
 *
 *     node scripts/seo-audit.mjs                     # audit production
 *     node scripts/seo-audit.mjs --save              # also write seo/history/<month>.json
 *     SITE=https://staging... node scripts/seo-audit.mjs
 *
 * Crawls the real deployed pages rather than the build output, because what
 * matters is what a crawler receives: a correct build served behind a stale
 * deploy or a wrong canonical host is still broken.
 *
 * Saved runs let the next month's report say what *changed*, which is the only
 * part a client actually reads. A technical audit that reports the same twelve
 * green ticks every month trains people to stop opening it.
 */
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = (process.env.SITE ?? "https://www.rebellionrestaurants.com").replace(/\/+$/, "");
const ROOT = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const HISTORY = path.join(ROOT, "seo", "history");

const PAGES = [
  "/", "/menus", "/happenings", "/shop",
  "/private-events", "/reserve", "/visit", "/story", "/privacy",
];

/** Routes that are switched off and must stay switched off. */
const MUST_404 = ["/bottle-shop", "/rebellion-a", "/rebellion-b", "/rebellion-brand"];

const text = (html) => html.split("self.__next_f")[0];
const one = (re, s) => (s.match(re) ?? [])[1] ?? null;

async function get(url) {
  const res = await fetch(url, { redirect: "follow" });
  return { status: res.status, url: res.url, body: res.ok ? await res.text() : "" };
}

function ldJson(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      const parsed = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      out.push({ "@type": "UNPARSEABLE" });
    }
  }
  return out;
}

async function auditPage(route) {
  const { status, body } = await get(SITE + route);
  const head = text(body);
  const schema = ldJson(body).map((s) => s["@type"]).filter(Boolean);
  return {
    route,
    status,
    title: one(/<title>([^<]*)<\/title>/, body),
    description: one(/<meta name="description" content="([^"]*)"/, body),
    canonical: one(/<link rel="canonical" href="([^"]*)"/, body),
    ogImage: one(/<meta property="og:image" content="([^"]*)"/, body),
    robots: one(/<meta name="robots" content="([^"]*)"/, body),
    h1Count: (head.match(/<h1[\s>]/g) ?? []).length,
    schema,
    bytes: body.length,
  };
}

/** Findings are the point. A number nobody has to interpret is not a finding. */
function findings(pages, extras) {
  const out = [];
  const add = (severity, message) => out.push({ severity, message });

  for (const p of pages) {
    if (p.status !== 200) add("high", `${p.route} returns ${p.status}`);
    if (!p.title) add("high", `${p.route} has no title`);
    else if (p.title.length > 60) add("low", `${p.route} title is ${p.title.length} chars — Google truncates past ~60`);
    if (!p.description) add("medium", `${p.route} has no meta description`);
    else if (p.description.length > 160) add("low", `${p.route} description is ${p.description.length} chars`);
    if (!p.canonical) add("medium", `${p.route} has no canonical`);
    if (!p.ogImage) add("medium", `${p.route} has no og:image — shares as a bare link`);
    if (p.h1Count !== 1) add("medium", `${p.route} has ${p.h1Count} h1 headings, expected 1`);
    if (p.robots && !/index/.test(p.robots)) add("high", `${p.route} is set to ${p.robots}`);
  }

  const canonHosts = new Set(
    pages.map((p) => p.canonical).filter(Boolean).map((u) => new URL(u).host),
  );
  if (canonHosts.size > 1) add("high", `canonicals point at more than one host: ${[...canonHosts].join(", ")}`);
  else if (canonHosts.size === 1 && !SITE.includes([...canonHosts][0]))
    add("high", `canonical host ${[...canonHosts][0]} is not the host being served`);

  if (!extras.sitemap.ok) add("high", "sitemap.xml is missing or unreadable");
  if (!extras.robotsTxt.allows) add("high", "robots.txt disallows crawling");
  if (extras.robotsTxt.sitemapHost && !SITE.includes(extras.robotsTxt.sitemapHost))
    add("high", `robots.txt points at a sitemap on ${extras.robotsTxt.sitemapHost}`);
  for (const r of extras.leaks) add("high", `${r} should 404 but returns ${extras.leakStatus[r]}`);
  if (!extras.gscVerified) add("medium", "no Search Console verification found — nothing is reporting search performance");
  if (!extras.ga) add("medium", "no analytics tag found on the live site");

  const hasFaq = pages.some((p) => p.schema.includes("FAQPage"));
  if (!hasFaq) add("medium", "no FAQPage markup — the Q&A content cannot be quoted as answers");
  const hasMenuSchema = pages.some((p) => p.schema.includes("Menu"));
  if (!hasMenuSchema) add("low", "menu is not marked up as Menu/MenuItem — individual dishes are not answerable");
  const hasProduct = pages.some((p) => p.schema.includes("Product") || p.schema.includes("ItemList"));
  if (!hasProduct) add("low", "shop products are not marked up as Product");

  return out;
}

async function main() {
  const pages = [];
  for (const route of PAGES) pages.push(await auditPage(route));

  const leakStatus = {};
  const leaks = [];
  for (const r of MUST_404) {
    const { status } = await get(SITE + r);
    leakStatus[r] = status;
    if (status !== 404) leaks.push(r);
  }

  const sm = await get(`${SITE}/sitemap.xml`);
  const rb = await get(`${SITE}/robots.txt`);
  const home = await get(SITE + "/");

  const extras = {
    sitemap: { ok: sm.status === 200, urls: (sm.body.match(/<loc>/g) ?? []).length },
    robotsTxt: {
      allows: rb.status === 200 && !/Disallow: \/\s*$/m.test(rb.body),
      sitemapHost: (rb.body.match(/Sitemap:\s*https?:\/\/([^/\s]+)/) ?? [])[1] ?? null,
    },
    leaks,
    leakStatus,
    gscVerified: /google-site-verification/.test(home.body),
    ga: /googletagmanager\.com\/gtag|google-analytics\.com/.test(home.body),
    metaPixel: /facebook\.com\/tr|connect\.facebook\.net/.test(home.body),
  };

  const report = {
    site: SITE,
    ranAt: new Date().toISOString(),
    month: new Date().toISOString().slice(0, 7),
    pages,
    extras,
    findings: findings(pages, extras),
  };

  const bySeverity = (s) => report.findings.filter((f) => f.severity === s);
  console.log(`\nSEO audit — ${report.site} — ${report.month}`);
  console.log(`${pages.length} pages, ${extras.sitemap.urls} sitemap URLs\n`);
  for (const sev of ["high", "medium", "low"]) {
    const list = bySeverity(sev);
    if (!list.length) continue;
    console.log(`${sev.toUpperCase()} (${list.length})`);
    for (const f of list) console.log(`  - ${f.message}`);
    console.log();
  }
  if (!report.findings.length) console.log("No findings.\n");

  if (process.argv.includes("--save")) {
    mkdirSync(HISTORY, { recursive: true });
    const file = path.join(HISTORY, `${report.month}.json`);
    writeFileSync(file, JSON.stringify(report, null, 2));
    console.log(`Saved ${path.relative(ROOT, file)}`);

    const prior = readdirSync(HISTORY).filter((f) => f.endsWith(".json")).sort();
    const previous = prior[prior.indexOf(`${report.month}.json`) - 1];
    if (previous) {
      const before = JSON.parse(readFileSync(path.join(HISTORY, previous), "utf8"));
      const was = new Set(before.findings.map((f) => f.message));
      const now = new Set(report.findings.map((f) => f.message));
      const fixed = [...was].filter((m) => !now.has(m));
      const fresh = [...now].filter((m) => !was.has(m));
      console.log(`\nSince ${previous.replace(".json", "")}:`);
      fixed.forEach((m) => console.log(`  fixed  ${m}`));
      fresh.forEach((m) => console.log(`  new    ${m}`));
      if (!fixed.length && !fresh.length) console.log("  no change");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
