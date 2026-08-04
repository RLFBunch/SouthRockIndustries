# South Rock Ind. — site scaffold

This is a fresh, **separate** repo/project — not connected to the Feighner Boat Lifts &
Docks site or account in any way (separate GitHub repo, separate Cloudflare Pages/Workers
project, separate domain, separate secrets). It reuses the same proven stack (Astro static
site + Cloudflare Worker + Pages-style Functions for forms) because that setup worked well
on the Feighner rebuild, but none of the actual content, branding, or data is shared.

## Status: bare scaffold, not a real site yet
Nothing in here is real content. Before this goes live, the following need answers:

1. **Exact domain** — is it `soutrockind.com` or `southrockind.com`? `astro.config.mjs`
   currently has a placeholder (`example-south-rock-ind.com`) until this is confirmed.
2. **What the business does** — no content has been written because none of the business's
   actual products/services/copy have been provided yet.
3. **Branding** — `src/styles/tokens.css` has placeholder colors/fonts (a generic blue
   accent, system fonts). Replace with the real logo, brand colors, and fonts once supplied.
4. **Relationship to Feighner Boat Lifts & Docks** — "South Rock" is also the name of one of
   Feighner's maintenance-free decking materials. Worth confirming whether this is a genuinely
   unrelated business or connected in some way (e.g. a decking supplier), since that would
   change whether anything should cross-reference the other site.
5. **Forms/contact** — recipient email + any form fields needed; nothing is wired up yet
   (`worker/index.ts` has no routes registered).

## Structure
Mirrors the Feighner repo's layout so it's a familiar starting point:
```
src/
  layouts/Base.astro     — bare HTML shell, no header/footer/nav yet
  pages/index.astro      — placeholder homepage
  styles/tokens.css      — PLACEHOLDER design tokens, not real branding
  components/, data/      — empty, ready for real content
functions/api/            — empty, ready for form handlers
worker/index.ts           — Cloudflare Worker entry, no routes registered yet
wrangler.jsonc            — Cloudflare config, placeholder project name
```

## Running locally
```bash
npm install
npm run dev
```

## Deploying (once real content + domain are in place)
Same pattern as the Feighner site: `npm run build` then `wrangler deploy` (or connect the
repo to Cloudflare Pages/Workers Builds). Set secrets with `wrangler secret put NAME` —
never commit real API keys or recipient emails into `wrangler.jsonc`.
