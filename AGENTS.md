# boymaas.nl

Personal site of Boy Maas (bitgnosys), served by GitHub Pages from the root of `master` with no build step on GitHub.
The repo is source plus a generator; generated pages are committed.

## Layout

```
content/posts/*.html    # one post per file: front matter (title, date, subtitle) then an HTML body
content/work/*.html     # one project per file: front matter (title, client, order, summary) then body
templates/              # base shell, home, list, article
assets/tui.css          # grid, panes, colour roles, hint line, article typography
assets/sky.js           # the Nebula sky and the shared fixed clock
assets/toy.js           # the logo toy, nine systems, home page only
favicon.svg favicon.png apple-touch-icon.png   # the B of the toy's glyph set; the PNGs are rendered from the SVG with magick
assets/tui.js           # panes, focus, keys, hint line, per-page modes
build.py                # python3, standard library only; regenerates every page and checks links
index.html posts.html work.html posts/ portfolio/ feed.xml feed/   # generated, do not hand-edit
static/ images/         # assets referenced by content
design/                 # why the site looks like this; read before changing the look
```

## Working on the site

- Edit `content/`, `templates/`, `assets/` or `build.py`, then run `python3 build.py`, then commit the regenerated pages together with the source.
  Never hand-edit a generated page.
- The build is idempotent; running it twice must produce no diff.
  It exits non-zero on a broken internal link.
- To add a post: create `content/posts/YYYY-MM-DD-slug.html` with front matter and an HTML body, build, commit.
  Old URLs are stable: `/posts/<filename>` and `/portfolio/<filename>` must keep working.
- Assets use root-absolute paths, so a page opened from `file://` renders unstyled.
  To look at the site, serve it: `python3 -m http.server 8765` from the repo root, then open `http://localhost:8765/`.
- `?seed=<n>` makes the sky and toy reproducible and `?t=<ms>` fast-forwards their clock; keep both working when touching `sky.js` or `toy.js`.

## The design is decided

Read `design/README.md` before changing anything visual.
The identity, chosen by the owner over six rounds: a TUI (box-drawing panes, bracketed titles, j/k navigation, a hint line), the logo as a physics toy that the cursor breaks and that heals, over a coloured Nebula sky, one monospace face, one amber accent.
Do not make it quieter, greyer, or monochrome; do not remove the sky, the systems, or the keys.
Quality fixes are welcome: alignment to the character grid, contrast under text, mobile layout, copy.

## Verification before merging

- `python3 build.py` twice, no diff.
- Serve the site and run the slop gate on the main pages; it must report zero primary findings:
  `npx -y impeccable detect --viewport 1280x800 http://localhost:8765/index.html` (and posts.html, work.html, one post, one project, also at `--viewport 390x844`).
- Look at the pages at 1440 and 390 wide; the atelier plugin's `shot.sh` takes true 390 screenshots.

## Publishing

Merging to `master` and pushing publishes within about a minute.
`.nojekyll` keeps GitHub Pages from running Jekyll over the repo; keep it.
