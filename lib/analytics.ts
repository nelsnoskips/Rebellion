/**
 * One place to send a conversion.
 *
 * The site already pushed reservation starts into `dataLayer` for a tag
 * manager that is not installed yet. Rather than bolt a second, parallel
 * tracking system on beside it, both destinations are fanned out from here:
 * anything worth measuring is reported once, and the destinations are a
 * detail of this file.
 *
 * Every call is defensive. Analytics must never be able to break a booking or
 * a form submit, so a missing pixel, a blocked script or an ad blocker all
 * result in nothing happening rather than an exception.
 */

/** Meta pixel for Rebellion Beachside. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "634504209468076";

/**
 * GA4 measurement ID for the Rebellion Beachside property.
 *
 * Not a secret — it ships in the page source of every site running GA4, which
 * is why it sits here rather than in the environment. It is, however, a pointer
 * at somebody's real reporting, so set NEXT_PUBLIC_GA_MEASUREMENT_ID to an
 * empty string on any build that should stay out of this property.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-BSWEHT5KJM";

/* ------------------------------------------------------------------ *
 *  GOOGLE ADS — PLACEHOLDERS. Both must be filled in before any Ads
 *  conversion is recorded; until then the conversion event is skipped
 *  rather than sent to a made-up destination, which would either error
 *  or, worse, land in somebody else's account.
 *
 *    GOOGLE_ADS_ID            the account tag,  "AW-XXXXXXXXX"
 *    RESERVE_CONVERSION_LABEL the action,       "AW-XXXXXXXXX/XXXXXXXXXXX"
 *
 *  Found in Google Ads → Goals → Conversions → the action → Tag setup →
 *  "Use Google Tag Manager": the Conversion ID is the first, the
 *  Conversion Label completes the second.
 * ------------------------------------------------------------------ */
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

export const RESERVE_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_RESERVE_LABEL ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
      push?: unknown;
    };
    _fbq?: unknown;
  }
}

/**
 * Meta's standard events. Using the standard names rather than custom ones
 * matters: only these are available for optimisation and for building
 * conversion-based audiences in Ads Manager. A custom event is a metric you
 * can read but not bid on.
 */
type MetaEvent = "PageView" | "Lead" | "Schedule" | "Contact" | "ViewContent";

/**
 * A conversion, reported to every destination that is listening.
 *
 * GA4 takes the dataLayer event name rather than Meta's. Meta's vocabulary is
 * fixed — only its standard names can be optimised against — while GA4 will
 * accept any name and reports on it, so each destination gets the name it can
 * actually use. Both describe the same action.
 */
export function track(
  metaEvent: MetaEvent,
  dataLayerEvent: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event: dataLayerEvent, ...params });
    window.fbq?.("track", metaEvent, params);
    window.gtag?.("event", dataLayerEvent, params);
  } catch {
    // Deliberately swallowed. A blocked or broken tracker is not a reason for
    // the visitor's next click to fail.
  }
}

/**
 * Where a booking click came from, for the `button_location` dimension.
 * Anything not in this list is reported as "unknown" rather than dropped —
 * a mislabelled conversion still beats a missing one.
 */
export type ReserveLocation =
  | "nav"
  | "nav-mobile"
  | "hero"
  | "floating"
  | "footer"
  | "menus"
  | "visit"
  | "reserve-widget"
  | "reserve-deeplink"
  | "collage"
  | "unknown";

/**
 * One booking click, reported to GA4, Google Ads and Meta.
 *
 * Debounced, because a single tap can reach us more than once: the click
 * bubbles through our own delegated listener while Resy's embed runs its own
 * handlers on the same event, and React may see it again. The window is short
 * — long enough to collapse one physical click, short enough that a visitor
 * who genuinely clicks Reserve twice a minute apart is counted twice.
 *
 * Note what this measures: the visitor opened the booking path. Whether they
 * finished happens on Resy, which we never see. Reading these as covers booked
 * will overstate them.
 */
const DEBOUNCE_MS = 1500;
let lastSentAt = 0;
let lastLocation: ReserveLocation | null = null;

export function trackResyClick(location: ReserveLocation = "unknown") {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (location === lastLocation && now - lastSentAt < DEBOUNCE_MS) return;
  lastSentAt = now;
  lastLocation = location;

  try {
    window.dataLayer?.push({
      event: "resy_click",
      button_location: location,
    });

    window.gtag?.("event", "resy_click", {
      page_location: window.location.href,
      button_location: location,
    });

    // Only with both halves of the destination present — see the placeholder
    // note above.
    if (GOOGLE_ADS_ID && RESERVE_CONVERSION_LABEL) {
      window.gtag?.("event", "conversion", {
        send_to: RESERVE_CONVERSION_LABEL,
      });
    }

    // Meta's standard event for starting a booking. Standard rather than
    // custom so it can be optimised against in Ads Manager.
    window.fbq?.("track", "Schedule", { button_location: location });
  } catch {
    // A blocked tracker must never cost the visitor the click that follows.
  }
}

/**
 * A pageview, for client-side navigation neither base snippet can see.
 *
 * GA4 needs the path passed explicitly here. Its own page_location defaults to
 * whatever the document reported when the tag loaded, which after a client-side
 * navigation is the page the visitor arrived on, not the one they are reading.
 */
export function trackPageView(path?: string) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "PageView");
    if (path) {
      window.gtag?.("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  } catch {
    /* see above */
  }
}
