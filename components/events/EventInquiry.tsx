"use client";

import { useEffect, useId, useState } from "react";
import { track } from "@/lib/analytics";
import { eventPackages, occasions, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Netlify detects this at deploy time by name; renaming it orphans the inbox. */
const FORM_NAME = "private-event";

const fieldCls =
  "w-full border border-ink/20 bg-paper px-4 py-3 text-sm text-ink " +
  "placeholder:text-ink-mute/60 focus:border-oxblood focus:outline-none " +
  "focus:ring-1 focus:ring-oxblood/30";
const labelCls = "micro mb-2 block text-ink-mute";

/** Nobody books last night; the picker should not offer it. */
function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

/** The enquiry as a pre-written email, for when the POST does not land. */
function mailtoFrom(data: FormData) {
  const get = (k: string) => String(data.get(k) ?? "").trim();
  const lines = [
    ["Format", get("format")],
    ["Date", get("date")],
    ["Guests", get("guests")],
    ["Occasion", get("occasion")],
    ["Name", get("name")],
    ["Email", get("email")],
    ["Phone", get("phone")],
    ["Notes", get("notes")],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return (
    `mailto:${site.eventsEmail}` +
    `?subject=${encodeURIComponent("Private event enquiry")}` +
    `&body=${encodeURIComponent(lines)}`
  );
}

/**
 * The private-event enquiry.
 *
 * This one actually goes somewhere. The form it replaces had no backend — it
 * showed a confirmation and dropped what you typed — which is why it was pulled
 * and an email address put in its place. Netlify captures submissions at the
 * host, so a static export can still take an enquiry: the markup is detected at
 * deploy time by its `name`, and the POST goes back to the site's own origin.
 *
 * Picking a package first is the point of it. Michelle's reply to an enquiry is
 * always the same three options and a question about the date, so asking here
 * means her first reply can be the proposal rather than the questionnaire.
 */
export function EventInquiry() {
  const [picked, setPicked] = useState<string>(eventPackages[1].id);
  // Set on mount, not at render: this page is prerendered, so a build-time
  // "today" ships stale and disagrees with the browser on hydration. An empty
  // min is ignored, so the field is simply unconstrained for that first frame.
  const [minDate, setMinDate] = useState("");
  useEffect(() => setMinDate(today()), []);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  /** Built when a POST fails, so a guest's typing survives the failure. */
  const [rescue, setRescue] = useState("");
  const formId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("Lead", "private_event_inquiry", { form: "netlify", package: picked });
      setState("sent");
      form.reset();
    } catch {
      // Never swallow it: a dropped enquiry the guest thinks was sent is worse
      // than no form, which is the mistake this page already made once. The
      // fallback hands them the same details as a pre-written email rather than
      // an apology and an empty box — it is also what keeps this form useful if
      // form capture is ever switched off at the host.
      setRescue(mailtoFrom(data));
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-ink/15 bg-paper p-8 md:p-10">
        <p className="micro text-oxblood">Enquiry sent</p>
        <h3 className="display-soft mt-4 text-[clamp(1.35rem,2.6vw,1.9rem)]">
          We have it.
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Michelle will come back to you by the end of the next business day with
          availability and a proposal. If your date is tight, call{" "}
          <a href={site.phoneHref} className="font-semibold text-oxblood underline underline-offset-4">
            {site.phone}
          </a>{" "}
          and say so.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/15 bg-paper p-8 md:p-10">
      <form
        name={FORM_NAME}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
      >
        {/* Netlify needs the form's name in the body of a scripted POST. */}
        <input type="hidden" name="form-name" value={FORM_NAME} />
        <p className="hidden">
          <label>
            Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <fieldset>
          <legend className={labelCls}>Which format?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {eventPackages.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "cursor-pointer border px-4 py-3 text-sm transition-colors",
                  picked === p.id
                    ? "border-oxblood bg-oxblood text-bone"
                    : "border-ink/20 hover:border-ink/50",
                )}
              >
                <input
                  type="radio"
                  name="format"
                  value={p.name}
                  checked={picked === p.id}
                  onChange={() => setPicked(p.id)}
                  className="sr-only"
                />
                {p.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor={`${formId}-date`}>
              Preferred date
            </label>
            <input
              id={`${formId}-date`}
              className={fieldCls}
              type="date"
              name="date"
              min={minDate || undefined}
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${formId}-guests`}>
              Guests
            </label>
            <input
              id={`${formId}-guests`}
              className={fieldCls}
              type="number"
              name="guests"
              min={8}
              max={150}
              placeholder="30"
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${formId}-name`}>
              Your name
            </label>
            <input id={`${formId}-name`} className={fieldCls} name="name" required />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${formId}-occasion`}>
              Occasion
            </label>
            <select id={`${formId}-occasion`} className={fieldCls} name="occasion" defaultValue="">
              <option value="">Tell us later</option>
              {occasions.map((o) => (
                <option key={o.title} value={o.title}>
                  {o.title}
                </option>
              ))}
              <option value="Something else">Something else</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              className={fieldCls}
              type="email"
              name="email"
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${formId}-phone`}>
              Phone
            </label>
            <input id={`${formId}-phone`} className={fieldCls} type="tel" name="phone" />
          </div>
        </div>

        <div className="mt-5">
          <label className={labelCls} htmlFor={`${formId}-notes`}>
            Anything else
          </label>
          <textarea
            id={`${formId}-notes`}
            className={cn(fieldCls, "min-h-[110px] resize-y")}
            name="notes"
            placeholder="Timing, dietary needs, whether the date can move — anything that changes what we can offer."
          />
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          className="micro mt-7 w-full bg-oxblood px-8 py-4 text-bone transition-colors duration-[var(--dur-micro)] hover:bg-[#8d343d] disabled:opacity-60 sm:w-auto"
        >
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>

        {state === "error" ? (
          <div className="mt-5 border border-oxblood/40 bg-oxblood/5 p-5" role="alert">
            <p className="text-sm font-semibold text-oxblood">
              That did not send — please do not assume we got it.
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Nothing you typed is lost. This opens the same details as an email,
              ready to send.
            </p>
            <a
              href={rescue}
              className="micro mt-4 inline-block bg-oxblood px-6 py-3 text-bone"
              onClick={() =>
                track("Lead", "private_event_inquiry", { form: "mailto-fallback" })
              }
            >
              Send it as an email
            </a>
            <p className="mt-3 text-sm text-ink-mute">
              Or call{" "}
              <a href={site.phoneHref} className="font-semibold text-oxblood underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          </div>
        ) : null}

        <p className="mt-5 text-xs leading-relaxed text-ink-mute">
          We use what you send here to answer your enquiry and nothing else.
        </p>
      </form>
    </div>
  );
}
