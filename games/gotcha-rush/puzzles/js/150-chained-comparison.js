// @title Chained comparisons
// @difficulty 2
// @tags operators, coercion
// @distractor true\ntrue
// @distractor false\nfalse
// @distractor true\nSyntaxError
// @explain Comparisons are evaluated left to right and produce booleans. 1 < 2 is true, and true < 3 becomes 1 < 3, which is true. 3 > 2 is true, and true > 1 becomes 1 > 1, which is false.
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
