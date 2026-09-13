/**
 * Client-Side PDF -> Excel Converter Engine
 * Extracts text coordinates and tabular data from PDF pages, generates XLSX worksheets using SheetJS.
 */

import * as XLSX from 'xlsx';
import { pdfjsLib, yieldToMain } from './pdfCommon';

function clusterColumns(xs, tol = 12) {
  xs.sort((a, b) => a - b);
  const clusters = [];
  xs.forEach((x) => {
    let c = clusters.find((cl) => Math.abs(cl.center - x) <= tol);
    if (c) {
      c.sum += x;
      c.n += 1;
      c.center = c.sum / c.n;
    } else {
      clusters.push({ center: x, sum: x, n: 1 });
    }
  });
  clusters.sort((a, b) => a.center - b.center);
  return clusters.map((c) => c.center);
}

function nearestIndex(value, arr) {
  let best = 0;
  let bestDist = Infinity;
  arr.forEach((v, i) => {
    const d = Math.abs(v - value);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

export async function extractPdfToSheets(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const sheets = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items.filter((it) => it.str && it.str.trim() !== '');

    if (items.length === 0) {
      sheets.push({
        name: `p${p}`,
        rows: [['(no extractable text — possibly a scanned image page)']],
      });
      continue;
    }

    // Group into lines by vertical coordinate Y
    const yTol = 3.5;
    const lines = [];
    items.forEach((it) => {
      const y = it.transform[5];
      const x = it.transform[4];
      let line = lines.find((l) => Math.abs(l.y - y) <= yTol);
      if (!line) {
        line = { y, items: [] };
        lines.push(line);
      }
      line.items.push({ x, str: it.str });
    });
    lines.sort((a, b) => b.y - a.y);
    lines.forEach((l) => l.items.sort((a, b) => a.x - b.x));

    // Determine column anchors from all X starting points
    const allX = [];
    lines.forEach((l) => l.items.forEach((it) => allX.push(it.x)));
    const columns = clusterColumns(allX, 12);

    const rows = lines.map((line) => {
      const row = new Array(columns.length).fill('');
      line.items.forEach((it) => {
        const idx = nearestIndex(it.x, columns);
        row[idx] = row[idx] ? row[idx] + ' ' + it.str : it.str;
      });
      return row;
    });

    // Drop empty columns
    const usedCols = [];
    for (let c = 0; c < columns.length; c++) {
      if (rows.some((r) => r[c] !== '')) usedCols.push(c);
    }
    const trimmedRows = rows.map((r) => usedCols.map((c) => r[c]));

    sheets.push({ name: `Page_${p}`, rows: trimmedRows });
  }

  return sheets;
}

function sanitizeSheetName(name) {
  return name.replace(/[\\/?*[\]:]/g, '-').slice(0, 31) || 'Sheet';
}

/** Output formats of the spreadsheet suite. Excel-only callers never see these. */
export const SHEET_FORMATS = {
  xlsx: { label: 'Excel workbook (.xlsx)', ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  xls: { label: 'Excel 97-2003 (.xls)', ext: 'xls', mime: 'application/vnd.ms-excel' },
  ods: { label: 'OpenDocument spreadsheet (.ods) — LibreOffice, Google Sheets', ext: 'ods', mime: 'application/vnd.oasis.opendocument.spreadsheet' },
  csv: { label: 'CSV (.csv) — one file per sheet, zipped when there are several', ext: 'csv', mime: 'text/csv;charset=utf-8', perSheet: true },
  txt: { label: 'Tab-separated text (.tsv)', ext: 'tsv', mime: 'text/tab-separated-values;charset=utf-8', perSheet: true },
  html: { label: 'HTML table (.html)', ext: 'html', mime: 'text/html;charset=utf-8', perSheet: true },
};

/**
 * @param {File[]} files
 * @param {(p: {progress:number, message:string}) => void} [onProgress]
 * @param {AbortSignal} [signal]
 * @param {{ format?: keyof typeof SHEET_FORMATS }} [options]  default xlsx
 */
export async function convertPdfsToExcel(files, onProgress, signal, { format = 'xlsx' } = {}) {
  if (!files || files.length === 0) {
    throw new Error('Please select at least one PDF file.');
  }

  onProgress?.({ progress: 5, message: 'Processing PDF documents…' });
  await yieldToMain();

  const wb = XLSX.utils.book_new();
  const previewData = [];

  for (let i = 0; i < files.length; i++) {
    if (signal?.aborted) throw new Error('Operation aborted');
    const file = files[i];
    const pct = Math.round(10 + ((i + 1) / files.length) * 75);
    onProgress?.({
      progress: pct,
      message: `Extracting data from ${file.name} (${i + 1} of ${files.length})…`,
    });
    await yieldToMain();

    const sheets = await extractPdfToSheets(file);
    const base = file.name.replace(/\.pdf$/i, '');

    sheets.forEach((s) => {
      const rawName = files.length > 1 ? `${base}_${s.name}` : s.name;
      const sheetName = sanitizeSheetName(rawName);

      const ws = XLSX.utils.aoa_to_sheet(s.rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      previewData.push({
        sheetName,
        fileName: file.name,
        data: s.rows,
      });
    });
  }

  const spec = SHEET_FORMATS[format] || SHEET_FORMATS.xlsx;
  onProgress?.({ progress: 90, message: `Generating ${spec.ext.toUpperCase()} file…` });
  await yieldToMain();

  let blob;
  let ext = spec.ext;
  if (spec.perSheet && wb.SheetNames.length > 1) {
    // CSV, TSV and HTML hold one sheet each, so several sheets become a zip.
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    wb.SheetNames.forEach((name) => {
      const single = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(single, wb.Sheets[name], name);
      zip.file(`${name}.${spec.ext}`, XLSX.write(single, { bookType: format, type: 'array' }));
    });
    blob = new Blob([await zip.generateAsync({ type: 'uint8array' })], { type: 'application/zip' });
    ext = 'zip';
  } else {
    const outBuffer = XLSX.write(wb, { bookType: format, type: 'array' });
    blob = new Blob([outBuffer], { type: spec.mime });
  }

  const baseName = files.length === 1 ? files[0].name.replace(/\.pdf$/i, '') : 'extracted-tables';

  onProgress?.({ progress: 100, message: 'Spreadsheet generated successfully!' });
  return {
    blob,
    filename: `${baseName}.${ext}`,
    format,
    ext,
    previewData,
    sheetCount: previewData.length,
  };
}
