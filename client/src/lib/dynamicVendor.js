/**
 * Dynamic Vendor Script & Library Loader
 * Efficiently loads scripts from /vendor on demand with Promise caching.
 */

const loadedScripts = new Map();

export function loadVendorScript(src) {
  if (loadedScripts.has(src)) {
    return loadedScripts.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    // Check if already in DOM
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(new Error(`Failed to load ${src}`)));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = (e) => {
      loadedScripts.delete(src);
      reject(new Error(`Failed to load vendor script: ${src}`));
    };
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}

export async function loadZipLib() {
  await loadVendorScript('/vendor/zip.min.js');
  return window.zip;
}

export async function loadXlsxLib() {
  await loadVendorScript('/vendor/xlsx.full.min.js');
  return window.XLSX;
}

export async function loadGifEncLib() {
  await loadVendorScript('/vendor/gifenc.min.js');
  return window.gifenc;
}

export async function loadGifUctLib() {
  await loadVendorScript('/vendor/gifuct.min.js');
  return window.GIF || window.gifuct;
}

export async function loadOpenTypeLib() {
  await loadVendorScript('/vendor/opentype.min.js');
  return window.opentype;
}
