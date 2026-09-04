# GUIDED DEMO SCRIPT — STRATA PROPERTY INTELLIGENCE PROTOTYPE V2

**URL:** <https://strata-property-prototype.pages.dev>
**Unique ID:** `Vancouver` (case-sensitive)
**Before you start:** click **Reset demo** in the left rail. Everything below assumes the canonical baseline.

Required deliverable per S6A §12. The core story runs in **2 minutes**; the full
session with all three companions runs in **8–10**.

---

## THE CORE STORY — 2 minutes

This is the part that must land. Everything after it is optional.

### 0. Entry — 15 seconds

Enter a name and email, then `Vancouver` as the Unique ID.

> "This is a research prototype on synthetic data. Nothing here is a real building."

Point out that it captures who is viewing, and nothing more. There is no account.

### 1. Attention — 30 seconds

Land on Harbour Heights.

> "This is the first screen a property manager sees. Not a dashboard — a list of what
> needs attention, ranked by urgency, consequence and evidence quality."

Point at the five health indicators, then stop on **Evidence: 38**.

> "Four of these are healthy. The fifth is the point of the whole product. The evidence
> behind this building is weak, and the system says so on the landing screen."

### 2. The hero issue — 20 seconds

Click **Building envelope condition is unknown**.

> "Notice the wording. Not 'envelope failing'. *Unknown*. The product does not claim to
> know something it cannot."

Point at the four facts: North Elevation · due in 24 days · Condition Unknown · $85K–$140K.

### 3. Why — 25 seconds

> "Moisture staining was reported three weeks ago and never assessed. The last real
> assessment is from 2023."

Show the timeline: 2023 → 2024 → Now, 1,176 days old → Due in 24 days.

Then the act-now-vs-defer chart.

> "Acting now, risk falls. Deferring, it climbs. That's the decision in one picture."

Optionally open **What does this mean?** — AI explanation on demand, never a chatbot.

### 4. Evidence — 25 seconds

Click the **Evidence** anchor.

> "Here's where the trust is won or lost."

Evidence quality reads **Poor · 38%**. Walk the four sources:

| Source | State |
|---|---|
| 2023 assessment | Needs Review — 1,176 days old |
| 2021 consultant email | Needs Review — 5+ years old |
| Resident report | **Unknown** — never inspected |
| Condition verification | **Missing** |

> "It shows you what it does not have. A missing record is displayed as missing, not
> quietly omitted."

Click a source to open the preview — provenance in one click.

### 5. Action — 25 seconds

Click the **Action** anchor.

> "Commission an assessment. $4K to $7K, high confidence — that's a routine engagement.
> The $85K–$140K repair figure is low confidence, because nobody has looked yet.
> Two numbers, two confidence levels, both visible."

Click **Assign** → choose an owner → **Assign**. Status changes to Assigned.

### 6. Decision Summary — 20 seconds

Click **Open decision summary**.

> "Same data, arranged for a board. Decision required at the top, then urgency,
> evidence and cost. The evidence gaps come with it — a board sees Missing and Unknown
> too."

**Stop here.** The thesis has landed.

---

## COMPANION A — Document to intelligence · 2 minutes

From the issue, click **Evidence** → **Try a sample document**.

Choose **Building_Envelope_Condition_Assessment_2023.pdf**. Watch the processing steps.

> "Simulated. No document is read or uploaded."

On the review screen:

> "These are *candidates*, not facts. Each carries its confidence and the page it came
> from."

- **Confirm** the assessment obligation date (91%).
- **Edit** the repair cost — it extracted $112,000 at 64% confidence. Change it to
  $124,000 and confirm. It now reads *Edited–Confirmed* and shows what it was corrected from.
- **Reject** one. Point out that the source and snippet stay visible.

> "Rejecting doesn't erase where it came from. The provenance survives the decision."

**Worth showing:** back on the select screen, **Run failure demo** → processing fails →
**Try Again** recovers.

> "Failure is recoverable and never pretends to be success."

---

## COMPANION B — Field inspection · 90 seconds

From Attention, click **Start inspection**.

Five steps: details → capture photo → observation → result → resulting attention.

> "This is responsive web at phone width, not a native app. That's a deliberate
> Prototype scope decision."

At the observation step:

> "The person on site records the condition. The system does not diagnose from a
> photograph — no computer vision, no autonomous conclusion."

End on **New Attention Created** — the field observation becomes an attention item with
a recommended next step.

---

## COMPANION C — Closing the loop · 60 seconds

From the issue's Action section, click **Work status and completion**.

Show the status progression, then **Record completion with evidence**.

> "Completed, by whom, when, with photographic evidence."

Click **See the closed loop**.

> "Severity resolved, condition now Verified, evidence quality up from 38% to 88%.
> And this is the part that matters —"

Scroll to **History is preserved**.

> "Completion did not erase the risk. The stale evidence, the resident report, the whole
> decision trail is still attached. You can always answer 'why did we spend that money?'"

---

## QUESTIONS TO ASK

Straight from S8A §24. Ask, then stop talking.

1. Did you understand what needed attention?
2. Was the reason and the priority credible?
3. What evidence would you want before you trusted this?
4. Was the recommended action useful, or too obvious?
5. Was the cost and timing context useful, or noise?
6. Would the document flow save you real time?
7. Would the field inspection flow fit how your people actually work?
8. Would the board summary survive an actual board meeting?
9. What terminology felt wrong?
10. What is missing before you would act on this?
11. **Would you put your real property data into this?**
12. **Would you go further — design partner, or MVP?**

## WHAT TO WATCH

Where they click first. Where they hesitate. Whether they notice the uncertainty
without prompting. Whether they go to cost before evidence. Whether *candidate* versus
*confirmed* lands without explanation.

---

## IF SOMETHING GOES WRONG

- **Odd state:** click **Reset demo** in the rail. Restores the canonical baseline;
  keeps you signed in.
- **Need to restart entirely:** the avatar at the bottom of the rail exits to the gate.
- **Data looks wrong:** every screen reads one file, `data/prototype.json`. If two
  screens disagree, that is a bug worth reporting, not a display quirk.

## WHAT NOT TO CLAIM

Nothing here is real. No authentication, no backend, no document processing, no
computer vision, no PDF generation. Every figure is synthetic. If asked whether it
integrates with anything today — it does not, and saying so plainly buys more
credibility than hedging.
