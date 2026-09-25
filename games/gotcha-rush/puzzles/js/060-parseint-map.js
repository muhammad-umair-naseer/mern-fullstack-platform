// @title map(parseInt)
// @difficulty 3
// @tags parseInt, callbacks, arrays
// @distractor 10,10,10
// @distractor 10,NaN,NaN
// @distractor 10,2,2
// @explain map calls the callback with (value, index, array), and parseInt takes (string, radix). So it runs parseInt("10", 0) → 10, parseInt("10", 1) → NaN (radix 1 is invalid), parseInt("10", 2) → 2 (binary).
const r = ["10", "10", "10"].map(parseInt);
console.log(r.join(","));
