/**
 * GET /api/log — read the viewer access log.
 *
 * Protected by a shared token. Returns JSON by default, CSV with ?format=csv.
 *
 *   /api/log?token=SECRET
 *   /api/log?token=SECRET&format=csv
 *   /api/log?token=SECRET&limit=50
 *   /api/log?token=SECRET&since=2026-09-01
 *
 * Bindings:
 *   ACCESS_DB   D1 database binding
 *   LOG_TOKEN   shared secret required to read
 *
 * Read-only. There is no delete endpoint on purpose — clearing the log is a
 * deliberate act, done from the Cloudflare D1 console.
 */

function deny() {
  return new Response('Not found', { status: 404 });
}

function csvCell(value) {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // No token configured means the endpoint stays closed, not open.
  if (!env.LOG_TOKEN) return deny();
  if (url.searchParams.get('token') !== env.LOG_TOKEN) return deny();
  if (!env.ACCESS_DB) {
    return new Response(JSON.stringify({ error: 'ACCESS_DB not bound' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const limitRaw = parseInt(url.searchParams.get('limit') || '500', 10);
  const limit = Math.min(Math.max(isNaN(limitRaw) ? 500 : limitRaw, 1), 5000);
  const since = url.searchParams.get('since');

  let stmt;
  if (since) {
    stmt = env.ACCESS_DB
      .prepare('SELECT * FROM access WHERE ts >= ? ORDER BY id DESC LIMIT ?')
      .bind(since, limit);
  } else {
    stmt = env.ACCESS_DB
      .prepare('SELECT * FROM access ORDER BY id DESC LIMIT ?')
      .bind(limit);
  }

  let rows = [];
  try {
    const out = await stmt.all();
    rows = out.results || [];
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err && err.message) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (url.searchParams.get('format') === 'csv') {
    const header = 'id,timestamp,name,email,ip,country,user_agent,referer';
    const body = rows.map(function (r) {
      return [r.id, r.ts, r.name, r.email, r.ip, r.country, r.user_agent, r.referer]
        .map(csvCell).join(',');
    }).join('\n');
    return new Response(header + '\n' + body + '\n', {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="premisesense-access-log.csv"'
      }
    });
  }

  return new Response(JSON.stringify({ count: rows.length, rows }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export async function onRequest(context) {
  if (context.request.method === 'GET') return onRequestGet(context);
  return deny();
}
