import React from 'react';

/**
 * A photo from one of the registries (lib/srcSet.js): AVIF for browsers that
 * take it, WebP otherwise, each at 320-1200 px so the browser picks the size
 * that fits `sizes`. Decoding is async unless a site asks otherwise, so a
 * large image never decodes on the main thread. <picture> is display: contents (index.css), so layout
 * and styling see the <img> exactly as if it stood alone.
 */
const Photo = ({ src, srcSet, avifSrcSet, sizes, decoding = 'async', ...img }) => (
  avifSrcSet ? (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <img src={src} srcSet={srcSet} sizes={sizes} decoding={decoding} {...img} />
    </picture>
  ) : (
    <img src={src} srcSet={srcSet} sizes={sizes} decoding={decoding} {...img} />
  )
);

export default Photo;
