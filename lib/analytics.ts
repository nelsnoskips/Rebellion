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

declare global {
  interface Window {
    dataLayer?: unknown[];
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

/** A conversion, reported to every destination that is listening. */
export function track(
  metaEvent: MetaEvent,
  dataLayerEvent: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event: dataLayerEvent, ...params });
    window.fbq?.("track", metaEvent, params);
  } catch {
    // Deliberately swallowed. A blocked or broken tracker is not a reason for
    // the visitor's next click to fail.
  }
}

/** A pageview, for client-side navigation the base pixel snippet cannot see. */
export function trackPageView() {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "PageView");
  } catch {
    /* see above */
  }
}
