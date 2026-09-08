# Direction 11: pixel, framebuffer, transform

Seed reading (never shown on the page).
`ray` opens the seed and returns in the middle: every texture effect is ray-cast per screen cell, an inverse map from framebuffer to bitmap.
`V1d03` reads as video: the hero is a framebuffer, a low-resolution ImageData painted per cell and blown up with smoothing off.
`4` appears twice (`E4J`, `T4Q`): one framebuffer cell is 4 CSS pixels at desktop.
`k3x9` closes the string: the letter grid is 9 rows tall, and one logo pixel is 3 cells at the smallest layouts (5 at desktop, 4 at 390).
`3` is the most repeated digit, four times: every effect has three phases, in, run, out.
`WkQ2qW` is a mirror around `Q2`: the dither effect cross-dithers the logo with its own negative, and no home hold is longer than 2 seconds.
`Fuaw` and `Hgm`: the run is a screensaver, never the same effect twice in a row.
`N1` and `hisJk`: the secret is night, and the machine hides in plain sight.

## Ground

Kept from round 9: warm paper `#EDE7DA`, ink `#191815`.
The hero sits in a hairline frame in sand: a screen on the paper.
Inside the frame the framebuffer ground is paper; the secret flips it to ink.

## Palette (six colours plus neutrals, kept from round 9)

- blue `#2F4F9E`
- sky `#78ADD3`
- teal `#2A8C82`
- mustard `#D8A430`
- orange `#E2612A`
- rose `#C24A6A`

Neutrals: paper `#EDE7DA`, sand `#D9D2C2`, mid `#B9B2A2`, dim `#6E685B`, ink `#191815`.
Effects colour only from these eleven values and from linear gradients between two of them.
The logo at rest is a row gradient: teal, mustard, orange, rose, blue, sky, teal, sampled once per logo row.

## Type

Geist Mono 400, one weight (JetBrains Mono, then ui-monospace as fallback).
Scale, ratio 1.2 from 15px: 13 / 15 / 18 / 22 / 26 / 31 / 37 / 45.
Body 15/1.6. Caption 13px.

## The bitmap logo

`m4nic` on a 33 x 9 pixel grid, drawn by hand.
Letters are 7 (m), 5 (4), 5 (n), 3 (i), 5 (c) wide with 2-pixel gaps.
The x-height is 6 rows (rows 3 to 8); the 4 rises the full 9 rows and the i carries its dot in row 1.
Desktop: one logo pixel is 5 framebuffer cells of 4 CSS px, so the logo is 660 x 180 CSS px in a 992 x 440 hero.
390 wide: one cell is 2 CSS px, one logo pixel 4 cells, the logo 264 x 72 in a 342 x 280 hero.
The framebuffer is the same machine at both sizes; only cell size and logo scale change.

## The engine

Fixed-step simulation at 120 steps per second, rendered on requestAnimationFrame.
The buffer is a Uint32 framebuffer the size of the cell grid (248 x 110 at desktop), painted with putImageData and scaled to the frame with image smoothing off.
Two families of effect:

- Inverse-mapped: for each framebuffer cell, compute where in the logo texture it looks (rotozoom, sphere, tunnel, scroller, copper, dither).
  The morph is a lerp in texture space between the identity map and the effect's map, so the flat logo bends into the form and back.
  Tiled copies of the logo, when a map needs them, dither in with the effect's envelope, so home is always a single clean logo.
- Forward-mapped: each lit logo pixel is a chunky particle with a home position (flag, slice, melt, swarm).
  The morph is the particle's path from home and back.

Every effect has a three-phase envelope: in, run, out. At envelope zero the render is pixel-identical to home.
An effect runs to completion, the logo holds at home for 0.5 to 1.4 s, then the next effect starts.
Never the same effect twice in a row.

## Effect library (ten)

1. rotozoom: the logo tiles the plane, spins one to three whole turns while the zoom breathes, and lands exactly on itself. Cursor: the pivot of the rotation follows it.
2. sphere: the flat bitmap wraps onto a turning globe, two copies around the equator, a sand body showing at the poles; it unwraps flat again. Cursor: spin speed and direction follow the cursor's horizontal offset.
3. tunnel: the logo is sucked into a texture tunnel whose mouth wanders; the tunnel rolls and recedes, then flattens back out. Cursor: the tunnel's vanishing point follows it.
4. flag: every logo pixel rides a two-axis sine wave in depth, shrinking and paling as it recedes; squares round into dots on the wave. Cursor: a ripple ring spreads from it.
5. copper: the logo goes to sand and six raster bars in the palette roll through it; faint echoes of the bars cross the whole screen. Cursor: bars bend toward it where they pass.
6. slice: the logo is cut into strips of random height; strips slide out sideways, reshuffle their vertical order, then slide home and reassemble. Cursor: the strip under it is pushed in the direction the cursor moves.
7. melt: columns drip downward at staggered speeds and pool at the floor of the frame with trails, then climb back up and re-form. Cursor: heat, columns under it melt faster.
8. scroller: the logo stretches wide and rides a travelling sine wave, scrolling as a repeating scrolltext, then snaps back into place. Cursor: amplitude follows the cursor's distance from the midline, and the wave bends under it.
9. swarm: the logo explodes into chunks with real velocity, the chunks gather into a wandering swarm, then spring back to their homes and snap in. Cursor: repulsor.
10. dither: an ordered-dither front sweeps the logo into its own negative, a colour block with m4nic knocked out, then sweeps it back. Cursor: a spotlight that keeps the positive form alive around it.

## Randomness

One seeded PRNG (mulberry32) decides everything random: effect order, hold lengths, and every parameter inside an effect (turn count, spin direction, strip heights, shuffle order, melt lags, explosion velocities).
`?seed=<n>` reproduces a run; without it the seed comes from the clock.
`?t=<ms>` runs the fixed-step clock to that moment before the first paint, so a screenshot is a deterministic frame of the seeded run.
The cursor is the only non-seeded input, and it never draws from the PRNG, so it cannot change the sequence.

## Caption

Below the frame, left: a two-digit counter in mid and the effect name in dim, lowercase, 13px, like a demo naming its part.
Right, in mid: `space: next`.
The counter increments per effect in the run.

## Secret

The Konami code (up up down down left right left right b a) switches the framebuffer to night: the ground inside the frame becomes ink, sand becomes dim, shading inverts, the caption reads the effect name with `night` after it.
Again to return.
Space skips to the next effect. Sound is off; the footer offers a one-word toggle for a three-note square-wave sting on each effect change.
