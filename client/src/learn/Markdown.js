import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
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
  text: '',
};

/**
 * A fenced code block, with the language named and the sample one click away.
 *
 * Course bodies are full of code a learner is meant to actually run, and
 * retyping it from a scrollable box is where people give up. No syntax
 * highlighter is pulled in for this: it would be a new dependency on the
 * critical path of the page learners spend the most time on.
 */
const CodeBlock = ({ children }) => {
  const [status, setStatus] = useState('idle');
  const code = React.Children.toArray(children)[0];
  const className = code?.props?.className || '';
  const lang = (/language-([\w+#-]+)/.exec(className) || [])[1] || '';
  const label = lang in LANG_LABEL ? LANG_LABEL[lang] : lang.toUpperCase();
  const source = textOf(children).replace(/\n$/, '');

  // The async clipboard API is refused more often than you would expect: a page
  // served over plain http, a browser that wants a stricter user gesture, a
  // locked down corporate profile. Falling back to execCommand covers all of
  // those, and if even that fails the button says so rather than doing nothing.
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

// Lesson bodies rendered as rich high-contrast Markdown for clean white theme
const Markdown = ({ children }) => (
  <div
    className="cx-md prose prose-slate max-w-none
      prose-headings:font-extrabold prose-headings:text-black
      prose-h1:text-3xl prose-h1:text-black prose-h1:font-extrabold prose-h1:mt-8 prose-h1:mb-4
      prose-h2:text-2xl prose-h2:text-black prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
      prose-h3:text-xl prose-h3:text-black prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3
      prose-h4:text-lg prose-h4:text-black prose-h4:font-bold
      prose-p:text-black prose-p:font-medium prose-p:leading-relaxed prose-p:text-base
      prose-li:text-black prose-li:font-medium prose-li:leading-relaxed
      prose-strong:text-black prose-strong:font-bold
      prose-b:text-black prose-b:font-bold
      prose-em:text-black prose-em:font-medium
      prose-a:text-orange-600 prose-a:font-bold hover:prose-a:text-orange-700
      prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:border prose-code:border-orange-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl
      prose-th:text-black prose-th:font-extrabold prose-th:border-b prose-th:border-slate-300
      prose-td:text-black prose-td:font-medium prose-td:border-b prose-td:border-slate-200
      prose-blockquote:text-black prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50/60 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:font-medium"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock, table: Table }}>
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
