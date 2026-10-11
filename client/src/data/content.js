// Minden szöveg és adat egy helyen – innen szerkeszthető.

export const site = {
  name: 'glutiliNO',
  fullName: 'glutiliNO Kézműves Gluténmentes Pizzéria és Pékség',
  address: 'Budapest, Párkány u. 8., 1138',
  addressShort: 'Párkány u. 8.',
  district: 'XIII. kerület',
  phoneDisplay: '06 30 074 3932',
  phoneHref: 'tel:+36300743932',
  opening: 'Nyitás: 11:00',
  priceRange: '6000–8000 Ft / fő',
  facebook: 'https://www.facebook.com/profile.php?id=61583295550470',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=glutiliNO%2C%20Budapest%2C%20P%C3%A1rk%C3%A1ny%20u.%208%2C%201138',
  mapEmbed:
    'https://maps.google.com/maps?q=glutiliNO%2C%20P%C3%A1rk%C3%A1ny%20u.%208%2C%201138%20Budapest&z=16&output=embed',
  // TODO: ha elkészül a teljes étlap (PDF vagy aloldal), ide kerüljön a link
  menuUrl: '#etlap',
};

export const nav = [
  { href: '#mentes', label: 'Gluténmentesség' },
  { href: '#etlap', label: 'Étlap' },
  { href: '#pekseg', label: 'Pékség' },
  { href: '#rolunk', label: 'Rólunk' },
  { href: '#velemenyek', label: 'Vélemények' },
];

/*
 * Scrollytelling fejezetek. `from`/`to` = a 10 mp-es videórészlet arányában (0–1).
 * `pin` = a felugró tooltip horgonypontja a videókockán (x, y 0–1 között).
 */
export const chapters = [
  {
    id: 'kelesztes',
    label: 'Tészta',
    from: 0.0,
    to: 0.2,
    title: 'A tészta két napig érik.',
    text: 'Nápolyi pizza, ahogy Nápolyban sütik – csak éppen búzaliszt nélkül.',
    pin: { x: 0.68, y: 0.48 },
    tip: {
      title: '48 órás kelesztés',
      body: 'A tésztát legalább 48 órán át érleljük. Ettől lesz könnyű, levegős és ropogós a széle – glutén nélkül is.',
    },
  },
  {
    id: 'pekseg',
    label: 'Pékség',
    from: 0.2,
    to: 0.335,
    title: 'Pékség is vagyunk.',
    text: 'Kenyér, kakaós csiga, sütemény – mind helyben sül.',
    pin: { x: 0.3, y: 0.42 },
    tip: {
      title: 'Haza is viheted',
      body: 'A helyben sütött gluténmentes kenyereinket elvitelre is megveheted.',
    },
  },
  {
    id: 'bruschetta',
    label: 'Előétel',
    from: 0.335,
    to: 0.57,
    title: 'Ropogós kenyér, friss paradicsom.',
    text: 'A bruschetta alapja is a saját kenyerünk.',
    pin: { x: 0.42, y: 0.56 },
    tip: {
      title: 'Nincs „mentes változat”',
      body: 'Nálunk nincs külön gluténmentes étlap – minden tétel az. Bármit választasz, biztonságos.',
    },
  },
  {
    id: 'alapanyag',
    label: 'Alapanyag',
    from: 0.57,
    to: 0.735,
    title: 'Olasz alapanyagok, egyenként ellenőrizve.',
    text: 'Felvágottak, sajtok, fűszerek: csak az kerül a polcra, ami igazoltan gluténmentes.',
    pin: { x: 0.52, y: 0.44 },
    tip: {
      title: 'Rejtett glutén',
      body: 'Glutén lehet fűszerkeverékben, felvágottban, sőt sörben is. Ezért minden fűszert és italt átnézünk.',
    },
  },
  {
    id: 'kemence',
    label: 'Kemence',
    from: 0.735,
    to: 0.93,
    title: 'Egy nápolyi pizzaséf konyhája.',
    text: 'Alex majdnem nyolc évet töltött Nápolyban, mielőtt a XIII. kerületben kemencét gyújtott.',
    pin: { x: 0.24, y: 0.36 },
    tip: {
      title: 'Saját, mentes konyha',
      body: 'A konyhába külső étel nem kerülhet be – a munkatársak sem hozhatnak saját ételt. Így nincs keresztszennyeződés.',
    },
  },
  {
    id: 'pizza',
    label: 'Pizza',
    from: 0.93,
    to: 1.0,
    title: 'Nem fogod érezni a különbséget.',
    text: 'Ezt nem mi mondjuk – a vendégeink írják.',
    pin: { x: 0.5, y: 0.5 },
    tip: {
      title: '50 Top Pizza Europe 2026',
      body: 'Bekerültünk az „Excellent Pizzerias” közé – nem külön gluténmentes kategóriában, hanem a hagyományos pizzériák mellett.',
    },
  },
];

// Felugró „Tudtad?” kártyák görgetés közben – szekció-azonosító szerint
export const facts = {
  mentes: 'A sör is gluténmentes nálunk – például a Peroni gluténmentes változata.',
  etlap: 'A levegős pizzaszélhez (cornicione) gluténmentes tésztánál idő kell – nálunk legalább 48 óra.',
  pekseg: 'A tiramisu piskótáját is mi sütjük – a bolti babapiskóta szinte mindig búzalisztes.',
  rolunk: 'A cöliákia Magyarországon nagyjából minden századik embert érinti, sokan nem is tudnak róla.',
  velemenyek: 'Nem csak cöliákiásoknak sütünk: a cél, hogy az egész társaság ugyanazt egye.',
  latogatas: 'Allergénekről kérdeznél? Hívj minket bátran, mielőtt jössz.',
};

export const glossary = {
  gluten: {
    term: 'glutén',
    body: 'A búzában, árpában és rozsban található fehérje. Ez adja a hagyományos tészta rugalmasságát – mi gluténmentes lisztekkel és hosszú érleléssel érjük el ugyanezt.',
  },
  coeliakia: {
    term: 'cöliákia',
    body: 'Autoimmun betegség: a glutén a vékonybél nyálkahártyáját károsítja. Egyetlen kezelése a szigorú, élethosszig tartó gluténmentes étrend.',
  },
  kereszt: {
    term: 'keresztszennyeződés',
    body: 'Amikor gluténos ételből akár csak morzsányi kerül a mentes ételbe – közös deszkán, olajban, kemencében. Cöliákiásnak ez is elég a tünetekhez.',
  },
  vegan: {
    term: 'vegán sajt',
    body: 'Növényi alapú sajt. A legtöbb pizzánkat kérheted vele, ha tejmentesen étkezel.',
  },
};

export const safety = [
  {
    title: 'Az egész konyha gluténmentes',
    body: 'Nincs „mentes sarok” és nincs közös deszka. A lisztes zsáktól a tálalóig minden mentes, így a {kereszt} sincs honnan jöjjön.',
  },
  {
    title: 'Kívülről nem jön be étel',
    body: 'A munkatársak sem hozhatnak saját ételt a konyhába. Szigorú, de cöliákiásként tudod, miért fontos.',
  },
  {
    title: 'Minden fűszer és ital ellenőrzött',
    body: 'A pultra csak igazoltan gluténmentes termék kerül – a sörtől a koktélokig.',
  },
  {
    title: 'Tejmentesen is',
    body: 'A legtöbb pizza {vegan}tal is kérhető.',
  },
];

export const menu = [
  {
    name: 'Margherita',
    desc: 'Paradicsom, mozzarella, bazsalikom. Alex személyes kedvence.',
    img: '/img/margherita.webp',
  },
  {
    name: 'Champion',
    desc: 'Füstölt kacsamell, lilahagyma-lekvár, narancshéj, dió.',
    price: '6 990 Ft',
    badge: 'Díjnyertes',
    featured: true,
  },
  {
    name: 'Prosciutto crudo',
    desc: 'Prosciutto crudo és friss rukkola a kemencéből épp kivett pizzán.',
    img: '/img/prosciutto.webp',
  },
  {
    name: 'Marinara',
    desc: 'A nápolyi klasszikus: paradicsom, fokhagyma, oregánó, olívaolaj.',
    price: '3 190 Ft',
  },
  {
    name: 'És még húsznál is több',
    desc: 'Diavola, zöldséges, szezonális pizzák, panuozzo és saláták.',
    img: '/img/verdure.webp',
    more: true,
  },
];

export const bakery = [
  { name: 'Kenyerek', note: 'Helyben sütve, elvitelre is', img: '/img/bread.webp', size: 'wide' },
  { name: 'Desszertek pohárban', note: 'Tiramisu saját piskótával és pohárkrémek', img: '/img/desserts.webp', size: 'tall' },
  { name: 'Brownie', note: 'Sűrű, csokis, mentes', img: '/img/brownies.webp' },
  { name: 'Kézzel nyújtva', note: 'Minden tészta itt készül', img: '/img/dough.webp' },
  { name: 'Bruschetta', note: 'Saját kenyéren', img: '/img/bruschetta.webp' },
  { name: 'Csokis keksz', note: 'Frissen a tepsiből', img: '/img/cookies.webp' },
];

export const story = {
  quote: 'Olyan pizzát próbáltam csinálni, hogy ha valaki megeszi, tudja, hogy ez Alex pizzája.',
  author: 'Paduraru Alexandru Ilie',
  role: 'séf, társtulajdonos',
  paragraphs: [
    'Alex majdnem nyolc évet töltött Nápolyban, Gino Sorbillo pizzériájában tanult, később Brüsszelben és Budapesten sütött. Ma a GPN magyarországi nagykövete, pizzaséfeket képez és pizzériákat minősít.',
    'A gluténmentes tésztával azért kezdett kísérletezni, mert a közvetlen környezetében is van gluténérzékeny. Társtulajdonosa, Béres-Pálffy Kinga saját tapasztalatból tudja, milyen étteremben kompromisszumot kötni. Itt nem kell.',
  ],
};
