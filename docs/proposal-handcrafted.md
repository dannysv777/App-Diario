# Local proposal: animated finish

Only `/propuesta` is affected. Existing messages, welcome, letter, routes,
album repository and production garden are unchanged. No additional libraries.

## Layers

- `Atmosphere.tsx`: four smoke wisps, two window lights, 18 deterministic
  irregular firefly paths, swaying foreground reeds and two small flowers.
- `ProposalGarden.tsx`: occasional fish visibility, pointer parallax and a
  notebook skin for the existing album action. Existing Pixi tulip breathing
  and pond ripples are retained.
- `proposal.css`: procedural grain, gentle vignette, restrained saturation,
  warm window lighting, wooden controls, paper, local handwriting and page turn.
  All new movement respects reduced motion. Ambient CSS pauses when a modal opens.
  Parallax is mouse-only, at most 2px per axis, and needs no sensor permissions.

## Downloaded resource

Only Caveat and its license were downloaded from the official Google Fonts repo:

- https://github.com/google/fonts/tree/main/ofl/caveat
- `public/proposal/fonts/Caveat.ttf`: variable TrueType font, weights 400-700.
- `public/proposal/fonts/OFL.txt`: SIL Open Font License 1.1.

The font is served locally. No external font request occurs in the browser.
Grain and decorative shapes are code, not downloaded graphics.

## Verification

`tests/proposal.spec.ts` exercises portrait, landscape, desktop, small-screen
reduced motion, animation, local font, letter, messages and isolated album CRUD.
These are browser emulations, not a physical phone test.
