import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ToolIcon from '../../learn/ToolIcon';

/**
 * One tool in the catalogue: a compact glass row with the icon, the name, one
 * line of description and an arrow disc. The full description lives on the
 * tool's own page, so the catalogue reads as a list of names, not paragraphs.
 *
 * Memoised because the catalogue re-renders on every filter change while almost
 * every card's props are unchanged. `tool` objects come from a module-level
 * constant, so their identity is stable and the default shallow compare is
 * enough.
 */
const ToolCard = ({ tool }) => (
  <Link to={`/tools/${tool.slug}`} data-card className="cx-tool">
    <span className="cx-tool-icon" aria-hidden="true">
      <ToolIcon category={tool.category} className="h-[18px] w-[18px]" />
    </span>
    <span className="cx-tool-body">
      <h3 className="cx-tool-name">{tool.name}</h3>
      <span className="cx-tool-desc">{tool.description}</span>
    </span>
    <span className="cx-tool-go" aria-hidden="true">
      <ArrowUpRight size={14} strokeWidth={1.6} />
    </span>
  </Link>
);

export default React.memo(ToolCard);
