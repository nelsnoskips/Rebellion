import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Bloom } from "@/components/ui/Artwork";
import { Logotype } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Art directions",
  description: "Compare the two homepage art directions.",
  robots: { index: false, follow: false },
};

/**
 * A review page, not part of the site. Both directions run on the same content
 * and the same design tokens, so this is only about treatment.
 *
 * Delete this route, `/collage` and `components/collage/` once a direction is
 * chosen — nothing else depends on them.
 */
const directions = [
  {
    href: "/",
    label: "Direction One",
    name: "Editorial",
    note: "Photograph-led. Full-bleed frames, dark bands carrying the spine of the page, paper tearing in between. The brand texture sits under and around the photography.",
    points: [
      "Cinematic hero, ink on image",
      "Dark triptych as the structural beat",
      "Painted edges, restrained marginalia",
    ],
  },
  {
    href: "/collage",
    label: "Direction Two",
    name: "Collage",
    note: "Paper-led. Every photograph is a sheet torn out and laid down, half of them printed as ink, and the margins carry handwriting. The dark chapter interrupts once instead of recurring.",
    points: [
      "Headline in ink on bone, photo torn into the corner",
      "Handwritten notes beside the typeset copy",
      "Tape, pins, a rubber stamp, a wine ring",
    ],
  },
];

export default function DirectionsPage() {
  return (
    <main
      id="main"
      className="paper-grain relative min-h-screen overflow-hidden bg-bone px-6 py-16 md:px-10"
    >
      <Bloom
        variant="a"
        opacity={45}
        className="-top-32 -left-24 h-[460px] w-[500px] text-wash-blush"
      />
      <div className="relative mx-auto max-w-[1000px]">
        <Logotype className="w-[180px]" />
        <h1 className="display mt-10 text-[clamp(2.2rem,5vw,3.6rem)]">
          Two directions
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-mute">
          Same content, same palette, same type, same photography — {site.name}{" "}
          treated two ways. Nothing here is a content decision; every
          placeholder is shared between them.
        </p>

        <ul className="mt-12 grid gap-px bg-rule sm:grid-cols-2">
          {directions.map((d) => (
            <li key={d.href} className="bg-bone p-8">
              <p className="micro text-oxblood">{d.label}</p>
              <h2 className="display mt-3 text-3xl">{d.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-mute">
                {d.note}
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-ink-mute">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="text-oxblood">
                      ·
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href={d.href}
                className="micro mt-8 inline-flex bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
              >
                Open {d.name.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
