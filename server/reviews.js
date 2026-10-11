import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Google-vélemények a Places API (New) segítségével.
 *  - GOOGLE_PLACES_API_KEY  kötelező az élő adatokhoz
 *  - GOOGLE_PLACE_ID        opcionális; ha hiányzik, név + cím alapján egyszer megkeressük
 * Az eredményt memóriában cache-eljük (alapból 6 óra). Hiba esetén a tartalék lista megy ki.
 * Megjegyzés: a Places API helyenként legfeljebb 5 véleményt ad vissza.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FALLBACK = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../shared/reviews.fallback.json'), 'utf8'),
);

const TTL = (Number(process.env.REVIEWS_CACHE_HOURS) || 6) * 3600 * 1000;
const SEARCH_QUERY = 'glutiliNO Kézműves Gluténmentes Pizzéria és Pékség, Budapest, Párkány u. 8, 1138';

let cache = { at: 0, data: null };
let inflight = null;
let resolvedPlaceId = process.env.GOOGLE_PLACE_ID || null;

async function findPlaceId(key) {
  const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName',
    },
    body: JSON.stringify({ textQuery: SEARCH_QUERY, languageCode: 'hu', regionCode: 'HU' }),
  });
  if (!r.ok) throw new Error(`searchText ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const id = j.places?.[0]?.id;
  if (!id) throw new Error('Nem található a hely a Places API-ban');
  console.log(`  ✓ Google Place ID: ${id} (${j.places[0].displayName?.text}) – érdemes GOOGLE_PLACE_ID-ként elmenteni`);
  return id;
}

async function fetchLive() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;
  if (!resolvedPlaceId) resolvedPlaceId = await findPlaceId(key);

  const r = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(resolvedPlaceId)}?languageCode=hu&regionCode=HU`,
    {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
    },
  );
  if (!r.ok) throw new Error(`places.get ${r.status}: ${await r.text()}`);
  const p = await r.json();

  const reviews = (p.reviews || [])
    .filter((rv) => (rv.rating ?? 0) >= Number(process.env.REVIEWS_MIN_RATING || 4))
    .map((rv) => ({
      author: rv.authorAttribution?.displayName || 'Google-felhasználó',
      authorUrl: rv.authorAttribution?.uri || null,
      photo: rv.authorAttribution?.photoUri || null,
      rating: rv.rating,
      when: rv.relativePublishTimeDescription || '',
      text: rv.text?.text || rv.originalText?.text || '',
      truncated: false,
    }))
    .filter((rv) => rv.text);

  return {
    source: 'google',
    name: p.displayName?.text || FALLBACK.name,
    rating: p.rating ?? FALLBACK.rating,
    total: p.userRatingCount ?? FALLBACK.total,
    mapsUrl: p.googleMapsUri || FALLBACK.mapsUrl,
    placeId: p.id || resolvedPlaceId,
    // ha a Google kevesebb szöveges véleményt ad, a tartalékkal töltjük fel
    reviews: reviews.length >= 3 ? reviews : [...reviews, ...FALLBACK.reviews].slice(0, 6),
  };
}

export async function getReviews() {
  if (cache.data && Date.now() - cache.at < TTL) return cache.data;
  if (!inflight) {
    inflight = fetchLive()
      .then((data) => {
        if (data) cache = { at: Date.now(), data };
        return data;
      })
      .catch((err) => {
        console.warn('  ⚠ Google-vélemények lekérése sikertelen:', err.message);
        cache = { at: Date.now() - TTL + 5 * 60 * 1000, data: cache.data }; // 5 perc múlva újrapróbáljuk
        return null;
      })
      .finally(() => {
        inflight = null;
      });
  }
  const data = await inflight;
  return data || cache.data || FALLBACK;
}
