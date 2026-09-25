// @title Spread and Array.from
// @difficulty 2
// @tags iterables, spread
// @distractor olleh\n0,1,2
// @distractor hello\n0,2,4
// @distractor olleh\n2,4,6
// @explain A string is iterable by code point, so spreading it gives an array of characters. Array.from with a mapping function runs it for each index of the length-3 array-like, producing 0, 2 and 4.
console.log([..."hello"].reverse().join(""));
console.log(Array.from({ length: 3 }, (_, i) => i * 2).join());
