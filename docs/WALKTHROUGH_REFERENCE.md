# WALKTHROUGH REFERENCE — INTERNAL

> **Do not send this to reviewers.**
>
> The prototype has to be understood without it. S6A §2 puts comprehension first, and a
> guide contaminates that test — you would be measuring whether someone can follow
> instructions, not whether the product explains itself.
>
> Kept for three things: onboarding anyone new to the project, a checklist when QA-ing a
> change, and a record of what each screen is meant to communicate. If a reviewer gets
> lost somewhere this document has to explain, that is a finding about the product, not
> a reason to send them the document.

---

Below is written in reviewer voice, which is why it reads oddly for internal use. That
is deliberate — it captures the intended experience, step by step.

Full path takes about 10 minutes, or 3 for the main story.

**Open:** <https://strata-property-prototype.pages.dev>
**Unique ID:** `Vancouver` — capital V, exactly as written

Use a laptop or desktop. It works on a phone, but it was designed for a desk.

## Two things before you start

**Everything here is invented.** Harbour Heights doesn't exist. Every figure, document
and photograph is synthetic. We're testing whether the *thinking* is right, not showing
you live data.

**You can't break it.** Click anything. If you end up somewhere odd, hit **Reset demo**
in the left rail and you're back at the start.

Section 1 walks you through it. Section 2 explains what you looked at, if you want the
background afterwards.

---

# SECTION 1 — WALK THROUGH IT

## Step 1 · Get in — 15 seconds

Enter your name, your email, and `Vancouver` as the Unique ID.

There's no password and no account. We record who looked and when, so we can follow up
with you — nothing more.

---

## Step 2 · The morning screen — 1 minute

You're looking at **Harbour Heights**, a 134-unit building in Vancouver. This is what a
property manager would see first thing.

**Look at the five circles across the top.** Overall, Compliance, Maintenance, Money,
Evidence.

Four of them are fine. **Evidence is 38, in red.**

That's the product telling you something before you've clicked anything: *the
information behind this building is weak.* Not that something is broken — that you
can't currently prove whether it is.

**Below that** is the attention list, ranked by urgency, consequence and how good the
supporting evidence is. Six items. The top one is dominant on purpose.

> **Worth asking yourself:** is this the first thing you'd want to see on a Monday
> morning? Or would you want something else?

---

## Step 3 · Open the top issue — 1 minute

Click **Building envelope condition is unknown**.

Read the title again. It doesn't say the envelope is failing. It says **unknown** —
because nobody has actually looked.

You'll see four facts along the row: the affected asset, 24 days until the obligation is
due, condition Unknown, and $85K–$140K of potential exposure.

**Scroll down to "History and timing".** Four points: an assessment in 2023, some
sealant work in 2024, today — with the evidence now 1,176 days old — and the deadline
24 days out.

**Below that, "Act now vs defer risk".** Green line if you act, red dashed if you wait.
They cross at today.

> **Worth asking yourself:** would that timeline change how urgently you'd treat this?

---

## Step 4 · Check whether you'd trust it — 1 minute

Click **Evidence** in the row of buttons near the top.

**This is the part we most want your reaction to.**

Evidence quality reads **Poor · 38%**. Underneath are the four sources:

| Source | What it says |
|---|---|
| 2023 condition assessment | Needs Review — 1,176 days old |
| 2021 consultant email | Needs Review — 5+ years old |
| Resident report of staining | **Unknown** — never inspected |
| Condition verification | **Missing** |

Look at the bottom two. The system is showing you what it **doesn't** have. The missing
verification isn't quietly left out — it's listed as missing.

**Click any source row.** You'll see the document, the relevant passage, and its age.

> **Worth asking yourself:** is this enough to trust a recommendation? What else would
> you want to see first?

---

## Step 5 · The recommendation — 1 minute

Click **Action**.

The recommendation is to commission an assessment. Note the two cost figures:

- **$4K–$7K** to assess, **high confidence** — that's routine, well-priced work
- **$85K–$140K** to repair, **low confidence** — because nobody has looked yet

We deliberately show both, with their confidence levels. A single number would be
tidier and less honest.

**Try the buttons.** Click **Assign**, pick someone, confirm. Watch the owner and status
change. Then try **Defer** — note that it records a reason and states plainly that the
issue stays open. Deferring never looks like completing.

> **Worth asking yourself:** is that the action you'd take? Is anything missing before
> you could act on it?

---

## Step 6 · The board summary — 1 minute

Click **Open decision summary** at the bottom of the Action section.

Same information, rearranged for a council or board: what decision is needed, then
urgency, evidence and cost, then why, then the recommendation.

**Scroll down to Supporting evidence.** The gaps come with it — the board sees *Missing*
and *Unknown* too.

> **Worth asking yourself:** would this survive a real board meeting? What would get
> challenged?

**That's the main path.** If you only have 5 minutes, stop here and jump to
[the questions](#what-wed-like-to-hear).

---

## Optional · Turning a document into information — 2 minutes

Go to **Evidence** → **Try a sample document** → pick the envelope assessment.

Watch it process, then look at what comes out. Each item is a **candidate**, not a fact
— with its confidence and the page it came from.

Try all four controls on different rows:

- **Confirm** the assessment date. It's 91% confident. Clean.
- **Edit** the repair cost. It extracted $112,000 at only 64% confidence. Change it to
  something else and confirm — it records that you corrected it, and what from.
- **Reject** one. Notice the source and quote stay visible. Rejecting doesn't erase
  where it came from.
- **Defer** one for later.

**If you want to see it fail:** back on the first screen there's a *Run failure demo*
button. It fails partway and offers to retry. Failure recovers rather than dead-ends.

> **Worth asking yourself:** would this save you real time, or create review work?

---

## Optional · Field inspection — 90 seconds

From the attention screen, click **Start inspection**.

Five steps: details, photo, observation, result, and the attention item it creates.

The middle steps are shown at phone width — that's deliberate. It's responsive web, not
an app, so there's nothing to install.

Note what the system does **not** do: it doesn't diagnose anything from the photograph.
The person on site records the condition. No computer vision, no guessing.

> **Worth asking yourself:** would your people actually use this on site?

---

## Optional · Closing the loop — 60 seconds

From the Action section, click **Work status and completion**, then **Record completion
with evidence**, then **See the closed loop**.

You'll see the before and after: severity resolved, condition now Verified, evidence
quality up from 38% to 88%.

**Then scroll down.** The original risk, the stale evidence and the whole decision trail
are still attached. Completion doesn't erase history — twelve months later you can still
answer *"why did we spend that?"*

---

## If you get stuck

| Situation | What to do |
|---|---|
| Something looks odd | **Reset demo** in the left rail. Back to the start. |
| Want to start completely over | The circle with your initials at the bottom of the rail. |
| A screen looks broken | Tell us — that's a bug, and we want to know. |

---

## What we'd like to hear

Answer whichever you have an opinion on. Blunt is more useful than polite.

1. Did you understand what needed attention, without anyone explaining it?
2. Was the priority credible, or did it feel arbitrary?
3. **What evidence would you want before you'd trust a recommendation like this?**
4. Was the cost and timing context useful, or noise?
5. Would the board summary survive a real meeting?
6. What terminology felt wrong for how you actually talk about this?
7. What's missing before you could act on it?
8. **Would you put your real property data into something like this?**

And the one that matters most: **what did you expect to be able to do that you couldn't?**

---

# SECTION 2 — WHAT YOU JUST LOOKED AT

Brief background, if useful.

## The core idea

The whole product is four steps in order: **what needs attention → why it matters →
what evidence supports that → what to do about it.** Everything else supports that
sequence.

## The areas

**Attention.** A ranked queue, not a dashboard. Ranking uses four visible factors —
urgency, consequence, financial exposure and evidence quality. Deliberately explainable
rather than an AI score you can't interrogate.

**Property.** Orientation only — the building and condition by area. Intentionally not
the landing screen; the product leads with what needs doing, not with navigation.

**Evidence.** The reason this isn't just a task list. Every source carries a state —
Verified, Needs Review, Conflicting, Missing or Unknown — and they stay visually
distinct rather than collapsing into a single trust score. If two sources disagree, it
says **Conflicting** and stays unresolved until a person reviews it. The elevator item
on the attention list is a live example of that.

**Action.** Where the loop closes: understand, decide, assign, complete, evidence. The
two cost figures with different confidence levels are the clearest expression of the
product's position — it tells you how much it actually knows.

## The companions

**Document to intelligence.** Answers "how does information get in?" Extracted items are
proposals until a person accepts them. They never arrive looking authoritative.

**Field inspection.** The field-to-office loop, at phone width, without pretending to be
a mobile app.

**Closing the loop.** Completion that preserves history. A record that erases what came
before is useless for governance.

## Why this particular scenario

We chose an issue that's **serious but not a crisis**. A building visibly falling down
demos well and proves nothing — everyone agrees you'd act.

The interesting case is the one where the honest answer is *"we don't know yet, and
that's the problem."* The building looks immaculate in the photographs. The evidence
says nobody has checked in three years.

**That gap is what we're trying to solve.** Whether we've solved it is what we'd like
you to tell us.

---

## What's real and what isn't

| Real | Simulated |
|---|---|
| Every screen and interaction | All data, documents and photographs |
| The workflow and its states | Document processing and extraction |
| Your changes persisting as you click | Any AI analysis |
| The evidence and confidence model | Exports and PDF generation |

There is no backend, no integrations and no live data. This is a prototype built to test
an idea, not an early version of a product you can buy today.

Thanks again — genuinely, the blunt feedback is the useful kind.
