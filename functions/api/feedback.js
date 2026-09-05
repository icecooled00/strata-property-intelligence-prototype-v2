/**
 * POST /api/feedback  — store a questionnaire response
 * GET  /api/feedback?token=...  — read responses back (JSON or CSV)
 *
 * Cloudflare Pages Function. Stores to D1 and, if configured, posts a
 * summary to Slack so a response is noticed rather than discovered.
 *
 * Bindings:
 *   ACCESS_DB      D1 database (shared with the access log)
 * Variables:
 *   LOG_TOKEN      required to read responses back
 *   SLACK_WEBHOOK  optional; incoming-webhook URL for notifications
 *
 * Storing never blocks the respondent. If D1 or Slack fails the form still
 * reports success to the browser, because losing their goodwill costs more
 * than losing one row.
 */

const MAX_TEXT = 4000;
const SEP = String.fromCharCode(10);
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function clean(value, max) {
  if (value == null) return '';
  const s = typeof value === 'string' ? value : String(value);
  return s.trim().slice(0, max || MAX_TEXT).replace(CONTROL_CHARS, '');
}

/* Answers arrive as an object of question id -> string or array. Normalise
   without assuming which questions exist, so adding a question to the form
   needs no change here. */
function normalise(answers) {
  const out = {};
  if (!answers || typeof answers !== 'object') return out;
  Object.keys(answers).slice(0, 100).forEach(function (k) {
    const key = clean(k, 60);
    const v = answers[k];
    if (Array.isArray(v)) {
      out[key] = v.slice(0, 40).map(function (x) { return clean(x, 300); });
    } else if (v && typeof v === 'object') {
      const sub = {};
      Object.keys(v).slice(0, 40).forEach(function (sk) {
        sub[clean(sk, 80)] = clean(v[sk], 60);
      });
      out[key] = sub;
    } else {
      out[key] = clean(v);
    }
  });
  return out;
}

/* Slack section blocks cap at 3000 characters, so long responses are split
   across several rather than truncated. */
function chunk(lines, limit) {
  const out = [];
  let buf = '';
  lines.forEach(function (line) {
    const piece = line.length > limit ? line.slice(0, limit - 3) + '...' : line;
    if ((buf + piece).length > limit) { out.push(buf); buf = ''; }
    buf += (buf ? SEP + SEP : '') + piece;
  });
  if (buf) out.push(buf);
  return out;
}

function notifyBlocks(record, readable, formTitle) {
  const who = [record.name, record.email].filter(Boolean).join(' - ') || 'Anonymous';
  const header = '*' + (formTitle || 'Response') + '*' + SEP +
                 who + SEP +
                 (record.complete === 1 ? 'Complete' : 'Partial') +
                 ' - ' + (record.country || '??');

  const lines = (readable || []).map(function (r) {
    return '*' + r.q + '*' + SEP + (r.a || '');
  });

  const blocks = [{ type: 'section', text: { type: 'mrkdwn', text: header } }];
  if (lines.length) {
    blocks.push({ type: 'divider' });
    chunk(lines, 2800).forEach(function (text) {
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: text } });
    });
  }
  // Slack rejects payloads over 50 blocks.
  return blocks.slice(0, 48);
}

async function notifySlack(env, record, readable, formTitle) {
  if (!env.SLACK_WEBHOOK) return;
  const who = [record.name, record.email].filter(Boolean).join(' - ') || 'Anonymous';
  try {
    await fetch(env.SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'New response from ' + who,
        blocks: notifyBlocks(record, readable, formTitle)
      })
    });
  } catch (err) {
    console.log('[feedback] slack failed:', err && err.message);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const answers = normalise(body.answers);
  if (!Object.keys(answers).length) {
    return new Response(JSON.stringify({ ok: false, error: 'empty' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const record = {
    ts: new Date().toISOString(),
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    role: clean(answers.q1, 120),
    portfolio: clean(Array.isArray(answers.q2) ? answers.q2[0] : answers.q2, 60),
    ip: request.headers.get('CF-Connecting-IP') || '',
    country: request.headers.get('CF-IPCountry') || '',
    complete: body.complete ? 1 : 0
  };

  if (env.ACCESS_DB) {
    try {
      await env.ACCESS_DB
        .prepare(
          'INSERT INTO feedback (ts, name, email, role, portfolio, ip, country, complete, answers) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(record.ts, record.name, record.email, record.role, record.portfolio,
              record.ip, record.country, record.complete, JSON.stringify(answers))
        .run();
    } catch (err) {
      console.log('[feedback] D1 insert failed:', err && err.message);
    }
  } else {
    console.log('[feedback] ACCESS_DB not bound; response dropped');
  }

  await notifySlack(env, record, body.readable, body.formTitle);

  // Always report success. A storage problem is ours, not the respondent's.
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.LOG_TOKEN) return new Response('Not found', { status: 404 });
  if (url.searchParams.get('token') !== env.LOG_TOKEN) {
    return new Response('Not found', { status: 404 });
  }
  if (!env.ACCESS_DB) {
    return new Response(JSON.stringify({ error: 'ACCESS_DB not bound' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const limitRaw = parseInt(url.searchParams.get('limit') || '500', 10);
  const limit = Math.min(Math.max(isNaN(limitRaw) ? 500 : limitRaw, 1), 5000);

  let rows = [];
  try {
    const out = await env.ACCESS_DB
      .prepare('SELECT * FROM feedback ORDER BY id DESC LIMIT ?')
      .bind(limit).all();
    rows = out.results || [];
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err && err.message) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  rows.forEach(function (r) {
    try { r.answers = JSON.parse(r.answers); } catch (e) { /* leave as text */ }
  });

  if (url.searchParams.get('format') === 'csv') {
    // One row per response; answers flattened to a single JSON column so the
    // shape survives a spreadsheet import.
    const header = 'id,ts,name,email,role,portfolio,country,complete,answers';
    const body = rows.map(function (r) {
      return [r.id, r.ts, r.name, r.email, r.role, r.portfolio, r.country,
              r.complete, JSON.stringify(r.answers)].map(csvCell).join(',');
    }).join('\n');
    return new Response(header + '\n' + body + '\n', {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="premisesense-questionnaire.csv"'
      }
    });
  }

  return new Response(JSON.stringify({ count: rows.length, rows }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export async function onRequest(context) {
  const m = context.request.method;
  if (m === 'POST') return onRequestPost(context);
  if (m === 'GET') return onRequestGet(context);
  return new Response('Method Not Allowed', { status: 405 });
}
