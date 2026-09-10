# Site content

`posts/` holds the 17 blog posts and `work/` the 8 portfolio projects, each as YAML front matter followed by an HTML body fragment; filenames are unchanged from the original `posts/` and `portfolio/` pages.
Post front matter: `title`, `date` (YYYY-MM-DD) and `subtitle`, all taken from the old `posts.html` index.
Work front matter: `title`, `client`, `order` (the filename's leading number as an integer) and `summary`, taken from the old portfolio navigation list.
The body is the inner HTML of the old `#content` div (posts) or `#portfolio-content` div (work), dedented, with asset paths kept site-absolute (`/static/...`, `/images/...`).
Stripped during migration: the leading `<h1>` of posts (the title lives in front matter), all Disqus markup and scripts, the "Fork me on GitHub" ribbon, the portfolio navigation list, and the trailing layout `<hr>`.
Rewritten during migration: `http://player.vimeo.com` iframes now use `https`, and the old YouTube Flash `<object>` player is now a `https://www.youtube.com/embed/` iframe of the same size.
Kept as-is: `<pre>`/`<code>` blocks, images, lists, blockquotes, headings, HTML entities, and the live canvas demo scripts in the 2010-05-04 post (they expect jQuery on the page).
