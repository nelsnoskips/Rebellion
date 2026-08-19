import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The logotype, rendered from the supplied 1C vector by
 * scripts/build-logotype.py. `knockout` is the bone copy for ink and oxblood
 * grounds; both are the same geometry to the pixel, so cross-fading one into
 * the other does not move the mark.
 *
 * The art carries the style guide's clear space inside the file — the height
 * and width of the N in Rébellion on every side — so a placement only has to
 * put the box somewhere and the margin comes with it. That also means the box
 * is larger than the ink: the mark reads about two thirds the height of the
 * space it occupies, which is the point.
 */
export function Logotype({
  knockout = false,
  className,
  priority = false,
  /** Pass "" where a second copy of the mark is stacked purely for a colour
      swap, so the name is not announced twice. */
  alt = "Rebellion Beachside Bar & Bistro",
}: {
  knockout?: boolean;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src={
        knockout
          ? "/brand/rebellion-logotype-knockout.png"
          : "/brand/rebellion-logotype.png"
      }
      alt={alt}
      width={1970}
      height={1343}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}

/**
 * The full lockup — skeleton, watercolour, wordmark — built from the supplied
 * artwork by scripts/build-brand.py.
 *
 * Full colour only, and therefore paper only: the washes and the crimson script
 * are the artwork's own and there is no knockout of them worth having. On ink
 * and oxblood grounds use `Logotype`, which is the 1C mark drawn for exactly
 * that purpose.
 */
export function Lockup({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/rebellion-lockup.webp"
      alt="Rebellion Beachside Bar & Bistro"
      width={1000}
      height={1260}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}

/**
 * Bottle silhouette used where product photography will go. Deliberately a
 * drawing, not a fake photo — it reads as a placeholder to anyone reviewing
 * the build, and it costs nothing.
 */
export function BottleGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 60 160"
      className={cn("h-full w-auto text-ink/80", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M24 4h12v34c0 6 12 14 12 30v84a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V68c0-16 12-24 12-30V4Z" />
      <path d="M12 78h36" />
      <rect x="16" y="92" width="28" height="40" rx="1" />
    </svg>
  );
}
