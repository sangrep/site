"use client";

import { useId, useState, type FormEvent } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;

// Interest-capture Google Form. Only the email question is required, so a
// partial POST records the signup; the follow-up link carries the rest.
const FORM_ID = "1FAIpQLSccYOjrsi5PfnJGFvxavOZRf4UyNxeKimlB-WhzEJDeX2ScUg";
const FORM_BASE = `https://docs.google.com/forms/d/e/${FORM_ID}`;
const EMAIL_ENTRY = "entry.1016929436";
const SUBMIT_COOLDOWN_MS = 30_000;
const THROTTLE_KEY = "sangrep-waitlist-submitted-at";

function throttled(): boolean {
  try {
    const last = Number(window.localStorage.getItem(THROTTLE_KEY) ?? 0);
    return Date.now() - last < SUBMIT_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function recordSubmit() {
  try {
    window.localStorage.setItem(THROTTLE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode); the cooldown is best-effort.
  }
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  if (state === "success") {
    const followUp = `${FORM_BASE}/viewform?usp=pp_url&${EMAIL_ENTRY}=${encodeURIComponent(email)}`;
    return (
      <div data-slot="waitlist-success" role="status">
        <p className="m-0 text-body font-medium text-foreground">
          You&apos;re on the research list.
        </p>
        <p className="m-0 mt-1.5 text-small text-muted">
          Two spare minutes?{" "}
          <a
            className="text-citation underline-offset-2 hover:underline"
            href={followUp}
            rel="noreferrer"
            target="_blank"
          >
            Tell us about your document packages
          </a>{" "}
          and help us build the right thing first.
        </p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed) || trimmed.length > EMAIL_MAX_LENGTH) {
      setState("error");
      setError("Enter a valid email address.");
      return;
    }
    // Bots that fill the hidden field or hammer the form get a quiet
    // "success" without a recorded response.
    if (honeypot || throttled()) {
      setState("success");
      return;
    }
    setState("submitting");
    setError(null);
    try {
      const body = new URLSearchParams({ [EMAIL_ENTRY]: trimmed });
      // Google Forms doesn't send CORS headers; an opaque no-cors POST is
      // the standard static-site pattern, so a network error is the only
      // observable failure.
      await fetch(`${FORM_BASE}/formResponse`, {
        body,
        method: "POST",
        mode: "no-cors",
      });
      recordSubmit();
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Your email is still here, try again.");
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      data-slot="waitlist-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2.5">
        <label className="sr-only" htmlFor={emailId}>
          Email
        </label>
        <input
          autoComplete="email"
          className="h-11 min-w-0 flex-1 select-text rounded-lg border border-border bg-surface px-3.5 text-body text-foreground placeholder:text-muted"
          id={emailId}
          maxLength={EMAIL_MAX_LENGTH}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
          type="email"
          value={email}
        />
        <input
          aria-hidden="true"
          autoComplete="off"
          className="sr-only"
          name="website"
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          type="text"
          value={honeypot}
        />
        <button
          className="h-11 shrink-0 rounded-lg bg-accent px-4 text-body font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={state === "submitting"}
          type="submit"
        >
          {state === "submitting" ? "Joining…" : "Join the research list"}
        </button>
      </div>
      {error ? (
        <p className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
