import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A quiet control for moving between the two directions, so one link sent to a
 * client opens the door to both without a separate index page.
 *
 * Deliberately unlabelled beyond A and B: the client should react to what they
 * see, not to what we called it internally.
 */
export function DirectionSwitch({ current }: { current: "a" | "b" }) {
  const options = [
    { key: "a" as const, href: "/rebellion-a", label: "A" },
    { key: "b" as const, href: "/rebellion-b", label: "B" },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-px bg-ink/10 p-px backdrop-blur-sm">
      <span className="micro bg-bone/90 px-3 py-2.5 text-ink-mute">
        Direction
      </span>
      {options.map((option) => (
        <Link
          key={option.key}
          href={option.href}
          aria-current={option.key === current ? "page" : undefined}
          className={cn(
            "micro px-4 py-2.5 transition-colors duration-[var(--dur-micro)]",
            option.key === current
              ? "bg-oxblood text-bone"
              : "bg-bone/90 text-ink hover:bg-bone",
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
