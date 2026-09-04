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
 *   ACCESS_DB     D1 database binding (required to store anything)
 * Optional:
 *   LOG_MAX_ROWS  rolling window size, default 1000
 *
 * If nothing is bound this still returns 204. Logging must never be able to
 * block someone entering the prototype.
 */

const MAX_FIELD = 200;
const SEP = String.fromCharCode(10);

// Rolling window. Override with the LOG_MAX_ROWS variable in Cloudflare.
const DEFAULT_MAX_ROWS = 1000;

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

  if (env.ACCESS_DB) {
    const capRaw = parseInt(env.LOG_MAX_ROWS || String(DEFAULT_MAX_ROWS), 10);
    const cap = Math.min(Math.max(isNaN(capRaw) ? DEFAULT_MAX_ROWS : capRaw, 10), 100000);

    const insert = env.ACCESS_DB
      .prepare(
        'INSERT INTO access (ts, name, email, ip, country, user_agent, referer) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(record.timestamp, record.name, record.email, record.ip,
            record.country, record.userAgent, record.referer);

    /* Drop anything older than the newest `cap` rows. Finding the cut-off by
       id rather than by MAX(id) - cap keeps it correct even after manual
       deletes have left gaps in the sequence. */
    const prune = env.ACCESS_DB
      .prepare(
        'DELETE FROM access WHERE id < ' +
        '(SELECT MIN(id) FROM (SELECT id FROM access ORDER BY id DESC LIMIT ?))'
      )
      .bind(cap);

    try {
      // One transaction, so the prune sees the row just inserted.
      await env.ACCESS_DB.batch([insert, prune]);
    } catch (err) {
      console.log('[access] D1 batch failed, retrying insert alone:', err && err.message);
      try {
        await insert.run();
      } catch (err2) {
        console.log('[access] D1 insert failed:', err2 && err2.message);
      }
    }
  } else {
    console.log('[access] ACCESS_DB not bound; record dropped');
  }

  /* Tell Slack someone opened the prototype, so entries are noticed rather
     than discovered later by querying. Never blocks the response. */
  if (env.SLACK_WEBHOOK) {
    const who = [record.name, record.email].filter(Boolean).join(' - ') || 'Anonymous';
    try {
      await fetch(env.SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Prototype opened by ' + who,
          blocks: [{
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Prototype opened*' + SEP + who + SEP +
                    (record.country || '??') + ' - ' + record.ip
            }
          }]
        })
      });
    } catch (err) {
      console.log('[access] slack failed:', err && err.message);
    }
  }

  return new Response(null, { status: 204 });
}

// Anything other than POST gets a flat refusal rather than a hint.
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method Not Allowed', { status: 405 });
}
