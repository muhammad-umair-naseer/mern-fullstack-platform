// @title A string of math
// @difficulty 3
// @tags coercion, operators
// @distractor 6
// @distractor 33
// @distractor 123
// @explain Evaluation goes left to right: 1 + 2 is 3 (both numbers), 3 + "3" is the string "33", and "33" - 3 coerces back to a number: 30.
console.log(1 + 2 + "3" - 3);
