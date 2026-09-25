// @title Writing to length
// @difficulty 2
// @tags arrays, length
// @distractor 1,2,3,4\n4 4
// @distractor 1,2\n2 undefined
// @distractor 1,2\n4 3
// @explain Setting length smaller truncates the array and discards the elements. Growing it again does not bring them back; the new slots are empty and read as undefined.
const a = [1, 2, 3, 4];
a.length = 2;
console.log(a.join());
a.length = 4;
console.log(a.length, a[3]);
