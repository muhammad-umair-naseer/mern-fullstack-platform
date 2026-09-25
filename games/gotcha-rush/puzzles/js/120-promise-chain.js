// @title Down the promise chain
// @difficulty 3
// @tags promises, errors
// @distractor 1\n2\ncaught x\n9\ndone\nsync
// @distractor sync\n1\n2\ncaught x\ndone
// @distractor sync\n1\n2\ncaught x\nundefined\ndone
// @explain "sync" prints first because every .then callback is asynchronous. Each handler receives the previous return value; the throw skips ahead to catch, whose return value (9) feeds the next then. finally runs last and does not change the value.
Promise.resolve(1)
  .then((v) => { console.log(v); return v + 1; })
  .then((v) => { console.log(v); throw new Error("x"); })
  .catch((e) => { console.log("caught", e.message); return 9; })
  .then((v) => console.log(v))
  .finally(() => console.log("done"));
console.log("sync");
