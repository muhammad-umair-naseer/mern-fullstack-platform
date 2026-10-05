/**
 * Renders the passage as per-character spans and turns a hidden <input>'s
 * value into race progress.
 *
 *  - Only right letters go in. A wrong key never enters the text: it counts
 *    as a mistake (the game layer takes points for it), the letter you need
 *    turns red, and pressing the right key carries on. Nothing ever has to be
 *    fixed with Backspace, so a typo can never leave a player stuck behind
 *    letters the game is quietly refusing.
 *  - `correct` is how far into the passage the player has typed; the server
 *    uses the same number for race progress.
 *  - Keystrokes and errors are counted per key pressed: every wrong key is
 *    one error, the usual definition of accuracy in typing games.
 *  - Words are tracked so the game layer can reward flawless words and golden
 *    (bonus) words: a word is "committed" once its trailing space is typed (or
 *    the passage ends), and it is flawless if no wrong key was pressed in it.
 *  - A letter also accepts its plain form, so any passage can be typed on any
 *    keyboard: é takes e, ş takes s, ı takes i, ß takes s.
 *  - Keys pressed once GO is on screen but a moment before the race starts
 *    (arm) wait in the box and are judged when typing is enabled.
 *  - Keys that move the hidden caret (arrows, Home, End, select all) do
 *    nothing, so every key lands at the end of the text.
 *  - Text an input method is still composing (dead keys for accented letters,
 *    phone keyboards) is judged as it arrives, except its last character,
 *    which may still change (a dead key's ´ becoming é): that one is judged
 *    once another follows it or the composition ends. The input box is only
 *    rewritten when no composition is open, since rewriting it mid-composition
 *    breaks the input method.
 */
// A key fits a letter if it is the letter or the letter's plain form.
const plain = (ch) => ch.normalize('NFD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').replace(/ß/g, 's');
const fits = (key, letter) => key === letter || plain(key) === plain(letter);

// Keys whose default action moves the caret or selects text in the hidden input.
const movesCaret = (e) =>
  /^(Arrow|Home$|End$|Page)/.test(e.key) ||
  ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') ||
  (e.ctrlKey && !e.metaKey && /^[befnp]$/i.test(e.key)); // macOS Ctrl text navigation

export class TypingArea {
  constructor(passageEl, inputEl) {
    this.el = passageEl;
    this.input = inputEl;
    this.onChange = null;
    this.onBlur = null;
    this.onFocus = null;

    this.text = '';
    this.chars = [];
    this.words = [];        // word span elements
    this.wordCommitAt = []; // correct-prefix length at which word i is committed
    this.wordsCommitted = 0;
    this.errorsInWord = 0;
    this.typed = '';           // the right letters typed so far: always a prefix of the passage
    this.seen = '';            // the input's value when last judged, so each key is judged once
    this.missed = new Set();   // letters a wrong key was pressed on
    this.correct = 0;
    this.keystrokes = 0;
    this.errors = 0;
    this.enabled = false;
    this.done = false;
    this.composing = false;
    this.armed = false;        // GO is showing; keys wait in the box for the start

    this.input.addEventListener('input', (e) => this.handle(this.input.value, e.isComposing || this.composing));
    this.input.addEventListener('compositionstart', () => { this.composing = true; });
    this.input.addEventListener('compositionend', () => {
      this.composing = false;
      this.handle(this.input.value);
    });
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Tab' || movesCaret(e)) e.preventDefault();
    });
    this.input.addEventListener('paste', (e) => e.preventDefault());
    this.input.addEventListener('drop', (e) => e.preventDefault());
    this.input.addEventListener('blur', () => this.onBlur && this.onBlur());
    this.input.addEventListener('focus', () => this.onFocus && this.onFocus());
    this.setPassage('');
  }

  setPassage(text, bonusWords = []) {
    this.text = text || '';
    this.typed = '';
    this.correct = 0;
    this.keystrokes = 0;
    this.errors = 0;
    this.done = false;
    this.wordsCommitted = 0;
    this.errorsInWord = 0;
    this.missed = new Set();
    this.armed = false;
    this.setInput('');
    this.el.innerHTML = '';
    this.chars = [];
    this.words = [];
    this.wordCommitAt = [];
    this.el.scrollTop = 0;

    if (!this.text) {
      const ph = document.createElement('span');
      ph.className = 'placeholder';
      ph.textContent = 'The paragraph appears here when the countdown ends. Tap any key while you wait.';
      this.el.appendChild(ph);
      return;
    }

    const bonus = new Set(bonusWords);
    // group characters into words (trailing space stays with the word) so a
    // word never wraps in the middle
    let word = document.createElement('span');
    word.className = 'w';
    const frag = document.createDocumentFragment();
    const pushWord = (commitAt) => {
      const idx = this.words.length;
      if (bonus.has(idx)) {
        word.classList.add('gold');
        word.title = 'Bonus word: type it with no mistakes for extra points';
      }
      this.words.push(word);
      this.wordCommitAt.push(commitAt);
      frag.appendChild(word);
    };
    for (let i = 0; i < this.text.length; i++) {
      const ch = this.text[i];
      const span = document.createElement('span');
      span.className = ch === ' ' ? 'c sp' : 'c';
      span.textContent = ch;
      this.chars.push(span);
      word.appendChild(span);
      if (ch === ' ') {
        pushWord(i + 1);
        word = document.createElement('span');
        word.className = 'w';
      }
    }
    if (word.childNodes.length) pushWord(this.text.length);
    this.el.appendChild(frag);
    this.paint(0, 0);
  }

  setEnabled(v) {
    this.enabled = v;
    this.el.classList.toggle('locked', !v);
    const held = this.armed;
    this.armed = false;
    if (v) {
      this.focus();
      // keys pressed between GO and the start are judged now
      if (held && this.input.value !== this.seen) this.handle(this.input.value, this.composing);
    }
  }

  /**
   * GO is on screen, but the race starts a moment later (the server's start
   * crosses the network; a practice run starts on its own timer). Take keys
   * from now on: they wait in the box and count once typing is enabled,
   * instead of being lost and leaving every key after them one letter off.
   */
  arm() {
    if (this.enabled || this.done || !this.text || this.armed) return;
    this.armed = true;
    this.focus(true);
  }

  /**
   * Focus the input. Normally only while enabled; `force` focuses during the
   * countdown too, so a touch device can raise its keyboard inside a tap
   * gesture and have it ready at GO (iOS refuses programmatic focus otherwise).
   */
  focus(force = false) {
    if (!this.enabled && !force) return;
    this.input.focus({ preventScroll: true });
  }

  /** Put `value` in the input box and remember it as judged. */
  setInput(value) {
    this.input.value = value;
    this.seen = value;
  }

  /**
   * Judge the keys added to the input since the last call. Each one either
   * matches the next letter of the passage and is typed, or is a mistake: it
   * is counted, the letter it was pressed on is marked, and it goes no
   * further. `composing` is true while an input method owns the box.
   */
  handle(value, composing = false) {
    if (!this.enabled || this.done || !this.text) {
      if (this.armed) return;           // GO is up: keep the keys for the start
      if (composing) this.seen = value; // leave a composition alone; cleared when it ends
      else this.setInput(this.typed);
      return;
    }

    // Keys pressed since the last call were appended to the value we saw then.
    // An input method may instead rewrite its whole composition (an
    // autocorrected word): then everything after the typed letters is new. A
    // shorter value (Backspace) or an edit inside the text adds nothing, and
    // right letters stay typed.
    let base = null;
    if (value.startsWith(this.seen)) base = this.seen;
    else if (value.startsWith(this.typed)) base = this.typed;
    // While composing, the last character may still change: hold it back.
    const end = composing ? value.length - 1 : value.length;
    const fresh = base === null ? '' : value.slice(base.length, Math.max(base.length, end));
    if (base !== null) this.seen = base + fresh;

    const from = this.typed.length;
    let added = 0;
    let wrong = 0;
    let lastKeyOk = true;
    let wordDone = null;
    for (let k = 0; k < fresh.length && this.typed.length < this.text.length; k++) {
      added++;
      this.keystrokes++;
      const letter = this.text[this.typed.length];
      if (fits(fresh[k], letter)) {
        this.typed += letter; // the passage's own letter, so typed stays a prefix of it
        lastKeyOk = true;
        wordDone = this.commitWords() || wordDone;
      } else {
        wrong++;
        this.errors++;
        this.errorsInWord++;
        this.missed.add(this.typed.length);
        lastKeyOk = false;
      }
    }

    if (!composing) this.setInput(this.typed); // a wrong key never stays in the box
    if (!added) return;

    this.correct = this.typed.length;
    this.done = this.correct === this.text.length;
    this.paint(from, this.correct);
    if (this.correct > from) this.keepCaretVisible();

    if (this.done) this.enabled = false;
    if (this.onChange) {
      this.onChange({
        correct: this.correct,
        typed: this.correct,
        keystrokes: this.keystrokes,
        errors: this.errors,
        done: this.done,
        added,
        wrong,
        ok: wrong === 0,
        lastKeyOk,
        wordDone,
      });
    }
  }

  /** Commit every word the typed letters now cover; returns the last one, or null. */
  commitWords() {
    let wordDone = null;
    while (this.wordsCommitted < this.words.length && this.typed.length >= this.wordCommitAt[this.wordsCommitted]) {
      const index = this.wordsCommitted;
      const flawless = this.errorsInWord === 0;
      const w = this.words[index];
      w.classList.add(flawless ? 'done-ok' : 'done');
      if (w.classList.contains('gold')) w.classList.add(flawless ? 'gold-hit' : 'gold-miss');
      wordDone = { index, flawless };
      this.wordsCommitted++;
      this.errorsInWord = 0;
    }
    return wordDone;
  }

  /** Repaint character classes in [lo, hi] (inclusive). */
  paint(lo, hi) {
    const n = this.typed.length;
    const end = Math.min(hi, this.chars.length - 1);
    for (let i = Math.max(0, lo); i <= end; i++) {
      let cls = this.text[i] === ' ' ? 'c sp' : 'c';
      if (i < n) cls += ' ok';
      else if (i === n) cls += ' cur';
      if (this.missed.has(i)) cls += ' miss'; // the letter a wrong key was pressed on
      this.chars[i].className = cls;
    }
  }

  keepCaretVisible() {
    const cur = this.chars[this.typed.length];
    if (!cur) return;
    const box = this.el.getBoundingClientRect();
    const r = cur.getBoundingClientRect();
    if (r.top < box.top || r.bottom > box.bottom) {
      // Scroll the passage box alone: scrollIntoView also scrolls every frame
      // around it, and inside the website's page that dragged the whole page
      // down with each new line.
      const top = this.el.scrollTop + (r.top - box.top) - (box.height - r.height) / 2;
      this.el.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }
}
