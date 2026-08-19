import type { Metadata } from "next";
import { Archivo_Narrow, Bitter, Cormorant_Garamond } from "next/font/google";
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
 *   Display     Cormorant Garamond   headlines only — never paragraphs,
 *                                    navigation or small labels
 *   Editorial   Bitter               paragraphs and descriptions
 *   Interface   Archivo Narrow       navigation, buttons, labels
 *   Texture     Trade Supply         accents only, applied like ink
 *
 * Two substitutions, both flagged rather than hidden:
 *
 * Bitter stands in for Archer, the guide's body face — a Hoefler&Co licence
 * that was not in the hand-off. Same geometric slab construction and softened
 * terminals, drawn for screen text. Archer Book/Medium/Semibold map onto 400,
 * 500 and 600 here, and Archer Light is deliberately unused: it disappears on
 * photographs and at mobile sizes.
 *
 * Archivo Narrow stands in for Festivo Basic, which was also not supplied.
 * Festivo Letters No. 18 *was* supplied but it is a decorative display cut,
 * and putting it in an 11px navigation bar is how you get an unreadable menu.
 * Archivo Narrow is the condensed, uppercase, tracked-out interface voice the
 * spec asks for and holds together at label sizes.
 */

/** Headlines. Medium and Semibold — the weights that carry the drama. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Paragraphs and descriptions. The Archer stand-in; italic carries the
    editorial notes that used to be set in a script face. */
const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Navigation, buttons and labels. */
const archivo = Archivo_Narrow({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
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

export const metadata: Metadata = {
  metadataBase: new URL("https://rebellionbeachside.com"),
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
      className={`${cormorant.variable} ${bitter.variable} ${archivo.variable} ${trade.variable} ${festivo.variable} ${minion.variable}`}
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
