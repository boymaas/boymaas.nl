# Variant 13 - Warp

The playground of variant 12, unchanged as an engine, now floats in the middle of a flight.
Behind everything a classic 3D starfield flies towards a vanishing point, and at that point, far away and never arriving, the flower of life turns in one-pixel lines.
Now and then the ship jumps: a hyperspace streak burst.
Now and then a body passes.

Seed read, without printing it.
Its first capital is F, followed by I and Y: the Flower Is Yonder, so the geometry is the flower of life, not Metatron's cube.
It carries six digits, so the palette has six luminous colours and the sky has six states.
The first three digits are 298: the cruise star count. The last three are 789: the dense star count and the pool size.
Their sum is 43 and the last two reversed are 89: a sky state holds between 43 and 89 seconds.
The seed is 64 characters long, so the flower turns once every 64 seconds.
"Sk9" is the streak: the burst multiplies speed by nine. "Sk" appears twice, so a burst lasts between three and a half and five seconds.
"w8" is the roll: one full roll of the field every eight minutes.
"z2P" is the veer: the vanishing point wanders by up to a ninth of the viewport (the 9 next to the second Sk).
"g7" is the passing body: its radius is seven percent of the shorter viewport side.
The Dutch digraph IJ appears twice: two light neutrals.
The seed never appears on the page.

## Ground and palette

Ground is deep indigo navy `#0B1029`: near black, blue on purpose, never flat black.

| role   | hex       |
|--------|-----------|
| ground | `#0B1029` (neutral, the page and the sky) |
| star   | `#EEF1FA` (light neutral: body text, near stars, cells when played hard) |
| mist   | `#8C95B6` (light neutral: meta text, captions, mid stars, the flock in flight) |
| rule   | `#323853` (mix of ground and mist at 0.3: hairlines, the toy frame, far stars) |
| blue   | `#4F8DFF` |
| aqua   | `#2ED3C6` |
| mint   | `#8FE388` |
| gold   | `#F5B942` |
| coral  | `#FF6A5B` |
| rose   | `#EE6FB5` |

Every colour on the page is a palette entry or a straight mix of two entries.
No gradients, no glow, no radial spotlights: depth is three palette bands, shading is Bayer 4x4 ordered dither, motion colour is palette cycling.

### The toy's cells

The fourteen-row ramp of variant 12 keeps its shape with the paper roles flipped: what was ink is now star, what leaned toward cream now leans toward star.

Rows top to bottom: coral, coral, star, star, coral, coral to gold, gold, blue, blue, blue to aqua, aqua, star, gold, gold to star at 0.35.

A system lightens a cell toward star in proportion to how hard it is played.
The swarm is the exception, as before: in flight the flock dims toward mist and lights up as it lands.

### Each system's tints

| system       | hot (played) | its own tints |
|--------------|--------------|---------------|
| bouncy balls | star         | - |
| magnet       | star         | ghost ring in star |
| sand         | star         | - |
| life         | aqua         | born cells mint, other live cells aqua, corrections flash rose, dead-cell flash a mix of ground and rose |
| bubbles      | star         | bubble outline in the cell's colour, highlight toward star, pop ring fades to star |
| swarm        | mist         | - |
| spring mesh  | star         | springs in mist, one pixel |
| fluid        | star         | streaks in the cell's colour mixed to star |
| crystal      | aqua         | walkers in mint, sticking flash toward star |

## The sky

A second canvas, position fixed, full viewport, behind everything, drawn at one canvas pixel per CSS pixel with `image-rendering: pixelated`, so a one-pixel line is one chunky pixel on every screen.
It steps on the same fixed 60Hz clock as the toy, in the same `step()`, and is fast-forwarded by the same `?t=` loop before the first paint.

### Stars

A pool of 789 stars, projected from 3D to the vanishing point: screen = vp + (x, y) / z * focal, focal 0.6 of the longer viewport side.
A star is born at the far plane inside the view (with a margin of 1.1) and leaves by the edges as it nears, the classic starfield.
The first field is born at every depth, so the flight is already underway when the page opens.
A star is one pixel far away, two pixels in the middle, three near.
Depth is three palette bands, never a fade: far is a mix of ground and mist at 0.6, mid is mist, near is star.
Fifteen percent of the stars carry a luminous colour drawn from the six, in the same three bands (mixed to ground at 0.55, at 0.8, then pure).
When a star passes the near plane it is reborn at the far plane at a new place, or switched off if the state wants fewer stars; the count changes gradually, three births a step, never in a wave.

### The flower

The flower of life: nineteen circles on a hex lattice, two outer circles, one pixel wide, centred on the vanishing point and turning once every 64 seconds.
Its outer radius is a fifth of the viewport width (0.44 of it under 720 wide), capped at 0.32 of the height: 288px at 1440, 172px at 390, so the logo floats inside it, and a tall viewport never grows it over the post list.
It is fixed in size: far away, never arriving.
Its three rings cycle through blue, aqua and mint every four seconds, the way a copper bar cycles, each mixed to ground at 0.35 so it stays behind the page.
Stars pass in front of it.

### The vanishing point

Horizontally the centre of the viewport; vertically the centre of the toy box on load, clamped between 12 and 55 percent of the viewport height.
It stays put in the viewport when the page scrolls: the toy floats past it, the destination does not move.

### States (six)

Sky states change at random over minutes, the way the toy changes over seconds.
Each holds for a time drawn from its own range, then the next is picked at random, never the same twice in a row.
Parameters (speed, roll rate, veer amplitude) follow their targets with a first-order lag of 1.5 seconds: a ship's inertia, not an easing curve.

| state  | what it is | stars | speed | hold |
|--------|------------|-------|-------|------|
| cruise | steady flight | 298 | 1 | 43 to 89 s |
| dense  | the field thickens | 789 | 0.7 | 43 to 89 s |
| burst  | hyperspace: speed times nine, every star a streak cycling gold, coral, rose, blue | 500 | 9 | 3.5 to 5 s |
| roll   | the whole field rolls around the vanishing point, one turn per eight minutes; the angle stays | 298 | 1 | 43 to 89 s |
| veer   | the vanishing point wanders a Lissajous up to a ninth of the viewport; the flower rides it | 400 | 1.2 | 43 to 89 s |
| passer | a body crosses the screen at mid depth: a sphere dithered in Bayer 4x4 between ground, its tint (mist, gold, blue or rose) and a lighter tint; far stars vanish behind it, near stars cross in front | 298 | 0.8 | 29 to 43 s, the crossing |

### Determinism

The sky has its own mulberry32 stream, derived from the seed (seed xor the golden ratio constant), separate from the toy's.
Every sky choice goes through it: state order, hold lengths, star births, which stars are coloured, the body's tint, lane and light.
Because the stream is separate, playing with the toy (which draws from the toy's stream on cursor moves) never changes what the sky does, and `?seed=7&t=<ms>` reproduces both layers exactly.

### Frame budget

The foreground gets two thirds, the sky one third.
The sky's frame is bounded by construction: at most 789 one- or two-pixel rects, four batched stroke paths in a burst, 21 circle arcs for the flower, and one `drawImage` for the body (its dithered sprite is built once when the passer state begins, never per frame).
At one canvas pixel per CSS pixel it never pays the retina multiplier the toy pays.
The toy is heavier every frame (308 cells with round rects, plus the running system's grid work: Life on the whole box, the fluid solver, the sand automaton).

### What the layers do to each other

Toy to sky: the ship flies at full speed only when the letters are whole.
Disorder, the mean distance of cells from home, slows the field down to 0.35 of the state's speed with a 1.2 second lag, so a broken toy drops the ship out of warp until the system heals it, and the flower flashes once, brighter for a second and a half, each time the letters come whole.

Sky to toy: a hyperspace burst jolts every cell a little as it begins; the running system heals the jolt like any other break.
Nothing else: the toy does not feel the roll or the veer.

## Type

IBM Plex Mono 400 everywhere, star on ground, mist for meta.
Scale 13 / 16 / 20 / 26, line height 1.6 body, 1.3 display.
Links turn blue on hover.
The toy frame stays as a hairline in rule, a faint boundary in the field; the toy canvas is transparent so stars pass behind the letters.
The content sits directly on the field with no card: the stars are mostly rule and mist, one pixel, so the post list stays readable.

## Caption

Unchanged: the system's name in star, lowercase, left; the cursor's role in mist on the right.

## Sound

Unchanged: off until the header toggle is pressed.

## The secrets

Type `play`: the toy's sandbox, as in variant 12 (keys 1 to 9 pick a system, space restarts it).

Type `warp`: the helm opens.
Keys z, x, c, v, b, n pick a sky state by hand (cruise, dense, burst, roll, veer, passer) and a whisper under the caption says so.
Type `warp` again to give the sky back to chance.
