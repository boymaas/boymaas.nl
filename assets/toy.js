/* boymaas.nl: the logo toy, nine systems drawn at random. Behaviour identical to atelier variant 18.
   Loaded on the home page only, before sky.js: the sky calls Toy(api) once and steps and paints it on its clock. */
window.Toy = function (Sky) {
'use strict';
var P = Sky.P, mix = Sky.mix, mixQ = Sky.mixQ, DT = Sky.DT;
var rng = Sky.mulberry32(Sky.SEED);   /* the toy's own stream, as in variant 12 */
var HOLD = 1.4;
/* ---------- the logo: 5x7 glyphs, each cell quartered ---------- */
var FONT = {
  M:['#...#','##.##','#.#.#','#.#.#','#...#','#...#','#...#'],
  '4':['...#.','..##.','.#.#.','#..#.','#####','...#.','...#.'],
  N:['#...#','##..#','#.#.#','#..##','#...#','#...#','#...#'],
  I:['#####','..#..','..#..','..#..','..#..','..#..','#####'],
  C:['.####','#....','#....','#....','#....','#....','.####']
};
var LOGO = [];
(function(){
  var word = 'M4NIC';
  for (var i = 0; i < word.length; i++){
    var g = FONT[word[i]];
    for (var y = 0; y < 7; y++) for (var x = 0; x < 5; x++) if (g[y][x] === '#')
      for (var sy = 0; sy < 2; sy++) for (var sx = 0; sx < 2; sx++) LOGO.push({ gx:(i*6 + x)*2 + sx, gy:y*2 + sy, letter:i });
  }
})();
var LW = 58, LH = 14;
var ROWCOL = [P.coral, P.coral, P.star, P.star, P.coral, mix(P.coral, P.amber, 0.5), P.amber,
              P.cobalt, P.cobalt, mix(P.cobalt, P.teal, 0.5), P.teal, P.star, P.amber, mix(P.amber, P.star, 0.35)];
/* ---------- world ---------- */
var box = document.getElementById('box'), cvs = document.getElementById('hero'), ctx = cvs.getContext('2d');
var cellPx = 12, W = 0, H = 0, OX = 0, OY = 0, S = 1, dpr = 1;
var cells = [], logoAt = null;
function layout(){
  var bw = box.clientWidth, bh = box.clientHeight;
  cellPx = Math.max(5, Math.min(12, Math.floor(bw / 62)));
  W = Math.floor(bw / cellPx); H = Math.floor(bh / cellPx);
  OX = Math.floor((W - LW) / 2); OY = Math.floor((H - LH) / 2);
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cvs.style.width = W * cellPx + 'px'; cvs.style.height = H * cellPx + 'px';
  cvs.width = Math.round(W * cellPx * dpr); cvs.height = Math.round(H * cellPx * dpr);
  S = cellPx * dpr;
  cells = LOGO.map(function(l, i){
    return { i:i, hx:OX + l.gx, hy:OY + l.gy, x:OX + l.gx, y:OY + l.gy, vx:0, vy:0, col:ROWCOL[l.gy], letter:l.letter, r:0, a:1, k:0 };
  });
  logoAt = new Int16Array(W * H).fill(-1);
  cells.forEach(function(c){ logoAt[c.hy * W + c.hx] = c.i; });
}
function snapHome(){ cells.forEach(function(c){ c.x = c.hx; c.y = c.hy; c.vx = 0; c.vy = 0; c.k = 0; c.a = 1; }); }
function allHome(eps){
  for (var i = 0; i < cells.length; i++){ var c = cells[i];
    if (Math.abs(c.x - c.hx) > eps || Math.abs(c.y - c.hy) > eps || Math.abs(c.vx) > eps * 10 || Math.abs(c.vy) > eps * 10) return false; }
  return true;
}
function homeSpring(c, k, damp, dt){
  c.vx += (c.hx - c.x) * k * dt; c.vy += (c.hy - c.y) * k * dt;
  c.vx *= damp; c.vy *= damp; c.x += c.vx * dt; c.y += c.vy * dt;
}
function wallClamp(c, e){
  if (c.x < 0){ c.x = 0; c.vx = -c.vx * e; } if (c.x > W - 1){ c.x = W - 1; c.vx = -c.vx * e; }
  if (c.y < 0){ c.y = 0; c.vy = -c.vy * e; } if (c.y > H - 1){ c.y = H - 1; c.vy = -c.vy * e; }
}
/* ---------- cursor ---------- */
var pend = { x:-1e3, y:-1e3, inside:false, down:false };
var cursor = { x:-1e3, y:-1e3, vx:0, vy:0, inside:false, down:false, moved:false };
function cursorFrom(clientX, clientY){
  var r = cvs.getBoundingClientRect();
  pend.x = (clientX - r.left) / cellPx; pend.y = (clientY - r.top) / cellPx; pend.inside = true;
}
box.addEventListener('mousemove', function(e){ cursorFrom(e.clientX, e.clientY); }, { passive:true });
box.addEventListener('mouseleave', function(){ pend.inside = false; pend.down = false; });
box.addEventListener('mousedown', function(e){ pend.down = true; cursorFrom(e.clientX, e.clientY); e.preventDefault(); });
window.addEventListener('mouseup', function(){ pend.down = false; });
box.addEventListener('touchstart', function(e){ var t = e.touches[0]; cursorFrom(t.clientX, t.clientY); }, { passive:true });
box.addEventListener('touchmove', function(e){ var t = e.touches[0]; cursorFrom(t.clientX, t.clientY); }, { passive:true });
box.addEventListener('touchend', function(){ pend.inside = false; pend.down = false; });
function cursorStep(){
  cursor.moved = pend.inside && (pend.x !== cursor.x || pend.y !== cursor.y);
  if (pend.inside && cursor.inside){
    cursor.vx = Math.max(-200, Math.min(200, (pend.x - cursor.x) / DT)) * 0.5 + cursor.vx * 0.5;
    cursor.vy = Math.max(-200, Math.min(200, (pend.y - cursor.y) / DT)) * 0.5 + cursor.vy * 0.5;
  } else { cursor.vx = 0; cursor.vy = 0; }
  cursor.x = pend.x; cursor.y = pend.y; cursor.inside = pend.inside; cursor.down = pend.down;
}
function repel(c, R, F, dt){
  if (!cursor.inside) return;
  var dx = c.x - cursor.x, dy = c.y - cursor.y, d = Math.sqrt(dx*dx + dy*dy) || 0.01;
  if (d < R){ var f = (R - d) / R * F; c.vx += dx / d * f * dt; c.vy += dy / d * f * dt; }
}
/* ---------- sound (off until asked; tui.js owns the button's label) ---------- */
var AC = null, sndOn = false, lastTick = 0;
var sndBtn = document.getElementById('snd');
sndBtn.addEventListener('click', function(){
  sndOn = !sndOn;
  if (sndOn && !AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
  if (AC && AC.state === 'suspended') AC.resume();
});
function tone(type, f0, f1, dur, gain){
  if (!sndOn || !AC) return;
  var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur);
}
function sound(kind, idx){
  if (!sndOn || !AC) return;
  var now = performance.now();
  if (kind === 'switch'){ tone('square', 220 * Math.pow(2, (idx % 9) / 6), 220 * Math.pow(2, (idx % 9) / 6), 0.18, 0.05); return; }
  if (now - lastTick < 45) return; lastTick = now;
  if (kind === 'bounce') tone('sine', 180, 120, 0.05, 0.05);
  else if (kind === 'pop') tone('sine', 700, 250, 0.07, 0.04);
  else if (kind === 'pluck') tone('triangle', 330, 300, 0.14, 0.06);
}
/* ---------- drawing helpers (world units; 1 = one cell) ---------- */
function drawCell(c, col){
  ctx.fillStyle = col;
  if (c.r > 0.02){
    var r = Math.min(0.5, c.r);
    ctx.beginPath();
    if (r >= 0.48) ctx.arc(c.x + 0.5, c.y + 0.5, 0.5, 0, 6.2832);
    else ctx.roundRect(c.x, c.y, 1, 1, r);
    ctx.fill();
  } else ctx.fillRect(c.x, c.y, 1, 1);
}
function drawCells(hot){
  for (var i = 0; i < cells.length; i++){ var c = cells[i]; if (c.a <= 0) continue; drawCell(c, c.k > 0 ? mixQ(c.col, hot, c.k) : c.col); }
}
/* ================= the system library ================= */
var systems = [];
/* 1. bouncy balls: gravity, restitution, ball-ball collisions, then springs. cursor pushes */
systems.push({ name:'bouncy balls', role:'cursor pushes', hot:P.star, max:13,
  init:function(){
    this.t = 0; this.T1 = 4.2 + rng() * 1.6;
    cells.forEach(function(c){ c.rel = rng() * 0.9; c.e = 0.5 + rng() * 0.3; c.vx = 0; c.vy = 0; c.r = 0.5; c.free = false; });
    this.order = cells.slice();
  },
  step:function(dt){
    this.t += dt; var t = this.t, i, c;
    if (t < this.T1){
      for (i = 0; i < cells.length; i++){ c = cells[i];
        if (t < c.rel) continue; c.free = true;
        c.vy += 70 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
        if (c.y > H - 1){ c.y = H - 1; if (c.vy > 0){ if (c.vy > 6) sound('bounce'); c.vy = -c.vy * c.e; } c.vx *= 0.985; }
        if (c.x < 0){ c.x = 0; c.vx = -c.vx * c.e; } if (c.x > W - 1){ c.x = W - 1; c.vx = -c.vx * c.e; }
        repel(c, 6, 260, dt);
        c.k = Math.min(0.6, Math.abs(c.vy) / 60);
      }
      /* sweep and prune on x */
      var o = this.order; o.sort(function(a, b){ return a.x - b.x; });
      for (i = 0; i < o.length; i++){ var a = o[i]; if (!a.free) continue;
        for (var j = i + 1; j < o.length && o[j].x - a.x < 1; j++){ var b = o[j]; if (!b.free) continue;
          var dx = b.x - a.x, dy = b.y - a.y, d2 = dx*dx + dy*dy;
          if (d2 < 1 && d2 > 1e-6){
            var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, over = (1 - d) * 0.5;
            a.x -= nx * over; a.y -= ny * over; b.x += nx * over; b.y += ny * over;
            var rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rv < 0){ var imp = -rv * 0.85; a.vx -= nx * imp; a.vy -= ny * imp; b.vx += nx * imp; b.vy += ny * imp; }
          }
        }
      }
    } else {
      for (i = 0; i < cells.length; i++){ c = cells[i];
        homeSpring(c, 28, 0.9, dt); repel(c, 6, 260, dt);
        c.r = Math.max(0, c.r - dt * 0.35); c.k = Math.max(0, c.k - dt);
      }
    }
  },
  done:function(){ return this.t > this.T1 + 1 && allHome(0.03); }
});
/* 2. magnet: a ghost magnet on a Lissajous path attracts, flips, repels. cursor is the magnet, press to repel */
systems.push({ name:'magnet', role:'cursor attracts, press repels', hot:P.star, max:14,
  init:function(){
    this.t = 0; this.T1 = 6 + rng() * 2;
    this.a = 0.9 + rng() * 1.6; this.b = 0.9 + rng() * 1.6; this.ph = rng() * 6.28;
    this.pol = 1; this.flipT = 1.1 + rng() * 0.9; this.nextFlip = this.flipT; this.flips = 0;
    this.mx = 0; this.my = 0; this.on = 0;
    cells.forEach(function(c){ c.vx = 0; c.vy = 0; c.r = 0.25; });
  },
  step:function(dt){
    this.t += dt; var t = this.t, pol = this.pol;
    if (cursor.inside){ this.mx = cursor.x; this.my = cursor.y; pol = cursor.down ? -1 : 1; this.on = 1; this.ghost = false; }
    else if (t < this.T1){
      this.mx = OX + LW / 2 + (LW / 2 + 4) * Math.sin(this.a * t + this.ph);
      this.my = OY + LH / 2 + (LH / 2 + 5) * Math.sin(this.b * t);
      if (t > this.nextFlip && this.flips < 6){ this.pol = pol = -this.pol; this.nextFlip += this.flipT; this.flips++; }
      this.on = 1; this.ghost = true;
    } else this.on = 0;
    var weak = t < this.T1 || cursor.inside;
    for (var i = 0; i < cells.length; i++){ var c = cells[i];
      if (this.on){
        var dx = this.mx - c.x, dy = this.my - c.y, d2 = dx*dx + dy*dy + 1, d = Math.sqrt(d2);
        var f = Math.min(90, pol * 1100 / d2); if (pol < 0) f = Math.max(-90, f);
        c.vx += dx / d * f * dt; c.vy += dy / d * f * dt;
        c.k = Math.max(0, Math.min(0.7, 1 - d / 12));
      } else c.k = Math.max(0, c.k - dt * 2);
      homeSpring(c, weak ? 3 : 34, weak ? 0.94 : 0.88, dt);
      var sp = Math.sqrt(c.vx*c.vx + c.vy*c.vy); if (sp > 45){ c.vx *= 45 / sp; c.vy *= 45 / sp; }
      wallClamp(c, 0.4);
    }
  },
  draw:function(){
    drawCells(this.hot);
    if (this.on && this.ghost){
      ctx.strokeStyle = P.star; ctx.lineWidth = 1.5 / cellPx; ctx.beginPath();
      ctx.arc(this.mx, this.my, this.pol > 0 ? 0.9 : 1.4, 0, 6.2832); ctx.stroke();
    }
  },
  done:function(){ return this.t > this.T1 + 0.5 && !cursor.inside && allHome(0.03); }
});
/* 3. sand: falling-sand automaton drains the letters, then they refill bottom-up. cursor digs */
systems.push({ name:'sand', role:'cursor digs', hot:P.star, max:17,
  init:function(){
    snapHome();
    this.t = 0; this.acc = 0; this.T1 = 5.2 + rng() * 1.2;
    var g = this.grid = new Int16Array(W * H).fill(-1);
    cells.forEach(function(c){ c.gx = c.hx; c.gy = c.hy; g[c.gy * W + c.gx] = c.i; c.mode = 0; c.rel = rng() * 3.2; c.r = 0; c.vx = 0; c.vy = 0; });
    var order = cells.slice().sort(function(a, b){ return (b.hy - a.hy) + (rng() - 0.5) * 1.5; });
    var T1 = this.T1, n = order.length;
    order.forEach(function(c, k){ c.ret = T1 + k * (2.4 / n); });
    this.cols = []; for (var x = 0; x < W; x++) this.cols.push(x);
  },
  tryMove:function(c, nx, ny){
    if (nx < 0 || nx >= W || ny >= H) return false;
    var g = this.grid; if (g[ny * W + nx] !== -1) return false;
    g[c.gy * W + c.gx] = -1; c.gx = nx; c.gy = ny; g[ny * W + nx] = c.i; return true;
  },
  settle:function(c, x, y){
    x = Math.max(0, Math.min(W - 1, Math.round(x))); y = Math.max(0, Math.min(H - 1, Math.round(y)));
    var g = this.grid;
    for (var k = 0; k < H; k++){ var yy = y - k; if (yy < 0) break; if (g[yy * W + x] === -1){ c.gx = x; c.gy = yy; g[yy * W + x] = c.i; c.mode = 0; c.vx = 0; c.vy = 0; return; } }
    c.mode = 2; /* no room: fly home */
  },
  step:function(dt){
    this.t += dt; this.acc += dt; var t = this.t, i, c, g = this.grid;
    if (t < this.T1){
      /* cursor digs */
      if (cursor.inside && cursor.moved){
        var dug = 0;
        for (i = 0; i < cells.length && dug < 14; i++){ c = cells[i]; if (c.mode !== 0) continue;
          var ddx = c.gx - cursor.x, ddy = c.gy - cursor.y;
          if (ddx*ddx + ddy*ddy < 6){ g[c.gy * W + c.gx] = -1; c.mode = 1; c.rel = 0;
            c.vx = ddx * 5 + cursor.vx * 0.25 + (rng() - 0.5) * 6; c.vy = -14 - rng() * 10; dug++; }
        }
      }
      /* automaton at 45 passes per second */
      while (this.acc >= 1 / 45){
        this.acc -= 1 / 45;
        for (var y = H - 1; y >= 0; y--){
          var cols = this.cols; /* shuffle column order a little each pass */
          var sw = Math.floor(rng() * W), sw2 = Math.floor(rng() * W), tmp = cols[sw]; cols[sw] = cols[sw2]; cols[sw2] = tmp;
          for (var xi = 0; xi < W; xi++){ var x = cols[xi], id = g[y * W + x]; if (id < 0) continue; c = cells[id];
            if (t < c.rel) continue;
            if (this.tryMove(c, x, y + 1)) continue;
            var side = rng() < 0.5 ? -1 : 1;
            if (!this.tryMove(c, x + side, y + 1)) this.tryMove(c, x - side, y + 1);
          }
        }
      }
      for (i = 0; i < cells.length; i++){ c = cells[i];
        if (c.mode === 0){ c.x += (c.gx - c.x) * 0.55; c.y += (c.gy - c.y) * 0.55; c.k = Math.max(0, c.k - dt * 2); }
        else if (c.mode === 1){
          c.vy += 70 * dt; var nx = c.x + c.vx * dt, ny = c.y + c.vy * dt; c.k = 0.6;
          if (nx < 0 || nx > W - 1){ c.vx = -c.vx * 0.5; nx = Math.max(0, Math.min(W - 1, nx)); }
          var rx = Math.round(nx), ry = Math.round(ny);
          if (ny >= H - 1 || (c.vy > 0 && ry >= 0 && g[Math.min(H - 1, ry) * W + rx] !== -1)) this.settle(c, nx, ny - 1);
          else { c.x = nx; c.y = ny; }
        }
      }
    } else {
      for (i = 0; i < cells.length; i++){ c = cells[i];
        if (c.mode !== 2 && t > c.ret){ if (c.mode === 0) g[c.gy * W + c.gx] = -1; c.mode = 2; }
        if (c.mode === 2){ homeSpring(c, 40, 0.86, dt); repel(c, 5, 200, dt); c.k = Math.max(0, c.k - dt); }
        else if (c.mode === 1){ c.vy += 70 * dt; c.x += c.vx * dt; c.y += c.vy * dt; if (c.y >= H - 1) c.mode = 2; }
      }
    }
  },
  done:function(){ return this.t > this.T1 + 3 && allHome(0.03); }
});
/* 4. life: Conway on the whole box seeded by the logo, then error-corrected back. cursor paints */
systems.push({ name:'life', role:'cursor paints', hot:P.teal, max:16,
  init:function(){
    snapHome();
    var g = this.g = new Uint8Array(W * H); this.g2 = new Uint8Array(W * H);
    this.born = new Uint8Array(W * H); this.flash = new Float32Array(W * H);
    cells.forEach(function(c){ g[c.hy * W + c.hx] = 1; });
    this.gens = 0; this.G = 8 + Math.floor(rng() * 10); this.t = 0; this.acc = 0; this.phase = 0; this.list = []; this.rescan = 0;
    cells.forEach(function(c){ c.a = 0; });
  },
  gen:function(){
    var g = this.g, n = this.g2, born = this.born;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++){
      var s = 0;
      for (var dy = -1; dy <= 1; dy++){ var yy = y + dy; if (yy < 0 || yy >= H) continue;
        for (var dx = -1; dx <= 1; dx++){ if (!dx && !dy) continue; var xx = x + dx; if (xx < 0 || xx >= W) continue; s += g[yy * W + xx]; } }
      var i = y * W + x, alive = g[i] ? (s === 2 || s === 3) : s === 3;
      n[i] = alive ? 1 : 0; born[i] = (alive && !g[i]) ? 1 : 0;
    }
    this.g = n; this.g2 = g;
  },
  diffs:function(){
    var g = this.g, out = [];
    for (var i = 0; i < W * H; i++) if ((g[i] === 1) !== (logoAt[i] >= 0)) out.push(i);
    for (var k = out.length - 1; k > 0; k--){ var j = Math.floor(rng() * (k + 1)), t = out[k]; out[k] = out[j]; out[j] = t; }
    return out;
  },
  step:function(dt){
    this.t += dt; this.acc += dt; var g = this.g, i;
    if (cursor.inside && cursor.moved){
      var cx = Math.round(cursor.x), cy = Math.round(cursor.y);
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++){
        var x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= W || y >= H) continue;
        if ((!dx && !dy) || rng() < 0.4){ i = y * W + x; if (!g[i]){ g[i] = 1; this.born[i] = 1; } }
      }
    }
    for (i = 0; i < W * H; i++) if (this.flash[i] > 0) this.flash[i] -= dt * 4;
    if (this.phase === 0){
      if (this.acc > 0.11){ this.acc -= 0.11; this.gen(); this.gens++; if (this.gens >= this.G){ this.phase = 1; this.list = this.diffs(); this.per = Math.max(2, Math.ceil(this.list.length / 110)); } }
    } else {
      g = this.g;
      for (var k = 0; k < this.per && this.list.length; k++){
        i = this.list.pop(); g[i] = logoAt[i] >= 0 ? 1 : 0; this.flash[i] = 1; this.born[i] = 0;
      }
      this.rescan += dt;
      if (!this.list.length && this.rescan > 0.25){ this.rescan = 0; this.list = this.diffs(); }
    }
  },
  draw:function(){
    var g = this.g, born = this.born, fl = this.flash;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++){ var i = y * W + x;
      if (!g[i]){ if (fl[i] > 0){ ctx.fillStyle = mixQ(P.ground, P.coral, fl[i] * 0.6); ctx.fillRect(x, y, 1, 1); } continue; }
      var li = logoAt[i], col;
      if (li >= 0) col = fl[i] > 0 ? mixQ(cells[li].col, P.coral, fl[i]) : cells[li].col;
      else col = born[i] ? P.amber : P.teal;
      ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1);
    }
  },
  done:function(){
    if (this.phase !== 1 || this.list.length) return false;
    var g = this.g; for (var i = 0; i < W * H; i++) if ((g[i] === 1) !== (logoAt[i] >= 0)) return false;
    for (var k = 0; k < W * H; k++) if (this.flash[k] > 0) return false;
    cells.forEach(function(c){ c.a = 1; }); return true;
  }
});
/* 5. bubbles: cells sink, rise back as bubbles, pop into place. cursor pops */
systems.push({ name:'bubbles', role:'cursor pops', hot:P.star, max:16,
  init:function(){
    this.t = 0;
    cells.forEach(function(c){ c.rel = rng() * 1.6; c.mode = 0; c.wob = rng() * 6.28; c.spd = 7 + rng() * 8; c.r = 0; c.ring = 0; c.vx = 0; c.vy = 0; });
  },
  respawn:function(c){ c.mode = 2; c.y = H + 1 + rng() * 6; c.x = c.hx + (rng() - 0.5) * 12; c.vy = -c.spd; c.r = 0.5; },
  step:function(dt){
    this.t += dt; var t = this.t;
    for (var i = 0; i < cells.length; i++){ var c = cells[i];
      if (c.mode === 0){ if (t > c.rel){ c.mode = 1; c.vy = 0; } }
      else if (c.mode === 1){
        c.vy += 30 * dt; c.vy *= 0.985; c.y += c.vy * dt; c.x += Math.sin(t * 3 + c.wob) * 0.6 * dt; c.r = Math.min(0.5, c.r + dt * 2);
        if (c.y > H + 1) this.respawn(c);
      } else if (c.mode === 2){
        c.y += c.vy * dt; c.x += (c.hx - c.x) * 1.6 * dt + Math.sin(t * 4 + c.wob) * 1.4 * dt;
        if (c.y <= c.hy){ c.y = c.hy; c.x = c.hx; c.mode = 3; c.ring = 1; c.r = 0; sound('pop'); }
        if (cursor.inside){ var dx = c.x - cursor.x, dy = c.y - cursor.y; if (dx*dx + dy*dy < 5 && c.y < H - 1) this.respawn(c); }
      } else {
        c.ring = Math.max(0, c.ring - dt * 2.5);
        if (cursor.inside && t < this.max - 4){ var ex = c.x - cursor.x, ey = c.y - cursor.y; if (ex*ex + ey*ey < 3){ this.respawn(c); sound('pop'); } }
      }
      c.k = c.mode === 2 ? 0.35 : 0;
    }
  },
  draw:function(){
    var lw = 1.5 / cellPx;
    for (var i = 0; i < cells.length; i++){ var c = cells[i];
      if (c.mode === 2){
        ctx.strokeStyle = c.col; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(c.x + 0.5, c.y + 0.5, 0.42, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = mixQ(c.col, P.star, 0.6); ctx.fillRect(c.x + 0.6, c.y + 0.22, 0.16, 0.16);
      } else {
        drawCell(c, c.mode === 1 ? mixQ(c.col, this.hot, 0.35) : c.col);
        if (c.ring > 0){ ctx.strokeStyle = mixQ(c.col, P.star, 1 - c.ring); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(c.x + 0.5, c.y + 0.5, 0.5 + (1 - c.ring) * 1.6, 0, 6.2832); ctx.stroke(); }
      }
    }
  },
  done:function(){ if (this.t < 3) return false; for (var i = 0; i < cells.length; i++){ var c = cells[i]; if (c.mode !== 3 || c.ring > 0) return false; } return true; }
});
/* 6. swarm: boids at radius nine, walls, then a home pull. cursor is a predator */
systems.push({ name:'swarm', role:'cursor scatters', hot:P.violet, max:16,
  init:function(){
    this.t = 0; this.T1 = 5 + rng() * 3;
    cells.forEach(function(c){ var a = rng() * 6.28, s = 8 + rng() * 4; c.vx = Math.cos(a) * s; c.vy = Math.sin(a) * s; c.rel = rng() * 0.7; c.r = 0.2; });
    this.B = 5; this.bw = Math.ceil(W / this.B) + 1; this.bh = Math.ceil(H / this.B) + 1;
    this.buckets = []; for (var i = 0; i < this.bw * this.bh; i++) this.buckets.push([]);
  },
  step:function(dt){
    this.t += dt; var t = this.t, B = this.B, bw = this.bw, bk = this.buckets, i, c;
    for (i = 0; i < bk.length; i++) bk[i].length = 0;
    for (i = 0; i < cells.length; i++){ c = cells[i]; var bx = Math.max(0, Math.min(bw - 1, Math.floor(c.x / B))), by = Math.max(0, Math.min(this.bh - 1, Math.floor(c.y / B))); bk[by * bw + bx].push(c); }
    var flock = t < this.T1, homeK = flock ? 0 : Math.min(40, (t - this.T1) * 22);
    for (i = 0; i < cells.length; i++){ c = cells[i]; if (t < c.rel) continue;
      var sx = 0, sy = 0, ax = 0, ay = 0, an = 0, cx = 0, cy = 0, cn = 0;
      var bx0 = Math.floor(c.x / B), by0 = Math.floor(c.y / B);
      for (var by = by0 - 2; by <= by0 + 2; by++){ if (by < 0 || by >= this.bh) continue;
        for (var bx = bx0 - 2; bx <= bx0 + 2; bx++){ if (bx < 0 || bx >= bw) continue;
          var list = bk[by * bw + bx];
          for (var j = 0; j < list.length; j++){ var o = list[j]; if (o === c) continue;
            var dx = o.x - c.x, dy = o.y - c.y, d2 = dx*dx + dy*dy; if (d2 > 81) continue;
            if (d2 < 2.25){ var d = Math.sqrt(d2) || 0.01; sx -= dx / d / d; sy -= dy / d / d; }
            if (d2 < 36){ ax += o.vx; ay += o.vy; an++; }
            cx += o.x; cy += o.y; cn++;
          } } }
      if (flock){
        c.vx += sx * 30 * dt; c.vy += sy * 30 * dt;
        if (an){ c.vx += (ax / an - c.vx) * 4 * dt; c.vy += (ay / an - c.vy) * 4 * dt; }
        if (cn){ c.vx += (cx / cn - c.x) * 2 * dt; c.vy += (cy / cn - c.y) * 2 * dt; }
        if (c.x < 4) c.vx += (4 - c.x) * 20 * dt; if (c.x > W - 5) c.vx -= (c.x - W + 5) * 20 * dt;
        if (c.y < 4) c.vy += (4 - c.y) * 20 * dt; if (c.y > H - 5) c.vy -= (c.y - H + 5) * 20 * dt;
      } else { c.vx += sx * 6 * dt; c.vy += sy * 6 * dt; }
      if (cursor.inside){ var fx = c.x - cursor.x, fy = c.y - cursor.y, fd = Math.sqrt(fx*fx + fy*fy) || 0.01; if (fd < 10){ c.vx += fx / fd * (10 - fd) * 30 * dt; c.vy += fy / fd * (10 - fd) * 30 * dt; } }
      var sp = Math.sqrt(c.vx*c.vx + c.vy*c.vy) || 0.01;
      if (flock){ var want = Math.max(6, Math.min(15, sp)); c.vx *= want / sp; c.vy *= want / sp; }
      else if (sp > 30){ c.vx *= 30 / sp; c.vy *= 30 / sp; }
      if (homeK){ homeSpring(c, homeK, 0.88, dt); } else { c.x += c.vx * dt; c.y += c.vy * dt; }
      wallClamp(c, 0.3);
      c.k = flock ? 0.35 : Math.max(0, c.k - dt);
    }
  },
  draw:function(){
    for (var i = 0; i < cells.length; i++){ var c = cells[i]; var col = c.k > 0 ? mixQ(c.col, this.hot, c.k) : c.col;
      if (c.k > 0.2){ var sp = Math.sqrt(c.vx*c.vx + c.vy*c.vy) || 1, ux = c.vx / sp, uy = c.vy / sp;
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(c.x + 0.5 + ux * 0.7, c.y + 0.5 + uy * 0.7);
        ctx.lineTo(c.x + 0.5 - ux * 0.5 - uy * 0.45, c.y + 0.5 - uy * 0.5 + ux * 0.45);
        ctx.lineTo(c.x + 0.5 - ux * 0.5 + uy * 0.45, c.y + 0.5 - uy * 0.5 - ux * 0.45); ctx.fill();
      } else drawCell(c, col);
    }
  },
  done:function(){ return this.t > this.T1 + 1.5 && allHome(0.04); }
});
/* 7. spring mesh: nodes linked to letter neighbours; plucks ring through. cursor grabs and releases */
systems.push({ name:'spring mesh', role:'cursor plucks', hot:P.star, max:14,
  init:function(){
    this.t = 0; var links = this.links = [];
    var at = {}; cells.forEach(function(c){ at[c.hx + ',' + c.hy] = c; });
    cells.forEach(function(c){
      [[1,0],[0,1],[1,1],[-1,1]].forEach(function(d){ var o = at[(c.hx + d[0]) + ',' + (c.hy + d[1])]; if (o) links.push([c, o, Math.sqrt(d[0]*d[0] + d[1]*d[1])]); });
      c.vx = 0; c.vy = 0; c.r = 0.5;
    });
    var n = 2 + Math.floor(rng() * 2), tt = 0.3; this.plucks = [];
    for (var k = 0; k < n; k++){ var a = rng() * 6.28; this.plucks.push({ at:tt, c:cells[Math.floor(rng() * cells.length)], dx:Math.cos(a) * (3 + rng() * 3), dy:Math.sin(a) * (3 + rng() * 3), dur:0.35 }); tt += 2.2 + rng() * 1.2; }
    this.last = tt; this.grab = null;
  },
  step:function(dt){
    this.t += dt; var t = this.t, i, c, K = 420;
    var links = this.links;
    for (i = 0; i < links.length; i++){ var L = links[i], a = L[0], b = L[1];
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx*dx + dy*dy) || 0.01, f = (d - L[2]) * K;
      var fx = dx / d * f * dt, fy = dy / d * f * dt; a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
    }
    var settling = t > this.last + 3.5 && !this.grab;
    var damp = settling ? 0.9 : 0.985;
    for (i = 0; i < cells.length; i++){ c = cells[i];
      c.vx += (c.hx - c.x) * 15 * dt; c.vy += (c.hy - c.y) * 15 * dt;
      c.vx *= damp; c.vy *= damp; c.x += c.vx * dt; c.y += c.vy * dt;
      var e = Math.abs(c.x - c.hx) + Math.abs(c.y - c.hy); c.k = Math.min(0.8, e * 0.35);
    }
    for (i = 0; i < this.plucks.length; i++){ var p = this.plucks[i];
      if (t >= p.at && t < p.at + p.dur){ var k = (t - p.at) / p.dur; p.c.x = p.c.hx + p.dx * k; p.c.y = p.c.hy + p.dy * k; p.c.vx = 0; p.c.vy = 0; }
      else if (t >= p.at + p.dur && !p.done){ p.done = true; sound('pluck'); }
    }
    if (cursor.inside){
      if (this.grab){ var g = this.grab, gx = g.x - cursor.x, gy = g.y - cursor.y;
        if (gx*gx + gy*gy > 30){ this.grab = null; sound('pluck'); }
        else { g.x += (cursor.x - 0.5 - g.x) * 0.5; g.y += (cursor.y - 0.5 - g.y) * 0.5; g.vx = 0; g.vy = 0; }
      } else {
        var best = null, bd = 6;
        for (i = 0; i < cells.length; i++){ c = cells[i]; var qx = c.x + 0.5 - cursor.x, qy = c.y + 0.5 - cursor.y, q = qx*qx + qy*qy; if (q < bd){ bd = q; best = c; } }
        if (best) this.grab = best;
      }
    } else if (this.grab){ this.grab = null; sound('pluck'); }
  },
  draw:function(){
    ctx.strokeStyle = P.rule; ctx.lineWidth = 1 / cellPx; ctx.beginPath();
    var links = this.links;
    for (var i = 0; i < links.length; i++){ var a = links[i][0], b = links[i][1]; ctx.moveTo(a.x + 0.5, a.y + 0.5); ctx.lineTo(b.x + 0.5, b.y + 0.5); }
    ctx.stroke();
    drawCells(this.hot);
  },
  done:function(){ return this.t > this.last + 1 && !this.grab && allHome(0.04); }
});
/* 8. fluid: a stable-fluids velocity field stirs the cells as markers; it damps and they drift home. cursor stirs */
systems.push({ name:'fluid', role:'cursor stirs', hot:P.star, max:14,
  init:function(){
    this.t = 0;
    var fw = this.fw = Math.ceil(W / 2), fh = this.fh = Math.ceil(H / 2), n = (fw + 2) * (fh + 2);
    this.u = new Float32Array(n); this.v = new Float32Array(n); this.u0 = new Float32Array(n); this.v0 = new Float32Array(n);
    var ns = 3 + Math.floor(rng() * 3), tt = 0.1; this.stirs = [];
    for (var k = 0; k < ns; k++){ var a = rng() * 6.28;
      this.stirs.push({ at:tt, x:(OX + 4 + rng() * (LW - 8)) / 2, y:(OY - 2 + rng() * (LH + 4)) / 2, dx:Math.cos(a), dy:Math.sin(a), s:14 + rng() * 12, r:3 + rng() * 2 });
      tt += 0.9 + rng() * 0.8; }
    this.T1 = tt + 3.2;
    cells.forEach(function(c){ c.vx = 0; c.vy = 0; c.r = 0.5; c.px = c.x; c.py = c.y; });
  },
  IX:function(i, j){ return i + (this.fw + 2) * j; },
  bnd:function(b, x){
    var fw = this.fw, fh = this.fh, IX = this.IX.bind(this), i;
    for (i = 1; i <= fh; i++){ x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)]; x[IX(fw + 1, i)] = b === 1 ? -x[IX(fw, i)] : x[IX(fw, i)]; }
    for (i = 1; i <= fw; i++){ x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)]; x[IX(i, fh + 1)] = b === 2 ? -x[IX(i, fh)] : x[IX(i, fh)]; }
  },
  solve:function(b, x, x0, a, c, iter){
    var fw = this.fw, fh = this.fh, st = fw + 2;
    for (var k = 0; k < iter; k++){
      for (var j = 1; j <= fh; j++) for (var i = 1; i <= fw; i++){ var n = i + st * j; x[n] = (x0[n] + a * (x[n - 1] + x[n + 1] + x[n - st] + x[n + st])) / c; }
      this.bnd(b, x);
    }
  },
  project:function(u, v, p, div){
    var fw = this.fw, fh = this.fh, st = fw + 2, i, j, n;
    for (j = 1; j <= fh; j++) for (i = 1; i <= fw; i++){ n = i + st * j; div[n] = -0.5 * (u[n + 1] - u[n - 1] + v[n + st] - v[n - st]); p[n] = 0; }
    this.bnd(0, div); this.bnd(0, p); this.solve(0, p, div, 1, 4, 10);
    for (j = 1; j <= fh; j++) for (i = 1; i <= fw; i++){ n = i + st * j; u[n] -= 0.5 * (p[n + 1] - p[n - 1]); v[n] -= 0.5 * (p[n + st] - p[n - st]); }
    this.bnd(1, u); this.bnd(2, v);
  },
  advect:function(b, d, d0, u, v, dt){
    var fw = this.fw, fh = this.fh, st = fw + 2;
    for (var j = 1; j <= fh; j++) for (var i = 1; i <= fw; i++){ var n = i + st * j;
      var x = i - dt * u[n], y = j - dt * v[n];
      if (x < 0.5) x = 0.5; if (x > fw + 0.5) x = fw + 0.5; if (y < 0.5) y = 0.5; if (y > fh + 0.5) y = fh + 0.5;
      var i0 = Math.floor(x), j0 = Math.floor(y), s1 = x - i0, t1 = y - j0, s0 = 1 - s1, t0 = 1 - t1;
      d[n] = s0 * (t0 * d0[i0 + st * j0] + t1 * d0[i0 + st * (j0 + 1)]) + s1 * (t0 * d0[i0 + 1 + st * j0] + t1 * d0[i0 + 1 + st * (j0 + 1)]);
    }
    this.bnd(b, d);
  },
  stir:function(x, y, dx, dy, s, r){
    var fw = this.fw, fh = this.fh, st = fw + 2;
    for (var j = Math.max(1, Math.floor(y - r)); j <= Math.min(fh, Math.ceil(y + r)); j++)
      for (var i = Math.max(1, Math.floor(x - r)); i <= Math.min(fw, Math.ceil(x + r)); i++){
        var q = 1 - Math.sqrt((i - x) * (i - x) + (j - y) * (j - y)) / r; if (q <= 0) continue;
        this.u[i + st * j] += dx * s * q; this.v[i + st * j] += dy * s * q;
      }
  },
  sample:function(f, x, y){
    var fw = this.fw, fh = this.fh, st = fw + 2;
    x = Math.max(0.5, Math.min(fw + 0.5, x)); y = Math.max(0.5, Math.min(fh + 0.5, y));
    var i0 = Math.floor(x), j0 = Math.floor(y), s1 = x - i0, t1 = y - j0;
    return (1 - s1) * ((1 - t1) * f[i0 + st * j0] + t1 * f[i0 + st * (j0 + 1)]) + s1 * ((1 - t1) * f[i0 + 1 + st * j0] + t1 * f[i0 + 1 + st * (j0 + 1)]);
  },
  step:function(dt){
    this.t += dt; var t = this.t, i;
    for (i = 0; i < this.stirs.length; i++){ var s = this.stirs[i]; if (!s.done && t >= s.at){ s.done = true; this.stir(s.x, s.y, s.dx, s.dy, s.s, s.r); } }
    if (cursor.inside && cursor.moved){ var sp = Math.sqrt(cursor.vx * cursor.vx + cursor.vy * cursor.vy); if (sp > 1){ var m = Math.min(1, sp / 60) * 4; this.stir(cursor.x / 2, cursor.y / 2, cursor.vx / sp, cursor.vy / sp, m, 2.5); } }
    var u = this.u, v = this.v, u0 = this.u0, v0 = this.v0, n = u.length;
    this.project(u, v, u0, v0);
    u0.set(u); v0.set(v);
    this.advect(1, u, u0, u0, v0, dt); this.advect(2, v, v0, u0, v0, dt);
    this.project(u, v, u0, v0);
    var damp = t < this.T1 ? 0.992 : 0.94;
    for (i = 0; i < n; i++){ u[i] *= damp; v[i] *= damp; }
    var homeK = t < this.T1 ? 1.2 : 40;
    for (i = 0; i < cells.length; i++){ var c = cells[i];
      c.px = c.x; c.py = c.y;
      var fx = this.sample(u, (c.x + 0.5) / 2, (c.y + 0.5) / 2) * 2, fy = this.sample(v, (c.x + 0.5) / 2, (c.y + 0.5) / 2) * 2;
      c.vx += (fx - c.vx) * 0.5; c.vy += (fy - c.vy) * 0.5;
      c.vx += (c.hx - c.x) * homeK * dt; c.vy += (c.hy - c.y) * homeK * dt;
      if (t >= this.T1){ c.vx *= 0.86; c.vy *= 0.86; }
      c.x += c.vx * dt; c.y += c.vy * dt; wallClamp(c, 0);
      c.k = Math.min(0.7, Math.sqrt(c.vx*c.vx + c.vy*c.vy) / 20);
    }
  },
  draw:function(){
    ctx.lineWidth = 0.6; ctx.lineCap = 'round';
    for (var i = 0; i < cells.length; i++){ var c = cells[i]; var col = c.k > 0 ? mixQ(c.col, this.hot, c.k) : c.col;
      var sp = Math.sqrt(c.vx*c.vx + c.vy*c.vy);
      if (sp > 2){ var L = Math.min(3, sp * 0.1); ctx.strokeStyle = mixQ(col, P.star, 0.5); ctx.beginPath(); ctx.moveTo(c.x + 0.5, c.y + 0.5); ctx.lineTo(c.x + 0.5 - c.vx / sp * L, c.y + 0.5 - c.vy / sp * L); ctx.stroke(); }
      drawCell(c, col);
    }
  },
  done:function(){ return this.t > this.T1 + 1 && allHome(0.04); }
});
/* 9. crystal: diffusion-limited aggregation from one seed per letter. cursor melts */
systems.push({ name:'crystal', role:'cursor melts', hot:P.teal, max:18,
  init:function(){
    snapHome();
    this.t = 0; this.acc = 0; this.stuckAt = new Uint8Array(W * H);
    var byLetter = [[], [], [], [], []];
    cells.forEach(function(c){ byLetter[c.letter].push(c); c.stuck = 0; c.seed = 0; c.gx = c.hx; c.gy = c.hy; c.rel = rng() * 1.2; c.flash = 0; c.r = 0; c.vx = 0; c.vy = 0; });
    var sa = this.stuckAt;
    byLetter.forEach(function(list){ var c = list[Math.floor(rng() * list.length)]; c.stuck = 1; c.seed = 1; sa[c.hy * W + c.hx] = 1; });
  },
  canStick:function(c){
    var sa = this.stuckAt;
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++){ if (!dx && !dy) continue;
      var x = c.hx + dx, y = c.hy + dy; if (x < 0 || y < 0 || x >= W || y >= H) continue; if (sa[y * W + x]) return true; }
    return false;
  },
  step:function(dt){
    this.t += dt; this.acc += dt; var t = this.t, i, c;
    if (cursor.inside && cursor.moved && t < this.max - 5){
      for (i = 0; i < cells.length; i++){ c = cells[i]; if (!c.stuck || c.seed) continue;
        var dx = c.hx - cursor.x, dy = c.hy - cursor.y; if (dx*dx + dy*dy < 5){ c.stuck = 0; this.stuckAt[c.hy * W + c.hx] = 0; c.rel = 0; } }
    }
    var p = Math.min(0.92, 0.15 + t * 0.07);
    while (this.acc >= 1 / 40){
      this.acc -= 1 / 40;
      for (i = 0; i < cells.length; i++){ c = cells[i]; if (c.stuck || t < c.rel) continue;
        var atHome = c.gx === c.hx && c.gy === c.hy;
        if (atHome && this.canStick(c)){ c.stuck = 1; this.stuckAt[c.hy * W + c.hx] = 1; c.flash = 1; continue; }
        var r = rng();
        if (!atHome && r < p){ var ddx = c.hx - c.gx, ddy = c.hy - c.gy;
          if (Math.abs(ddx) > Math.abs(ddy) || (Math.abs(ddx) === Math.abs(ddy) && rng() < 0.5)) c.gx += ddx > 0 ? 1 : -1; else c.gy += ddy > 0 ? 1 : -1;
        } else { var d = Math.floor(rng() * 4); if (d === 0) c.gx++; else if (d === 1) c.gx--; else if (d === 2) c.gy++; else c.gy--; }
        c.gx = Math.max(0, Math.min(W - 1, c.gx)); c.gy = Math.max(0, Math.min(H - 1, c.gy));
      }
    }
    for (i = 0; i < cells.length; i++){ c = cells[i];
      if (c.stuck){ c.x = c.hx; c.y = c.hy; c.flash = Math.max(0, c.flash - dt * 3); }
      else { c.x += (c.gx - c.x) * 0.5; c.y += (c.gy - c.y) * 0.5; }
    }
  },
  draw:function(){
    for (var i = 0; i < cells.length; i++){ var c = cells[i];
      if (c.stuck){ ctx.fillStyle = c.flash > 0 ? mixQ(c.col, P.star, c.flash * 0.7) : c.col; ctx.fillRect(c.x, c.y, 1, 1); }
      else { ctx.fillStyle = mixQ(P.teal, P.star, 0.25); ctx.fillRect(c.x + 0.25, c.y + 0.25, 0.5, 0.5); }
    }
  },
  done:function(){ if (this.t < 2) return false; for (var i = 0; i < cells.length; i++) if (!cells[i].stuck || cells[i].flash > 0) return false; return true; }
});
/* ================= scheduler ================= */
var cur = null, curIdx = -1, state = 'run', sysT = 0, holdT = 0, sandbox = false;
var nameEl = document.getElementById('sysname'), roleEl = document.getElementById('sysrole');
function start(i){
  curIdx = i; cur = systems[i]; sysT = 0; state = 'run';
  cells.forEach(function(c){ c.a = 1; c.k = 0; });
  cur.init();
  nameEl.textContent = cur.name; roleEl.textContent = cur.role;
  sound('switch', i);
}
function pick(){ var i; do { i = Math.floor(rng() * systems.length); } while (i === curIdx); start(i); }
function step(){
  var dt = DT, i;
  if (state === 'run'){
    sysT += dt; cur.step(dt);
    if (cur.done()){ snapHome(); state = 'hold'; holdT = 0; }
    else if (sysT > cur.max){ state = 'heal'; holdT = 0; cells.forEach(function(c){ c.a = 1; }); }
  } else if (state === 'heal'){
    holdT += dt;
    for (i = 0; i < cells.length; i++){ var c = cells[i]; homeSpring(c, 40, 0.86, dt); c.r = Math.max(0, c.r - dt); c.k = Math.max(0, c.k - dt); }
    if (allHome(0.03) || holdT > 2.5){ snapHome(); state = 'hold'; holdT = 0; }
  } else {
    holdT += dt;
    for (i = 0; i < cells.length; i++){ var h = cells[i]; repel(h, 5, 220, dt); homeSpring(h, 40, 0.86, dt); h.r = Math.max(0, h.r - dt); }
    if (holdT > HOLD) pick();
  }
}
function paint(){
  ctx.setTransform(S, 0, 0, S, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (state === 'run' && cur.draw) cur.draw(); else drawCells(cur.hot);
}
/* ---------- the secret: type play ---------- */
var typed = '', whisper = document.getElementById('whisper');
window.addEventListener('keydown', function(e){
  if (e.key === ' ' && sandbox){ start(curIdx); e.preventDefault(); return; }
  if (sandbox && e.key >= '1' && e.key <= '9'){ start(parseInt(e.key, 10) - 1); return; }
  if (e.key && e.key.length === 1){ typed = (typed + e.key.toLowerCase()).slice(-4); if (typed === 'play'){ sandbox = !sandbox; whisper.hidden = !sandbox; typed = ''; } }
});
/* ---------- on the sky's clock ---------- */
var lastW = 0, lastH = 0;
function relayout(){
  var bw = box.clientWidth, bh = box.clientHeight, cp = Math.max(5, Math.min(12, Math.floor(bw / 62)));
  if (Math.floor(bw / cp) === lastW && Math.floor(bh / cp) === lastH) return;
  layout(); lastW = W; lastH = H; start(curIdx); paint();
}
window.addEventListener('resize', relayout);
return {
  init:function(){
    layout(); lastW = W; lastH = H; pick();
    /* the box is sized by the character grid, which settles when the web font arrives */
    if (window.ResizeObserver) new ResizeObserver(relayout).observe(box);
  },
  step:function(){ cursorStep(); step(); },
  paint:paint
};
};
