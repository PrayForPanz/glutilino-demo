import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useSmoothScroll.js';

/**
 * Lisztpor a háttérben: lassan szálló, mélységgel rendelkező részecskék.
 * Görgetéskor „felkavarodnak”, az egér finoman elfújja őket.
 */
export default function FlourParticles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    // Puha korong sprite – egyszer rajzoljuk ki, utána csak skálázzuk
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const s = sprite.getContext('2d');
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(244,239,230,1)');
    g.addColorStop(0.35, 'rgba(244,239,230,0.55)');
    g.addColorStop(1, 'rgba(244,239,230,0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    let w = 0, h = 0, parts = [], raf = 0, running = true;
    const mouse = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY;
    let kick = 0;

    const make = (randomY = true) => {
      const z = Math.pow(Math.random(), 1.6) * 0.85 + 0.15; // mélység: sok apró, kevés közeli
      const bokeh = Math.random() < 0.06;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -10,
        z,
        r: bokeh ? 6 + Math.random() * 10 : 0.6 + z * 2.4,
        a: bokeh ? 0.05 + Math.random() * 0.06 : 0.18 + z * 0.5,
        vx: 0,
        vy: 0,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 0.8,
      };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = reduced ? 40 : Math.round(Math.min(170, (w * h) / 8500));
      while (parts.length < target) parts.push(make());
      parts.length = target;
    };

    const onScroll = () => {
      const y = window.scrollY;
      kick += (y - lastScroll) * 0.012;
      kick = Math.max(-6, Math.min(6, kick));
      lastScroll = y;
    };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
    };

    let t0 = performance.now();
    const tick = (now) => {
      if (!running) return;
      const dt = Math.min(48, now - t0) / 16.67;
      t0 = now;
      ctx.clearRect(0, 0, w, h);
      kick *= 0.92;

      for (const p of parts) {
        if (!reduced) {
          const sway = Math.sin(now * 0.00035 * p.sp + p.ph) * 0.25;
          p.vx += (sway * p.z - p.vx) * 0.04;
          p.vy += (0.12 * p.z * p.sp - p.vy) * 0.03;
          p.vy -= kick * p.z * 0.06; // görgetés felkavarja

          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 140) * 0.9 * p.z;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (p.y > h + 20) Object.assign(p, make(false));
          if (p.y < -30) p.y = h + 10;
          if (p.x < -20) p.x = w + 10;
          if (p.x > w + 20) p.x = -10;
        }
        const size = p.r * 2;
        ctx.globalAlpha = p.a;
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, size, size);
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="flour" aria-hidden="true" />;
}
