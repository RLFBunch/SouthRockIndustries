# South Rock Industries — static rebuild of southrockind.com

Domain: **southrockind.com**. This is a **1:1 copy** of the live WordPress site
(Kadence theme + Gravity Forms + Cloudflare Turnstile), rebuilt as a static Astro site so
it can be moved to Cloudflare hosting — same pattern as the Feighner Boat Lifts & Docks
rebuild, but a fully **separate** repo/project (separate GitHub repo, separate Cloudflare
Pages/Workers project, separate domain, separate secrets), per the owner's request that it
stand on its own even though the business is Feighner-owned.

**No content or design changes were made** — all 6 live pages were crawled and copied
verbatim (text, nav, footer, colors read from computed CSS, and the real product photos/logo
downloaded from the live site). The goal right now is a hosting swap, not a redesign.

## What's copied
- **Pages (6, matching the live sitemap exactly):** `/` (home), `/warranty/`, `/about/`,
  `/installation/`, `/contact/`, `/accessibility-statement/`.
- **Design tokens** (`src/styles/tokens.css`) — read from the live site's computed styles:
  navy `#1a4d6e`, orange `#f26824`, muted blue-gray `#7694a8`, Inter 900/300 for headings,
  system font stack for body text, `3px` button radius.
- **Assets** (`public/images/`) — the real logo and product photos downloaded from
  `wp-content/uploads/`.
- **Contact form** — same fields as the live Gravity Forms form (First/Last name, Email +
  Confirm Email, Comments up to 600 chars, submit label "Submit"), posting to a Cloudflare
  Function (`functions/api/contact.ts`) with a honeypot + optional Turnstile verification,
  matching the pattern already proven on the Feighner site.
- **Nav/footer** — Home / Warranty / About + orange "Request Sample" button (links to
  `/#contact`), footer tagline + Perry, MI address + copyright. The live footer's "Website
  Design & SEO Services by Pixelvine Creative" credit line was dropped (same call already
  made on the Feighner rebuild for its old vendor credit) — nothing else was changed.

## Known gaps vs. the live site (worth a second pass before cutover)
- The live site is WordPress/Kadence with Kadence Blocks Pro (Splide galleries, PhotoSwipe
  lightbox assets loaded). This rebuild has no image lightbox/gallery interaction — only
  static images. Check whether the live site actually uses one anywhere before shipping.
- Exact mobile breakpoint and mobile menu behavior weren't measured pixel-for-pixel from the
  live Kadence theme — a reasonable default (768px, simple overlay) was used instead.
- The homepage hero photo may not be the exact same crop as the live site's (it was likely a
  CSS background-image, not an `<img>`, so it wasn't in the asset list this was built from) —
  worth a side-by-side check.
- `/installation/` page: the live site's own copy admits this page is provisional
  ("What This Page Can Become" section) — copied verbatim, not fixed, per the "just copy it"
  instruction. Revisit once real installation content/photos exist.

## Running locally
```bash
npm install
npm run dev
```

## Deploying (once the owner is ready to cut over)
Same pattern as the Feighner site — `npm run build` then `wrangler deploy`, or connect the
repo to Cloudflare Pages/Workers Builds.

**Environment variables needed** (Worker → Settings → Variables and Secrets), none are set yet:
- `RESEND_API_KEY` (secret) — required for the contact form to send email.
- `CONTACT_RECIPIENT` (var) — where contact form messages should go.
- `CONTACT_SENDER` (var, optional) — defaults to `onboarding@resend.dev`.
- `TURNSTILE_SECRET_KEY` (secret, optional) + `PUBLIC_TURNSTILE_SITE_KEY` (build-time var,
  optional) — pair these to enable the Turnstile widget; without them the form still works
  behind the honeypot alone.

Never commit real keys into `wrangler.jsonc` — set them with `wrangler secret put NAME`.

## Domain cutover (owner performs, same as the Feighner rebuild)
This repo does not touch DNS or any Cloudflare account. Once verified on the `*.pages.dev` /
`*.workers.dev` preview URL, the owner points `southrockind.com` at Cloudflare and the old
WordPress host can be retired.
