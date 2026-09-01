import Link from "next/link";

import { SangrepMark } from "@/components/landing/sangrep-mark";

export default function NotFound() {
  return (
    <div className="dark flex min-h-screen flex-col bg-bg font-sans text-foreground">
      <header className="border-b border-border px-6 py-4 md:px-10">
        <Link
          aria-label="Sangrep home"
          className="inline-flex items-center gap-2.5"
          href="/"
        >
          <SangrepMark className="size-[22px]" />
          <span className="text-[1rem] font-bold tracking-[-0.03em]">
            sangrep
          </span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-lg text-center">
          <p className="m-0 font-mono text-label uppercase tracking-[0.09em] text-citation">
            404 · evidence gap
          </p>
          <h1 className="m-0 mt-3 text-[2.25rem] font-medium tracking-[-0.025em]">
            Page not found
          </h1>
          <p className="m-0 mt-3 text-body leading-relaxed text-muted">
            There is no public website page at this address.
          </p>
          <Link
            className="mt-7 inline-flex rounded-lg bg-accent px-4 py-2.5 text-body font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
            href="/"
          >
            Return to Sangrep
          </Link>
        </div>
      </main>
    </div>
  );
}
