import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixture, save, qpdfCheck, pdfText } from './_helpers.mjs';
import { parseMarkdown, markdownToHtml, markdownToDocument, renderMarkdownToPdf } from '../../src/core/formats/markdown.js';
import { parseDocx, renderDocxToPdf, docxToText, parseXlsx, renderXlsxToPdf } from '../../src/core/formats/office.js';
import { PdfBuilder } from '../../src/core/pdf/pdfkit.js';
import { decodePng } from '../../src/core/image-codecs.js';

const md = `# Title *em*\n\nPara with **bold**, \`code\`, ~~del~~, [link](https://x.y "T") and auto https://a.b/c.\nSecond line.  \nHard break.\n\n> quote\n\n- one\n- two\n  - nested\n- [x] done\n\n1. first\n2. second\n\n\`\`\`js\nlet x = 1; // <t>\n\`\`\`\n\n| A | B |\n|:--|--:|\n| 1 | 2 |\n\n![alt](color.png)\n\n---\n`;
test('Markdown → blocks → HTML', () => {
  const blocks = parseMarkdown(md);
  assert.deepEqual(blocks.map((b) => b.type), ['heading', 'paragraph', 'blockquote', 'list', 'list', 'code', 'table', 'paragraph', 'hr']);
  const html = markdownToHtml(md);
  assert.match(html, /<h1 id="title-em">Title <em>em<\/em><\/h1>/);
  assert.match(html, /<strong>bold<\/strong>, <code>code<\/code>, <del>del<\/del>, <a href="https:\/\/x\.y" title="T">link<\/a> and auto <a href="https:\/\/a\.b\/c">/);
  assert.match(html, /Second line\.<br>Hard break\./);
  assert.match(html, /<ul><li>one<\/li><li><p>two<\/p>\n<ul><li>nested<\/li><\/ul><\/li><li class="task"><input type="checkbox" disabled checked> done<\/li><\/ul>/);
  assert.match(html, /<pre><code class="language-js">let x = 1; \/\/ &lt;t&gt;<\/code><\/pre>/);
  assert.match(html, /<th align="left">A<\/th><th align="right">B<\/th>/);
  assert.match(markdownToDocument('# x', { title: 'Doc' }), /<!doctype html>[\s\S]*<title>Doc<\/title>[\s\S]*<h1 id="x">x<\/h1>/);
  assert.equal(markdownToHtml('[x](javascript:alert(1))'), '<p><a href="#">x</a></p>');
});
test('Markdown → PDF renders with images and tables', async () => {
  const b = new PdfBuilder();
  await renderMarkdownToPdf(b, parseMarkdown(md), { resolveImage: async (href) => { const p = decodePng(fixture(href)); return { rgba: p.data, width: p.width, height: p.height }; } });
  const out = await b.finish({ title: 'md' }); const p = save('md.pdf', out); qpdfCheck(p);
  const t = pdfText(p); if (t !== null) { assert.match(t, /Title em/); assert.match(t, /nested/); assert.match(t, /let x = 1;/); }
});
test('DOCX: styles, lists, images, tables, page breaks → PDF', async () => {
  const { blocks, meta } = parseDocx(fixture('sample.docx'));
  assert.equal(meta.creator, 'python-docx');
  const paras = blocks.filter((b) => b.type === 'paragraph');
  assert.equal(paras[0].heading, 1);
  assert.ok(paras[1].runs.some((r) => r.bold && r.text === 'bold') && paras[1].runs.some((r) => r.italic) && paras[1].runs.some((r) => r.underline));
  assert.ok(paras.filter((p) => p.list && !p.list.ordered).length === 3 && paras.filter((p) => p.list && p.list.ordered).length === 3);
  assert.ok(blocks.some((b) => b.type === 'table' && b.rows.length === 3) && blocks.some((b) => b.type === 'pagebreak'));
  assert.ok(paras.some((p) => p.images.length && p.images[0].contentType === 'image/png'));
  assert.match(docxToText(fixture('sample.docx')), /café, naïve, résumé/);
  const b = new PdfBuilder();
  await renderDocxToPdf(b, blocks, { decodeImage: async (img) => { const p = decodePng(img.data); return { rgba: p.data, width: p.width, height: p.height }; } });
  const out = await b.finish(); const p = save('docx.pdf', out); qpdfCheck(p);
  const t = pdfText(p); if (t !== null) { assert.match(t, /Heading level 2/); assert.match(t, /1\.\s+Numbered item 1/); assert.match(t, /R2C2/); assert.match(t, /Second page text/); }
});
test('XLSX: shared/inline strings, numbers, booleans, dates, empty formulas → PDF', async () => {
  const { sheets } = parseXlsx(fixture('sample.xlsx'));
  assert.deepEqual(sheets.map((s) => s.name), ['Sales', 'Second']);
  assert.deepEqual(sheets[0].rows[0], ['Region', 'Q1', 'Q2', 'Total', 'Note']);
  assert.deepEqual(sheets[0].rows[2].slice(0, 3), ['Region 1', 100, 120.5]);
  assert.deepEqual(sheets[1].rows[1].slice(0, 2), [1, true]);
  const b = new PdfBuilder({ landscape: true, margins: 36 });
  renderXlsxToPdf(b, sheets);
  const out = await b.finish(); const p = save('xlsx.pdf', out); qpdfCheck(p);
  const t = pdfText(p); if (t !== null) { assert.match(t, /Region 28/); assert.match(t, /inline/); }
});
