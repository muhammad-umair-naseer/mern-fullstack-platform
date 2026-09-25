// @title Closures in a loop
// @difficulty 2
// @tags closures, scope, event loop
// @distractor 0\n1\n2\n0\n1\n2
// @distractor 3\n3\n3\n3\n3\n3
// @distractor 0\n1\n2\n3\n3\n3
// @explain All six callbacks run after the loops finish. The var loop shares one i, which is 3 by then. let creates a fresh binding per iteration, so those callbacks remember 0, 1 and 2. Timers fire in the order they were scheduled.
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j));
