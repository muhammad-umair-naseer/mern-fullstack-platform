// @title delete on an array
// @difficulty 2
// @tags arrays, delete, sparse
// @distractor 2 1-3 false
// @distractor 3 1-undefined-3 true
// @distractor 2 1-3 true
// @explain delete removes the property but never reindexes an array, leaving a hole: length stays 3, join renders the hole as an empty string, and the in operator reports the index as missing.
const a = [1, 2, 3];
delete a[1];
console.log(a.length, a.join("-"), 1 in a);
