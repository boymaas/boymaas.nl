# Brief v6: Nebula, with a terminal's typography

Variant 14 of round five (`atelier/explore/14/`) is chosen: the playground toy floating over the Nebula sky.
Keep its sky, its toy, its palette, its content and structure.
Change the typography and the typographic conventions so the page feels like a terminal.

## What a terminal feeling means here

Type is monospace and sits on a character grid; alignment is by columns, not by pixels.
Headings are prompts, not titles.
Lists are listings: fixed-width columns, dates aligned, one row per entry.
Dividers are box-drawing characters, not rules.
There is a cursor somewhere, and it blinks.
Colour follows terminal roles: a dim, a normal, a bright, and a few accents from the palette used the way a colour scheme uses them.
A status line may exist.
Whitespace stays generous; a terminal with 80 columns and a lot of margin, not a crowded screen.

## Three directions, one per variant

The seed decides details; the direction is fixed.

- **Variant 16, Bitmap.** A true bitmap terminal face at integer scales, the kind a VT or an early PC drew: VT323, Silkscreen, DotGothic16, or a 5x7 font drawn on canvas for display lines with a bitmap-flavoured mono for body. Prompt-style headings such as `~/posts $ ls`. The caption under the toy is a prompt line with a block cursor. Every letter is made of visible pixels, like the toy.
- **Variant 17, Modern.** A modern coding mono with real hierarchy, the face a 2026 terminal actually runs: JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, or Commit Mono. Conventions from a well-configured shell: an 80-column measure, prompt glyphs before headings, box-drawing dividers, a listing coloured like syntax (date dim, title bright, subtitle normal), a tmux-style status line at the bottom carrying the sky state and the current system.
- **Variant 18, TUI.** The page laid out as a text user interface, the way lazygit, htop, or a Neovim session is: panes with box-drawing borders and bracketed titles, `[ m4nic ]` around the toy, `[ posts ]` around the list, a keyboard-hint footer, and j/k plus enter that actually move a highlight through the posts. Still airy: panes with real padding, the sky visible between them, nothing crowded.

## Constraints

Start from `atelier/explore/14/index.html`; keep the sky, the toy, every system, all content, seed and time handling.
Fonts via Google Fonts links or drawn in code.
Text stays readable over the sky at 1440 and at 390 wide; no font below 13px for body copy.
No cards, no glow, no gradients on type.
