import DOMPurify from 'dompurify';
import html2canvas from 'html2canvas';

export const sanitizeHtml = html => DOMPurify.sanitize(String(html), {
  USE_PROFILES: { html: true }, ADD_TAGS: ['style'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'base', 'link', 'meta', 'form', 'input', 'button', 'textarea', 'select', 'video', 'audio'],
  FORBID_ATTR: ['srcset', 'action', 'formaction', 'autofocus'],
});
export const sandboxDocument = html => `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'"></head><body style="margin:0">${sanitizeHtml(html)}</body></html>`;
export async function createRenderSandbox(html, width = 794) {
  if (String(html).length > 2_000_000) throw new Error('HTML input exceeds the 2 MB limit');
  const frame = document.createElement('iframe');
  frame.title = 'Isolated document renderer';
  frame.setAttribute('sandbox', 'allow-same-origin'); // Deliberately excludes scripts, forms, navigation and popups.
  frame.style.cssText = 'position:fixed;left:-20000px;top:0;border:0;pointer-events:none;height:1200px';
  frame.style.width = Math.max(100, Math.min(1920, Number(width) || 794)) + 'px';
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Document rendering timed out')), 5000);
    frame.onload = () => { clearTimeout(timer); resolve(); };
  });
  frame.srcdoc = sandboxDocument(html);
  document.body.appendChild(frame);
  try { await ready; return { container: frame.contentDocument.body, remove: () => frame.remove() }; }
  catch (err) { frame.remove(); throw err; }
}
export async function captureHtml(html, width, options = {}) {
  const sandbox = await createRenderSandbox(html, width);
  try {
    return await html2canvas(sandbox.container, { logging: false, backgroundColor: null, ...options, useCORS: false, allowTaint: false });
  } finally { sandbox.remove(); }
}
