// @title Reducing nothing
// @difficulty 3
// @tags arrays, reduce, errors
// @distractor undefined\n6
// @distractor 0\n6
// @distractor NaN\n6
// @explain Without an initial value, reduce uses the first element as the accumulator. An empty array has no first element, so it throws a TypeError. With elements, it sums 1 + 2 + 3 normally.
try {
  console.log([].reduce((a, b) => a + b));
} catch (e) {
  console.log(e.constructor.name);
}
console.log([1, 2, 3].reduce((a, b) => a + b));
