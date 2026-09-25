# @title += on a list
# @difficulty 3
# @tags lists, augmented assignment, references
# @distractor False\nFalse [1]
# @distractor True\nTrue [1, 2, 3]
# @distractor True\nFalse [1, 2, 3]
# @explain a += [2] extends the existing list in place, so b (the same object) sees it. a = a + [3] builds a new list and rebinds a, leaving b at [1, 2].
a = [1]
b = a
a += [2]
print(a is b)
a = a + [3]
print(a is b, b)
