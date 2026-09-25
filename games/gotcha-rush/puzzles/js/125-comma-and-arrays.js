// @title Commas everywhere
// @difficulty 3
// @tags operators, coercion, arrays
// @distractor 1\n1,2,3,4,5
// @distractor 3\n[1,2,3,4,5]
// @distractor 3\n1,2,3,4,5
// @explain The comma operator evaluates each operand and yields the last one, so x is 3. + on two arrays converts both to strings ("1,2,3" and "4,5") and concatenates them, so the 3 and 4 collide into "34".
const x = (1, 2, 3);
console.log(x);
console.log([1, 2, 3] + [4, 5]);
