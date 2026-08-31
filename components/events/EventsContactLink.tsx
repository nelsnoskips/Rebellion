"use client";

import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

/**
 * The private-events email address, with the conversion attached.
 *
 * When the inquiry form went away the `Lead` event went with it, and a pixel
 * that reports page views but never a lead is a pixel campaigns cannot
 * optimise against. A click on this address is the closest honest signal the
 * site still has: it is intent, not a completed enquiry, and the brief in
 * lib/analytics.ts says so.
 *
 * Client component purely for the click handler — the page around it stays a
 * server component.
 */
export function EventsContactLink({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${site.eventsEmail}?subject=Private%20event%20enquiry`}
      className={className}
      onClick={() => track("Lead", "private_event_inquiry", { form: "mailto" })}
    >
      {site.eventsEmail}
    </a>
  );
}
