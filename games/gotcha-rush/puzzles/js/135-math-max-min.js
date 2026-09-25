// @title Max of nothing
// @difficulty 1
// @tags Math, NaN
// @distractor 0\n0\n2
// @distractor undefined\nundefined\nNaN
// @distractor -Infinity\nInfinity\n2
// @explain With no arguments, Math.max starts from -Infinity and Math.min from Infinity — the identity values for those operations. Passing an array gives one argument that converts to the string "1,2", which is NaN as a number.
console.log(Math.max());
console.log(Math.min());
console.log(Math.max([1, 2]));
