// @title What JSON keeps
// @difficulty 2
// @tags JSON, undefined, NaN
// @distractor {"a":undefined,"b":null,"d":NaN}\n[undefined]
// @distractor {"b":null}\n[]
// @distractor {"a":null,"b":null,"c":null,"d":null}\n[null]
// @explain JSON.stringify drops properties whose value is undefined or a function, and turns NaN into null. In arrays it cannot drop positions, so undefined becomes null instead.
console.log(JSON.stringify({ a: undefined, b: null, c: () => 1, d: NaN }));
console.log(JSON.stringify([undefined]));
