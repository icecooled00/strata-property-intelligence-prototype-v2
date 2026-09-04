# VIEWER ACCESS LOGGING — CLOUDFLARE D1

Records **name, email, timestamp, IP, country and user agent** to a database each time
someone enters the prototype. Queried from Claude Code, or exported to CSV.

**Status:** code deployed and live. It stores nothing until you complete the three
dashboard steps below. Until then the function logs a note and returns quietly, and
entry works exactly as before.

---

## How it works

```
browser  →  POST /api/access          same origin, no external request
              ↓  Cloudflare Pages Function
              ↓  reads CF-Connecting-IP  (the real client IP)
              →  D1 database

Claude   →  GET /api/log?token=...   →  JSON or CSV
```

The browser only ever talks to `strata-property-prototype.pages.dev`. The client IP is
only visible server-side, which is why this needs a function rather than posting from
the page.

**Failure is silent by design.** If the database is unbound or unreachable, the viewer
still enters the prototype normally. Logging is never allowed to block a demo.

---

## Step 1 — Create the database

Cloudflare dashboard → **Storage & Databases** → **D1 SQL Database** → **Create**.

Name it **`strata-access`**. Region: whichever is nearest you.

## Step 2 — Create the table

Open the new database → **Console** tab → paste and **Execute**:

```sql
CREATE TABLE IF NOT EXISTS access (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  ip         TEXT,
  country    TEXT,
  user_agent TEXT,
  referer    TEXT
);
CREATE INDEX IF NOT EXISTS idx_access_ts ON access (ts);
```

## Step 3 — Bind it, add the read token, redeploy

**Workers & Pages → strata-property-prototype → Settings**.

**a. Bindings** → **Add** → **D1 database**:

| Variable name | Database |
|---|---|
| `ACCESS_DB` | `strata-access` |

The variable name must be exactly `ACCESS_DB` — that is what the code looks for.

**b. Variables and Secrets** → **Add variable**, Production:

| Name | Value | Type |
|---|---|---|
| `LOG_TOKEN` | `6ailH1B8T4mbKbMj1NBhguC6IoMjwFnuT3kTmnT7` | **Secret** |
| `LOG_MAX_ROWS` | `1000` | Text — *optional, this is the default* |

`LOG_MAX_ROWS` only needs adding if you want a window other than 1000.

**c. Redeploy.** Deployments → latest → **Retry deployment**. Bindings attach at deploy
time, so the running deployment will not see them otherwise. This is the step people
miss.

---

## Reading the log

Tell me "show me the access log" and I will fetch and format it. Under the hood:

```bash
# everything, newest first
curl -s "https://strata-property-prototype.pages.dev/api/log?token=6ailH1B8T4mbKbMj1NBhguC6IoMjwFnuT3kTmnT7"

# last 20
curl -s ".../api/log?token=...&limit=20"

# since a date
curl -s ".../api/log?token=...&since=2026-09-01"

# CSV, for dropping into a spreadsheet
curl -s ".../api/log?token=...&format=csv" -o access-log.csv
```

Wrong token or missing token returns **404**, not 403 — the endpoint does not confirm
it exists.

There is deliberately **no delete endpoint**. Clearing the log is done from the D1
console, so it cannot happen by accident or by anyone holding the read token.

---

## Rolling window — oldest entries fall off

The table is capped at **1000 rows**. Every insert runs in the same transaction as a
prune that deletes anything older than the newest 1000, so the table can never exceed
the cap even if nobody maintains it.

The cut-off is found by looking up the id of the 1000th-newest row rather than
subtracting from the highest id, so it stays correct even after rows have been deleted
by hand and left gaps in the sequence.

Change the size with `LOG_MAX_ROWS` in Cloudflare — clamped between 10 and 100,000.

> **This is a rolling window, not an archive.** Past 1000 sessions the oldest are gone
> for good. If you need a permanent record, pull a CSV periodically:
>
> ```bash
> curl -s ".../api/log?token=...&format=csv&limit=1000" -o access-log-$(date +%F).csv
> ```
>
> Or just ask me to do it and file it in Drive.

---

## What is captured

| Column | Source | Notes |
|---|---|---|
| `ts` | Function, UTC ISO | |
| `name` | Entry form | Trimmed, control characters stripped, 200 char cap |
| `email` | Entry form | Format-checked in the browser, not verified |
| `ip` | `CF-Connecting-IP` | The real client IP |
| `country` | `CF-IPCountry` | Two-letter code |
| `user_agent` | Request header | |
| `referer` | Request header | Usually empty |

Nothing else. No page views, no clickstream, no cookies. The in-browser research events
(`strataEvents()`) are separate and still never leave the participant's machine.

---

## Recorded risk — consent wording

**Accepted by the founder on 2026-09-04.**

The entry screen says:

> *"Your details are recorded only for this research session."*

Once rows persist in a database you keep, that sentence is no longer accurate — the data
outlives the session, and it includes an IP address, which is identifiable personal data
under BC PIPA and PIPEDA.

The founder reviewed the alternatives and chose to keep the existing wording. Recorded
so the decision is visible rather than implicit. Changing it later is a one-line edit in
`index.html`.

Suggested replacement, if that changes:

> *"Your name, email and access time are recorded so we can follow up about this
> research session. We also log your IP address for security. Nothing else is
> collected."*

---

## Scope note

This adds a serverless function and a database, both of which S5A and S6A exclude for
the Prototype. It is a deliberate, recorded founder exception rather than scope drift.
The prototype application itself is unchanged: still static, still no build step, still
zero external requests from the page.
