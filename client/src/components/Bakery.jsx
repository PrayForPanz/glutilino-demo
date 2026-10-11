import { bakery } from '../data/content.js';

export default function Bakery() {
  return (
    <section id="pekseg" className="section bakery" data-fact="pekseg">
      <div className="wrap bakery__head">
        <h2 className="display">Pékség a pizzéria mellett</h2>
        <p className="prose">
          Kenyér, kakaós csiga, brownie, tiramisu. Mind ugyanabban a mentes konyhában készül, mint a
          pizza – a kenyeret haza is viheted.
        </p>
      </div>
      <ul className="wrap bento">
        {bakery.map((b) => (
          <li key={b.name} className={`bento__item ${b.size ? `bento__item--${b.size}` : ''}`}>
            <img src={b.img} alt={b.name} loading="lazy" />
            <div className="bento__cap glass">
              <strong>{b.name}</strong>
              <span>{b.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
