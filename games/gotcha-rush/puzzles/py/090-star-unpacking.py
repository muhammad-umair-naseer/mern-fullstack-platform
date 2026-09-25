# @title Star unpacking
# @difficulty 2
# @tags unpacking, sequences
# @distractor 1 [2, 3, 4] 5\nhi
# @distractor 1 (2, 3, 4) 5\n['h', 'i']
# @distractor 1 [2, 3, 4, 5]\n['h', 'i']
# @explain The starred target collects whatever is left after the other names take theirs, always as a list. *x, = "hi" is the same trick with a single starred target, so it slurps every character.
a, *b, c = [1, 2, 3, 4, 5]
print(a, b, c)
*x, = "hi"
print(x)
