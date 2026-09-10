# Variant 17 - Modern

The Nebula of variant 14, unchanged: the sky, the toy, the nine systems, the caption, the secret, `?seed=` and `?t=`.
Only the type changed.
The page now reads like a well-configured 2026 terminal: one coding mono on a character grid, prompts for headings, box-drawing dividers, a listing coloured like syntax, and a tmux status line pinned to the bottom of the viewport.

Seed read, without printing it.
Its digits are 1, 7, 2, 8, 3, 2, 4, 9 and sum to 36; 36 mod 4 picks the first of the four faces Google hosts, JetBrains Mono.
"1H" is one status row and one cursor.
"YY" is the double-space gutter between columns.
"Q7" is the seven fields the status line can carry.
"3EVSnN2" is three weights; "gwip3" three sizes.
"Cm4" is four accents in the normal run; coral is kept for the secret.
"Om9" is the 9px advance the whole grid is built on.
The seed never appears on the page.

## Face

JetBrains Mono via Google Fonts, weights 400, 500 and 700.
Fallbacks: ui-monospace, Menlo, Consolas, monospace.
Advance is 0.6em, so 15px type sets 9px columns and 80 columns are 720px.

## Scale and grid

Three sizes on a 24px row:

| size | row  | use                                                     |
|------|------|---------------------------------------------------------|
| 13px | 24px | the status line, the footer comments                    |
| 15px | 24px | everything else: prompts, listings, body, caption, nav  |
| 24px | 32px | the one output line of `whoami` (20px / 28px at 390)    |

Hierarchy comes from weight and colour, not size: 400 for normal and dim, 500 for bright, 700 for the command after a prompt.
The measure is 80 columns, `min(720px, 100% - 40px)`, centred, with the sky in the margins on both sides at 1440.
Column gutters are two characters.
The toy box is the measure wide and 18 rows tall (432px; 15 rows, 360px, at 390) with its hairline frame from variant 14.

## Colour roles

The palette used the way a colour scheme assigns it:

| role     | hex       | source                                  | used for                                            |
|----------|-----------|-----------------------------------------|-----------------------------------------------------|
| ground   | `#0B1230` | palette                                 | page, the status bar                                |
| dim      | `#9C98B4` | ash                                     | dates, numbers, comments, labels, the footer        |
| normal   | `#CEC9DD` | star and ash, 3/8                       | body copy, subtitles, clients, nav                  |
| bright   | `#ECE7F5` | star                                    | titles at 500, commands at 700, the cursor          |
| faint    | `#666683` | ground and ash, 5/8                     | the box-drawing dividers                            |
| rule     | `#393C59` | ground and ash, 3/8                     | the toy frame, unchanged                            |
| teal     | `#3ED3C6` | accent, the shell's green               | the prompt glyph, hover, the whisper                |
| cobalt   | `#4E8CFF` | accent, the shell's blue                | paths                                               |
| magenta  | `#E866B2` | accent                                  | the sky state in the status line                    |
| amber    | `#F6B44A` | accent                                  | the session name in the status line, sound when on  |
| coral    | `#FF6E57` | accent                                  | the `sandbox` flag in the status line, secret only  |

No glow, no gradients, no ground behind running text: the nebula ramp tops out at 30% star and the normal text sits on it directly.
The status bar is the one solid ground on the page, a bar not a card.

## Prompts

Every heading is a prompt line: path in cobalt, glyph in teal, command in bright at 700.
The glyph is `❯` (U+276F), the starship glyph a 2026 shell shows.
Exact strings:

```
~ ❯ whoami
~/posts ❯ ls -lt
~/work ❯ ls -l
~ ❯ cat bio
~ ❯ cat contact
~ ❯ █
```

Under a prompt a dim line may comment on the output, in shell comment form: `# 17 entries, 2010 to 2015, newest first`, `# eight projects, concept, design and code`, `# Den Haag`.
The `whoami` prompt precedes the tagline and the lede; the last prompt is empty and carries the cursor.

## Dividers

Between sections a full-measure line of eighty `─` (U+2500) in faint, set as text on a 24px row, clipped to the measure at 390.
No CSS borders anywhere in the text; the only rules on the page are the toy frame.

## Listings

`~/posts ❯ ls -lt`: one row per entry, `10ch` date column in dim, two-character gutter, title in bright 500, the subtitle in normal on the next row indented to the title column.
Dates align down the page at 1440 and at 390.

`~/work ❯ ls -l`: one row per entry, `2ch` number in dim, `24ch` title column in bright, client in normal in the third column.
At 390 the client drops under the title.

Nothing between rows but 12px of air.

## Status line

Fixed to the bottom of the viewport, one 24px row, 13px type on the ground, spanning the full width with the text set on the 80-column measure.
tmux window syntax, left to right:

```
[m4nic]  0:sky drift  1:toy bouncy balls*  sandbox      snd:off  00:42  m4nic@denhaag
```

- `[m4nic]` the session name in amber.
- `0:sky` the sky window; its state read live from the sky engine, in magenta: drift, breath, rete, sigils, shore or passing.
- `1:toy` the toy window, marked current with `*`; the system name read live from the scheduler, in bright.
- `sandbox` in coral, present only while the secret is open.
- `snd:off` / `snd:on`, dim, amber when on.
- `00:42` the fixed clock the two canvases share, in dim; `?t=6000` starts it at `00:06`.
- `m4nic@denhaag` the host, dim.

At 390 the window indices, the sound field and the host are hidden; session, sky, toy and clock remain.

## Cursor

One cursor: a block `█` in bright after the last, empty prompt at the end of the page, `~ ❯ █`.
It blinks at a 1.06s period, a hard step of 530ms on and 530ms off, never a fade.

## Caption

Unchanged in content: the system name in star, the cursor's role in ash, now one dim `#` in front so it reads as a comment on the toy.

## The secret

Type `play`.
The sandbox opens: keys 1 to 9 pick a system by hand, space restarts the running one, the whisper under the caption says so, and the status line grows a `sandbox` flag in coral.
Type `play` again to hand the toy back to the loop; the flag goes.
