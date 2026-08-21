import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Lesson bodies rendered as rich high-contrast Markdown for clean white theme
const Markdown = ({ children }) => (
  <div
    className="prose prose-slate max-w-none
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
      prose-table:block prose-table:overflow-x-auto
      prose-th:text-black prose-th:font-extrabold prose-th:border-b prose-th:border-slate-300
      prose-td:text-black prose-td:font-medium prose-td:border-b prose-td:border-slate-200
      prose-blockquote:text-black prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50/60 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:font-medium"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

export default Markdown;
