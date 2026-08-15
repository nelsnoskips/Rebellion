import Image from "next/image";
import { images, type ImageName } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the collage direction.
 *
 * The conceit is a scrapbook: photographs are torn out and laid on paper, held
 * down with tape and pins, and annotated in the margin by hand. Everything here
 * exists to make that read as deliberate rather than messy — one tear shape per
 * aspect, a small fixed set of rotations, and handwriting that never carries
 * information the typeset copy does not also carry.
 */

const TEARS = {
  landscape: "torn",
  portrait: "torn-portrait",
  square: "torn-square",
  banner: "torn-banner",
  sweep: "torn-sweep",
} as const;

export type Tear = keyof typeof TEARS;

/** A photograph torn from a page. `ink` prints it in black and white. */
export function TornPhoto({
  name,
  tear = "landscape",
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  ink = false,
  priority = false,
  tilt = 0,
}: {
  name: ImageName;
  tear?: Tear;
  className?: string;
  sizes?: string;
  ink?: boolean;
  priority?: boolean;
  /** Degrees. Keep small — a scrapbook is askew, not chaotic. */
  tilt?: number;
}) {
  const img = images[name];
  return (
    <div
      className={cn("relative", TEARS[tear], className)}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", ink && "photo-ink")}
      />
    </div>
  );
}

/**
 * A handwritten margin note.
 *
 * Decorative by default: the typeset copy always says the same thing, so the
 * note is hidden from assistive tech rather than read out in a voice it cannot
 * convey. Pass `spoken` when a note is the only place something is said.
 */
export function Note({
  children,
  className,
  tilt = -4,
  tone = "oxblood",
  size = "md",
  spoken = false,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
  tone?: "oxblood" | "ink" | "bone";
  size?: "sm" | "md" | "lg";
  spoken?: boolean;
}) {
  const sizes = {
    sm: "text-[15px]",
    md: "text-[19px]",
    lg: "text-[26px]",
  } as const;
  const tones = {
    oxblood: "text-oxblood",
    ink: "text-ink",
    bone: "text-bone",
  } as const;

  return (
    <span
      aria-hidden={!spoken}
      className={cn("hand block", sizes[size], tones[tone], className)}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

/**
 * A watercolour splash. Smaller and more defined than a `Bloom` — the comp
 * scatters these across the paper, and a few large soft washes do not read the
 * same way. Tint with a `text-*` class.
 */
export function Splash({
  className,
  variant = "a",
  opacity = 60,
  tilt = 0,
}: {
  className?: string;
  variant?: "a" | "b" | "c";
  opacity?: number;
  tilt?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("art-mask absolute", className)}
      style={{
        WebkitMaskImage: `url(/artwork/splash-${variant}.png)`,
        maskImage: `url(/artwork/splash-${variant}.png)`,
        opacity: opacity / 100,
        ...(tilt ? { transform: `rotate(${tilt}deg)` } : {}),
      }}
    />
  );
}

/** A strip of tape holding a frame to the page. */
export function Tape({
  className,
  tilt = -18,
}: {
  className?: string;
  tilt?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-6 w-24 bg-ink/[0.07] shadow-[0_1px_2px_rgb(24_24_23/0.08)]",
        className,
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    />
  );
}

/** A push pin. */
export function Pin({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-3.5 w-3.5 rounded-full bg-bone/80 shadow-[0_2px_5px_rgb(24_24_23/0.5),inset_0_-1px_2px_rgb(24_24_23/0.35)]",
        className,
      )}
    />
  );
}

/**
 * A rubber stamp: text set around a circle, struck slightly off-square the way
 * a hand stamp lands.
 */
export function Stamp({
  text,
  className,
  tilt = -8,
}: {
  text: string;
  className?: string;
  tilt?: number;
}) {
  const id = `stamp-${text.replace(/\W+/g, "-").toLowerCase()}`;
  const repeated = `${text} · ${text} · `;
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={cn("pointer-events-none opacity-40", className)}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <defs>
        <path
          id={id}
          d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
          fill="none"
        />
      </defs>
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fill="currentColor" fontSize="15.5" fontWeight="700" letterSpacing="3.2">
        <textPath href={`#${id}`} startOffset="0">
          {repeated}
        </textPath>
      </text>
    </svg>
  );
}

/** A hairline rule with a hand-drawn wobble, used between collage sections. */
export function PencilRule({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 6"
      preserveAspectRatio="none"
      className={cn("h-1.5 w-full", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M0,3.6 C120,1.6 240,4.6 360,3.1 C480,1.6 600,4.8 720,3.3 C840,1.8 960,4.4 1080,2.9 C1140,2.2 1170,3.4 1200,3" />
    </svg>
  );
}
