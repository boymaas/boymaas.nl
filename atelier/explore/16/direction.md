# Variant 16 - Bitmap

The Nebula page of variant 14, unchanged in sky, toy, palette and content, set as a VT would set it: every letter made of whole pixels, one pixel per pixel.
Headings are prompts, the post list is `ls -lt` output, the portfolio is a `tree`, and a block cursor blinks after the line that runs the toy.

Seed read, without printing it: "Vt" picks VT323, the DEC VT320 glyphs, for everything that sits on the grid; "Ss" picks Silkscreen for the one banner line.
Thirteen digits summing to 56, so the page is 112 columns wide, twice 56.
"I0" is a one-second cursor blink; "2B" holds the cursor solid for two seconds after paint before it starts, the way a terminal comes up.
"z2" is the double-height prompt; "3z" the 3x banner at 390; "9w93" the 96-column listing measure.
"LFS", "tS" and "cp" are `ls`, `-lt`, `tree` and `cat`.
The seed never appears on the page.

## Faces and integer scales

| role | face | size | pixel | cell |
|------|------|------|-------|------|
| body, listings, caption, nav, footer | VT323 | 25px / 30px rows | 1px | 10 x 25 |
| prompts (h2) | VT323 | 50px / 60px rows | 2px | 20 x 50 |
| banner (h1) | Silkscreen | 32px / 40px at 1440, 24px / 30px at 390 | 4px, 3px | proportional, caps only |
| box drawing, block cursor, tilde | m4box, drawn in code | inherits | 1px, 2px | 10 x 25 |

VT323 is drawn on a lattice of 40 font units per pixel in a 1000-unit em, advance 400: at 25px one font pixel is exactly one CSS pixel, the advance is 10px, cap height 14px, x-height 10px.
Any other size lands the lattice between pixels and the rasteriser smears it, which is why body is 25 and prompts 50, not 20 and 40.
Silkscreen sits on an em/8 lattice, so 32 and 24 are its 4x and 3x; it is a banner face, proportional and uppercase, and touches nothing that must align.
Font smoothing is off (`-webkit-font-smoothing:none`), kerning and ligatures are off, so a glyph never lands on a half pixel and strokes stay one hard pixel wide.

Neither VT323 nor Silkscreen has box-drawing characters, and VT323's tilde at 1x reads as a small N.
m4box is a 6KB TrueType generated with fontTools on VT323's exact cell (advance 400, ascent 800, descent 200, 40 units per pixel), embedded as a data URI and limited by `unicode-range` to the tilde and U+2500-25A0.
It carries `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ █ ▀ ▄ ▌ ▐ ░ ▒ ▓ ■` and a 1px tilde.
Its stems overshoot the cell by 3px each way so a tree trunk stays continuous across 30px rows.
Each glyph's left side bearing equals its outline's xMin; otherwise the rasteriser slides the stem four pixels left and the branches break.

## Character grid and measure

Columns are 10px, rows 30px (25px cell plus 5px leading, so the grid breathes without leaving the pixel lattice).
The page is 112 columns (1120px) at 1440, centred with 160px margins; at 390 it is 35 columns with 20px margins.
Text blocks are narrower than the page: the lede 80 columns, prose 72, the post listing 96, the tree as wide as its longest client.
Every horizontal measure is in `ch`, which VT323 resolves to 10px, so alignment is by column and never by pixel.
Vertical rhythm is in rows: header padding one row, banner two rows under the caption, sections three rows apart, prompt then comment then one blank row then output.

## Colour roles

| role | value | used for |
|------|-------|----------|
| bright | star `#ECE7F5` | titles, commands, the banner, nav, the cursor block |
| normal | star and ash 4/8 `#C4C0D5` | body copy: lede, bio, contact |
| dim | ash `#9C98B4` | comments, dates, subtitles, clients, `$`, footer, `[sound off]` |
| faint | ground and ash 6/8 `#787793` | box drawing: dividers, tree trunk and branches, the root `.` |
| cobalt | `#4E8CFF` | the prompt's path (`~`, `~/posts`, `~/work`) |
| teal | `#3ED3C6` | hover, and the sandbox whisper |
| amber | `#F6B44A` | `[sound on]` |

Every value is a palette entry or a straight mix of two quantised to eighths, as in variant 14.
No ground behind the text: the nebula ramp tops out at 30% star, and one-pixel strokes in bright and normal stay readable over it at 1440 and 390; dim subtitles are the floor and were checked over the brightest patch.

## Prompts

Headings are prompts: the path in cobalt, `$` dim, the command bright; what was the label's meta line is a `#` comment in dim on the next row.

| section | prompt | comment |
|---------|--------|---------|
| toy caption | `~ $ m4nic <system>` | `# <cursor role>` then the block cursor |
| posts | `~/posts $ ls -lt` | `# 17 entries, 2010 to 2015, newest first` |
| work | `~/work $ tree` | `# eight projects, concept, design and code` |
| bio | `~ $ cat bio` | `# Den Haag` |
| contact | `~ $ cat contact` | none |

The system name is passed as one argument, so `bouncy balls` becomes `bouncy-balls` and `spring mesh` `spring-mesh`; the other seven are single words already.
Prompts are the double-height lines (50px), the only place VT323 runs at 2x, the way a VT does `ESC # 3`.

## Listings

Posts are `ls -lt` output, one entry per row: date 10 columns dim, two columns gap, title 40 columns bright, two columns gap, subtitle dim in the remaining 42 of a 96-column measure.
A long title or subtitle wraps inside its column and the entry takes two rows; dates stay in their column.
At 390 an entry stacks: date, title, subtitle, then one blank row.

Work is `tree` output: a faint `.` root, then `├── 01  Stockers  EduConcepts` per row and `└──` on the eighth.
Columns: branch 4, number 2 dim, gap 2, title 26 bright, gap 2, client dim.
At 390 the client drops under the title at 8 columns in, and a faint `│` in the branch column carries the trunk past it.

Dividers are rows of `─` in faint, clipped to the measure: one under the hero, one over the footer.
There are no rules; the only 1px CSS line on the page is the toy's frame, which is the toy's.

## The cursor

One cursor, a `█` from m4box in bright, at the end of the caption line under the toy, after the role comment.
It is solid for the first two seconds and then blinks with a one-second period, `step-end`, no fade.
It marks the line that is running: the toy is the foreground job, and the prompt has not returned.

## The caption line

`~ $ m4nic crystal  # cursor melts █`

The system name in bright is the argument; the role in dim is the comment; the cursor follows.
At 390 the comment moves to its own row so the line never wraps mid-word.
The name and role are still written by the scheduler; only the hyphen is new.

## Header and footer

The header is one status row: `Boy Maas (m4nic)` on the left, `posts/  work/  bio  contact  [sound off]` on the right, directories with a dim slash, the toggle in brackets.
The footer is a `─` row and two dim lines.

## The secret

Type `play`.
The sandbox opens and a teal comment appears under the lede: `# sandbox open: keys 1 to 9 pick a system, space restarts it, type play to close`.
Keys 1 to 9 pick a system by hand, space restarts the running one, `play` again hands the toy back to the loop.
`?seed=<n>` and `?t=<ms>` step both canvases exactly as in variant 14; nothing in the clock changed.
