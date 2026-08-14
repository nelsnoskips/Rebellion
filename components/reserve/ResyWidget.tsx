"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { reservations, site, type BookingKey } from "@/lib/site";

/**
 * Resy booking control.
 *
 * Three states, in order of preference, so the reserve path never dead-ends on
 * missing configuration:
 *
 *   1. `venueId` + `apiKey` set  → Resy's inline widget mounts here.
 *   2. `deepLink` set            → a link out to the venue's Resy page, with
 *                                  campaign parameters carried across.
 *   3. neither                   → call the restaurant.
 *
 * Campaign continuity (blueprint §11): whatever `utm_*`/`gclid`/`fbclid` landed
 * on this page is appended to the deep link, so a booking can still be
 * attributed to the ad that produced it.
 */

/** Resy's embed exposes a single global once the script has loaded. */
declare global {
  interface Window {
    resyWidget?: {
      addButton: (
        el: HTMLElement,
        opts: { venueId: number; apiKey: string; replace?: boolean },
      ) => void;
    };
    dataLayer?: unknown[];
  }
}

const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

/** Forward campaign parameters from `search` onto an outbound link. */
function withCampaign(url: string, search: string): string {
  if (!search) return url;
  const here = new URLSearchParams(search);
  const out = new URL(url);
  for (const key of CAMPAIGN_PARAMS) {
    const value = here.get(key);
    if (value) out.searchParams.set(key, value);
  }
  return out.toString();
}

/**
 * The current query string, read the hydration-safe way: the server snapshot is
 * empty, so the prerendered HTML carries the plain link and the client upgrades
 * it once mounted. The query string cannot change without a navigation, so the
 * subscribe callback has nothing to listen to.
 */
const NO_OP_SUBSCRIBE = () => () => {};

function useSearchString(): string {
  return useSyncExternalStore(
    NO_OP_SUBSCRIBE,
    () => window.location.search,
    () => "",
  );
}

/**
 * Reservation-start event for the measurement layer (blueprint §06).
 * A no-op until an analytics container is installed — it never throws and
 * never blocks the booking.
 */
function trackReservationStart(booking: BookingKey) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({
    event: "reservation_start",
    platform: reservations.platform,
    booking,
  });
}

export function ResyWidget({ booking }: { booking: BookingKey }) {
  const config = reservations.bookings[booking];
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const search = useSearchString();

  const canEmbed = config.venueId !== null && config.apiKey !== null;
  // Resolved during render rather than rewritten inside the click handler,
  // which would race the navigation the click starts.
  const href = config.deepLink ? withCampaign(config.deepLink, search) : null;

  useEffect(() => {
    if (!canEmbed) return;
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;

    const mountWidget = () => {
      if (cancelled || !window.resyWidget) return;
      try {
        // NOTE: confirm this snippet against the one Resy issues for the
        // account — if their embed uses a different entry point, this call is
        // the only thing that changes.
        window.resyWidget.addButton(mount, {
          venueId: config.venueId as number,
          apiKey: config.apiKey as string,
          replace: true,
        });
      } catch {
        setFailed(true);
      }
    };

    if (window.resyWidget) {
      mountWidget();
      return;
    }

    // Load the embed lazily, and only on a page that actually books.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${reservations.embedScript}"]`,
    );
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = reservations.embedScript;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", mountWidget);
    script.addEventListener("error", () => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      script.removeEventListener("load", mountWidget);
    };
  }, [canEmbed, config.venueId, config.apiKey]);

  // 1. Live widget. If the script fails to load we fall through to the link or
  //    phone below rather than leaving an empty box.
  if (canEmbed && !failed) {
    return (
      <div
        ref={mountRef}
        onClick={() => trackReservationStart(booking)}
        className="min-h-[420px] w-full"
      />
    );
  }

  // 2. Deep link out to Resy.
  if (href) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center border border-ink/15 bg-paper p-10 text-center">
        <p className="micro text-oxblood">Reservations</p>
        <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ink-mute">
          Thursday through Saturday books up. Pick a date and a table on Resy —
          or call and we&apos;ll write you into the book by hand.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackReservationStart(booking)}
          className="micro mt-8 bg-oxblood px-9 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
        >
          Book on Resy
        </a>
        <a
          href={site.phoneHref}
          className="micro mt-5 text-ink-mute underline underline-offset-4 hover:text-ink"
        >
          {site.phone}
        </a>
      </div>
    );
  }

  // 3. Nothing configured yet — a real person still answers the phone.
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-ink/25 bg-paper p-10 text-center">
      <p className="micro text-oxblood">Reservation widget</p>
      <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ink-mute">
        The Resy booking widget mounts here once the venue ID and API key are
        in. Until then, call the restaurant and we&apos;ll write you into the
        book by hand.
      </p>
      <a
        href={site.phoneHref}
        className="micro mt-8 bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d]"
      >
        Call {site.phone}
      </a>
    </div>
  );
}
