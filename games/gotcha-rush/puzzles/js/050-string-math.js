// @title Strings doing math
// @difficulty 1
// @tags coercion, operators
// @distractor NaN\n34\nNaN
// @distractor 12\n7\n5
// @distractor 12\n34\nNaN
// @explain *, / and - only exist for numbers, so string operands are converted: "3" * "4" is 12 and "10" / "2" is 5. + prefers concatenation whenever a string is involved, giving "34".
console.log("3" * "4");
console.log("3" + "4");
console.log("10" / "2");
