# Round 1 critique (variant 18, home page)

Aesthetic: a vim-flavoured terminal homepage where the wordmark is a living pixel toy over a dithered night sky, demoscene meets TUI.

Gaps, largest first:
1. Three pixel grids fighting: background dither, wordmark cells and star dots each on a different cell size; the fluid system swaps blocks for round dots. Lock to one cell size and shape.
2. Background does more than the content: coloured speckle and blotches directly behind the posts table and bio; a blurred grey/yellow smear top right of the hero reads as a rendering bug.
3. Mobile hero broken: wordmark cropped to "4NI"; nav wraps to two lines with "sound off" at link weight.
4. Hero composition: 540px box, logo upper middle, empty lower half, tagline under the fold; caption pairs like "sand / cursor digs" read as debug labels.
5. Same box for every section: identical frame and kicker on posts, work, bio, mail, whoami; a card grid in terminal dress; work/bio side by side leaves mail dangling and dead space.
6. No type hierarchy: one mono at one size; use dim, normal, bright and one accent; let the tagline go to display size.
7. Wordmark colour is a gradient tell: the same coral/white/blue/yellow band per letter. Tie colour to behaviour instead.
8. Copy deflates the trick: the footer explains the toy; cut "AI enthusiast", the stray dot before the name, the duplicate "posts 1/17".
9. Slop tells: blurred colour blobs, teal/magenta on indigo, identical framed panels, kicker on every section, decorative blinking cursor in an empty prompt.

Safe choice noted: indigo night sky is the expected palette; the keybinding footer is good and should stay.

Score: 5/10
