import React, { useEffect, useRef, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Braces,
  Check,
  FileText,
  Film,
  Globe,
  Image as ImageIcon,
  Lock,
  LockOpen,
  Music,
  Palette,
  PenTool,
  Presentation,
  QrCode,
  Table,
  Type,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { toolsDeskPhoto, toolsMediaPhoto } from '../../assets/unique';
import './ToolDetailVisual.css';

gsap.registerPlugin(useGSAP);

/**
 * The tool page hero: a file going through the tool.
 *
 * A frosted card on the left is the file you bring. A copper line scans down
 * it, a glass capsule fills, and a paper card on the right is revealed as the
 * result, with a tick landing on its corner. What each card shows is worked
 * out from the tool's own name: "PDF → Excel" goes from a page of text to a
 * sheet, "MP4 → GIF" from a film frame to a picture, a compressor's result
 * settles smaller, a rotator's turns, a protector's gets a lock. Nothing is
 * claimed that the name does not already say: the format tags are words taken
 * from the tool's name, and no sizes or percentages are shown.
 *
 * The loop is CSS keyframes on transform and opacity, so the prerendered page
 * moves without script; it pauses while the hero is off screen. GSAP only adds
 * a little pointer depth on fine pointers. With reduced motion every
 * animation is removed and the cards rest on the finished state.
 *
 *   tool        the catalogue entry ({ slug, name, category })
 *   count       how many tools share its category (a real, computed number)
 */

// What a word in a tool's name looks like as a file.
const KIND_OF = {
  pdf: 'doc', word: 'doc', docx: 'doc', doc: 'doc', txt: 'doc', rtf: 'doc', odt: 'doc',
  text: 'doc', markdown: 'doc', ebook: 'doc', epub: 'doc',
  excel: 'sheet', xlsx: 'sheet', xls: 'sheet', csv: 'sheet', spreadsheet: 'sheet', ods: 'sheet', tsv: 'sheet',
  powerpoint: 'slides', pptx: 'slides', presentation: 'slides',
  image: 'image', images: 'image', jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', gif: 'image',
  heic: 'image', avif: 'image', bmp: 'image', tiff: 'image', psd: 'image', exif: 'image', meme: 'image', favicon: 'image',
  svg: 'vector', vector: 'vector', cad: 'vector',
  mp4: 'video', webm: 'video', video: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', opus: 'audio', m4a: 'audio', aac: 'audio', audio: 'audio', ringtone: 'audio',
  json: 'code', xml: 'code', yaml: 'code', sql: 'code', html: 'code', css: 'code', jwt: 'code', base64: 'code',
  url: 'code', regex: 'code', hash: 'code', uuid: 'code', timestamp: 'code',
  zip: 'archive', archive: 'archive', tar: 'archive',
  website: 'web', web: 'web',
  font: 'font', qr: 'qr', colour: 'colour',
};

// Words that are file formats, shown as the card's tag in the name's own case.
const FORMATS = new Set([
  'pdf', 'word', 'docx', 'txt', 'rtf', 'odt', 'markdown', 'ebook', 'excel', 'xlsx', 'csv', 'powerpoint',
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'avif', 'bmp', 'tiff', 'psd', 'svg', 'mp4', 'webm',
  'mp3', 'wav', 'ogg', 'opus', 'm4a', 'aac', 'json', 'xml', 'yaml', 'sql', 'html', 'css', 'jwt',
  'base64', 'zip',
]);

// Application names count as formats only in a converter's name: "PDF ↔ Word"
// is a Word file, "Word & Character Counter" is not.
const APP_NAMES = new Set(['word', 'excel', 'powerpoint']);

const CATEGORY_KIND = { pdf: 'doc', image: 'image', video: 'video', audio: 'audio', convert: 'doc', web: 'web', dev: 'code' };

// Tools whose name does not say what goes in and what comes out.
const PAIRS = {
  'qr-generator': ['code', 'qr'],
  'colour-picker': ['image', 'colour'],
  'css-generator': ['colour', 'code'],
  'create-archive': ['doc', 'archive'],
  'extract-archive': ['archive', 'doc'],
};

// What the tool does to the file, read from its name.
const VERBS = [
  [/compress|optimi[sz]/i, 'smaller'],
  [/enlarg/i, 'larger'],
  [/resiz/i, 'resize'],
  [/crop/i, 'crop'],
  [/rotate/i, 'rotate'],
  [/grayscale/i, 'gray'],
  [/redact/i, 'redact'],
  [/blur|censor|pixelat/i, 'blur'],
  [/unlock/i, 'unlock'],
  [/protect/i, 'lock'],
  [/e-sign/i, 'sign'],
  [/page numbers/i, 'number'],
  [/background remover/i, 'cutout'],
  [/merg|create archive/i, 'merge'],
  [/split|extract pages|page remover|extract archive/i, 'split'],
];

const ICON = {
  doc: FileText,
  sheet: Table,
  slides: Presentation,
  image: ImageIcon,
  vector: PenTool,
  video: Film,
  audio: Music,
  code: Braces,
  archive: Archive,
  web: Globe,
  font: Type,
  qr: QrCode,
  colour: Palette,
};

const CHIP_LABEL = {
  pdf: 'free PDF tools',
  image: 'free image tools',
  video: 'free video & GIF tools',
  audio: 'free audio tools',
  convert: 'free converters',
  web: 'free web tools',
  dev: 'free utilities',
};

const words = (s) => s.split(/[^A-Za-z0-9]+/).filter(Boolean);
const kindIn = (ws) => ws.map((w) => KIND_OF[w.toLowerCase()]).find(Boolean);
const formatIn = (ws, converts) =>
  ws.find((w) => FORMATS.has(w.toLowerCase()) && (converts || !APP_NAMES.has(w.toLowerCase())));

function readTool(tool) {
  const name = tool.name;
  let from = name;
  let to = '';
  // "PDF → Excel", "Image to PDF", "Save Web as PDF": the source comes first.
  const fwd = name.match(/^(.*?)\s*(?:→|↔|\sto\s|\sas\s)\s*(.+)$/);
  // "Extract Images from PDF": the source comes last.
  const back = name.match(/^(.*?)\sfrom\s(.+)$/);
  if (fwd) [, from, to] = fwd;
  else if (back) [, to, from] = back;

  const fromW = words(from);
  const toW = words(to);
  const fallback = CATEGORY_KIND[tool.category] || 'doc';

  let inKind = kindIn(fromW) || fallback;
  let outKind = kindIn(toW) || inKind;
  if (/screenshot/i.test(name)) [inKind, outKind] = ['web', 'image'];
  if (PAIRS[tool.slug]) [inKind, outKind] = PAIRS[tool.slug];

  const converts = Boolean(fwd || back);
  // "GIF Maker" names what comes out, not what goes in.
  const makes = !converts && /maker|generator/i.test(name);
  const inTag = makes ? undefined : formatIn(fromW, converts);
  // Carry the source's format over only when the file stays the same kind.
  const outTag = makes ? formatIn(fromW) : formatIn(toW, converts) || (outKind === inKind ? inTag : undefined);
  const verb = (VERBS.find(([re]) => re.test(name)) || [])[1] || 'plain';

  return { inKind, outKind, inTag, outTag, verb };
}

export default function ToolDetailVisual({ tool, count }) {
  const scope = useRef(null);
  const [paused, setPaused] = useState(false);
  const { inKind, outKind, inTag, outTag, verb } = readTool(tool);

  // Stop the loop while the hero is scrolled away; the tool below it is what
  // the visitor is using by then.
  useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray('[data-depth]', scope.current).map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope }
  );

  const Mark = verb === 'lock' ? Lock : verb === 'unlock' ? LockOpen : Check;

  return (
    <div className={`tdv tdv--${verb}${paused ? ' is-paused' : ''}`} ref={scope}>
      <div className="tdv-photo" aria-hidden="true">
        <div className="tdv-drift">
          <img src={toolsDeskPhoto.src} alt="" decoding="async" />
        </div>
        <span className="lx-pv-sheen" />
      </div>

      <div className="tdv-slot tdv-slot--in" style={{ '--i': 0 }} aria-hidden="true">
        <div className="tdv-depth" data-depth="-12">
          <div className="tdv-tilt">
            {verb === 'merge' && (
              <>
                <span className="tdv-ghost tdv-ghost--1 lx-glass" />
                <span className="tdv-ghost tdv-ghost--2 lx-glass" />
              </>
            )}
            <div className="tdv-card tdv-card--in lx-glass">
              <Head kind={inKind} tag={inTag} />
              <span className="tdv-face">
                <span className="tdv-face-in">
                  <Face kind={inKind} />
                </span>
                <span className="tdv-scan" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="tdv-slot tdv-slot--flow" style={{ '--i': 1 }} aria-hidden="true">
        <div className="tdv-depth" data-depth="6">
          <span className="tdv-flow lx-glass">
            <span className="tdv-flow-track">
              <span className="tdv-flow-fill" />
            </span>
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        </div>
      </div>

      <div className="tdv-slot tdv-slot--out" style={{ '--i': 2 }} aria-hidden="true">
        <div className="tdv-depth" data-depth="18">
          <div className="tdv-tilt">
            {verb === 'split' && <span className="tdv-ghost tdv-ghost--out" />}
            <div className="tdv-card tdv-card--out">
              <Head kind={outKind} tag={outTag} out />
              <span className="tdv-face">
                <span className="tdv-face-in">
                  <Face kind={outKind} />
                </span>
                {verb === 'redact' && (
                  <span className="tdv-redact"><i /><i /></span>
                )}
                {verb === 'sign' && (
                  <svg className="tdv-sign" viewBox="0 0 120 40" fill="none">
                    <path d="M4 30c10-2 14-22 22-22s-4 26 6 26 10-18 16-18-2 16 6 16 12-12 20-12 6 8 12 8 14-6 30-8" />
                  </svg>
                )}
                {verb === 'number' && <span className="tdv-pageno">1</span>}
                {verb === 'crop' && <span className="tdv-cropmarks" />}
                <span className="tdv-veil" />
              </span>
              <span className="tdv-done">
                <Mark size={15} strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="tdv-slot tdv-slot--chip" style={{ '--i': 3 }}>
          <div className="tdv-depth" data-depth="-6">
            <p className="tdv-chip lx-glass">
              <span className="tdv-chip-value tabular">{count}</span>
              <span className="tdv-chip-label">{CHIP_LABEL[tool.category] || 'free tools'}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Bar lengths for the drawn contents, fixed so the prerendered HTML and the
// client render agree.
const DOC_LINES = [92, 84, 96, 70, 88, 54];
const CODE_LINES = [[0, 46, 'k'], [1, 62, ''], [2, 38, 's'], [2, 52, ''], [1, 30, 'k'], [0, 20, '']];
const WAVE = [34, 58, 42, 80, 64, 96, 52, 74, 40, 88, 60, 46, 70, 36, 56, 28];
const QR_SIZE = 21;
const QR_CELLS = (() => {
  // A deterministic scatter of modules around the three finder squares. It
  // is decoration, not a code: there is nothing to scan.
  const cells = [];
  let seed = 7;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      if (!inFinder(x, y) && seed / 2147483648 > 0.52) cells.push([x, y]);
    }
  }
  return cells;
})();

// The card's top row: what kind of file it is, its format when the tool's
// name gives one, and the little menu dots every file card has.
function Head({ kind, tag, out = false }) {
  const Icon = ICON[kind] || FileText;
  return (
    <span className="tdv-head">
      <span className={`tdv-kind${out ? ' tdv-kind--out' : ''}`}>
        <Icon size={13} strokeWidth={1.75} />
      </span>
      {tag && <span className={`tdv-tag${out ? ' tdv-tag--out' : ''}`}>{tag}</span>}
      <span className="tdv-dots"><i /><i /><i /></span>
    </span>
  );
}

function Face({ kind }) {
  switch (kind) {
    case 'image':
      return (
        <span className="tdv-img">
          <img src={toolsMediaPhoto.src} alt="" decoding="async" />
        </span>
      );
    case 'video':
      return (
        <span className="tdv-img tdv-video">
          <img src={toolsMediaPhoto.src} alt="" decoding="async" />
          <span className="tdv-play" />
          <span className="tdv-timeline"><i /></span>
        </span>
      );
    case 'audio':
      return (
        <span className="tdv-wave">
          {WAVE.map((h, i) => (
            <i key={i} style={{ '--h': `${h}%`, '--i': i }} />
          ))}
        </span>
      );
    case 'sheet':
      return (
        <span className="tdv-sheet">
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} className={i < 3 ? 'is-head' : i % 3 === 0 ? 'is-key' : ''} />
          ))}
        </span>
      );
    case 'code':
      return (
        <span className="tdv-code">
          {CODE_LINES.map(([indent, w, tone], i) => (
            <span className="tdv-code-row" key={i}>
              <b>{i + 1}</b>
              <i className={tone} style={{ marginLeft: `${indent * 12}%`, width: `${w}%` }} />
            </span>
          ))}
        </span>
      );
    case 'web':
      return (
        <span className="tdv-web">
          <span className="tdv-web-bar"><i /><i /><i /><b /></span>
          <span className="tdv-web-hero" />
          <span className="tdv-web-line" />
          <span className="tdv-web-line is-short" />
        </span>
      );
    case 'slides':
      return (
        <span className="tdv-slides">
          <span className="tdv-slide-main"><b /><i /><i /></span>
          <span className="tdv-slide-row"><i /><i /><i /></span>
        </span>
      );
    case 'archive':
      return (
        <span className="tdv-archive">
          <span className="tdv-zip" />
          <span className="tdv-zip-pull" />
        </span>
      );
    case 'vector':
      return (
        <svg className="tdv-vector" viewBox="0 0 100 100" fill="none">
          <path className="tdv-vector-handle" d="M16 74 L30 22 M84 70 L70 20" />
          <path className="tdv-vector-curve" d="M16 74 C30 22 70 20 84 70" />
          <rect x="12" y="70" width="8" height="8" />
          <rect x="80" y="66" width="8" height="8" />
          <circle cx="30" cy="22" r="3.5" />
          <circle cx="70" cy="20" r="3.5" />
        </svg>
      );
    case 'qr':
      return (
        <svg className="tdv-qr" viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`}>
          {[[0, 0], [14, 0], [0, 14]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="7" height="7" rx="1.2" className="tdv-qr-ring" />
              <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.6" />
            </g>
          ))}
          {QR_CELLS.map(([x, y]) => (
            <rect key={`${x}.${y}`} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" rx="0.2" />
          ))}
        </svg>
      );
    case 'colour':
      return (
        <span className="tdv-colour">
          <i /><i /><i /><i />
          <b>#9A4A22</b>
        </span>
      );
    case 'font':
      return (
        <span className="tdv-font">
          <b>Aa</b>
          <i>Aa Bb Cc</i>
        </span>
      );
    default:
      return (
        <span className="tdv-doc">
          <b />
          {DOC_LINES.map((w, i) => (
            <i key={i} style={{ width: `${w}%` }} />
          ))}
        </span>
      );
  }
}
