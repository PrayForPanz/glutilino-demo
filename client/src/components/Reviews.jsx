import { useEffect, useState } from 'react';
import fallback from '../../../shared/reviews.fallback.json';

function Stars({ value = 5, size = 16 }) {
  return (
    <span className="stars" role="img" aria-label={`${String(value).replace('.', ',')} / 5 csillag`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`st-${i}-${fill}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#st-${i}-${fill})`}
              d="M12 2.8l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.1 1.2-6.4-4.7-4.5 6.4-.8z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function GoogleG() {
  return (
    <svg className="gmark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6z" />
    </svg>
  );
}

function Card({ r }) {
  return (
    <article className="review glass">
      <header>
        {r.photo ? (
          <img className="review__avatar" src={r.photo} alt="" referrerPolicy="no-referrer" loading="lazy" />
        ) : (
          <span className="review__avatar" aria-hidden="true">
            {r.author.trim()[0]}
          </span>
        )}
        <div>
          <p className="review__name">
            {r.authorUrl ? (
              <a href={r.authorUrl} target="_blank" rel="noreferrer">
                {r.author}
              </a>
            ) : (
              r.author
            )}
          </p>
          <p className="review__meta">
            <Stars value={r.rating} size={13} /> {r.when}
          </p>
        </div>
        <GoogleG />
      </header>
      <p className="review__text">
        {r.text}
        {r.truncated ? '…' : ''}
      </p>
    </article>
  );
}

export default function Reviews() {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/reviews', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => d?.reviews?.length && setData(d))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const rating = Number(data.rating || 0);
  const writeUrl = data.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(data.placeId)}`
    : null;
  // A végtelen futószalaghoz duplázunk; a második sor képernyőolvasónak rejtett.
  const list = data.reviews;

  return (
    <section id="velemenyek" className="section reviews" data-fact="velemenyek">
      <div className="wrap reviews__head">
        <div className="score">
          <p className="score__num">{rating.toFixed(1).replace('.', ',')}</p>
          <div>
            <Stars value={rating} size={22} />
            <p className="score__label">
              {data.total} Google-vélemény alapján
            </p>
          </div>
        </div>
        <div>
          <h2 className="display">Akik már ettek nálunk</h2>
          <div className="reviews__actions">
            <a className="btn btn--ghost" href={data.mapsUrl} target="_blank" rel="noreferrer">
              Összes vélemény a Google-on
            </a>
            {writeUrl && (
              <a className="btn btn--solid" href={writeUrl} target="_blank" rel="noreferrer">
                Írd meg a véleményed
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="marquee" tabIndex={0} aria-label="Google-vélemények">
        <div className="marquee__track" style={{ '--dur': `${Math.max(40, list.length * 11)}s` }}>
          <div className="marquee__group">
            {list.map((r, i) => (
              <Card key={i} r={r} />
            ))}
          </div>
          <div className="marquee__group" aria-hidden="true">
            {list.map((r, i) => (
              <Card key={i} r={r} />
            ))}
          </div>
        </div>
      </div>
      <p className="wrap reviews__source">
        Vélemények forrása: Google. {data.source === 'google' ? 'Automatikusan frissül.' : ''}
      </p>
    </section>
  );
}
