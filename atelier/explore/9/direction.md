# Direction 9: paper, copper, rain

Seed reading (never shown on the page).
The seed opens with a lowercase `l` and closes on `w`: light ground, warm white.
The digit 6 is the only digit that appears three times: six colours.
The pair `56` sets the type ratio 6:5 = 1.2 (minor third).
`8` appears twice: an 8-column grid on an 8px baseline.
`j` appears three times and `GE` closes the string: Geist Mono, JetBrains Mono as the fallback.
`s` is the most repeated letter (four times): the divider is a sine scroller.
`Zod`, `mow`, `Ew Ew`: one particle pool that morphs between three targets (wordmark, figure, sigil).

## Ground

Light. Warm paper `#EDE7DA`. Ink `#191815`.
Never grey: every neutral is warmed toward the paper.

## Palette (six colours plus neutrals)

- blue `#2F4F9E` (workbench cobalt)
- sky `#78ADD3`
- teal `#2A8C82`
- mustard `#D8A430`
- orange `#E2612A`
- rose `#C24A6A`

Neutrals: paper `#EDE7DA`, sand `#D9D2C2`, mid `#B9B2A2`, dim `#6E685B`, ink `#191815`.
Every effect samples only these eleven values. No gradients, no glows, no alpha blending except the rain.

## Type

Geist Mono 400, one weight everywhere (JetBrains Mono, then ui-monospace as fallback).
Scale, ratio 1.2 from 15px: 13 / 15 / 18 / 22 / 26 / 31 / 37 / 45.
Body 15/1.6, max measure 68ch. Pixel type only inside the canvases (a 5x7 bitmap font drawn in code).

## Grid

Content column max 1040px, 24px gutters, 8 columns.
Lists use the grid: tile (40px) | date or client (2 columns) | title and subtitle (remaining).
At 390 the list collapses to tile | stacked text.
Vertical rhythm on 8px; sections separated by 96px of paper and nothing else.

## Effects (four, each on its own canvas, each clipped to its box)

1. Hero, one canvas the width of the column and 440px tall (280 on mobile).
   A parallax starfield in sand and mid drifts left.
   A pool of 310 chunky particles forms the wordmark `m4nic` in the 5x7 font at 2x, raster-filled: copper bars in the six colours roll down through the letters, two rows per band.
   Particles the wordmark does not need fall as rain (sky) through the starfield.
   Cursor: particles within reach are pushed away and spring back.
   Attract mode: after seven seconds without input the same particles fly into a seated meditating figure and wave as a dot flag in blue, sky and teal; the rain stops. Any input brings the wordmark back.
   Loves inside: rain, meditation, colour, dynamic systems.
2. Divider between Posts and Work, one canvas 72px tall.
   Sine scroller in ink, 5x7 font at 3x, carrying the bio in one line; an Erlenmeyer flask glyph in teal recurs in the text (science, magic).
   Hovering bends the wave under the cursor.
3. Hover, one 40px tile per list row, blank paper until hovered.
   A Bayer-dithered plasma in the six colours wakes inside the tile of the row under the cursor and dies when the cursor leaves.
4. Portrait, one canvas, drawn once: the photograph ordered-dithered to ink, blue, mid, sand and paper at 4px pixels.

## Secret

The Konami code (up up down down left right left right b a) sends the hero particles into the Monas Hieroglyphica, drawn in mustard and orange, and the scroller switches to SOLVE ET COAGULA. Escape or thirty seconds returns the wordmark.
Sound is off; the footer offers a one-word toggle for a square-wave arpeggio.
