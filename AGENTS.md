# Contributor and agent guide

## Purpose

This repository owns the source and deployment checks for the public Sangrep
website. It does not own application code, product documentation, customer
data, releases, or product support.

## Public information boundary

Assume every branch, commit, Issue, pull request, review, workflow log,
artifact, document, and instruction can become permanently public. Work only
from repository-local public context. Do not include credentials, private
project context, customer material, non-public source locations, internal
schedules, private conversations, unpublished product behavior, or
unsupported claims.

## Start here

1. Read `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and the assigned
   public Issue.
2. Use the exact Node.js version in `.nvmrc` and run `npm ci`.
3. Keep the branch name, commits, and review text about website business only.
4. Use `docs/content-policy.md` for copy and media decisions.
5. Run the smallest affected check while iterating and `./scripts/check` on
   the frozen head.

## Repository map

- `src/` contains pages, components, tests, and design tokens.
- `public/brand/` contains approved digest-pinned brand assets.
- `scripts/` contains local, CI, public-boundary, and publication checks.
- `docs/` contains content and deployment policy.
- `.github/` contains contribution forms, ownership, and required CI.

## Commands

```sh
nvm use
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run format
npm run build
./scripts/check
```

## Working agreement

- Do not add source-tree imports, submodules, editable installs, or hidden
  cross-repository credentials.
- Do not add third-party text or media without public provenance and license
  classification.
- Do not hand-edit generated brand assets or `next-env.d.ts`.
- Keep the site static. A new data store, account flow, upload, analytics
  service, or external form requires a public Issue and privacy review.
- A concept illustration is not a product screenshot or capability proof.
- A preview is not a release, support, entitlement, or availability claim.
- Record exact tested and untested scope in each pull request.

## Documentation

Website implementation facts stay here. Product instructions and release
behavior belong in their canonical public documentation, not this repository.
