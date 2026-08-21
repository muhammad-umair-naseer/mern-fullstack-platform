import React from 'react';
import { Link } from 'react-router-dom';
import ToolIcon from '../../learn/ToolIcon';

/**
 * One tool in the catalogue.
 *
 * Memoised because the catalogue re-renders on every filter change while almost
 * every card's props are unchanged. `tool` objects come from a module-level
 * constant, so their identity is stable and the default shallow compare is
 * enough — no custom comparator needed.
 */
const ToolCard = ({ tool }) => (
  <Link to={`/tools/${tool.slug}`} data-card className="cx-tool bg-white p-5 shadow-card flex flex-col">
    <span className="cx-tool-wash" aria-hidden="true" />

    <div className="relative flex items-start gap-3">
      <span className="cx-tool-icon grid place-items-center h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-600">
        <ToolIcon category={tool.category} className="h-5 w-5" />
      </span>
      <h3 className="text-base font-semibold text-slate-900 leading-snug pt-1.5">{tool.name}</h3>
    </div>

    <p className="relative mt-3 text-sm text-slate-600 flex-1">{tool.description}</p>

    <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
      Open tool
      <span className="cx-tool-arrow" aria-hidden="true">→</span>
    </span>
  </Link>
);

export default React.memo(ToolCard);
