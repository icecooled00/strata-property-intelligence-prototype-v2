# STRATA PROTOTYPE V2 — IMPLEMENTATION PLAN

Prepared for founder review — 2026-09-03
Status: **PLANNING ONLY. NO APPLICATION CODE WRITTEN.**

> ### Decisions resolved — 2026-09-03
> The founder has reviewed this plan, supplied the 9A2 contact sheet as an image, and
> resolved every open question. See **[`WAVE0_DECISIONS.md`](WAVE0_DECISIONS.md)** for the
> decisions and the frozen canonical dataset, and **[`PHOTO_PROMPTS.md`](PHOTO_PROMPTS.md)**
> for the photography pack.
>
> - **D1 Demo story** — envelope hero at Harbour Heights; elevator retained as a secondary
>   conflicting-evidence item and as the field-inspection subject. §18.1 **RESOLVED**.
> - **D2 Entry screen** — all fields are data capture; Unique ID (`Vancouver`) is the only
>   gate; no field labelled "Password". **RESOLVED**.
> - **D3 Health indicators** — F02 labels, Evidence lowest (38) and cued. §18.3 **RESOLVED**.
> - **D4 Photography** — match the sheet's warm contemporary look. §12 **RESOLVED**.
> - **9A2 image** — now seen directly. §17.1 **CLOSED**.
>
> One correction carried into `WAVE0_DECISIONS.md` §4: S6A §8 presents "roof or
> building-envelope concern" and "older high-rise" as a **Recommended shape**, not a hard
> requirement, as §18.1 below originally stated.

---

## 1. Executive recommendation

Build Prototype v2 as a **single-page, zero-dependency static web app**: one
`index.html` shell, one `styles.css`, one `app.js` state machine, one canonical
`data/prototype.json`, and a small set of local assets. Hash-based routing
(`#/attention`, `#/issue/why`) keeps the whole thing deployable from the
repository root with **no build step and no Cloudflare routing configuration**.

The 9A2 design is reproducible in plain HTML/CSS/SVG. Every visual concept on
the contact sheet — five health rings, status-by-area bars, the
historical/now/due timeline, the act-now-vs-defer risk graph, evidence-quality
treatment, photo strips, the responsive inspection stepper — has a clean native
implementation. **No charting library or UI framework is required anywhere.**

Two things block a clean start, both listed in §17:

1. I could not view the 9A2 contact sheet **as an image**. I have its complete
   OCR text and the full frozen S9A2 specification, which together give me the
   panel inventory, layout labels and every governing rule — but not exact
   colour, type and spacing. A pixel-level pass is needed before Wave 1.
2. **No photographic assets exist** in the Drive folder. The design is
   explicitly photo-aware. This needs a decision.

One substantive contradiction must be resolved by you before Wave 0 closes:
the 9A2 contact sheet's on-image sample content is a *different hero scenario*
from the canonical synthetic dataset. See §2.4 and §18. My recommendation is
conservative and does not redesign anything.

---

## 2. Source / access verification

### 2.1 Successfully accessed

| Source | Drive ID | Role |
|---|---|---|
| S5A Prototype Use Cases | `1BpDhH2HW7...3hM5Vdiw` | **Governing** — user-outcome scope |
| S6A Prototype Requirements | `1U8qcRT20v...AwYFYbdU` | **Governing** — scope, fidelity, exclusions |
| S8A Prototype UX Flow / IA | `1Rft_psbZN...tM5XDVag` | **Governing** — IA, states, F01–F10 |
| S9A2 High-Fidelity UI Design | `12_EchTAK9...rEZBgyA` | **Governing** — UI design, F01–F12 |
| S10A Prototype Development Planning | `1F5PNUT9wl...LYD5KfU` | **Governing** — build intent, epics, waves |
| `Strata_9A2_CONTACT_SHEET_FINAL_WEB.png` | `1kgqEekY6w...uasdM` | **Primary visual authority** — text/OCR only, see §2.3 |
| `Strata_9A1_Contact_Sheet_Photo_Aware.png` | `12yy4h4P0P...tsE6_I` | Visual backstop — **not yet read** |
| HANDOFF 2026-09-03 | `1c_r2Qgw3u...ktODxHj0` | **Governing** — canonical data, F01–F12, Vancouver |
| v1 live site | chatgpt.site | **Reference only** |

Also present and deliberately **not** used as scope authority: S5B, S6B, S8B,
S1–S4, S7, Brainstorm, Playbook, Pilot/MVP use-case specs.

### 2.2 The HANDOFF document is a material find

`HANDOFF_20260903_Strata_Property_Intelligence_Project` was not named in the
brief but is dated today and is explicitly governing. It supplies three things
nothing else does: the **canonical synthetic dataset** (§2.4), the
**consolidated F01–F12 founder UI decisions**, and the **definitive answer to
the Vancouver question** (§2.5). I have treated it as governing.

### 2.3 Partial access — the 9A2 image

The Drive connector returns a *text extraction* of the PNG, not the image. I
therefore have:

- the complete panel inventory and numbering (01–18 plus `11A`, `12A`, `17A`, `18A`, `18B`);
- every on-panel label, control name and section heading;
- the "Key Visual Elements", "Design Rules" and "Edge Case Coverage" legends;
- the full frozen S9A2 spec text, which is the *written* authority over the same design.

I do **not** have colour values, type scale, spacing rhythm, corner radii, or
the exact rendered form of the two graphs. Rather than invent them, I have
planned the structure precisely and deferred the surface treatment to a
verification pass. **Action in §17.1.**

The in-app browser is not signed into Google, and the Claude-in-Chrome
extension — which would use your logged-in session — is not currently
connected.

### 2.4 Canonical dataset (HANDOFF §6) — governing

```
Hero property        Harbour Heights (older high-rise)
Hero issue           Building Envelope Inspection / envelope assessment
Asset / system       Building envelope — North elevation
Due                  24 days
Latest evidence      2023
Condition            Unknown / not verified
Repair exposure      $85K – $140K
Recommended step     Assessment within 30 days
Assessment cost      $4K – $7K
Owner                Jordan Lee — Property Manager
Completion target    Sep 30, 2026
```

Explicitly forbidden substitutions: *Waterfront Heights*, *17 days*, *$4K–$8K*.

### 2.5 The Vancouver requirement — resolved, not ambiguous

The brief asked me to preserve "the unique-ID convention/value associated with
Vancouver" and to flag it if ambiguous. It is **not** ambiguous. Two
independent sources agree:

- **HANDOFF §7:** "The access gate currently uses a deliberate Unique ID value
  of *Vancouver*. Do not treat that value itself as a QA defect."
- **v1 live site:** the entry form has exactly three fields — Full name, Email
  address, and **Unique ID**, rendered as `<input type="password">`.

**Therefore:** Prototype v2's E01 entry gate keeps a third field labelled
**"Unique ID"**, of type `password`, whose accepted value is the exact
case-sensitive string **`Vancouver`**. It is a shared demonstration passcode,
not a per-viewer secret, and not authentication.

A *separate and unrelated* use of the word appears on the 9A2 contact sheet as
the hero property's city, "Vancouver, BC". Both are preserved; they do not
conflict once disambiguated. Representation in v2:

```json
"access": { "uniqueIdLabel": "Unique ID", "uniqueIdValue": "Vancouver", "caseSensitive": true }
```

Held in `data/prototype.json` in the clear. This is a demo gate over synthetic
data — it is deliberately not a security control, and the plan does not imply
otherwise.

---

## 3. Authority hierarchy applied

1. **9A2** final high-fidelity visual design — *layout, composition, hierarchy, state inventory*
2. **S5A** frozen Prototype use cases — *what must be demonstrable*
3. **S6A** frozen Prototype requirements — *depth, fidelity, exclusions*
4. **S8A** frozen UX/IA — *navigation, flows, workflow states*
5. **S10A** development intent — *sequencing, real-vs-simulated split*
6. **9A1** photo-aware wireframes — *backstop only*
7. **v1 site** — *reference only; never authority*

Plus **HANDOFF §6** as the authority on *data values*, which no other artifact
states canonically.

---

## 4. S5A use-case traceability

No orphans. All nine frozen use cases are covered.

### UC-P01 — Access Prototype and Record Viewer Identity
- **Screen/state:** `E01` (+ inline-validation variant)
- **Entry:** app load, no session in `localStorage`
- **Interaction:** enter Full name, Email, Unique ID -> "Enter prototype"
- **Data:** `access` block; writes `session {name, email, enteredAt}`
- **Result:** session recorded, route to `A01`
- **9A2 area:** panel 01 Entry (Who am I)
- **Mechanism:** semantic `<form>`, native `type=email` + `required`,
  `setCustomValidity` for the Unique ID mismatch, `localStorage` session write.
  No auth.

### UC-P02 — Review What Needs Attention
- **Screen/state:** `A01` Attention / Property Health landing
- **Entry:** post-entry landing (S8A F01 — Attention is the landing screen)
- **Interaction:** scan five health indicators; select one of 3–5 attention cards
- **Data:** `properties`, `issues`, `portfolio`
- **Result:** selected issue -> `IW01`
- **9A2 area:** panel 02 Attention/Health
- **Mechanism:** CSS Grid card list, first card visually dominant; five inline-SVG
  health rings; portfolio context as a compact strip (S8A F07)

### UC-P03 — Understand the Property and Issue Context
- **Screen/state:** `IW01` Why / Context (anchored section), supported by `P00`
- **Entry:** attention card, or Why anchor
- **Interaction:** read why-it-matters; open "What does this mean?"; view 1–2 photo
  thumbnails; read act-now-vs-defer
- **Data:** `issues`, `assets`, `obligations`, `costs`, `photos`
- **Result:** understands consequence, uncertainty, exposure, timing
- **9A2 area:** panels 03, 09
- **Mechanism:** sticky anchor nav; inline-SVG timeline and risk graph; `<details>`
  or popover for the explanation affordance (S9A2 F05)

### UC-P04 — Verify the Evidence Behind a Material Issue
- **Screen/state:** `IW02` Evidence, plus `EV-P` source preview overlay
- **Entry:** Evidence anchor, or an evidence cue on any card
- **Interaction:** read source/snippet/date/state; open source preview in one click
- **Data:** `evidence`, `documents`, `photos`
- **Result:** "Where did this come from?" answered in one click
- **9A2 area:** panels 04, 13
- **Mechanism:** evidence cards with icon + text + shape-distinct state badges;
  native `<dialog>` for preview

### UC-P05 — Decide the Recommended Next Action
- **Screen/state:** `IW03`, plus `IW03-A` Assign and `IW03-D` Defer overlays
- **Entry:** Action anchor, or next-action preview on the attention card
- **Interaction:** Confirm / Assign / Defer
- **Data:** `actions`, `owners`, `costBenchmark`
- **Result:** owner/status mutate in demo state and reconcile everywhere
- **9A2 area:** panels 05, 06, 07
- **Mechanism:** one dominant primary button (F10); `<dialog>` overlays; state
  write + re-render of every dependent view

### UC-P06 — Turn a Sample Document into Reviewable Intelligence
- **Screen/state:** `D01`, `D01-P`, `D01-F`, `D02`, `D02-E`
- **Entry:** Evidence area companion launch, or one optional demo card (S8A F05)
- **Interaction:** select sample or simulate upload -> processing -> review
  candidates -> Confirm / Edit / Reject / Defer
- **Data:** `documents`, `candidates`
- **Result:** candidate vs confirmed remains visually distinct; provenance survives reject
- **9A2 area:** panels 10, 11, 11A, 12, 12A
- **Mechanism:** `<input type=file>` read **only** for filename/size — never uploaded;
  deterministic `setTimeout` step sequence; forced-failure path with Retry

### UC-P07 — Simulate Mobile Inspection to Asset Attention
- **Screen/state:** `I01` – `I04`
- **Entry:** explicit "Field inspection demo" action from an asset/issue (S8A F06)
- **Interaction:** capture/select photo -> associate asset -> observation -> resulting attention
- **Data:** `photos`, `assets`, `inspection`
- **Result:** new/updated attention item linked to a recommended action
- **9A2 area:** panels 14–17, 17A
- **Mechanism:** narrow-width responsive layout inside a device frame on desktop;
  no camera API, no CV, no autonomous diagnosis

### UC-P08 — Prepare a Board/Council-Ready Decision Summary
- **Screen/state:** `R01`
- **Entry:** contextually from issue or action (S8A F04 — not top-level nav)
- **Interaction:** scan the brief; simulated Export PDF
- **Data:** derived from `issues` + `evidence` + `actions` + `costBenchmark`
- **Result:** scanning-first decision brief (F08)
- **9A2 area:** panel 08
- **Mechanism:** print-friendly CSS section; Export triggers a simulated
  confirmation, **not** a real download

### UC-P09 — Demonstrate Evidence-Backed Closure
- **Screen/state:** `C01`, `C02` — secondary, outside the 2-minute story (F12)
- **Entry:** from an Assigned/In-Progress action
- **Interaction:** view completion note + evidence -> see changed attention state
- **Data:** `actions`, `photos`, `evidence`
- **Result:** attention state changes; prior history preserved
- **9A2 area:** panels 18, 18A, 18B
- **Mechanism:** state transition + re-render; history array never truncated

---

## 5. 9A2 screen / state inventory

Reconciled across the S9A2 §4 inventory, the S10A §4 build inventory, the
HANDOFF §3 feature list and the contact-sheet OCR. **22 states.**

| ID | State | Contact sheet | Kind |
|---|---|---|---|
| E01 | Prototype Access / Viewer Identification | 01 | Page |
| E01-V | Inline validation | (variant of 01) | Variant |
| A01 | Attention / Property Health landing | 02 | Page |
| IW01 | Issue workspace — Why / Context | 03 | Section |
| IW02 | Issue workspace — Evidence | 04 | Section |
| IW03 | Issue workspace — Action | 05 | Section |
| IW03-A | Assign overlay | 06 | Overlay |
| IW03-D | Defer acknowledgement overlay | 07 | Overlay |
| R01 | Board / Council Decision Summary | 08 | Page |
| P00 | Property Summary / status by area | 09 | Page |
| D01 | Sample Document — Select / Upload | 10 | Page |
| D01-P | Document Processing | 11 | State |
| D01-F | Processing Failed / Retry | 11A | Variant |
| D02 | Review Extracted Intelligence | 12 | Page |
| D02-E | Candidate Edit / Confirmed | 12A | Variant |
| EV-P | Evidence Source Preview / photo detail | 13 | Overlay |
| I01 | Field Inspection — Capture / Select Photo | 14, 15 | Responsive |
| I02 | Associate Asset | 16 | Responsive |
| I03 | Observation | 16 | Responsive |
| I04 | Resulting Attention | 17, 17A | Page |
| C01 | Work Status / Completion | 18, 18A | Page |
| C02 | Closed-Loop Result | 18B | Page |

Cross-cutting furniture: compact left rail (Attention / Property / Evidence /
Action, F01); `Property > Asset > Issue` context breadcrumb; sticky
Why/Evidence/Action anchors (F03); "What does this mean?" panel (F05);
**Reset Demo** control.

Contact-sheet legends confirm required visual elements: health indicators,
building/location visual, timeline (historical + now + due), evidence photos &
quality, act-now-vs-defer graph, status-by-area bars, photo-aware workflow,
3-step responsive inspection.

---

## 6. V1 reference reconciliation

Reviewed the live site through the gate (`Unique ID = Vancouver`, placeholder
identity — no real personal data submitted). **v1 is reference only and 9A2
wins on every point of difference.**

**Worth retaining (content and wording, not architecture):**
- The gate's three fields and the honest framing: *"Uses synthetic demonstration
  data only"*, *"Your details are recorded only for this research session."*
- Attention page voice: *"What needs your attention"*, *"Priority attention —
  Ranked by urgency, consequence, and evidence quality"*.
- Issue phrasing that matches the canonical envelope scenario:
  *"Roof membrane condition is unknown"* with *"Recent moisture staining has not
  been assessed."*
- A genuine conflicting-evidence item: *"Elevator maintenance evidence conflicts —
  the service log and contractor invoice show different completion dates."*
  This is a ready-made S8A §20 edge case.
- Presence of a **Reset demo** control and a **Decision brief** entry point.

**Where v1 differs from 9A2 — follow 9A2:**
- v1 shows five *labelled counters* (Needs attention 61 / On track 84 / 2 issues 56 /
  Gap flagged 49 / Incomplete 58). 9A2 specifies five *property-health indicators*:
  **Overall / Compliance / Maintenance / Money / Evidence**. Use 9A2's set.
- v1 leads with a portfolio workspace header ("Coastal Property Management",
  "2 of 9 properties need attention"). 9A2 + S8A F07 require **hero-property-first**
  with portfolio reduced to a contextual strip.
- v1 has no visible building/location visual, timeline graphic, act-now-vs-defer
  graph or status-by-area bars. All four are **required** by 9A2.

**Do not copy:** ChatGPT Sites page architecture, its scroll/layout behaviour
(the page scrolled erratically during review), or its portfolio-first framing.

**Missing from v1, required in v2:** the continuous anchored issue workspace,
Assign/Defer overlays, source-preview overlay, the full document companion
including the failure/retry and candidate-edit variants, the responsive
inspection sequence, and the completion / closed-loop states.

---

## 7. Proposed file structure

```
/
  index.html              Single shell. All 21 states as <section> / <dialog>.
                          Semantic landmarks, left rail, context header.
  styles.css              Design tokens (CSS custom properties), layout,
                          components, responsive + print rules.
  app.js                  State machine, hash router, data load, render
                          functions, action handlers, reset.
  data/
    prototype.json        THE canonical dataset. Single source of truth.
  assets/
    images/               Property, evidence, inspection, completion imagery.
    icons/                One inline SVG sprite (icons.svg).
  docs/
    IMPLEMENTATION_PLAN.md   This document.
    DEMO_SCRIPT.md           2–5 minute guided walkthrough (Wave 7).
    design/                  9A2 + 9A1 contact sheets, committed for QA.
  README.md
  .gitignore
```

Eleven tracked paths. No `package.json`, no config files, no build output.

**Responsibilities.** `index.html` holds all markup; states are shown/hidden via
the `hidden` property, overlays are native `<dialog>`. `styles.css` is one file
with a token block at the top so 9A2's palette lands in one place.
`app.js` is one file in five clearly commented blocks — DATA, STATE, RENDER,
ACTIONS, ROUTER.

**One flag:** if `app.js` passes roughly 1,500 lines during Wave 4 I will ask
before splitting a `views.js` off it. I would rather raise it than silently
fragment the code or silently let one file get unreadable.

**Why single-page.** S8A §18 requires the selected issue to stay contextually
persistent across Why/Evidence/Action, and F02/F03 require one *continuous*
workspace with anchors rather than separate pages. Separate HTML files would
fight that and would duplicate the dataset across pages — which §14 of the brief
forbids. Hash routing also means Cloudflare needs no SPA fallback rule.

---

## 8. Local JSON / data model

One file, `data/prototype.json`, stable IDs, explicit relationships.

```
portfolio     { id, name, propertyCount, needingAttention, highRisk,
                upcomingObligations }

properties[]  { id: "PROP-HH-001", name: "Harbour Heights",
                city: "Vancouver, BC", units, yearBuilt, storeys, heroImage,
                health: { overall, compliance, maintenance, money, evidence },
                areas: [ { name, status, pct } ] }        // status-by-area bars

assets[]      { id: "AST-ENV-N", propertyId, name: "Building Envelope —
                North Elevation", type, condition: "Unknown", lastVerified }

obligations[] { id: "OBL-001", propertyId, title, authority, dueDate,
                dueInDays: 24, recurrence, nextOccurrence }

issues[]      { id: "ISS-001", propertyId, assetId, obligationId, title,
                severity, isHero: true, oneLineReason, whyItMatters,
                consequence, uncertainty, history[],
                evidenceIds[], photoIds[], actionId,
                exposure: { low: 85000, high: 140000, currency: "CAD" },
                funding: { reserveBalance, gap },
                actNowVsDefer: { actNow[], defer[], unit } }

evidence[]    { id: "EV-001", issueId, documentId, snippet, date, sourceType,
                state: Verified|NeedsReview|Conflicting|Missing|Unknown,
                confidence, photoIds[] }

documents[]   { id: "DOC-001", name, type, date, pages, previewImage,
                previewExcerpt }

photos[]      { id: "PH-001", assetId, src, alt, caption, capturedAt,
                kind: inspection|evidence|completion }

owners[]      { id: "OWN-001", name: "Jordan Lee", role: "Property Manager",
                kind: internal|vendor }

actions[]     { id: "ACT-001", issueId, title, rationale, ownerId,
                targetDate: "2026-09-30",
                status: Recommended|Assigned|InProgress|Completed,
                cost: { low: 4000, high: 7000 }, riskOfDeferral,
                evidenceIds[], completion: { note, photoId, completedOn, by } }

costBenchmark { issueId, expectedRange, exampleQuote, verdict:
                within|above|below, source, assumptions, confidence }

candidates[]  { id: "CND-001", documentId,
                category: fact|asset|obligation|risk|gap,
                label, value, confidence, sourceSnippet,
                state: Candidate|Confirmed|EditedConfirmed|Rejected|DeferredReview }

inspection    { assetChoices: [assetId], samplePhotoId, observation,
                resultingIssueId }

access        { uniqueIdLabel: "Unique ID", uniqueIdValue: "Vancouver",
                caseSensitive: true }
```

**Reconciliation rule.** Nothing is duplicated. `R01` and `C01` render from the
same `issues` / `evidence` / `actions` objects the workspace uses, so property
name, asset name, dates, evidence state, severity, source names, cost figures,
owner and action status cannot drift between screens.

**Referential integrity.** Every `*Id` resolves. I will add a small dev-only
console assertion in Wave 0 that walks the graph on load and logs any dangling
reference — no test framework, roughly twenty lines.

---

## 9. Client-side state model

Three layers.

**Canonical (immutable):** `data/prototype.json`, fetched once, never mutated.

**Session (`localStorage`, key `strata.v2.session`):** `{ name, email, enteredAt }`.
Justified — it prevents re-entering the gate on every reload during a live demo.

**Demo mutations (`localStorage`, key `strata.v2.state`):** a small overlay
object, not a copy of the dataset:

```json
{
  "actions":    { "ACT-001": { "status": "Assigned", "ownerId": "OWN-002" } },
  "candidates": { "CND-003": { "state": "EditedConfirmed", "value": "$2,400" } },
  "issues":     { "ISS-004": { "created": true } },
  "inspection": { "completed": true },
  "route":      "#/issue/evidence"
}
```

Rendering always reads `canonical` merged with `overlay`. Everything else —
current route, open dialog, scroll anchor, processing timers — is plain
in-memory JavaScript and deliberately not persisted.

**Reset Demo** is always reachable from the left rail. It removes
`strata.v2.state`, clears timers, and re-renders from canonical. Whether it also
clears the session is a small choice: I propose it **keeps** the session so a
facilitator resetting mid-demo is not thrown back to the gate, with a separate
"Exit prototype" for the full reset. Flagged in §18 as a minor confirm.

---

## 10. Interaction plan

| Interaction | State change | Visible result |
|---|---|---|
| Submit entry form | write session; route `A01` | Attention landing |
| Invalid email / blank field | none | Inline native validation |
| Wrong Unique ID | none | Inline "Unique ID not recognised" |
| Select attention card | `selectedIssueId`; route `#/issue/why` | Workspace opens at Why |
| Why / Evidence / Action anchor | route hash + scroll | Sticky anchor active state |
| "What does this mean?" | toggle panel | Small explanation popover |
| Open evidence source | open `EV-P` dialog | Source preview + snippet |
| Open photo | open `EV-P` in photo mode | Enlarged photo + caption |
| **Confirm** action | `status: Recommended -> Assigned` | Status badge changes everywhere |
| **Assign** | open `IW03-A`; on submit set `ownerId` + `Assigned` | Owner shown on action, R01, A01 |
| **Defer** | open `IW03-D`; capture reason; keep issue **open** | "Deferred — issue remains open" |
| Open Decision Summary | route `R01` | Scanning-first brief |
| Export PDF | none | Simulated confirmation, no download |
| Select sample document | route `D01-P`; start timers | Stepped processing |
| Simulate upload | read filename only | Same processing path |
| Force failure | route `D01-F` | Failure + Try Again / Choose Another |
| Retry | restart timers -> `D02` | Recovers, never a dead end |
| Candidate **Confirm** | `Candidate -> Confirmed` | Card restyles as confirmed |
| Candidate **Edit** | inline edit -> `EditedConfirmed` | Edited value + edited marker |
| Candidate **Reject** | `-> Rejected` | Greyed, **provenance retained** |
| Candidate **Defer** | `-> DeferredReview` | Marked for later |
| Inspection photo -> asset -> observation | step index advances | 3-step responsive stepper |
| Inspection result | create `ISS-00x` | `I04` new attention item |
| Complete work | `-> Completed` + evidence | `C01` completion record |
| View closed loop | recompute attention | `C02` changed state, history intact |
| **Reset Demo** | drop overlay | Canonical baseline restored |

State rules enforced in code, per S8A §19 and S10A §7: Unknown stays Unknown;
Conflicting stays visibly unresolved until reviewed; failure is always
recoverable; reject/defer preserves provenance; completion never erases history.

---

## 11. Visual implementation strategy

Every 9A2 visual concept, and how it is built. **Zero dependencies.**

| 9A2 concept | Implementation |
|---|---|
| Compact left rail (F01) | `<nav>` + CSS Grid shell; collapses to a bottom bar under 768px |
| Five health indicators (F02) | Inline SVG donut per indicator — `<circle>` + `stroke-dasharray`; numeric value and text label always rendered, never colour-only |
| Building / location visual | Property photo + absolutely positioned `%`-coordinate hotspots; `<figure>`/`<figcaption>` |
| Status-by-area bars | Flex rows + `<meter>`-style divs with `width: %`; label + value text |
| Timeline (historical + now + due) | Inline SVG: one axis line, discrete `<circle>` markers, `<text>` labels. Deterministic, authored from data |
| Act-now-vs-defer graph | Inline SVG, two `<polyline>` series over a light grid, built from `actNowVsDefer` arrays. **No chart library** |
| Evidence-quality treatment | Badge with distinct **icon shape per state** + text, plus a small confidence bar — never colour alone |
| Severity pill (F04) | Restrained pill; issue statement keeps dominant weight |
| Photo strip | Flex row, `scroll-snap-type: x`, lazy `loading="lazy"` |
| Source / photo preview (EV-P) | Native `<dialog>` — free focus trap, Esc, backdrop |
| Assign / Defer overlays | Native `<dialog>` + `<form method="dialog">` |
| Processing states | CSS `@keyframes` progress + deterministic `setTimeout` step list |
| Candidate review cards (F09) | Card grid; confirmed vs candidate differ by border, background **and** an explicit state label |
| Decision brief (F08) | Single-column scanning layout + `@media print` rules |
| Responsive inspection | CSS `clamp()` + a media query; on desktop, wrapped in a phone frame so the narrow layout reads as intentional |
| Icons | One `assets/icons/icons.svg` sprite, referenced by `<use>` |
| Type | System font stack (`-apple-system, Segoe UI, Roboto…`) — no webfont fetch, no external request |

**Nothing here needs a dependency.** The two graphs are the only candidates and
both are simple enough to author as static SVG paths generated from the dataset.
I recommend against adding any library.

Design tokens live in one `:root` block — colour, spacing scale, radii, type
scale, severity and evidence-state colours — so the 9A2 palette is applied in a
single place once §17.1 is done.

---

## 12. Asset plan

**Available now:** the 9A2 and 9A1 contact sheets (for QA reference, to be
committed under `docs/design/`). Nothing else.

**Needed, and not currently in Drive:**

| Asset | Used by | Status |
|---|---|---|
| Harbour Heights exterior | A01, P00, building visual | **Missing** |
| North elevation / envelope — moisture staining | IW01, IW02 evidence photos | **Missing** |
| 1–2 further envelope evidence photos | IW02 photo strip | **Missing** |
| Elevator Car 1 — oil leak at base | I01–I03 inspection | **Missing** |
| Completion evidence photo | C01 | **Missing** |
| Document page preview | EV-P, D01 | **Missing** |
| Icon set (~15 glyphs) | Throughout | **To author** — inline SVG sprite, trivial |

The design is explicitly *photo-aware* (9A1's whole premise; S9A2 §3: "inspection
photos are evidence where available"), so photographs carry real meaning here —
this is exactly the case the brief says to flag rather than paper over with
decorative stock imagery.

**Two options, your call (§18):**

- **A — Real photographs (recommended for demo credibility).** You supply, or
  approve sourcing of, six royalty-free images. Highest fidelity to 9A1/9A2
  intent. Needs a licensing decision.
- **B — Authored SVG/CSS photo panels.** I author schematic illustrations styled
  as captioned evidence photos. Zero licensing risk, fully deterministic, but
  visibly not photography — which measurably weakens the photo-aware evidence
  story with real prospects.

I recommend **A**, with **B** as the interim so Waves 1–6 are never blocked:
build against placeholders, swap in real images at Wave 7.

---

## 13. Build sequence

Aligned to S10A §12 and its epics P10-01 … P10-12. The brief's proposed waves
and S10A's already agree; no adjustment needed.

**Wave 0 — Foundation.** Resolve §18 discrepancies. Freeze `prototype.json`
against HANDOFF §6. Complete the 9A2 pixel pass (§17.1). Author design tokens,
icon sprite, route/state names, referential-integrity check. *(P10-01, P10-02)*

**Wave 1 — Shell and entry.** `index.html` skeleton, left rail, context header,
`E01` + validation, `A01` with health indicators and attention cards, `P00`.
*(P10-03, P10-06)*

**Wave 2 — Issue workspace.** `IW01`/`IW02`/`IW03` as one continuous anchored
workspace; timeline, act-now-vs-defer graph, photo strip, evidence cards;
`IW03-A`, `IW03-D`, `EV-P`. *(P10-04)*

**Wave 3 — Decision Summary + core certification.** `R01`; then certify the full
Viewer -> Attention -> Why -> Evidence -> Action -> Summary walkthrough end to end.
**Gate: S10A F02 requires the core story certified before companions.** *(P10-05)*

**Wave 4 — Document companion.** `D01`, `D01-P`, `D01-F`, `D02`, `D02-E`. *(P10-07)*

**Wave 5 — Inspection companion.** `I01`–`I04`, responsive narrow layout. *(P10-08)*

**Wave 6 — Optional closure.** `C01`, `C02`. *(P10-09)*

**Wave 7 — Hardening and release.** Responsive reconciliation, accessibility,
edge states, Reset Demo verification, real assets swapped in, 9A2 visual QA,
`DEMO_SCRIPT.md`, Cloudflare deployment and smoke check. *(P10-10, P10-11, P10-12)*

---

## 14. QA strategy

Manual only — S10A F10 explicitly exempts the Prototype from automated testing.

**Use-case coverage.** A checklist walking UC-P01…UC-P09 against §4 of this
document. Every use case must be demonstrable without developer intervention.

**9A2 visual fidelity.** Side-by-side against the committed contact sheet, state
by state, all 21. Pass condition from S10A §13: hierarchy matches closely enough
to serve the same comprehension goal.

**Data consistency.** The reconciliation test: pick property name, asset name,
due date, evidence state, severity, source names, cost figures, owner and action
status; confirm each is identical on A01, IW01–03, R01, P00, C01 and C02. Then
Assign and re-check that the change propagates everywhere.

**Interaction and state.** Every row of §10. Explicitly including: Defer does not
imply completion; Reject preserves provenance; Unknown stays Unknown; retry
recovers; completion preserves history.

**Reset.** Mutate every mutable thing, Reset Demo, confirm exact canonical baseline.

**Responsive.** Desktop 1440/1280, tablet 1024/768, narrow 390 for inspection.
No horizontal scroll on the core story.

**Browsers.** Current Chrome, Edge, and Safari where available (S10A F11). Note:
this is a Windows machine — Safari verification is an Edwin action or needs a
Mac/BrowserStack. Flagged in §17.

**Accessibility.** Keyboard-only pass through the core story; visible focus;
labels on every control; contrast check; and a specific check that **no status
meaning is carried by colour alone**.

**No hidden dependency.** Two hard checks:
- DevTools Network panel shows **only** same-origin requests — no CDN, no font,
  no analytics, no API.
- `git ls-files` contains no `package.json` / lockfile; the repo runs correctly
  straight from `python -m http.server` with no install step.

**Deployment.** Cloudflare preview URL renders identically to local; hard refresh
on a deep hash route works; Reset Demo works on the deployed build.

---

## 15. Git / GitHub setup status

All verified this session:

- Git **2.54.0** installed. GitHub CLI **2.95.0** installed.
- `gh auth status`: logged in as **`icecooled00`**, scopes `repo`, `workflow`,
  `read:org`, `gist`, `delete_repo`. **No action needed from you.**
- Repository cloned into
  `C:\Users\paked\OneDrive\CoWorkProjects\strata-property-intelligence-prototype-v2`.
- Remote `origin` correct; repository confirmed **empty**.
- Branch is **`main`**. Single branch only, per S10A F03. No other branches created.
- Python **3.14.6** available for `python -m http.server`. Node 24 present but
  **will not be used**.
- Created this session, planning artifacts only: `.gitignore`, `README.md`,
  `docs/IMPLEMENTATION_PLAN.md`.

**Not yet committed or pushed.** I have deliberately left that for your word.

---

## 16. Cloudflare Pages setup instructions

Verified against Cloudflare's current Git-integration documentation. **This is an
external action requiring your account — I have not performed any part of it.**

1. Sign in at **dash.cloudflare.com** and select your account.
2. Left sidebar -> **Workers & Pages**. (On newer dashboards this sits under
   **Compute** -> **Workers & Pages**.)
3. **Create application** -> the **Pages** tab -> **Connect to Git**.
4. Authenticate with GitHub. Cloudflare installs the **Cloudflare Pages** GitHub
   App — choose **Only select repositories** and pick
   **`icecooled00/strata-property-intelligence-prototype-v2`**. Click
   **Install & Authorize**, then **Begin setup**.
5. Configure:
   - **Project name:** `strata-property-intelligence-prototype-v2`
     (this becomes `<project-name>.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** **None**
   - **Build command:** **leave completely empty** — Cloudflare's own docs say to
     leave it blank when no build step is needed
   - **Build output directory:** `/`  (the repository root)
6. Do **not** add environment variables. Do **not** add a custom domain.
7. **Save and Deploy.**

Result: `https://strata-property-intelligence-prototype-v2.pages.dev`. Every push
to `main` redeploys automatically.

**If the UI differs:** the only settings that matter are *production branch =
main*, *no build command*, and *output directory = repository root*. If a newer
dashboard pushes you toward "Workers" with static assets instead of Pages, that
also works for this site — but Pages is the simpler match and needs no config
file. **There is no correct configuration that introduces a build step.** If
Cloudflare rejects an empty build command, enter `:` (a no-op) rather than
adding a real build.

No `_redirects` or `_headers` file is needed: hash routing means every URL
resolves to `/index.html` natively.

---

## 17. Required manual actions from you

### Claude can do without you
Build every screen, style, script and dataset; run local preview; verify Chrome
and Edge; commit; push (once you say so); author the demo script.

### Edwin must do

**17.1 — Make the 9A2 contact sheet readable as an image.** *(blocks Wave 0)*
Easiest path: open
`https://drive.google.com/file/d/1kgqEekY6wW7DiP2jS-pS99w8FYYuasdM/view`,
download the PNG, and drop it into
`...\strata-property-intelligence-prototype-v2\docs\design\`.
Please do the same for the 9A1 backstop
(`12yy4h4P0PXqQxNKrbjnlCVF-jXtsE6_I`). I will then read both directly, commit
them as the QA baseline, and complete the visual pass.
*Alternative:* reconnect the Claude-in-Chrome extension and I will read them from
Drive myself.

**17.2 — Decide the photographic assets.** §12, option A or B.

**17.3 — Resolve the discrepancies in §18.** Particularly 18.1.

**17.4 — Cloudflare Pages.** All of §16. Requires your login and your
authorisation of Cloudflare's GitHub App. I will not initiate it.

**17.5 — Safari verification.** This is a Windows machine. Either you check the
deployed URL on a Mac/iPad, or we record Safari as unverified.

**17.6 — Approve the push.** Say the word and I will commit and push the
planning artifacts to `main`.

---

## 18. Risks and open questions

### 18.1 — Hero scenario conflict — ✅ RESOLVED

> **Decision D1:** envelope hero confirmed. 9A2 governs layout; HANDOFF §6 governs content.
> The elevator is retained as a secondary conflicting-evidence attention item and as the
> field-inspection companion subject, so panels 14–17A are built exactly as drawn. Frozen
> dataset in [`WAVE0_DECISIONS.md`](WAVE0_DECISIONS.md) §2. The original analysis follows,
> with one correction: S6A §8 says "Recommended shape," not "requires."

The 9A2 contact sheet's **on-image sample content** describes a different
scenario from the **canonical dataset**.

| | 9A2 contact sheet | HANDOFF §6 canonical |
|---|---|---|
| Property | Greenview Towers, Vancouver BC, 134 units | **Harbour Heights** |
| Hero issue | Elevator Inspection Overdue | **Building Envelope Inspection** |
| Owner | Building Manager (Jane) | **Jordan Lee — Property Manager** |
| Due | in 26 days | **24 days** |
| Cost | $1,600–$2,400 | **$85K–$140K** repair / **$4K–$7K** assessment |

Three things point the same way:

- HANDOFF §6 is explicitly titled *canonical* and explicitly forbids substitution.
- **S6A §8 independently requires a "roof or building-envelope concern."** The
  elevator scenario does not satisfy the frozen hero-scenario requirement; the
  envelope scenario does.
- The contact sheet's own values are internally inconsistent — "May 25, **2005**",
  "May 25, **2035**", "$1,000–$2,400" beside "$1,600–$2,400",
  "Inspection Report_**2008**.pdf" beside "Inspection **2024**.pdf". These read as
  mockup filler, not governed data.

**Recommended (conservative, no redesign):** **9A2 governs layout, composition,
hierarchy and the state inventory. HANDOFF §6 governs every content value.**
Rebuild the 9A2 panels exactly as designed, populated with Harbour Heights /
building envelope data.

This costs nothing structurally, and it reconciles neatly: the **elevator**
survives where 9A2 actually uses it — as the **inspection companion subject**
(`Elevator — Car 1`, "minor oil leak at base") and as a secondary
conflicting-evidence attention item, which v1 already words well. Nothing in the
design is discarded.

**Please confirm.** If you instead want the elevator scenario as the hero, that
contradicts S6A §8 and needs a controlled amendment.

### 18.2 — Portfolio Overview page — ✅ RESOLVED

> **Decision D7:** portfolio is deferred to a later delivery and omitted from Prototype v2
> entirely — neither a strip nor a page. This resolves the S8A F07 / HANDOFF §4 tension more
> firmly than either source. The `portfolio` object stays in the dataset, unrendered.
> See [`WAVE0_DECISIONS.md`](WAVE0_DECISIONS.md) §1 D7 for the UC-P02 traceability note.

S8A **F07 (accepted)**: "*do not add a separate Portfolio screen in the
Prototype*." HANDOFF §4: "*A Portfolio Overview page is allowed … as a secondary
destination.*"

**Recommended:** follow **S8A F07** — contextual strip only, no separate page.
S8A is the frozen UX authority and sits above a handoff note in the hierarchy;
it is also the more conservative reading. Easy to add later if you disagree.

### 18.3 — Health indicator semantics — ✅ RESOLVED

> **Decision D3:** F02 labels — Overall 71 / Compliance 78 / Maintenance 64 / Money 82 /
> **Evidence 38 ⚠**. Evidence is deliberately the weakest indicator and carries a visual cue
> so the landing screen telegraphs the evidence gap. Original analysis follows; the sheet's
> own labels, now legible, are *Overall / Envelope / Assets / Safety / Operations*.

The contact sheet shows five numbers (78 / 62 / 54 / 71 / 46) but its OCR'd
labels are unclear ("Overall", "Sty", "Operations"). S9A2 F02 names the set
authoritatively: **Overall / Compliance / Maintenance / Money / Evidence**. I will
use F02's labels and set values consistent with the canonical scenario. Confirm
during the §17.1 visual pass.

### 18.4 — Reset Demo and the session *(minor)*
See §9. Proposal: Reset keeps the viewer session; a separate "Exit prototype"
clears it.

### 18.5 — Contact-sheet panel numbering *(informational)*
OCR shows a "19" that is probably a misread "15". I am following S9A2's
controlled reconciliation list (`11A`, `12A`, `17A`, `18A`, `18B`), not the OCR.
Confirmed at §17.1.

### 18.6 — Risks
- *Visual fidelity is the main delivery risk*, entirely because of §17.1. Mitigated
  by front-loading the visual pass into Wave 0 and centralising design tokens.
- *Scope creep toward MVP* — mitigated by §19.
- *Asset gap* — mitigated by building against placeholders from Wave 1.

---

## 19. Explicitly NOT implementing

Out of scope by S5A §5, S6A §23 and S8A §29, and deliberately excluded:

Real authentication, SSO, RBAC, accounts, tenant security. Any backend, database,
API or serverless function. Real document processing, OCR, ingestion or
production AI. Real computer vision or image analysis. Real file upload — the
file input reads filename and size only and nothing leaves the browser. Real PDF
generation — Export is simulated. Real notifications, email or calendar
integration. Real cost-benchmark database or quote ingestion. Full portfolio
analytics, dashboards, benchmarking or KPI suites. Full capital planning, reserve
modelling or multi-year forecasts. Full document library, asset register or
obligation rule engine. Project management, scheduling, dependencies or workload
balancing. Vendor management. Billing, payments or subscriptions. Support desk or
ticketing. Governance, meetings or voting. Report builder. Admin or settings
areas. A native mobile app — the inspection flow is responsive web only. Manager
handoff as a standalone use case. Chatbot-first AI — the explanation affordance
is on-demand and background.

And technically excluded per the brief: React, Vue, Angular, Svelte, Next.js,
Node application frameworks, TypeScript, npm dependencies, CSS frameworks, UI
component libraries, charting libraries, state-management libraries, Docker, and
any build, compile or transpile step.

**Also not implementing without your approval:** a separate Portfolio page
(§18.2), and automated tests (S10A F10 exempts the Prototype).

---

## 20. Final readiness recommendation

**Ready to build, subject to three inputs.**

The product picture is complete and unambiguous. All five governing documents
plus the HANDOFF were read in full. All nine S5A use cases trace to concrete
states with concrete mechanisms. All 22 9A2 states are inventoried. The data
model reconciles across every screen. The stack meets the brief exactly — HTML,
CSS, vanilla JS, local JSON, `localStorage`, no build, deploys from the
repository root. The Vancouver requirement is resolved and documented.

The three inputs:

1. **§17.1** — the 9A2 image, so visual fidelity is verified rather than inferred.
2. **§18.1** — confirm 9A2-for-layout / canonical-data-for-content.
3. **§12** — the photographic asset decision.

Given those, Wave 0 through Wave 3 delivers a certified core walkthrough, and
Waves 4–7 complete the companions and hardening.

I recommend approving items 1–3 together, and authorising the push of these
planning artifacts to `main`.

---

**PLANNING COMPLETE — AWAITING FOUNDER APPROVAL TO BEGIN PROTOTYPE V2 BUILD**
