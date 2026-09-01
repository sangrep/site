import {
  CircleAlert,
  Focus,
  PackageOpen,
  Quote,
  UserRoundCheck,
} from "lucide-react";

const FOCUS_GRID =
  "[&>article]:transition-all [&>article]:duration-200 [&:hover>article]:opacity-50 [&>article:hover]:!opacity-100 [&>article:hover]:-translate-y-1 [&>article:hover]:border-accent/40";

const PRINCIPLES = [
  {
    body: "Review should preserve the relationship between a primary file and the material that travels with it.",
    detail: "source set · attachment · reference",
    icon: PackageOpen,
    title: "Keep the package intact",
  },
  {
    body: "A reviewer should be able to see what a question includes, what it excludes, and when that boundary changes.",
    detail: "included · excluded · unresolved",
    icon: Focus,
    title: "Make scope visible",
  },
  {
    body: "A citation should be a route back to evidence, not a decorative footnote or a request to trust a summary.",
    detail: "note → source reference",
    icon: Quote,
    title: "Treat citations as navigation",
  },
  {
    body: "Software can organize evidence and propose a next step. The consequential decision still belongs to a person.",
    detail: "proposal · review · decision",
    icon: UserRoundCheck,
    title: "Keep judgment human",
  },
  {
    body: "Missing, unreadable, or out-of-scope material should remain visible as a gap instead of disappearing from the answer.",
    detail: "known · unknown · needs review",
    icon: CircleAlert,
    title: "Show gaps plainly",
  },
];

export function FeatureGrid() {
  return (
    <section
      className="border-t border-border px-6 py-16 md:px-10"
      id="principles"
    >
      <div className="mx-auto max-w-5xl">
        <p className="m-0 text-label uppercase tracking-[0.09em] text-muted">
          Product principles
        </p>
        <h2 className="m-0 mt-2 text-[1.375rem] font-medium tracking-[-0.01em]">
          Review should stay connected to evidence
        </h2>
        <p className="m-0 mb-8 mt-2 max-w-2xl text-small leading-relaxed text-muted">
          These principles describe the public direction. They are not a list of
          released features or supported formats.
        </p>
        <div
          className={`grid gap-3.5 md:grid-cols-2 lg:grid-cols-6 ${FOCUS_GRID}`}
        >
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <article
                className={`flex flex-col rounded-xl border border-border bg-surface p-6 ${
                  index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                }`}
                key={principle.title}
              >
                <span className="mb-4 flex size-9 items-center justify-center rounded-lg border border-accent/30 bg-accent-muted">
                  <Icon aria-hidden="true" className="size-4.5 text-citation" />
                </span>
                <h3 className="m-0 text-h3 font-medium">{principle.title}</h3>
                <p className="m-0 mt-1.5 flex-1 text-small leading-relaxed text-muted">
                  {principle.body}
                </p>
                <p className="m-0 mt-5 border-t border-border pt-3 font-mono text-label text-citation">
                  {principle.detail}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
