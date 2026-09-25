// @title Optional chaining and nullish
// @difficulty 2
// @tags optional chaining, nullish coalescing
// @distractor TypeError\n0\ndefault
// @distractor undefined\ndefault\ndefault
// @distractor undefined\n0\n0
// @explain ?. short-circuits to undefined instead of throwing when the left side is null or undefined. ?? only falls back for null and undefined, so a 0 survives; || treats 0 as falsy and replaces it.
const user = { profile: null };
console.log(user.profile?.name);
console.log(0 ?? "default");
console.log(0 || "default");
