import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { META_PIXEL_ID } from "@/lib/analytics";
import { flags, reservations, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Rebellion Beachside Bar & Bistro collects on this website, who receives it, and how to opt out.",
};

/**
 * NEEDS LEGAL REVIEW BEFORE IT IS RELIED ON.
 *
 * This describes what the site actually does today — it was written against
 * the code, not from a template, and every claim in it is checkable:
 *
 *   - the Meta pixel and its events         lib/analytics.ts
 *   - the reservation hand-off              lib/site.ts, reservations
 *   - the private-event form                components/events/EventInquiryForm
 *   - no accounts, no payments, no shop     flags in lib/site.ts
 *
 * That accuracy is the part a template cannot give you, and it is the part
 * regulators care about. What it is not is legal advice, and it does not
 * attempt Florida's Digital Bill of Rights, CCPA/CPRA thresholds, or the
 * GDPR position if the client ever markets into the EU. A lawyer should read
 * it, and anyone changing what the site collects should change it here too.
 */

const updated = "August 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="display text-2xl md:text-[1.75rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

const link =
  "underline decoration-oxblood/50 underline-offset-4 transition-colors hover:decoration-oxblood";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="What we collect, and what we don't"
      intro="Plain terms. This page describes what actually happens when you use this website — not a template, and no longer than it needs to be."
      image="diningRoom"
    >
      <div className="mx-auto max-w-[68ch] px-6 py-16 md:px-10 md:py-20">
        <Reveal>
          <p className="text-[15px] leading-relaxed text-ink-mute">
            Last updated {updated}. This covers this website only. What happens
            in the restaurant — a reservation taken over the phone, a card
            processed at the table — is not what this page is about.
          </p>
        </Reveal>

        <Reveal>
          <Section title="The short version">
            <p>
              We do not ask you to make an account, and we do not sell anything
              on this site. The only information you actively give us is what
              you type into the private-events form. Beyond that, a Meta
              (Facebook) advertising pixel records which pages are visited so we
              can measure whether our advertising works.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="What you give us on purpose">
            <p>
              There is no contact form on this site. Planning a private event
              means emailing{" "}
              <a href={`mailto:${site.eventsEmail}`} className={link}>
                {site.eventsEmail}
              </a>{" "}
              or calling{" "}
              <a href={site.phoneHref} className={link}>
                {site.phone}
              </a>
              , so whatever you choose to put in that email is what we have. We
              use it to answer you about your event. We do not add you to a
              mailing list from it, and we do not sell it.
            </p>
            <p>
              The newsletter sign-up in the footer is separate, and only ever
              gets what you type into it.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="What is collected automatically">
            <p>
              This site loads an advertising pixel from Meta Platforms — the
              company behind Facebook and Instagram — with the identifier{" "}
              <span className="font-medium">{META_PIXEL_ID}</span>. It sets
              cookies and reports to Meta which pages you viewed here, together
              with your IP address, browser and device. Three things are
              reported: that a page was viewed, that someone started a
              reservation, and that someone opened the events email link. The
              contents
              of your email are not sent to Meta — clicking the address is what
              is reported, never what you write.
            </p>
            <p>
              We use it to see whether the advertising we pay for brings anyone
              in. Meta uses it for its own purposes as well, including building
              advertising audiences. Their handling is governed by{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                className={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Meta&rsquo;s privacy policy
              </a>
              , not this one.
            </p>
            <p>
              Our web host keeps ordinary server logs — the address requested,
              the time, an IP address — as essentially every web server does.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="How to turn it off">
            <p>
              Any of these work, and none of them stops you using the site:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                Turn on your browser&rsquo;s tracking protection. Firefox, Safari
                and Brave block this pixel by default; Chrome needs an
                extension.
              </li>
              <li>
                Use Global Privacy Control, which most privacy extensions send
                automatically.
              </li>
              <li>
                Adjust your{" "}
                <a
                  href="https://www.facebook.com/adpreferences/ad_settings"
                  className={link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Meta ad preferences
                </a>{" "}
                for what Meta does with it.
              </li>
              <li>Block cookies for this site in your browser settings.</li>
            </ul>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="Where you leave this site">
            <p>
              Booking a table hands you to{" "}
              <span className="capitalize">{reservations.platform}</span>, which
              is a separate company with its own privacy policy. Anything you
              enter there — name, contact details, card if they ask for one — is
              theirs, not ours. The same is true of any link that takes you to
              Instagram, Google Maps or elsewhere.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="What we don't do">
            <ul className="ml-5 list-disc space-y-2">
              <li>No accounts, no passwords.</li>
              <li>
                No payments are taken on this site
                {flags.bottleShop ? " except through the bottle shop's checkout" : ""}
                . We never see a card number here.
              </li>
              <li>We do not sell or rent personal information.</li>
              <li>
                We do not knowingly collect anything from children under 13.
              </li>
            </ul>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="Your choices">
            <p>
              Wherever you live, you can ask us what we hold about you, ask for
              it to be deleted, or ask us to stop using it — write to{" "}
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>{" "}
              and we will handle it. Some states, including California and
              Florida, give residents these rights formally; we would rather not
              make you find out whether yours does.
            </p>
          </Section>
        </Reveal>

        <Reveal>
          <Section title="Changes, and who to ask">
            <p>
              If we start collecting something new, this page changes first and
              the date at the top changes with it. Questions go to{" "}
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
              , or {site.address.street}, {site.address.city},{" "}
              {site.address.state} {site.address.zip}.
            </p>
            <p className="pt-2">
              <Link href="/visit" className={link}>
                Visit us
              </Link>{" "}
              ·{" "}
              <Link href="/" className={link}>
                Back to the site
              </Link>
            </p>
          </Section>
        </Reveal>
      </div>
    </PageShell>
  );
}
