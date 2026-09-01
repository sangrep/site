# Deployment and rollback

The site builds to static files in `out/` and uses Cloudflare Workers Static
Assets. A preview URL does not route production traffic and is not a product
release or support claim.

## Local production preview

```sh
nvm use
npm ci
npm run build
npm run preview:local
```

The local preview uses the named `preview` Wrangler environment and the
checked-in static output.

## Hosted preview

Before uploading:

1. Freeze the exact pull-request head.
2. Require `./scripts/check` and required CI on those bytes.
3. Resolve independent review findings.
4. Confirm the repository is still private and the preview copy is
   public-safe.

Then authenticate Wrangler through its normal secure credential flow and run:

```sh
npm run build
npm run preview:upload
```

This uploads a version to the route-free `sangrep-site-preview` Worker and
returns a versioned Cloudflare preview URL. It does not change the custom
domains in the production configuration. A maintainer creating that preview
Worker for the first time may run `npx wrangler deploy --env preview`; that
command targets only the named preview Worker.

Record the exact version identifier and inspect the preview on desktop and
mobile, including keyboard navigation, reduced motion, browser console,
headers, links, and the privacy and terms pages.

## Production gate

Production promotion remains blocked until all of these are true:

- exact-head independent review is accepted;
- required pull-request checks are green;
- the Cloudflare preview and complete hosted metadata audit pass;
- copyright, brand provenance, licensing, legal copy, and public information
  boundaries are accepted;
- production route and DNS state are captured for rollback; and
- the destination Issue explicitly accepts publication.

Immediately before promotion, record the current production deployment:

```sh
npx wrangler deployments status --json
npx wrangler deployments list --json
```

Keep those receipts outside git. Do not change DNS or custom-domain routes as
part of a routine static-content promotion.

## Rollback

Keep the prior production version identifier. If hosted checks fail after a
promotion, roll back immediately:

```sh
npx wrangler rollback <prior-version-id> --message "restore prior website version"
```

Then verify the home page, legal pages, security headers, and custom domains.
Cloudflare rollback changes the active Worker version; it does not restore
deleted bindings or altered DNS, so those must remain unchanged and separately
recorded.
