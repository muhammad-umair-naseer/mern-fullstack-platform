// @title Plus and minus
// @difficulty 1
// @tags coercion, operators
// @distractor 2\n0
// @distractor 11\n11
// @distractor 2\n11
// @explain + with a string on either side means concatenation, so "1" + 1 is "11". There is no string version of -, so "1" - 1 coerces both sides to numbers and gives 0.
console.log("1" + 1);
console.log("1" - 1);
