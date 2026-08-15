import Link from "next/link";
import { Facebook, Instagram, MapPin, Plus } from "lucide-react";
import { hours, site } from "@/lib/site";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Note, TornEdge } from "@/components/collage/kit";
import { cn } from "@/lib/utils";

/** The wine ring a glass left on the page. */
function WineRing({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("art-mask absolute text-oxblood", className)}
      style={{
        WebkitMaskImage: "url(/artwork/wine-ring.png)",
        maskImage: "url(/artwork/wine-ring.png)",
        opacity: 0.28,
      }}
    />
  );
}

/**
 * Collage footer — paper rather than ink, so the page ends where it began.
 */
export function FooterCollage() {
  return (
    <footer className="paper-grain relative overflow-hidden bg-bone text-ink">
      <TornEdge edge="top" className="text-bone" />
      <WineRing className="right-[6%] -bottom-16 h-64 w-64" />

      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1.1fr_1fr_0.8fr_1.3fr_auto] lg:gap-12">
        <div>
          <h2 className="micro mb-4 flex items-center gap-2 text-oxblood">
            <MapPin size={14} aria-hidden /> Location
          </h2>
          <address className="text-sm leading-relaxed text-ink-mute not-italic">
            <a href={site.mapUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </a>
            <br />
            <a href={site.phoneHref} className="mt-2 inline-block font-semibold text-ink">
              {site.phone}
            </a>
          </address>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="micro mt-4 inline-flex items-center gap-2 text-oxblood"
          >
            <span className="border-b border-oxblood/40 pb-1">Get directions</span>
            <span aria-hidden>→</span>
          </a>
        </div>

        <div>
          <h2 className="micro mb-4">Hours</h2>
          <dl className="space-y-1.5 text-sm text-ink-mute">
            {hours.map((h) => (
              <div key={h.days} className="flex gap-5">
                <dt className="w-24 shrink-0">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="micro mb-4">Follow Us</h2>
          <div className="flex gap-2">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: Instagram },
              { href: site.social.facebook, label: "Facebook", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center border border-ink/25 transition-colors duration-[var(--dur-micro)] hover:bg-ink hover:text-bone"
              >
                <span className="sr-only">{label}</span>
                <Icon size={16} aria-hidden />
              </a>
            ))}
            <Link
              href="/happenings"
              className="inline-flex h-9 w-9 items-center justify-center border border-ink/25 transition-colors duration-[var(--dur-micro)] hover:bg-ink hover:text-bone"
            >
              <span className="sr-only">More ways to keep up</span>
              <Plus size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="micro mb-4">News &amp; Updates</h2>
          <p className="mb-3 text-sm text-ink-mute">Be the first to know.</p>
          {/* The form is written for a dark ground; on paper it needs ink. */}
          <div className="[&_button]:text-ink-mute [&_form]:border-ink/30 [&_input]:text-ink [&_input]:placeholder:text-ink-mute/60">
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 lg:pt-8">
          <Link
            href={site.reserveUrl}
            className="micro inline-flex w-full items-center justify-center border border-oxblood px-10 py-5 text-oxblood transition-colors duration-[var(--dur-micro)] hover:bg-oxblood hover:text-bone lg:w-auto"
          >
            Reserve a table
          </Link>
          <Note tilt={-8} size="lg" className="self-end">
            See you soon!
          </Note>
        </div>
      </div>

      <div className="relative border-t border-ink/12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-6 py-6 text-xs text-ink-mute md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            © {new Date().getFullYear()} {site.parent}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/visit" className="hover:text-ink">
              Accessibility
            </Link>
            <Link href="/visit" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/bottle-shop" className="hover:text-ink">
              Delivery policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
