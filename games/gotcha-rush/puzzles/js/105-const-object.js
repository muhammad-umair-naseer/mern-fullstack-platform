// @title const is not frozen
// @difficulty 1
// @tags const, objects
// @distractor TypeError\nTypeError
// @distractor {"a":2,"b":3}\n{}
// @distractor {"a":1}\nTypeError
// @explain const prevents rebinding the variable, not mutating the value it points to. Changing and adding properties is fine; assigning a new object to o is what throws.
const o = { a: 1 };
o.a = 2;
o.b = 3;
console.log(JSON.stringify(o));
try {
  o = {};
} catch (e) {
  console.log(e.constructor.name);
}
