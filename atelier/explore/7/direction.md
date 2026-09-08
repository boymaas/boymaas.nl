# Variant 7 - direction

Seed read: the digits 1 3 0 1 6 8 7 sum to 26, even, so the ground is light.
"0b" is a binary prefix, "BB" occurs twice, "S1D" reads as SID, "IM" picks the face, 16 sets the base size, 8 counts the copper bars, 7 the idle timer and the star of the sigil.
The seed never appears on the page.

## Ground and palette

Light ground, warm cream `#F3EEE2` (a Risograph sheet, not a grey default).

One palette, five colours plus neutrals:

| role   | hex       |
|--------|-----------|
| ink    | `#1C1B22` |
| cobalt | `#2D5DD6` |
| teal   | `#1E9E8A` |
| amber  | `#F2A33A` |
| coral  | `#E4553F` |
| cream  | `#F3EEE2` (neutral, ground) |
| dim    | `#6E6A70` (neutral, meta text) |
| rule   | `#D9D2C2` (neutral, hairlines and far rain) |

Every effect draws only from this table.
Copper ramps are each colour mixed toward ink or cream, never a new hue.

## Type

IBM Plex Mono, one weight (400), everywhere.
Scale: 13 / 16 / 20 / 26 (ratio ~1.27, base 16 from the seed); the pixel logo carries the display size.
Line height 1.6 for body, 1.3 for display.
Pixel type exists only in canvas: the hero logo "M4NIC" and the scroller, both from one 5x7 bitmap font defined in the JS.

## Layout grid

Container `min(1168px, 100% - 48px)`, centred.
Sections are a 12-column grid split 3 / 9: a small label column on the left, content on the right.
8px baseline; section padding 96px desktop, 56px at 390.
Under 720px every grid collapses to one column.

## Effects (four), each with a job and a boundary

1. Hero (canvas, full container width, 520px tall, 400 on mobile).
   A rain-starfield: three parallax layers of short falling streaks in rule / dim, wind follows the cursor x.
   In front, the pixel logo M4NIC, raster-filled with eight copper bars (four colours, each with a mirror twin, from the doubled B).
   The logo is made of particles: the cursor pushes them and they spring back.
   Motif: rain in the starfield.
2. Divider (canvas, 72px band between hero and posts, hairline above and below).
   A sine scroller of the loves in the bitmap font, letters in ink, with a pixel flask as the separator in coral.
   Cursor x nudges the scroll speed.
   Glyph cell 4px, so it reads as a divider, not a second hero.
   Motif: the flask.
3. Hover (portrait canvas in the bio section, 280x157 at 2px cells).
   The portrait is ordered-dithered (Bayer 4x4) to ink / cobalt / cream.
   On hover its pixels let go and fall like rain; on leave they spring back home.
4. Attract mode (lives inside the hero, wakes after 21 seconds of no input: three times the seed's 7).
   The logo particles morph into a meditating figure; the rain calms to a drizzle.
   Any input morphs it back.
   Motif: the meditating figure.

Sound: a small SID-style square-wave arpeggio, off until the "sound" toggle in the header is pressed.

## The secret

Type `m4nic` anywhere.
The particles form the Monas Hieroglyphica, the rain rises instead of falling, and a whisper appears under the hero.
Type it again to close.
