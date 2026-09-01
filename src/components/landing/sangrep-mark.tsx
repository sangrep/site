/**
 * The sangrep mark: an outline view of a document tree, with the single
 * teal bar as the one resolved node. Canonical geometry and rationale live
 * in brand/README.md; regenerate static assets with brand/generate.py.
 *
 * Bars bind to the surface's theme tokens (root -> text, nodes -> accent,
 * resolved -> ok) so the mark follows the theme without variants.
 */
export function SangrepMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="var(--text)" height="5" rx="2.5" width="22" x="14" y="8" />
      <rect fill="var(--accent)" height="5" rx="2.5" width="18" x="6" y="16" />
      <rect fill="var(--ok)" height="5" rx="2.5" width="11" x="14" y="24" />
      <rect fill="var(--accent)" height="5" rx="2.5" width="18" x="6" y="32" />
    </svg>
  );
}
