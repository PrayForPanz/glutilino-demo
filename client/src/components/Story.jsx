import { story } from '../data/content.js';

export default function Story() {
  return (
    <section id="rolunk" className="section story" data-fact="rolunk">
      <div className="wrap story__grid">
        <figure className="story__photo">
          <img src="/img/oven.webp" alt="Alex a rézmozaikos kemence mellett a glutiliNO konyhájában" loading="lazy" />
        </figure>

        <div className="story__text">
          <blockquote className="story__quote">
            <p>„{story.quote}”</p>
            <footer>
              <strong>{story.author}</strong>, {story.role}
            </footer>
          </blockquote>
          {story.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="prose">
              {p}
            </p>
          ))}

          <aside className="award glass">
            <svg className="award__mark" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="21" />
              <path d="M24 12l3.5 7.2 7.9 1.1-5.7 5.6 1.4 7.9L24 30.1l-7.1 3.7 1.4-7.9-5.7-5.6 7.9-1.1z" />
            </svg>
            <div>
              <p className="award__title">50 Top Pizza Europe 2026 – Excellent Pizzerias</p>
              <p className="award__text">
                A hagyományos pizzériák között szerepelünk, külön gluténmentes kategória nélkül.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
