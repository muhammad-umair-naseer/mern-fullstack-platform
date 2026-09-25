// @title Arrays in disguise
// @difficulty 2
// @tags arrays, coercion, equality
// @distractor false false [object Object]
// @distractor true false 
// @distractor true true [object Array]
// @explain == with an array first converts it to a string via join: "1" == 1 and "1,2" == "1,2" are both true. Adding an array and an object converts both to strings — "" for [] and "[object Object]" for {}.
console.log([1] == 1, [1, 2] == "1,2", [] + {});
