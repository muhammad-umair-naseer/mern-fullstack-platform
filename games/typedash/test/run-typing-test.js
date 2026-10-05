/**
 * The typing rule (public/js/typing.js) and its cost (public/js/game.js):
 * a wrong key never enters the text, is counted and costs points, the letter
 * you need shows red, the right key carries on, and Backspace changes nothing.
 * So a player can never get stuck behind a typo. Also checks that an accented
 * letter typed with a dead key (´ then e) is not judged a mistake on the way.
 *
 * Runs the real modules against a tiny stand-in for the page.
 */
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

class FakeEl {
  constructor() {
    this.childNodes = []; this.classes = new Set(); this.textContent = ''; this.title = '';
    this.scrollTop = 0; this.value = ''; this.listeners = {};
    const classes = this.classes;
    this.classList = {
      add: (...c) => c.forEach((x) => classes.add(x)),
      remove: (...c) => c.forEach((x) => classes.delete(x)),
      contains: (c) => classes.has(c),
      toggle: (c, on) => { if (on === undefined ? !classes.has(c) : on) classes.add(c); else classes.delete(c); },
    };
  }
  set className(v) { this.classes.clear(); v.split(/\s+/).filter(Boolean).forEach((c) => this.classes.add(c)); }
  get className() { return [...this.classes].join(' '); }
  set innerHTML(_) { this.childNodes = []; }
  appendChild(n) { if (n.fragment) this.childNodes.push(...n.childNodes); else this.childNodes.push(n); return n; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type, e = {}) { for (const fn of this.listeners[type] || []) fn(e); }
  focus() {}
  getBoundingClientRect() { return { top: 0, bottom: 100, height: 100 }; }
  scrollTo() {}
}
global.document = {
  createElement: () => new FakeEl(),
  createDocumentFragment: () => Object.assign(new FakeEl(), { fragment: true }),
};
global.performance = global.performance || { now: () => Date.now() };

(async () => {
  const js = (f) => pathToFileURL(path.join(__dirname, '..', 'public', 'js', f)).href;
  const { TypingArea } = await import(js('typing.js'));
  const { RaceGame, MISTAKE_COST } = await import(js('game.js'));

  const input = new FakeEl();
  const t = new TypingArea(new FakeEl(), input);
  const game = new RaceGame();
  const results = [];
  t.onChange = (r) => { results.push(r); game.onKey(r); };
  const press = (ch) => { input.value += ch; input.fire('input', { isComposing: false }); };
  const backspace = () => { input.value = input.value.slice(0, -1); input.fire('input', { isComposing: false }); };
  const has = (i, c) => t.chars[i].classList.contains(c);

  // --- a wrong key: counted, refused, and the letter you need turns red
  t.setPassage('patience is');
  game.start([]);
  t.setEnabled(true);
  for (const ch of 'patie') press(ch);
  const before = game.score;
  assert.equal(t.correct, 5);
  press('m'); // the passage wants n
  assert.equal(t.correct, 5, 'a wrong key does not move you on');
  assert.equal(input.value, 'patie', 'a wrong key never stays in the input');
  assert.equal(t.errors, 1, 'it is counted as a mistake');
  assert.ok(has(5, 'cur') && has(5, 'miss'), 'the letter you need shows red');
  assert.deepEqual([results.at(-1).ok, results.at(-1).wrong, results.at(-1).added], [false, 1, 1]);
  assert.equal(game.score, Math.max(0, before - MISTAKE_COST), `a wrong key costs ${MISTAKE_COST} points`);

  // --- no backlog: still exactly one letter to type, and Backspace changes nothing
  press('c');
  assert.equal(t.correct, 5);
  assert.equal(t.errors, 2);
  backspace();
  assert.equal(t.correct, 5, 'Backspace does not undo right letters');
  assert.equal(input.value, 'patie');
  assert.equal(t.errors, 2, 'Backspace is not a mistake');

  // --- the right key carries on; the slip stays visible and the word is not flawless
  for (const ch of 'nce ') press(ch);
  assert.equal(t.correct, 9);
  assert.ok(has(5, 'ok') && has(5, 'miss'), 'the letter you slipped on keeps a red mark');
  assert.ok(t.words[0].classList.contains('done') && !t.words[0].classList.contains('done-ok'), 'a word with a wrong key is not flawless');
  for (const ch of 'is') press(ch);
  assert.equal(t.done, true, 'the passage finishes');
  assert.equal(t.keystrokes, 13, 'every key pressed is a keystroke');

  // --- a dead key: ´ is composed into é, and that is not a mistake
  t.setPassage('café ok');
  t.setEnabled(true);
  const errorsBefore = t.errors;
  for (const ch of 'caf') press(ch);
  input.fire('compositionstart');
  input.value = 'caf´'; input.fire('input', { isComposing: true });
  assert.equal(t.errors, errorsBefore, 'the dead key mark alone is not judged');
  input.value = 'café'; input.fire('input', { isComposing: true });
  input.fire('compositionend');
  assert.equal(t.correct, 4, 'é counts once the composition ends');
  assert.equal(t.errors, errorsBefore, 'an accent typed with a dead key is not a mistake');
  assert.equal(input.value, 'café');

  // --- a keyboard that composes whole words: wrong letters still count, once each
  t.setPassage('the end');
  t.setEnabled(true);
  const e0 = t.errors;
  input.fire('compositionstart');
  for (const v of ['t', 'th', 'thx', 'thxe', 'thxe ']) { input.value = v; input.fire('input', { isComposing: true }); }
  input.fire('compositionend');
  // each key is judged against the letter you need: the stray x is one mistake,
  // and the e and space after it are the right keys, so you carry on
  assert.equal(t.correct, 4, 'an extra letter costs one mistake, not the rest of the word');
  assert.equal(t.errors - e0, 1, 'the stray letter counts once');
  assert.equal(input.value, 'the ', 'the box is cleaned once the composition ends');

  // --- a letter accepts its plain form, so any keyboard can type any passage
  t.setPassage('şık ağ, İyi ve öğle');
  t.setEnabled(true);
  const eTr = t.errors;
  for (const ch of 'sik ag, Iyi ve ogle') press(ch);
  assert.equal(t.done, true, 'a Turkish passage can be typed with plain letters');
  assert.equal(t.errors, eTr, 'plain letters are not mistakes');
  t.setPassage('café');
  t.setEnabled(true);
  for (const ch of 'cafx') press(ch);
  assert.equal(t.correct, 3, 'a different letter is still a mistake');

  // --- keys pressed once GO shows, a moment before the start, are kept and counted
  t.setPassage('go now');
  t.setEnabled(false);
  t.arm();
  const eGo = t.errors;
  press('g'); press('o');
  assert.equal(t.correct, 0, 'not judged before the start');
  t.setEnabled(true);
  assert.equal(t.correct, 2, 'judged the moment typing is enabled');
  assert.equal(t.errors, eGo, 'and not as mistakes');
  // without GO showing (the countdown), keys are only engine revs and are dropped
  t.setPassage('go now');
  t.setEnabled(false);
  press('x');
  t.setEnabled(true);
  assert.equal(t.correct, 0);
  assert.equal(input.value, '', 'countdown keys do not leak into the race');

  // --- keys that would move the hidden caret do nothing; letters and browser shortcuts pass
  const blocked = [];
  const key = (k, mods = {}) => input.fire('keydown', { key: k, ...mods, preventDefault: () => blocked.push(k + (mods.metaKey ? '+cmd' : mods.ctrlKey ? '+ctrl' : '')) });
  for (const k of ['ArrowLeft', 'ArrowUp', 'Home', 'End', 'PageUp']) key(k);
  key('a', { metaKey: true });
  key('a', { ctrlKey: true });
  key('b', { ctrlKey: true });
  key('x');
  key('r', { metaKey: true });
  assert.deepEqual(blocked, ['ArrowLeft', 'ArrowUp', 'Home', 'End', 'PageUp', 'a+cmd', 'a+ctrl', 'b+ctrl']);

  console.log('✓ typing rule: wrong keys are refused, counted and cost points; no backlog; Backspace is inert; dead keys and composing keyboards work; plain letters fit accented ones; keys after GO count; caret keys are inert');
})().catch((e) => { console.error(e); process.exit(1); });
