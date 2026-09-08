# Direction: SEGMENT A000

## Era

DOS VGA, mode 13h, 320x200, the SCUMM point-and-click years (1990-1993).
The seed reads like a memory dump: `Ak86` is an x86, `AFF0` sits inside segment A000-AFFF, which is the VGA frame buffer.
So the page is what a 486 paints into that segment: one chunky 320x200 screen with a verb bar underneath, the Maniac Mansion / Monkey Island interface done straight.

## Palette

Only the sixteen VGA text-mode colours, everywhere, dithered where a midtone is needed.
Nothing else is allowed on the page, including the portrait.

- K `#000000`  B `#0000AA`  G `#00AA00`  C `#00AAAA`
- R `#AA0000`  M `#AA00AA`  O `#AA5500`  L `#AAAAAA`
- D `#555555`  b `#5555FF`  g `#55FF55`  c `#55FFFF`
- r `#FF5555`  m `#FF55FF`  Y `#FFFF55`  W `#FFFFFF`

Wall: B/K checker dither. Floor: O/D dither. Fire: K R r Y W. Plasma and copper bars cycle all sixteen.
Display type: VT323 (VGA 8x16 text-mode look). Body type: IBM Plex Mono (it is a PC).

## The world

Room 1 is the studio in Den Haag at night, a single SCUMM room.
A window with rain and lightning on the neighbours' roofs, six people hurrying past on the street below.
A desk with a 486 tower (turbo LED reads 86) and a CRT running vim typing Scheme.
A lab bench with three bubbling flasks on a mode-13h fire, a steaming pan on a hotplate (food).
A pedestal with a spinning wireframe cube (sculpture), a hypno spiral poster (hypnosis), a copper-bar poster cycling colour (colour), a wall clock on real time.
A chessboard where a knight hops, a boombox with an EQ (music), a punching bag swinging (exercise, martial arts).
A meditating figure levitating in front of a slowly turning yin-yang (meditation), a spinning crypto coin bouncing on the desk.
A locked door on the right with an eye at the keyhole (mystery) that leads to the portfolio corridor.
Along the front a conveyor with four robot agents (leading digit 4) that each process a floppy for their own random time before handing it to the next: the queue backs up and drains, asynchronously.
The protagonist, m4nic, walks between stations on his own (attract mode) and to wherever the visitor clicks on the floor.

## Already happening on load

Rain, bubbles, fire, coin, EQ, spiral, copper bars, cube, bag, agents, walking people and the protagonist all run from frame one.
No intro. The sentence line carries a demoscene sine scroller with greetings until the cursor points at something.

## Content in-world

- Posts: room 2 is the DISK BOX, 17 3.5" floppies in VGA colours on shelves, newest first, label text is the real title and subtitle, one floppy at a time ejects from the drive.
- Portfolio: room 3 is the CORRIDOR, 8 numbered doors (00-07 as in the file names) that open on hover, one opens by itself now and then and someone peeks out.
- Bio: room 4 is C:\BOY>, a DOS session typing out BIO.TXT, a DIR of the languages as .EXE files, the studio as STUDIO.TXT, the clients as a HISCORE table, and the portrait dithered to the sixteen colours.
- Contact: room 5 is OUTSIDE, a mailbox in the rain whose flag goes up when you hover it, and a sign to GitHub.

## Cursor

SCUMM crosshair drawn in-canvas.
The sentence line reads "Look at bubbling flask", "Open door", "Walk to", "Use boombox" as it passes over hotspots.
The room parallaxes in three layers with the cursor.
Bubbles pop when touched, the coin jumps, flasks boil harder, the hypno spiral speeds up.
Clicking the floor makes m4nic walk there.
On narrow screens the room is wider than the viewport and pans with a drag, drifting by itself when left alone.

## The secret

`Emld` is the Emerald Tablet.
A hermetic sigil (Dee's Monas Hieroglyphica) is drawn into the wall by breaking the dither pattern, invisible unless you look, revealed in yellow only during lightning.
Clicking it, or typing `hermes`, turns the whole room upside down (as above, so below), inverts the palette and unrolls the green tablet with its first line.

## Seed subpatterns used

`4` leading digit: four agents.
`9`: rain density.
`6`: six passers-by.
`86`: the 486's turbo LED.
`QQ`: two queens on the chessboard.
`sYy`: yin-yang.
`PxEQ`: the pixel EQ.
`het`: the mailbox says POST, the Dutch word on the box.
`399`: the sine scroller's period.
