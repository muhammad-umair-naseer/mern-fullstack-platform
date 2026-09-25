// @title Private counters
// @difficulty 2
// @tags closures
// @distractor 3 3
// @distractor 2 2
// @distractor 3 1
// @explain Each call to make() creates a fresh n captured by its own pair of closures. a and b never share state, so a has been incremented twice and b once.
function make() {
  let n = 0;
  return { inc: () => ++n, get: () => n };
}
const a = make();
const b = make();
a.inc(); a.inc(); b.inc();
console.log(a.get(), b.get());
