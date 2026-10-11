import { useEffect, useRef, useState } from 'react';
import { facts } from '../data/content.js';

/**
 * „Tudtad?” kártya: görgetés közben, egy-egy szekcióba érve felugrik
 * egy rövid gluténmentes tény. Mindegyik csak egyszer jelenik meg.
 */
export default function FactToast() {
  const [fact, setFact] = useState(null);
  const [visible, setVisible] = useState(false);
  const shown = useRef(new Set());
  const timer = useRef(0);
  const dismissed = useRef(false);

  useEffect(() => {
    const els = document.querySelectorAll('[data-fact]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const key = e.target.dataset.fact;
          if (!e.isIntersecting || shown.current.has(key) || dismissed.current || !facts[key]) continue;
          shown.current.add(key);
          clearTimeout(timer.current);
          setFact({ key, text: facts[key] });
          setVisible(true);
          timer.current = setTimeout(() => setVisible(false), 7000);
        }
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      clearTimeout(timer.current);
    };
  }, []);

  if (!fact) return null;

  return (
    <aside className={`toast glass glass--deep ${visible ? 'is-in' : ''}`} aria-live="polite" key={fact.key}>
      <span className="toast__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </span>
      <div>
        <p className="toast__title">Tudtad?</p>
        <p className="toast__text">{fact.text}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label="Bezárás, és ne mutasson több tippet"
        onClick={() => {
          dismissed.current = true;
          setVisible(false);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <span className="toast__timer" aria-hidden="true" />
    </aside>
  );
}
