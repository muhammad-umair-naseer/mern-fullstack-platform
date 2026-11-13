/**
 * Responsive photos. A photo registry globs its own folder twice: once for the
 * plain URLs and once with vite-imagetools for 320/480/640/800/1200 px versions (made
 * at build time; a width above the original is not upscaled). This matches
 * them by URL and gives every photo object found in `values` (nested objects
 * and arrays included) a srcSet next to its src, and an avifSrcSet when the
 * registry passes AVIF versions (rendered by components/Photo.jsx). A component then renders
 * <img src={p.src} srcSet={p.srcSet} sizes="…">, and a phone downloads the
 * small version instead of the full-size file. Returns a lookup (url -> srcset)
 * for registries whose photos are plain URLs.
 */
export function addSrcSets(urls, sets, values, avifSets = {}) {
  const bySrc = {};
  const avifBySrc = {};
  for (const key in urls) { bySrc[urls[key]] = sets[key]; avifBySrc[urls[key]] = avifSets[key]; }
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (typeof v.src === 'string' && bySrc[v.src]) {
      v.srcSet = bySrc[v.src];
      if (avifBySrc[v.src]) v.avifSrcSet = avifBySrc[v.src];
    }
    Object.values(v).forEach(walk);
  };
  walk(values);
  const lookup = (url) => bySrc[url];
  lookup.avif = (url) => avifBySrc[url];
  return lookup;
}
