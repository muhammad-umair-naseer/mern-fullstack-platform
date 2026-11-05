// The Cortexis admin portal: static files on their own port, kept off the
// public website. Sign-in and every admin check happen at the API, which
// refuses admin data to anyone who is not an admin; this server only serves
// the page and tells it where the API is (ADMIN_API_URL, else port 5000 on
// whatever host the page was opened from).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 6001;
const API_URL = process.env.ADMIN_API_URL || '';
const SITE_URL = process.env.ADMIN_SITE_URL || '';   // the website, for certificate links
if (process.env.NODE_ENV === 'production') {
  for (const value of [API_URL, SITE_URL]) { const url = new URL(value); if (url.protocol !== 'https:' || url.origin !== value) throw new Error('Set exact HTTPS ADMIN_API_URL and ADMIN_SITE_URL'); }
}
const ROOT = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' " + (API_URL || 'http://localhost:5000') + "; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-cache',
};

http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, 'http://x'); }
  catch { res.writeHead(400, HEADERS); return res.end('Bad request'); }
  if (url.pathname === '/healthz') { res.writeHead(200, HEADERS); return res.end('ok'); }
  if (url.pathname === '/config.js') {
    res.writeHead(200, { ...HEADERS, 'Content-Type': TYPES['.js'] });
    return res.end(`window.ADMIN_API_URL = ${JSON.stringify(API_URL)}; window.ADMIN_SITE_URL = ${JSON.stringify(SITE_URL)};`);
  }
  const file = path.normalize(path.join(ROOT, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403, HEADERS); return res.end(); }
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(404, HEADERS); return res.end('Not found'); }
    res.writeHead(200, { ...HEADERS, 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  });
}).listen(PORT, process.env.HOST || '127.0.0.1', () => console.log(`Cortexis admin portal on http://localhost:${PORT}`));
