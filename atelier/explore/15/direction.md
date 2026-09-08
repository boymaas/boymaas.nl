# Variant 15 - Wormhole

The playground of variant 12, floating in front of a wormhole.
Behind everything a demoscene tunnel travels, dark and slow, its far end the one bright point.
Stars fall past us into that point.
Deep inside, a hermetic sigil turns, and we see one more ring of it for every stretch of tunnel we cover.
Now and then the rings carry words: as above, so below.

Seed read, without printing it.
The sixteen digits sum to 83.
"Z5" gives five background states and "z3" three rings of the sigil already open when the page loads.
"N47" and "W98" bound how long a state holds, 47 to 98 seconds, and "47" also gives the sigil its seven rings.
"W98" is the count of falling stars.
"a26" is the travel between rings: one new ring every 26 seconds of plain drift.
"4ee9": four wall textures in the weave, and the hue wheel of the walls turns one notch every 9 seconds.
"im2" is the scale of the bitmap words in the rings, two texels per glyph pixel.
"q1" is the one bright point.
"pp" is the pulse the toy sends down the tunnel.
The seed never appears on the page.

## Ground and palette

Ground is abyss `#0A0E24`, a near-black blue, never flat black.

| role      | hex       | use                                                     |
|-----------|-----------|---------------------------------------------------------|
| abyss     | `#0A0E24` | ground, the near walls of the tunnel                    |
| cobalt    | `#4C7DFF` | wall hue, cell rows 8 to 10, links on hover             |
| teal      | `#2ED3B7` | wall hue, cell rows 10 to 11, life and crystal, whisper |
| lilac     | `#B79CFF` | wall hue, the swarm's hot, the sigil's polygons         |
| amber     | `#FFB547` | cell rows 7 and 13, the words in the rings, the far end |
| coral     | `#FF6B5B` | cell rows 1 to 6, sound-on, the pulse                   |
| gold      | `#E8CF7A` | the sigil's circles                                     |
| starlight | `#E8E6F0` | neutral: body type, cells that were ink, the hot mix    |
| dust      | `#8E90A8` | neutral: meta text, captions, the falling stars         |

Hairlines are `mix(abyss, dust, 0.3)` = `#323550`.
Every colour on the page is a palette entry or a straight mix of two entries.
The tunnel's colour comes from six ramps of ten steps, abyss to hue to starlight, and a 4x4 Bayer dither picks between neighbouring steps.
No radial gradient, no glow, no shadow anywhere.

## The toy in this world

Everything from variant 12 stays: the nine systems, the fixed 60Hz clock, the seeded PRNG, `?seed=` and `?t=`, the caption, the sandbox.
The hero canvas is transparent, so the cells float on the tunnel; the box keeps a hairline boundary in the rule colour.
Cell rows keep their copper ramp, with ink replaced by starlight: coral, coral, starlight, starlight, coral, coral-amber, amber, cobalt, cobalt, cobalt-teal, teal, starlight, amber, amber-starlight.
A system's hot mix now goes toward starlight (what went toward cream); the swarm, which darkened toward ink, now shifts toward lilac.
Life's born cells stay amber on teal and its dead flash is abyss toward coral.
Crystal's walkers are teal toward starlight.
Spring lines and the magnet's ghost ring are rule and starlight.

## The wormhole

A fixed, full-viewport canvas behind everything.
It is computed per pixel into a small buffer, at most 48,000 pixels (277 x 173 at 1440 x 900, 149 x 322 at 390 x 844), and scaled up with smoothing off, so one buffer pixel is five or so screen pixels.

The tunnel is the classic: for every buffer pixel, depth is `K / r` and angle is `atan2`, precomputed once into a table twice the buffer size; the visible window slides over that table, which is how the tunnel bends for free.
The wall texture is 256 x 256 texels of intensity and hue class, sampled at `(angle + rotation, depth + travel)`.
Shade falls with radius, so only the innermost pixels reach the bright end of the ramp, and pixels within four of the centre are the one bright point, amber to starlight.
Hue is palette-cycled by band: each depth band of the texture takes its hue from a wheel (cobalt, teal, cobalt, lilac) that advances one notch every 9 seconds.

The walls flow outward as we travel.
The 98 stars fall the other way, into the hole: each has an angle and a depth, its depth grows, it shrinks toward the centre and goes out where the sigil begins, then is reborn at the rim.

The sigil sits at the far end, radius just under a quarter of the short side of the buffer, drawn with Bresenham lines and stepped circles straight into the pixel buffer, one buffer pixel wide.
Seven rings, inside out: a point in a circle, a hexagram, a circle, a heptagram, a circle of twelve ticks, an octagram of two squares, and an outer circle with four small circles at the cardinal points.
Circles are gold, polygons lilac; each polygon turns at its own slow rate, alternate rings the other way.
Rings are revealed by travel: three are open at load, and every 26 seconds of plain drift opens the next; a new ring flashes starlight for a second and a half.
When the seventh has been open for a stretch the sigil folds back to three and starts again.

### States

Five, held 47 to 98 seconds each, the next chosen at random and never repeated back to back.

1. **drift.** Steady travel, the slow turn, stars falling.
2. **bend.** The far end wanders on a Lissajous figure over the state, eased in and out; the tunnel curves, the sigil goes with it.
3. **weave.** The wall texture changes to the next in the library (rings, checker, spiral, lattice) through an eight-second Bayer cross-fade: pixels switch texture one dither level at a time, never a blend.
4. **as above.** The words come out of the hole in the rings: AS ABOVE on the upper wall, SO BELOW on the lower wall as its reflection, in the 5x7 bitmap font at two texels per pixel, amber.
5. **plunge.** Travel four times faster, stars become short streaks, rings of the sigil open at four times the pace.

All of it is deterministic: the background has its own mulberry32 stream derived from the page seed, so the toy's stream is untouched and variant 12's runs reproduce exactly.
States, durations, the first texture, the bend figure, the star field and the initial travel offset all come from that stream.
Travel, rotation, bend and stars advance in the same fixed step as the toy, so `?t=` fast-forwards both layers to the same moment before the first paint; the pixels are only computed at paint.

### Frame budget

Of a 16.7 ms frame the toy takes 1.5 to 4 ms at its heaviest (life on the whole box, the fluid solve).
The background is capped by the 48,000 pixel buffer: about 0.6 ms for the tunnel loop, under 0.1 ms for stars and sigil, and one nearest-neighbour upscale.
The background stays under a third of the toy's cost at every viewport.

### What the layers do to each other

When the toy starts a new system, it sends a pulse down the tunnel: one dithered ring that starts at the rim and falls into the far end over three seconds, teal for life and crystal, lilac for the swarm, coral for the systems whose hot is starlight.
Nothing comes back; the toy does not know the tunnel is there.

## Type

IBM Plex Mono 400, scale 13 / 16 / 20 / 26, unchanged.
Starlight on abyss for text, dust for meta.
Links turn cobalt on hover.
The content column carries no card and no ground of its own; the walls under it never rise above the third ramp step, which keeps the post list at better than 7:1.

## The secret

`play` still opens the sandbox.
Type `above` and the sigil opens all seven rings at once and the words come into the rings; type it again to hand the wormhole back to its states.
