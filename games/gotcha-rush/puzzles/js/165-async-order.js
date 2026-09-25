// @title async/await ordering
// @difficulty 4
// @tags async, event loop, microtasks
// @distractor a\nb\nc\ne\nd
// @distractor a\nc\ne\nb\nd
// @distractor a\nc\nd\nb\ne
// @explain f() runs synchronously until its first await, printing "a", then yields. "c" prints next. queueMicrotask is queued after the await's continuation, so "b" comes before "e". The timer is a macrotask and prints "d" last.
async function f() {
  console.log("a");
  await null;
  console.log("b");
}
f();
console.log("c");
setTimeout(() => console.log("d"), 0);
queueMicrotask(() => console.log("e"));
