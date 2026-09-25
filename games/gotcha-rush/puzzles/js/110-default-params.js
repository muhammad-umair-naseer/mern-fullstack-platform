// @title Defaults and null
// @difficulty 2
// @tags functions, defaults, null
// @distractor 15 6 15
// @distractor 15 3 0
// @distractor 15 6 NaN
// @explain Default parameters only kick in for undefined, not for null. f() gives a = 5, b = 10. f(undefined, 1) gives a = 5, b = 1. f(null) keeps a = null, so b = null * 2 = 0 and the sum null + 0 is 0.
function f(a = 5, b = a * 2) {
  return a + b;
}
console.log(f(), f(undefined, 1), f(null));
