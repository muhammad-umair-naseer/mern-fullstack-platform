export function confirmRemoteCapture(input) {
  const text = input.trim();
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`);
  const host = url.hostname.toLowerCase();
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost') || /^[\d.]+$/.test(host) || host.includes(':')) {
    throw new Error('Use a public HTTP(S) website address without credentials. Local addresses and IP literals are not supported.');
  }
  if (!window.confirm('Remote capture sends this URL to Thum.io and/or Microlink. The provider fetches its content and applies its own retention policy. Do not submit private, signed, or login URLs. Continue?')) throw new Error('Remote capture cancelled.');
  return url.href;
}
