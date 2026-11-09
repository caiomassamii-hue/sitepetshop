/* Joca Burguer — main.js (sem dependências) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no footer ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu mobile (off-canvas) ---------- */
  var burger = $('.burger'), panel = $('#offcanvas');
  if (burger && panel) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      panel.classList.toggle('is-open', open);
    };
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 992) setMenu(false); });
  }

  /* ---------- Carrossel de fade (hero) ---------- */
  $$('[data-slider]').forEach(function (root) {
    var slides = $$('.slide', root), i = 0, timer;
    if (slides.length < 2) return;
    var go = function (n) {
      slides[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
    };
    var play = function () {
      var ms = +root.dataset.autoplay;
      if (!ms || reduceMotion) return;
      stop(); timer = setInterval(function () { go(i + 1); }, ms);
    };
    var stop = function () { clearInterval(timer); };
    $('[data-prev]', root).addEventListener('click', function () { go(i - 1); play(); });
    $('[data-next]', root).addEventListener('click', function () { go(i + 1); play(); });
    root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop); root.addEventListener('focusout', play);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    play();
  });

  /* ---------- Depoimentos (troca com dots) ---------- */
  $$('[data-quotes]').forEach(function (root) {
    var quotes = $$('.quote', root), dotsBox = $('[data-qdots]', root);
    if (!dotsBox) return;
    var dots = quotes.map(function (_, n) {
      var b = document.createElement('button');
      b.className = 'dot' + (n === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', 'Depoimento ' + (n + 1));
      b.addEventListener('click', function () {
        quotes.forEach(function (q, k) { q.classList.toggle('is-active', k === n); dots[k].classList.toggle('is-active', k === n); });
      });
      dotsBox.appendChild(b);
      return b;
    });
  });

  /* ---------- Carrossel de equipe (scroll-snap + dots) ---------- */
  var track = $('[data-track]'), tdots = $('[data-dots]');
  if (track && tdots) {
    var cards = $$('.member', track), dotEls = [];
    var perView = function () { return Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth)); };
    var build = function () {
      tdots.innerHTML = ''; dotEls = [];
      var pages = Math.max(1, cards.length - perView() + 1);
      if (pages < 2) return;
      for (var n = 0; n < pages; n++) (function (n) {
        var b = document.createElement('button');
        b.className = 'dot'; b.setAttribute('aria-label', 'Ir para o membro ' + (n + 1));
        b.addEventListener('click', function () { track.scrollTo({ left: cards[n].offsetLeft - cards[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' }); });
        tdots.appendChild(b); dotEls.push(b);
      })(n);
      sync();
    };
    var sync = function () {
      if (!dotEls.length) return;
      var idx = 0, best = Infinity;
      cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft - cards[0].offsetLeft - track.scrollLeft); if (d < best) { best = d; idx = k; } });
      idx = Math.min(idx, dotEls.length - 1);
      dotEls.forEach(function (d, k) { d.classList.toggle('is-active', k === idx); });
    };
    track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      var step = cards[0].offsetWidth + 30;
      if (e.key === 'ArrowRight') { track.scrollBy({ left: step, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { track.scrollBy({ left: -step, behavior: 'smooth' }); e.preventDefault(); }
    });
    window.addEventListener('resize', build);
    build();
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Parallax leve no hero + voltar ao topo ---------- */
  var par = $$('[data-parallax]'), totop = $('.totop'), ticking = false;
  var onScroll = function () {
    var y = window.scrollY;
    if (totop) totop.classList.toggle('is-shown', y > 600);
    if (!reduceMotion && y < 900) par.forEach(function (img) { img.style.transform = 'translateY(' + (-y * 0.06).toFixed(1) + 'px)'; });
    ticking = false;
  };
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Formulário: validação + WhatsApp ---------- */
  $$('form[data-whatsapp]').forEach(function (form) {
    var fields = $$('.field', form);
    var valid = function (input) {
      if (!input || !input.required) return true;
      var v = input.value.trim();
      if (!v) return false;
      if (input.type === 'tel') return v.replace(/\D/g, '').length >= 10;
      return true;
    };
    var check = function (f) {
      var ok = valid($('input, select, textarea', f));
      f.classList.toggle('has-error', !ok);
      return ok;
    };
    fields.forEach(function (f) {
      var inp = $('input, select, textarea', f);
      inp.addEventListener('blur', function () { check(f); });
      inp.addEventListener('input', function () { if (f.classList.contains('has-error')) check(f); });
    });
    var dateEl = $('input[type="date"]', form);
    if (dateEl) dateEl.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) { $('input, select, textarea', firstBad).focus(); return; }
      var d = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var dateTxt = d('data') ? d('data').split('-').reverse().join('/') : '';
      var lines = [
        'Olá! Gostaria de agendar:',
        'Serviço: ' + d('servico'),
        'Pet: ' + d('pet'),
        dateTxt && 'Data preferida: ' + dateTxt,
        'Nome: ' + d('nome'),
        'Telefone: ' + d('tel'),
        d('msg') && 'Obs.: ' + d('msg')
      ].filter(Boolean);
      var url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
      var ok = $('.form-ok', form); if (ok) ok.classList.add('is-shown');
      form.reset();
    });
  });
})();
