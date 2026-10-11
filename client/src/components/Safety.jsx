import { safety } from '../data/content.js';
import { Rich, Tip } from './Tip.jsx';

export default function Safety() {
  return (
    <section id="mentes" className="section safety" data-fact="mentes">
      <div className="wrap safety__grid">
        <div className="safety__lead">
          <h2 className="display">
            Itt minden gluténmentes.
            <br />A sörtől a tiramisuig.
          </h2>
          <p className="prose">
            Nem egy pizzéria vagyunk, ahol van gluténmentes opció. Az egész hely mentes: a liszt, a
            kemence, a pult és az itallap is. Ha <Tip id="coeliakia">cöliákiás</Tip> vagy, nem kell kérdezgetned, nem kell magyarázkodnod. Ha nem vagy az, csak egy nagyon
            jó nápolyi pizzát eszel – a <Tip id="gluten" /> hiányát nem fogod keresni.
          </p>
          <figure className="safety__photo">
            <img src="/img/peroni.webp" alt="Gluténmentes Peroni sör az asztalon" loading="lazy" width="300" height="720" />
            <figcaption>Gluténmentes sör is van.</figcaption>
          </figure>
        </div>

        <div className="safety__list glass glass--deep">
          <p className="safety__listhead">Amire figyelünk, hogy neked ne kelljen</p>
          <ul>
            {safety.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>
                  <Rich text={s.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
