// @title Comparing strings
// @difficulty 2
// @tags strings, comparison, coercion
// @distractor false\nfalse\ntrue\ntrue
// @distractor true\ntrue\ntrue\nfalse
// @distractor false\ntrue\ntrue\ntrue
// @explain Two strings compare character by character, so "10" < "9" because "1" comes before "9". Mixing a number and a string converts the string to a number, so 10 < 9 is false. Upper-case letters have lower code units than lower-case ones, so "B" > "a" is false.
console.log("10" < "9");
console.log(10 < "9");
console.log("b" > "a");
console.log("B" > "a");
