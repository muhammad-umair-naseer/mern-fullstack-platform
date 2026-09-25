// @title Double equals
// @difficulty 3
// @tags equality, coercion
// @distractor false\ntrue\ntrue\ntrue\ntrue
// @distractor true\ntrue\nfalse\nfalse\ntrue
// @distractor true\nfalse\ntrue\nfalse\nfalse
// @explain == converts operands step by step. [] becomes "" then 0, and false becomes 0, so [] == false. "" == 0 because "" converts to 0. null == undefined is a special case that is true, but null only loosely equals undefined — it never converts to a number, so null == 0 is false. "0" becomes 0 and false becomes 0, so that one is true.
console.log([] == false);
console.log("" == 0);
console.log(null == undefined);
console.log(null == 0);
console.log("0" == false);
