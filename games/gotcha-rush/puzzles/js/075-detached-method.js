// @title Detached method
// @difficulty 3
// @tags this, classes
// @distractor 2
// @distractor undefined
// @distractor NaN
// @explain Calling f() with no receiver leaves this undefined (class bodies are always strict mode), so this.n throws a TypeError. Binding the method or calling it as c.inc() would give 2.
class Counter {
  constructor() { this.n = 1; }
  inc() { return ++this.n; }
}
const c = new Counter();
const f = c.inc;
try {
  console.log(f());
} catch (e) {
  console.log(e.constructor.name);
}
