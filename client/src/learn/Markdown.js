import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '../lib/blogParser';
import './Markdown.css';

// Flattens a react-markdown code node back to the raw text, so the copy button
// hands over exactly what was in the fence.
const textOf = (node) => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node?.props?.children) return textOf(node.props.children);
  return '';
};

const LANG_LABEL = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  swift: 'Swift',
  lua: 'Lua',
  markdown: 'Markdown',
  md: 'Markdown',
  diff: 'Diff',
  rego: 'Rego',
  gherkin: 'Gherkin',
  neon: 'NEON',
  gitignore: '.gitignore',
  gitconfig: '.gitconfig',
  gitattributes: '.gitattributes',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  php: 'PHP',
  dart: 'Dart',
  cpp: 'C++',
  c: 'C',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  dockerfile: 'Dockerfile',
  csharp: 'C#',
  cs: 'C#',
  kotlin: 'Kotlin',
  xml: 'XML',
  dax: 'DAX',
  powerquery: 'Power Query M',
  m: 'Power Query M',
  excel: 'Excel',
  http: 'HTTP',
  hcl: 'HCL',
  ini: 'INI',
  toml: 'TOML',
  properties: 'Properties',
  gradle: 'Gradle',
  groovy: 'Groovy',
  nginx: 'Nginx',
  cmake: 'CMake',
  blade: 'Blade',
  promql: 'PromQL',
  text: '',
};

/**
 * A fenced code block, with the language named and the sample one click away.
 */
const CodeBlock = ({ children }) => {
  const [status, setStatus] = useState('idle');
  const code = React.Children.toArray(children)[0];
  const className = code?.props?.className || '';
  const lang = (/language-([\w+#-]+)/.exec(className) || [])[1] || '';
  const label = lang in LANG_LABEL ? LANG_LABEL[lang] : lang.toUpperCase();
  const source = textOf(children).replace(/\n$/, '');

  const copy = useCallback(async () => {
    const viaTextarea = () => {
      const el = document.createElement('textarea');
      el.value = source;
      el.setAttribute('readonly', '');
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(el);
      el.select();
      let done = false;
      try {
        done = document.execCommand('copy');
      } catch {
        done = false;
      }
      document.body.removeChild(el);
      return done;
    };

    let done = false;
    try {
      await navigator.clipboard.writeText(source);
      done = true;
    } catch {
      done = viaTextarea();
    }

    setStatus(done ? 'copied' : 'failed');
    setTimeout(() => setStatus('idle'), 1800);
  }, [source]);

  return (
    <div className="cx-code">
      <div className="cx-code-bar">
        <span className="cx-code-lang">{label}</span>
        <button
          type="button"
          onClick={copy}
          className={`cx-code-copy is-${status}`}
          aria-label="Copy code"
        >
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Select and copy' : 'Copy'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
};

// Wide tables scroll inside their own box rather than pushing the article out.
const Table = ({ children }) => (
  <div className="cx-md-table">
    <table>{children}</table>
  </div>
);

// Headings carry an id from their text, so a table of contents can link to
// them. Their type and spacing live in Markdown.css.
const Heading2 = ({ children }) => {
  const id = slugify(textOf(children));
  return (
    <h2 id={id} className="cx-md-h2">
      {children}
    </h2>
  );
};

const Heading3 = ({ children }) => {
  const id = slugify(textOf(children));
  return (
    <h3 id={id} className="cx-md-h3">
      {children}
    </h3>
  );
};

// Lesson and blog bodies. The typography is set in Markdown.css against the
// house tokens rather than through prose-* utilities: one of those utilities
// (prose-pre:bg-slate-900) put "bg-slate-9" in the wrapper's class list, which
// the theme's dark-panel rule matched, and every paragraph rendered pale grey.
const Markdown = ({ children }) => (
  <div className="cx-md prose max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: CodeBlock,
        table: Table,
        h2: Heading2,
        h3: Heading3,
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
