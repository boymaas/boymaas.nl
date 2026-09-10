/* boymaas.nl: the Nebula sky. Behaviour that of atelier variant 18; the sky owns the fixed 60Hz clock,
   and the logo toy (toy.js, loaded first on the home page) runs on it, so both replay under ?seed= and ?t=.
   Everything is painted into one low-resolution buffer of CH-pixel cells (the dither, the stars, the rete,
   the sigils) and scaled up without smoothing: one pixel grid, hard edges, no blur. */
(function () {
'use strict';
/* ---------- palette ---------- */
var P = { ground:'#0B1230', star:'#ECE7F5', ash:'#9C98B4', rule:'#393C59',
          cobalt:'#4E8CFF', teal:'#3ED3C6', violet:'#9A7CFF', magenta:'#E866B2', amber:'#F6B44A', coral:'#FF6E57' };
function rgb(h){ return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
function hex(c){ return '#' + c.map(function(v){ return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
function mix(a, b, t){ var A = rgb(a), B = rgb(b); return hex([A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t]); }
var mixCache = {};
function mixQ(a, b, k){
  k = Math.round(k * 8) / 8;
  if (k <= 0) return a; if (k >= 1) return b;
  var key = a + b + k;
  return mixCache[key] || (mixCache[key] = mix(a, b, k));
}
/* ---------- seeded randomness: every choice goes through rng() ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
var Q = new URLSearchParams(location.search);
var seedParam = parseInt(Q.get('seed'), 10);
var SEED = isFinite(seedParam) ? (seedParam >>> 0) : (Math.floor(Math.random() * 4294967295) >>> 0);
var T0 = Math.max(0, parseInt(Q.get('t'), 10) || 0);
var DT = 1 / 60;
/* ---------- the sky: nebula, rete, stars, sigils ---------- */
var sky = document.getElementById('sky'), sctx = sky.getContext('2d');
var SW = 0, SH = 0, SD = 1, CH = 6, GW = 0, GH = 0, FW = 0, NEB_V = 2.5;
function cellSize(w){ return w < 720 ? 5 : 6; }
var brng = mulberry32((SEED ^ 0x5EB01A) >>> 0);   /* the sky's own stream: the toy's run stays that of variant 12 */
var bt = 0;
var DEST = { x:0.76, y:0.26 };
/* the nebula ramp sits well under the text: each colour is greyed towards ash, then mixed faintly into the ground */
function soft(c, k){ return mix(P.ground, mix(c, P.ash, 0.35), k); }
var RAMP = [P.ground, soft(P.violet, 0.07), soft(P.violet, 0.13), soft(P.cobalt, 0.17),
            soft(P.teal, 0.15), soft(P.magenta, 0.16), soft(P.amber, 0.15), soft(P.star, 0.19)];
function u32(h){ var c = rgb(h); return (255 << 24 | c[2] << 16 | c[1] << 8 | c[0]) >>> 0; }
var BAYER = [0,32,8,40,2,34,10,42, 48,16,56,24,50,18,58,26, 12,44,4,36,14,46,6,38, 60,28,52,20,62,30,54,22,
             3,35,11,43,1,33,9,41, 51,19,59,27,49,17,57,25, 15,47,7,39,13,45,5,37, 63,31,55,23,61,29,53,21].map(function(v){ return v / 64; });
var field = null, gain = null, neb = null, lo = null, nimg = null, nbuf = null, nebBuf = null, nebFrame = -1, ov = null, ovc = null;
var layers = [], rete = null;
var STAR_V = [5, 11, 22];
/* a star is a whole cell now, so there are fewer and they are fainter: three depths, the nearest still well under the text */
var STAR_COL = [mixQ(P.ground, P.star, 0.25), mixQ(P.ground, P.star, 0.375), mixQ(P.ground, P.star, 0.625)].map(u32);
var TINT_COL = [0, u32(mixQ(P.ground, P.teal, 0.625)), u32(mixQ(P.ground, P.amber, 0.625))];
/* periodic value noise, three octaves, one seeded lattice per octave */
function noiseField(srng){
  var f = new Float32Array(FW * GH), L = 48, o, x, y;
  for (o = 0; o < 3; o++){
    var Lo = L >> o, gx = FW / Lo, gy = Math.ceil(GH / Lo) + 2, lat = new Float32Array(gx * gy), amp = 1 / (1 << o);
    for (var i = 0; i < lat.length; i++) lat[i] = srng();
    for (y = 0; y < GH; y++){
      var fy = y / Lo, iy = Math.floor(fy), ty = fy - iy; ty = ty * ty * (3 - 2 * ty);
      for (x = 0; x < FW; x++){
        var fx = x / Lo, ix = Math.floor(fx), tx = fx - ix; tx = tx * tx * (3 - 2 * tx);
        var x0 = ix % gx, x1 = (ix + 1) % gx, r0 = iy * gx, r1 = (iy + 1) * gx;
        var a = lat[r0 + x0] + (lat[r0 + x1] - lat[r0 + x0]) * tx, b = lat[r1 + x0] + (lat[r1 + x1] - lat[r1 + x0]) * tx;
        f[y * FW + x] += (a + (b - a) * ty) * amp;
      }
    }
  }
  for (var k = 0; k < f.length; k++){ var v = (f[k] / 1.75 - 0.50) * 2.4; f[k] = v < 0 ? 0 : v > 1 ? 1 : v; }
  return f;
}
function skyLayout(){
  SW = window.innerWidth; SH = window.innerHeight; SD = Math.min(2, window.devicePixelRatio || 1);
  sky.width = Math.round(SW * SD); sky.height = Math.round(SH * SD);
  CH = cellSize(SW);
  GW = Math.ceil(SW / CH); GH = Math.ceil(SH / CH); FW = Math.ceil(GW / 48) * 48;
  var srng = mulberry32((SEED ^ 0x0B1230) >>> 0);   /* layout stream: stars and lattice, re-rolled per viewport only */
  field = noiseField(srng);
  gain = new Float32Array(GW * GH);
  var dx = DEST.x * GW, dy = DEST.y * GH, ax = 0, ay = 0.85 * GH, len = Math.sqrt((dx - ax) * (dx - ax) + (dy - ay) * (dy - ay));
  var nx = -(dy - ay) / len, ny = (dx - ax) / len;
  for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++){
    var i = y * GW + x, dist = Math.abs((x - ax) * nx + (y - ay) * ny) / (GH * 0.45);
    gain[i] = 0.35 + 0.65 * Math.max(0, 1 - dist);
  }
  neb = document.createElement('canvas'); neb.width = GW; neb.height = GH; lo = neb.getContext('2d');
  nimg = lo.createImageData(GW, GH); nbuf = new Uint32Array(nimg.data.buffer); nebBuf = new Uint32Array(GW * GH); nebFrame = -1;
  ov = document.createElement('canvas'); ov.width = GW; ov.height = GH; ovc = ov.getContext('2d', { willReadFrequently:true });
  var n = Math.max(12, Math.round(36 * SW * SH / (1440 * 900)));
  layers = [];
  for (var L = 0; L < 3; L++){
    var st = new Float32Array(n * 2), tint = new Uint8Array(n);
    for (var k = 0; k < n; k++){ st[k * 2] = srng() * SW; st[k * 2 + 1] = srng() * SH; tint[k] = L === 2 && srng() < 0.125 ? (srng() < 0.5 ? 1 : 2) : 0; }
    layers.push({ n:n, p:st, tint:tint, v:STAR_V[L] });
  }
  var ptr = []; for (var j = 0; j < 7; j++) ptr.push({ a:srng() * 6.2832, r:0.2 + srng() * 0.5, s:srng() < 0.5 ? -1 : 1 });
  rete = { cx:DEST.x * SW, cy:DEST.y * SH, R:0.36 * Math.min(SW, SH) + 0.12 * Math.max(SW, SH) * 0.3, tilt:0.42, base:srng() * 6.2832, ptr:ptr };
}
/* star position on a plane at the fixed clock */
function starX(l, k, spd){ var m = 40, w = SW + m, x = (l.p[k * 2] - l.v * spd * bt) % w; return (x < -m / 2 ? x + w : x) ; }
function starY(l, k, spd){ var m = 40, h = SH + m, y = (l.p[k * 2 + 1] + l.v * spd * 0.35 * bt) % h; return y > SH + m / 2 ? y - h : y; }
/* ---------- states ---------- */
var STATES = ['drift', 'breath', 'rete', 'sigils', 'shore', 'passing'];
var bg = { st:-1, t0:0, dur:0, rot:0, rotT:0, phase:0, phaseT:0, cons:[], passer:null, nextCon:0 };
function bgEnter(i){
  bg.st = i; bg.t0 = bt; bg.dur = 45 + brng() * 45;
  sky.setAttribute('data-state', STATES[i]);
  if (i === 3){ bg.nextCon = bt; }
  if (i === 5){ bg.passer = { g:Math.floor(brng() * 8), y:SH * (0.15 + brng() * 0.7), t0:bt, size:Math.round(0.16 * Math.min(SW, SH)) + 40, v:(SW + 300) / (52 + brng() * 16) }; }
}
function bgPick(){ var i; do { i = Math.floor(brng() * STATES.length); } while (i === bg.st); bgEnter(i); }
function spawnCon(){
  var l = layers[1], spd = 1, n = 4 + Math.floor(brng() * 3), picked = [], tries = 0;
  while (picked.length < n && tries++ < 200){
    var k = Math.floor(brng() * l.n), x = starX(l, k, spd), y = starY(l, k, spd);
    if (x < SW * 0.06 || x > SW * 0.94 || y < SH * 0.06 || y > SH * 0.94) continue;
    var ok = true;
    for (var j = 0; j < picked.length; j++){ var ox = starX(l, picked[j].k, spd) - x, oy = starY(l, picked[j].k, spd) - y; if (ox * ox + oy * oy < 60 * 60) ok = false; }
    if (!ok) continue;
    var cols = [P.teal, P.amber, P.violet, P.magenta, P.cobalt, P.coral];
    picked.push({ k:k, g:Math.floor(brng() * 8), col:mixQ(P.ground, cols[Math.floor(brng() * cols.length)], 0.75) });
  }
  if (picked.length < 3) return;
  picked.sort(function(a, b){ return starX(l, a.k, spd) - starX(l, b.k, spd); });
  bg.cons.push({ nodes:picked, t0:bt, form:3, hold:10 + brng() * 16, diss:3 });
}
function skyStep(){
  bt += DT;
  if (bg.st < 0 || bt - bg.t0 >= bg.dur){
    if (bg.st === 3) bg.cons.forEach(function(c){ c.hold = Math.min(c.hold, bt - c.t0 - c.form); });
    bgPick();
  }
  var st = bg.st, el = bt - bg.t0;
  /* palette cycling: the coloured band rotates; breath rotates fast and crawls the dither */
  var rotP = st === 1 ? 3 : 18;
  if (bt - bg.rotT >= rotP){ bg.rotT += rotP; bg.rot = (bg.rot + 1) % 4; }
  if (st === 1 && bt - bg.phaseT >= 0.5){ bg.phaseT = bt; bg.phase = (bg.phase + 1) % 8; }
  /* sigils: chain constellations, two alive at most */
  if (st === 3 && bt >= bg.nextCon && bg.cons.length < 2){ spawnCon(); bg.nextCon = bt + 6 + brng() * 8; }
  for (var i = bg.cons.length - 1; i >= 0; i--){ var c = bg.cons[i]; if (bt - c.t0 > c.form + c.hold + c.diss) bg.cons.splice(i, 1); }
  if (bg.passer && (SW + 200) - bg.passer.v * (bt - bg.passer.t0) < -bg.passer.size - 100) bg.passer = null;
}
/* ---------- drawing ---------- */
function nebula(){
  var st = bg.st, el = bt - bg.t0, prog = Math.min(1, el / bg.dur);
  /* shore lifts the whole field a little; the old soft hotspot is gone, the field is the only shape */
  var lift = st === 4 ? Math.round(0.12 * Math.sin(3.1416 * prog) * 16) / 16 : 0;
  var br = Math.round(0.06 * Math.sin(bt * 6.2832 / 21) * 64) / 64 + lift;
  var off = Math.floor(bt * NEB_V / CH) % FW, ph = bg.phase;
  var pal = new Uint32Array(8);
  for (var k = 0; k < 8; k++) pal[k] = u32(k >= 3 && k <= 6 ? RAMP[3 + ((k - 3 + bg.rot) % 4)] : RAMP[k]);
  var f = field, g = gain, out = nebBuf, i = 0;
  for (var y = 0; y < GH; y++){
    var row = y * FW, by = (y & 7) << 3;
    for (var x = 0; x < GW; x++, i++){
      var v = f[row + ((x + off) % FW)] * g[i] + br;
      if (v < 0) v = 0; else if (v > 0.999) v = 0.999;
      out[i] = pal[(v * 7 + BAYER[by | ((x + ph) & 7)]) | 0];
    }
  }
}
function rp(a, r){ var c = Math.cos(a + rete.ang), s = Math.sin(a + rete.ang); return [rete.cx + r * c * rete.R, rete.cy + r * s * rete.R * rete.tilt]; }
function ring(r, ox, oy){
  ox = ox || 0; oy = oy || 0;
  for (var k = 0; k <= 48; k++){ var a = k / 48 * 6.2832, c = Math.cos(a) * r + ox, s = Math.sin(a) * r + oy;
    var p = rp(Math.atan2(s, c), Math.sqrt(c * c + s * s)); if (k) ovc.lineTo(p[0], p[1]); else ovc.moveTo(p[0], p[1]); }
}
function drawRete(){
  var st = bg.st, el = bt - bg.t0, lvl = st === 2 ? Math.min(0.3, 0.12 + Math.floor(el / 0.75) * 0.04) : 0.12;
  rete.ang = rete.base + bt * 6.2832 / 360;
  ovc.strokeStyle = mixQ(P.ground, P.ash, lvl); ovc.lineWidth = CH; ovc.beginPath();
  ring(1); ring(0.92); ring(0.72); ring(0.42); ring(0.62, 0, 0.22);
  var k, p, q;
  for (k = 0; k < 36; k++){ var a = k / 36 * 6.2832, r0 = k % 3 ? 0.965 : 0.92; p = rp(a, r0); q = rp(a, 1); ovc.moveTo(p[0], p[1]); ovc.lineTo(q[0], q[1]); }
  for (k = 0; k < 7; k++){ var pt = rete.ptr[k], e = rp(pt.a, 0.62 + 0.22 * Math.sin(pt.a)), m = rp(pt.a + 0.25 * pt.s, (pt.r + 0.62) / 2), t = rp(pt.a + 0.4 * pt.s, pt.r);
    ovc.moveTo(e[0], e[1]); ovc.lineTo(m[0], m[1]); ovc.lineTo(t[0], t[1]); ovc.moveTo(t[0] - 2, t[1] - 2); ovc.lineTo(t[0] + 2, t[1] + 2); }
  var ia = bt * 6.2832 / 120; p = rp(ia, 1); q = rp(ia + 3.1416, 1); ovc.moveTo(p[0], p[1]); ovc.lineTo(q[0], q[1]);
  ovc.stroke();
}
/* the glyph library: fire, water, air, earth, sun, moon, mercury, sulfur; unit box, one-pixel lines */
function glyph(g, x, y, s){
  var c = ovc; c.beginPath();
  function M(a, b){ c.moveTo(x + a * s, y + b * s); } function L(a, b){ c.lineTo(x + a * s, y + b * s); }
  if (g === 0 || g === 2){ M(-0.9, 0.8); L(0, -0.9); L(0.9, 0.8); L(-0.9, 0.8); if (g === 2){ M(-0.95, 0.25); L(0.95, 0.25); } }
  else if (g === 1 || g === 3){ M(-0.9, -0.8); L(0, 0.9); L(0.9, -0.8); L(-0.9, -0.8); if (g === 3){ M(-0.95, -0.25); L(0.95, -0.25); } }
  else if (g === 4){ c.arc(x, y, 0.85 * s, 0, 6.2832); c.moveTo(x + 0.12 * s, y); c.arc(x, y, 0.12 * s, 0, 6.2832); }
  else if (g === 5){ c.arc(x, y, 0.85 * s, 0.9, 5.38); c.moveTo(x + 0.35 * s + 0.62 * s, y); c.arc(x + 0.35 * s, y, 0.62 * s, 5.5, 0.78, true); }
  else if (g === 6){ c.arc(x, y - 0.1 * s, 0.42 * s, 0, 6.2832); M(0, 0.32); L(0, 0.95); M(-0.35, 0.65); L(0.35, 0.65); c.moveTo(x + 0.42 * s, y - 0.8 * s); c.arc(x, y - 0.8 * s, 0.42 * s, 0, 3.1416); }
  else { M(-0.6, 0); L(0, -0.9); L(0.6, 0); L(-0.6, 0); M(0, 0); L(0, 0.9); M(-0.4, 0.5); L(0.4, 0.5); }
  c.stroke();
}
function drawCons(){
  var l = layers[1], spd = speedMul(), gs = CH * 3;
  for (var i = 0; i < bg.cons.length; i++){ var c = bg.cons[i], el = bt - c.t0, n = c.nodes.length, p;
    if (el < c.form) p = el / c.form; else if (el < c.form + c.hold) p = 1; else p = Math.max(0, 1 - (el - c.form - c.hold) / c.diss);
    var pts = c.nodes.map(function(nd){ return [starX(l, nd.k, spd), starY(l, nd.k, spd)]; });
    var seg = p * (n - 1), full = Math.floor(seg), part = seg - full;
    ovc.strokeStyle = mixQ(P.ground, P.ash, 0.375); ovc.lineWidth = CH; ovc.beginPath();
    for (var k = 0; k < full; k++){ ovc.moveTo(pts[k][0], pts[k][1]); ovc.lineTo(pts[k + 1][0], pts[k + 1][1]); }
    if (full < n - 1 && part > 0){ var a = pts[full], b = pts[full + 1]; ovc.moveTo(a[0], a[1]); ovc.lineTo(a[0] + (b[0] - a[0]) * part, a[1] + (b[1] - a[1]) * part); }
    ovc.stroke();
    for (k = 0; k < n; k++){ if (p < k / n + 0.001) break; ovc.strokeStyle = c.nodes[k].col; glyph(c.nodes[k].g, Math.round(pts[k][0]), Math.round(pts[k][1]), gs); }
  }
}
function speedMul(){ return bg.st === 4 ? 1 + 0.8 * Math.sin(3.1416 * Math.min(1, (bt - bg.t0) / bg.dur)) : 1; }
/* a star is one cell of the grid, plotted straight into the buffer */
function star(x, y, col){
  var cx = Math.floor(x / CH), cy = Math.floor(y / CH);
  if (cx >= 0 && cy >= 0 && cx < GW && cy < GH) nbuf[cy * GW + cx] = col;
}
function drawStars(){
  var spd = speedMul();
  for (var L = 0; L < 3; L++){ var l = layers[L];
    for (var k = 0; k < l.n; k++) star(starX(l, k, spd), starY(l, k, spd), l.tint[k] ? TINT_COL[l.tint[k]] : STAR_COL[L]);
  }
}
/* the rete, the sigils and the passer are drawn as lines into an overlay of the same size, then each cell the line
   covers by half or more is copied into the buffer whole: a line becomes a run of cells, never a soft edge */
function overlay(){
  ovc.setTransform(1, 0, 0, 1, 0, 0); ovc.clearRect(0, 0, GW, GH);
  ovc.setTransform(1 / CH, 0, 0, 1 / CH, 0, 0);
  drawRete();
  drawCons();
  if (bg.passer){ var ps = bg.passer; ovc.strokeStyle = mixQ(P.ground, P.ash, 0.25); ovc.lineWidth = CH;
    glyph(ps.g, Math.round(SW + 200 - ps.v * (bt - ps.t0)), Math.round(ps.y), ps.size); }
  var od = new Uint32Array(ovc.getImageData(0, 0, GW, GH).data.buffer);
  for (var i = 0; i < od.length; i++) if ((od[i] >>> 24) >= 128) nbuf[i] = od[i] | 0xFF000000;
}
function skyPaint(){
  var fno = Math.floor(bt / DT + 0.5);
  if (nebFrame < 0 || fno - nebFrame >= 4){ nebFrame = fno; nebula(); }
  /* the buffer is one pixel per cell: the dither, then the lines, then the stars, scaled up without smoothing */
  nbuf.set(nebBuf);
  overlay();
  drawStars();
  lo.putImageData(nimg, 0, 0);
  sctx.setTransform(SD, 0, 0, SD, 0, 0);
  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(neb, 0, 0, GW, GH, 0, 0, GW * CH, GH * CH);
}
/* ================= clock ================= */
var hooks = [];
function stepAll(){ skyStep(); for (var i = 0; i < hooks.length; i++) hooks[i].step(); }
function paintAll(){ skyPaint(); for (var i = 0; i < hooks.length; i++) hooks[i].paint(); }
function boot(){
  skyLayout();
  for (var i = 0; i < hooks.length; i++) hooks[i].init();
  var pre = Math.round(T0 / 1000 / DT);
  for (var s = 0; s < pre; s++) stepAll();
  paintAll();
  var last = performance.now(), acc = 0;
  function frame(now){
    var real = Math.min(0.1, (now - last) / 1000); last = now; acc += real;
    var n = 0; while (acc >= DT && n < 8){ stepAll(); acc -= DT; n++; }
    if (n === 8) acc = 0;
    paintAll();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', function(){
  if (window.innerWidth !== SW || window.innerHeight !== SH){ skyLayout(); skyPaint(); }
});
if (window.Toy) hooks.push(window.Toy({ P:P, rgb:rgb, hex:hex, mix:mix, mixQ:mixQ, mulberry32:mulberry32, SEED:SEED, T0:T0, DT:DT, cell:cellSize }));
boot();
})();
