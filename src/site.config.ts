export type NavItem = { label: string; href: string };

export type Scent = {
  id: 'icon' | 'romantic' | 'rebel' | 'muse' | 'dreamer';
  name: string;
  mood: string;
  notes: [string, string, string];
  text: string;
  // цвет сцены: подсветка карточки и полоски под названием
  tint: string;
};

export const site = {
  name: 'Gold Apple',
  shortName: 'Gold Apple',
  tagline: 'Eau de Parfum in five characters',
  description:
    'Five fragrances, five characters, one bottle with a gold apple on top. A concept collection for Gold Apple.',
  // домен без слеша на конце: нужен для canonical, sitemap и OG
  url: 'https://aleksei1999.github.io/gold-apple',
  locale: 'en_GB',
  lang: 'en',
  ogImage: '/og.jpg',

  contacts: {
    email: 'hello@fomenko.store',
  },

  nav: [
    { label: 'The scents', href: '/#scents' },
    { label: 'Find yours', href: '/#find' },
    { label: 'The bottle', href: '/#bottle' },
  ] satisfies NavItem[],

  cta: { label: 'Find your scent', href: '/#find' },

  socials: [] as NavItem[],

  legal: [{ label: 'Privacy', href: '/privacy/' }] satisfies NavItem[],

  forms: {
    endpoint: 'https://formsubmit.co/ajax/hello@fomenko.store',
    subject: 'Gold Apple concept',
  },
};

export const SCENTS: Scent[] = [
  {
    id: 'icon',
    name: 'The Icon',
    mood: 'Warm, golden, unforgettable',
    notes: ['Saffron', 'Golden apple', 'Amber'],
    text: 'The one people remember you by. Saffron and a crisp golden apple over a slow, warm base of amber.',
    tint: '#c99a45',
  },
  {
    id: 'romantic',
    name: 'The Romantic',
    mood: 'Soft, rosy, morning light',
    notes: ['Peony', 'Pink pepper', 'White musk'],
    text: 'Sunday morning in a room full of flowers. Peony and a little pink pepper, settling into clean white musk.',
    tint: '#e7a8b4',
  },
  {
    id: 'rebel',
    name: 'The Rebel',
    mood: 'Dark, bold, after midnight',
    notes: ['Black cherry', 'Red rose', 'Leather'],
    text: 'For nights that end later than planned. Black cherry and red rose with a smooth leather trail.',
    tint: '#c3283a',
  },
  {
    id: 'muse',
    name: 'The Muse',
    mood: 'Green, calm, after the rain',
    notes: ['Fig leaf', 'Green tea', 'Vetiver'],
    text: 'A deep breath in a misty greenhouse. Fig leaf and green tea over earthy vetiver.',
    tint: '#8fae84',
  },
  {
    id: 'dreamer',
    name: 'The Dreamer',
    mood: 'Lilac, airy, under the stars',
    notes: ['Lavender', 'Violet', 'Vanilla cloud'],
    text: 'Soft and a little unreal. Lavender and violet drifting over a cloud of vanilla.',
    tint: '#a08bd6',
  },
];

export type Site = typeof site;
