# Brief v4: the logo is a screensaver

Personal site of Boy Maas (m4nic), Den Haag.
Coder from the terminal generation who loves complex dynamic systems, asynchronous agents, science, magic, mystery, colour, sculpture, rain, food, exercise, human behaviour, crypto, hermetism, meditation, hypnosis.
17 blog posts (2010-2015), 8 portfolio projects, a short bio, a contact line.

v3 (demoscene as material, Omarchy as composition) is the right direction and is kept.
Its weakness: the three variants converged on one static-feeling hero, and the logo mostly sat still.

## What is kept from v3

Calm paper ground, one curated palette of five or six colours plus neutrals, one modern monospace face in a real type scale, generous whitespace, effects with a job and a boundary, a clean dated post list, a portfolio list, bio, contact.
No cards, kicker labels, icon tiles, purple gradients, glows.

## What is new: the Omarchy screensaver, ported

Omarchy's screensaver is its block-glyph logo piped through the Terminal Text Effects engine with `--random-effect`: one effect runs to completion, then the next random one starts, forever, at 120fps.
The engine moves every character along its own path with easing, through colour gradients, in scenes.
Its library: beams, binary path, black hole, bouncy balls, bubbles, burn, colour shift, crumble, decrypt, error correct, expand, fireworks, highlight, laser etch, matrix, middle out, orbiting volley, overflow, pour, print, rain, random sequence, rings, scattered, slice, slide, smoke, spotlights, spray, swarm, sweep, synth grid, thunderstorm, unstable, VHS tape, waves, wipe.

The hero is that machine.
The logo is a set of cells (glyphs or pixels), and a library of effects transforms it: dissolves it, rebuilds it, bends it, scatters it, burns it, rains it in.
Rules:

- **Always transforming.** The logo is never still for more than two seconds. An effect runs to completion, holds briefly, and the next one starts. Every effect has an in and an out, or transforms one form into the next.
- **Random, with taste.** The next effect is drawn at random, never the same twice in a row, from a library of at least eight distinct effects. Timing, paths, and particle choices are randomised inside each effect, so no two runs are identical. `?seed=<n>` makes a run reproducible; `?t=<ms>` fast-forwards the clock so a screenshot can be taken at that moment.
- **The joy of pixels.** Each effect should make someone who works with pixels grin: a real black hole, real fireworks with gravity, a real decrypt, a real burn front. The craft is visible. The effect's name shows in small type below the hero, like a demo naming its part, and changes with the effect.
- **The palette holds.** Effects colour only from the page palette, with gradients between palette entries. The ground stays calm; the hero region has a boundary.
- **The cursor participates.** Moving into the hero perturbs the current effect: wind, gravity, repulsion, a spotlight, whatever fits that effect.

## Three directions, one per variant

The seed decides details; the direction is fixed per variant so the three cannot converge.

- **Variant 10, Terminal.** The most faithful port. The logo is block glyphs in a monospace character grid, exactly the Omarchy material. Effects are ports of the TTE library: decrypt, matrix rain, burn, black hole, fireworks, crumble, print, beams, VHS tape, rings. Every cell is a character that keeps its glyph while it travels. The divider and the lists live on the same character grid, so the whole page is one terminal that happens to be typeset.
- **Variant 11, Pixel.** The logo is a chunky bitmap, and the effects are demoscene transforms of its shape: it rotozooms, wraps onto a sphere, ripples as a dot flag, becomes a tunnel and returns, gets copper-filled, is sliced and reassembled, melts and unmelts, stretches as a sine scroller and snaps back. Shape-to-shape morphs, not just entry and exit.
- **Variant 12, Playground.** The logo is a living toy. Effects are physics and generative systems the cursor can play with: bouncy balls with gravity, magnetism, sand falling and refilling, a Game of Life seeded from the logo that is then re-corrected, bubbles rising into place, a swarm with flocking, a spring mesh you can pluck. Randomness is the system's own; the attract loop plays it, the visitor breaks it, it heals.

## Constraints

Static HTML, CSS, and JS in one file per variant; no framework, no build.
Effects drawn in code on canvas with real frames.
Works at 1440 and at 390 wide.
Sound off until the visitor turns it on.
