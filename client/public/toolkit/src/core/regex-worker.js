self.onmessage = ({ data: { pattern, flags, text, replacement } }) => {
  try {
    if (pattern.length > 2000 || text.length > 100000 || replacement.length > 2000) throw new Error('Input too large: pattern/replacement 2,000 characters; text 100,000.');
    const re = new RegExp(pattern, flags), matches = [];
    if (re.global || re.sticky) {
      for (const match of text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))) {
        matches.push({ values: [...match], index: match.index, groups: match.groups });
        if (matches.length >= 1000) break;
      }
    } else { const match = re.exec(text); if (match) matches.push({ values: [...match], index: match.index, groups: match.groups }); }
    const replaced = text.replace(new RegExp(pattern, flags), replacement);
    if (replaced.length > 1000000) throw new Error('Replacement exceeds 1 million characters.');
    self.postMessage({ matches, replaced });
  } catch (e) { self.postMessage({ error: e.message }); }
};
