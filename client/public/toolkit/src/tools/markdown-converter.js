import { h, field, select, button, run, result, section, dropzone, textarea, readAs, pdfPreview, notice, input, decodeToImageData, number } from '../core/ui.js';
import { parseMarkdown, markdownToDocument, renderMarkdownToPdf, markdownToHtml } from '../core/formats/markdown.js';
import { PdfBuilder } from '../core/pdf/pdfkit.js';

export function mount(root) {
  const inp = textarea({ rows: 18, class: 'mono', value: '# Project Notes\n\nA **Markdown** document with a [link](https://cortexis.pk), `code`, and:\n\n- bullet one\n- bullet two\n  - nested\n\n1. First\n2. Second\n\n| Feature | Status |\n|---------|:------:|\n| PDF export | ✅ |\n| HTML export | ✅ |\n\n```js\nconsole.log("hello");\n```\n\n> Write it once, then export it as a PDF or an HTML page.' });
  const target = select([['pdf', 'PDF'], ['html', 'HTML page (standalone)'], ['fragment', 'HTML fragment']], 'pdf');
  const pageSize = select([['A4', 'A4'], ['Letter', 'US Letter']], 'A4');
  const title = input('text', { value: 'Document', class: 'wide' });
  const fontSize = number(11, { min: 8, max: 16 });
  const preview = h('div.card', { style: { maxHeight: '60vh', overflow: 'auto' } });
  // Headings are shifted down a level in the on-page preview only, so a "# Title" in the
  // document never adds a second h1 to the page. Downloads keep the author's levels.
  const demote = (html) => html.replace(/<(\/?)h([1-5])\b/g, (_, slash, n) => `<${slash}h${Number(n) + 1}`);
  const renderPreview = () => { preview.innerHTML = demote(markdownToHtml(inp.value)); };
  inp.addEventListener('input', renderPreview); renderPreview();
  const out = h('div');
  const go = button('Convert', () => run(go, async () => {
    const md = inp.value;
    if (target.value === 'pdf') {
      const b = new PdfBuilder({ pageSize: pageSize.value, margins: 56 });
      await renderMarkdownToPdf(b, parseMarkdown(md), { baseSize: Number(fontSize.value), resolveImage: async (href) => { if (!/^data:|^blob:/.test(href)) return null; const d = await decodeToImageData(await (await fetch(href)).blob(), { maxSide: 1600 }); return { rgba: d.data.data, width: d.width, height: d.height }; } });
      const pdf = await b.finish({ title: title.value });
      out.replaceChildren(result({ title: 'PDF', data: pdf, name: (title.value || 'document') + '.pdf', mime: 'application/pdf', preview: pdfPreview(pdf) }));
    } else if (target.value === 'html') { const html = markdownToDocument(md, { title: title.value }); out.replaceChildren(result({ title: 'HTML page', data: html, name: (title.value || 'document') + '.html', mime: 'text/html', preview: h('iframe.pdf-frame', { srcdoc: html, style: { height: '420px' } }) })); }
    else { const html = markdownToHtml(md); out.replaceChildren(result({ title: 'HTML fragment', data: html, name: 'fragment.html', mime: 'text/html', preview: h('pre.mono', { style: { whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto' } }, html) })); }
  }, out), 'primary big');
  root.append(h('div.tool.two', h('div.stack', section('Markdown', dropzone({ accept: '.md,.markdown,.txt', compact: true, label: 'Drop a .md file or edit below', onFiles: async ([f]) => { inp.value = await readAs(f, 'text'); title.value = f.name.replace(/\.[^.]+$/, ''); renderPreview(); } }), inp), section('Output', h('div.grid2', field('Convert to', target), field('Page size (PDF)', pageSize)), h('div.grid2', field('Title', title), field('Base font size (PDF)', fontSize)), notice('Remote images are not fetched (nothing leaves your device); paste images as data: URLs to embed them.'), go)), h('div', h('h3', 'Live preview'), preview, out)));
}
