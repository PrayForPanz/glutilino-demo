import { useEffect, useRef, useState } from 'react';
import { chapters, site } from '../data/content.js';
import { prefersReducedMotion, scrollToY } from '../hooks/useSmoothScroll.js';
import Wordmark from './Wordmark.jsx';

const FRAMES = 240; // 10 mp × 24 fps
const frameSrc = (i) => `/frames/f_${String(i + 1).padStart(3, '0')}.webp`;
const VIDEO_W = 1280;
const VIDEO_H = 720;
const OUTRO = 0.96; // ennyi görgetés után áll meg a videó az utolsó kockán
const N = chapters.length;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Görgetési arány -> fejezet, fejezeten belüli arány, videóidő (0–1). */
function scene(p) {
  const q = clamp(p / OUTRO);
  const f = q * N;
  const i = Math.min(N - 1, Math.floor(f));
  const local = q >= 1 ? 1 : f - i;
  const ch = chapters[i];
  return { i, local, t: ch.from + (ch.to - ch.from) * local };
}

export default function ScrollyHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const panelRef = useRef(null);
  const tipRef = useRef(null);
  const railRef = useRef(null);
  const barRef = useRef(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const reduced = prefersReducedMotion();

    // ---- Képkockák betöltése: durvától a finomig, hogy a görgetés azonnal működjön
    const imgs = new Array(FRAMES);
    const loaded = new Uint8Array(FRAMES);
    const order = [];
    const seen = new Set();
    for (const step of [30, 15, 8, 4, 2, 1]) {
      for (let i = 0; i < FRAMES; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
    }
    if (!seen.has(FRAMES - 1)) order.splice(1, 0, FRAMES - 1);
    let cursor = 0;
    let alive = true;
    let dirty = true;
    const pump = () => {
      if (!alive || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(i);
      const done = () => {
        if (!alive) return;
        imgs[i] = img;
        loaded[i] = 1;
        dirty = true;
        if (i === 0) setReady(true);
        pump();
      };
      img.decode().then(done, () => pump());
    };
    for (let k = 0; k < 6; k++) pump();

    const nearest = (i) => {
      for (let d = 0; d < FRAMES; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d;
        if (i + d < FRAMES && loaded[i + d]) return i + d;
      }
      return -1;
    };

    // ---- Méretezés (cover)
    let cw = 0, chh = 0, dpr = 1, cover = { s: 1, x: 0, y: 0 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = canvas.clientWidth;
      chh = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(chh * dpr);
      const s = Math.max(cw / VIDEO_W, chh / VIDEO_H);
      cover = { s, x: (cw - VIDEO_W * s) / 2, y: (chh - VIDEO_H * s) / 2 };
      dirty = true;
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- Görgetés -> állapot
    const progress = () => {
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? clamp(-r.top / span) : 0;
    };

    let cur = progress();
    let lastFrame = -1;
    let lastActive = -1;
    let visible = true;
    let raf = 0;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(section);

    function tick() {
      if (!alive || !visible) return;
      const target = progress();
      cur = reduced ? target : cur + (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.0002) cur = target;

      const { i, local, t } = scene(cur);
      const fi = Math.round(t * (FRAMES - 1));
      const show = nearest(fi);

      if (show >= 0 && (show !== lastFrame || dirty)) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(imgs[show], cover.x, cover.y, VIDEO_W * cover.s, VIDEO_H * cover.s);
        lastFrame = show;
        dirty = false;
      }

      if (i !== lastActive) {
        lastActive = i;
        setActive(i);
      }

      // Intro címsor kifakul, a fejezetpanel beúszik
      const introOut = smooth(0, 0.045, cur);
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - introOut);
        introRef.current.style.transform = `translate3d(0, ${-introOut * 60}px, 0)`;
        introRef.current.style.visibility = introOut >= 1 ? 'hidden' : 'visible';
      }
      if (panelRef.current) {
        const pin = smooth(0.03, 0.065, cur);
        panelRef.current.style.opacity = String(pin);
        panelRef.current.style.transform = `translate3d(0, ${(1 - pin) * 30}px, 0)`;
      }

      // Felugró tooltip a videókockán, a fejezet közepén
      const tip = tipRef.current;
      if (tip) {
        const on = cur > 0.04 && local > 0.14 && local < 0.88;
        tip.dataset.show = on ? '1' : '0';
        const pinPt = chapters[i].pin;
        let px = cover.x + pinPt.x * VIDEO_W * cover.s;
        let py = cover.y + pinPt.y * VIDEO_H * cover.s;
        px = clamp(px, 28, cw - 28);
        py = clamp(py, 110, chh - 260);
        const flip = px > cw * 0.58;
        tip.dataset.flip = flip ? '1' : '0';
        tip.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }

      const q = clamp(cur / OUTRO);
      if (railRef.current) railRef.current.style.setProperty('--q', q.toFixed(4));
      if (barRef.current) barRef.current.style.transform = `scaleX(${q.toFixed(4)})`;

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const goTo = (i) => {
    const s = sectionRef.current;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const span = s.offsetHeight - window.innerHeight;
    scrollToY(top + span * OUTRO * ((i + 0.5) / N));
  };

  const ch = chapters[active];
  const last = active === N - 1;

  return (
    <section id="top" ref={sectionRef} className="scrolly" aria-label="Bemutatkozó videó: így készül nálunk">
      <div className="scrolly__stage">
        <canvas
          ref={canvasRef}
          className={`scrolly__canvas ${ready ? 'is-ready' : ''}`}
          role="img"
          aria-label="Kemencében sülő pizza, friss kenyerek, bruschetta, olasz felvágottak és a rézmozaikos kemence a glutiliNO konyhájában."
        />
        <div className="scrolly__shade" aria-hidden="true" />

        <div ref={introRef} className="intro">
          <p className="intro__kicker">Kézműves gluténmentes pizzéria és pékség, Budapest XIII.</p>
          <h1 className="intro__title">
            <Wordmark />
          </h1>
          <p className="intro__lede">Nápolyi pizza glutén nélkül. Kompromisszum nélkül.</p>
          <p className="intro__hint" aria-hidden="true">
            <span className="intro__mouse" />
            Görgess, és nézz be a konyhába
          </p>
        </div>

        <div ref={tipRef} className="poptip" data-show="0" data-flip="0" role="status" aria-live="polite">
          <span className="poptip__dot" aria-hidden="true" />
          <span className="poptip__line" aria-hidden="true" />
          <div className="poptip__card glass" key={ch.id}>
            <p className="poptip__title">{ch.tip.title}</p>
            <p className="poptip__body">{ch.tip.body}</p>
          </div>
        </div>

        <div ref={panelRef} className="chapter glass" style={{ opacity: 0 }}>
          <div className="chapter__inner" key={ch.id}>
            <h2 className="chapter__title">{ch.title}</h2>
            <p className="chapter__text">{ch.text}</p>
            {last && (
              <div className="chapter__cta">
                <a className="btn btn--solid" href="#etlap">Mutasd az étlapot</a>
                <a className="btn btn--ghost" href={site.directions} target="_blank" rel="noreferrer">
                  Útvonaltervezés
                </a>
              </div>
            )}
          </div>
        </div>

        <nav ref={railRef} className="rail" aria-label="Videó fejezetei">
          <span className="rail__track" aria-hidden="true">
            <span className="rail__fill" />
          </span>
          <ol>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={i === active ? 'is-active' : ''}
                  aria-current={i === active ? 'step' : undefined}
                  onClick={() => goTo(i)}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <span className="scrolly__bar" aria-hidden="true">
          <span ref={barRef} />
        </span>
      </div>
    </section>
  );
}
