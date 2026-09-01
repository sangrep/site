"use client";

import { useId } from "react";

const EMAIL_MAX_LENGTH = 254;
const FORM_ID = "1FAIpQLSccYOjrsi5PfnJGFvxavOZRf4UyNxeKimlB-WhzEJDeX2ScUg";
const FORM_VIEW_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
const EMAIL_ENTRY = "entry.1016929436";

export function WaitlistForm() {
  const emailId = useId();

  return (
    <form
      action={FORM_VIEW_URL}
      className="flex flex-col gap-2"
      data-slot="waitlist-form"
      method="get"
      rel="noreferrer"
      target="_blank"
    >
      <input name="usp" type="hidden" value="pp_url" />
      <div className="flex gap-2.5">
        <label className="sr-only" htmlFor={emailId}>
          Email
        </label>
        <input
          autoComplete="email"
          className="h-11 min-w-0 flex-1 select-text rounded-lg border border-border bg-surface px-3.5 text-body text-foreground placeholder:text-muted"
          id={emailId}
          maxLength={EMAIL_MAX_LENGTH}
          name={EMAIL_ENTRY}
          placeholder="name@company.com"
          required
          type="email"
        />
        <button
          className="h-11 shrink-0 rounded-lg bg-accent px-4 text-body font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
          type="submit"
        >
          Continue to Google Form
        </button>
      </div>
      <p className="m-0 text-small text-muted">
        You’ll review and submit your details on Google Forms.
      </p>
    </form>
  );
}
