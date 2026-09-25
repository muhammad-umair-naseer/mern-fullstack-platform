import { h, field, button, section, textarea, notice, input, textOutput, checkbox, row } from '../core/ui.js';
import { base64url, utf8 } from '../core/bytes.js';

export function mount(root) {
  const inp = textarea({ rows: 6, class: 'mono', placeholder: 'Paste a JWT (header.payload.signature)', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVtYWlyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU4NjAwMDAwLCJleHAiOjIwNzQwMDAwMDB9.dTOp3FN46OYagIU8hAJxY9uaPzjgEIsUpMTZ0YR9Zmw' });
  const secret = input('text', { class: 'wide', placeholder: 'Shared secret for HS256/384/512 (never sent anywhere)' });
  const b64secret = checkbox('Secret is base64url-encoded', false);
  const header = h('div'), payload = h('div'), claims = h('dl.kv'), sig = h('div');
  const decodePart = (s) => JSON.parse(utf8.decode(base64url.decode(s)));
  const fmtTs = (n) => { const d = new Date(n * 1000); const diff = n * 1000 - Date.now(); return `${d.toISOString().replace('T', ' ').slice(0, 19)} UTC (${diff < 0 ? Math.round(-diff / 60000) + ' min ago' : 'in ' + Math.round(diff / 60000) + ' min'})`; };
  const decode = async () => {
    header.replaceChildren(); payload.replaceChildren(); claims.replaceChildren(); sig.replaceChildren();
    const tok = inp.value.trim().replace(/^Bearer\s+/i, '');
    if (!tok) return;
    const parts = tok.split('.');
    if (parts.length < 2) { header.append(h('div.error', 'Not a JWT: expected 3 dot-separated parts.')); return; }
    let H, P;
    try { H = decodePart(parts[0]); header.append(textOutput(JSON.stringify(H, null, 2), { name: 'header.json', rows: 5 })); } catch (e) { header.append(h('div.error', 'Header is not valid base64url JSON.')); return; }
    try { P = decodePart(parts[1]); payload.append(textOutput(JSON.stringify(P, null, 2), { name: 'payload.json', rows: 10 })); } catch (e) { payload.append(h('div.error', 'Payload is not valid base64url JSON.')); return; }
    const rows = [];
    if (P.exp) rows.push(['exp (expires)', fmtTs(P.exp)]); if (P.iat) rows.push(['iat (issued)', fmtTs(P.iat)]); if (P.nbf) rows.push(['nbf (not before)', fmtTs(P.nbf)]);
    if (P.iss) rows.push(['iss', String(P.iss)]); if (P.sub) rows.push(['sub', String(P.sub)]); if (P.aud) rows.push(['aud', JSON.stringify(P.aud)]);
    rows.push(['Algorithm', H.alg || '?'], ['Type', H.typ || '—'], ['Key ID', H.kid || '—']);
    claims.replaceChildren(...rows.flatMap(([k, v]) => [h('dt', k), h('dd', v)]));
    const nowSec = Date.now() / 1000;
    if (P.exp && P.exp < nowSec) sig.append(notice('Token is EXPIRED.', 'warn')); else if (P.exp) sig.append(notice('Token is not expired.', 'ok'));
    if (P.nbf && P.nbf > nowSec) sig.append(notice('Token is not yet valid (nbf in the future).', 'warn'));
    const alg = String(H.alg || '');
    if (/^HS(256|384|512)$/.test(alg)) {
      if (!secret.value) { sig.append(notice('Enter the shared secret to verify the HMAC signature.')); return; }
      try {
        const keyBytes = b64secret.input.checked ? base64url.decode(secret.value) : utf8.encode(secret.value);
        const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-' + alg.slice(2) }, false, ['sign']);
        const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8.encode(parts[0] + '.' + parts[1])));
        const expected = base64url.encode(mac);
        sig.append(notice(expected === (parts[2] || '') ? '✓ Signature is VALID for this secret.' : '✗ Signature does NOT match this secret.', expected === parts[2] ? 'ok' : 'warn'));
      } catch (e) { sig.append(h('div.error', e.message)); }
    } else if (alg === 'none') sig.append(notice('alg=none — this token is unsigned and must not be trusted.', 'warn'));
    else if (/^(RS|PS|ES)/.test(alg)) sig.append(notice(`${alg} uses a public key; paste the PEM public key below to verify.`), pemVerify(alg, parts));
  };
  const pemHost = h('div');
  function pemVerify(alg, parts) {
    const pem = textarea({ rows: 5, class: 'mono', placeholder: '-----BEGIN PUBLIC KEY-----' }); const res = h('div');
    const btn = button('Verify with public key', async () => { try { const der = base64url.decode(pem.value.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '').replace(/\+/g, '-').replace(/\//g, '_')); const hash = 'SHA-' + alg.slice(2); const algo = alg.startsWith('RS') ? { name: 'RSASSA-PKCS1-v1_5', hash } : alg.startsWith('PS') ? { name: 'RSA-PSS', hash } : { name: 'ECDSA', namedCurve: alg === 'ES256' ? 'P-256' : alg === 'ES384' ? 'P-384' : 'P-521' }; const key = await crypto.subtle.importKey('spki', der, algo, false, ['verify']); const verifyAlgo = alg.startsWith('PS') ? { name: 'RSA-PSS', saltLength: Number(alg.slice(2)) / 8 } : alg.startsWith('ES') ? { name: 'ECDSA', hash } : { name: 'RSASSA-PKCS1-v1_5' }; const ok = await crypto.subtle.verify(verifyAlgo, key, base64url.decode(parts[2]), utf8.encode(parts[0] + '.' + parts[1])); res.replaceChildren(notice(ok ? '✓ Signature VALID.' : '✗ Signature INVALID.', ok ? 'ok' : 'warn')); } catch (e) { res.replaceChildren(h('div.error', 'Could not verify: ' + e.message)); } });
    return h('div', pem, row(btn), res);
  }
  inp.addEventListener('input', decode); secret.addEventListener('input', decode); b64secret.input.addEventListener('change', decode);
  root.append(h('div.tool.two', h('div.stack', section('Token', inp), section('Verify signature', field('Secret (HMAC)', secret), b64secret, notice('The token and the secret are never stored or sent anywhere.'))), h('div', section('Header', header), section('Payload', payload), section('Claims', claims, sig, pemHost))));
  decode();
}
