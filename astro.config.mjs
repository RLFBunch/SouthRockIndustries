// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://southrockind.com',
  trailingSlash: 'always',
  integrations: [sitemap({ changefreq: 'weekly', priority: 0.7 })],
});
