// @title Fall through
// @difficulty 1
// @tags switch, control flow
// @distractor two
// @distractor two\nthree\nother
// @distractor one\ntwo\nthree
// @explain Without a break, execution falls from the matching case straight into the next ones. It starts at case 2, prints "two", continues into case 3, prints "three", and only then hits a break.
switch (2) {
  case 1: console.log("one");
  case 2: console.log("two");
  case 3: console.log("three"); break;
  default: console.log("other");
}
