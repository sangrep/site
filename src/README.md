# Website source

`src/` owns the static Next.js pages, landing components, tests, and design
tokens for sangrep.com.

- `app/` defines routes, metadata, legal pages, and the generated social
  image.
- `components/` contains focused site components and their behavior tests.
- `styles/` contains the Graphite token system.
- `lib/` contains small website-only helpers.

Source may depend on packages in `package.json`; it may not import another
repository or require application credentials. Product copy follows
[`docs/content-policy.md`](../docs/content-policy.md).

Run `npm test`, `npm run typecheck`, and `npm run build` while working in
this area. The complete preliminary gate remains `./scripts/check`.
