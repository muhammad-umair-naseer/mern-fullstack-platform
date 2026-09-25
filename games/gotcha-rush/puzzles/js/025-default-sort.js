// @title The default sort
// @difficulty 2
// @tags arrays, sort
// @distractor 1,9,10\n1,9,10
// @distractor 10,9,1\n1,9,10
// @distractor 1,10,9\n10,9,1
// @explain Array.prototype.sort with no comparator converts every element to a string and sorts by UTF-16 code units, so "10" comes before "9". A numeric comparator fixes it.
const a = [10, 9, 1];
console.log(a.sort().join(","));
console.log(a.sort((x, y) => x - y).join(","));
