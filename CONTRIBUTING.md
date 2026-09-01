# Contributing

Thank you for helping improve the Sangrep website.

## Before you start

Small copy fixes, tests, accessibility improvements, and focused website bugs
may go directly to a pull request. New data collection, third-party media,
tracking, deployment behavior, licensing, security policy, or major design
changes start with a self-contained public Issue and maintainer approval.
Security findings follow [SECURITY.md](SECURITY.md), never a public Issue.

Every public artifact must stay about website business. Do not include
credentials, customer material, private project context, non-public source
locations, internal schedules, private conversations, or unsupported product
claims.

## Local setup

```sh
nvm use
npm ci
npm run dev
```

The exact runtime is in `.nvmrc`. The production-style local preview is:

```sh
npm run build
npm run preview:local
```

## Verification

Run focused checks while iterating. Before opening or updating a pull request:

```sh
./scripts/check
```

The pull request must list exact checks and results, untested scope, known
limitations, and security, privacy, license, content, or deployment effects.

## Commits and pull requests

- Use a public-safe branch name and conventional commit form:
  `type(scope): summary`.
- Link only public Issues or Discussions from public pull requests.
- Keep each change focused and reversible.
- Sign off commits with `git commit -s` to certify the Developer Certificate
  of Origin.
- Do not publish a preview URL until its content passes the same public
  boundary as the repository.

## Licensing

Code contributions are accepted under Apache-2.0. Marketing copy, Sangrep
names and logos, and designated brand artwork remain
LicenseRef-Sangrep-Brand-Content. A contribution must not add third-party
material without exact provenance, redistribution permission, and an updated
license classification.
