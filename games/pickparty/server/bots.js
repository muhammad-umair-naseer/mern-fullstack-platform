'use strict';
// Bot seats. They read the live crowd ratings, so a table full of bots
// plays like "the internet" would; a little noise keeps them human-ish.

const NAMES = ['Zara', 'Hamza', 'Mina', 'Kenji', 'Lola', 'Omar', 'Priya', 'Felix', 'Aiko', 'Bilal',
  'Nora', 'Theo', 'Sana', 'Diego', 'Ayla', 'Rafi', 'Ines', 'Yusuf', 'Maya', 'Leo'];
const AVATARS = ['🦊', '🐼', '🐸', '🦁', '🐙', '🦉', '🐯', '🐧'];
const COUNTRIES = ['PK', 'SA', 'AE', 'GB', 'US', 'JP', 'TR', 'IN', 'DE', 'BR'];

const pick = (a) => a[Math.floor(Math.random() * a.length)];

function softPick(items, score, temp) {
  if (!items.length) return null;
  const m = Math.max(...items.map(score));
  const w = items.map((x) => Math.exp((score(x) - m) / temp));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

function gauss() { return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()); }

const Bots = {
  identity(taken) {
    const name = pick(NAMES.filter((n) => !taken.includes(n))) || 'Bot' + Math.floor(Math.random() * 99);
    return { name, avatar: pick(AVATARS), country: pick(COUNTRIES) };
  },
  delay(min, max) { return min + Math.random() * (max - min); },
  // top pick (or worst, for the dud round)
  draft(available, rating, dud) {
    return softPick(available, (o) => (dud ? -rating[o] : rating[o]), 45);
  },
  vote(candidates, rating, dud) {
    // candidates: [{sid, opt}]
    return softPick(candidates, (c) => (dud ? -rating[c.opt] : rating[c.opt]), 55);
  },
  // The most a bot will pay for a card: a share of its purse per open slot,
  // scaled by how well the crowd rates the card, with some noise. Bots skip
  // weak cards unless they are running out of lots to fill their lineup.
  ceiling(rating, opt, purse, slotsLeft, lotsLeft) {
    const others = rating.filter((_, i) => i !== opt);
    const v = others.filter((r) => r < rating[opt]).length / Math.max(1, others.length);
    const fair = purse / Math.max(1, slotsLeft);
    let c = Math.round(fair * (0.4 + 1.6 * v) * (1 + 0.25 * gauss()));
    if (v < 0.3) c = slotsLeft >= lotsLeft ? Math.max(1, c) : 0;
    return Math.max(0, Math.min(purse, c));
  },
  secret(rating) {
    const noisy = rating.map((v, i) => ({ i, v: v + gauss() * 60 }));
    noisy.sort((a, b) => b.v - a.v);
    return { loves: noisy.slice(0, 3).map((x) => x.i), dud: noisy[noisy.length - 1].i };
  },
};

module.exports = Bots;
