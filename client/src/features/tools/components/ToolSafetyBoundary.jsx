import { useState } from 'react';
import { checkFiles } from '../../../../public/toolkit/src/core/limits.js';

const limitations = {
  'pdf-word': 'PDF to Word extracts text. Original columns, tables and page layout are not preserved; scans need OCR first.',
  'pdf-powerpoint': 'PDF pages become slide images, not editable PowerPoint shapes or text.',
  'presentation-converter': 'PowerPoint conversion supports text/notes extraction; original slide layout and animations are not preserved.',
  'pdf-flatten': 'Only supported form fields are flattened. Annotation/layer flattening is unavailable. Read-only flags depend on the PDF reader and are not access control.',
  'pdf-excel': 'Tables are inferred from text positions. Check cells and columns manually; scans require OCR and complex tables may not be reconstructed.',
  'pdf-spreadsheet-suite': 'Spreadsheet output is inferred from PDF text. Check extracted cells and formulas; original workbook structure is unavailable.',
  'docx-to-pdf': 'Supported DOCX text and formatting are reconstructed. Complex Office layouts, embedded objects and fonts may differ.',
  'xlsx-to-pdf': 'Worksheet values are rendered as tables. Excel print layouts, charts and macros are not preserved.',
  'cad-converter': 'Only supported ASCII DXF entities are handled. DWG, 3D and full CAD fidelity are unavailable.',
  'font-converter': 'Font support depends on the input format. WOFF2 decoding is unavailable; use TTF, OTF or WOFF inputs.',
  'pdf-redact': 'Export rebuilds every page from pixels. Text search, forms, links, attachments and signatures are removed. Review all marked regions before sharing.',
  'pdf-protect': 'AES-256 encryption. Use a strong, unique password of at least 8 characters. Copy/print restrictions depend on the PDF reader and are not DRM.',
  'heic-to-jpg': 'HEIC decoding depends on your browser and installed codecs. Files are tested locally before conversion; unsupported files are rejected.',
};
export default function ToolSafetyBoundary({ slug, children }) {
  const [error, setError] = useState('');
  const guard = event => {
    const files = event.type === 'drop' ? event.dataTransfer?.files : event.type === 'paste' ? event.clipboardData?.files : event.target.files;
    if (!files?.length) return;
    try { checkFiles(files); setError(''); }
    catch (err) { event.preventDefault(); event.stopPropagation(); if (event.target.type === 'file') event.target.value = ''; setError(err.message); }
  };
  return <div onChangeCapture={guard} onDropCapture={guard} onPasteCapture={guard}>
    <p className="text-sm text-slate-400 mb-4">Local processing limits: 50 MB per file, 20 files and 100 MB per selection. Some tools have stricter limits. Large or complex files can still exceed device memory.</p>
    {limitations[slug] && <p className="text-sm text-amber-400 mb-4">{limitations[slug]}</p>}
    {error && <p role="alert" className="text-sm text-red-400 mb-4">{error}</p>}
    {children}
  </div>;
}
