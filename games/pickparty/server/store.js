'use strict';
// Tiny JSON document store: one file, debounced atomic writes.
const fs = require('fs');
const path = require('path');

class Store {
  constructor(file, { debounceMs = 1000 } = {}) {
    this.file = file;
    this.debounceMs = debounceMs;
    this.timer = null;
    this.data = {};
    try {
      this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      if (e.code !== 'ENOENT') console.warn('[store] could not read', file, e.message);
    }
  }

  save() {
    if (this.timer) return;
    this.timer = setTimeout(() => { this.timer = null; this.flush(); }, this.debounceMs);
    if (this.timer.unref) this.timer.unref();
  }

  flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(this.data));
    fs.renameSync(tmp, this.file);
  }
}

module.exports = Store;
