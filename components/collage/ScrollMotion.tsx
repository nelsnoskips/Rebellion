"use client";

import { useEffect } from "react";

/**
 * Engine selection and fallback for the cinematic hero.
 *
 * Chrome, Edge and recent Safari/Firefox run the whole thing from CSS
 * scroll-driven animations with no per-frame JavaScript. Older Safari and
 * Firefox ignore `animation-timeline` silently — the hero would simply never
 * move — so this mirrors the same keyframe tables in a damped rAF loop and
 * runs it only where the CSS path is unavailable.
 *
 * The damping is deliberate, not a shortcut: it gives the fallback the
 * glide-to-rest the CSS path gets for free.
 *
 * KEEP IN SYNC with the `@keyframes` in app/globals.css.
 */

type Segment = {
  o?: [number, number];
  y?: [number, number];
  s?: [number, number];
};

type Track = {
  sel: string;
  yUnit?: "px" | "%";
  kf: [number, Segment][];
};

const CINE: Track[] = [
  {
    sel: ".cine-photo",
    yUnit: "%",
    kf: [
      [0, { s: [1.04, 1.28], y: [0, -3] }],
      [100, {}],
    ],
  },
  {
    sel: ".cine-veil",
    kf: [
      [0, { o: [0.82, 0.42] }],
      [45, { o: [0.42, 0.34] }],
      [100, {}],
    ],
  },
  {
    sel: ".cine-act-title",
    yUnit: "%",
    kf: [
      [0, { o: [1, 1], s: [1, 1.04], y: [0, 0] }],
      [12, { o: [1, 0], s: [1.04, 1.34], y: [0, -6] }],
      [37, { o: [0, 0], s: [1.34, 1.34], y: [-6, -6] }],
      [100, {}],
    ],
  },
  {
    sel: ".cine-act-line",
    yUnit: "px",
    kf: [
      [0, { o: [0, 0], y: [64, 64] }],
      [33, { o: [0, 1], y: [64, 0] }],
      [50, { o: [1, 1], y: [0, 0] }],
      [72, { o: [1, 0], y: [0, -64] }],
      [88, { o: [0, 0], y: [-64, -64] }],
      [100, {}],
    ],
  },
  {
    sel: ".cine-act-final",
    yUnit: "px",
    kf: [
      [0, { o: [0, 0], y: [48, 48] }],
      [84, { o: [0, 1], y: [48, 0] }],
      [97, { o: [1, 1], y: [0, 0] }],
      [100, {}],
    ],
  },
  {
    sel: ".cine-hint",
    kf: [
      [0, { o: [0.65, 0] }],
      [10, { o: [0, 0] }],
      [100, {}],
    ],
  },
];

/** Backdrops fade but must never be hidden — they are the scene. */
const BACKDROPS = new Set([".cine-photo", ".cine-veil"]);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function ScrollMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Idempotent with the pre-paint script; this covers a hydration-only path.
    if (!reduced) document.documentElement.classList.add("cine-on");

    const cssPath = CSS.supports("animation-timeline: scroll()");
    if (cssPath || reduced) return;

    const tracks = CINE.map((track) => ({
      track,
      els: Array.from(document.querySelectorAll<HTMLElement>(track.sel)),
    })).filter(({ els }) => els.length > 0);

    if (tracks.length === 0) return;

    let target = window.scrollY;
    let eased = target;
    let frame = 0;
    let running = false;

    const apply = () => {
      const p100 = clamp01(eased / (window.innerHeight * 3)) * 100;
      for (const { track, els } of tracks) {
        let i = 0;
        while (i < track.kf.length - 2 && p100 >= track.kf[i + 1][0]) i++;
        const seg = track.kf[i][1];
        const span = Math.max(track.kf[i + 1][0] - track.kf[i][0], 0.0001);
        const t = clamp01((p100 - track.kf[i][0]) / span);

        for (const el of els) {
          if (seg.o) {
            const o = mix(seg.o[0], seg.o[1], t);
            el.style.opacity = String(o);
            if (!BACKDROPS.has(track.sel)) {
              el.style.visibility = o <= 0.01 ? "hidden" : "visible";
            }
          }
          const parts: string[] = [];
          if (seg.s) parts.push(`scale(${mix(seg.s[0], seg.s[1], t)})`);
          if (seg.y) {
            parts.push(`translateY(${mix(seg.y[0], seg.y[1], t)}${track.yUnit ?? "px"})`);
          }
          if (parts.length) el.style.transform = parts.join(" ");
        }
      }
    };

    const tick = () => {
      eased += (target - eased) * 0.12;
      apply();
      if (Math.abs(target - eased) > 0.4) {
        frame = requestAnimationFrame(tick);
      } else {
        eased = target;
        apply();
        running = false;
      }
    };

    const wake = () => {
      target = window.scrollY;
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, []);

  return null;
}
