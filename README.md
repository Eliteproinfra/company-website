# Elite Pro Infraventure

A Next.js (App Router) + Tailwind CSS website for Elite Pro Infraventure, a real estate consultancy based in Gurgaon.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Pages: Home, About, Properties, Property Management, Contact.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (custom breakpoints/container matched to the design)
- `next/font` for self-hosted Montserrat / Playfair Display
- `@fortawesome/fontawesome-free` for icons (bundled locally, no CDN)
- All images served locally from `public/images`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase
- `npm run typecheck` — `next typegen` then `tsc --noEmit`
- `npm run test` — unit tests
- `npm run verify` — lint, typecheck, test and build, i.e. what CI runs

Database scripts (`db:up`, `db:migrate`, `db:seed`, …) are listed in
`package.json`; see `deploy/AWS.md` for how they run in a deploy.

## Tests

`npm test` runs Node's own test runner — no test framework is installed, which
matches the rest of the project's dependency budget (scrypt over bcrypt, no
sanitiser library). TypeScript runs directly through
`--experimental-transform-types`, and `scripts/alias-register.mjs` — already
needed by `db:seed` — resolves the `@/` alias for plain `node`.

```bash
npm test                                   # everything
node --experimental-transform-types --import ./scripts/alias-register.mjs \
  --test tests/sanitize.test.ts            # one file
```

Coverage is deliberately narrow: pure functions where a silent regression would
be expensive and a test is cheap.

- `tests/sanitize.test.ts` — the HTML allowlist, written as attacks. CMS bodies
  are rendered with `dangerouslySetInnerHTML`, so this is the project's most
  security-critical pure function.
- `tests/auth.test.ts` — scrypt round-trip, and that a malformed stored hash
  denies access rather than throwing (a corrupt row must not 500 the login).
- `tests/slug.test.ts` — the slug rules, including that `sanitizeSlug` is a
  no-op on clean input (otherwise `proxy.ts` redirect-loops) and that it agrees
  with the repair migration in `schema.sql`.
- `tests/forms.test.ts` — per-country phone validation, the shared server-side
  validators, and that `lib/forms/submitEnquiry.ts` never shows a visitor a
  JSON parse error when an error response is HTML.

Anything needing MySQL, SMTP or a browser is **not** covered here; those are
verified against a running stack.
