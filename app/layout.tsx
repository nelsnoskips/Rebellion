import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

/* --- The approved type system -------------------------------------------
 *
 * The 2021 style guide is the source of the brand's character, not a web
 * typography spec: forcing all four of its faces into equal service is what
 * makes a site look like a brand manual instead of a restaurant. So the
 * display voice is a modern editorial serif the guide never had, and the
 * guide's own faces do the work they are actually good at.
 *
 *   Display     Cormorant Garamond    headlines only — never paragraphs,
 *                                     navigation or small labels
 *   Editorial   Archer Book/Medium    paragraphs and descriptions
 *   Interface   Festivo Letters No.1  navigation, buttons, labels
 *   Texture     Trade Supply          accents only, applied like ink
 *
 * Three of the four are now the brand's own faces. Archer and Festivo No. 1
 * were never in the hand-off and were running on open-licence substitutes
 * until it turned out the client publishes both from their own domain — see
 * brand/fonts/web/README.md, which also covers the licence question that
 * raises and does not answer.
 *
 * The display serif is the one deliberate outsider: the book has no headline
 * face that reads premium in 2026, and Cormorant holds the role until a Canela
 * or Editorial New licence lands (scripts/build-display-font.py).
 */

/** Headlines. Medium and Semibold — the weights that carry the drama. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Paragraphs and descriptions — Archer, the real one.
 *
 * The brand book specifies Archer for all body copy and it was never in the
 * hand-off, so this ran on a stand-in until it turned out the client has been
 * serving the genuine files from their own domain the whole time (see
 * brand/fonts/web/README.md, and the licence question it raises).
 *
 * Book is 400 and Medium is 500. Medium is declared again at 600 so that
 * anything asking for Semibold — which was never deployed — lands on a real
 * weight instead of a synthesised one.
 */
const archer = localFont({
  variable: "--font-archer",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    { path: "./fonts/ArcherBook.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ArcherMedium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ArcherMedium.woff2", weight: "600", style: "normal" },
  ],
});

/**
 * Navigation, buttons and labels — Festivo Letters No. 1.
 *
 * The heavy condensed uppercase cut. This is the "Festivo Basic" the type
 * spec asked for in the interface, and it is what the client's own site
 * already sets its navigation in. One drawn weight, declared across the range
 * so nothing synthesises a bold on top of a face that is already heavy.
 */
const festivoOne = localFont({
  variable: "--font-festivo-one",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  src: [
    { path: "./fonts/FestivoLettersNo1.woff2", weight: "400", style: "normal" },
    { path: "./fonts/FestivoLettersNo1.woff2", weight: "500", style: "normal" },
    { path: "./fonts/FestivoLettersNo1.woff2", weight: "600", style: "normal" },
  ],
});

/* --- The client's own faces ---------------------------------------------
 *
 * Converted from the supplied desktop OTFs by scripts/build-fonts.py.
 *
 * Trade Supply is in service, but only as texture: section marks, event
 * categories, bottle-shop labels, stamped callouts. It is ink applied to the
 * page, never the page's default.
 *
 * Festivo Letters No. 18 and Minion Pro are loaded but unused on the site
 * itself — they are set as specimens on /rebellion-brand, so `preload` is off
 * and no other page pays for them.
 */

const trade = localFont({
  src: "./fonts/TradeSupplyTextured.woff2",
  variable: "--font-trade",
  display: "swap",
  weight: "400",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const festivo = localFont({
  src: "./fonts/FestivoLettersNo18.woff2",
  variable: "--font-festivo",
  display: "swap",
  weight: "400",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

const minion = localFont({
  src: "./fonts/MinionProRegular.woff2",
  variable: "--font-minion",
  display: "swap",
  weight: "400",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

/**
 * Where this build will actually live. Canonicals, Open Graph URLs and the
 * structured data all hang off it, so it has to be right per deployment
 * rather than baked in — the site is heading for a subdirectory of the
 * client's existing WordPress, not its own domain.
 *
 *   NEXT_PUBLIC_SITE_URL=https://rebellionrestaurants.com/rebellionbistro
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebellionbeachside.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_US",
  },
};

/**
 * Restaurant structured data (blueprint §11, SEO/AEO). Kept minimal and
 * truthful; extend with menu, geo and aggregate rating once the NAP and hours
 * are verified with the client.
 */
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  description: site.description,
  telephone: site.phone,
  servesCuisine: "American",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${archer.variable} ${festivoOne.variable} ${trade.variable} ${festivo.variable} ${minion.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="micro sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </body>
    </html>
  );
}
