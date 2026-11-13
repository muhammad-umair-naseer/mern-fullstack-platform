/**
 * Responsive photos. A photo registry globs its own folder twice: once for the
 * plain URLs and once with vite-imagetools for 480/800/1200 px versions (made
 * at build time; a width above the original is not upscaled). This matches
 * them by URL and gives every photo object found in `values` (nested objects
 * and arrays included) a srcSet next to its src. A component then renders
 * <img src={p.src} srcSet={p.srcSet} sizes="…">, and a phone downloads the
 * small version instead of the full-size file.
 */
export function addSrcSets(urls, sets, values) {
  const bySrc = {};
  for (const key in urls) bySrc[urls[key]] = sets[key];
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (typeof v.src === 'string' && bySrc[v.src]) v.srcSet = bySrc[v.src];
    Object.values(v).forEach(walk);
  };
  walk(values);
}
