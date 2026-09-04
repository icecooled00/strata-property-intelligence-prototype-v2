# CUT-AND-PASTE IMAGE PROMPTS FOR CHATGPT

Seven images for Prototype v2. Generate them **one at a time, in order**, in a
**single ChatGPT conversation** — that is what keeps the building consistent
across the set.

Save each result into `assets/images/` using the exact filename given.
The app already references these paths, so they appear as soon as they exist.

---

## STEP 1 — paste this first

```
I'm creating a set of 7 photographs for a property-management software demo.
They must look like one consistent photo shoot of the SAME building, not seven
separate stock photos. Please generate them one at a time as I ask.

LOCKED STYLE — apply to every image in this set:
Architectural photography, contemporary residential high-rise in Vancouver,
British Columbia. Warm golden-hour light, late afternoon, low sun, clear sky
with soft haze. Warm colour grade, gently saturated, lifted shadows, no cool
cast. Full-frame camera, sharp, natural perspective, no fisheye, no heavy
vignette. Realistic photography — not illustration, not 3D render. No text,
no logos, no watermarks, no readable signage, no identifiable faces.

THE BUILDING (keep identical in every exterior shot):
A 22-storey residential tower completed around 2009. Pale grey metal panel
cladding with large glass windows and continuous balconies with clear glass
balustrades in a regular vertical rhythm. Well maintained and desirable.

IMAGE 1 of 7 — "hero-building-exterior"
Wide establishing shot of the full tower from across the street, slight upward
angle, mature street trees at the base, warm interior lights glowing in some
units against the golden sky. Landscape orientation, 16:10.

Generate image 1 now. After this, I'll ask for images 2 through 7 — please
reuse this exact building and lighting for all of them.
```

---

## STEP 2–7 — paste each after the previous image is done

**Image 2** → save as `property-north-elevation.jpg`
```
IMAGE 2 of 7 — "property-north-elevation"
Same building, same light. Photograph the north side from a three-quarter
angle, showing the full height of one elevation as a single readable surface.
The north face sits in soft shade while the west face catches the sun.
Landscape, 4:3.
```

**Image 3** → save as `evidence-staining-wide.jpg`
```
IMAGE 3 of 7 — "evidence-staining-wide"
Same building. Mid-distance detail of the north elevation, six to eight
storeys filling the frame. Faint grey-brown water staining streaking downward
below several balcony slab edges and window heads. Subtle discolouration on
the pale grey cladding. Flat, factual documentary record shot — still the same
warm afternoon light. Landscape, 3:2.
```

**Image 4** → save as `evidence-sealant-detail.jpg`
```
IMAGE 4 of 7 — "evidence-sealant-detail"
Tight close-up of a vertical sealant joint between two pale grey cladding
panels on the same building. The sealant bead is cracked, shrunken and pulling
away from one side, leaving a visible gap. Slight dark staining below the
failure. Shot straight on from about half a metre, shallow depth of field.
Building inspection documentation photo. Landscape, 3:2.
```

**Image 5** → save as `evidence-balcony-slab.jpg`
```
IMAGE 5 of 7 — "evidence-balcony-slab"
Close view of the underside edge of a concrete balcony slab on the same
building, showing white efflorescence mineral deposit and a darker damp patch
where water has tracked along the soffit. Glass balustrade partly in frame
above. Handheld inspection photo, natural light. Landscape, 3:2.
```

**Image 6** → save as `inspection-elevator-machine-room.jpg`
```
IMAGE 6 of 7 — "inspection-elevator-machine-room"
Interior this time, so ignore the exterior building description. A building
elevator machine room: traction machine, sheaves, painted yellow and red
pipework, grey control cabinets, bare concrete floor, practical overhead
fluorescent lighting. A small dark oil stain pooling on the floor at the base
of the machine. Utility space, unstyled, slightly cramped and real.
Landscape, 4:3.
```

**Image 7** → save as `completion-evidence.jpg`
```
IMAGE 7 of 7 — "completion-evidence"
Back to the same tower, same warm light. A suspended access platform (swing
stage) rigged against the north elevation at mid-height, with survey equipment
and a coiled safety line on the deck. No people visible. This should read as
evidence that a facade condition assessment has been carried out — an
inspection in progress, not a repair or construction site. Landscape, 3:2.
```

---

## Optional 8th image

The Attention screen shows a small building graphic beside the status bars.
It currently reuses image 1. If you want the cleaner cut-out the 9A2 sheet
shows, generate this too and save it as `building-cutout.png`:

```
BONUS IMAGE — "building-cutout"
The same 22-storey tower, photographed straight on, isolated on a pure white
background with no sky, no street and no surroundings — just the building with
a small strip of grass and a few trees at its base. Product-style cut-out.
Portrait orientation, 4:5.
```

---

## After generating

- Save with the **exact filenames** above into `assets/images/`.
- JPEG, longest edge around 1600px. PNG for the cut-out.
- Tell me when they're in and I'll wire captions, alt text and colour-match the
  surrounding UI. Until then the app shows labelled placeholders, so nothing is
  blocked.
- If ChatGPT drifts and produces a different building, paste the LOCKED STYLE
  and THE BUILDING blocks again with the failing image's prompt.
