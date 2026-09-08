# Variant 12 - Playground

The logo is a toy.
It is made of cells that a library of physics and generative systems throws around, and every system heals back into the letters.
The attract loop plays a random system, holds, and plays the next; the visitor's cursor breaks whatever is running, and the system's own dynamics repair it.

Seed read, without printing it: the fourteen digits sum to 57, the run holds for 1.4 seconds between systems (fourteen digits, a hold under two seconds).
"VI" is six, so the mobile cell is 6px and the ghost magnet flips polarity six times a run at most.
"Q4rQ" is the quartering: every glyph cell of the 5x7 font splits 2x2 into four toy cells.
"P2P9" is peer to peer at radius 9: the flock sees nine cells around it.
"N0T" is a logic gate, so the Game of Life is in the library; "dMxx" puts the magnet in; "Bz" the buzz of the swarm and the bubbles.
"O39" makes nine systems; "Xfp8" is the floor of eight the brief asks for.
"GJ14" is the fourteen rows of the toy grid.
The seed never appears on the page.

## Ground and palette

Kept from round seven: warm cream paper `#F3EEE2`, light, calm, no texture.

| role   | hex       |
|--------|-----------|
| ink    | `#1C1B22` |
| cobalt | `#2D5DD6` |
| teal   | `#1E9E8A` |
| amber  | `#F2A33A` |
| coral  | `#E4553F` |
| cream  | `#F3EEE2` (neutral, ground) |
| dim    | `#6E6A70` (neutral, meta text, captions) |
| rule   | `#D9D2C2` (neutral, hairlines, the toy box, spring lines) |

Every colour in the hero is a palette entry or a straight mix of two entries.
Each cell has a home colour by row (a fourteen-row copper ramp: coral, ink, coral to amber, cobalt to teal, ink, amber to light amber).
A system lightens a cell toward cream (the swarm darkens toward ink) in proportion to how hard it is being played with; the mix never leaves the palette.

## Type

IBM Plex Mono 400 everywhere.
Scale 13 / 16 / 20 / 26, line height 1.6 body, 1.3 display.
The logo is the display size and lives in canvas only.

## Logo

"M4NIC" in a 5x7 bitmap font, 29 glyph columns by 7 rows.
Each glyph cell is quartered, so the toy grid is 58 x 14 and the logo is 308 cells.
Cell 12px on desktop (logo 696 x 168), 6px at 390 (logo 348 x 84).
The hero is a toy box: a hairline (rule) frame the height of 520px (400 at 390 wide), and the whole world of a system is inside it.
Walls, floor and ceiling are the frame.

## The system library (nine)

Each is a real simulation stepped on a fixed 60Hz clock.
Each has an in, a life of its own, and a heal.

1. **bouncy balls.** The cells become balls released in a stagger, fall under gravity, collide with each other and bounce on the floor with their own restitution; after a few seconds gravity lets go and springs pull every ball home. Cursor pushes.
2. **magnet.** A ghost magnet wanders a Lissajous path through the letters, attracting, then flipping to repel; cells orbit it against a weak home spring until the magnet leaves. Cursor is the magnet: hover attracts, press repels.
3. **sand.** A falling-sand cellular automaton: grains let go of the letters at random and slide into a heap on the floor; then the letters refill from their bottom rows up, grain by grain. Cursor digs: grains under it are thrown up and fall again.
4. **life.** Conway's Game of Life seeded with the logo runs eight to seventeen generations on the whole box, then an error-corrector flips cells back one by one until the grid equals the logo. Cursor paints live cells, which the corrector also removes.
5. **bubbles.** Cells sink through the floor and come back as bubbles rising with a wobble, each popping into its own place with a ring. Cursor pops bubbles and placed cells; they rise again.
6. **swarm.** Boids: separation, alignment and cohesion at radius nine, bounded by the walls; after a while a home pull grows and the flock lands on the letters. Cursor is a predator the flock flees.
7. **spring mesh.** Cells are nodes linked by springs to their neighbours in the letter; plucks pull a node and release it and the wave rings through the letter. Cursor grabs the nearest node and releases it when it moves away.
8. **fluid.** A Stam stable-fluids velocity field on a coarse grid; random stirs swirl the cells, which are advected as markers with streaks; the field damps and the cells drift home. Cursor stirs with its motion.
9. **crystal.** Diffusion-limited aggregation: one seed per letter stays, every other cell becomes a random walker with a growing bias toward home, and sticks only when it reaches home next to a stuck cell, so the letters crystallise from the seeds. Cursor melts stuck cells back into walkers.

## Randomness

One seeded PRNG (mulberry32) drives every choice: which system is next (never the same twice in a row), release order, restitution, Lissajous parameters, generations of life, stir positions, pluck targets, seeds of the crystal, walker steps.
`?seed=<n>` reproduces a run; `?t=<ms>` steps the fixed clock to that moment before the first paint.
Without a seed the page draws one from the clock.
The systems' own dynamics do the rest: no easing curves, no scripted paths.

## Caption

Under the toy box, 13px: the system name in ink, lowercase, left; the cursor's role in dim on the right ("cursor pushes", "cursor paints").
It changes with the system, like a demo naming its part.

## Sound

Off until the header toggle is pressed; then a short square-wave note on each new system, ticks on bounces, a sweep on pops, a pluck on release.

## The secret

Type `play`.
The sandbox opens: keys 1 to 9 pick a system by hand, space restarts the running one, and a whisper under the caption says so.
Type `play` again to hand the toy back to the loop.
