# Variant 8: riso rain

Seed reading (never shown on the page): opens with a lowercase `l`, so the ground is light.
`K` occurs four times, the CMYK key: the page is printed in ink on paper, riso style.
`87` occurs twice: an 8px grid, a 5x7 pixel font, and effect pixels four screen pixels wide (7 is the glyph height, 8 the grid).
`ff` and `aa` are the two doubled pairs: one divider effect that lives in two places, and a two-column layout.
The digits sum to 61: attract mode wakes after 16 seconds of nothing.
`J` twice: JetBrains Mono.

## Ground

Light. Bone paper `#F1ECE2` for the page, a lighter sheet `#FAF7F0` inside every effect region so each effect has a visible edge without a border.

## Palette (riso inks)

- cobalt `#2F4FA2`
- sky `#86A8DA` (the cobalt tint; far rain, portrait midtone)
- vermilion `#E14B2A`
- mustard `#E7B143`
- teal `#1E8C7D` (the flask)

Neutrals: ink `#1B1917`, dim `#6E675E`, mid `#B8AF9F`, ground `#F1ECE2`, sheet `#FAF7F0`.
No colour outside these ten appears anywhere; every intermediate tone is an ordered (Bayer 4x4) dither of two palette entries.

## Type

JetBrains Mono, weight 400 only. Scale 13 / 16 / 20 / 26 / 34 (meta, body, section heads, headline, unused reserve).
Line height 1.6 body, 1.3 headline. Measures capped at 640 to 720px.
Pixel type (5x7, hand-drawn bitmap) only for the logo and the divider ribbon.

## Grid

Max width 1040, 32px side padding, columns 208 | 64 gap | 768.
Section headings live in the left column, content in the right; hero and dividers span both.
Vertical rhythm 128px between sections on desktop, 80 on mobile.
Everything left-aligned; whitespace does the composition.

## Effects (four, each clipped to its own region)

1. Hero, "copper rain": a 400px sheet (260 on mobile).
   A three-depth rain starfield (mid / dim / ink drops, the rain love) falls behind the pixel logo `m4nic`.
   The logo is raster-filled: copper bars in cobalt, vermilion, mustard, teal scroll downward through the glyph mask, shaded by dithering into ink and sheet.
   Cursor: the wind leans the rain toward the pointer.
2. Divider, "sine scroller": a 72px ruled band, twice (posts to work, work to bio).
   Pixel text waves through a sine; the first ribbon lists the languages, the second the interests.
   The separator glyph is a flask in teal (the flask love). Hover deepens the wave.
3. Hover, "glenz cube": a 64px wireframe cube with dithered faces docks in the gutter beside whichever post or project row the pointer is on; its colour steps through the four inks.
4. Attract, "the sitter": after 16s idle, particles fall in from the top of the hero and assemble a pixel meditating figure at the right of the logo while the rain slows; any activity dissolves it downward into rain again.

## Secret

Type `m4nic`, or click the Mercury glyph in the footer: the hero becomes a rotozoom of a hermetic sigil (circle, point, crescent, cross) tiled on a sheet/ground checker in cobalt and vermilion for nine seconds, then the rain returns.

## Sound

Off until switched on in the header: a square-wave arpeggio over a triangle bass at 125 bpm.
