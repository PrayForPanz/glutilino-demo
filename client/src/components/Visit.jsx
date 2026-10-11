import { site } from '../data/content.js';

export default function Visit() {
  return (
    <section id="latogatas" className="section visit" data-fact="latogatas">
      <div className="wrap visit__grid">
        <div className="visit__card glass glass--deep">
          <h2 className="display">Gyere el, a kemence már ég.</h2>
          <dl className="visit__facts">
            <div>
              <dt>Cím</dt>
              <dd>
                {site.address}
                <br />
                <span className="muted">az Esztergomi út közelében, {site.district}</span>
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </dd>
            </div>
            <div>
              <dt>Nyitvatartás</dt>
              <dd>
                {site.opening}
                <br />
                <span className="muted">A pontos, aktuális nyitvatartást a Google Térképen frissítjük.</span>
              </dd>
            </div>
            <div>
              <dt>Átlagos költés</dt>
              <dd>{site.priceRange}</dd>
            </div>
          </dl>
          <div className="visit__cta">
            <a className="btn btn--solid" href={site.directions} target="_blank" rel="noreferrer">
              Útvonaltervezés
            </a>
            <a className="btn btn--ghost" href={site.phoneHref}>
              Hívás
            </a>
          </div>
        </div>

        <div className="visit__media">
          <div className="visit__map">
            <iframe
              title="glutiliNO a térképen – Budapest, Párkány u. 8."
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <img className="visit__front" src="/img/storefront.webp" alt="A glutiliNO bejárata a Párkány utcában" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
