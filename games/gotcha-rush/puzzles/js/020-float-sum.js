// @title Point one plus point two
// @difficulty 1
// @tags floats
// @distractor true\n0.30
// @distractor false\n0.3
// @distractor true\n0.3
// @explain 0.1 and 0.2 cannot be stored exactly in binary floating point, so their sum is 0.30000000000000004, which is not === 0.3. toFixed(2) rounds for display and keeps the trailing zero because it returns a string.
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(2));
