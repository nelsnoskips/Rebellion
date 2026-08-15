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
  x?: [number, number];
  y?: [number, number];
  s?: [number, number];
};

type Track = {
  sel: string;
  /** Unit for both x and y. Percentages are of the element's own box. */
  unit?: "px" | "%";
  kf: [number, Segment][];
};

/**
 * The assembly, in the order a page gets laid out. Mirrors the `@keyframes`
 * in app/globals.css — edit both or neither.
 *
 * Transform parts are always emitted translate-then-scale, matching the CSS.
 */
const CINE: Track[] = [
  {
    sel: ".cine-wash",
    kf: [
      [0, { o: [0, 1], s: [1.2, 1] }],
      [25, {}],
    ],
  },
  {
    // A settle, not an entrance — the mark is visible from the first frame.
    sel: ".cine-mark",
    unit: "px",
    kf: [
      [0, { y: [10, 0], s: [0.97, 1] }],
      [18, {}],
    ],
  },
  {
    sel: ".cine-photo",
    unit: "%",
    kf: [
      [0, { o: [0, 0], x: [14, 14], s: [1.18, 1.18] }],
      [8, { o: [0, 1], x: [14, 0], s: [1.18, 1] }],
      [45, { o: [1, 1], y: [0, -4] }],
      [100, {}],
    ],
  },
  ...([
    [".cine-l1", 22, 40],
    [".cine-l2", 30, 48],
    [".cine-l3", 38, 56],
    [".cine-l4", 46, 64],
  ] as const).map(([sel, from, to]) => ({
    sel,
    unit: "px" as const,
    kf: [
      [0, { o: [0, 0] as [number, number], y: [40, 40] as [number, number] }],
      [from, { o: [0, 1] as [number, number], y: [40, 0] as [number, number] }],
      [to, {}],
    ] as [number, Segment][],
  })),
  {
    sel: ".cine-splat",
    kf: [
      [0, { o: [0, 0], s: [0.5, 0.5] }],
      [56, { o: [0, 1], s: [0.5, 1] }],
      [68, {}],
    ],
  },
  {
    sel: ".cine-note",
    unit: "px",
    kf: [
      [0, { o: [0, 0], y: [16, 16] }],
      [62, { o: [0, 1], y: [16, 0] }],
      [76, {}],
    ],
  },
  {
    sel: ".cine-cta",
    unit: "px",
    kf: [
      [0, { o: [0, 0], y: [28, 28] }],
      [72, { o: [0, 1], y: [28, 0] }],
      [88, {}],
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

/**
 * Only these are pulled out of the accessibility tree when clear. The rest of
 * the composition is in normal flow and ends visible, so toggling visibility
 * on it would fight the layout for no gain; the CTA is the one thing that must
 * not be clickable before it arrives.
 */
const HIDE_WHEN_CLEAR = new Set([".cine-cta"]);

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
            if (HIDE_WHEN_CLEAR.has(track.sel)) {
              el.style.visibility = o <= 0.01 ? "hidden" : "visible";
            }
          }
          const unit = track.unit ?? "px";
          const parts: string[] = [];
          if (seg.x || seg.y) {
            const x = seg.x ? mix(seg.x[0], seg.x[1], t) : 0;
            const y = seg.y ? mix(seg.y[0], seg.y[1], t) : 0;
            parts.push(`translate3d(${x}${unit}, ${y}${unit}, 0)`);
          }
          if (seg.s) parts.push(`scale(${mix(seg.s[0], seg.s[1], t)})`);
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
