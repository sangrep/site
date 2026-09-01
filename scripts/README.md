# Verification scripts

`./scripts/check` is the one preliminary gate for local work and required
CI. It composes small, independently runnable checks:

- `check-public-boundary` scans branch, index, working output, commits, and
  pull-request context without printing matched sensitive text.
- `check-gitleaks` runs a pinned, digest-verified secret scanner.
- `check-claims`, `check-headers`, `check-links`, `check-media`, and
  `check-license` enforce website-specific policy.
- `check-accessibility` runs axe in a real browser against the static build
  at desktop and mobile sizes.
- `audit-public-hosted-metadata` is the fail-closed prepublication GitHub
  inventory. It is not part of routine pull-request CI.

Run a focused script while iterating, then run `./scripts/check` once on the
frozen head. Scripts emit public-safe categories and suppress raw command
diagnostics in CI; rerun the named underlying command locally for full detail.
