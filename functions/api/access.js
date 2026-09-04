/**
 * POST /api/access — viewer access log.
 *
 * Cloudflare Pages Function. Lives at functions/api/access.js, which Pages
 * maps to /api/access automatically. No build step; deployed as-is.
 *
 * Writes to a Cloudflare D1 database bound as ACCESS_DB. The client IP is
 * only visible server-side (CF-Connecting-IP), which is why this needs a
 * function rather than posting from the page. The browser only ever talks
 * to our own origin, so the page still makes zero external requests.
 *
 * Bindings:
 *   ACCESS_DB             D1 database binding (required to store anything)
 * Optional legacy:
 *   SHEETS_WEBHOOK_URL    Apps Script /exec URL, if you also want a Sheet
 *   SHEETS_WEBHOOK_TOKEN  shared secret echoed to Apps Script
 *
 * If nothing is bound this still returns 204. Logging must never be able to
 * block someone entering the prototype.
 */

const MAX_FIELD = 200;

// Control characters, so nothing can forge a row break downstream.
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
    referer: clean(request.headers.get('Referer') || '')
  };

  // ---- primary store: D1
  if (env.ACCESS_DB) {
    try {
      await env.ACCESS_DB
        .prepare(
          'INSERT INTO access (ts, name, email, ip, country, user_agent, referer) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(record.timestamp, record.name, record.email, record.ip,
              record.country, record.userAgent, record.referer)
        .run();
    } catch (err) {
      console.log('[access] D1 insert failed:', err && err.message);
    }
  } else {
    console.log('[access] ACCESS_DB not bound; record dropped');
  }

  // ---- optional: also mirror to a Google Sheet, if configured
  if (env.SHEETS_WEBHOOK_URL) {
    try {
      await fetch(env.SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.assign({}, record, { token: env.SHEETS_WEBHOOK_TOKEN || '' })
        ),
        redirect: 'follow'
      });
    } catch (err) {
      console.log('[access] sheet mirror failed:', err && err.message);
    }
  }

  return new Response(null, { status: 204 });
}

// Anything other than POST gets a flat refusal rather than a hint.
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', { status: 405 });
}
