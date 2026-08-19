import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignaturePattern, Splat } from "@/components/ui/Artwork";
import { BRAND_COLORS, BRAND_ELEMENTS, BRAND_TYPE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Brand reference",
  robots: { index: false, follow: false },
};

/**
 * The house style guide, translated to the web.
 *
 * This is a reference sheet, not a third direction: it shows the client's own
 * palette, type and graphic elements exactly as their guide specifies them,
 * and records where the site follows and where it is still waiting on a
 * licence or a decision. Directions A and B are untouched by it.
 *
 * It is laid out the way the guide itself is — white ground, drawn double
 * rule, red Festivo heads, plum Trade Supply subheads — so that putting the
 * two side by side is a fair comparison.
 */

function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sg-section">
      <h2 className="display sg-h2">{title}</h2>
      {lede ? <p className="sg-lede">{lede}</p> : null}
      {children}
    </section>
  );
}

export default function BrandReferencePage() {
  return (
    <main className="sg" id="main">
      <div className="sg-frame">
        {/* --- Cover ------------------------------------------------------ */}
        <header className="sg-cover">
          <Image
            src="/brand/wine-bar-lockup.webp"
            alt="Rébellion Wine Bar — the full-colour logo with illustration"
            width={937}
            height={1100}
            className="sg-cover-mark"
            priority
          />
          <p className="display sg-cover-title">
            House style <span className="sg-cover-em">on the web</span>
          </p>
          <p className="sg-cover-note">
            Transcribed from the client&rsquo;s style guide. Every value below is
            read off that document.
          </p>
        </header>

        {/* --- The mark --------------------------------------------------- */}
        <Section
          title="The mark"
          lede="The full-colour logo is always preferred. Where white is not available the mark reverses out of a single palette colour — and it is never altered, recoloured or redrawn."
        >
          <div className="sg-marks">
            <figure className="sg-mark sg-mark-white">
              <Image
                src="/brand/wine-bar-lockup.webp"
                alt="The full-colour lockup on white"
                width={937}
                height={1100}
              />
              <figcaption className="micro">4 colour · on white · preferred</figcaption>
            </figure>
            {(["#A60A3D", "#693C5E", "#34657F"] as const).map((hex) => (
              <figure key={hex} className="sg-mark" style={{ background: hex }}>
                <span
                  aria-hidden
                  className="art-mask sg-mark-reversed"
                  style={{
                    WebkitMaskImage: "url(/brand/wine-bar-logotype.png)",
                    maskImage: "url(/brand/wine-bar-logotype.png)",
                  }}
                />
                <figcaption className="micro">Reversed · {hex}</figcaption>
              </figure>
            ))}
          </div>
          <p className="sg-body">
            Clear space is set by the height and width of the <em>N</em> in
            Rébellion — nothing sits closer to the mark than that on any side.
            On the site the rule is held by a fixed padding on the header
            lockup rather than measured per breakpoint, which is the same
            distance at every size the mark is used.
          </p>
        </Section>

        {/* --- Palette ---------------------------------------------------- */}
        <Section
          title="Color palette"
          lede="Six approved colours. The guide reserves PMS and CMYK for print and RGB and HEX for digital, so the hexes below are what the site's tokens hold."
        >
          <div className="sg-swatches">
            {BRAND_COLORS.map((color) => (
              <figure key={color.hex} className="sg-swatch">
                <div
                  className="sg-chip"
                  style={{ background: color.hex, color: color.on }}
                >
                  <span className="micro">{color.name}</span>
                </div>
                <figcaption className="sg-spec">
                  <span>{color.pantone}</span>
                  <span>{color.cmyk}</span>
                  <span>{color.rgb}</span>
                  <span className="sg-spec-hex">{color.hex}</span>
                </figcaption>
                {color.note ? <p className="sg-note">{color.note}</p> : null}
              </figure>
            ))}
          </div>
        </Section>

        {/* --- Type ------------------------------------------------------- */}
        <Section
          title="Typography"
          lede="Three faces came with the hand-off and one did not. Each is set below in the role the guide gives it."
        >
          <div className="sg-type">
            {BRAND_TYPE.map((face) => (
              <article key={face.name} className="sg-face">
                <p className="micro sg-face-role">
                  {face.role}
                  {face.status === "not supplied" ? " · not supplied" : ""}
                </p>
                <p
                  className="sg-face-specimen"
                  style={face.token ? { fontFamily: face.token } : undefined}
                >
                  Rébellion
                </p>
                <p className="sg-face-name">{face.name}</p>
                <p className="sg-note">{face.detail}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* --- Graphic elements ------------------------------------------- */}
        <Section
          title="Graphic elements"
          lede="Three sanctioned textures. They are what makes the brand read as painted rather than laid out."
        >
          <div className="sg-splats" style={{ color: "#000" }}>
            {([1, 2, 3, 4, 5] as const).map((variant) => (
              <span key={variant} className="sg-splat">
                <Splat variant={variant} className="inset-0 h-full w-full" />
              </span>
            ))}
          </div>
          <div className="sg-elements">
            <figure className="sg-element">
              <Image
                src="/brand/watercolor.webp"
                alt="The approved watercolour texture — violet, coral and tan"
                width={1512}
                height={1600}
              />
            </figure>
            <figure className="sg-element sg-element-pattern">
              <SignaturePattern className="inset-0 h-full w-full text-ink" />
            </figure>
          </div>
          <dl className="sg-elements-key">
            {BRAND_ELEMENTS.map((element) => (
              <div key={element.name}>
                <dt className="micro">{element.name}</dt>
                <dd className="sg-note">{element.detail}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* --- Open questions --------------------------------------------- */}
        <Section
          title="Still open"
          lede="Four things the guide cannot settle on its own."
        >
          <ol className="sg-open">
            <li>
              <strong>Archer needs a web licence.</strong> The guide specifies it
              for all body copy. It was not in the hand-off, and a desktop
              licence would not cover the web in any case. Body copy runs on the
              interface sans until Hoefler&amp;Co is sorted.
            </li>
            <li>
              <strong>The three supplied faces are desktop licences.</strong>{" "}
              Serving them from the site is a separate grant in every one of
              these foundries&rsquo; terms. Fine for a private preview; worth
              confirming before launch.
            </li>
            <li>
              <strong>PMS 5503 C prints two ways.</strong> #34657F is written on
              page 4; the chip beside it, and the reversed panel on page 2, are
              a much paler #91B6BC. The site carries both.
            </li>
            <li>
              <strong>This is the Wine Bar&rsquo;s guide.</strong> The site is
              Beachside Bar &amp; Bistro, which has its own lockup. The palette,
              type and graphic elements carry across; the mark does not.
            </li>
          </ol>
        </Section>

        <footer className="sg-footer">
          <Link href="/rebellion-a" className="micro">
            ← Direction A
          </Link>
          <Link href="/rebellion-b" className="micro">
            Direction B →
          </Link>
        </footer>
      </div>
    </main>
  );
}
