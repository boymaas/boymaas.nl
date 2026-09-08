# Variant 4 - "2MB CHIP" - an Amiga megademo that is a home

## Reading the seed

`vQ7DB7s5OdxkKm4J4huh3K8lkZVHJOrPvS3eMnvB2mbMBqRLFmKPOyEnnAVSGnoA`

- `2mbMB` in the middle of the string: two megabytes of chip RAM, an Amiga 1200. The era is decided: **Amiga demoscene**, OCS/AGA, 12-bit colour, copper bars, Boing ball, sine scroller, bobs.
- `Km4J4` carries `m4` - the handle m4nic is baked into the string, so the demo is signed "M4NIC" in bob letters, not "Boy Maas" in a heading.
- `huh` is a palindrome: the scroller runs backwards when the secret is on.
- `7` appears twice, first among the digits: the secret takes 7 clicks.
- `nn` is the only doubled letter: in secret mode there are two Boing balls.
- The 64 characters become the 64 stars of the starfield; the digits sum to 43, the number of crowd sprites that follow the cursor.
- The seed never appears on the page.

## Era and palette

Amiga OCS: every colour is a 12-bit `#RGB` value, no in-betweens.

- void `#012`, floor `#024`, Workbench blue `#05a`, light blue `#4af`
- Workbench orange `#f80`, yellow `#fd0`, red `#f22`, green `#3d3`, cyan `#0cf`, magenta `#f3c` (copper bars only)
- white `#fff`, black `#000`, grey `#aaa`, dark grey `#555`, skin `#fb9`, brick `#a32`, wood `#963`

Copper bars are drawn per raster line, dithering is 2x2/Bayer 4x4 only, all text on canvas is a 5x7 bitmap font written in code. DOM display text is Press Start 2P, body copy is IBM Plex Mono.

## The world

The page is a megademo running on a 2MB Amiga, disk-swapped part by part as you scroll:

1. **PART 1 - CRACKTRO**. Starfield with parallax to the cursor, breathing copper bars behind the whole page, a Boing ball bouncing on a floor line (kick it with the cursor), "M4NIC" in trailing bob letters, a rotating glenz cube (sculpture), and four courier bobs on the floor relaying a floppy disk hand to hand into a DF0: drive whose LED blinks on insert (asynchronous agents handing work to each other). A sine scroller at the bottom carries the greeting.
2. **PART 2 - THE STUDIO**. A stepped-gable Den Haag house at night in the rain (rain on the roof with splashes). In the windows: bubbling flasks (science), a pot boiling on a stove (food), a fighter running a kata (exercise, martial arts). A meditator floats above the roof on a sine (meditation). A gold coin with a B spins on the shop sign (crypto). 43 tiny people on the street gather under the cursor (human behaviour). Colour is the copper, mystery is the moon that is not a moon.
3. **PART 3 - DISK BOX**. The 17 posts are 17 3.5" floppies in a box, newest first, each with a paper label (date, title, subtitle in mono). They idle-bob in steps, rise on hover, and a chess knight hops across the box in real L-moves, bumping the disk it lands on.
4. **PART 4 - RELEASES**. The 8 portfolio projects as the cracktro's release list: a moving raster bar per row, PART number, game name, client. Hover makes the name sine-wave letter by letter.
5. **PART 5 - MEMBER INFO**. The bio as a group member card: portrait dithered to 16 Amiga colours, handle, real name, group (the studio, Den Haag, since 03/1998), jobs, languages, tools, clients. A hypnotic rotating spiral runs behind the card and its centre follows the cursor (hypnosis).
6. **PART 6 - CONTACT**. A Dutch orange postbox; envelopes fly in on a sine and drop in, the flag pops up. The address boy.maas (at) gmail.com and the GitHub link sit beside it.
7. **Footer**: CHIP 2048K FAST 0K memory line and the sound switch.

Sound: a square-wave chiptune (WebAudio) off until the SOUND switch is flipped; when on, the copper bars pulse on the beat.

## The secret

Click the Boing ball seven times. The scroller reverses (huh), a second ball appears (nn), and the hermetic sigil - a hexagram in a circle, the alchemical "as above, so below" - is drawn in copper light behind the title while the scroller recites the Emerald Tablet line.
