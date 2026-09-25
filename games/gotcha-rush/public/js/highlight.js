import { escapeHtml } from './ui.js';

/**
 * A small, dependency-free syntax highlighter for the two languages in the
 * bank. Tokenises with one regex per language and wraps tokens in spans.
 */
const JS_KW = new Set('async await break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new of return static super switch this throw try typeof var void while with yield'.split(' '));
const JS_LIT = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
const JS_BUILTIN = new Set('console log Promise setTimeout queueMicrotask Math JSON Object Array String Number Boolean Symbol Set Map BigInt Error TypeError parseInt parseFloat isNaN'.split(' '));
const PY_KW = new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const PY_LIT = new Set(['True', 'False', 'None']);
const PY_BUILTIN = new Set('print len range list dict set tuple str int float bool sum sorted zip map isinstance hash all any round type copy repr enumerate'.split(' '));

const RULES = {
  js: {
    re: /(\/\/[^\n]*)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d[\w.]*n?\b|\b0x[\da-fA-F]+\b)|(\b[A-Za-z_$][\w$]*\b)|(=>|[+\-*/%=<>!&|^~?:.,;(){}\[\]])|(\s+)|(.)/g,
    kw: JS_KW, lit: JS_LIT, builtin: JS_BUILTIN,
  },
  py: {
    re: /(#[^\n]*)|([fFbBrR]?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b\d[\w.]*\b)|(\b[A-Za-z_]\w*\b)|(:=|\*\*|\/\/|[+\-*/%=<>!&|^~?:.,;(){}\[\]@])|(\s+)|(.)/g,
    kw: PY_KW, lit: PY_LIT, builtin: PY_BUILTIN,
  },
};

export function highlight(code, lang) {
  const R = RULES[lang] || RULES.js;
  let out = '';
  let m;
  R.re.lastIndex = 0;
  while ((m = R.re.exec(code)) !== null) {
    const [tok, comment, str, num, ident, punct, ws, other] = m;
    if (comment) out += `<span class="tk-c">${escapeHtml(comment)}</span>`;
    else if (str) out += `<span class="tk-s">${escapeHtml(str)}</span>`;
    else if (num) out += `<span class="tk-n">${escapeHtml(num)}</span>`;
    else if (ident) {
      const cls = R.kw.has(ident) ? 'tk-k' : R.lit.has(ident) ? 'tk-l' : R.builtin.has(ident) ? 'tk-b' : /^[A-Z]/.test(ident) ? 'tk-t' : 'tk-i';
      out += `<span class="${cls}">${escapeHtml(ident)}</span>`;
    } else if (punct) out += `<span class="tk-p">${escapeHtml(punct)}</span>`;
    else out += escapeHtml(ws || other || tok);
    if (m.index === R.re.lastIndex) R.re.lastIndex++;
  }
  return out;
}

/** Highlighted code split into per-line HTML strings (for line-by-line reveal). */
export function highlightLines(code, lang) {
  return code.replace(/\n$/, '').split('\n').map((line) => highlight(line, lang) || '&nbsp;');
}
