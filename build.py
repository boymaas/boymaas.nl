#!/usr/bin/env python3
"""Build boymaas.nl.

Reads content/posts/*.html and content/work/*.html (YAML-ish front matter, then an HTML body fragment),
typesets each into the TUI shell in templates/, and writes the site to the repository root:
index.html, posts.html, work.html, posts/<slug>.html, portfolio/<slug>.html, feed.xml and feed/index.html
(a redirect that keeps the old /feed address working).
Then checks every href and src that points inside the site and exits non-zero if one is broken.
Standard library only; the output is a pure function of the inputs, so running it twice changes nothing.
"""
import html
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://boymaas.nl'
NAME = 'Boy Maas (m4nic)'

KEYS = {
    'home': '<b>j/k</b> move  <b>enter</b> open  <b>tab</b> pane  <span class="kb"><b>gg/G</b> ends  <b>esc</b> blur  </span><b>s</b> sound',
    'list': '<b>j/k</b> move  <b>enter</b> open  <span class="kb"><b>gg/G</b> ends  <b>esc</b> blur  </span><b>s</b> sound',
    'article': '<b>j/k</b> scroll  <b>h/l</b> prev/next  <b>q</b> back  <span class="kb"><b>gg/G</b> ends  <b>s</b> sound</span>',
}

SUB_TOP = '<div class="pane sub"><div class="bt"><span>┌</span><span class="ln"></span><span>┐</span></div><div class="bl"></div><div class="br"></div>'
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


def page(kind, title, main, keys, description='', page_id='', body_attrs='', scripts='', main_class='stack'):
    return render('base',
                  title=esc(title),
                  description=('<meta name="description" content="%s">\n' % esc(description)) if description else '',
                  page=kind, body_attrs=body_attrs,
                  nav_posts='#posts' if kind == 'home' else '/posts.html',
                  nav_work='#work' if kind == 'home' else '/work.html',
                  here_posts=' class="here"' if page_id == 'posts' else '',
                  here_work=' class="here"' if page_id == 'work' else '',
                  main_class=main_class, main=main, keys=keys, scripts=scripts)


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


def tidy_pre(m):
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


def typeset(body, title=None):
    """Turn a content body into the article markup the stylesheet expects."""
    body = re.sub(r'<(/?)h1\b', r'<\1h2', body)                       # stray h1s become h2s: the page has one h1
    if title:                                                        # a project body that opens by repeating its title
        body = re.sub(r'^\s*<h3>\s*' + re.escape(title) + r'\b[^<]*</h3>\s*', '', body, count=1)
    body = re.sub(r'<iframe\b[^>]*>', fit_iframe, body)
    body = re.sub(r'<(canvas|img)\b[^>]*>', lambda m: re.sub(r'\s+style=(["\']).*?\1', '', m.group(0)), body)
    body = re.sub(r'<pre\b[^>]*>.*?</pre>', tidy_pre, body, flags=re.S)
    body = re.sub(r'<blockquote\b[^>]*>', lambda m: m.group(0) + '<span class="gut" aria-hidden="true"></span>', body)
    return body.strip()


# ---------- listings ----------

def post_row(p):
    return '      <li><time>%s</time><a href="/posts/%s.html">%s</a><small>%s</small></li>' % (
        p['date'], p['slug'], esc(p['title']), esc(p['subtitle']))


def work_row(k, w, summary=False):
    row = '      <li><span class="n">%02d</span><a href="/portfolio/%s.html">%s</a><small>%s</small>' % (
        k, w['slug'], esc(w['title']), esc(w['client']))
    if summary:
        row += '<p>%s</p>' % esc(w['summary'])
    return row + '</li>'


def posts_meta(posts):
    """The pane's caption; the count is on the hint line (posts 1/17), so it is not repeated here."""
    years = sorted({p['date'][:4] for p in posts})
    return '%s to %s, newest first' % (years[0], years[-1])


def work_meta(works):
    return 'concept, design and code'


# ---------- pages ----------

def nav_link(item, kind):
    if item is None:
        return '<span class="none">none</span>'
    return '<a href="/%s/%s.html">%s</a>' % (kind, item['slug'], esc(item['title']))


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
        sub = esc(it['client'])
        description = it['summary']
    main = render('article', id='posts' if is_post else 'work', kind='posts' if is_post else 'work', slug=it['slug'],
                  title=esc(it['title']), sub=sub,
                  body=typeset(it['body'], None if is_post else it['title']),
                  prev=nav_link(prev, folder), next=nav_link(nxt, folder), back=back, back_label='posts' if is_post else 'work')
    attrs = ' data-back="%s" data-pos="%s %d/%d"' % (back, 'posts' if is_post else 'work', k + 1, len(items))
    if prev:
        attrs += ' data-prev="/%s/%s.html"' % (folder, prev['slug'])
    if nxt:
        attrs += ' data-next="/%s/%s.html"' % (folder, nxt['slug'])
    return page('article', '%s - %s' % (it['title'], NAME), main, KEYS['article'], description=description,
                page_id='posts' if is_post else 'work', body_attrs=attrs)


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
        KEYS['home'], description='Boy Maas, m4nic. Entrepreneur, programmer, designer, philosopher. A small development studio in Den Haag since 1998.',
        scripts='<script src="/assets/toy.js"></script>\n')

    out['posts.html'] = page('list', 'posts - ' + NAME, render(
        'list', id='posts', meta=posts_meta(posts), rows_class='posts', rows='\n'.join(post_row(p) for p in posts),
        foot='<span>─ </span><span class="meta"><a href="/feed.xml">atom feed</a></span><span> </span>'),
        KEYS['list'], description='All posts by Boy Maas, newest first.', page_id='posts')

    out['work.html'] = page('list', 'work - ' + NAME, render(
        'list', id='work', meta=work_meta(works), rows_class='works',
        rows='\n'.join(work_row(k + 1, w, summary=True) for k, w in enumerate(works)), foot=''),
        KEYS['list'], description='Projects by Boy Maas: concept, design and code.', page_id='work')

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
        print('broken link: ' + line)
    sys.exit(1 if problems else 0)
