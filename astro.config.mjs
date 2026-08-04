// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: confirm the real domain (see README.md) before deploying — this is a
// placeholder until it's verified with the owner.
export default defineConfig({
  site: 'https://example-south-rock-ind.com',
  trailingSlash: 'always',
  integrations: [sitemap({ changefreq: 'weekly', priority: 0.7 })],
});
