/**
 * Helper to parse and structure Blog Markdown content into:
 * - Table of Contents (TOC) items
 * - Interactive FAQ items
 * - Cleaned Markdown body (without raw markdown TOC/FAQ text)
 */

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseBlogContent(markdown) {
  if (!markdown) return { toc: [], faqs: [], cleanedBody: '' };

  const lines = markdown.split('\n');
  const toc = [];
  const faqs = [];

  let inFaqSection = false;
  let inTocSection = false;
  let currentFaq = null;
  const bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect Table of Contents header in markdown
    if (/^##\s+(table of contents|contents|in this article)/i.test(trimmed)) {
      inTocSection = true;
      continue;
    }

    // Detect FAQ header in markdown
    if (/^##\s+(frequently asked questions|faq|faqs)/i.test(trimmed)) {
      inFaqSection = true;
      inTocSection = false;
      if (currentFaq) {
        faqs.push(currentFaq);
        currentFaq = null;
      }
      continue;
    }

    // Detect any other H2 section header
    if (/^##\s+/.test(trimmed)) {
      if (inFaqSection && currentFaq) {
        faqs.push(currentFaq);
        currentFaq = null;
      }
      inFaqSection = false;
      inTocSection = false;

      const title = trimmed.replace(/^##\s+/, '').trim();
      const id = slugify(title);
      toc.push({ title, id, level: 2 });
      bodyLines.push(line);
      continue;
    }

    // If inside TOC section, skip raw markdown TOC lines
    if (inTocSection) {
      // Once we hit non-list text or next heading, stop skipping
      if (!trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.startsWith('1.') && trimmed !== '') {
        inTocSection = false;
        bodyLines.push(line);
      }
      continue;
    }

    // If inside FAQ section, parse questions (H3) and answers
    if (inFaqSection) {
      if (/^###\s+/.test(trimmed)) {
        if (currentFaq) faqs.push(currentFaq);
        const question = trimmed.replace(/^###\s+/, '').trim();
        currentFaq = { question, answer: [] };
      } else if (currentFaq) {
        if (trimmed === '---') {
          // Footer reached
          faqs.push(currentFaq);
          currentFaq = null;
          inFaqSection = false;
          bodyLines.push(line);
        } else {
          currentFaq.answer.push(line);
        }
      }
      continue;
    }

    bodyLines.push(line);
  }

  if (currentFaq) {
    faqs.push(currentFaq);
  }

  // Format FAQ answers
  const formattedFaqs = faqs.map((f) => ({
    question: f.question,
    answer: f.answer.join('\n').trim(),
  }));

  const cleanedBody = bodyLines.join('\n').trim();

  return {
    toc,
    faqs: formattedFaqs,
    cleanedBody,
  };
}
