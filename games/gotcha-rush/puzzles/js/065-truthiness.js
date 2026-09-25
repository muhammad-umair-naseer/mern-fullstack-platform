// @title Truthy or falsy
// @difficulty 2
// @tags truthiness, coercion
// @distractor false\nfalse\ntrue\nfalse\nfalse
// @distractor false\ntrue\ntrue\nfalse\nfalse
// @distractor true\ntrue\ntrue\ntrue\nfalse
// @explain Only six values are falsy: false, 0, "", null, undefined and NaN (plus 0n). Every object is truthy, including an empty array and an empty object. "0" is a non-empty string, so it is truthy.
console.log(!!"");
console.log(!![]);
console.log(!!{});
console.log(!!"0");
console.log(!!0);
