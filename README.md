# Strata Property Intelligence — Prototype v2

Disposable, zero-dependency static web prototype for guided product demonstrations.

**Status:** Planning complete — awaiting founder approval to begin build.

## What this is

A deliberately lightweight recreation of the frozen 9A2 high-fidelity Prototype UI.
It exists to validate comprehension, workflow fit, trust, priority value and
commercial pull — not to be production software.

Core story: **Attention -> Why -> Evidence -> Action -> Decision Summary**

## Stack

HTML5 + CSS3 + vanilla JavaScript. Local JSON for mock data. `localStorage` for
demo state only. No framework, no npm, no TypeScript, no build step, no backend.

## Local preview

```
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deployment

Cloudflare Pages, connected to `main` of this repository.
No build command. Build output directory is the repository root.
The committed files are exactly what is served.

## Governance

Authoritative product artifacts live in the Google Drive Property Intelligence
folder and are the repository of record. This repo holds code and assets only.

Authority order: 9A2 visual design > S5A use cases > S6A requirements >
S8A UX/IA > S10A development intent > 9A1 wireframe backstop > v1 (reference only).

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).
