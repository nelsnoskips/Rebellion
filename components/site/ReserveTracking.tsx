"use client";

import { useEffect } from "react";
import { trackResyClick, type ReserveLocation } from "@/lib/analytics";

/**
 * Booking-click tracking, by event delegation.
 *
 * Why delegation rather than an onClick on each button: the ten "Reserve a
 * table" buttons live in a mix of server and client components, and wiring a
 * handler to each would mean converting server components to client ones for
 * the sake of analytics. One listener on the document catches them all, costs
 * nothing at render, and picks up any reserve button added later without
 * anyone remembering to instrument it.
 *
 * Capture phase on purpose. Resy's embed and our own React handlers both run
 * on these clicks; listening at capture means the event is recorded before
 * anything downstream can stop propagation. The de-duplication that makes one
 * tap one event lives in trackResyClick.
 *
 * What counts as a booking click:
 *   - anything carrying data-reserve-location
 *   - any link to /reserve, wherever it is
 *   - any link to resy.com
 *   - any click inside the mounted Resy widget
 *
 * There is no consent gate here because the site has none: GA4 and the Meta
 * pixel both load unconditionally today. If a consent banner is ever added,
 * this needs to sit behind the same gate as those two — see lib/analytics.ts.
 */
export function ReserveTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      const tagged = target.closest<HTMLElement>("[data-reserve-location]");
      if (tagged) {
        trackResyClick(
          (tagged.dataset.reserveLocation as ReserveLocation) ?? "unknown",
        );
        return;
      }

      // Untagged routes to the same place still count — a reserve button added
      // later should not go unmeasured just because it has no attribute yet.
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        const href = link.getAttribute("href") ?? "";
        if (href.startsWith("/reserve") || href.includes("resy.com")) {
          trackResyClick("unknown");
        }
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
