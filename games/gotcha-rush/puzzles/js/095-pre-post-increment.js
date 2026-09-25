// @title ++ before and after
// @difficulty 2
// @tags operators
// @distractor 3 3
// @distractor 2 3
// @distractor 3 5
// @explain a++ evaluates to the old value (1) and then bumps a to 2. ++a bumps first, to 3, and evaluates to 3. So b is 1 + 3 = 4 and a ends at 3.
let a = 1;
const b = a++ + ++a;
console.log(a, b);
