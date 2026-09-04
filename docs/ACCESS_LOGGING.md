# VIEWER ACCESS LOGGING — GOOGLE SHEETS SETUP

Records **name, email, timestamp, IP address, country and user agent** to a Google
Sheet each time someone enters the prototype.

**Status:** code is deployed and live. It does nothing until you complete the four
steps below — until then the function logs a note and returns quietly, and entry
works exactly as before.

---

## How it works

```
browser  →  POST /api/access                    same origin, no external request
              ↓  Cloudflare Pages Function
              ↓  reads CF-Connecting-IP  (the real client IP)
              →  Google Apps Script  →  your Sheet
```

The browser only ever talks to `strata-property-prototype.pages.dev`. The Google call
happens server-side, so the page still makes **zero external requests** and the webhook
URL never appears in page source.

The client IP is only visible server-side — a static page cannot see its own IP, which
is why this needs the function rather than posting to Google directly.

**Failure is silent by design.** If the webhook is missing, misconfigured or down, the
viewer still enters the prototype normally. Logging is never allowed to block a demo.

---

## Step 1 — The Sheet — DONE

Created 2026-09-04 in the Property Intelligence folder.

**Strata Prototype Access Log**
<https://docs.google.com/spreadsheets/d/135pYPrAz_gnafxWnBZwbpyKyB_QOzUB9WE5a-tFs0_o/edit>
File ID `135pYPrAz_gnafxWnBZwbpyKyB_QOzUB9WE5a-tFs0_o`

Headers are already in row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Timestamp | Name | Email | IP | Country | User agent |

**Worth one glance:** the tab along the bottom should read **`Access Log`**. It was
created under that name so the CSV conversion would carry it, but the Drive API does
not expose tab names, so this was not verified. If it reads anything else, rename it —
or leave it, because the Apps Script falls back to `insertSheet('Access Log')` and will
create the right tab on first write, leaving these headers on the old one.

## Step 2 — Add the Apps Script

In that Sheet: **Extensions → Apps Script**. Delete anything there and paste this:

```javascript
// Strata Prototype — access log receiver.
// This SECRET must match SHEETS_WEBHOOK_TOKEN in Cloudflare. Generated
// 2026-09-04; regenerate both together if it is ever exposed.
const SECRET = 'qlRW8jcBSu1USiA5WeVi20XC4qoMVjFN42H54UiJ';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    if (SECRET && d.token !== SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'bad token' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Access Log') || ss.insertSheet('Access Log');

    sheet.appendRow([
      d.timestamp || new Date().toISOString(),
      d.name      || '',
      d.email     || '',
      d.ip        || '',
      d.country   || '',
      d.userAgent || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

The secret is already filled in. Nothing to change — paste it exactly as it is.

## Step 3 — Deploy the script

1. **Deploy → New deployment**
2. Click the gear beside *Select type* → **Web app**
3. **Execute as:** *Me*
4. **Who has access:** **Anyone** — required, because Cloudflare calls it unauthenticated.
   The shared secret is what protects it.
5. **Deploy**, then **Authorize access** and accept the permission prompt.
6. Copy the **Web app URL**. It ends in `/exec`.

> Every time you edit the script you must **Deploy → Manage deployments → edit → New
> version**, or your change will not take effect.

## Step 4 — Add the variables in Cloudflare

Cloudflare dashboard → **Workers & Pages** → **strata-property-prototype** →
**Settings** → **Variables and Secrets** → **Add variable**, for the **Production**
environment:

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the `/exec` URL from step 3 |
| `SHEETS_WEBHOOK_TOKEN` | `qlRW8jcBSu1USiA5WeVi20XC4qoMVjFN42H54UiJ` |

Add `SHEETS_WEBHOOK_TOKEN` as an **encrypted** secret rather than plain text.

Then **redeploy** — Deployments → the latest one → **Retry deployment**. Variables are
bound at deploy time, so an existing deployment will not pick them up.

## Step 5 — Test

Open the prototype, enter a name, email and `Vancouver`. A row should appear in the
Sheet within a few seconds.

If nothing arrives, check Cloudflare → your project → **Functions** → real-time logs.
The function prints `[access] SHEETS_WEBHOOK_URL not set` or `[access] webhook failed`
with the reason.

---

## What is captured

| Field | Source | Notes |
|---|---|---|
| Timestamp | Function, UTC ISO | |
| Name | Entry form | Trimmed, control characters stripped, 200 char cap |
| Email | Entry form | Format-checked in the browser, not verified |
| IP | `CF-Connecting-IP` | The real client IP |
| Country | `CF-IPCountry` | Two-letter code from Cloudflare |
| User agent | Request header | |

Nothing else. No page views, no clickstream, no cookies. The in-browser research events
(`strataEvents()`) are separate and still never leave the participant's machine.

---

## Recorded risk — consent wording

**Accepted by the founder on 2026-09-04.**

The entry screen says:

> *"Your details are recorded only for this research session."*

Once rows persist in a Sheet you keep, that sentence is no longer accurate — the data
outlives the session, and it now includes an IP address, which is identifiable personal
data under BC PIPA and PIPEDA.

The founder reviewed the alternatives and chose to keep the existing wording. Recorded
here so the decision is visible rather than implicit. Changing it later is a one-line
edit in `index.html`.

Suggested replacement, if that changes:

> *"Your name, email and access time are recorded so we can follow up about this
> research session. We also log your IP address for security. Nothing else is
> collected."*
