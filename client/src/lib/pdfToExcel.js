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

export async function convertPdfsToExcel(files, onProgress, signal) {
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

  onProgress?.({ progress: 90, message: 'Generating Excel (.xlsx) file…' });
  await yieldToMain();

  const outBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([outBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const baseName = files.length === 1 ? files[0].name.replace(/\.pdf$/i, '') : 'extracted-tables';

  onProgress?.({ progress: 100, message: 'Excel spreadsheet generated successfully!' });
  return {
    blob,
    filename: `${baseName}.xlsx`,
    previewData,
    sheetCount: previewData.length,
  };
}
