// @title What a Set considers equal
// @difficulty 2
// @tags Set, equality, NaN
// @distractor 4
// @distractor 3
// @distractor 6
// @explain Set uses SameValueZero: 1 and "1" are different types, NaN equals NaN here (unlike ===), and two object literals are two distinct references. That leaves 1, "1", NaN, {} and {} — five entries.
const s = new Set([1, "1", 1, NaN, NaN, {}, {}]);
console.log(s.size);
