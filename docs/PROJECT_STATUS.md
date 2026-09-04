# PROTOTYPE V2 — DECISIONS, FIXES AND OUTSTANDING ITEMS

Date: 2026-09-04
Live: <https://strata-property-prototype.pages.dev>
Repository: `icecooled00/strata-property-intelligence-prototype-v2`

Waves 0–7 complete. All nine S5A use cases demonstrable. All 22 9A2 states built.
Final QA run against the live deployment.

---

## 1. DECISIONS MADE

### 1.1 Founder decisions

| # | Decision | Outcome |
|---|---|---|
| **D1** | Demo story | **Envelope hero at Harbour Heights.** 9A2 governs layout, composition and state inventory; HANDOFF §6 governs every content value. The elevator is retained as a secondary conflicting-evidence item and as the field-inspection subject, so no 9A2 panel goes unused. |
| **D2** | Entry screen | All fields captured as research data; **Unique ID is the only value checked**. No field labelled "Password" — the masked input is the Unique ID, as v1 does it. |
| **D3** | Health indicators | **S9A2 F02 labels**, Evidence scored lowest (38) and visually cued, so the landing screen telegraphs the evidence gap. |
| **D4** | Photography | Warm contemporary tower, matching the sheet rather than S6A §8's "older high-rise" *recommendation*. Seven images generated. |
| **D5** | Typography | **Self-hosted Inter**, 48 KB latin variable subset, weights 400–700. Zero external requests preserved. |
| **D6** | Cloudflare | `strata-property-prototype` → live, auto-deploying from `main`. |
| **D7** | Portfolio | **Deferred entirely.** No strip, no page, no counts. The `portfolio` object stays in the dataset unrendered. |
| **D8** | Design tokens | Sampled directly from the committed contact sheet with Pillow. |
| — | Unique ID | **`Vancouver` retained for both v1 and v2.** Same audience may access both. |

### 1.2 Decisions I made during the build

These were routine judgment calls, recorded so nothing is silently mine.

| # | Decision | Reasoning |
|---|---|---|
| **A1** | **Name and email are required to enter** | S5A UC-P01 requires access to be attributable to a known person. D2 said Unique ID is the only *gate*; I read its intent as "don't validate name/email", not "allow anonymous entry". **Needs ratification — see §3.1.** |
| **A2** | R01 follows F08's scanning order, with panel 08's compact card embedded near the end | Panel 08 alone is a summary card; F08 specifies decision-required → urgency/evidence/cost → why → action → export. Both are honoured. |
| **A3** | Inspection stepper has **five** steps | 9A2's own responsive-inspection diagram shows Web Entry → Capture Photo → Observation/Asset → Result → Resulting Attention. |
| **A4** | Processing failure is an explicit **"Run failure demo"** control | S8A §20 requires a recoverable failure to be demonstrable. A facilitator must be able to trigger it deliberately rather than hope for it. |
| **A5** | Evidence quality on the hero issue reads **Poor · 38%** | The sheet shows *Good · 100%* for the elevator scenario. For an issue whose defining problem is that the evidence does not support a conclusion, "Good 100%" would contradict the story. |
| **A6** | Site area status is **Fair** at 75% | Matches 9A2 panel 09, which reads *(Fair)*. |
| **A7** | Secondary issues fully populated rather than left as stubs | Fixed the root cause of the blocker defects instead of masking them. |
| **A8** | Research events go to `localStorage`, read via `strataEvents()` in the console | S10A F09 requires the events; S8A F10 keeps research capture out of the participant UI. **Confirm this is sufficient — see §3.4.** |
| **A9** | Photographs optimised on arrival | 5.02 MB → 1.6 MB. The cutout was a 1.65 MB PNG with no alpha rendering at 120px. |

---

## 2. FIXES DONE

### 2.1 From the Waves 0–3 audit — 13 findings, all resolved

**Blockers.** Only the hero issue was fully populated, so every secondary attention item rendered broken content: `Due in undefined days` / `Due in null days`, an empty "Why this matters" heading, and an empty Source block. Fixed at the source by populating ISS-003 to ISS-006 with real fields and evidence records, and by making the renderers degrade honestly.

**Major.** R01's evidence age was a hardcoded `1,176 days old` string; the photo overflow tile was a hardcoded `+6`; the Why/Evidence/Action anchors falsely claimed `role="tab"`; rail buttons announced their name twice.

**Minor.** Evidence tab leaked across issues; Site status disagreed with panel 09; block headings skipped from h1 to h3; plan said 21 states when the table listed 22; D6 recorded a stale project name.

### 2.2 Found during live QA

| Fix | What was wrong |
|---|---|
| Entry gate accepted blank identity | `novalidate` made `required` decorative; sessions recorded `{"name":"","email":""}` |
| R01 broke without an action | ISS-002 showed "null days" and *"Approve the recommended action at —"* while claiming Status: Active |
| Two scrolling boxes | `html, body { height:100% }` made body its own scroller; `scrollY` read 0 while `.main` sat at −2180px |
| Deep links landed at the page bottom | Anchor position computed against a still-settling layout; now re-applies until the destination stops moving |
| Condition asserted without an asset | Issues with no asset displayed "Current condition: Unknown" |
| Tiles wore alarm colours unconditionally | Urgency now warns within 30 days, evidence below 70% |
| Building visual illegible | A 22-storey tower rendering into a 120×150 box |
| Photo buttons unnamed | Name came from `img alt`, which vanishes if the image fails |
| Document companion could not be re-run | Once in review there was no route back to select |
| Inspection stepper drifted | Four chips for a five-step flow |

### 2.3 Built in Waves 4–7

**Wave 4** — D01 select/upload, D01-P stepped processing, D01-F recoverable failure, D02 candidate review with Confirm/Edit/Reject/Defer and Undo, D02-E inline edit. Rejected and deferred candidates keep source, page and snippet.

**Wave 5** — I01–I04 field inspection: desktop web entry, then capture/observation/result at phone width inside a device frame, then the resulting attention item on the web.

**Wave 6** — C01 completion with status progression and evidence, C02 closed loop showing before/after *and* what completion did not erase.

**Wave 7** — self-hosted Inter, research instrumentation, guided demo script, accessibility hardening.

---

## 3. OUTSTANDING DECISIONS REQUIRED

### 3.1 Ratify the entry-gate change *(most important)*
I made name and email mandatory (**A1**). This is the one place I resolved a genuine tension between D2 and UC-P01 on my own judgment. If you want the original behaviour — anyone with `Vancouver` gets in, identity optional — it is a two-line revert.

### 3.2 Confirm the typeface
Inter is my **best identification** of the face on the 9A2 sheet, not a confirmed match — the sheet renders at 1672px, too low to be certain. If you know the real face and it is redistributable, I will swap it; `--font-sans` is one token.

### 3.3 Safari verification
S10A F11 requires current Chrome, Safari and Edge. This is a Windows machine — **Chrome and Edge are verified, Safari is not**. Either you check the live URL on a Mac or iPad, or we record Safari as unverified in the QA log.

### 3.4 Is the research capture sufficient?
Events are written to `localStorage` and read with `strataEvents()` in the browser console. That satisfies S10A F09 and keeps capture out of the participant UI, but it means **you must collect it from the participant's browser before they close the tab** — it never leaves their machine. If sessions are facilitator-driven over screen share that is fine. If participants self-explore, you will lose the data. Options: accept as-is, add a facilitator-only export, or accept that self-exploration is unmeasured.

### 3.5 Should the "Run failure demo" control be visible to participants?
It currently sits on the document-select screen where a participant can see and press it. That is honest, but it does advertise that failure is staged. Alternative: hide it behind a key combination or a URL parameter so only the facilitator can trigger it.

### 3.6 Portfolio — when?
D7 deferred it entirely. The data object is retained and unrendered, so delivery is a rendering change with no migration. No date has been set.

### 3.7 Filing these documents into Drive
Your governed folder uses S-numbered naming and a superseded-artifacts subfolder. `WAVE0_DECISIONS.md`, `PHOTO_PROMPTS.md`, `DEMO_SCRIPT.md` and this document currently live only in the repository. Tell me the naming convention and I will file them.

### 3.8 Review the demo script
`docs/DEMO_SCRIPT.md` puts words in your mouth — literally, it contains suggested phrasing. Worth reading before you use it in front of a prospect.

### 3.9 v1 decommission
v1 remains live at `strata-property-intelligence.icecooled.chatgpt.site` with the same Unique ID. You said both should be accessible. No action unless that changes.

---

## 4. WHAT IS DELIBERATELY NOT BUILT

Real authentication, backend, database or API. Real document processing, OCR or AI
extraction. Computer vision. Real file upload — the picker reads a filename and
discards it. Real PDF generation. Notifications, email or calendar. Cost-benchmark
database. Portfolio analytics. Capital planning. Document library, asset register or
obligation rule engine. Project management, vendors, billing, support desk,
governance/voting, report builder, admin areas. Native mobile app. Automated tests
(S10A F10 exempts the Prototype).

No React, Vue, Angular, Svelte, Next.js, Node frameworks, TypeScript, npm
dependencies, CSS frameworks, UI or charting libraries, Docker, or any build step.

---

## 5. FINAL QA RESULT — LIVE DEPLOYMENT

| Check | Result |
|---|---|
| Page states swept | **29** — zero `undefined` / `null` / `NaN` / `[object` / `Invalid Date` |
| S5A use cases | **9 of 9** demonstrable |
| 9A2 states | **22 of 22** built |
| Core walkthrough | Entry → Attention → Why → Evidence → Action → Assign → Summary, verified end to end |
| Data consistency | Property 5/5, exposure 3/3, cost 2/2, owner 2/2, due 3/3 |
| Evidence vocabulary | All five states render: Verified, Needs Review, Conflicting, Missing, Unknown |
| Action vocabulary | All four render: Recommended, Assigned, In Progress, Completed |
| Reset | Restores canonical baseline; keeps session. Exit clears it |
| **External requests** | **Zero** across 61 resources |
| Accessibility | No unnamed buttons, no unlabelled controls, no missing alt, no heading skips, native dialog focus trap, `lang` set, reduced-motion honoured |
| Responsive | No horizontal overflow at 1280, 768 or 375 |
| Bad route | Falls back to Attention |
| Browsers | Chrome ✅ Edge ✅ Safari ⚠ unverified |
| Build step | None. Repository root is the deployed site |
| Assets | 1.6 MB of photography, 48 KB font, no CDN |

---

## 6. DECISIONS SINCE — 2026-09-04

| Item | Resolution |
|---|---|
| §3.1 Name and email mandatory | **Ratified.** A1 stands as built. |
| §3.2 Typeface | **Accepted.** Self-hosted Inter confirmed. |
| §3.3 Safari | **Accepted as unverified.** Will be covered by participant feedback. |
| §3.4 Research capture | **Superseded** by the access log below. In-browser `strataEvents()` stays as-is for behavioural events. |
| §3.5 Failure demo visibility | **No change.** The control stays visible on the Document Select screen. |
| §3.6 Portfolio | **No date set.** |
| **New — access logging** | **Built.** Name, email, timestamp, IP, country and user agent to a Cloudflare D1 database via a Pages Function, capped at a rolling 1000 rows and readable as JSON or CSV. The Google Sheets route was tried first and reverted on 2026-09-04 — too much setup friction for no benefit. See `ACCESS_LOGGING.md`. Requires three dashboard steps before it records anything. |

### Recorded scope exception
Access logging adds a **serverless function**, which S5A and S6A exclude. This is a
deliberate founder exception, not scope drift. The browser still makes zero external
requests — the Google call happens server-side.

### Recorded risk — accepted
The entry screen still reads *"Your details are recorded only for this research
session."* That stops being accurate once rows persist in a Sheet, and the record now
includes an IP address. The founder reviewed the alternatives on 2026-09-04 and chose
to keep the existing wording. One-line change in `index.html` if that ever shifts.

### Still open
- **§3.7** Filing the docs into Drive — awaiting a naming convention.
- **§3.8** Demo script review — contains suggested spoken phrasing.
- **§3.9** v1 decommission — both stay live by decision.
