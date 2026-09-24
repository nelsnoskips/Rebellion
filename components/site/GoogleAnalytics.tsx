"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/analytics";

/**
 * Google Analytics 4.
 *
 * Same shape as the Meta pixel next door, and for the same reason: gtag counts
 * one page_view when the tag loads, and this site navigates on the client after
 * that. Without the effect below, every page reached by clicking a link goes
 * unrecorded and the homepage looks like the only page anyone visits — which
 * is exactly the reporting you would then plan SEO against.
 *
 * `send_page_view: false` on the config call, so the first view is sent once by
 * the effect rather than twice: once by gtag and once by us.
 *
 * `afterInteractive` keeps a third-party script out of the page's first paint.
 *
 * With NEXT_PUBLIC_GA_MEASUREMENT_ID unset this renders nothing at all, so
 * preview and local builds stay out of the property.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const ready = useRef(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    // Wait for the config call below to have run at least once.
    if (!ready.current && !window.gtag) return;
    ready.current = true;
    trackPageView(pathname);
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        onReady={() => {
          ready.current = true;
          trackPageView(window.location.pathname);
        }}
      >
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
