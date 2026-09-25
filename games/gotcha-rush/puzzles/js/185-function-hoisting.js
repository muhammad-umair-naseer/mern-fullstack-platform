// @title Two ways to declare
// @difficulty 3
// @tags hoisting, functions
// @distractor function function
// @distractor undefined undefined
// @distractor function ReferenceError
// @explain Function declarations are hoisted with their body, so f is callable before its line. A function expression assigned to var is only hoisted as an undefined variable; the assignment happens later.
console.log(typeof f, typeof g);
function f() {}
var g = function () {};
