// @title Strings never change
// @difficulty 2
// @tags strings, immutability
// @distractor zbc
// @distractor ZBC
// @distractor ABC
// @explain Strings are immutable. Assigning to s[0] silently does nothing in sloppy mode, and toUpperCase returns a new string that is thrown away here. The original "abc" is untouched.
let s = "abc";
s[0] = "z";
s.toUpperCase();
console.log(s);
