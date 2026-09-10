import Link from "next/link";
import { happenings, site } from "@/lib/site";
import { eventDate } from "@/lib/utils";
import { Deckle } from "@/components/ui/Artwork";
import { TodayHours } from "@/components/home/TodayHours";

/**
 * "Tonight at Rebellion" (blueprint §08, live status): a slim utility strip for
 * hours, the next happening, and the direct actions a guest arrives wanting.
 *
 * Rendered from static content for now. When the calendar feed and the
 * reservation platform expose live state, this becomes the one place that
 * needs to change.
 */
export function TonightStrip() {
  const next = happenings[0];
  const date = eventDate(next.date);

  return (
    <div className="relative border-b border-rule-dark bg-ink-soft text-bone">
      {/* Paper from the section below tears up into the strip. */}
      <Deckle edge="bottom" variant={1} className="text-bone" />
      <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3.5 pb-6 text-sm md:px-10 md:pb-8">
        <p className="micro flex items-center gap-2 text-signal">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-70" />
          </span>
          Tonight at Rebellion
        </p>
        <p className="text-bone/75">
          <TodayHours />
        </p>
        <p className="text-bone/75">
          Next up:{" "}
          <Link
            href={`/happenings#${next.slug}`}
            className="text-bone underline decoration-signal/60 underline-offset-4 hover:decoration-signal"
          >
            {next.title}
          </Link>{" "}
          · {date.full}
        </p>
        <div className="ml-auto flex items-center gap-6">
          <a href={site.phoneHref} className="text-bone/75 hover:text-bone">
            {site.phone}
          </a>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="micro text-bone/75 hover:text-bone"
          >
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
