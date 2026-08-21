import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Lesson bodies are authored as Markdown on the server. `prose-invert` matches
// the cosmic theme; the overrides below stop tables and code blocks from
// forcing the page to scroll horizontally on a phone.
const Markdown = ({ children }) => (
  <div
    className="prose prose-invert max-w-none
      prose-headings:font-bold prose-headings:text-slate-100
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-slate-300 prose-li:text-slate-300
      prose-strong:text-white
      prose-a:text-indigo-300
      prose-code:text-sky-300 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
      prose-table:block prose-table:overflow-x-auto
      prose-th:text-slate-200 prose-td:text-slate-300"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

export default Markdown;
