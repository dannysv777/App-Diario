# Birthday sky (local proposal only)

Requested date: **6 August 2007, 20:00 Guatemala local time**.
UTC instant: **2007-08-07T02:00:00Z** (Guatemala had no DST in 2007).
Approximate observer: Huehuetenango city, 15.32097 N, 91.47001 W, 1900 m.
The user said near Huehuetenango, not an exact observation site.

## Representation and limits

The garden and its upward extension now share one rectilinear camera facing
south at elevation 48 degrees. Horizontal and vertical coordinates use the
same pixel scale; the extension is a translated crop, not a resized map.
Only a sector of the hemisphere fits on screen, with a responsive field of view.
The generated data retains its original overhead coordinates for reference,
but rendering uses the calculated altitude/azimuth, not those chart coordinates.
Only catalog stars of magnitude <= 5 with apparent altitude > 0 are included.
Nine selected constellation figures have toggled Spanish labels; Jupiter is
also shown at its calculated position. Constellation lines are traditional
illustrations, not official IAU region boundaries.

Astronomy Engine rotates J2000 catalog coordinates to the local horizontal
frame, accounting for precession/nutation and standard refraction. Stellar
proper motion is not modeled. This is an approximate commemorative chart, not
a reconstruction of actual clouds, terrain, extinction or light pollution.
The Moon is below the horizon at this instant and is absent from the chart.
The source illustrations are preserved on disk. A runtime sky mask replaces
their decorative moon and stars. It keys only blue distant scenery, never
general bright pixels, so pale chimney stone remains intact. Its lower edge
fades into the existing terrain. A separate SVG mountain layer covers stars
below the new ridge; tree, roof and pond remain untouched.
The undulating ridge is an artistic approximation of the small silhouette
reference supplied by the user, not a geographic elevation model. These masks
are specific to the current portrait/landscape artwork and need review if the
backgrounds are replaced. No newly generated illustration is used.

## Sources and downloaded files

- Catalog and constellation figures: https://github.com/ofrohn/d3-celestial
  (the project documents its stellar source as HYG).
- `scripts/sky-data/stars.6.json`
- `scripts/sky-data/constellations.lines.json`
- `scripts/sky-data/LICENSE.txt` (BSD-3-Clause attribution retained).
- Calculation: https://github.com/cosinekitty/astronomy (Astronomy Engine,
  MIT license, installed as a development dependency, not shipped at runtime).
- Time offset: https://www.timeanddate.com/time/change/guatemala?year=2007
- Reference location: https://www.geodatos.net/en/coordinates/guatemala/huehuetenango

Regenerate with `node scripts/generate-birthday-sky.cjs` after updating the
observer or instant there. Output: `src/components/proposal/sky-data.json`.
The generator is deterministic. The browser makes no remote astronomy requests.

## Interaction

The garden is initially in view, with calculated stars already visible. Touch
its sky to toggle names without leaving the garden. Scroll toward the top to reveal more sky, or
use the upward arrow in the garden sky. Touch the star field to toggle names
and lines; its accessible button works with Enter and Space as well. The downward
arrow returns to the garden. Existing routes, messages, letter and album stay intact.
Reduced motion disables stellar twinkle, line fades and smooth scrolling.
