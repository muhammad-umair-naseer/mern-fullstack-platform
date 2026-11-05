import { useDeferredValue, useMemo, useState } from 'react';

/**
 * Search + category filtering shared by the Courses, Services and Internships
 * catalogues, which each had their own identical copy of this logic.
 *
 * `searchable` returns the fields a query should match for one item, so each
 * page keeps its own notion of what is searchable without duplicating the
 * state, trimming and category handling.
 *
 * The query is deferred so typing stays responsive while the grid re-renders
 * at lower priority.
 */
export function useCatalogueFilter(items, searchable) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const deferredQ = useDeferredValue(q);
  const isStale = q !== deferredQ;

  const filtered = useMemo(() => {
    const qx = deferredQ.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCat = cat === 'All' || item.category === cat;
      const matchesQ =
        !qx ||
        searchable(item).some((field) => (field || '').toLowerCase().includes(qx));
      return matchesCat && matchesQ;
    });
    // `searchable` is defined inline by callers; including it would defeat the
    // memo, and it is pure, so the item list and query are the real inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQ, cat, items]);

  return { q, setQ, cat, setCat, filtered, isStale };
}
