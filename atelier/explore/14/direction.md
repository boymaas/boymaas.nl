# Variant 14 - Nebula

The playground of variant 12, unchanged, now floats in a drifting field of dithered nebulae.
We travel sideways and up toward a brighter region that never arrives.
Everything behind the toy is a demoscene effect drawn in code: chunky ordered dither, palette cycling, parallax star planes, an astrolabe turning in depth, alchemical glyphs joined by hairlines.

Seed read, without printing it: sixteen digits, sum 90, so a sky state holds between 45 and 90 seconds.
"MVs6" is six sky states; "s6w" the 6px dither chunk on desktop, "64s" the 4px chunk at 390.
"3IP" is three parallax star planes; "t98" is 98 stars per plane at 1440x900, scaled with the viewport area.
"8i8M8" is the 8x8 Bayer matrix, the eight-entry nebula ramp and the eight glyphs in the library.
"z21v" is the 21-second breath of the nebula; "GS6w" is one turn of the rete in six minutes; "LJ7o" its seven star pointers.
"OWGS" is gold and silver, so the sun and the moon are in the glyph library; "Jcyra64" makes constellations of four to six glyphs.
"BF" is 191/255, so the destination sits about three quarters across and a quarter down, ahead and above.
The seed never appears on the page.

## Ground and palette

Deep indigo ground `#0B1230`, never flat black.
Six luminous colours, two light neutrals, one hairline mixed from ground and ash.

| role    | hex       |
|---------|-----------|
| ground  | `#0B1230` (deep indigo) |
| star    | `#ECE7F5` (neutral, body text, brightest cells and stars) |
| ash     | `#9C98B4` (neutral, meta text, captions, the rete) |
| rule    | `#393C59` (ground and ash, 35%: hairlines, the toy frame, spring lines) |
| cobalt  | `#4E8CFF` |
| teal    | `#3ED3C6` |
| violet  | `#9A7CFF` |
| magenta | `#E866B2` |
| amber   | `#F6B44A` |
| coral   | `#FF6E57` |

Every colour on the page is a palette entry or a straight mix of two entries, quantised to eighths.
Nothing glows: brightness comes from a colour, texture from dither, movement from palette cycling.

### The toy's cells

The fourteen-row ramp of variant 12 keeps its shape; the ink rows become star rows so the letters are luminous on the ground:
coral, coral, star, star, coral, coral to amber, amber, cobalt, cobalt, cobalt to teal, teal, star, amber, amber to star.
The hero canvas is transparent: the field drifts behind and between the cells and the hairline frame is the rule, a faint boundary.

### Each system's tints

| system       | tint                                                   |
|--------------|--------------------------------------------------------|
| bouncy balls | falling speed lightens toward star                     |
| magnet       | nearness to the magnet lightens toward star; the ghost is a star ring |
| sand         | flying grains lighten toward star                      |
| life         | live non-logo cells teal, births amber, corrections flash coral, a dead flash is ground to coral |
| bubbles      | sinking cells lighten toward star; bubbles are rings of their own colour with a star highlight |
| swarm        | the flock tints toward violet (where it darkened toward ink on paper) |
| spring mesh  | stretch lightens toward star; springs are rule hairlines |
| fluid        | speed lightens toward star; streaks are the cell colour mixed with star |
| crystal      | walkers are teal to star; a fresh stick flashes star   |

## The sky

One fixed canvas behind everything, full viewport, redrawn every frame from the same fixed 60Hz clock as the toy.
`?seed=<n>` and `?t=<ms>` step it exactly like the foreground: the sky has its own mulberry32 stream derived from the seed, so the toy's run is identical to variant 12's for the same seed, and the sky's run is repeatable on its own.

Layers, back to front:

1. **Nebula.** Three octaves of periodic value noise, shaped by a diagonal band from bottom left to the destination, plus a fixed bump at the destination.
   Rendered to a low-resolution buffer (one pixel per 6px chunk, 4px at 390) through an 8x8 Bayer matrix into an eight-entry ramp of ground tinted with violet, cobalt, teal, magenta, amber and star.
   It breathes by palette cycling: the four coloured entries rotate, and the density offset swings over a 21-second period, so bands crawl through the dither.
   It scrolls at 2.5px per second, the slowest plane.
   Redrawn at 15Hz, like the automata in the toy.
2. **Rete.** An astrolabe rete seen at a tilt, centred on the destination: outer and inner rings, twelve zodiac divisions and thirty-six decan ticks, an eccentric ecliptic, two tropics, seven pointers to seeded stars, and an index arm that turns three times faster.
   One turn every six minutes.
   Drawn in one-pixel lines of ground and ash.
3. **Stars.** Three parallax planes at 5, 11 and 22px per second, drifting down and left because we travel up and right.
   Far stars are ground and star at 45%, mid stars at 70%, near stars are star with one in eight in teal or amber, two pixels wide.
4. **Sigils.** Constellations of four to six alchemical glyphs (fire, water, air, earth, sun, moon, mercury, sulfur) drawn on mid-plane stars, joined in x order by hairlines.
   A constellation forms in three seconds, glyph by glyph and line by line, holds, and dissolves in three.
5. **Passer.** Now and then a large glyph drifts across the nearest plane.

### States

Six, picked at random by the sky's stream, never the same twice in a row, each held 45 to 90 seconds:

- **drift.** The baseline: planes drift, the nebula breathes slowly, the rete is at its faintest, the ramp rotates once every 18 seconds.
- **breath.** The ramp rotates every 3 seconds and the Bayer phase steps every half second, so the whole nebula crawls and changes colour.
- **rete.** The astrolabe steps up from 28% to 55% ash over three seconds and stays forward for the state.
- **sigils.** Constellations form and dissolve one after another, up to two alive at once.
- **shore.** The destination brightens along a half sine over the state, and the star planes speed up to 1.8x as if we were closing in; by the end it has receded again.
- **passing.** A glyph the size of a hand crosses the near plane from right to left over about a minute.

Every quantity is a function of the fixed clock and the seeded stream, so a state schedule replays under the same seed.

## Frame budget

The toy owns the frame: fluid and life cost 1 to 3ms.
The sky is held under 1ms: the nebula is a 36,000-entry lookup at 15Hz plus one scaled drawImage, the stars are about 300 fillRects, the rete about 200 line segments.
No shadows, no blur, no compositing beyond opaque fills and hairlines.

## Foreground and background

The toy box is transparent, so the field drifts through the letters and the near stars pass behind the cells.
The toy and the near stars share one light: the star neutral is both the cells' hot tint and the near plane's colour.
Nothing else crosses: the sky never reacts to the cursor, and the toy never reacts to the sky.

## Type

IBM Plex Mono 400, scale 13 / 16 / 20 / 26, light on dark: star for body and titles, ash for meta, teal on hover, amber for the sound toggle when on.
No ground behind the content column: the nebula ramp tops out at 30% star so the post list stays readable on it.

## Caption

Unchanged: the system name in star, the cursor's role in ash.

## The secret

Type `play`.
The sandbox opens: keys 1 to 9 pick a system by hand, space restarts the running one, a whisper under the caption says so.
Type `play` again to hand the toy back to the loop.
