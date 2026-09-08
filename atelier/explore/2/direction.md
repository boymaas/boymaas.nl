# Variant 2: the doubling field

## What the seed gave

The seed is 64 characters, an 8 by 8 square.
Its digits read 3, 6, 12, 00, 4, 8, 48: the doubling run 3-6-12-24-48 with the 24 left silent.
That run is the whole spatial system of this variant: 3px portrait pixels, 6px field cells, 12px agents, 24px line height, 48px margins, a 48 second breath.

The first letters after the digits are "Vivem" (they live) and "Bio".
So the field is literally alive: the automaton is a life rule, and the digits 3 and 6 that open the seed pick it: HighLife, B36/S23, the life rule with a replicator.
Colour is inherited, not painted: a newborn cell takes the hue its parents agree on, with a one-in-twelve drift.

"Z00": two zeros, two circles, above and below.
"wNd": the rain has wind in it and falls slanted.
"RetR" and "YTY" are mirror runs: the figure is built on a vertical mirror axis, the page is not.
"EOlY" at the tail reads olive without its first letter: the ground is a pale olive-lichen paper, never grey.
"Drs." is the Dutch academic title; the tablet in the figure carries lines of text rather than decoration.

## Colour

All colours are OKLCH from one saturation family.

- Ground: `#f4f5e7` (L .965, C .018, h 110). Pale lichen paper.
- Ink: `#28311f` (L .30, C .035, h 130). One ink for every letter, link and agent.
- Field, 12 hues on a 20-262 degree arc (no violets), L .74 C .10:
  `#e39191 #e19678 #d79d66 #c7a65d #b1b062 #96b874 #79bd8c #5ec0a6 #50bebf #56bad5 #6db3e4 #88abea`
- Figure, same 12 hues at L .55 C .15 (full colour, only under the surface):
  `#b9454c #b64c1b #ac5900 #986800 #7b7600 #538200 #008942 #008c6b #008a8e #0083ab #0079bf #3e6dc8`

Nothing is louder than the field; the field is never louder than the ink.

## Layout

One column of text, 64ch wide (the seed length), set left of centre on desktop so the colony has open ground to the right.
A 6px grid under everything: type on a 24px line, sections 96px apart, 48px margins.
Sections in order: name and nav, a teletyped intro line, the portrait, posts (17, newest first), work (8), about, contact, footer.
No cards, no rules heavier than one cell, no labels above headings.
At 390 wide the same column fills the width and the portrait shows at 1x (280px).

## Typography

Fragment Mono, regular, the only weight it has.
15px on desktop, 14px at 390; line height 24px on desktop, 21px on mobile.
Headings are the same size as body, set in the same ink, marked only by a cell-wide coloured pixel that the tender agent keeps alive.
Dates in the same ink at 55% opacity.

## The automaton

HighLife (B36/S23) on a 6px cell grid over the whole viewport, stepping every 300ms.
Each live cell has one of the 12 hues; births inherit the modal hue of the three parents, drifting one step round the arc with probability 1/12.
Cells fade with age so settled still lifes go quiet and only new growth is at full strength.
Inside a text block's rectangle (plus one line of padding) births succeed one time in eight, so the field visibly thins around text rather than being masked.
A sparse random seeding keeps the field from dying out.
Rain: a toggle in the nav (no weather source). Drops are single cells of the blue end of the arc, falling one cell per step and sliding one cell to the right every third step (the wind). Where a drop lands on empty ground it seeds a birth.

## The agents

Four workers, 12px wide, drawn in ink pixels on the same 6px grid, one walk frame every 120ms, one cell per step.

- The collector walks the post list. At each post row it takes one token, a single cell coloured by the post's year, and carries it to the handover point.
- The courier waits at the handover point, takes the token from the collector (both stand still one beat, the token moves across), and carries it to the sitter.
- The tender walks the open field. Where a region has gone dead it plants a HighLife replicator; where a region is overgrown it clears a line. It also keeps the heading pixels lit.
- The sitter sits by the right margin and does not move except one pixel of breath every four seconds. Tokens are stacked beside it, a column of colour that grows as the collector works.

They are drawn with no faces, no eyes, and no bounce.

## The portrait

The 280x157 portrait is sampled into 6px source cells and drawn 2x on desktop, 1x on mobile, with nearest-neighbour scaling.
On scroll each cell falls out of the image along the wind vector with its own delay and shrinks to nothing; scrolling up reforms it.
If the pixels can be read (served over http) the falling cell is born into the field with the nearest palette hue; on file:// the fallback hue is the cell's column.

## The hidden figure

Drawn once on its own canvas beneath the field, in one-cell pixel lines, on the vertical mirror axis of the viewport.
Two circles, one above one below, overlapping in a vesica; inside the vesica a tablet with ruled lines.
"AS ABOVE" above, "SO BELOW" beneath, in a 3x5 pixel font.
Five stations on the outer ring, each a small pixel glyph with its name: LAB (flask), DOJO (crossed staves), KITCHEN (pot on flame), TEMPLE (arch), FLOOR (candles). Lines between them make the pentagram.
Each station in its own figure hue; the circles in ink.

Hold space (or press and hold the "breathe" word in the footer) and the figure fades in over 1.2s while the text fades to a whisper; the colony keeps walking.
Or wait 48 seconds without touching anything and it breathes through by itself over 12s.
Release, or any input, and the surface returns.
`?reveal=1` starts revealed.

## Teletype

Only the intro line prints, once, at 20 characters a second, with its height reserved so nothing moves.
Everything else is present from the first frame.
A localStorage flag stops it repeating.

## Mood

A wet garden wall in Den Haag: lichen, patient, alive at a scale you only notice when you stop.
