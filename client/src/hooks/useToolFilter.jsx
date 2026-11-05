import { useDeferredValue, useMemo, useState } from 'react';
import { TOOLS, CATEGORIES } from '../data/tools';

/**
 * Search + category filtering for the tools catalogue.
 *
 * The query is deferred: the input stays immediate while the 62-card grid
 * re-renders at lower priority. Without that, every keystroke reconciled all
 * 62 cards, which measured at ~435ms of script for eight characters.
 */
export function useToolFilter() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const deferredQ = useDeferredValue(q);
  const isStale = q !== deferredQ;

  const filtered = useMemo(() => {
    const qx = deferredQ.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesCat = cat === 'All' || tool.category === cat;
      const matchesQ =
        !qx ||
        tool.name.toLowerCase().includes(qx) ||
        tool.description.toLowerCase().includes(qx);
      return matchesCat && matchesQ;
    });
  }, [deferredQ, cat]);

  // Grouped so a 62-item list still reads as an organised catalogue.
  const grouped = useMemo(
    () =>
      CATEGORIES.map((c) => ({ ...c, items: filtered.filter((x) => x.category === c.id) })).filter(
        (g) => g.items.length
      ),
    [filtered]
  );

  return { q, setQ, cat, setCat, filtered, grouped, isStale };
}
