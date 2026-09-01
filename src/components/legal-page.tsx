import Link from "next/link";
import type { ReactNode } from "react";

import { SangrepMark } from "./landing/sangrep-mark";

export function LegalSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="mt-8">
      <h2 className="m-0 text-h2 font-medium">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 text-body leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({
  children,
  title,
  updated,
}: {
  children: ReactNode;
  title: string;
  updated: string;
}) {
  return (
    <div className="dark min-h-screen bg-bg font-sans text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <Link
          aria-label="Sangrep home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <SangrepMark className="size-[22px]" />
          <span className="text-[1rem] font-bold tracking-[-0.03em] text-foreground">
            sangrep
          </span>
        </Link>
        <Link className="text-small text-muted hover:text-foreground" href="/">
          Back to site
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="m-0 text-[2rem] font-medium tracking-[-0.02em]">
          {title}
        </h1>
        <p className="m-0 mt-2 text-small text-muted">
          Last updated: {updated}
        </p>
        {children}
      </main>
      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border px-6 py-4 text-small text-muted md:px-10">
        <span>sangrep · © 2026</span>
        <span className="flex items-center gap-4">
          <Link className="hover:text-foreground" href="/privacy">
            Privacy notice
          </Link>
          <Link className="hover:text-foreground" href="/terms">
            Website terms
          </Link>
        </span>
      </footer>
    </div>
  );
}
