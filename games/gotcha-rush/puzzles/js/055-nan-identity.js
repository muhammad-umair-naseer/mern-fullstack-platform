// @title Nothing equals NaN
// @difficulty 2
// @tags NaN, equality, arrays
// @distractor true\ntrue\ntrue\ntrue\n0
// @distractor false\ntrue\ntrue\ntrue\n-1
// @distractor false\nfalse\nfalse\nfalse\n-1
// @explain NaN is the only value not equal to itself. Number.isNaN checks for the actual NaN value ("x" is a string, so false), while the global isNaN coerces first ("x" becomes NaN, so true). includes uses SameValueZero, which finds NaN; indexOf uses ===, which never does.
console.log(NaN === NaN);
console.log(Number.isNaN("x"));
console.log(isNaN("x"));
console.log([NaN].includes(NaN));
console.log([NaN].indexOf(NaN));
