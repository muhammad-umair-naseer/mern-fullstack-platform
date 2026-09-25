// @title Hoisted
// @difficulty 2
// @tags hoisting, var
// @distractor ReferenceError
// @distractor 5\n5
// @distractor null\n5
// @explain var declarations are hoisted to the top of their function with the value undefined; only the assignment stays where it is. A let or const here would throw a ReferenceError instead (the temporal dead zone).
console.log(x);
var x = 5;
console.log(x);
