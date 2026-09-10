# How this design came to be

The site was redesigned in September 2026 with the `atelier` design loop (a Claude Code plugin in github.com/boymaas/metis): Discover variants from seed strings and briefs, Define under a fresh-context screenshot critic, Deliver through a restraint pass and a slop gate.
This folder keeps the context that shaped the result.
The full exploration, 18 variant pages with screenshots and filmstrips, is in git history at the tag `atelier-explore`.

## The path

Six rounds of three variants each, every round a reaction to the last.

1. **v1, a quiet Omarchy-style colony.** Paper ground, tiny colour cells, a hidden hermetic figure. Rejected: "boring, I do not like it at all". Restraint was the wrong axis.
2. **v2, alive and bubbly pixel nostalgia.** An Amiga megademo, a DOS SCUMM room, a 1992 demo party. "Somewhat towards what I want", the demoscene vibe confirmed, too raw.
3. **v3, demoscene as material, Omarchy as composition.** Paper, a raster-filled pixel m4nic with rain, a clean list. "The right direction", but the three converged and the logo sat still.
4. **v4, the logo is a screensaver.** A port of Omarchy's `ttfx --random-effect` machine: an effect library chained at random, the logo never still. Three fixed directions: Terminal, Pixel, Playground. Chosen: **12 Playground**, the wordmark as nine physics systems the cursor breaks and that heal.
5. **v5, the playground floating in space.** The toy over a dark sky with esoteric demoscene effects: Warp, Nebula, Wormhole. Chosen: **14 Nebula**, parallax stars, Bayer-dithered nebulae that breathe, an astrolabe, glyph constellations.
6. **v6, a terminal's typography.** Bitmap, Modern, TUI. Chosen: **18 TUI**, panes with box-drawing borders, bracketed titles, j/k navigation, a hint line. "I love 18. Let's redo the whole website using that style."

The whole site was then rebuilt from 18 into a shared shell and a build script.

## The identity, in the owner's words

Alive, colourful, demoscene, "the joy of working with pixels", composed with Omarchy's taste: calm ground, whitespace, one monospace face, effects with a job and a boundary.
Space: "we are floating in space, travelling towards some destination we do not know yet".
A terminal: panes, keys, prompts.
Resilience: the logo is a toy that heals.
Not wanted: quiet, beige, grey-by-default, wall-to-wall 1992 screens, purple gradients, glows, cards.

## The critic loop

`critiques/rounds.md` has the scores; `critiques/round-N.md` the full critiques.
Three rounds scored 5, 5, 5, and the loop stopped by its two-flat-rounds rule.
Every concrete defect the critic named was fixed; what it kept asking for (delete the nebula, one automaton, monochrome) is the opposite of the chosen identity and was not applied.
The slop detector (`npx -y impeccable detect`) passes with zero primary findings.

## Files

- `briefs.md`: every brief tried, with its verdict.
- `brief-v6-terminal-typography.md`: the last brief in full.
- `directions/12-playground.md`, `14-nebula.md`, `18-tui.md`: the design decisions of the three chosen ancestors: palette, grid, systems, sky states, keys.
- `critiques/`: the Define rounds.
