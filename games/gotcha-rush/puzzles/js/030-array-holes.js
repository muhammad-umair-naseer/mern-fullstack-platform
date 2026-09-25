// @title Holes in the array
// @difficulty 2
// @tags arrays, sparse
// @distractor 4\nundefined\n[1,2,3,6]
// @distractor 6\n6\n[1,2,3,null,null,6]
// @distractor 6\nundefined\n[1,2,3,undefined,undefined,6]
// @explain Assigning to index 5 grows the array to length 6 and leaves indices 3 and 4 as empty slots. Reading a hole gives undefined, and JSON.stringify writes holes as null.
const a = [1, 2, 3];
a[5] = 6;
console.log(a.length);
console.log(a[4]);
console.log(JSON.stringify(a));
