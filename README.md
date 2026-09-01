<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/sangrep-lockup-dark.svg">
    <img src="public/brand/sangrep-lockup.svg" alt="Sangrep" height="48">
  </picture>
</p>

# Sangrep site

The source for [sangrep.com](https://sangrep.com): an early public look at a
document-review product direction where source structure, scope, citations,
and human judgment stay connected.

[![Repository check](https://github.com/sangrep/site/actions/workflows/check.yml/badge.svg)](https://github.com/sangrep/site/actions/workflows/check.yml)
[![License: Apache-2.0 plus reserved brand content](https://img.shields.io/badge/license-Apache--2.0%20%2B%20reserved%20brand-5b55c9)](LICENSE)

> [!IMPORTANT]
> This website is not a Sangrep Workbench release, product-support statement,
> supported-format claim, trial, or entitlement. Its interface illustration is
> a concept, not a product screenshot.

## Start here

- [Run the site locally](#local-quickstart)
- [Understand deployment and rollback](docs/deployment.md)
- [Read the public content boundary](docs/content-policy.md)
- [Contribute](CONTRIBUTING.md)
- [Report a vulnerability privately](SECURITY.md)
- [Ask a public repository question](SUPPORT.md)

## What this repository is

This repository owns one static Next.js website, its approved first-party
brand assets, and the checks needed to publish that site safely. It produces a
static export in `out/` for Cloudflare Workers static assets.

It does not own application source, product documentation, authentication,
customer data, product releases, or product support.

## Local quickstart

Use the exact Node.js version in `.nvmrc`:

```sh
nvm use
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the production-style
static preview:

```sh
npm run build
npm run preview:local
```

The one preliminary gate is:

```sh
./scripts/check
```

It runs unit tests, type checking, linting, formatting, a production build,
browser accessibility checks, local-link and anchor checks, alt-text and media
checks, dependency and file-license coverage, secret scanning, and the public
information boundary.

## Repository map

| Path                                           | Purpose                                           |
| ---------------------------------------------- | ------------------------------------------------- |
| [`src/`](src/README.md)                        | Page source, components, tests, and design tokens |
| [`public/brand/`](public/brand/README.md)      | Approved brand assets and digest provenance       |
| [`scripts/`](scripts/README.md)                | One public-safe local and CI verification surface |
| [`docs/`](docs/README.md)                      | Deployment, rollback, and content policy          |
| [`.github/`](.github/PULL_REQUEST_TEMPLATE.md) | Contribution forms, ownership, and required CI    |

## Deployment boundary

`npm run preview:upload` creates a Cloudflare version preview without
routing production traffic. Production routing remains a separate maintainer
action with prepublication review, hosted-metadata audit, explicit acceptance,
and rollback evidence. See [deployment.md](docs/deployment.md).

## Licensing

Website code is licensed under [Apache-2.0](LICENSE).
Sangrep names, logos, marketing copy, and designated brand artwork are
[reserved brand content](LICENSES/LicenseRef-Sangrep-Brand-Content.txt).
The machine-readable classification is
[`LICENSES/license-map.json`](LICENSES/license-map.json), trademark terms are
in [TRADEMARKS.md](TRADEMARKS.md), and third-party notices are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
