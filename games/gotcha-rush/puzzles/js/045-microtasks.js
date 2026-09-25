// @title Timers versus promises
// @difficulty 3
// @tags event loop, promises
// @distractor 1\n2\n3\n4
// @distractor 1\n4\n2\n3
// @distractor 1\n3\n4\n2
// @explain Synchronous code runs first (1, 4). Promise callbacks are microtasks and run as soon as the current script finishes (3). setTimeout callbacks are macrotasks and run on a later turn of the event loop (2), even with a 0 ms delay.
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
