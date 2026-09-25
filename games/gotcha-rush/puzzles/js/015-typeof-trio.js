// @title What type is that?
// @difficulty 1
// @tags typeof, types
// @distractor null\nundefined\nNaN
// @distractor object\nobject\nnumber
// @distractor null\nundefined\nnumber
// @explain typeof null is "object" — a bug from the first JavaScript engine that can never be fixed without breaking the web. NaN is "not a number" by name, but its type is number.
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);
