// Cortexis website embedding helper
(function () {
  const embedded = (() => {
    try {
      return window.self !== window.top;
    } catch (_) {
      return true;
    }
  })();
  if (!embedded) return;
  document.documentElement.classList.add('in-frame');

  // 1. Report size to parent GameFrame so it can size the iframe dynamically
  const MAX_HEIGHT = 1400;
  let lastH = 0;
  function reportSize() {
    const doc = document.documentElement;
    const h = Math.min(MAX_HEIGHT, Math.ceil(Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0)));
    if (Math.abs(h - lastH) <= 4) return;
    lastH = h;
    try {
      window.parent.postMessage({ type: 'cortexis:size', height: h }, '*');
    } catch (_) {}
  }

  window.addEventListener('resize', reportSize);
  window.addEventListener('hashchange', () => setTimeout(reportSize, 60));
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => reportSize());
    if (document.body) ro.observe(document.body);
  }
  setTimeout(reportSize, 100);
  setInterval(reportSize, 1000);

  // 2. SSO bridge with Cortexis website
  try {
    window.parent.postMessage({ type: 'cortexis:need-token' }, '*');
  } catch (_) {}

  window.addEventListener('message', async (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'cortexis:game-token' && typeof d.token === 'string') {
      try {
        const curToken = localStorage.getItem('sg_token');
        const res = await fetch('/api/auth/cortexis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameToken: d.token, token: curToken }),
        });
        if (res.ok) {
          const authData = await res.json();
          if (authData.token && authData.token !== curToken) {
            localStorage.setItem('sg_token', authData.token);
          }
          if (authData.name) {
            const nameInput = document.getElementById('nameInput');
            if (nameInput) {
              nameInput.value = authData.name;
              nameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        }
      } catch (_) {}
    }
  });
})();
