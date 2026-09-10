"use client";

import { useEffect, useState } from "react";
import { hours } from "@/lib/site";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * The hours that apply tonight, for the "Tonight at Rebellion" strip.
 *
 * This has to happen in the browser. The site is a static export, so a server
 * render would be frozen to whenever the build ran — by Thursday it would still
 * be announcing Monday. The day is read in the restaurant's own timezone rather
 * than the visitor's, because a guest in another state looking up Cocoa Beach
 * wants Cocoa Beach's clock.
 *
 * Before hydration it shows the weekday row, which is correct four nights in
 * seven and never claims the restaurant is open when it is closed.
 */
export function TodayHours() {
  const [row, setRow] = useState(hours[0]);

  useEffect(() => {
    const weekday = new Date().toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
    });
    const match = hours.find((h) => h.on.includes(WEEKDAYS.indexOf(weekday)));
    if (match) setRow(match);
  }, []);

  return (
    <>
      <span className="text-bone">{row.days}</span> {row.time}
    </>
  );
}
