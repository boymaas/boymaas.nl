# Brief v5: the playground, floating in space

Personal site of Boy Maas (m4nic), Den Haag.
17 blog posts (2010-2015), 8 portfolio projects, a short bio, a contact line.

Variant 12 of round four (`atelier/explore/12/`) is chosen: the logo as a toy box of real simulations that the cursor breaks and that heal themselves.
Keep its engine, its nine systems, its resilience, its content and structure.
Change the world it sits in.

## The feeling

We are floating in space, travelling towards a destination we do not know yet.
The page is dark: deep space, a starfield, the cool ones from the past.
Something is always drifting past or towards us.
The destination is hinted at and never reached.
Behind the stars, really cool esoteric effects: sacred geometry, hermetic sigils, an astrolabe, a mandala, constellations that are alchemical glyphs, rendered as demoscene effects rather than illustrations.

## Layers

1. **Background, full bleed, fixed.** The starfield and the esoteric effect, on their own canvas behind everything, moving always, slowly, at low contrast so the page stays readable.
   It has its own small library of states that change at random over minutes, the way the foreground changes over seconds.
   Deterministic under `?seed=<n>` and `?t=<ms>` like the foreground.
2. **Foreground, the toy.** Variant 12's playground, its cells now luminous on dark, floating in the field rather than boxed on paper.
   The hairline frame may stay as a faint boundary or go; the caption with the system's name stays.
3. **Content.** The dated post list, work, bio, contact, in the same monospace discipline, light type on the dark ground, generous whitespace, readable line lengths.

## Colour

Dark ground chosen on purpose: a deep navy, a near-black blue, a deep indigo, never flat black.
One curated palette of five or six luminous colours plus the ground and two light neutrals.
No purple-to-blue gradient washes, no glow halos, no radial spotlights: the demoscene got its colour from dithering and palette cycling, and so does this.

## Three directions, one per variant

The seed decides details; the direction is fixed.

- **Variant 13, Warp.** A classic 3D starfield flying towards a vanishing point, the destination. Far away at that point, sacred geometry slowly turns, a flower of life or Metatron's cube drawn in one-pixel lines, never getting closer. Now and then a hyperspace streak. The toy floats in the middle of the flight.
- **Variant 14, Nebula.** Parallax star layers drifting sideways, and behind them dithered nebulae in the palette, chunky Bayer dither, palette-cycled so they breathe. An astrolabe or zodiac ring turns very slowly in the depth, and constellations are alchemical glyphs joined by hairlines. We drift; the destination is a brighter region we never reach.
- **Variant 15, Wormhole.** A demoscene tunnel effect, dark and slow, its far end the only bright point. Stars fall into it. Deep in the tunnel a mandala or hermetic sigil rotates and is revealed one ring at a time as we travel. "As above, so below" lives here.

## Constraints

Start from `atelier/explore/12/index.html`; keep every system and all content.
Static HTML, CSS, and JS in one file; no framework, no build.
Effects drawn in code on canvas with real frames.
Works at 1440 and at 390 wide; the background must not cost more than the foreground in frame budget.
Sound off until the visitor turns it on.
