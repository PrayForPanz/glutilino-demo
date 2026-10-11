import { useEffect, useState } from 'react';
import { nav, site } from '../data/content.js';
import Wordmark from './Wordmark.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('.scrolly');
      const end = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 400;
      setSolid(window.scrollY > end - 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__bar glass">
        <a href="#top" className="nav__logo" onClick={() => setOpen(false)} aria-label="glutiliNO – vissza az elejére">
          <Wordmark />
        </a>
        <nav aria-label="Fő navigáció">
          <ul className="nav__links" id="nav-links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--solid btn--sm nav__cta" href={site.phoneHref}>
          {site.phoneDisplay}
        </a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
