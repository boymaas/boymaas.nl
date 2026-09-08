# Variant 10: terminal, the screensaver ported

Seed reading (the seed itself never appears on the page):
opens with `2`, so there are two grounds, page and sheet, as before.
`VT3` sits in the middle: VT, the terminal, and 3, the logo pixel scale on desktop (one bitmap pixel is three character columns wide, one and a half rows tall).
`59`: five inks, and the five letters of the logo drawn from a 5x7 bitmap (the m gets seven columns, the C64 way).
`m` appears twice and `M` once: the logo is lowercase, `m4nic`.
`SPaRQ`: the fireworks are sparks, `Q` twice: the secret is a vim command line, `:q` included.
`D` three times, `g`/`P` pairs repeated: ten effects, every one with an out and an in.
`YUY`, the one palindrome: VHS tape rows leave to alternate sides and come back the same way.
Digits sum to 44: the hold between effects is 1.2 to 1.8 seconds, never two; the simulation clock ticks at 120 steps a second, like the `--frame-rate 120` in the Omarchy loop.

## Ground

Light, kept from round 8. Bone paper `#F1ECE2` for the page, a lighter sheet `#FAF7F0` for the hero and the divider bands so each effect has a visible edge and no border.

## Palette (riso inks, kept)

- cobalt `#2F4FA2`
- sky `#86A8DA`
- vermilion `#E14B2A`
- mustard `#E7B143`
- teal `#1E8C7D`

Neutrals: ink `#1B1917`, dim `#6E675E`, mid `#B8AF9F`, ground `#F1ECE2`, sheet `#FAF7F0`.
Every colour drawn by an effect is a palette entry or a linear mix between two of them.
Each effect ends in a final gradient drawn at random from a short list of palette pairs (cobalt to vermilion, vermilion to mustard, teal to sky, cobalt to sky, ink to cobalt, mustard through vermilion to cobalt, or plain ink), run along the columns or the rows; the next effect starts from that colouring.

## Type and grid

JetBrains Mono, weight 400 only. Scale 13 / 16 / 20 / 26 (meta, body, section heads, headline).
Body line height 24px, so the page is set on a 9.6 x 24 character grid.
The hero and the dividers are canvases drawn on the same 9.6px column grid with 16px rows: one character cell is 9.6 x 16, and the half-block glyphs ▀ ▄ █ split each cell into two near-square pixels.
Body text, the hero, the divider ribbons and the list columns share the column grid; the page is one terminal that happens to be typeset.
Max width 100 columns (960px) plus 32px padding; columns 208 | 64 | 688 as before, 128px between sections on desktop, 80 on mobile.

## The glyph logo

`m4nic` as a 31 x 7 pixel bitmap (m 7 wide, the others 5, one pixel gaps), the same lowercase bitmap family as the Omarchy logo material.
On desktop the bitmap is drawn at scale 3 into the character grid: 93 columns by 10.5 rows, about 450 character cells.
Scale 2 on tablets, scale 1 at 390 wide (31 columns).
Each cell is a character: full block, upper half or lower half, decided by which of its two pixels are lit.
A cell keeps its glyph while it travels; only decrypt and matrix swap the glyph for a cipher character, and both give it back.
At rest the logo is drawn in ink; every effect leaves it in its final gradient.

## The engine

Fixed-step simulation at 120 steps per second under requestAnimationFrame, with an accumulator.
All randomness comes from one mulberry32 stream seeded from `?seed=<n>` (or a random number when absent).
`?t=<ms>` runs the fixed steps up to that moment before the first paint, so a screenshot at a given seed and time is always the same frame.
Effects chain: one runs to completion, the logo holds for 1.2 to 1.8 seconds, the next is drawn at random, never the same twice in a row.
The hero is a 400px sheet (220px at 390 wide); nothing draws outside it.
The cursor is a pointer in cell coordinates that each effect reads in its own way; without a cursor the run is untouched.

## Effect library (ten)

1. decrypt: out, cells flip one by one into teal cipher characters that keep re-rolling; in, they resolve left to right in a ragged wave and cool from sky to the final gradient. Cursor: a spotlight that re-encrypts resolved cells it passes over.
2. matrix: out, cells let go and fall as cipher glyphs while teal rain streams pour through the whole grid; in, each cell rides a stream down and snaps into place when it reaches home. Cursor: wind, the rain leans toward the pointer.
3. burn: out, a ragged flame front climbs the logo, cells go vermilion, mustard, ash, then rise as smoke; in, a front descends and re-prints the cells white hot, cooling to the final gradient. Cursor: a draught that blows smoke and embers away from the pointer and makes the front run faster near it.
4. black hole: out, cells gather into a spinning ring around a singularity, then the ring collapses into the point, glyphs thinning to ▒ ░ · as they go; in, everything bursts out ballistically and eases home with overshoot. Cursor: the singularity is pulled toward the pointer.
5. fireworks: out, the logo drops off the floor of the hero under gravity; in, one shell per letter launches from the floor with a trail, bursts at its apex into that letter's cells, which fly under real gravity and then home in. Cursor: wind on the sparks while they are ballistic.
6. crumble: out, cells weaken to mid, then crumble from the bottom row up, fall, and stack into piles on the floor; in, a vacuum lifts them from the piles along arcs back home. Cursor: pushes the piles apart and makes the sand fall again.
7. print: out, a cobalt print head backspaces over the logo row by row from the bottom; in, the head types it back top to bottom, fresh cobalt ink cooling to the final gradient. Cursor: the head prints the row nearest the pointer first.
8. beams: out, horizontal and vertical sky beams sweep the grid, knocking out every cell they cross, and a wipe clears the rest; in, beams relight the cells hot and a diagonal wipe fills the gradient. Cursor: the pointer fires a beam down its row and column as it moves.
9. vhs: out, tracking bands wander down the logo shifting rows sideways with cobalt and vermilion channel split and ▒░ noise, then the rows rewind off screen to alternate sides; in, the rows slide back in with overshoot, the tracking settles, a scanline closes the tape. Cursor: one tracking band follows the pointer.
10. rings: out, the cells assemble into five concentric rings, one ink each, counter-rotating at different speeds; in, cells peel off the rings one by one and fly home. Cursor: the rings' centre drifts toward the pointer.

## Caption

Below the hero, on the body grid, 13px: `> ` in dim, the effect name in ink, a blinking block cursor after it, the way a demo names its part.
It changes the moment the next effect starts.

## Dividers

Two ribbon bands, three rows tall, on the sheet: a line of text (languages, then interests) scrolls left at 40px per second in dim.
Characters near the cursor flicker into teal cipher and settle again, the same decrypt as the hero.

## Secret

Press `:` anywhere (or the `:` in the footer) and a vim command line opens under the hero.
`:burn`, `:rings` and the other eight names run that effect at once; `:seed 42` restarts the run with that seed; `:sound` toggles the sound; `:q` stops the screensaver and leaves the logo still in ink until any key; anything else gets `E492: Not an editor command`.

## Sound

Off until the visitor turns it on: a short square blip on each effect change, one pitch per effect.
