// @title Big numbers
// @difficulty 2
// @tags bigint, types
// @distractor number\n15\n18446744073709552000
// @distractor bigint\n15n\n18446744073709551616
// @distractor bigint\n15\n1.8446744073709552e+19
// @explain BigInt is its own primitive type. Arithmetic between BigInts is exact, so 2n ** 64n is the full 20-digit value with no rounding. String() renders it without the n suffix.
console.log(typeof 10n);
console.log(String(10n + 5n));
console.log(String(2n ** 64n));
