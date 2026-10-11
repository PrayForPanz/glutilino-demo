import { useRef } from 'react';
import { menu, site } from '../data/content.js';
import { Tip } from './Tip.jsx';

export default function Menu() {
  const rail = useRef(null);
  const step = (dir) => {
    const el = rail.current;
    const card = el.querySelector('.dish');
    const w = card ? card.getBoundingClientRect().width + 20 : 320;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  return (
    <section id="etlap" className="section menu" data-fact="etlap">
      <div className="wrap menu__head">
        <div>
          <h2 className="display">Kedvencek a kemencéből</h2>
          <p className="prose">
            Több mint húszféle nápolyi pizza, panuozzo és saláta. A legtöbb pizzát{' '}
            <Tip id="vegan">vegán sajttal</Tip> is kérheted.
          </p>
        </div>
        <div className="menu__arrows">
          <button type="button" className="iconbtn" onClick={() => step(-1)} aria-label="Előző fogás">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="iconbtn" onClick={() => step(1)} aria-label="Következő fogás">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <ul ref={rail} className="menu__rail" tabIndex={0} aria-label="Kiemelt pizzák">
        {menu.map((d) => (
          <li
            key={d.name}
            className={`dish ${d.featured ? 'dish--featured' : ''} ${d.img ? '' : 'dish--type'} ${d.more ? 'dish--more' : ''}`}
          >
            {d.img && <img src={d.img} alt="" loading="lazy" />}
            <div className="dish__body">
              {d.badge && <span className="dish__badge">{d.badge}</span>}
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              {d.price && <p className="dish__price">{d.price}</p>}
              {d.more && (
                <a className="btn btn--ghost btn--sm" href={site.phoneHref}>
                  Kérdezz a mai kínálatról
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
