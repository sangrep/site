import {
  CircleCheckBig,
  Focus,
  MessageSquareText,
  PackageOpen,
  Quote,
} from "lucide-react";
import Link from "next/link";

import { EvidencePreview } from "./evidence-preview";
import { Faq } from "./faq";
import { FeatureGrid } from "./feature-grid";
import { HeroBackdrop } from "./hero-backdrop";
import { Reveal } from "./reveal";
import { SangrepMark } from "./sangrep-mark";
import { WaitlistForm } from "./waitlist-form";

const STEPS = [
  {
    artifact: "review context",
    icon: MessageSquareText,
    title: "Start with context",
  },
  {
    artifact: "source package",
    icon: PackageOpen,
    title: "Preserve the package",
  },
  {
    artifact: "visible boundary",
    icon: Focus,
    title: "Choose the scope",
  },
  {
    accent: true,
    artifact: "source reference",
    icon: Quote,
    title: "Follow the source",
  },
  {
    accent: true,
    artifact: "reviewer decision",
    icon: CircleCheckBig,
    title: "Make the call",
  },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.15c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div
      className="dark min-h-screen select-none bg-bg font-sans text-foreground"
      data-slot="landing"
    >
      <a
        className="sr-only z-50 rounded-md bg-foreground px-3 py-2 text-bg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <Link
          aria-label="Sangrep home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <SangrepMark className="size-[22px]" />
          <span className="text-[1rem] font-bold tracking-[-0.03em]">
            sangrep
          </span>
        </Link>
        <nav aria-label="Landing" className="flex items-center gap-5">
          <a className="hidden text-small sm:inline" href="#principles">
            <span className="text-muted hover:text-foreground">Principles</span>
          </a>
          <a className="hidden text-small sm:inline" href="#approach">
            <span className="text-muted hover:text-foreground">Approach</span>
          </a>
          <a className="hidden text-small sm:inline" href="#faq">
            <span className="text-muted hover:text-foreground">FAQ</span>
          </a>
          <a
            className="rounded-full bg-foreground px-4 py-1.5 text-small font-medium"
            href="#join"
          >
            <span className="text-accent-foreground">Join research</span>
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden px-6 pt-16 text-center md:px-10 md:pt-20">
          <HeroBackdrop />
          <div className="relative">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-small text-muted">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              Early product research
            </p>
            <h1 className="mx-auto max-w-3xl text-[clamp(2.5rem,7vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              The whole package.{" "}
              <span className="bg-[linear-gradient(90deg,var(--accent),var(--info))] bg-clip-text text-transparent">
                Every answer traced.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              Document review breaks when a package is flattened into a chat
              window. Sangrep is exploring a different premise: keep the source
              set intact, make scope visible, and keep each review note
              connected to evidence.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-body font-medium leading-relaxed text-foreground/70">
              Built for people reviewing contracts, submissions, evidence
              bundles, due-diligence packages, and other document sets where
              missing one attachment matters.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-small leading-relaxed text-muted">
              This is a product direction, not a released application or a
              promise of product access.
            </p>
            <div className="mx-auto mt-7 max-w-md">
              <WaitlistForm />
            </div>
            <Reveal className="group relative isolate mx-auto mt-14 max-w-4xl">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-7 -z-10 h-44 w-[82%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_35%,var(--accent-muted),transparent_72%)] opacity-75 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[8%] right-[8%] top-px z-10 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] opacity-35"
              />
              <EvidencePreview />
            </Reveal>
          </div>
        </section>

        <FeatureGrid />

        <section
          className="border-t border-border px-6 py-16 md:px-10"
          id="approach"
        >
          <div className="mx-auto max-w-5xl">
            <p className="m-0 text-label uppercase tracking-[0.09em] text-muted">
              Review approach
            </p>
            <h2 className="m-0 mt-2 text-[1.375rem] font-medium tracking-[-0.01em]">
              A review loop, not a feature list
            </h2>
            <p className="m-0 mb-8 mt-2 max-w-2xl text-small leading-relaxed text-muted">
              The public direction is simple: evidence stays visible, the
              boundary of a question stays legible, and a person remains
              responsible for the decision.
            </p>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute left-[6%] right-[6%] top-[13px] hidden h-px bg-border md:block"
              />
              <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 md:grid-cols-5 md:text-center">
                {STEPS.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <li key={step.title}>
                      <span className="relative mx-auto mb-3 hidden size-7 items-center justify-center rounded-full border border-accent/30 bg-surface md:flex">
                        <StepIcon
                          aria-hidden="true"
                          className="size-3.5 text-citation"
                        />
                      </span>
                      <h3 className="m-0 text-h3 font-medium">{step.title}</h3>
                      <span
                        className={
                          step.accent
                            ? "mt-2 inline-block rounded-md border border-accent/30 bg-accent-muted px-2.5 py-1 text-small text-citation"
                            : "mt-2 inline-block rounded-md border border-border bg-surface px-2.5 py-1 text-small text-muted"
                        }
                      >
                        {step.artifact}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        <Faq />

        <section
          className="relative overflow-hidden border-t border-border px-6 py-20 text-center md:px-10"
          id="join"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-x-16 -bottom-28 h-60 bg-[radial-gradient(ellipse_at_50%_100%,var(--accent-muted),transparent_65%)]"
          />
          <div className="relative">
            <h2 className="m-0 text-[1.875rem] font-medium tracking-[-0.02em]">
              Help shape a more accountable review workflow
            </h2>
            <p className="m-0 mt-2.5 text-body text-muted">
              Join for occasional research and availability updates. This does
              not grant product access.
            </p>
            <div className="mx-auto mt-7 max-w-md">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border px-6 py-4 text-small text-muted md:px-10">
        <span>sangrep · © 2026</span>
        <span className="flex items-center gap-4">
          <a className="hover:text-foreground" href="/privacy">
            Privacy notice
          </a>
          <a className="hover:text-foreground" href="/terms">
            Website terms
          </a>
          <a
            aria-label="GitHub"
            href="https://github.com/sangrep/site"
            rel="noreferrer"
            target="_blank"
          >
            <GitHubIcon className="size-4 text-muted transition-colors hover:text-foreground" />
          </a>
        </span>
      </footer>
    </div>
  );
}
