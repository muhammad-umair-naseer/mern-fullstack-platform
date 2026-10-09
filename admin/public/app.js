// Cortexis admin portal. Signs in against the site API (/api/auth/login) and
// reads everything through /api/admin/*, which only the one admin account
// (ADMIN_EMAIL on the API) can use. Hash routes, one section per view.
(() => {
  const API = (window.ADMIN_API_URL || `${location.protocol}//${location.hostname}:5000`).replace(/\/$/, '');
  const SITE = (window.ADMIN_SITE_URL || `${location.protocol}//${location.hostname}:3000`).replace(/\/$/, '');
  const KEY = 'cortexis.admin.token';
  const $ = (id) => document.getElementById(id);
  const view = $('view');
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let me = {};
  let group = '';
  const store = {
    get: () => { try { return sessionStorage.getItem(KEY); } catch { return null; } },
    set: (t) => { try { t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY); } catch { /* private mode */ } },
  };

  /* ---------- small helpers ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => Number(n || 0).toLocaleString('en-GB');
  const date = (v) => {
    if (!v) return '<span class="dim">—</span>';
    const d = new Date(typeof v === 'number' ? v : String(v));
    return Number.isNaN(+d) ? '' : `<time datetime="${d.toISOString()}" title="${esc(d.toLocaleString('en-GB'))}">${esc(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}</time>`;
  };
  const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u) : '');
  const certLink = (code) => (code ? `<a class="mono" href="${esc(SITE)}/certificate/${encodeURIComponent(code)}" target="_blank" rel="noopener">${esc(code)}</a>` : '<span class="dim">—</span>');
  const progress = (done, total) => {
    const p = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
    return `<span class="prog" title="${num(done)} of ${num(total)} topics"><i style="transform:scaleX(${p / 100})"></i></span><span class="mono small">${p}%</span>`;
  };
  // the best timed final, else the score on a certificate earned before the timed final existed
  const finalCell = (r) => {
    const v = r.bestFinal ?? r.certificateScore;
    return v == null ? '<span class="dim">not taken</span>' : `${num(v)}%`;
  };
  const flag = (cc) => (/^[A-Z]{2}$/.test(cc || '') && cc !== 'UN' ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '');

  function table(cols, rows, empty) {
    if (!rows.length) return `<p class="state">${esc(empty || 'Nothing here yet.')}</p>`;
    return `<div class="table-wrap glass"><table><thead><tr>${cols.map((c) => `<th class="${c.cls || ''}">${esc(c.label)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r, i) => `<tr style="--i:${Math.min(i, 14)}">${cols.map((c) => `<td class="${c.cls || ''}">${c.cell(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function pager(total, page, size) {
    const pages = Math.max(1, Math.ceil(total / size));
    return `<div class="pager"><span class="muted">${num(total)} in total</span><div>
      <button class="btn btn-sm" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} type="button">Previous</button>
      <span class="mono small">Page ${page} of ${pages}</span>
      <button class="btn btn-sm" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''} type="button">Next</button></div></div>`;
  }
  const head = (title, em, sub, back) => `<header class="head">${back ? `<a class="back" href="${back}">← Back</a>` : group ? `<p class="eyebrow">${esc(group)}</p>` : ''}
    <h1>${esc(title)}${em ? ` <em>${esc(em)}</em>` : ''}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</header>`;
  const stat = (n, label, href) => `<${href ? `a href="${esc(href)}"` : 'div'} class="stat glass"><b${typeof n === 'number' ? ` data-count="${n}"` : ''}>${typeof n === 'number' ? num(n) : esc(n)}</b><span>${esc(label)}</span></${href ? 'a' : 'div'}>`;

  // The arrow disc at the end of a primary pill.
  const DISC = '<span class="disc" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>';
  const GAME_IMG = { 'gotcha-rush': 1, typedash: 1, pickparty: 1 };
  const SKELETON = `<div class="skel" aria-label="Loading"><i class="s-eye"></i><i class="s-title"></i>
    <div class="s-row"><i></i><i></i><i></i><i></i></div><i class="s-line"></i><i class="s-line"></i><i class="s-line"></i></div>`;

  // A number that counts up from 0 to its exact value, eased out.
  function countUp(el) {
    const to = Number(el.dataset.count);
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      el.textContent = num(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = num(0);
    requestAnimationFrame(tick);
  }
  // After a view lands: stagger its tiles and cards, count its numbers up.
  function settle() {
    view.querySelectorAll('.stats, .cards, .game-cards').forEach((box) => [...box.children].forEach((el, i) => {
      el.style.setProperty('--i', Math.min(i, 12));
      el.classList.add('rise-card');
    }));
    // rows rise only when the view arrives, not when search or the pager redraws them
    view.querySelectorAll('tbody tr').forEach((tr) => tr.classList.add('rise-row'));
    view.classList.remove('enter');
    void view.offsetWidth;
    view.classList.add('enter');
    if (still()) return;
    const counters = view.querySelectorAll('[data-count]');
    if (!counters.length) return;
    view.setAttribute('aria-busy', 'true');   // read the final numbers, not the count
    counters.forEach(countUp);
    setTimeout(() => view.removeAttribute('aria-busy'), 950);
  }

  async function api(path, { method = 'GET', body } = {}) {
    const token = store.get();
    const res = await fetch(`${API}/api${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if ((res.status === 401 || res.status === 403) && token) signOut();
    if (!res.ok) throw Object.assign(new Error(data.message || `Request failed (${res.status})`), { status: res.status });
    return data;
  }

  /* ---------- per-section filters, kept while you move around ---------- */
  const state = {};
  const st = (key, init) => (state[key] = state[key] || { page: 1, search: '', ...init });

  // A search box that re-runs the current view after a pause in typing.
  function bindSearch(key, rerun) {
    const box = view.querySelector('input[type=search]');
    if (!box) return;
    let t;
    box.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state[key].search = box.value.trim(); state[key].page = 1; rerun(); }, 300); });
  }
  function bindPager(key, rerun) {
    view.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => { state[key].page = Number(b.dataset.page); rerun(); }));
  }
  // A delete can empty the last page: step back one and redraw.
  const pastEnd = (s, rows) => !(rows && rows.length) && s.page > 1 && (s.page -= 1, true);
  const searchBox = (key, placeholder) => `<input type="search" value="${esc(state[key].search)}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}">`;

  /* ---------- edit and delete: one edit sheet, one confirm sheet ---------- */
  // Rows the buttons point at, by "kind:id", so a click finds its data.
  const rec = new Map();
  const keep = (key, row) => { rec.set(key, row); return esc(key); };
  // A row's buttons: [action, label, brick?, own key?]. Action names live in ACT below.
  const acts = (key, list) => `<div class="actions">${list.filter(Boolean).map(([act, label, brick, own]) =>
    `<button class="btn btn-sm${brick ? ' btn-brick' : ''}" data-act="${act}" data-ref="${own || key}" type="button">${esc(label)}</button>`).join('')}</div>`;
  const enc = encodeURIComponent;

  let onScreen = () => {};   // the view on screen, re-run after a change
  async function refresh() {
    try { await onScreen(); } catch (err) {
      if (err.status !== 401 && err.status !== 403) view.innerHTML = `<p class="state error">Could not load this section: ${esc(err.message)}</p>`;
    }
    badges();
  }

  let toastTimer;
  function toast(text) {
    const t = $('toast');
    t.textContent = text;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2400);
  }

  // Focus goes back to the button that opened the sheet, or to its twin after
  // the view re-rendered, or to another button on the same row (Restore after
  // Remove), or to the view when the row is gone.
  let opener = null;
  function refocus() {
    if (!opener) return;
    const { act, ref } = opener.dataset;
    const sameRef = `[data-ref="${CSS.escape(ref || '')}"]`;
    const el = opener.isConnected ? opener : view.querySelector(`[data-act="${CSS.escape(act || '')}"]${sameRef}`) || view.querySelector(`button${sameRef}`);
    (el || view).focus({ preventScroll: !el });
    opener = null;
  }

  // Run a write from a sheet: busy button, errors stay in the sheet, success
  // closes it, says so (work may return its own words), and redraws the view.
  async function commit(dlg, btn, errBox, work, said) {
    btn.disabled = true;
    errBox.hidden = true;
    try {
      const go = await work();
      if (typeof go === 'function') { go(); badges(); } else await refresh();
      dlg.close();
      toast(typeof go === 'string' ? go : said);
    } catch (err) {
      errBox.textContent = err.message;
      errBox.hidden = false;
    } finally {
      btn.disabled = false;
    }
  }

  // fields: [{ name, label, value, type: text|email|url|number|textarea|checkbox, required, max, wide, attrs }]
  // save(changed) gets only the fields that changed.
  function editSheet(what, fields, save) {
    const dlg = $('edit-dialog');
    $('edit-title').innerHTML = `Edit <em>${esc(what)}</em>`;
    $('edit-fields').innerHTML = fields.map((f) => {
      const attrs = `name="${esc(f.name)}"${f.required ? ' required' : ''}${f.max ? ` maxlength="${f.max}"` : ''} ${f.attrs || ''}`;
      if (f.type === 'checkbox') return `<label class="check wide"><input type="checkbox" ${attrs} ${f.value ? 'checked' : ''}> ${esc(f.label)}</label>`;
      if (f.type === 'textarea') return `<label class="wide">${esc(f.label)}<textarea ${attrs} rows="${f.rows || 4}">${esc(f.value)}</textarea></label>`;
      return `<label class="${f.wide ? 'wide' : ''}">${esc(f.label)}<input type="${f.type || 'text'}" ${attrs} value="${esc(f.value)}"></label>`;
    }).join('');
    $('edit-error').hidden = true;
    $('edit-form').onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const changed = {};
      for (const f of fields) {
        const el = form.elements[f.name];
        const v = f.type === 'checkbox' ? el.checked : f.type === 'number' ? Number(el.value) : el.value.trim();
        if (f.type === 'checkbox' || f.type === 'number' ? v !== f.value : v !== String(f.value ?? '')) changed[f.name] = v;
      }
      if (!Object.keys(changed).length) { dlg.close(); return toast('Nothing changed'); }
      commit(dlg, form.querySelector('[type=submit]'), $('edit-error'), () => save(changed), 'Saved');
    };
    dlg.showModal();
    dlg.querySelector('input, textarea').focus();
  }

  // A plain confirm. gate: an email the admin must type to enable the button.
  // after: what to do instead of redrawing (e.g. leave a deleted student's page).
  function confirmSheet({ title, em, body, gate, verb = 'Delete', said = 'Deleted', run, after }) {
    const dlg = $('confirm-dialog');
    const go = $('confirm-go');
    const box = $('confirm-input');
    $('confirm-title').innerHTML = `${esc(title)} <em>${esc(em)}</em>?`;
    $('confirm-body').innerHTML = body;
    $('confirm-gate').hidden = !gate;
    $('confirm-email').textContent = gate || '';
    $('confirm-error').hidden = true;
    box.value = '';
    go.textContent = verb;
    const ok = () => !gate || box.value.trim().toLowerCase() === String(gate).toLowerCase();
    go.disabled = !ok();
    box.oninput = () => { go.disabled = !ok(); };
    $('confirm-form').onsubmit = (e) => {
      e.preventDefault();
      if (!ok()) return;
      commit(dlg, go, $('confirm-error'), async () => { await run(); return after; }, said);
    };
    dlg.showModal();
    (gate ? box : $('confirm-dialog').querySelector('[data-close]')).focus();
  }

  // Changes that need no confirm (bringing a course back) still say so.
  async function quick(btn, work, said) {
    btn.disabled = true;
    try { await work(); await refresh(); toast(said); refocus(); }
    catch (err) { alert(err.message); btn.disabled = false; }
  }

  const NO_UNDO = ' This cannot be undone.';
  const ACT = {
    'course-edit': (c) => editSheet('course', [
      { name: 'title', label: 'Title', value: c.title, required: true, max: 200, wide: true },
      { name: 'summary', label: 'Summary', value: c.summary, type: 'textarea', max: 5000, rows: 3 },
      { name: 'description', label: 'Description', value: c.description, type: 'textarea', max: 5000, rows: 6 },
      { name: 'category', label: 'Category', value: c.category, required: true, max: 200 },
      { name: 'level', label: 'Level', value: c.level, required: true, max: 200 },
      { name: 'duration', label: 'Duration', value: c.duration, required: true, max: 200 },
    ], (b) => api(`/admin/courses/${enc(c.slug)}`, { method: 'PATCH', body: b })),
    'course-hide': (c) => confirmSheet({
      title: 'Remove from the', em: 'website', verb: 'Remove from website', said: 'Removed from the website',
      body: `<b>${esc(c.title)}</b> leaves the catalogue and its page for everyone not enrolled, and nobody new can enrol. Learners already enrolled keep their lessons, quizzes and certificates. You can restore it at any time.`,
      run: () => api(`/admin/courses/${enc(c.slug)}`, { method: 'DELETE' }),
    }),
    'course-show': (c, btn) => quick(btn, () => api(`/admin/courses/${enc(c.slug)}`, { method: 'PATCH', body: { hidden: false } }), 'Back on the website'),
    'course-reset': (c) => confirmSheet({
      title: 'Reset to the', em: 'original', verb: 'Reset', said: 'Reset to original',
      body: `Your edits to <b>${esc(c.title)}</b> (title, summary, description, category, level, duration) are thrown away and the course shows the text from the course files again.`,
      run: () => api(`/admin/courses/${enc(c.slug)}/reset`, { method: 'POST' }),
    }),
    'user-edit': (u) => editSheet('student', [
      { name: 'name', label: 'Name', value: u.name, required: true, max: 100, wide: true, attrs: 'minlength="2"' },
      { name: 'email', label: 'Email', value: u.email, type: 'email', required: true, wide: true },
      { name: 'emailVerified', label: 'Email verified', value: !!u.emailVerified, type: 'checkbox' },
    ], (b) => api(`/admin/users/${enc(u.id)}`, { method: 'PATCH', body: b })),
    'user-delete': (u) => confirmSheet({
      title: 'Delete this', em: 'student', gate: u.email,
      body: `<b>${esc(u.name)}</b> (${esc(u.email)}) and everything tied to the account are deleted: ${num(u.courses)} enrolment${u.courses === 1 ? '' : 's'} with all progress, quiz and final exam attempts, ${num(u.certificates)} certificate${u.certificates === 1 ? '' : 's'} and any Claude Pro applications.${NO_UNDO}`,
      run: () => api(`/admin/users/${enc(u.id)}`, { method: 'DELETE' }),
      after: u.leave ? () => { location.hash = '#/students'; } : undefined,
    }),
    'enrol-remove': (r) => confirmSheet({
      title: 'Remove from this', em: 'course', verb: 'Remove from course', said: 'Removed from the course', gate: r.email,
      body: `<b>${esc(r.name)}</b> (${esc(r.email)}) is taken out of <b>${esc(r.title)}</b> and the course is reset for them: their enrolment, topic progress, quiz and final exam attempts${r.code ? `, certificate <span class="mono">${esc(r.code)}</span>` : ''} and any Claude Pro application for this course are deleted.${NO_UNDO}`,
      run: () => api(`/admin/users/${enc(r.userId)}/courses/${enc(r.slug)}`, { method: 'DELETE' }),
    }),
    'cert-edit': (c) => editSheet('certificate', [
      { name: 'score', label: `Score for ${c.code} (0 to 100)`, value: Number(c.score), type: 'number', required: true, wide: true, attrs: 'min="0" max="100" step="1"' },
    ], (b) => api(`/admin/certificates/${enc(c.id)}`, { method: 'PATCH', body: b })),
    'cert-revoke': (c) => confirmSheet({
      title: 'Revoke this', em: 'certificate', verb: 'Revoke', said: 'Certificate revoked',
      body: `Certificate <span class="mono">${esc(c.code)}</span> for <b>${esc(c.userName)}</b> in ${esc(c.courseTitle)} is deleted, and its public verification page will say it was not found.${NO_UNDO}`,
      run: async () => {
        let id = c.id;   // the student page knows the code only
        if (id == null) {
          const { data } = await api(`/admin/certificates?${new URLSearchParams({ search: c.code })}`);
          const hit = data.rows.find((x) => x.code === c.code);
          if (!hit) throw new Error('That certificate no longer exists.');
          id = hit.id;
        }
        return api(`/admin/certificates/${enc(id)}`, { method: 'DELETE' });
      },
    }),
    'intern-edit': (a) => editSheet('application', [
      { name: 'name', label: 'Name', value: a.name, required: true, max: 200 },
      { name: 'email', label: 'Email', value: a.email, type: 'email', required: true },
      { name: 'phone', label: 'Phone', value: a.phone, type: 'tel', max: 40 },
      { name: 'internshipTitle', label: 'Internship', value: a.internshipTitle, required: true, max: 200 },
      { name: 'resumeLink', label: 'Resume link', value: a.resumeLink, type: 'url', wide: true },
      { name: 'coverLetter', label: 'Cover letter', value: a.coverLetter, type: 'textarea', rows: 6 },
    ], (b) => api(`/admin/internships/${enc(a.id)}`, { method: 'PATCH', body: b })),
    'intern-delete': (a) => confirmSheet({
      title: 'Delete this', em: 'application',
      body: `The internship application from <b>${esc(a.name)}</b> (${esc(a.email)}) for ${esc(a.internshipTitle)} is deleted, cover letter and resume link with it.${NO_UNDO}`,
      run: () => api(`/admin/internships/${enc(a.id)}`, { method: 'DELETE' }),
    }),
    'msg-edit': (m) => editSheet('message', [
      { name: 'name', label: 'Name', value: m.name, required: true, max: 200 },
      { name: 'email', label: 'Email', value: m.email, type: 'email', required: true },
      { name: 'phone', label: 'Phone', value: m.phone, type: 'tel', max: 40 },
      { name: 'subject', label: 'Subject', value: m.subject, max: 200 },
      { name: 'message', label: 'Message', value: m.message, type: 'textarea', required: true, rows: 6 },
    ], (b) => api(`/admin/messages/${enc(m.id)}`, { method: 'PATCH', body: b })),
    'msg-delete': (m) => confirmSheet({
      title: 'Delete this', em: 'message',
      body: `The message from <b>${esc(m.name)}</b> (${esc(m.email)})${m.subject ? `, "${esc(m.subject)}"` : ''}, is deleted.${NO_UNDO}`,
      run: () => api(`/admin/messages/${enc(m.id)}`, { method: 'DELETE' }),
    }),
    'cp-delete': (a) => confirmSheet({
      title: 'Delete this', em: 'application',
      body: `The Claude Pro application from <b>${esc(a.userName)}</b> (${esc(a.userEmail)}) for ${esc(a.courseTitle)} is deleted. Their course and certificate stay.${NO_UNDO}`,
      run: () => api(`/admin/claude-pro/${enc(a.id)}`, { method: 'DELETE' }),
    }),
    'player-edit': (p) => editSheet('player', [
      { name: 'name', label: 'Name', value: p.name, required: true, max: 16, wide: true },
      { name: 'country', label: 'Country (2 letters)', value: p.country, max: 2, attrs: 'pattern="[A-Za-z]{2}" autocapitalize="characters"' },
      { name: 'points', label: 'Points', value: Number(p.points) || 0, type: 'number', required: true, attrs: 'min="0" step="1"' },
    ], async (b) => {
      const { data } = await api(`/admin/games/${enc(p.game)}/players/${enc(p.id)}`, { method: 'PATCH', body: b.country ? { ...b, country: b.country.toUpperCase() } : b });
      // the game cleans names its own way; say so when it stored something else
      if (b.name !== undefined && data.player && data.player.name !== b.name) return `Saved as "${data.player.name}"`;
    }),
    'player-delete': (p) => confirmSheet({
      title: 'Delete this', em: 'player',
      body: `<b>${esc(p.name)}</b> is removed from ${esc(p.gameTitle)} with ${num(p.points)} points, their stats, leaderboard place and rival records. If they are playing right now they are signed out.${p.account ? ` Their Cortexis account (${esc(p.account.email)}) is not touched.` : ''}${NO_UNDO}`,
      run: () => api(`/admin/games/${enc(p.game)}/players/${enc(p.id)}`, { method: 'DELETE' }),
    }),
  };
  view.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn || !ACT[btn.dataset.act]) return;
    const row = rec.get(btn.dataset.ref);
    if (!row) return;
    opener = btn;
    ACT[btn.dataset.act](row, btn);
  });
  document.querySelectorAll('dialog').forEach((d) => {
    d.addEventListener('close', refocus);
    d.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => d.close()));
  });

  const coursePills = (c) => `${c.hidden ? '<span class="pill pill-rejected">Off the website</span> ' : ''}${c.edited ? '<span class="pill pill-applied">Edited</span> ' : ''}`;
  const courseActs = (c) => acts(keep(`course:${c.slug}`, c), [
    ['course-edit', 'Edit'],
    c.hidden ? ['course-show', 'Restore to website'] : ['course-hide', 'Remove from website', true],
    c.edited && ['course-reset', 'Reset to original'],
  ]);
  // the admin account is not a student: it is edited elsewhere, never deleted here
  const userActs = (u) => (u.role === 'admin' ? '' : acts(keep(`user:${u.id}`, u), [['user-edit', 'Edit'], ['user-delete', 'Delete', true]]));

  /* ================================================================ views */
  const VIEWS = {
    async overview() {
      const [{ data }, games] = await Promise.all([api('/admin/overview'), api('/admin/games').catch(() => ({ data: [] }))]);
      const c = data.counts;
      const h = new Date().getHours();
      const first = String(me.name || '').trim().split(/\s+/)[0] || 'admin';
      view.innerHTML = `
        <section class="hero">
          <div>
            <p class="eyebrow">${esc(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))}</p>
            <h1><span class="ln"><span>Good ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'},</span></span><span class="ln"><span style="--i:1"><em>${esc(first)}</em></span></span></h1>
            <p class="lede">Here is Cortexis today.</p>
          </div>
          <figure class="photo">
            <div class="photo-frame"><img src="/img/dashboard-reading.webp" alt="" decoding="async"><span class="sheen" aria-hidden="true"></span></div>
            <span class="chip chip-0" style="--i:0"><b data-count="${Number(c.users) || 0}">${num(c.users)}</b><span>students</span></span>
            <span class="chip chip-1" style="--i:1"><b data-count="${Number(c.certificates) || 0}">${num(c.certificates)}</b><span>certificates</span></span>
          </figure>
        </section>
        <div class="stats quad">
          ${stat(c.users, 'students', '#/students')}${stat(c.courses, 'courses', '#/courses')}
          ${stat(c.enrollments, 'enrolments', '#/courses')}${stat(c.completed, 'courses completed', '#/courses')}
          ${stat(c.certificates, 'certificates', '#/certificates')}${stat(c.claudePending, 'Claude Pro to review', '#/claude-pro')}
          ${stat(c.internships, 'internship applications', '#/internships')}${stat(c.messagesOpen, 'unanswered messages', '#/messages')}
        </div>
        <div class="stats games">${games.data.map((g) => stat(g.online ? g.players : 'offline', `${g.title} players`, `#/games/${g.id}`)).join('')}</div>
        <div class="two">
          <section class="panel glass"><h2>Newest <em>students</em></h2>${table([
            { label: 'Student', cell: (u) => `<a href="#/students/${esc(u.id)}"><b>${esc(u.name)}</b></a><small>${esc(u.email)}</small>` },
            { label: 'Joined', cell: (u) => date(u.createdAt) },
          ], data.recentUsers, 'No students yet.')}</section>
          <section class="panel glass"><h2>Latest <em>certificates</em></h2>${table([
            { label: 'Student', cell: (r) => `<b>${esc(r.userName)}</b><small>${esc(r.courseTitle)}</small>` },
            { label: 'Code', cell: (r) => certLink(r.code) },
            { label: 'Issued', cell: (r) => date(r.issuedAt) },
          ], data.recentCertificates, 'No certificates yet.')}</section>
        </div>`;
    },

    async courses() {
      const s = st('courses');
      const { data } = await api('/admin/courses');
      const render = () => {
        const q = s.search.toLowerCase();
        const rows = data.filter((r) => !q || `${r.title} ${r.slug} ${r.category}`.toLowerCase().includes(q));
        view.querySelector('#list').innerHTML = table([
          { label: 'Course', cell: (r) => `<a href="#/courses/${encodeURIComponent(r.slug)}"><b>${esc(r.title)}</b></a>${coursePills(r)}<small>${esc(r.category)} · ${esc(r.level)}</small>` },
          { label: 'Topics', cls: 'n', cell: (r) => num(r.lessons) },
          { label: 'Students', cls: 'n', cell: (r) => num(r.students) },
          { label: 'Completed', cls: 'n', cell: (r) => num(r.completed) },
          { label: 'Certificates', cls: 'n', cell: (r) => num(r.certificates) },
          { label: '', cell: (r) => courseActs(r) },
        ], rows, 'No course matches.');
      };
      view.innerHTML = head('All', 'courses', `${data.length} courses. Open one to see its students, their progress and certificates.`) +
        `<div class="filters">${searchBox('courses', 'Search courses')}</div><div id="list"></div>`;
      render();
      const box = view.querySelector('input[type=search]');
      box.addEventListener('input', () => { s.search = box.value.trim(); render(); });
    },

    async course(slug) {
      const { data } = await api(`/admin/courses/${encodeURIComponent(slug)}`);
      const { course, students } = data;
      const done = students.filter((x) => x.completedAt).length;
      const certs = students.filter((x) => x.certificateCode).length;
      view.innerHTML = head(course.title, '', `${coursePills(course)}${esc(course.category)} · ${esc(course.level)} · ${num(course.lessons)} topics`, '#/courses') + `
        <div class="head-tools">${courseActs(course)}</div>
        <div class="stats">${stat(students.length, 'students')}${stat(done, 'completed')}${stat(certs, 'certificates')}</div>
        <section class="panel glass"><h2>Students</h2>${table([
          { label: 'Student', cell: (u) => `<a href="#/students/${esc(u.id)}"><b>${esc(u.name)}</b></a><small>${esc(u.email)}</small>` },
          { label: 'Enrolled', cell: (u) => date(u.enrolledAt) },
          { label: 'Progress', cell: (u) => progress(u.lessonsDone, course.lessons) },
          { label: 'Final exam', cls: 'n', cell: (u) => finalCell(u) },
          { label: 'Certificate', cell: (u) => certLink(u.certificateCode) },
          { label: '', cell: (u) => acts(keep(`enrol:${u.id}:${course.slug}`, { userId: u.id, name: u.name, email: u.email, slug: course.slug, title: course.title, code: u.certificateCode }), [['enrol-remove', 'Remove from course', true]]) },
        ], students, 'Nobody has enrolled in this course yet.')}</section>`;
    },

    async students() {
      const s = st('students');
      const q = new URLSearchParams({ page: s.page, ...(s.search ? { search: s.search } : {}) });
      const { data } = await api(`/admin/users?${q}`);
      if (pastEnd(s, data.rows)) return VIEWS.students();
      view.innerHTML = head('Our', 'students', 'Everyone with a Cortexis account. Open one to see their courses and certificates.') +
        `<div class="filters">${searchBox('students', 'Search by name or email')}</div>` +
        table([
          { label: 'Student', cell: (u) => `<a href="#/students/${esc(u.id)}"><b>${esc(u.name)}</b></a><small>${esc(u.email)}</small>` },
          { label: 'Status', cell: (u) => (u.role === 'admin' ? '<span class="pill pill-applied">Admin</span>' : u.emailVerified ? '<span class="pill pill-awarded">Verified</span>' : '<span class="pill">Not verified</span>') },
          { label: 'Joined', cell: (u) => date(u.createdAt) },
          { label: 'Courses', cls: 'n', cell: (u) => num(u.courses) },
          { label: 'Certificates', cls: 'n', cell: (u) => num(u.certificates) },
          { label: '', cell: (u) => userActs(u) },
        ], data.rows, 'No student matches.') + pager(data.total, data.page, data.pageSize);
      bindSearch('students', VIEWS.students); bindPager('students', VIEWS.students);
    },

    async student(id) {
      const { data } = await api(`/admin/users/${encodeURIComponent(id)}`);
      const { user, courses } = data;
      view.innerHTML = head(user.name, '', `${esc(user.email)} · joined ${date(user.createdAt)} · ${user.emailVerified ? 'verified' : 'not verified'}`, '#/students') + `
        <div class="head-tools">${userActs({ ...user, courses: courses.length, certificates: courses.filter((c) => c.certificateCode).length, leave: true })}</div>
        <div class="stats">${stat(courses.length, 'courses')}${stat(courses.filter((c) => c.completedAt).length, 'completed')}${stat(courses.filter((c) => c.certificateCode).length, 'certificates')}</div>
        <section class="panel glass"><h2>Courses</h2>${table([
          { label: 'Course', cell: (c) => `<a href="#/courses/${encodeURIComponent(c.slug)}"><b>${esc(c.title)}</b></a>` },
          { label: 'Enrolled', cell: (c) => date(c.enrolledAt) },
          { label: 'Progress', cell: (c) => progress(c.lessonsDone, c.lessons) },
          { label: 'Final exam', cls: 'n', cell: (c) => finalCell(c) },
          { label: 'Certificate', cell: (c) => certLink(c.certificateCode) },
          { label: '', cell: (c) => acts(keep(`enrol:${user.id}:${c.slug}`, { userId: user.id, name: user.name, email: user.email, slug: c.slug, title: c.title, code: c.certificateCode }), [
            ['enrol-remove', 'Remove from course', true],
            c.certificateCode && ['cert-revoke', 'Revoke certificate', true, keep(`cert:${c.certificateCode}`, { code: c.certificateCode, userName: user.name, courseTitle: c.title })],
          ]) },
        ], courses, 'Not enrolled in any course.')}</section>`;
    },

    async certificates() {
      const s = st('certificates');
      const q = new URLSearchParams({ page: s.page, ...(s.search ? { search: s.search } : {}) });
      const { data } = await api(`/admin/certificates?${q}`);
      if (pastEnd(s, data.rows)) return VIEWS.certificates();
      view.innerHTML = head('Issued', 'certificates', 'Every certificate issued. The code opens the public verification page.') +
        `<div class="filters">${searchBox('certificates', 'Search by code, student or course')}</div>` +
        table([
          { label: 'Code', cell: (r) => certLink(r.code) },
          { label: 'Student', cell: (r) => `<a href="#/students/${esc(r.userId)}"><b>${esc(r.userName)}</b></a><small>${esc(r.userEmail)}</small>` },
          { label: 'Course', cell: (r) => `<a href="#/courses/${encodeURIComponent(r.courseSlug)}">${esc(r.courseTitle)}</a>` },
          { label: 'Score', cls: 'n', cell: (r) => `${num(r.score)}%` },
          { label: 'Issued', cell: (r) => date(r.issuedAt) },
          { label: '', cell: (r) => acts(keep(`cert:${r.code}`, r), [['cert-edit', 'Edit score'], ['cert-revoke', 'Revoke', true]]) },
        ], data.rows, 'No certificate matches.') + pager(data.total, data.page, data.pageSize);
      bindSearch('certificates', VIEWS.certificates); bindPager('certificates', VIEWS.certificates);
    },

    async internships() {
      const s = st('internships', { title: '' });
      const q = new URLSearchParams({ page: s.page, ...(s.search ? { search: s.search } : {}), ...(s.title ? { title: s.title } : {}) });
      const { data } = await api(`/admin/internships?${q}`);
      if (pastEnd(s, data.rows)) return VIEWS.internships();
      view.innerHTML = head('Internship', 'applications', 'Everyone who applied through the Internships page.') +
        `<div class="filters">${searchBox('internships', 'Search by name, email or internship')}
          <select id="title-filter" aria-label="Internship"><option value="">All internships</option>${data.titles.map((t) => `<option value="${esc(t.title)}" ${t.title === s.title ? 'selected' : ''}>${esc(t.title)} (${num(t.n)})</option>`).join('')}</select></div>` +
        (data.rows.length ? `<div class="cards">${data.rows.map((a) => `
          <article class="card glass">
            <header><div><b>${esc(a.name)}</b><small>${esc(a.internshipTitle)}</small></div>${date(a.createdAt)}</header>
            <p class="contact"><a href="mailto:${esc(a.email)}">${esc(a.email)}</a>${a.phone ? ` · <a href="tel:${esc(a.phone)}">${esc(a.phone)}</a>` : ''}${safeUrl(a.resumeLink) ? ` · <a href="${esc(safeUrl(a.resumeLink))}" target="_blank" rel="noopener noreferrer">Resume</a>` : ''}</p>
            ${a.coverLetter ? `<details><summary>Cover letter</summary><p class="body">${esc(a.coverLetter)}</p></details>` : ''}
            ${acts(keep(`intern:${a.id}`, a), [['intern-edit', 'Edit'], ['intern-delete', 'Delete', true]])}
          </article>`).join('')}</div>` : '<p class="state">No applications yet.</p>') + pager(data.total, data.page, data.pageSize);
      bindSearch('internships', VIEWS.internships); bindPager('internships', VIEWS.internships);
      view.querySelector('#title-filter').addEventListener('change', (e) => { s.title = e.target.value; s.page = 1; VIEWS.internships(); });
    },

    async messages() {
      const s = st('messages', { status: 'open' });
      const q = new URLSearchParams({ page: s.page, status: s.status, ...(s.search ? { search: s.search } : {}) });
      const { data } = await api(`/admin/messages?${q}`);
      if (pastEnd(s, data.rows)) return VIEWS.messages();
      view.innerHTML = head('Contact', 'messages', 'Messages sent through the Contact page.') +
        `<div class="filters">${searchBox('messages', 'Search messages')}
          <select id="msg-status" aria-label="Status">${[['open', 'Not answered'], ['handled', 'Answered'], ['all', 'All messages']].map(([v, l]) => `<option value="${v}" ${v === s.status ? 'selected' : ''}>${l}</option>`).join('')}</select></div>` +
        (data.rows.length ? `<div class="cards">${data.rows.map((m) => `
          <article class="card glass ${m.handled ? 'is-done' : ''}">
            <header><div><b>${esc(m.subject || 'No subject')}</b><small>${esc(m.name)}</small></div>${date(m.createdAt)}</header>
            <p class="contact"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a>${m.phone ? ` · <a href="tel:${esc(m.phone)}">${esc(m.phone)}</a>` : ''}</p>
            <p class="body">${esc(m.message)}</p>
            <div class="actions"><button class="btn btn-sm ${m.handled ? '' : 'btn-go'}" data-msg="${esc(m.id)}" data-handled="${m.handled ? 0 : 1}" type="button">${m.handled ? 'Mark as not answered' : `Mark as answered${DISC}`}</button>
            ${acts(keep(`msg:${m.id}`, m), [['msg-edit', 'Edit'], ['msg-delete', 'Delete', true]])}</div>
          </article>`).join('')}</div>` : '<p class="state">No messages here.</p>') + pager(data.total, data.page, data.pageSize);
      bindSearch('messages', VIEWS.messages); bindPager('messages', VIEWS.messages);
      view.querySelector('#msg-status').addEventListener('change', (e) => { s.status = e.target.value; s.page = 1; VIEWS.messages(); });
      view.querySelectorAll('[data-msg]').forEach((b) => b.addEventListener('click', async () => {
        b.disabled = true;
        try { await api(`/admin/messages/${encodeURIComponent(b.dataset.msg)}`, { method: 'PATCH', body: { handled: b.dataset.handled === '1' } }); VIEWS.messages(); badges(); }
        catch (err) { alert(err.message); b.disabled = false; }
      }));
    },

    async 'claude-pro'() {
      const s = st('claude-pro', { status: 'applied', sort: 'score-desc' });
      const [sortBy, order] = s.sort.split('-');
      const q = new URLSearchParams({ page: s.page, limit: 25, status: s.status, sortBy, order, ...(s.search ? { search: s.search } : {}) });
      const { data } = await api(`/learn/claude-pro/applicants?${q}`);
      if (pastEnd(s, data && data.applicants)) return VIEWS['claude-pro']();
      // The learner sees the same three stages on My learning: Applied, Reviewing, Granted.
      const LABEL = { applied: 'Applied', selected: 'Reviewing', awarded: 'Granted', rejected: 'Rejected' };
      // the next step forward (primary) and one step back, per stage
      const STEPS = {
        applied: [['selected', 'Start review', true]],
        // after the review: one of two outcomes
        selected: [['awarded', 'Grant', true], ['rejected', 'Reject']],
        awarded: [['selected', 'Undo grant']],
        rejected: [['selected', 'Undo reject']],
      };
      view.innerHTML = head('Claude Pro', 'applicants', 'Learners who finished a course and applied for one free month of Claude Pro.') +
        `<div class="filters">${searchBox('claude-pro', 'Search by name or email')}
          <select id="cp-status" aria-label="Status">${[['applied', 'Applied'], ['selected', 'Reviewing'], ['awarded', 'Granted'], ['rejected', 'Rejected'], ['all', 'All records']].map(([v, l]) => `<option value="${v}" ${v === s.status ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <select id="cp-sort" aria-label="Sort">${[['score-desc', 'Highest score first'], ['timeSpent-desc', 'Most time studied'], ['appliedAt-desc', 'Most recent application'], ['score-asc', 'Lowest score first']].map(([v, l]) => `<option value="${v}" ${v === s.sort ? 'selected' : ''}>${l}</option>`).join('')}</select></div>` +
        table([
          { label: 'Learner', cell: (a) => `<b>${esc(a.userName)}</b><small>${esc(a.userEmail)}</small>` },
          { label: 'Course', cell: (a) => esc(a.courseTitle) },
          { label: 'Final score', cls: 'n', cell: (a) => `${esc(a.score)}/${esc(a.totalMarks)}` },
          { label: 'Study time', cls: 'n', cell: (a) => esc(a.timeSpentFormatted || `${Math.round((a.timeSpentSeconds || 0) / 60)}m`) },
          { label: 'Status', cell: (a) => `<span class="pill pill-${esc(a.status)}">${esc(LABEL[a.status] || a.status)}</span>` },
          { label: 'Action', cell: (a) => `<div class="actions">${(STEPS[a.status] || []).map(([to, text, main]) =>
            `<button class="btn btn-sm${main ? ' btn-go' : to === 'rejected' ? ' btn-brick' : ''}" data-cp="${esc(a.id)}" data-set="${to}" type="button">${text}${main ? DISC : ''}</button>`).join('')}
            ${acts(keep(`cp:${a.id}`, a), [['cp-delete', 'Delete', true]])}</div>` },
        ], (data && data.applicants) || [], 'No applicants here. Learners appear when they finish a course and apply.') +
        pager((data && data.total) || 0, s.page, 25);
      bindSearch('claude-pro', VIEWS['claude-pro']); bindPager('claude-pro', VIEWS['claude-pro']);
      view.querySelector('#cp-status').addEventListener('change', (e) => { s.status = e.target.value; s.page = 1; VIEWS['claude-pro'](); });
      view.querySelector('#cp-sort').addEventListener('change', (e) => { s.sort = e.target.value; s.page = 1; VIEWS['claude-pro'](); });
      view.querySelectorAll('[data-cp]').forEach((b) => b.addEventListener('click', async () => {
        b.disabled = true;
        try {
          await api(`/learn/claude-pro/applicants/${encodeURIComponent(b.dataset.cp)}`, { method: 'PATCH', body: { status: b.dataset.set } });
          toast(`Moved to ${LABEL[b.dataset.set]}. The learner sees it on My learning.`);
          VIEWS['claude-pro'](); badges();
        }
        catch (err) { alert(err.message); b.disabled = false; }
      }));
    },

    async games() {
      const { data } = await api('/admin/games');
      view.innerHTML = head('The', 'games', 'Players in each game. A linked player signed in with a Cortexis account; the rest are guests.') +
        `<div class="game-cards">${data.map((g) => `
          <a class="game-card glass" href="#/games/${esc(g.id)}">
            ${GAME_IMG[g.id] ? `<span class="game-photo"><img src="/img/${esc(g.id)}.webp" alt="" loading="lazy" decoding="async"></span>` : ''}
            <b>${esc(g.title)}</b>
            ${g.online ? `<span class="big" data-count="${Number(g.players) || 0}">${num(g.players)}</span><span class="muted">players · ${num(g.linked)} linked to an account</span>`
              : `<span class="pill pill-rejected">Offline</span><span class="muted">${esc(g.error || 'The game server is not running.')}</span>`}
          </a>`).join('')}</div>`;
    },

    async game(id) {
      const s = st(`game-${id}`, { active: true });
      const { data } = await api(`/admin/games/${encodeURIComponent(id)}/players`);
      const { game, rows } = data;
      const extras = Object.entries(game.extra);
      const render = () => {
        const q = s.search.toLowerCase();
        const list = rows.filter((p) => (!s.active || p.played || p.points || p.account) && (!q || `${p.name} ${p.account ? `${p.account.name} ${p.account.email}` : ''}`.toLowerCase().includes(q)));
        const size = 50;
        const pages = Math.max(1, Math.ceil(list.length / size));
        s.page = Math.min(s.page, pages);
        view.querySelector('#list').innerHTML = table([
          { label: 'Player', cell: (p) => `<b>${flag(p.country)} ${esc(p.name)}</b><small class="mono">${esc(p.id)}</small>` },
          { label: 'Cortexis account', cell: (p) => (p.account ? `<a href="#/students/${esc(p.account.id)}">${esc(p.account.name)}</a><small>${esc(p.account.email)}</small>` : '<span class="dim">guest</span>') },
          { label: 'Points', cls: 'n', cell: (p) => num(p.points) },
          { label: game.played, cls: 'n', cell: (p) => num(p.played) },
          { label: 'Wins', cls: 'n', cell: (p) => num(p.wins) },
          { label: 'Best streak', cls: 'n', cell: (p) => num(p.bestStreak) },
          ...extras.map(([k, label]) => ({ label, cls: 'n', cell: (p) => num(p.extra && p.extra[k]) })),
          { label: 'First played', cell: (p) => date(p.createdAt) },
          ...(rows.some((p) => p.lastSeen) ? [{ label: 'Last seen', cell: (p) => date(p.lastSeen) }] : []),
          { label: '', cell: (p) => acts(keep(`player:${id}:${p.id}`, { ...p, game: id, gameTitle: game.title }), [['player-edit', 'Edit'], ['player-delete', 'Delete', true]]) },
        ], list.slice((s.page - 1) * size, s.page * size), 'No player matches.') + pager(list.length, s.page, size);
        view.querySelectorAll('#list [data-page]').forEach((b) => b.addEventListener('click', () => { s.page = Number(b.dataset.page); render(); }));
      };
      view.innerHTML = head(game.title, 'players', `${num(rows.length)} players · ${num(rows.filter((p) => p.account).length)} linked to a Cortexis account · highest points first`, '#/games') +
        `<div class="filters">${searchBox(`game-${id}`, 'Search players or their account')}<label class="check"><input type="checkbox" id="active-only" ${s.active ? 'checked' : ''}> Only players who have played</label></div><div id="list"></div>`;
      render();
      const box = view.querySelector('input[type=search]');
      box.addEventListener('input', () => { s.search = box.value.trim(); s.page = 1; render(); });
      view.querySelector('#active-only').addEventListener('change', (e) => { s.active = e.target.checked; s.page = 1; render(); });
    },
  };

  /* ---------- routing ---------- */
  async function route() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'overview').split('/');
    const [section, arg] = parts;
    let run;
    if (section === 'courses' && arg) run = () => VIEWS.course(decodeURIComponent(arg));
    else if (section === 'students' && arg) run = () => VIEWS.student(arg);
    else if (section === 'games' && arg) run = () => VIEWS.game(arg);
    else run = VIEWS[section] || VIEWS.overview;
    const current = section === 'games' && arg ? `games/${arg}` : section;
    document.querySelectorAll('#side-nav a').forEach((a) => a.toggleAttribute('aria-current', a.dataset.section === current));
    document.querySelectorAll('#side-nav a[aria-current]').forEach((a) => a.setAttribute('aria-current', 'page'));
    movePill();
    group = { courses: 'Learning', students: 'Learning', certificates: 'Learning', 'claude-pro': 'Learning', internships: 'People', messages: 'People', games: 'Games' }[section] || '';
    view.classList.remove('enter');
    view.innerHTML = SKELETON;
    onScreen = run;
    try { await run(); settle(); } catch (err) {
      if (err.status !== 401 && err.status !== 403) view.innerHTML = `<p class="state error">Could not load this section: ${esc(err.message)}</p>`;
    }
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  // The ink pill under the current sidebar item, slid there with transform.
  function movePill() {
    const pill = $('side-pill');
    const a = document.querySelector('#side-nav a[aria-current]');
    if (!a || !a.offsetWidth) return pill.classList.remove('is-on');
    const first = !pill.classList.contains('is-on');
    if (first) pill.style.transition = 'none';
    pill.style.width = `${a.offsetWidth}px`;
    pill.style.height = `${a.offsetHeight}px`;
    pill.style.transform = `translate3d(${a.offsetLeft}px, ${a.offsetTop}px, 0)`;
    pill.classList.add('is-on');
    const nav = $('side-nav');   // the phone top bar scrolls sideways: keep the current item in view
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - 16, behavior: first || still() ? 'auto' : 'smooth' });
    if (first) { void pill.offsetWidth; pill.style.transition = ''; }
  }
  window.addEventListener('resize', movePill);
  if (document.fonts) document.fonts.ready.then(movePill);

  async function badges() {
    try {
      const { data } = await api('/admin/overview');
      const set = (id, n) => {
        const b = $(id);
        const text = String(n > 99 ? '99+' : n);
        b.hidden = !n;
        if (b.textContent === text) return;
        b.textContent = text;
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');   // pop when the number changes
        movePill();
      };
      set('badge-messages', data.counts.messagesOpen);
      set('badge-claude', data.counts.claudePending);
    } catch { /* badges are a nicety */ }
  }

  /* ---------- sign in ---------- */
  function showSignin(msg) {
    $('portal').hidden = true;
    $('signin').hidden = false;
    $('signin-error').hidden = !msg;
    $('signin-error').textContent = msg || '';
  }
  function signOut() { store.set(null); showSignin(); }
  function start(user) {
    $('signin').hidden = true;
    $('portal').hidden = false;
    $('me-email').textContent = user.email;
    me = user;
    route();
    badges();
  }

  $('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: { email: f.get('email'), password: f.get('password') } });
      if (!user || !user.isAdmin) return showSignin('This account is not the admin.');
      store.set(token);
      e.target.reset();
      start(user);
    } catch (err) {
      showSignin(err.message);
    } finally {
      btn.disabled = false;
    }
  });
  $('signout').addEventListener('click', signOut);

  (async () => {
    if (!store.get()) return showSignin();
    try {
      const { user } = await api('/auth/me');
      if (user && user.isAdmin) start(user); else signOut();
    } catch {
      showSignin();
    }
  })();
})();
