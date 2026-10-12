/* VENDE+ · páginas por segmento (12/10/2026): movimento guiado pela rolagem.
   Sem bibliotecas e sem rastreamento. Sem JavaScript, as páginas ficam paradas no estado final. */
(() => {
  'use strict';
  const d = document;
  const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const IO = 'IntersectionObserver' in window;
  const ease = p => 1 - Math.pow(1 - p, 3);
  const brl = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const watch = (els, fn, opts) => {
    if (!IO) return null;
    const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts);
    els.forEach(el => el && io.observe(el));
    return io;
  };
  const tween = (from, to, dur, fn) => {
    if (RM) { fn(to); return; }
    const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur); fn(from + (to - from) * ease(p)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* 1. Título do hero: uma palavra de cada vez */
  const h1 = d.querySelector('.hero h1');
  if (h1 && !RM) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.textContent = '';
    words.forEach((w, i) => {
      const s = d.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i); s.textContent = w;
      h1.appendChild(s); if (i < words.length - 1) h1.appendChild(d.createTextNode(' '));
    });
  }

  /* 2. A câmera: a tela do hero começa inclinada e se endireita conforme a rolagem */
  const shot = d.querySelector('.shot-wrap .shot');
  if (shot && !RM) {
    let tick = 0;
    const update = () => {
      tick = 0;
      const r = shot.getBoundingClientRect(), vh = innerHeight || 800;
      const sp = Math.min(1, Math.max(0, (r.top - vh * 0.22) / (vh * 0.5)));
      shot.style.setProperty('--sp', sp.toFixed(3));
    };
    const onScroll = () => { if (!tick) tick = requestAnimationFrame(update); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  } else if (shot) shot.style.setProperty('--sp', '0');

  /* 3. Avisos que rodam por cima da tela */
  const notes = [...d.querySelectorAll('.vs-notes .nt')];
  const wrap = d.querySelector('.shot-wrap');
  if (notes.length && !RM) {
    let i = 0, timer = 0, visible = true;
    const show = () => notes.forEach((n, k) => { n.dataset.p = String((i - k + notes.length) % notes.length); });
    const play = () => { if (!timer) timer = setInterval(() => { i = (i + 1) % notes.length; show(); }, 2600); };
    const pause = () => { clearInterval(timer); timer = 0; };
    show();
    if (IO) watch([wrap], e => { visible = e.isIntersecting; visible ? play() : pause(); }, { threshold: 0.1 });
    else play();
    d.addEventListener('visibilitychange', () => { d.hidden ? pause() : (visible && play()); });
  } else if (notes.length) notes.forEach((n, k) => { n.dataset.p = String(k); });

  /* 4. Revelar ao rolar */
  const reveal = [...d.querySelectorAll('[data-r]')];
  if (!IO || RM) reveal.forEach(el => el.classList.add('in'));
  else watch(reveal, (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  /* 5. Preço que conta */
  const price = d.querySelector('.price .v[data-price]');
  if (price) {
    const n = price.querySelector('.n'), to = +price.dataset.price;
    if (n && IO && !RM) {
      n.textContent = brl(0);
      watch([price], (e, io) => { if (!e.isIntersecting) return; tween(0, to, 1300, v => { n.textContent = brl(v); }); io.unobserve(price); }, { threshold: 0.5 });
    }
  }

  /* 6. Telas acompanham o mouse (só com ponteiro fino) */
  if (!RM && matchMedia('(pointer: fine)').matches) {
    d.querySelectorAll('.figure').forEach(f => {
      f.addEventListener('pointerenter', () => { if (f.classList.contains('in')) f.classList.add('tilt'); });
      f.addEventListener('pointermove', ev => {
        if (!f.classList.contains('tilt')) return;
        const r = f.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        f.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        f.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
      });
      f.addEventListener('pointerleave', () => { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
    });
  }
})();
