import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

/* --- The client's brand faces -------------------------------------------
 *
 * Supplied as desktop OTFs and converted to subset WOFF2 by
 * scripts/build-fonts.py. Roles follow the house style guide's TYPOGRAPHY
 * page (brand/Rebellion_Wine_Bar_Style_Guide.pdf, p5):
 *
 *   Festivo Letters No. 18  HEADLINE TYPE
 *   Trade Supply Textured   SUBHEAD STYLE
 *   Archer                  body — a Hoefler&Co licence, not supplied
 *
 * Minion Pro came with the same hand-off and appears throughout the client's
 * InDesign menu files, so it carries the editorial serif voice until an Archer
 * web licence exists. Body and UI copy stay on Inter for the same reason.
 *
 * `adjustFontFallback` is off on all three: these are display faces with
 * metrics far from any system font, and Next's synthetic fallback distorts
 * them more than the swap it prevents.
 */

const festivo = localFont({
  src: "./fonts/FestivoLettersNo18.woff2",
  variable: "--font-festivo",
  display: "swap",
  weight: "400",
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

const trade = localFont({
  src: "./fonts/TradeSupplyTextured.woff2",
  variable: "--font-trade",
  display: "swap",
  weight: "400",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const minion = localFont({
  src: "./fonts/MinionProRegular.woff2",
  variable: "--font-minion",
  display: "swap",
  weight: "400",
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

/* --- Supporting faces ---------------------------------------------------- */

/** Body and interface copy — the stand-in for the guide's Archer. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Marginalia for the collage direction. Not a brand face; it is handwriting. */
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
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
      className={`${festivo.variable} ${trade.variable} ${minion.variable} ${inter.variable} ${caveat.variable}`}
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
