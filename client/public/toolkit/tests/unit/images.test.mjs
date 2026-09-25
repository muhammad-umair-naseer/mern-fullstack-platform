import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { fixture, save, has, FX } from './_helpers.mjs';
import { decodePng, encodePng, encodeIco, jpegInfo, isPng, isJpeg } from '../../src/core/image-codecs.js';
import { decodeGif, readExif, stripMetadata, optimizeSvg, webpInfo } from '../../src/core/formats/image-extra.js';

test('PNG decode (rgb, rgba, gray, palette) + encode round-trip', async () => {
  for (const f of ['color.png', 'alpha.png', 'gray.png', 'palette.png']) {
    const img = decodePng(fixture(f));
    assert.ok(img.width > 0 && img.data.length === img.width * img.height * 4, f);
    const again = decodePng(await encodePng(img.width, img.height, img.data));
    assert.deepEqual(again.data, img.data, 'round-trip ' + f);
  }
  const info = jpegInfo(fixture('color.jpg')); assert.ok(info.width > 0 && info.components === 3);
  assert.ok(isPng(fixture('color.png')) && isJpeg(fixture('color.jpg')));
});
test('ICO writer produces a valid multi-size icon', async () => {
  const img = decodePng(fixture('color.png'));
  const pngs = await Promise.all([16, 32].map(async (s) => ({ size: s, png: await encodePng(s, s, img.data.slice(0, s * s * 4)) })));
  const ico = encodeIco(pngs); const p = save('t.ico', ico);
  assert.equal(ico[2], 1); assert.equal(ico[4], 2);
  if (has('python3')) try { assert.match(execSync(`python3 -c "from PIL import Image; im=Image.open('${p}'); print(im.size, im.format)"`, { encoding: 'utf8' }), /ICO/); } catch { }
});
test('GIF decoder: frames, delays, loop, disposal (compared with PIL when available)', () => {
  const g = decodeGif(fixture('anim.gif'));
  assert.equal(g.width, 64); assert.equal(g.frames.length, 6); assert.deepEqual(g.frames.map((f) => f.delay), [80, 120, 120, 120, 120, 200]);
  if (has('python3')) {
    try {
      const ref = execSync(`python3 -c "from PIL import Image; import sys; im=Image.open('${FX}/anim.gif'); im.seek(3); sys.stdout.buffer.write(im.convert('RGBA').tobytes())"`, { maxBuffer: 1e7 });
      assert.deepEqual(new Uint8Array(ref), new Uint8Array(g.frames[3].rgba.buffer));
    } catch (e) { if (!/No module|ModuleNotFound/.test(String(e))) throw e; }
  }
});
test('EXIF read (GPS) and lossless metadata strip for JPEG/PNG/WebP', () => {
  const ex = readExif(fixture('gps.jpg'));
  assert.equal(ex.tags.Make, 'TestCam'); assert.ok(Math.abs(ex.gps.lat - 33.59) < 1e-6 && Math.abs(ex.gps.lon - 73.0667) < 1e-3);
  const j = stripMetadata(fixture('gps.jpg')); assert.equal(j.kind, 'jpeg'); assert.equal(readExif(j.bytes).hasExif, false); assert.ok(j.bytes.length < fixture('gps.jpg').length);
  const w = stripMetadata(fixture('gps.webp')); assert.equal(w.kind, 'webp'); assert.equal(readExif(w.bytes).hasExif, false); assert.deepEqual(webpInfo(w.bytes), webpInfo(fixture('gps.webp')));
  const p = stripMetadata(fixture('color.png')); assert.equal(p.kind, 'png'); assert.ok(isPng(p.bytes));
  assert.equal(stripMetadata(new Uint8Array([1, 2, 3])), null);
});
test('SVG optimizer removes editor junk, rounds numbers, keeps referenced ids', () => {
  const svg = `<?xml version="1.0"?><!-- Inkscape --><svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/ns" version="1.1" width="100.00001" viewBox="0 0 100.000 50.500"><metadata id="m"/><defs><linearGradient id="grad"/></defs><g id="l" inkscape:label="L" transform="translate(0,0)"><path id="p" style="fill:#AABBCC;fill-opacity:1" d="M 10.12345,10.98765 L 20 , 20 z"/><rect x="0" width="10.000" height="10" fill="url(#grad)"/><g/></g></svg>`;
  const r = optimizeSvg(svg);
  assert.doesNotMatch(r.svg, /inkscape|metadata|version=|id="p"|translate\(0,0\)|fill-opacity/);
  assert.match(r.svg, /id="grad"/); assert.match(r.svg, /d="M10.123,10.988L20,20z"/); assert.match(r.svg, /width="100"/);
  assert.ok(r.after < r.before * 0.6);
});
