import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getReviews } from './reviews.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 8787;
const isProd = process.env.NODE_ENV === 'production';

// .env betöltése függőség nélkül (Node 20.6+ alatt is működik)
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const app = express();
app.disable('x-powered-by');
app.use(compression());

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/reviews', async (_req, res) => {
  const data = await getReviews();
  res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
  res.json(data);
});

if (isProd || fs.existsSync(DIST)) {
  // A videókockák és a hash-elt assetek nem változnak -> hosszú cache
  app.use(
    express.static(DIST, {
      index: false,
      setHeaders(res, file) {
        if (/[\\/](assets|frames)[\\/]/.test(file)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(webp|svg|woff2)$/.test(file)) {
          res.setHeader('Cache-Control', 'public, max-age=604800');
        }
      },
    }),
  );
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`glutiliNO szerver: http://localhost:${PORT}`);
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.log('  ℹ GOOGLE_PLACES_API_KEY nincs beállítva – a vélemények a tartalék listából jönnek.');
  }
});
