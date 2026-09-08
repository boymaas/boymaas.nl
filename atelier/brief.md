# Brief v3: demoscene, composed with Omarchy's taste

Personal site of Boy Maas (m4nic), Den Haag.
Coder from the terminal generation who loves complex dynamic systems, asynchronous agents, science, magic, mystery, colour, sculpture, rain, food, exercise, human behaviour, crypto, hermetism, meditation, hypnosis.
17 blog posts (2010-2015), 8 portfolio projects, a short bio, a contact line.

v1 (quiet Omarchy colony) was boring.
v2 (a 1992 screen, wall to wall) had the right vibe and too little taste.
v3 is the synthesis: the demoscene is the material, Omarchy is the composition.

## The demoscene is the material

Real effects, rendered live in code, are what the page is made of: copper bars, sine scrollers, plasma, starfields, rotozoom, glenz and wireframe solids, the Boing ball, particle dissolves, dot flags, tunnels, raster-filled type.
Pixels are chunky and honest; dithering is welcome.
The page is alive one second after load and keeps breathing; it reacts to the cursor; there is an attract mode when left alone.
The demoscene vibe must be unmistakable to anyone who was there.

## Omarchy is the composition

Look at `atelier/baseline/omarchy/desktop-tall.png` before drawing anything.
That page is a moodboard for taste, not a target to copy: calm ground, enormous whitespace, one monospace face at one weight, a pixel-dissolve logo that is the only loud thing on screen, type sizes in a clear scale, everything aligned to a grid.

Apply that discipline to the effects:

- One curated palette for the whole page: five or six colours plus neutrals, harmonious, chosen on purpose. Effects use the palette, never their own rainbow.
- Effects are placed, not sprayed: a hero effect, a divider effect between sections, an effect that wakes on hover. Every effect has a job and a boundary; the rest of the page is quiet so the effects can be loud.
- The ground is calm and deliberate; the seed decides light or dark. Never grey-by-default, never black-by-default.
- Type is modern: a monospace face with real hierarchy, readable line lengths, generous margins. Pixel type only for the logo or a single display line.
- Content is a clean structure a visitor can read at a glance: the post list with dates and subtitles, the portfolio as a list or grid, the bio, the contact. No cards, no kicker labels, no icon tiles.
- The loves appear as motifs inside the effects, sparingly: rain in the starfield, a flask in the divider, a meditating figure in the attract mode, a hermetic sigil as the secret. Not a room full of objects.

The test: it must look like a studio designed it and a demoscener built it.
Restrained is not the same as boring; the energy comes from a few effects executed very well.

## Constraints

Static HTML, CSS, and JS in one file per variant; no framework, no build.
Effects drawn in code on canvas with real frames.
Works at 1440 and at 390 wide.
Sound off until the visitor turns it on.
No purple gradients, glows, cards, kicker labels, icon tiles, or any pattern that reads as generated.
