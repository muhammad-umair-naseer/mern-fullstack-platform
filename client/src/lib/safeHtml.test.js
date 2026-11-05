import { sanitizeHtml, sandboxDocument } from './safeHtml';
describe('untrusted HTML isolation', () => {
  test('removes executable markup, handlers, and dangerous navigation', () => {
    const html = sanitizeHtml('<script>alert(1)</script><img src=x onerror=alert(1)><iframe src="/"></iframe><a href="javascript:alert(1)">click</a><form action="/">bad</form>');
    expect(html).not.toMatch(/<script|onerror|<iframe|javascript:|<form/i);
  });
  test('isolated document blocks scripts and outbound requests while preserving static styling', () => {
    const html = sandboxDocument('<style>body{background:red}</style><h1>Hello</h1>');
    expect(html).toContain("script-src 'none'");
    expect(html).toContain("connect-src 'none'");
    expect(html).toContain('<h1>Hello</h1>');
  });
});
