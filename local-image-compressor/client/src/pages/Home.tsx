/**
 * Simple Utility direction: a focused document composer with a clean print preview.
 * Text is rendered into a PDF in browser memory; no page content is uploaded.
 */
import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Globe2, MonitorDown, RefreshCcw, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";

const BRAND_MARK = "/manus-storage/shrinkroom-mark_c396756c.png";
const starterBody = "Paste or write the webpage content you want to save here.\n\nYou can use this space for articles, notes, documentation, or any text that should become a printable PDF. The entire document is prepared locally in your browser.";

type PaperSize = "a4" | "letter";
type Orientation = "portrait" | "landscape";

const paperLabels: Record<PaperSize, string> = { a4: "A4", letter: "Letter" };
const formatDate = () => new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date());

const addWrappedText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number, pageHeight: number, margin: number) => {
  const paragraphs = text.split("\n");
  let cursor = y;
  paragraphs.forEach((paragraph, index) => {
    const lines = pdf.splitTextToSize(paragraph || " ", maxWidth) as string[];
    lines.forEach((line) => {
      if (cursor > pageHeight - margin) {
        pdf.addPage();
        cursor = margin;
      }
      pdf.text(line, x, cursor);
      cursor += lineHeight;
    });
    if (index < paragraphs.length - 1) cursor += lineHeight * 0.45;
  });
  return cursor;
};

export default function Home() {
  const [title, setTitle] = useState("A saved webpage");
  const [subtitle, setSubtitle] = useState("A clean, printable copy");
  const [sourceUrl, setSourceUrl] = useState("");
  const [body, setBody] = useState(starterBody);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [isDownloading, setIsDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Shrinkroom — Save Web as PDF";
    return () => { document.title = "Shrinkroom — Color Picker"; };
  }, []);

  const fileName = useMemo(() => `${title.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "saved-webpage"}.pdf`, [title]);
  const pageWord = orientation === "portrait" ? "portrait" : "landscape";

  const downloadPdf = () => {
    if (!title.trim() || !body.trim()) {
      setNotice("Add a title and some webpage content before saving the PDF.");
      return;
    }
    setIsDownloading(true);
    setNotice("");
    try {
      const pdf = new jsPDF({ orientation, unit: "mm", format: paperSize });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = orientation === "portrait" ? 20 : 18;
      const contentWidth = pageWidth - margin * 2;
      pdf.setProperties({ title: title.trim(), subject: subtitle.trim() || "Saved webpage", author: "Shrinkroom" });
      pdf.setFillColor(39, 106, 134);
      pdf.rect(margin, margin, 14, 2, "F");
      pdf.setTextColor(37, 40, 36);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      let cursor = margin + 16;
      cursor = addWrappedText(pdf, title.trim(), margin, cursor, contentWidth, 9, pageHeight, margin);
      if (subtitle.trim()) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(108, 119, 115);
        cursor += 3;
        cursor = addWrappedText(pdf, subtitle.trim(), margin, cursor, contentWidth, 5.5, pageHeight, margin);
      }
      if (sourceUrl.trim()) {
        pdf.setFontSize(8.5);
        pdf.setTextColor(39, 106, 134);
        cursor += 3;
        cursor = addWrappedText(pdf, sourceUrl.trim(), margin, cursor, contentWidth, 4.2, pageHeight, margin);
      }
      pdf.setDrawColor(223, 227, 224);
      pdf.line(margin, cursor + 5, pageWidth - margin, cursor + 5);
      cursor += 17;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(37, 40, 36);
      addWrappedText(pdf, body.trim(), margin, cursor, contentWidth, 5.8, pageHeight, margin);
      const pageCount = pdf.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        pdf.setPage(page);
        pdf.setDrawColor(223, 227, 224);
        pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(141, 150, 145);
        pdf.text(`Saved locally · ${formatDate()}`, margin, pageHeight - 8);
        pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
      }
      pdf.save(fileName);
      setNotice(`Downloaded ${fileName}`);
    } catch {
      setNotice("The PDF could not be created in this browser.");
    } finally {
      setIsDownloading(false);
    }
  };

  const clearContent = () => {
    setTitle("");
    setSubtitle("");
    setSourceUrl("");
    setBody("");
    setNotice("");
  };

  return (
    <div className="simple-app pdf-app">
      <header className="simple-header"><div className="simple-brand"><img src={BRAND_MARK} alt="" /><span>shrinkroom</span></div><div className="privacy-note"><ShieldCheck size={15} /> Files stay on your device</div></header>
      <main className="simple-main">
        <section className="intro"><p className="simple-kicker">SAVE WEB AS PDF</p><h1>Save a page as PDF</h1><p>Paste webpage text, preview the printable page, and download a PDF in your browser.</p></section>
        <section className="compressor-card pdf-card">
          <div className="pdf-editor-head"><div><strong>Page details</strong><span>Prepare the content you want to save</span></div><button type="button" className="clear-link" onClick={clearContent}>Clear all</button></div>
          <div className="pdf-fields">
            <label className="pdf-field"><span>Page title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Page title" /></label>
            <label className="pdf-field"><span>Subtitle <em>optional</em></span><input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Short description" /></label>
            <label className="pdf-field pdf-url-field"><span>Source URL <em>optional</em></span><input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://example.com/article" type="url" /></label>
            <label className="pdf-field pdf-body-field"><span>Webpage content</span><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Paste or write the webpage content here" rows={10} /></label>
          </div>
          <div className="pdf-preview-label"><span><MonitorDown size={15} /> Print preview</span><small>Updates as you type</small></div>
          <div className={`pdf-paper pdf-paper-${pageWord}`}><div className="pdf-paper-accent" /><h2>{title || "Untitled page"}</h2>{subtitle && <h3>{subtitle}</h3>}{sourceUrl && <p className="pdf-paper-url">{sourceUrl}</p>}<div className="pdf-paper-rule" /><p className="pdf-paper-body">{body || "Your webpage content will appear here."}</p><div className="pdf-paper-footer"><span>Saved locally · {formatDate()}</span><span>{paperLabels[paperSize]} · {orientation}</span></div></div>
          <div className="pdf-controls"><label className="simple-control"><span>Paper size</span><select value={paperSize} onChange={(event) => setPaperSize(event.target.value as PaperSize)}><option value="a4">A4</option><option value="letter">Letter</option></select></label><label className="simple-control"><span>Orientation</span><select value={orientation} onChange={(event) => setOrientation(event.target.value as Orientation)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><button type="button" className="primary-button" onClick={downloadPdf} disabled={isDownloading}><Download size={16} /> {isDownloading ? "Creating PDF…" : "Download PDF"}</button></div>
          {notice && <p className="simple-notice">{notice}</p>}
          <div className="pdf-local-note"><FileText size={15} /><span>PDF created locally in your browser. No page content is sent to a server.</span></div>
        </section>
        <p className="simple-footnote"><Globe2 size={15} /> This tool creates a printable copy from content you provide; it does not fetch or upload external webpages.</p>
      </main>
      <footer className="simple-footer">shrinkroom · browser PDF maker</footer>
    </div>
  );
}
