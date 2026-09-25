// @title Same object, two names
// @difficulty 1
// @tags references, objects
// @distractor 1 2
// @distractor 2 1
// @distractor 1 1
// @explain b = a copies the reference, not the object, so both names point at the same object and see the update. Assigning a whole new object to a afterwards only rebinds a.
let a = { n: 1 };
const b = a;
a.n = 2;
a = { n: 3 };
console.log(b.n, a.n);
