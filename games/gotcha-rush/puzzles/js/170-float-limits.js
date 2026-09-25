// @title Floating point limits
// @difficulty 3
// @tags floats, precision
// @distractor 0.3\n3\n9007199254740993
// @distractor 0.30000000000000004\n3\n9007199254740992
// @distractor 0.30000000000000004\n2.9999999999999996\n9007199254740993
// @explain 0.1 * 3 accumulates a binary rounding error, and 0.3 / 0.1 lands just under 3. Above 2^53 doubles can only represent even integers, so adding 1 to 9007199254740992 rounds back to itself.
console.log(0.1 * 3);
console.log(0.3 / 0.1);
console.log(9007199254740992 + 1);
