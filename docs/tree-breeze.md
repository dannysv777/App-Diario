# Tree breeze in the local proposal

Only visual layers and a new tree touch target are added. Existing navigation,
letter, album, messages and original image files are unchanged.

1. `TreeBreeze.tsx` extracts green foliage inside the existing tree bounds.
   A complementary mask on the scene removes its static copy, keeping the
   painted trunk and branches fixed. Assets are calculated once per orientation,
   not per animation frame. Sky behind the lifted canopy uses the scene background.
2. A cropped SVG layer sways +/-0.65 degrees in a 7-second eased cycle. One
   octave of static `feTurbulence` drives a low-amplitude `feDisplacementMap`.
3. Seven leaves have deterministic varied sizes, paths and 12-19 second cycles.
4. Eight extra fireflies are limited to the tree's area.
5. The existing animated foreground reeds and flowers use the same start time
   and 7-second cycle, with a smaller +/-0.25 degree skew. Other painted plants
   remain part of the illustration.
6. A subtle blurred shadow moves 2px over the grass, on the same wind cycle.
   Its elongated shape now fades toward the tip at 12% opacity. A static
   sky-blue gradient in screen blend mode lights only inward-facing upper/right
   foliage edges. This edge mask is computed once, follows the existing canopy
   sway, and does not add another animated filter. Since the astronomical sky
   has no visible moon at the requested time, this is ambient night lighting.
7. Touch or keyboard activation adds ten leaves for 2 seconds. Further taps
   during that interval cannot add more particles. The timeout is cleaned up.
8. Reduced motion removes the displacement filter, wind, falling leaves and
   moving fireflies. Tree touch gives only static feedback. Ambient effects pause
   when hidden, out of view or a dialog is open. Only the canopy uses will-change.

No new dependencies or external downloads. Only the small canopy has an animated
SVG filter. Other movement uses transform and opacity. Tests cover bounded
particles, synchronized animation times, orientation, existing actions, console
errors and live reduced-motion changes. Browser emulation is not a guarantee of
frame rate on a physical phone.

The masks match the current artwork and must be reviewed if it is replaced.
`proposal-lighting.spec.ts` checks control bounds, icon bounds, minimum touch
sizes and hit targets at every integer width from 320 through 400 pixels.
