# WAVE 0 — FOUNDER DECISIONS AND FROZEN CANONICAL DATASET

Date: 2026-09-03
Status: **RESOLVED — Wave 0 data freeze ready**

Supersedes the open questions in `IMPLEMENTATION_PLAN.md` §18.1, §18.3 and §12.

---

## 1. Decisions resolved

### D1 — Demo story
**Envelope hero, elevator retained as side story.**

- Primary demo: **Harbour Heights**, Building Envelope — North Elevation, condition Unknown.
- The elevator appears in two places, both of which preserve 9A2 exactly:
  - a secondary **"Elevator maintenance evidence conflicts"** attention item, which also
    satisfies the S8A §20 requirement for a two-sources-conflict edge case;
  - the **field-inspection companion** (panels 14–17A) built exactly as the sheet draws it,
    machine-room photograph included.
- 9A2 governs layout, composition, hierarchy and state inventory.
  HANDOFF §6 governs content values.

### D2 — Entry screen
**All fields are data-capture only. Unique ID is the sole gate.**

- Fields: **Full name**, **Email address**, **Unique ID**.
- Only Unique ID is checked, against the exact case-sensitive string `Vancouver`.
- Name and email are recorded for UC-P01 with no validation gating.
- 9A2's split-screen composition is kept: dark navy brand panel left, building
  photograph right, centred form card.
- **No field is labelled "Password."** The masked input is the Unique ID, exactly as v1
  does it. Rationale: a password-labelled input invites people to type a real credential,
  and this prototype writes what it captures to plain `localStorage`. Same visual, nothing
  sensitive collected.

### D3 — Health indicators
**S9A2 F02 labels, with Evidence scored lowest and visually cued.**

| Overall | Compliance | Maintenance | Money | Evidence |
|---|---|---|---|---|
| 71 | 78 | 64 | 82 | **38** ⚠ |

The landing screen telegraphs the evidence gap before any card is clicked; the viewer then
finds the envelope condition is Unknown *because* the supporting evidence is stale.

### D5 — Typography
**Self-host the matching typeface as woff2 in `assets/fonts/`.**

Served from our own origin, so the "no external request" QA check still passes. Roughly
120 KB of binary in the repo, accepted for the fidelity gain.

> **Open sub-item:** the exact face on the contact sheet has not been confirmed. It reads as
> Inter or a close geometric UI sans, but I will identify it from the committed PNG before
> choosing what to self-host, rather than guessing. OFL or similarly redistributable licence
> is a hard requirement.

### D6 — Cloudflare Pages project name
**`strata-property-prototype`** → <https://strata-property-prototype.pages.dev>

**Connected and deployed 2026-09-03.** The project was created as
`strata-property-prototype` rather than the originally proposed `strata-prototype`;
the deployed name is authoritative.

Verified on the live build: site loads, `prototype.json` fetches over HTTPS, the
referential-integrity check passes, deep hash routes resolve on hard refresh, and
every network request is same-origin. No build step; the repository root is served
directly.

Deployment note: Cloudflare returns **200 with an HTML fallback** for missing asset
paths rather than 404, so the image placeholders currently appear because image
*decode* fails rather than because the request does. Behaviour is correct either way,
and the point becomes moot once the photographs land.

### D7 — Portfolio context
**Deferred to a later delivery. Omit from Prototype v2 entirely.**

No portfolio strip, no portfolio page, no portfolio counts anywhere in the UI. The Attention
screen leads directly with Harbour Heights, exactly as 9A2 panel 02 draws it.

> **Traceability note.** S5A UC-P02 says the operator "can see light portfolio context
> **where relevant**," and S6A §22 / S8A §17 permit it. The "where relevant" qualifier carries
> this omission, and 9A2 panel 02 — the primary visual authority — draws no portfolio cue.
> Recording it here so the record shows a deliberate founder decision rather than an
> oversight during use-case traceability review.
>
> This also settles `IMPLEMENTATION_PLAN.md` §18.2 (S8A F07 vs the HANDOFF §4 allowance) more
> firmly than either source: neither a strip nor a page.
>
> The `portfolio` object **stays in `prototype.json`** but is never rendered, so a later
> delivery is a rendering change with no data migration.

### D8 — Design tokens
**Sample exact values from the committed PNG.**

Edwin commits `Strata_9A2_CONTACT_SHEET_FINAL_WEB.png` to `docs/design/`. Pillow is installed
locally as a throwaway dev utility — never committed, never part of the site, no effect on the
zero-dependency rule — and used to pull exact hex for every token plus measured spacing, radii
and bar heights. The sheet then lives with the code as the Wave 7 QA baseline.

Until that lands, the approximations in §3 below stand.

### D4 — Photography
**Match the sheet's modern warm look.** See `PHOTO_PROMPTS.md`.

Recorded deviation: S6A §8 offers "older high-rise" as a **Recommended shape**, not a
requirement, so a contemporary tower stays inside frozen scope. The pairing is deliberate —
an immaculate-looking building whose envelope condition is Unknown is a stronger
demonstration than a visibly neglected one. Glossy warm hero photography; tight, unglamorous
evidence close-ups of the same building.

---

## 2. Frozen canonical dataset

Every value below is authoritative. No screen may show a different figure.

### Portfolio (light context only — contextual strip, no separate page)
```
name                 Coastal Property Management
propertyCount        18
needingAttention     3
highRisk             1
upcomingObligations  7
```

### Hero property
```
id                   PROP-HH-001
name                 Harbour Heights
city                 Vancouver, BC
units                134
yearBuilt            2009
storeys              22
health               overall 71 · compliance 78 · maintenance 64 · money 82 · evidence 38
```

### Status by area (P00 and A01 bars)
```
Roof                 86%   Good
Envelope             42%   Poor      <- hero asset
Elevators            55%   Fair
Fire/Life Safety     85%   Good
Plumbing             70%   Fair
Site                 75%   Fair
lastUpdated          Sep 3, 2026
```

### Assets
```
AST-ENV-N   Building Envelope — North Elevation   condition Unknown   lastVerified 2023-06-15
AST-ELV-1   Elevator — Car 1 (Main Lobby)         condition Fair      lastVerified 2026-08-12
```

### Attention items (6, matching the sheet's "Top Attention (6)")
```
ISS-001  HIGH    Building envelope condition is unknown      Due in 24 days   AST-ENV-N
ISS-002  MEDIUM  Elevator maintenance evidence conflicts     —                AST-ELV-1
ISS-003  MEDIUM  Fire Alarm Test                             Due Oct 10, 2026
ISS-004  LOW     Garage Drainage                             Due in 32 days
ISS-005  LOW     Backflow Test                               Due Sep 30, 2026
ISS-006  LOW     Irrigation Audit                            Due Oct 15, 2026
```

### Hero issue — ISS-001
```
title             Building envelope condition is unknown
asset             Building Envelope — North Elevation
obligation        OBL-001 Building Envelope Condition Assessment
severity          High
dueDate           2026-09-27          (24 days from Sep 3, 2026)
condition         Unknown / not verified
whyItMatters      Recent moisture staining on the north elevation has not been assessed.
                  The last envelope condition assessment is from 2023, and no verification
                  has been carried out since. Condition cannot be confirmed either way.
consequence       Undiagnosed envelope water ingress progresses; remediation cost rises
                  with delay, and the assessment obligation date is missed.
uncertainty       Condition Unknown pending assessment. Repair exposure is an
                  order-of-magnitude estimate only.
exposure          $85,000 – $140,000        confidence LOW  (pending assessment)
funding           reserve $310,000 · no allocated envelope provision · gap if upper bound
```

### Timeline markers (IW01, four markers as drawn)
```
2023             Envelope Condition Assessment
2024             Sealant maintenance (partial, north face only)
Now              Evidence 1,176 days old
Due in 24 days   Assessment obligation
```

### Recommended action — ACT-001
```
title             Commission Building Envelope Assessment
rationale         Establish actual condition before the obligation date so the repair
                  decision rests on evidence rather than an estimate.
owner             OWN-001 Jordan Lee — Property Manager
targetDate        2026-09-27
status            Recommended        (baseline; mutates to Assigned / In Progress / Completed)
cost              $4,000 – $7,000    confidence HIGH   (routine engagement)
riskOfDeferral    Obligation date missed; exposure estimate stays unverified.
completionTarget  2026-09-30
```

> **Two costs, two confidences.** The assessment ($4K–$7K, High) is a routine, well-priced
> engagement. The repair exposure ($85K–$140K, Low) is unverifiable until the assessment is
> done. This is the visible-uncertainty treatment S6A §19 and S8A §10 require, expressed in
> the data rather than bolted on.

### Cost benchmark (IW01 / R01)
```
expectedRange     $4,000 – $7,000     local/regional, envelope condition assessment
exampleQuote      $6,200              Coastal Envelope Consulting Ltd.
verdict           WITHIN range
source            3 comparable Lower Mainland engagements, 2025–2026
assumptions       Assumes visual + limited invasive review, no scaffolding.
confidence        Medium
```

### Evidence
```
EV-001  Building_Envelope_Condition_Assessment_2023.pdf
        date 2023-06-15 · 1,176 days old · type Consultant report
        state NEEDS REVIEW · snippet references north elevation sealant as "monitor"

EV-002  Email_from_Envelope_Consultant.pdf
        date 2021-04-02 · 5+ years old · type Correspondence
        state STALE / NEEDS REVIEW

EV-003  North elevation moisture staining — resident report, Aug 2026
        state UNKNOWN · no inspection carried out

EV-004  Envelope condition verification
        state MISSING · required for the assessment obligation
```
Evidence Quality on IW02: **Poor**, 38% — deliberately unlike the sheet's "Good 100%",
because the hero issue's defining problem is that the evidence does not support a conclusion.

### Owners
```
OWN-001  Jordan Lee            Property Manager        internal
OWN-002  Sam Okafor            Building Manager        internal
OWN-003  Coastal Envelope Consulting Ltd.              vendor
```

### Document companion (D01–D02)
```
document   Building_Envelope_Condition_Assessment_2023.pdf · 12 pages

candidates
  CND-001  Assessment obligation date   Candidate: Sep 27, 2026     91%   page 2
  CND-002  Estimated repair cost        Candidate: $112,000         64%   page 4   <- edited
  CND-003  Warranty expiry              Candidate: Dec 31, 2026     88%   page 9
  CND-004  Asset: North elevation cladding                          77%   page 3
  CND-005  Evidence gap: no post-2023 verification                  —     page 11

D02-E demonstration: CND-002 edited from $112,000 to $124,000, source "Page 4".
Total findings badge: "Review All Findings (12)"
```

### Inspection companion (I01–I04) — unchanged from 9A2
```
asset        Elevator
location     Main Lobby — Car 1
observation  Minor oil leak at base
condition    Fair
nextStep     Monitor
result       New attention created · Elevator — Car 1 · Priority Medium
             Source: Field Observation
```

### Completion (C01–C02)
```
completedBy   Jordan Lee — Property Manager
completedOn   2026-09-30
note          Envelope assessment completed. North elevation condition confirmed.
evidence      2 photographs + 2 further items
resultState   ISS-001 severity High -> Resolved; condition Unknown -> Verified;
              prior history and all evidence remain linked and visible.
```

### Access gate
```
uniqueIdLabel   Unique ID
uniqueIdValue   Vancouver
caseSensitive   true
```

---

## 3. Design tokens read from the 9A2 sheet

Approximations taken by eye from the contact sheet. To be refined with an eyedropper once
the PNG is committed to `docs/design/`.

```
--navy-brand      #17263F    left rail, entry brand panel
--blue-primary    #1B5FCC    primary buttons, active tab, links
--blue-title      #17509B    contact-sheet headings
--green-good      #1BA35C    Good, Verified, success states
--amber-fair      #E4890F    Fair, Medium, Needs Review
--red-poor        #DC3A2F    Poor, High, Overdue, Failed
--page-bg         #F5F7FA
--surface         #FFFFFF
--border          #E2E8F0
--text            #1A2433
--text-muted      #667085

workflow chevrons
  ENTER #2E6FD9 · ATTEND #23A0A8 · UNDERSTAND #E8873A
  DECIDE #3FA05C · ACT #8B5FBF · CLOSE THE LOOP #4A9BD4
```

Semantic rule preserved from 9A2 and S8A §26: colour never carries status alone. Every
Good / Fair / Poor and every evidence state also renders a word and a distinct icon shape.

---

## 4. Corrections to the earlier plan

- **S6A §8 wording.** The implementation plan stated that S6A §8 *requires* a roof or
  building-envelope concern and an older high-rise. S6A §8 actually presents these under
  "Recommended shape." The envelope reconciliation still holds, but it rests on HANDOFF §6's
  explicit canonical status and the contact sheet's internal contradictions, not on a
  hard S6A requirement.
- **Estimated cost on panel 05** is `$1,800 – $2,400`, not `$1,600 – $2,400` as the OCR pass
  reported.
- **Contact-sheet inconsistencies** confirmed on inspection: 134 units (panel 02) versus
  124 units (panel 09); Resulting Attention is labelled `12A`, duplicating the candidate-edit
  variant, where S9A2 names it `17A`.
