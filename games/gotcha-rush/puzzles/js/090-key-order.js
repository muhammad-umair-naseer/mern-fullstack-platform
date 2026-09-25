// @title Key order
// @difficulty 3
// @tags objects, keys
// @distractor b,2,a,1
// @distractor 1,2,a,b
// @distractor a,b,1,2
// @explain Object.keys lists integer-like keys first in ascending numeric order, then string keys in insertion order. So 1 and 2 jump to the front even though they were added last.
const o = { b: 1, 2: "x", a: 2, 1: "y" };
console.log(Object.keys(o).join());
