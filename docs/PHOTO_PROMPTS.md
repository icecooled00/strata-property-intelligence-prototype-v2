# PHOTOGRAPHY PROMPT PACK — HARBOUR HEIGHTS

Date: 2026-09-03
Purpose: generate seven cohesive images for Prototype v2, matching the 9A2 contact sheet's
warm contemporary photographic look.

**I cannot generate images in this session — there is no image tool available to me.** This
pack exists so you can run them through whatever generator you prefer. Save the results into
`assets/images/` using the filenames below and I will integrate and colour-match them.

---

## How to use this

Every prompt is written as **STYLE BLOCK + SUBJECT**. Paste the style block verbatim at the
start of each of the seven prompts, unchanged. That block is what makes the set read as one
shoot rather than seven stock photos — same building, same day, same camera, same grade.

Generate **image 01 first**. Once you have a Harbour Heights exterior you like, carry it
forward as a visual reference (image-to-image, style reference, or "same building as
previous") for images 02–05 and 07, so the tower's cladding, balcony rhythm and colour stay
identical across the set. Image 06 is interior and does not need the building reference.

Aspect ratios matter — they are sized to the panels they fill.

---

## STYLE BLOCK — paste unchanged at the start of every prompt

```
Architectural photography, contemporary residential high-rise in Vancouver, British Columbia.
Warm golden-hour light, late afternoon, low sun, clear sky with soft haze. Warm colour grade,
gently saturated, lifted shadows, no cool cast. Full-frame camera, sharp, natural perspective,
no fisheye, no heavy vignette. Clean realistic photography, no illustration, no CGI look,
no text, no logos, no watermarks, no people's faces.
```

---

## The seven images

### 01 — `hero-building-exterior.jpg` · 16:10 · Entry panel (E01), Attention header (A01)

> **[STYLE BLOCK]**
> A 22-storey contemporary glass and pale-grey panel residential tower, built around 2009,
> photographed from across the street at a slight upward angle. Balconies with glass
> balustrades in a regular vertical rhythm. Warm interior lights glowing in some units
> against the golden sky. Mature street trees at the base. The building looks well kept and
> desirable.

This is the establishing shot and the reference for the rest of the set. It fills the right
half of the entry screen exactly as the 9A2 sheet does.

---

### 02 — `property-north-elevation.jpg` · 4:3 · Property Summary (P00), issue context (IW01)

> **[STYLE BLOCK]**
> The same 22-storey tower as the reference image, now photographed from the north side,
> three-quarter view, showing the full height of one elevation. Same warm golden light.
> The north face is in soft shade while the west face catches the sun. Wide enough to read
> the whole elevation as a single surface.

The hero asset is the north elevation, so this shot must clearly show that face as a
distinct, readable plane.

---

### 03 — `evidence-staining-wide.jpg` · 3:2 · Evidence photo strip (IW02), position 1

> **[STYLE BLOCK]**
> Mid-distance detail of the north elevation of the same tower, six to eight storeys of
> facade filling the frame. Faint grey-brown water staining streaks running downward below
> several balcony slab edges and window heads. Subtle discolouration on the pale grey
> cladding panels. Documentary record shot, flat and factual, still in the same warm
> afternoon light.

**Critical to the story.** The building looks immaculate at a distance and shows real
staining up close — that contrast is the product thesis.

---

### 04 — `evidence-sealant-detail.jpg` · 3:2 · Evidence photo strip, position 2

> **[STYLE BLOCK]**
> Tight close-up of a vertical sealant joint between two pale grey cladding panels. The
> sealant bead is cracked, shrunken and pulling away from one substrate, leaving a visible
> gap. Slight dark staining below the failure. Shot straight on from about half a metre,
> shallow depth of field. Inspection documentation photograph.

---

### 05 — `evidence-balcony-slab.jpg` · 3:2 · Evidence photo strip, position 3

> **[STYLE BLOCK]**
> Close view of the underside edge of a concrete balcony slab on the same tower, showing
> efflorescence — white mineral deposit — and a damp darker patch where water has tracked
> along the soffit. Glass balustrade partially in frame above. Handheld inspection
> photograph, natural light.

---

### 06 — `inspection-elevator-machine-room.jpg` · 4:3 · Field inspection (I01), camera view (I02)

> **[STYLE BLOCK]**
> Interior of a building elevator machine room. Traction machine, sheaves, painted yellow
> and red pipework, grey control cabinets, concrete floor. Practical overhead fluorescent
> lighting. A small dark oil stain pooling on the floor at the base of the machine. Utility
> space, unstyled, slightly cramped.

This matches the machine-room photograph already on 9A2 panels 14 and 15. It is the only
interior in the set and does not need the exterior building reference.

---

### 07 — `completion-evidence.jpg` · 3:2 · Work Completion (C01)

> **[STYLE BLOCK]**
> Suspended access platform, a swing stage, rigged against the north elevation of the same
> tower at mid-height, with survey equipment and a coiled safety line on the deck. No people
> visible. Late afternoon warm light. Evidence that a facade condition assessment has been
> carried out.

Shows work done without claiming a repair — the completed action is an *assessment*, not a
remediation. Keep that distinction; the closed-loop state depends on it.

---

## Fallback if generation stalls

If any image proves difficult, tell me which one and I will author an SVG placeholder in the
same warm palette, captioned as a photograph, so no wave is blocked. Waves 1–6 build fine
against placeholders; images can be swapped in at Wave 7 with no code change, since every
photograph is referenced through `photos[].src` in `data/prototype.json`.

## Integration checklist

- Save as JPEG, longest edge 1600px, quality ~80. Target under 300 KB each.
- Filenames exactly as above, into `assets/images/`.
- I will add `alt` text, captions and `capturedAt` dates in `data/prototype.json`.
- Everything is committed to the repo and served from the same origin. No CDN, no hotlinking,
  no external requests — this is a hard QA check in the plan.
