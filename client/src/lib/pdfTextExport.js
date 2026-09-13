/**
 * Writers for the text-first PDF exports: plain text, RTF and ODT. Each takes
 * the same page model the PDF-to-HTML tool builds — an array of pages, each
 * with `lines` of `{ text, fontSize }` — and returns bytes or a string.
 *
 * Heading detection is the same rule the HTML writer uses (18pt+ is a top
 * heading, 14pt+ a subheading) so the four formats agree on structure.
 */

const level = (line) => (line.fontSize >= 18 ? 1 : line.fontSize >= 14 ? 2 : 0);

export const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const escapeXml = escapeHtml;

/** Plain text: one line per line, a blank line before headings, pages separated by a form feed. */
export function toTxt(pages) {
  return pages
    .map((p) =>
      p.lines
        .map((l, i) => (level(l) && i > 0 ? `\n${l.text}` : l.text))
        .join('\n')
    )
    .join('\n\f\n');
}

// RTF is 7-bit: anything outside ASCII goes out as \uN? (signed 16-bit code unit).
const rtfEscape = (s) => {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (ch === '\\' || ch === '{' || ch === '}') out += `\\${ch}`;
    else if (c < 0x80) out += ch;
    else if (c <= 0xffff) out += `\\u${c > 0x7fff ? c - 0x10000 : c}?`;
    else {
      // astral plane: surrogate pair, each as its own \u
      for (const unit of ch.split('')) {
        const u = unit.charCodeAt(0);
        out += `\\u${u > 0x7fff ? u - 0x10000 : u}?`;
      }
    }
  }
  return out;
};

/** Rich Text Format: headings bold and larger, paragraphs at 12pt, a page break between pages. */
export function toRtf(pages, title) {
  const body = pages
    .map((p) =>
      p.lines
        .map((l) => {
          const lv = level(l);
          const size = lv === 1 ? 36 : lv === 2 ? 28 : 24; // half-points
          const text = rtfEscape(l.text);
          return lv
            ? `{\\pard\\sa120\\sb240\\keepn\\fs${size}\\b ${text}\\b0\\par}`
            : `{\\pard\\sa120\\fs${size} ${text}\\par}`;
        })
        .join('\n')
    )
    .join('\n\\page\n');
  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fswiss\\fcharset0 Helvetica;}}\n{\\info{\\title ${rtfEscape(title)}}}\n\\f0\\fs24\n${body}\n}`;
}

/** OpenDocument Text: a zip with the mandatory uncompressed mimetype entry first. */
export async function toOdt(pages, title) {
  const { default: JSZip } = await import('jszip');
  const paragraphs = pages
    .map((p, i) =>
      p.lines
        .map((l) => {
          const lv = level(l);
          const text = escapeXml(l.text);
          return lv
            ? `<text:h text:style-name="Heading_20_${lv}" text:outline-level="${lv}">${text}</text:h>`
            : `<text:p text:style-name="Text_20_body">${text}</text:p>`;
        })
        .join('\n') + (i < pages.length - 1 ? '\n<text:p text:style-name="Page_20_break"/>' : '')
    )
    .join('\n');

  const NS =
    'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
    'xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" ' +
    'xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" ' +
    'xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
    'xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" ' +
    'office:version="1.2"';

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content ${NS}>
<office:automatic-styles>
<style:style style:name="Page_20_break" style:family="paragraph"><style:paragraph-properties fo:break-before="page"/></style:style>
</office:automatic-styles>
<office:body><office:text>
${paragraphs}
</office:text></office:body></office:document-content>`;

  const styles = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles ${NS}>
<office:styles>
<style:style style:name="Standard" style:family="paragraph"><style:text-properties fo:font-size="12pt" style:font-name="Liberation Sans"/></style:style>
<style:style style:name="Text_20_body" style:display-name="Text body" style:family="paragraph" style:parent-style-name="Standard"><style:paragraph-properties fo:margin-bottom="0.1in"/></style:style>
<style:style style:name="Heading_20_1" style:display-name="Heading 1" style:family="paragraph" style:parent-style-name="Standard"><style:paragraph-properties fo:margin-top="0.2in" fo:margin-bottom="0.1in" fo:keep-with-next="always"/><style:text-properties fo:font-size="18pt" fo:font-weight="bold"/></style:style>
<style:style style:name="Heading_20_2" style:display-name="Heading 2" style:family="paragraph" style:parent-style-name="Standard"><style:paragraph-properties fo:margin-top="0.15in" fo:margin-bottom="0.08in" fo:keep-with-next="always"/><style:text-properties fo:font-size="14pt" fo:font-weight="bold"/></style:style>
</office:styles>
</office:document-styles>`;

  const meta = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta ${NS}><office:meta><dc:title>${escapeXml(title)}</dc:title><meta:generator>Cortexis Solution Hub</meta:generator></office:meta></office:document-meta>`;

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
<manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.text"/>
<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
<manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

  const zip = new JSZip();
  zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
  zip.file('META-INF/manifest.xml', manifest);
  zip.file('content.xml', content);
  zip.file('styles.xml', styles);
  zip.file('meta.xml', meta);
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

export const EXPORTS = {
  html: { label: 'HTML web page (.html)', ext: 'html', mime: 'text/html;charset=utf-8' },
  txt: { label: 'Plain text (.txt)', ext: 'txt', mime: 'text/plain;charset=utf-8' },
  rtf: { label: 'Rich Text Format (.rtf) — opens in Word, Pages, WordPad', ext: 'rtf', mime: 'application/rtf' },
  odt: { label: 'OpenDocument Text (.odt) — LibreOffice, Word, Google Docs', ext: 'odt', mime: 'application/vnd.oasis.opendocument.text' },
};
