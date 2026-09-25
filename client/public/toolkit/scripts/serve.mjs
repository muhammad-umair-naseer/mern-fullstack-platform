// Tiny static file server for local development: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
const root = process.cwd();
const port = Number(process.argv[2] || process.env.PORT || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.gif': 'image/gif', '.wasm': 'application/wasm' };
createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    let s = await stat(file).catch(() => null);
    if (s && s.isDirectory()) { file = join(file, 'index.html'); s = await stat(file).catch(() => null); }
    if (!s) {
      // Dev convenience: /tools/<slug>/ works before `npm run build` by serving the shell with the slug injected.
      const m = /^\/tools\/([a-z0-9-]+)\/?$/.exec(path);
      if (m) { const shell = (await readFile(join(root, 'tool.html'), 'utf8')).replace('<body>', `<body data-slug="${m[1]}" data-base="../../">`).replace(/href="assets\//g, 'href="../../assets/').replace(/src="src\//g, 'src="../../src/').replace(/href="\.\/"/g, 'href="../../"'); res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(shell); }
      res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' });
    res.end(data);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, () => console.log(`Cortexis Tools dev server → http://localhost:${port}/`));
