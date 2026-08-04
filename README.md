# South Rock Ind. — site scaffold

Domain: **southrockind.com**. This is a fresh, **separate** repo/project — separate GitHub
repo, separate Cloudflare Pages/Workers project, separate domain, separate secrets from the
Feighner Boat Lifts & Docks site, per the owner's request that it stand on its own even
though the business is Feighner-owned. It reuses the same proven stack (Astro static site +
Cloudflare Worker + Pages-style Functions for forms) because that setup worked well on the
Feighner rebuild.

**Confirmed:** "South Rock" is the maintenance-free decking material also listed on the
Feighner site's dock pages (Beige/Grey options) — this is that same real product line/brand,
owned by Feighner, getting its own standalone site. Not an unrelated coincidence.

## Status: bare scaffold, not a real site yet
Nothing in here is real content yet. Open questions before this becomes a real site:

1. **Branding** — same visual identity as Feighner (blue `#005288` / orange `#f4661d`,
   Outfit font — see the main repo's `docs/DESIGN-TOKENS.md`) since it's owned by the same
   company, or a distinct look for the South Rock brand? `src/styles/tokens.css` currently
   has generic placeholder colors/fonts either way.
2. **What the site should cover** — is this a small brand/marketing site for the decking
   material (specs, color options, "used by Feighner docks"), or does South Rock Ind. sell/
   ship decking directly or wholesale to other dock manufacturers too? Determines whether
   this needs a product catalog, dealer/wholesale inquiry form, etc., or just a few pages.
3. **Contact/location** — same Charlotte/Perry/Gwinn locations and phone as Feighner, or
   separate contact info for South Rock Ind.?
4. **Forms** — recipient email + fields once the above is settled; nothing wired up yet
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
