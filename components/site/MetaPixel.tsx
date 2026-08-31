"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, trackPageView } from "@/lib/analytics";

/**
 * Meta pixel.
 *
 * The snippet Meta hands out fires exactly one PageView, on the first document
 * load. This site navigates on the client after that, so every page a visitor
 * reaches by clicking a link would otherwise go unrecorded — the homepage
 * would look like the only page anyone visits. The effect below covers those.
 *
 * `afterInteractive` rather than `beforeInteractive`: the pixel is not needed
 * to render anything, and loading it earlier would put a third-party script in
 * front of the page's own paint.
 *
 * Note this fires on preview builds too. That is deliberate — it is the only
 * way to verify the install with Meta's Pixel Helper before launch — but it
 * means preview traffic lands in the same dataset. Set
 * NEXT_PUBLIC_META_PIXEL_ID to an empty string on a build that should stay out
 * of it.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    // The base snippet already counted this one.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
