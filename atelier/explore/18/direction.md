# Variant 18 - TUI

The Nebula page of variant 14, unchanged in sky, toy, palette and content, laid out the way lazygit or htop lays out a screen: panes with box-drawing borders and bracketed titles, a keyboard-hint line at the bottom, and a highlight that j and k really move.
Everything sits on one character grid; the sky drifts through the panes because the panes are only their borders.

Seed read, without printing it: nine digits summing 54, so the cursor blinks every 1.08 s.
"0LM7" is 700, the weight of the focused title; "jyw86D8jg6" is six panes; "FOBs7eiQ" is the eight bindings; "s7e" is esc.
The first letter is a lowercase s, so the corners are square, not rounded.
"GAj" is amber for the marker, "cz" cobalt for the bar, "PczL" the magenta prompt glyph.
The seed never appears on the page.

## Face and scale

JetBrains Mono from Google Fonts, 400 and 700.
The box-drawing glyphs are not in the latin subset, so a second stylesheet link asks for exactly `─ │ ┌ ┐ └ ┘ ├ ┤ █` via `text=`; the borders are therefore drawn in the same face as the text and share its advance.

| role            | size / line | use |
|-----------------|-------------|-----|
| cell            | 15 / 24     | everything on the grid: borders, titles, listings, bio, mail, the caption, the top line |
| display         | 20 / 32, 700 | the one answer line in `[ whoami ]` |
| status          | 13 / 24     | the hint line at the bottom, the colophon |

At 390 the cell is 14 / 22 and the display line 18 / 28.
Nothing else changes size; hierarchy is colour and weight, as in a terminal.

## The character grid

One cell is 1ch by one line: 9 x 24 px on desktop, 8.4 x 22 px at 390.
The page column is a whole number of cells, computed once the font is in: `floor((viewport - 48px) / 1ch)`, capped at 134 columns (1206 px), which is exactly what the widest post row needs: marker, date, a 62-column title, and a 48-column subtitle.
At 390 the margin is 16 px and the column is 42 cells, the width of `└ magnet ─ cursor attracts, press repels ┘`.
Panes are sized in columns: the lower row splits 72 / 60 with a 2-column gutter.
Vertical rhythm is in lines: two lines between panes on desktop, one at 390; one line of padding inside every pane, two columns at the sides.

## Panes and titles

Six panes, top to bottom; the lower row is two columns on desktop and stacks at 390.

| pane        | title line                                                   | content |
|-------------|--------------------------------------------------------------|---------|
| `[ m4nic ]` | `┌─[ m4nic ]─ nine systems, drawn at random ──────────────┐` | the toy, transparent; the caption lives in the bottom border: `└─ spring mesh ───── cursor plucks ─┘`, name bright, role dim |
| `[ whoami ]`| `┌─[ whoami ]──────────────────────────────────────────────┐` | `$ whoami`, the answer line in display size, the lede, then `$ █` with the blinking cursor |
| `[ posts ]` | `┌─[ posts ]─ 17 entries, 2010 to 2015, newest first ──────┐` | seventeen rows: marker, date, title, subtitle, columns fixed |
| `[ work ]`  | `┌─[ work ]─ eight projects, concept, design and code ─────┐` | eight rows: marker, number, name, client |
| `[ mail ]`  | `┌─[ mail ]─ contact ──────────────────────────────────────┐` | two rows: the address, the github link |
| `[ bio ]`   | `┌─[ bio ]─ Den Haag ──────────────────────────────────────┐` | the four paragraphs at a 56-column measure |

The brackets are dim, the name bright; the meta after the title is dim and disappears at 390.
Headings are prompts: the only heading on the page is `$ whoami`, and its answer is the old h1.

## Borders

Light box drawing only: `─ │ ┌ ┐ └ ┘`.
The top border is one flex row of text: `┌─`, the title, the meta, a run of `─` that is clipped at the pane's width, then `┐`.
The bottom border is the same with `└` and `┘`, and `[ m4nic ]` puts the caption inside it.
The sides are a column of `│` at line-height 1.2, so each glyph overlaps the next by a pixel and the line never breaks; the column starts and ends half a line in, exactly where the corner glyphs' vertical strokes begin, so the corners join with no gap and no double stroke.
Because the run of `─` is clipped rather than counted, the borders stay whole at any column count, and because the column count is whole, the right border lands on a cell.
No fills, no shadows: a pane is its border, and the nebula is visible inside and between.

## Terminal colour roles

| role    | hex       | mixed from             | use |
|---------|-----------|------------------------|-----|
| dim     | `#9C98B4` | ash                    | dates, subtitles, clients, meta, brackets, hints, prompt text |
| normal  | `#C4C0D5` | star and ash, 4/8      | body, titles at rest, nav |
| bright  | `#ECE7F5` | star                   | pane names, the answer line, the highlighted title, the cursor, the system name |
| frame   | `#535572` | ground and ash, 4/8    | borders of unfocused panes, the empty marker column |
| focus   | `#9C98B4` | ash                    | borders of the focused pane |
| accent  | `#3ED3C6` | teal                   | the focused pane's name, links on hover, the sandbox whisper |
| marker  | `#F6B44A` | amber                  | the `>` before the highlighted row, sound on |
| bar     | `#24407E` | ground and cobalt, 3/8 | the highlight bar in the focused pane |
| prompt  | `#E866B2` | magenta                | the `$` |

The hint line at the bottom sits on ground at 90%, the one place the sky is dimmed: it is fixed, and text scrolls under it.

## Keys

The hint line reads, keys bright and labels dim:

`j/k move  enter open  tab pane  gg/G ends  esc blur  s sound`

At 390 it is `j/k move  enter open  tab pane  s sound`, and the right end shows `posts 3/17`, the focused pane and the position in it.

| key                 | does |
|---------------------|------|
| `j` / `k`, arrows   | move the highlight one row down or up in the focused list; from nowhere, focus `[ posts ]` first |
| `enter`             | open the highlighted row (a post, a project, the github link) |
| `tab` / `shift-tab` | focus the next or previous pane in page order, scrolling it into view |
| `gg` / `G`          | first or last row |
| `esc`               | blur: no pane focused, the highlight goes dim |
| `s`                 | toggle sound, same as the button |
| mouse               | clicking a pane focuses it; hovering a row in the focused pane moves the highlight |

Digits and space belong to the toy, as before.
`[ posts ]` is focused when the page opens, with the first row highlighted, as a list is when a screen opens.

## Focus, highlight, cursor

The focused pane's border steps up from frame to ash and its name turns teal and bold; nothing else on the border changes.
The highlighted row carries an amber `>` in the marker column, a cobalt bar the width of the pane's inside, and its title in bright.
An unfocused pane keeps its `>` but loses the bar, so where you were stays legible.
The cursor is a bright `█` after the second `$` in `[ whoami ]`, blinking at 1.08 s in steps, never fading.

## The secret

Unchanged: type `play`.
The hint line is a status line, so it changes with the mode: the hints give way to the whisper, in teal, `sandbox open: keys 1 to 9 pick a system, space restarts it, type play to close`.
Type `play` again and the hints return.
