/* O Encontro · comportamento próprio da página.
   O motor (scrollcraft.js) dirige cues, parallax, revelações e pins.
   Aqui ficam as peças autorais: a luz da janela que move as sombras,
   a abertura do convite, o encontro dos círculos, o sol que atravessa
   o fim de semana e o jardim vivo do fechamento. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = matchMedia('(max-width: 860px)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var ease = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  // No celular, seções densas viram fluxo normal (sem pin), para caber na tela.
  if (mobile) {
    $$('[data-js="what"], [data-js="days"]').forEach(function (s) {
      s.setAttribute('data-sc-act', 'flow'); s.removeAttribute('data-sc-span');
      $$('[data-sc-cue]', s).forEach(function (c) { c.removeAttribute('data-sc-cue'); c.style.opacity = 1; });
    });
  }

  var sc = window.ScrollCraft.mount(document);
  var P = function (el) { return el ? (parseFloat(el.style.getPropertyValue('--sc-p')) || 0) : 0; };

  /* -------- assinatura: a luz da janela ------------------------------ */
  var root = document.documentElement, tx = 0, ty = 0, lx = 0, ly = 0;
  if (fine && !reduce) {
    addEventListener('pointermove', function (e) {
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* -------- elementos ------------------------------------------------ */
  var hero = $('[data-js="hero"]'), card = $('[data-js="card"]'), env = $('[data-js="env"]');
  var eTL = $('[data-js="euc-tl"]'), eBR = $('[data-js="euc-br"]');
  var what = $('[data-js="what"]');
  var vA = $('[data-js="venn-a"]'), vAc = $('[data-js="venn-a-clip"]'), vB = $('[data-js="venn-b"]');
  var vG = $('[data-js="venn-glow"]'), vD = $('[data-js="venn-dot"]');
  var days = $('[data-js="days"]'), sun = $('[data-js="sun"]'), arcBase = $('[data-js="arc-base"]'), arcDraw = $('[data-js="arc-draw"]');
  var cols = $$('[data-js="col"]');
  var garden = $('[data-js="garden"]'), gBg = $('[data-js="g-bg"]'), gFore = $('[data-js="g-fore"]');
  var bar = $('#bar');
  var arcLen = arcDraw ? arcDraw.getTotalLength() : 0;
  if (arcDraw) { arcDraw.style.strokeDasharray = arcLen; arcDraw.style.strokeDashoffset = arcLen; }

  function frame() {
    // luz suavizada
    lx = lerp(lx, tx, 0.06); ly = lerp(ly, ty, 0.06);
    root.style.setProperty('--lx', lx.toFixed(4));
    root.style.setProperty('--ly', ly.toFixed(4));

    // 01 · o convite se abre: o cartão sobe, o envelope desce, o eucalipto se afasta
    if (hero && !reduce) {
      var h = ease(P(hero) / 0.92) * (mobile ? 0.55 : 1);
      card.style.transform = 'translate3d(' + (lx * 10).toFixed(1) + 'px,' + (-h * 9 + ly * 0.6).toFixed(2) + 'vh,0) scale(' + (1 + h * 0.05).toFixed(4) + ') rotate(' + (h * 1.4).toFixed(2) + 'deg)';
      env.style.transform = 'translate3d(' + (lx * 4).toFixed(1) + 'px,' + (h * 16).toFixed(2) + 'vh,0) rotate(' + (h * 4).toFixed(2) + 'deg)';
      eTL.style.transform = 'translate3d(' + (-h * 14 + lx * 1.4).toFixed(2) + 'vw,' + (-h * 16 + ly * 1.2).toFixed(2) + 'vh,0) rotate(' + (-h * 8).toFixed(2) + 'deg)';
      eBR.style.transform = 'translate3d(' + (h * 12 + lx * 1.8).toFixed(2) + 'vw,' + (h * 18 + ly * 1.4).toFixed(2) + 'vh,0) rotate(' + (h * 6).toFixed(2) + 'deg)';
    }

    // 05 · os dois círculos se encontram
    if (what && vA && !mobile) {
      var w = ease((P(what) - 0.02) / 0.6);
      var dx = lerp(150, 52, w);
      vA.setAttribute('cx', 260 - dx); vAc.setAttribute('cx', 260 - dx);
      vB.setAttribute('cx', 260 + dx); vG.setAttribute('cx', 260 + dx);
      vG.setAttribute('opacity', (w * 0.95).toFixed(3));
      vD.setAttribute('opacity', ease((w - 0.7) / 0.3).toFixed(3));
    }

    // 07 · o sol atravessa o fim de semana
    if (days && sun && !mobile) {
      var d = clamp((P(days) - 0.04) / 0.86, 0, 1);
      var pt = arcDraw.getPointAtLength(d * arcLen);
      var svg = arcDraw.ownerSVGElement, r = svg.getBoundingClientRect(), st = svg.parentNode.getBoundingClientRect();
      var vb = svg.viewBox.baseVal;
      var sx = r.left - st.left + pt.x / vb.width * r.width, sy = r.top - st.top + pt.y / vb.height * r.height;
      sun.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
      arcDraw.style.strokeDashoffset = (arcLen * (1 - d)).toFixed(1);
      var idx = Math.min(3, Math.floor(d * 4 + 0.0001));
      cols.forEach(function (c, i) { c.style.setProperty('--on', i === idx ? 1 : (i < idx ? 0.72 : 0.5)); });
    }

    // 11 · jardim: a câmera assenta, o galho de primeiro plano se afasta
    if (garden && !reduce) {
      var g = ease(P(garden) / 0.8);
      gBg.style.setProperty('--gz', (1.16 - g * 0.1).toFixed(4));
      gFore.style.setProperty('--gf', (-g * 9).toFixed(2) + 'vh');
    }

    // barra: some sobre o convite, aparece depois; clareia sobre o malva
    if (bar) {
      var y = scrollY;
      bar.classList.toggle('is-hidden', y < innerHeight * 0.6);
      bar.classList.toggle('is-solid', y >= innerHeight * 0.6);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* -------- jardim vivo: pólen e pétalas ------------------------------ */
  var cv = $('[data-js="g-fx"]');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), W = 0, H = 0, running = false;
    var pollen = [], petals = [];
    function size() {
      var b = cv.getBoundingClientRect(); W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function mkPollen(init) {
      return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: 0.8 + Math.random() * 2.2,
        vy: -(0.08 + Math.random() * 0.28), ph: Math.random() * 6.28, sp: 0.004 + Math.random() * 0.01, a: 0.25 + Math.random() * 0.55 };
    }
    function mkPetal(init) {
      return { x: Math.random() * W * 1.1 - W * 0.05, y: init ? Math.random() * H : -30 - Math.random() * 120,
        s: 7 + Math.random() * 9, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.03,
        vy: 0.35 + Math.random() * 0.55, ph: Math.random() * 6.28, sw: 0.6 + Math.random() * 1.1,
        flip: Math.random() * 6.28, vf: 0.02 + Math.random() * 0.03, tone: Math.random() };
    }
    function petal(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
      var s = p.s, g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, p.tone > 0.5 ? 'rgba(251,236,236,.95)' : 'rgba(247,228,228,.95)');
      g.addColorStop(1, p.tone > 0.5 ? 'rgba(222,170,182,.9)' : 'rgba(214,160,174,.9)');
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s); ctx.fill();
      ctx.strokeStyle = 'rgba(176,120,134,.25)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.restore();
    }
    function init() {
      size(); pollen = []; petals = [];
      var area = W * H / (1440 * 900);
      for (var i = 0; i < Math.round(70 * area + 20); i++) pollen.push(mkPollen(true));
      for (var j = 0; j < Math.round(16 * area + 8); j++) petals.push(mkPetal(true));
    }
    var t = 0;
    function draw() {
      if (!running) return;
      t++; ctx.clearRect(0, 0, W, H);
      var wind = Math.sin(t * 0.004) * 0.5 + 0.35 + lx * 0.4;
      for (var i = 0; i < pollen.length; i++) {
        var q = pollen[i]; q.ph += q.sp; q.y += q.vy; q.x += Math.sin(q.ph) * 0.25 + wind * 0.15;
        if (q.y < -10 || q.x > W + 10) { pollen[i] = mkPollen(false); continue; }
        var tw = 0.6 + 0.4 * Math.sin(q.ph * 2.3);
        var rg = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 3.2);
        rg.addColorStop(0, 'rgba(255,248,236,' + (q.a * tw).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,248,236,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * 3.2, 0, 6.283); ctx.fill();
      }
      for (var j = 0; j < petals.length; j++) {
        var p = petals[j]; p.ph += 0.012; p.flip += p.vf; p.rot += p.vr;
        p.y += p.vy; p.x += Math.sin(p.ph) * p.sw + wind * 0.9;
        if (p.y > H + 30 || p.x > W + 40) { petals[j] = mkPetal(false); continue; }
        petal(p);
      }
      requestAnimationFrame(draw);
    }
    init();
    addEventListener('resize', function () { init(); }, { passive: true });
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { var was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(draw); });
    }, { threshold: 0 }).observe(garden);
  }
})();
