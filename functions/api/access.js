/**
 * POST /api/access — viewer access log.
 *
 * Cloudflare Pages Function. Lives at functions/api/access.js, which Pages
 * maps to /api/access automatically. No build step; deployed as-is.
 *
 * Why a function rather than posting to Google from the page:
 *   - the client IP is only visible server-side (CF-Connecting-IP)
 *   - the browser talks to our own origin, so the page still makes zero
 *     external requests and the webhook URL never appears in page source
 *   - junk can be rejected before it reaches the Sheet
 *
 * Requires one Cloudflare environment variable:
 *   SHEETS_WEBHOOK_URL    the Apps Script /exec URL
 * Optional:
 *   SHEETS_WEBHOOK_TOKEN  shared secret, checked by the Apps Script
 *
 * If the variable is missing or Google is unreachable this still returns 204.
 * Logging must never be able to block someone entering the prototype.
 */

const MAX_FIELD = 200;

// Control characters, so nothing can forge a row break inside the Sheet.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD).replace(CONTROL_CHARS, '');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return new Response(null, { status: 204 });
  }

  const name = clean(body.name);
  const email = clean(body.email);

  // Nothing identifiable means nothing worth logging.
  if (!name && !email) return new Response(null, { status: 204 });

  const record = {
    timestamp: new Date().toISOString(),
    name,
    email,
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: request.headers.get('CF-IPCountry') || '',
    userAgent: clean(request.headers.get('User-Agent') || ''),
    referer: clean(request.headers.get('Referer') || ''),
    token: env.SHEETS_WEBHOOK_TOKEN || ''
  };

  const url = env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.log('[access] SHEETS_WEBHOOK_URL not set; record dropped');
    return new Response(null, { status: 204 });
  }

  try {
    // Apps Script replies with a redirect to googleusercontent; follow it.
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      redirect: 'follow'
    });
  } catch (err) {
    console.log('[access] webhook failed:', err && err.message);
  }

  return new Response(null, { status: 204 });
}

// Anything other than POST gets a flat refusal rather than a hint.
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', { status: 405 });
}
