import {
  CircleCheckBig,
  FileStack,
  Focus,
  Quote,
  UserRound,
} from "lucide-react";

export function EvidencePreview() {
  return (
    <div
      aria-label="Illustrative review trail from source package to reviewer decision"
      className="overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-2xl shadow-black/30"
      role="img"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-small font-medium">
          <span className="flex size-6 items-center justify-center rounded-md border border-accent/30 bg-accent-muted">
            <FileStack aria-hidden="true" className="size-3.5 text-citation" />
          </span>
          Illustrative review trail
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-label uppercase tracking-[0.06em] text-muted">
          Concept, not product UI
        </span>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-3">
        <section className="bg-bg p-5">
          <p className="m-0 flex items-center gap-2 text-label uppercase tracking-[0.08em] text-muted">
            <FileStack aria-hidden="true" className="size-3.5" />
            Source package
          </p>
          <div className="mt-4 space-y-2 text-small">
            <p className="m-0 rounded-lg border border-border bg-surface px-3 py-2 text-foreground">
              Review set
            </p>
            <p className="m-0 ml-4 rounded-lg border border-border bg-surface px-3 py-2 text-muted">
              Supporting material
            </p>
            <p className="m-0 ml-8 rounded-lg border border-accent/35 bg-accent-muted px-3 py-2 text-citation">
              Selected source
            </p>
          </div>
        </section>

        <section className="relative bg-bg p-5">
          <span
            aria-hidden="true"
            className="absolute -left-px top-1/2 hidden h-px w-5 -translate-x-1/2 bg-accent md:block"
          />
          <p className="m-0 flex items-center gap-2 text-label uppercase tracking-[0.08em] text-muted">
            <Focus aria-hidden="true" className="size-3.5" />
            Visible scope
          </p>
          <div className="mt-4 rounded-xl border border-accent/35 bg-accent-muted p-4">
            <p className="m-0 text-label uppercase tracking-[0.06em] text-citation/80">
              Review question
            </p>
            <p className="m-0 mt-2 text-body font-medium">
              What does this source establish?
            </p>
            <p className="m-0 mt-3 flex items-center gap-2 border-t border-accent/25 pt-3 text-small text-citation">
              <Quote aria-hidden="true" className="size-3.5" />
              One selected source
            </p>
          </div>
        </section>

        <section className="relative bg-bg p-5">
          <span
            aria-hidden="true"
            className="absolute -left-px top-1/2 hidden h-px w-5 -translate-x-1/2 bg-accent md:block"
          />
          <p className="m-0 flex items-center gap-2 text-label uppercase tracking-[0.08em] text-muted">
            <UserRound aria-hidden="true" className="size-3.5" />
            Reviewer decision
          </p>
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="m-0 text-small leading-relaxed text-muted">
              A review note stays beside the source reference that supports it.
            </p>
            <p className="m-0 mt-3 flex items-center gap-2 border-t border-border pt-3 text-small text-success">
              <CircleCheckBig aria-hidden="true" className="size-3.5" />
              Ready for human review
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
