import React from 'react';

/**
 * A photo from one of the registries (lib/srcSet.js): AVIF for browsers that
 * take it, WebP otherwise, each at 320-1200 px so the browser picks the size
 * that fits `sizes`. <picture> is display: contents (index.css), so layout
 * and styling see the <img> exactly as if it stood alone.
 */
const Photo = ({ src, srcSet, avifSrcSet, sizes, ...img }) => (
  avifSrcSet ? (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <img src={src} srcSet={srcSet} sizes={sizes} {...img} />
    </picture>
  ) : (
    <img src={src} srcSet={srcSet} sizes={sizes} {...img} />
  )
);

export default Photo;
