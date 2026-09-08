# Variant 6 - "Party at DF0:"

## Reading the seed

`s92jk6EvhFsTnStXZjq2hg1rpmnbX28jcBBUvpSmcIEPvBSjPzl0VIEHsojgYKbA`

- It opens with `92`: 1992, the year the Amiga demoscene peaked (The Party, Assembly). Era decided.
- `BB` sits dead centre, the only doubled letter: the Boing Ball, the first thing an Amiga ever showed.
- `j` appears five times: five agents in the bucket brigade.
- Capital `S` appears four times: four copper bars.
- `v` three times: three flasks.
- Digits 9 2 6 2 1 2 8 0: nine people in the crowd, `2` three times so three parallax star layers, `8` seconds of idle before attract mode, `6` px sine amplitude, one ball, zero intro (the world is running at t=0).
- `IE` repeats twice (`IEP`, `IEH`): the page has two secrets, not one.
- It starts lowercase and ends in a capital: the page starts in a demo and ends in Workbench.
- The seed never appears in the page.

## Era

Amiga demoscene, 1992, straight: OCS 12-bit palette (every hex value is a doubled nibble), lo-res chunky pixels at integer scale, copper raster bars, a 3D-ish sine scroller in a hand-made 5x7 bitmap font, starfield parallax, bobs, a software framebuffer blitted once per frame, and Workbench 1.3 windows (orange title bar, blue body, white bevels) for the content.
No smooth gradients, no glows, no cards.

## Palette (Amiga 12-bit, doubled nibbles)

- Sky `#001133`, hall `#000000`, floor `#003377` with grid `#0055aa`
- Workbench blue `#0055aa`, Workbench orange `#ff8800`, white `#ffffff`, black `#000000`
- Boing red `#ff0000`, ball shadow `#002255`
- Copper bars: red `#ff3300`, orange `#ff9900`, green `#33ff66`, cyan `#00ccff`
- Skin `#ffcc99`, wood `#663300`, roof `#aa3300` / `#cc4400`
- Rain `#88ccff`, coin `#ffcc00`, flask liquids `#33ff66` `#ff8800` `#00ccff`, sigil `#ffcc00`
- Guru red `#ff0000` on black

## The world

A demo party in Den Haag on a rainy night, seen in cross-section.
Top band: night sky, three parallax star layers, rain falling onto a tiled roof with a smoking chimney, a wireframe object rotating in the sky.
Middle: the hall, black, lit by four copper bars sweeping up and down, the title BOY MAAS wobbling in raster-fill letters, the Boing Ball bouncing across the floor with its shadow.
Bottom: the floor with the party on it, and a sine scroller running across the floor tiles.
Scroll down and the demo "exits to Workbench": four Workbench 1.3 windows hold the real content.

## Already happening on load

Everything, at frame zero: rain, chimney smoke, stars scrolling, the ball bouncing, copper bars sweeping, the title wobbling, flasks bubbling, the crowd headbanging, the kicker kicking, the meditator floating, agents passing packets, the coin spinning, the scroller scrolling, the mini demo effects in the portfolio window running, disks popping in the posts window.
No intro screen, no fade.

## The loves as things in the world

- complex dynamic systems: the agents' queue, packets waiting for a busy receiver; the starfield; the fire and plasma parts
- asynchronous agents: five bobs on the right of the hall pass yellow packets hand to hand on their own timers into the mailbox
- science: three bubbling flasks on a lab table, bubbles escape the neck and pop
- magic: sparkle trail behind the cursor
- mystery: a sigil that only appears when nobody is touching the page
- colour: the copper bars and the raster-filled title
- sculpture: the rotating wireframe object in the sky, and the glenz cube part
- rain: rain on the roof with splashes, and the chimney smoke
- food: a pizza slice on the lab table
- exercise, martial arts: a kicker in a gi practising roundhouse kicks
- human behaviour: a crowd of nine headbanging in front of the big screen, heads follow the cursor
- crypto: a spinning coin above the mailbox, dropped as payment each time a packet is delivered
- hermetism: the sigil (a Monas-like glyph in a seven-pointed star) in the sky
- meditation: a meditating sprite floating beside a candle
- hypnosis: the big screen in the hall shows a rotating spiral; the crowd stares at it
- chess, music, vim: in the member info window; music is the chip tune behind the SND toggle

## Content in-world

- Posts: Workbench window `DF0:posts`, 17 floppy disk icons colour-coded by year, year on the label, title and subtitle beneath in mono; hover opens the shutter and inverts the icon, the drive LED blinks
- Portfolio: Workbench window `DF1:megademo`, 8 demo parts, each a live effect on its own small screen (plasma, starfield warp, fire, rotozoom, dot flag, copper text, tunnel, glenz cube); hover speeds the effect up
- Bio: window `Member info`, portrait pixelised and dithered to the palette, member sheet in cracktro style, clients as the greetings list on a scroller
- Contact: window `Mailbox`, an animated mailbox that raises its flag on hover, the address as a Workbench string gadget

## Reacts to the cursor

Stars parallax against the cursor, the crowd's eyes follow it, sparkles trail it, clicking the ball kicks it higher, hovering a disk opens it, hovering a part accelerates it, hovering the mailbox raises its flag.

## Secrets (two, per `IE` x2)

1. Leave the page alone for 8 seconds: attract mode. The scroller doubles speed, the ball bounces higher, and the hermetic sigil fades in over the sky and turns slowly. Touch anything and it is gone.
2. Click the meditator three times: Guru Meditation. The classic red flashing box: "Software Failure. Press left mouse button to continue. Guru Meditation #00000003.4D344E49" (that hex is M4NI).
