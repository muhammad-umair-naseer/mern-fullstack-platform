# @title Shared rows
# @difficulty 2
# @tags lists, references
# @distractor [[9, 0], [0, 0]]
# @distractor [[9, 9], [9, 9]]
# @distractor [[9, 0], [9, 0], [9, 0]]
# @explain [[0] * 2] * 2 repeats a reference to the same inner list twice. Changing a[0][0] changes the one list both rows point to.
a = [[0] * 2] * 2
a[0][0] = 9
print(a)
