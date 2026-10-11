import { useEffect } from 'react';
import Lenis from 'lenis';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisInstance = null;

/** Smooth scroll (Lenis). Kikapcsol, ha a felhasználó csökkentett mozgást kér. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: { offset: -72 } });
    lenisInstance = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/** Görgetés egy abszolút pozícióra – Lenisszel, ha fut, egyébként natívan. */
export function scrollToY(y) {
  if (lenisInstance) lenisInstance.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
