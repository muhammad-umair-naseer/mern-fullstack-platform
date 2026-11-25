import { adsAllowed } from './adsense.jsx';

test('AdSense only on public content pages', () => {
  for (const p of ['/', '/blog', '/blog/gta-6-how-to-play-pc-requirements-price', '/courses', '/learn/prompt-engineering', '/tools/pdf-merge', '/games', '/privacy'])
    expect(adsAllowed(p)).toBe(true);
  for (const p of ['/login', '/signup', '/dashboard', '/admin', '/your-bot', '/your-bot/privacy', '/whatsapp-bot/terms', '/yourbot',
    '/certificate/CTX-1', '/learn/prompt-engineering/lesson/3', '/learn/x/quiz/2', '/learn/x/final'])
    expect(adsAllowed(p)).toBe(false);
});
