# CUT-AND-PASTE PROMPT — DEMO GUIDE SLIDE

Produces one editable PowerPoint slide summarising the guided demo: the core journey
with timings, the three companion flows, and the hero scenario facts.

**Paste the whole block below into ChatGPT.** It asks for a `.pptx` file rather than an
image, because image models render text unreliably and a slide is almost entirely text.
You get something you can edit afterwards.

---

```
Create a single PowerPoint slide for me as a downloadable .pptx file. Use
python-pptx. Widescreen 16:9, 13.333 x 7.5 inches.

This is a facilitator's reference slide for a guided product demo. It is shown
to my own team, not to prospects, so it should be dense and useful rather than
sparse and pretty.

BRAND COLOURS — use exactly these hex values:
  Navy (headers, dark bars)    #0D2243
  Blue (primary accent)        #00349E
  Green (good / complete)      #2E9C63
  Amber (caution)              #E8862F
  Red (critical / attention)   #E12A1E
  Page background              #FAFBFC
  Body text                    #0F1A28
  Muted text                   #64748B

FONT: Inter if available, otherwise Segoe UI. No other typefaces.

SLIDE TITLE (top left, navy, bold, ~28pt):
  Strata Property Intelligence — Guided Demo

SUBTITLE (directly under, muted, ~13pt):
  Core story runs in 2 minutes. Full session with companions, 8–10.

SECTION 1 — "THE CORE STORY" as a left-to-right row of six connected steps
with arrows between them. Each step is a rounded box: step name in bold navy,
timing in small muted text, and one short line beneath. Make the boxes equal
width and the arrows thin and grey.

  1. Entry          15 sec
     Name, email, Unique ID. No account, no auth.

  2. Attention      30 sec
     Five health indicators. Evidence scores 38 — the point of the product.

  3. Hero issue     20 sec
     "Building envelope condition is unknown." Not "failing". Unknown.

  4. Why            25 sec
     Staining unassessed. Last assessment 2023. Act-now-vs-defer graph.

  5. Evidence       25 sec
     Quality reads Poor 38%. Shows what it does NOT have.

  6. Action         25 sec
     $4K–$7K assess, high confidence. $85K–$140K repair, low. Assign.

Then one final box, visually separated and outlined in blue:
  Decision Summary  20 sec
  Same data, arranged for a board. Evidence gaps travel with it.

SECTION 2 — "COMPANIONS" as three smaller boxes across the width, each with a
title and two short lines. Use a lighter treatment than section 1 so it reads
as secondary:

  Document to intelligence   ~2 min
  Candidates carry confidence and source page.
  Reject keeps provenance. Failure recovers.

  Field inspection           ~90 sec
  Responsive web at phone width, not an app.
  The person records the condition. No auto-diagnosis.

  Closing the loop           ~60 sec
  Severity resolved, evidence 38% to 88%.
  Completion does not erase the history.

SECTION 3 — a narrow horizontal strip along the bottom, navy background,
white text, small. Label it "HERO SCENARIO" then these facts separated by
vertical bar characters:

  Harbour Heights, Vancouver BC · 134 units · Building envelope, north
  elevation · Condition Unknown · Due in 24 days · Jordan Lee, Property
  Manager · Unique ID: Vancouver

LAYOUT NOTES:
- Everything on one slide. Nothing may overflow the edges.
- Section 1 is the visual priority — largest, highest contrast.
- Use the red for the "Evidence 38" and "Unknown" mentions so the eye catches
  the uncertainty theme.
- Generous margins, no clip art, no stock photography, no gradients.

Give me the .pptx as a download when you're done.
```

---

## If you want a deck instead of one slide

Add this to the end of the prompt:

```
Actually make this a 5-slide deck instead: slide 1 as described above as an
overview, then one slide per section — core story, document companion, field
inspection, closing the loop — each expanding its detail with the facilitator
talking points. Keep the same colours, fonts and hero-scenario strip.
```

## If ChatGPT cannot produce a file

Some ChatGPT modes have no code tool. In that case add:

```
If you can't generate a file, give me the slide as clean HTML in a single
page instead, using the same colours and layout, sized for 16:9.
```

An HTML page prints to PDF and pastes into most slide tools reasonably well.

## Source

Content is drawn from `WALKTHROUGH_REFERENCE.md` and the frozen dataset in
`WAVE0_DECISIONS.md`. If the demo script changes, update this prompt so the
slide does not drift from what the prototype actually does.
