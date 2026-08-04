// Cloudflare Worker entry (Workers + Static Assets deployment).
//
// The static site is served from ./dist via the ASSETS binding. This Worker only
// runs for /api/* (see `assets.run_worker_first` in wrangler.jsonc).

import { onRequestPost as contact } from '../functions/api/contact';

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  [key: string]: unknown;
}

type Handler = (ctx: { request: Request; env: Env }) => Promise<Response>;

const routes: Record<string, Handler> = {
  '/api/contact': contact,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';   // tolerate a trailing slash
    const handler = routes[path];
    if (handler) {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
      return handler({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
