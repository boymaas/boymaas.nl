# Direction: variant 1

## Read of the seed

The string opens with two digits, then runs 64 characters long with 24 capitals, 30 lowercase, 10 digits.
Those counts became the constants of the page: the field has 24 hues, the column is 68 characters wide, cells sit on an 8 pixel pitch and are 6 pixels square, the clock ticks every 680 ms, the breath timer waits 68 seconds.
The digits present in the string are 0 3 5 6 7 8 9; the pair 3 and 6 picks the automaton rule (HighLife, B36/S23).
"j" is the most repeated glyph (five times counting case), so the colony has four workers plus one hand-off loop that goes round like a hook.
"uvv" in the middle is the only run of one letter: a small wave, the rain.
The seed is never printed and nothing in the page spells it.

## Colour

One saturation family for everything that lives; one tinted ground; one ink.

- Ground: `#f3f6e5` (hue 68, a pale chartreuse cream; never grey, never black)
- Ink: `#32351d` (the same hue 68, dark)
- Muted ink for dates, subtitles, clients: `#7a7e63`
- Rules and the print cursor: `#d7dbbd`
- Surface cells: 24 hues at 15 degree steps, all `hsl(h 52% 58%)`, e.g. `#cc5c5c` `#ccb05c` `#94cc5c` `#5ccc78` `#5ccccc` `#5c78cc` `#945ccc` `#cc5cb0`
- Figure (hidden layer): the same 24 hues at `hsl(h 72% 46%)`, e.g. `#ca2121` `#caa021` `#75ca21` `#21ca4b` `#21caca` `#214bca` `#7521ca` `#ca21a0`
- Rain: hue 205 from the surface family

No gradients anywhere. No glows. No cards. Colour lives only in the cells and the figure; the type is one ink.

## Typography and layout

Fragment Mono, 400 only (the face ships one weight, which settles the question).
15 px on desktop, 14 px at 390, line height 1.65.
One left-aligned column, 68ch wide, on a wide left margin at 1440 and a 20 px margin at 390.
Headings are the same size as body text, set with a leading `#` to read like a terminal prompt.
Post rows are `date  title` with the subtitle indented on the next line, in muted ink.
No cards, no labels, no icons; the navigation is one line of plain links.

## The colony

Cells: 6 px squares on an 8 px pitch over the whole document, drawn on one fixed canvas behind the text.
Rule: HighLife (B36/S23) every 680 ms, plus a trickle of random births so the field never settles into still lifes.
A newborn takes a parent's hue stepped one notch round the 24-hue ring, so colour drifts slowly across the page.
Inside the bounding boxes of text the survival chance drops to 25% per tick and births are forbidden, so the field thins to a few pale flickers around words.
Rain (toggle in the footer, remembered in localStorage) drops blue streaks that seed births where they land.

Cells born on the hidden figure's line-work quietly take the figure's hue; the colony walks on it before anyone sees it.

## The agents

Four 7x7 pixel workers in ink, drawn with 3 px pixels, moving one grid cell per 110 ms in Manhattan steps.
- Collector: bag at the hip. Walks to a visible post row, takes a coloured token (hue from the post's year), brings it to the depot.
- Carrier: no tool, the token in hand. Waits at the depot, takes the token to the sitter, and when the sitter's pile is full brings the bundle to the tender.
- Sitter: seated, never moves. Receives tokens and stacks them beside itself in a small pile.
- Tender: staff in hand. Wanders the field, plants a pattern where it is sparse, trims where it is crowded; plants the bundle the carrier brings.
Hand-offs happen on adjacency: the token cell moves from one sprite to the other. No faces, no bounce, no labels.

## The figure

Drawn in strict pixel line-work on the same 8 px grid, in document coordinates, so it lies under the whole page.
A large circle at the top of the page with an inner circle, a large circle at the bottom, one vertical axis joining them, and an inscribed tablet at the centre with three lines of text.
"as above" is printed in pixel type under the top circle, "so below" above the bottom one.
Five stations (lab flask, dojo stance, kitchen pot, temple, trading floor chart) sit on a ring around the tablet, each joined to it by a spoke.
Each element has its own hue from the figure family.
Hold space, or hold a finger on the field, and it comes through in 0.6 s while the type dims; release and the surface returns.
After 68 s without input the page takes one slow breath: the figure shows for a few seconds and recedes.
`?reveal=1` opens with the figure showing.

## Teletype

Text is present from the first paint as ghost ink (42% opacity) so nothing is ever blocked; a print head walks through it at about 40 characters a second and inks it.
The head skips ahead to whatever is on screen if the reader outruns it, and any key or click finishes the print.
It runs once per browser (localStorage).

## Mood

A terminal left open in a bright kitchen with the window ajar: quiet, chartreuse daylight, a field of coloured grains slowly rearranging, and a few small workers who do not look up.
