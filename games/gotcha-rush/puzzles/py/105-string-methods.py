# @title String methods
# @difficulty 1
# @tags strings, methods
# @distractor hELLO ['a', 'b', 'c'] x|
# @distractor HELLO ['a', 'b-c'] x |
# @distractor Hello ['a', 'b-c'] x|
# @explain swapcase flips the case of every letter. split with maxsplit=1 stops after the first separator. strip removes surrounding whitespace before the "|" is appended.
print("Hello".swapcase(), "a-b-c".split("-", 1), "  x ".strip() + "|")
