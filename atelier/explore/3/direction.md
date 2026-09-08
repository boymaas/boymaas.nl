# Variant 3: as 6 is to 9

## What the seed gave

The string is read as a set of hints, never shown.
Its first two characters become a number, 27, and that number is used wherever a value would otherwise be a default.
Two palindromes sit inside it (APA, xdx): symmetry, a thing that reads the same from either side.
The digits 9 and 6 keep mirroring each other: 9 is a 6 turned around.
That is the whole figure: the lower half of the hidden drawing is the upper half rotated by 180 degrees, as above so below, as 6 is to 9.
Four x's: four agents, with x-d-x the carrier between two others.
An N5: five stations on the figure, a pentagon.
An ff: the two hex digits of full, the reveal is at full alpha and full colour.
Nine is the most frequent digit: nine hues.

## Colour

One saturation family: every hue at 52% saturation, 56% lightness, on a warm tinted ground.
Nine hues, starting at 27 degrees and stepping by 40, so the wheel is walked once:

- 0 amber #c98954
- 1 olive #bcc954
- 2 leaf #6ec954
- 3 emerald #54c989
- 4 teal #54bcc9
- 5 blue #546ec9
- 6 violet #8954c9
- 7 magenta #c954bc
- 8 rose #c9546e

Ground: #f7f2ed (hue 27, never grey, never black).
Ink: #3d3229, one ink for all body text.
Muted ink for dates and subtitles: #837467.
Rules: #e4dad2.
No gradients anywhere.
The purples exist only as flat cells and one flat station line.

## Typography

Fragment Mono, regular, the only weight the face ships.
Body 15px, line-height 1.65, column of 60ch.
Headings are the same size as the body, distinguished by ink and whitespace only.
Left margin on desktop is 27vw, so the column sits off-centre and the colony has the right two fifths of the screen.

## The automaton

Cell size 7px, one solid square per cell, no gap.
Rule: Life (B3/S23) with a hue inheritance: a newborn takes the majority hue of its three parents and with probability 1/3 steps one hue further around the wheel, so colour drifts slowly through the family.
Tick every 800ms; births fade in over a tick.
Random 3x3 spores keep the field from settling, capped by density.
A text mask thins the field: inside a text box nothing is born and nothing survives; a three-cell halo keeps only a third of what it would.
Rain is a toggle in the footer, remembered.
Rain drops are single cells falling in the two blue hues; where a drop lands, a cell is born, so rain visibly waters the colony.

## The agents

Four workers, 4x6 cells, drawn in ink only with a thin ground-coloured edge so they cut cleanly when they cross text, one coloured cell for whatever they carry.
On desktop they live in the 27vw margin and the right two fifths; on narrow screens they keep to a lane at the right edge and the collector stands in the empty run after each date.
Gait: two frames, one cell per step, axis by axis, no easing.

- Collector: walks to each post in view, takes its colour, brings it to the carrier.
- Carrier: waits mid-field; takes a post to the sitter; takes the seed the sitter has ripened back out to the tender.
- Tender: plants each seed as a small living pattern in a clear part of the field; between seeds it walks to cells that have crept into the text halo and removes them.
- Sitter: sits at the foot of the left margin (bottom right on narrow screens), breathes one cell, and keeps a row of the seventeen posts on the ground beside it.

Every handoff is a pause of a third of a second with the coloured cell moving from one sprite to the other.

## The figure

Drawn once per viewport into an offscreen cell canvas, in one-cell line-work, full palette.
Two concentric rings (amber, olive), the tablet in emerald with dashed lines, AS ABOVE in blue above the ring and SO BELOW under it rotated 180 degrees.
Five stations on a pentagon inside the ring, top vertex up: lab (flask, teal), dojo (crossed staffs, rose), kitchen (pot, leaf), temple (columns, violet), trading floor (bars, magenta).
Station labels in a 3x5 pixel font appear only where the ring is large enough.
Hold space to see it; or be still for 27 seconds and it comes by itself and stays until you move.
While it shows, the cells drop to a quarter of their alpha and the text dims a little; release and the surface returns.
?reveal=1 starts with the figure shown.

## Teletype and portrait

On the first view the text prints word by word at a fast reading pace, top of the document downward; any scroll or key finishes it, and it never runs again (localStorage).
Headless browsers and reduced-motion users get the text at once.
The portrait is sampled into 4px cells; on scroll each cell drifts on its own vector and fades, and drifts back when you return.

## Mood

A quiet page that is busy in the margins.
Nothing is loud; the colour is everywhere and behaves.
The stillness is the interaction, the drawing underneath is the reward.
