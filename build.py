#!/usr/bin/env python3
"""Build boymaas.nl.

Reads content/posts/*.html and content/work/*.html (YAML-ish front matter, then an HTML body fragment),
typesets each into the TUI shell in templates/, and writes the site to the repository root:
index.html, posts.html, work.html, posts/<slug>.html, portfolio/<slug>.html, feed.xml and feed/index.html
(a redirect that keeps the old /feed address working).
Then checks every href and src that points inside the site, and that no page skips a heading level, and exits
non-zero if one is broken.
Standard library only; the output is a pure function of the inputs, so running it twice changes nothing.
"""
import html
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://boymaas.nl'
NAME = 'Boy Maas (bitgnosys)'

# the hint line: key and label pairs; those marked kb are keyboard-only and leave on a phone. The sound toggle,
# s, is a button in the base template, so it is not listed here.
KEYS = {
    'home': [('j/k', 'move'), ('enter', 'open'), ('tab', 'pane'), ('gg/G', 'ends', 'kb'), ('esc', 'blur', 'kb')],
    'list': [('j/k', 'move'), ('enter', 'open'), ('gg/G', 'ends', 'kb'), ('esc', 'blur', 'kb')],
    'article': [('j/k', 'scroll'), ('h/l', 'prev/next'), ('q', 'back'), ('gg/G', 'ends', 'kb')],
}


def keys(kind):
    return ''.join('<span class="k%s"><b>%s</b> %s</span>' % (' kb' if len(k) > 2 else '', k[0], k[1]) for k in KEYS[kind])


# syntax highlighting on article pages: highlight.js from cdnjs, pinned, the common build plus the languages the
# old posts use that it lacks. A block says its language with class="language-x" (or the old lang='x'); a post
# can name the language of its unmarked blocks with a front matter key lang, and the old posts, whose blocks say
# nothing, take it from this table; what is left is detected among the languages the posts are written in
CODE_LANG = {
    '2010-05-04-html5-canvas-element': 'javascript',
    '2010-05-11-opengl-plt-scheme-programming': 'scheme',
    '2010-05-14-scheme-call-with-current-continuation': 'scheme',
    '2010-05-15-web-apps-in-plt-scheme': 'scheme',
    '2010-05-20-currying-in-scheme': 'scheme',
    '2010-05-24-webapps-haskell-loli-hack': 'haskell',
    '2010-06-15-clocks-portmortem': 'clojure',
    '2011-02-20-rails-experiences': 'ruby',
    '2012-01-29-software-architecture': 'ruby',
    '2012-02-10-ruby-org-mode-parser-development-log': 'ruby',
    '2012-06-13-ruby-exceptions-benchmark': 'ruby',
}
HLJS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.2/'
HIGHLIGHT = ''.join('<script src="%s%s"></script>\n' % (HLJS, f) for f in (
    'highlight.min.js', 'languages/clojure.min.js', 'languages/scheme.min.js', 'languages/haskell.min.js',
    'languages/coffeescript.min.js')) + (
    '<script>hljs.configure({ languages:["ruby","clojure","scheme","haskell","coffeescript","javascript","bash",'
    '"xml","css","plaintext"], ignoreUnescapedHTML:true }); hljs.highlightAll();</script>\n')

SUB_TOP = '<div class="pane sub"><div class="bt"><span>┌</span><span class="ln"></span><span>┐</span></div>'
SUB_BOTTOM = '<div class="bb"><span>└</span><span class="ln"></span><span>┘</span></div></div>'


# ---------- reading ----------

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)


def front_matter(text, path):
    """Split '---\\nkey: value\\n---\\nbody' into (dict, body)."""
    m = re.match(r'---\n(.*?)\n---\n?', text, re.S)
    if not m:
        sys.exit('%s: no front matter' % path)
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        key, _, value = line.partition(':')
        meta[key.strip()] = value.strip()
    return meta, text[m.end():]


def load(kind):
    items = []
    folder = os.path.join(ROOT, 'content', kind)
    for name in sorted(os.listdir(folder)):
        if not name.endswith('.html'):
            continue
        meta, body = front_matter(read(os.path.join(folder, name)), name)
        meta['slug'] = name[:-5]
        meta['body'] = body
        items.append(meta)
    return items


# ---------- templating ----------

def esc(s):
    return html.escape(s, quote=True)


def render(template, **values):
    out = read(os.path.join(ROOT, 'templates', template + '.html'))
    for key, value in values.items():
        out = out.replace('{{%s}}' % key, value)
    left = re.findall(r'{{(\w+)}}', out)
    if left:
        sys.exit('%s: unfilled placeholders %s' % (template, sorted(set(left))))
    return out


def external_links(text):
    """A link to another site opens a new window: target="_blank" rel="noopener" on every http(s) href that is
    not boymaas.nl."""
    def fix(m):
        tag, href = m.group(0), html.unescape(m.group(1))
        host = urllib.parse.urlsplit(href).hostname or ''
        if host == 'boymaas.nl' or host.endswith('.boymaas.nl') or 'target=' in tag:
            return tag
        return tag[:-1] + ' target="_blank" rel="noopener">'
    return re.sub(r'<a\b[^>]*\bhref=["\'](https?://[^"\']+)["\'][^>]*>', fix, text)


def page(kind, title, main, keys, description='', page_id='', body_attrs='', scripts='', main_class='stack'):
    return external_links(render('base',
                  title=esc(title),
                  description=('<meta name="description" content="%s">\n' % esc(description)) if description else '',
                  page=kind, body_attrs=body_attrs,
                  nav_posts='#posts' if kind == 'home' else '/posts.html',
                  nav_work='#work' if kind == 'home' else '/work.html',
                  here_posts=' class="here"' if page_id == 'posts' else '',
                  here_work=' class="here"' if page_id == 'work' else '',
                  here_socials=' class="here"' if page_id == 'socials' else '',
                  main_class=main_class, main=main, keys=keys, scripts=scripts))


# ---------- the body of an article ----------

def dedent_code(text):
    lines = text.split('\n')
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    indents = [len(l) - len(l.lstrip(' ')) for l in lines if l.strip()]
    cut = min(indents) if indents else 0
    return '\n'.join(l[cut:] if l.strip() else '' for l in lines)


def tidy_pre(m, lang=None):
    """Trim and dedent a <pre> block and put it in a bordered sub-pane."""
    block = m.group(0)
    inner = re.fullmatch(r'(<pre\b[^>]*>)(\s*<code\b[^>]*>)?(.*?)(</code>\s*)?(</pre>)', block, re.S)
    if not inner:
        return SUB_TOP + block + SUB_BOTTOM
    open_pre, open_code, code, close_code, close_pre = inner.groups()
    if re.search(r'<[a-z]', code):          # markup inside the code: leave it as it is
        return SUB_TOP + block + SUB_BOTTOM
    code = dedent_code(code)
    open_code = (open_code or '').strip()
    old = re.search(r'\blang=["\']([\w-]+)["\']', open_code)      # the old <code lang='ruby'>: highlight.js reads a class
    if old:
        open_code = '<code class="language-%s">' % old.group(1)
    elif lang and 'language-' not in open_code:
        open_code = '<code class="language-%s">' % lang
    close_code = '</code>' if close_code else ''
    return SUB_TOP + open_pre + open_code + code + close_code + close_pre + SUB_BOTTOM


def fit_iframe(m):
    tag = m.group(0)
    w = re.search(r'\bwidth=["\']?(\d+)', tag)
    h = re.search(r'\bheight=["\']?(\d+)', tag)
    tag = re.sub(r'\s+style=(["\']).*?\1', '', tag)
    if w and h:
        tag = tag[:-1] + ' style="width:%spx;aspect-ratio:%s/%s">' % (w.group(1), w.group(1), h.group(1))
    return tag


def level_headings(body):
    """Renumber the headings so the page's outline has no gaps: the page title is the h1, the body's shallowest
    heading becomes an h2, and no heading is more than one level deeper than the one before it."""
    body = re.sub(r'<(/?)h1\b', r'<\1h2', body)                       # stray h1s are sections too: the page has one h1
    levels = sorted({int(l) for l in re.findall(r'<h([1-6])\b', body)})
    rank = {l: k + 2 for k, l in enumerate(levels)}
    prev = [1]

    def fix(m):
        if not m.group(1):
            prev[0] = min(rank[int(m.group(2))], prev[0] + 1)
        return '<%sh%d' % (m.group(1), prev[0])
    return re.sub(r'<(/?)h([1-6])\b', fix, body)


def typeset(body, title=None, lang=None):
    """Turn a content body into the article markup the stylesheet expects; lang names the language of the code
    blocks that do not name their own."""
    if title:                                                        # a project body that opens by repeating its title
        body = re.sub(r'^\s*<h3>\s*' + re.escape(title) + r'\b[^<]*</h3>\s*', '', body, count=1)
    body = level_headings(body)
    body = re.sub(r'<iframe\b[^>]*>', fit_iframe, body)
    body = re.sub(r'<(canvas|img)\b[^>]*>', lambda m: re.sub(r'\s+style=(["\']).*?\1', '', m.group(0)), body)
    body = re.sub(r'<pre\b[^>]*>.*?</pre>', lambda m: tidy_pre(m, lang), body, flags=re.S)
    # the text runs the width of the pane, the owner's call over the detector's measure, waived as on the blurbs
    body = re.sub(r'<(p|li)\b(?![^>]*data-impeccable-ignore)', r'<\1 data-impeccable-ignore', body)
    return body.strip()


# ---------- listings ----------

def post_row(p):
    return '      <li><time>%s</time><a href="/posts/%s.html">%s</a><small>%s</small></li>' % (
        p['date'], p['slug'], esc(p['title']), esc(p['subtitle']))


# the blurb under a row runs the width of the pane, the owner's call over the slop detector's 80-character measure,
# which the attribute waives for that element alone
BLURB = '<p data-impeccable-ignore>%s</p>'


def work_row(k, w, summary=False):
    """number, years, title, client; the years and the client share a wrapper so that on a phone they can sit
    together on the row under the title."""
    row = '      <li><span class="n">%02d</span><a href="/portfolio/%s.html">%s</a><span class="by"><span class="y">%s</span><small>%s</small></span>' % (
        k, w['slug'], esc(w['title']), esc(w['years']), esc(w['client']))
    if summary:
        row += BLURB % esc(w['summary'])
    return row + '</li>'


def posts_meta(posts):
    """The pane's caption; the count is on the hint line (posts 1/17), so it is not repeated here."""
    years = sorted({p['date'][:4] for p in posts})
    return '%s to %s, newest first' % (years[0], years[-1])


def work_meta(works):
    return 'concept, design and code'


# ---------- pages ----------

def nav_link(item, kind):
    """A long title is cut with an ellipsis so the nav row stays one row, which the detector reads as overflow;
    the attribute waives that for the link alone."""
    if item is None:
        return '<span class="none">none</span>'
    return '<a href="/%s/%s.html" data-impeccable-ignore>%s</a>' % (kind, item['slug'], esc(item['title']))


def article(kind, items, k):
    it = items[k]
    prev = items[k - 1] if k > 0 else None
    nxt = items[k + 1] if k + 1 < len(items) else None
    is_post = kind == 'posts'
    folder = 'posts' if is_post else 'portfolio'
    back = '/posts.html' if is_post else '/work.html'
    if is_post:
        sub = '<time>%s</time>%s' % (it['date'], esc(it['subtitle']))
        description = it['subtitle']
    else:
        sub = '<span class="y">%s</span>%s' % (esc(it['years']), esc(it['client']))
        description = it['summary']
    main = render('article', id='posts' if is_post else 'work', kind='posts' if is_post else 'work', slug=it['slug'],
                  title=esc(it['title']), sub=sub,
                  body=typeset(it['body'], None if is_post else it['title'], it.get('lang') or CODE_LANG.get(it['slug'])),
                  prev=nav_link(prev, folder), next=nav_link(nxt, folder), back=back, back_label='posts' if is_post else 'work')
    attrs = ' data-back="%s" data-pos="%s %d/%d"' % (back, 'posts' if is_post else 'work', k + 1, len(items))
    if prev:
        attrs += ' data-prev="/%s/%s.html"' % (folder, prev['slug'])
    if nxt:
        attrs += ' data-next="/%s/%s.html"' % (folder, nxt['slug'])
    return page('article', '%s - %s' % (it['title'], NAME), main, keys('article'), description=description,
                page_id='posts' if is_post else 'work', body_attrs=attrs, scripts=HIGHLIGHT)


# The old site served its feed at /feed; that address now redirects to feed.xml.
FEED_REDIRECT = '\n'.join([
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta http-equiv="refresh" content="0; url=/feed.xml">',
    '<link rel="canonical" href="%s/feed.xml">' % SITE,
    '<title>feed - %s</title>' % html.escape(NAME),
    '</head>',
    '<body><p>The feed has moved to <a href="/feed.xml">/feed.xml</a>.</p></body>',
    '</html>',
    ''])


def feed(posts):
    entries = []
    for p in posts:
        body = re.sub(r'<script\b.*?</script>', '', p['body'], flags=re.S)
        body = re.sub(r'<(/?)h1\b', r'<\1h2', body)
        body = re.sub(r'((?:href|src)=["\'])/', r'\1%s/' % SITE, body)
        url = '%s/posts/%s.html' % (SITE, p['slug'])
        entries.append('\n'.join([
            '  <entry>',
            '    <title>%s</title>' % esc(p['title']),
            '    <link href="%s"/>' % url,
            '    <id>%s</id>' % url,
            '    <updated>%sT00:00:00Z</updated>' % p['date'],
            '    <summary>%s</summary>' % esc(p['subtitle']),
            '    <content type="html">%s</content>' % esc(body.strip()),
            '  </entry>']))
    return '\n'.join([
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        '  <title>%s</title>' % esc(NAME),
        '  <subtitle>Posts on programming, design and thought.</subtitle>',
        '  <link href="%s/feed.xml" rel="self"/>' % SITE,
        '  <link href="%s/"/>' % SITE,
        '  <id>%s/</id>' % SITE,
        '  <updated>%sT00:00:00Z</updated>' % posts[0]['date'],
        '  <author><name>Boy Maas</name></author>',
    ] + entries + ['</feed>', ''])


def build():
    posts = sorted(load('posts'), key=lambda p: p['date'], reverse=True)
    works = sorted(load('work'), key=lambda w: int(w['order']), reverse=True)
    out = {}

    out['index.html'] = page('home', NAME, render(
        'home',
        posts_meta=posts_meta(posts), posts_rows='\n'.join(post_row(p) for p in posts),
        work_meta=work_meta(works), work_rows='\n'.join(work_row(k + 1, w) for k, w in enumerate(works))),
        keys('home'), description='Boy Maas, bitgnosys. Creator, engineer of everything, pixels to protocols. JamZig, Polana Network, Buttler AI and Code 8, from Den Haag.',
        scripts='<script src="/assets/toy.js"></script>\n')

    out['posts.html'] = page('list', 'posts - ' + NAME, render(
        'list', id='posts', meta=posts_meta(posts), rows_class='posts', rows='\n'.join(post_row(p) for p in posts),
        foot='<span>─ </span><span class="meta"><a href="/feed.xml">atom feed</a></span><span> </span>'),
        keys('list'), description='All posts by Boy Maas, newest first.', page_id='posts')

    out['work.html'] = page('list', 'work - ' + NAME, render(
        'list', id='work', meta=work_meta(works), rows_class='works',
        rows='\n'.join(work_row(k + 1, w, summary=True) for k, w in enumerate(works)), foot=''),
        keys('list'), description='Projects by Boy Maas: concept, design and code.', page_id='work')

    socials = [
        ('https://x.com/bitgnosys', '@bitgnosys', 'X', 'Me. Pixels, protocols, the terminal.'),
        ('https://x.com/jamzig_dev', '@jamzig_dev', 'X', 'JamZig⚡, the JAM client in Zig: conformance runs, milestones, releases.'),
        ('https://github.com/boymaas', 'boymaas', 'GitHub', 'Code, going back to 2010.'),
        ('https://github.com/jamzig', 'jamzig', 'GitHub', 'The JamZig⚡ organisation: conformance releases, test exports, Zig packages.'),
        ('https://www.linkedin.com/in/boy-maas-2b86594/', 'boy-maas', 'LinkedIn', 'The CV, in the format recruiters like.'),
        ('https://matrix.to/#/#jamzig:matrix.org', '#jamzig:matrix.org', 'Matrix', 'The JamZig⚡ room.'),
        ('https://cd8.dev/', 'cd8.dev', 'Code 8', 'Protocol development and advisory.'),
    ]
    rows = '\n'.join(
        ('      <li><span class="n">%02d</span><a href="%s">%s</a><small>%s</small>' + BLURB + '</li>') % (k + 1, href, esc(label), esc(where), esc(blurb))
        for k, (href, label, where, blurb) in enumerate(socials))
    out['socials.html'] = page('list', 'socials - ' + NAME, render(
        'list', id='socials', meta='where to find me', rows_class='links', rows=rows, foot=''),
        keys('list'), description='Where to find Boy Maas: X, GitHub, LinkedIn, Matrix.', page_id='socials')

    for k in range(len(posts)):
        out['posts/%s.html' % posts[k]['slug']] = article('posts', posts, k)
    for k in range(len(works)):
        out['portfolio/%s.html' % works[k]['slug']] = article('work', works, k)
    out['feed.xml'] = feed(posts)
    out['feed/index.html'] = FEED_REDIRECT

    for rel, text in out.items():
        write(os.path.join(ROOT, rel), text)
    return sorted(out)


# ---------- the link check ----------

def check(files):
    broken = []
    ids = {}
    for rel in files:
        ids[rel] = set(re.findall(r'\bid=["\']([^"\']+)["\']', read(os.path.join(ROOT, rel))))
    for rel in files:
        text = read(os.path.join(ROOT, rel))
        prev = 0
        for level in (int(l) for l in re.findall(r'<h([1-6])\b', text)):
            if level > prev + 1:
                broken.append('%s: heading skips from h%d to h%d' % (rel, prev, level))
            prev = level
        for url in re.findall(r'(?:href|src)=["\']([^"\']+)["\']', text):
            url = html.unescape(url)
            if url.startswith(SITE + '/'):
                url = url[len(SITE):]
            if re.match(r'[a-z][a-z0-9+.-]*:', url) or url.startswith('//'):
                continue                                   # off site
            path, _, frag = url.partition('#')
            path = urllib.parse.unquote(path.split('?')[0])
            target = rel if not path else (path.lstrip('/') if path.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(rel), path)))
            full = os.path.join(ROOT, target)
            if os.path.isdir(full):
                target = os.path.join(target, 'index.html')
                full = os.path.join(ROOT, target)
            if not os.path.isfile(full):
                broken.append('%s: %s (no file %s)' % (rel, url, target))
            elif frag and target in ids and frag not in ids[target]:
                broken.append('%s: %s (no id "%s" in %s)' % (rel, url, frag, target))
    return broken


if __name__ == '__main__':
    files = build()
    print('wrote %d files' % len(files))
    problems = check(files)
    for line in problems:
        print('problem: ' + line)
    sys.exit(1 if problems else 0)
