# glutiliNO – weboldal

Kézműves gluténmentes pizzéria és pékség, Budapest XIII. React (Vite) frontend, Node.js (Express) backend.

## Indítás

```bash
npm install
cp .env.example .env      # opcionális: Google Places API kulcs az élő véleményekhez
npm run dev               # http://localhost:5173  (Vite + API szerver együtt)
```

Éles build és futtatás:

```bash
npm run build
npm start                 # http://localhost:8787  (Express szolgálja ki a dist/ mappát és az /api-t)
```

Node 18.17+ kell (a beépített `fetch` miatt).

## Mi hol van

| Útvonal | Tartalom |
| --- | --- |
| `client/src/data/content.js` | **Minden szöveg, ár, cím, fejezet, tooltip és „Tudtad?” tény** – itt kell szerkeszteni |
| `client/src/components/ScrollyHero.jsx` | 10 mp-es scrollytelling: canvas képkocka-léptetés görgetésre, fejezetek, felugró tooltipek |
| `client/src/components/FlourParticles.jsx` | Lisztpor részecskék (görgetésre felkavarodnak, az egér elfújja őket) |
| `client/src/components/Tip.jsx` | Fogalom-tooltipek (cöliákia, glutén, keresztszennyeződés…) |
| `client/src/components/FactToast.jsx` | Görgetés közben felugró „Tudtad?” kártyák |
| `client/src/components/Reviews.jsx` | Google-vélemények (élő API + tartalék) |
| `client/public/frames/` | 240 WebP képkocka (a videó 4,5–14,5 mp közötti része, 24 fps, 1280 px, ~6,8 MB) |
| `server/reviews.js` | Places API (New) lekérés, 6 órás cache, hiba esetén tartalék lista |
| `shared/reviews.fallback.json` | Tartalék vélemények (a Google-profilról) |

## Google-vélemények élőben

1. Google Cloud Console → engedélyezd a **Places API (New)**-t, hozz létre API-kulcsot (érdemes a szerver IP-jére korlátozni).
2. `.env`: `GOOGLE_PLACES_API_KEY=...`
3. Első indításkor a szerver név + cím alapján megkeresi a helyet, és kiírja a konzolra a Place ID-t – ezt érdemes `GOOGLE_PLACE_ID`-ként elmenteni.

A Places API helyenként legfeljebb 5 véleményt ad vissza; a szerver ezeket 6 óránként frissíti. Kulcs nélkül a tartalék lista jelenik meg (az értékelés és a darabszám ilyenkor kézzel frissítendő a JSON-ban). Ha van Place ID, megjelenik az „Írd meg a véleményed” gomb is.

## Videó cseréje

Más 10 mp-es szakasz kivágása (pl. 4,5 mp-től):

```bash
ffmpeg -ss 4.5 -t 10 -i glutilino_4k_hevc.mp4 -vf "fps=24,scale=1280:-2:flags=lanczos" \
  -c:v libwebp -quality 60 client/public/frames/f_%03d.webp
```

Ha változik a képkockák száma, írd át a `FRAMES` értéket a `ScrollyHero.jsx`-ben, a fejezetek `from`/`to` értékeit pedig a `content.js`-ben.

## Teendők élesítés előtt

- A szöveges logót (`Wordmark.jsx`) cseréld a hivatalos SVG logóra.
- Pontos nyitvatartás: a `site.opening` mező (`content.js`) jelenleg csak a nyitást tartalmazza.
- Árak: csak a Marinara (3 190 Ft) és a Champion (6 990 Ft) ára ismert, a többi kártyán nincs ár.
- Teljes étlap: ha lesz PDF vagy aloldal, a linket a `site.menuUrl`-be tedd.

## Hozzáférhetőség

Billentyűzettel bejárható, látható fókusz, a tooltipek fókuszra is nyílnak, Escape-re zárulnak. `prefers-reduced-motion` esetén kikapcsol a smooth scroll, a részecskék megállnak, a vélemény-futószalag görgethető listává válik.
