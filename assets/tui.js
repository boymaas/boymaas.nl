/* boymaas.nl: the text user interface. The character grid, the pane borders, focus, the highlight, the hint line.
   The page says what it is on <body data-page="home|list|article">; an article also carries data-back, data-prev,
   data-next and data-pos. Keys follow variant 18: j/k move, enter opens, tab cycles panes, gg/G ends, esc blurs,
   s toggles sound; an article reads with j/k, steps with h/l or [/], and q or esc goes back to its list. */
(function () {
'use strict';
var root = document.documentElement, body = document.body;
var mode = body.getAttribute('data-page') || 'list';
/* ---------- the character grid ---------- */
function grid(){
  var probe = document.createElement('span');
  probe.textContent = '0000000000';
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit';
  body.appendChild(probe);
  chw = probe.getBoundingClientRect().width / 10;
  probe.remove();
  lh = parseFloat(getComputedStyle(root).getPropertyValue('--lh')) || 24;
  var narrow = window.innerWidth <= 720;
  var cols = Math.min(134, Math.floor((window.innerWidth - (narrow ? 32 : 48)) / chw));
  var lcols = Math.min(72, Math.floor((cols - 2) * 0.54));
  root.style.setProperty('--cols', cols);
  root.style.setProperty('--lcols', lcols);
  root.style.setProperty('--rcols', cols - 2 - lcols);
  /* the status line is one row of text on a strip whose top edge lands on a row of the grid at the foot of the viewport */
  root.style.setProperty('--barh', (lh + window.innerHeight % lh) + 'px');
  frameAll();
}
var chw = 9, lh = 24;
/* ---------- rules: exactly as many ─ as the pane measures, so the corners land on the sides and nothing is clipped ---------- */
function frame(el){
  var runs = el.querySelectorAll(':scope > .bt > .ln, :scope > .bb > .ln'), k;
  for (k = 0; k < runs.length; k++){
    var ln = runs[k], row = ln.parentNode, used = 0, c;
    ln.textContent = '';
    for (c = row.firstElementChild; c; c = c.nextElementSibling) if (c !== ln) used += c.getBoundingClientRect().width;
    var n = Math.max(0, Math.floor((row.getBoundingClientRect().width - used) / chw + 0.02));   /* not clientWidth: that is an integer, and a row is a fraction wide */
    ln.textContent = new Array(n + 1).join('─');
  }
}
var framed = Array.prototype.slice.call(document.querySelectorAll('.pane'));
function frameAll(){ framed.forEach(frame); }
if (window.ResizeObserver){
  var ro = new ResizeObserver(function(entries){ for (var k = 0; k < entries.length; k++) frame(entries[k].target); });
  framed.forEach(function(el){ ro.observe(el); });
}
grid();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(grid);
window.addEventListener('resize', grid);
/* ---------- sound: the button's label; the toy, when present, listens to the same click ---------- */
var snd = document.getElementById('snd');
snd.addEventListener('click', function(){
  var on = !snd.classList.contains('on');
  snd.querySelector('.full').textContent = on ? 'sound on' : 'sound off';
  snd.setAttribute('aria-label', on ? 'sound on' : 'sound off');
  snd.classList.toggle('on', on); snd.setAttribute('aria-pressed', on);
});
var pos = document.getElementById('pos');
var lastKey = '';
function plain(e){ return !(e.metaKey || e.ctrlKey || e.altKey); }
/* ---------- an article: read with j/k, step with h/l, q goes back ---------- */
if (mode === 'article'){
  var go = function(attr){ var href = body.getAttribute(attr); if (href) location.href = href; };
  pos.textContent = body.getAttribute('data-pos') || '';
  window.addEventListener('keydown', function(e){
    if (!plain(e)) return;
    var key = e.key;
    if (key === 'j' || key === 'ArrowDown'){ e.preventDefault(); window.scrollBy(0, lh * 3); }
    else if (key === 'k' || key === 'ArrowUp'){ e.preventDefault(); window.scrollBy(0, -lh * 3); }
    else if (key === 'G'){ window.scrollTo(0, document.documentElement.scrollHeight); }
    else if (key === 'g' && lastKey === 'g'){ window.scrollTo(0, 0); key = ''; }
    else if (key === 'h' || key === '[' || key === 'ArrowLeft'){ go('data-prev'); }
    else if (key === 'l' || key === ']' || key === 'ArrowRight'){ go('data-next'); }
    else if (key === 'q' || key === 'Escape'){ go('data-back'); }
    else if (key === 's'){ snd.click(); }
    lastKey = key;
  });
  return;
}
/* ---------- panes, focus, the highlight ---------- */
var panes = Array.prototype.slice.call(document.querySelectorAll('.pane:not(.sub)'));
var focused = -1;
function rowsOf(p){ return Array.prototype.slice.call(p.querySelectorAll(':scope > .in > ol > li')); }
function curOf(p){ var rows = rowsOf(p), k = -1; rows.forEach(function(r, j){ if (r.classList.contains('cur')) k = j; }); return k; }
function setCur(p, k, quiet){
  var rows = rowsOf(p); if (!rows.length) return;
  k = Math.max(0, Math.min(rows.length - 1, k));
  rows.forEach(function(r, j){ r.classList.toggle('cur', j === k); });
  if (!quiet) rows[k].scrollIntoView({ block:'nearest' });
  status();
}
/* the status slot: a pane the mouse is in (the toy, while the cursor plays) speaks first, then the focused pane */
function status(){
  var hot = document.querySelector('.pane.hot[data-status]');
  if (hot){ pos.textContent = hot.getAttribute('data-status'); return; }
  if (focused < 0){ pos.textContent = ''; return; }
  var p = panes[focused], rows = rowsOf(p), k = curOf(p);
  pos.textContent = rows.length ? p.id + ' ' + (k + 1) + '/' + rows.length : (p.getAttribute('data-status') || p.id);
}
window.addEventListener('tui:status', status);
function focusPane(k, scroll){
  panes.forEach(function(p, j){ p.classList.toggle('focus', j === k); });
  focused = k;
  if (k >= 0){
    var p = panes[k];
    if (document.activeElement !== p && !p.contains(document.activeElement)) p.focus({ preventScroll:true });
    if (rowsOf(p).length && curOf(p) < 0) setCur(p, 0, !scroll);
    if (scroll) p.scrollIntoView({ block:'nearest', behavior:'smooth' });
  } else if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  status();
}
panes.forEach(function(p, j){
  p.addEventListener('focusin', function(){ if (focused !== j) focusPane(j, false); });
  p.querySelectorAll('a').forEach(function(a){ a.tabIndex = -1; });
  rowsOf(p).forEach(function(r, k){ r.addEventListener('mouseenter', function(){ if (focused === j) setCur(p, k); }); });
});
var first = document.querySelector('.pane.list') || panes[0];
window.addEventListener('keydown', function(e){
  if (!plain(e)) return;
  var key = e.key, p = focused >= 0 ? panes[focused] : null, rows = p ? rowsOf(p) : [];
  if (key === 'Tab'){ e.preventDefault(); focusPane(((focused < 0 ? (e.shiftKey ? 0 : -1) : focused) + (e.shiftKey ? -1 : 1) + panes.length) % panes.length, true); }
  else if (key === 'Escape'){ focusPane(-1, false); }
  else if (key === 's'){ snd.click(); }
  else if (!p){ if (key === 'j' || key === 'k' || key === 'ArrowDown' || key === 'ArrowUp'){ e.preventDefault(); focusPane(panes.indexOf(first), true); } }
  else if (key === 'j' || key === 'ArrowDown'){ if (rows.length){ e.preventDefault(); setCur(p, curOf(p) + 1); } }
  else if (key === 'k' || key === 'ArrowUp'){ if (rows.length){ e.preventDefault(); setCur(p, curOf(p) - 1); } }
  else if (key === 'G'){ if (rows.length) setCur(p, rows.length - 1); }
  else if (key === 'g' && lastKey === 'g'){ if (rows.length) setCur(p, 0); key = ''; }
  else if (key === 'Enter'){ var k = curOf(p), a = k >= 0 && rows[k].querySelector('a'); if (a) a.click(); }
  lastKey = key;
});
/* the list starts highlighted, as a list does when a screen opens */
focusPane(panes.indexOf(first), false);
})();
