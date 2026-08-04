// Cloudflare Pages-style Function: handles the South Rock contact form, emailing
// it via Resend.
//
// Env (Cloudflare Worker → Settings → Variables and Secrets):
//   RESEND_API_KEY        (secret, required)
//   CONTACT_RECIPIENT     (var, required) — where messages go
//   CONTACT_SENDER        (var, optional) — default onboarding@resend.dev
//   TURNSTILE_SECRET_KEY  (secret, optional) — when set, the Turnstile token is verified.
//                                              If unset, Turnstile is skipped (honeypot still applies).

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

async function turnstileOk(env: any, token: unknown, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  try {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET_KEY);
    body.append('response', String(token));
    if (ip) body.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out: any = await r.json();
    return !!out.success;
  } catch {
    return false;
  }
}

function reply(isJson: boolean, ok: boolean, message: string, status = ok ? 200 : 400) {
  if (isJson) return new Response(JSON.stringify({ ok, error: ok ? undefined : message }), { status, headers: { 'content-type': 'application/json' } });
  return new Response(`<!doctype html><meta charset="utf-8"><title>${ok ? 'Thank you' : 'Error'}</title><body style="font-family:Arial;padding:3rem;text-align:center"><h1>${ok ? 'Thank you!' : 'Something went wrong'}</h1><p>${esc(message)}</p><p><a href="/">Return home</a></p></body>`, { status, headers: { 'content-type': 'text/html' } });
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  const isJson = (request.headers.get('content-type') || '').includes('application/json');
  let d: any = {};
  try {
    if (isJson) d = await request.json();
    else { const fd = await request.formData(); fd.forEach((v: any, k: string) => (d[k] = v)); }
  } catch { return reply(isJson, false, 'Bad request.'); }

  if (d.company_url) return reply(isJson, true, 'Received.');   // honeypot → silently accept
  if (!(await turnstileOk(env, d['cf-turnstile-response'], request.headers.get('CF-Connecting-IP'))))
    return reply(isJson, false, 'Please complete the verification and try again.', 403);

  const name = [d.first_name, d.last_name].filter(Boolean).join(' ').trim();
  if (!name || !d.email || !d.comments) return reply(isJson, false, 'Please fill in your name, email, and comments.');
  if (d.email_confirm && d.email !== d.email_confirm) return reply(isJson, false, 'Email addresses do not match.');
  if (!env.RESEND_API_KEY) return reply(isJson, false, 'Email is not configured yet.', 503);
  if (!env.CONTACT_RECIPIENT) return reply(isJson, false, 'Recipient is not configured yet.', 503);

  const to = env.CONTACT_RECIPIENT;
  const from = env.CONTACT_SENDER || 'South Rock Industries <onboarding@resend.dev>';
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
      <h2 style="color:#1a4d6e">New website contact message</h2>
      <p><strong>Name:</strong> ${esc(name)}<br>
         <strong>Email:</strong> ${esc(d.email)}</p>
      <p><strong>Comments:</strong><br>${esc(d.comments)}</p>
    </div>`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: d.email, subject: `South Rock website contact — ${name}`, html }),
  });
  if (!send.ok) return reply(isJson, false, 'Could not send your message. Please call 517-914-3555.', 502);
  return reply(isJson, true, 'Your message has been sent — we’ll be in touch shortly.');
};
