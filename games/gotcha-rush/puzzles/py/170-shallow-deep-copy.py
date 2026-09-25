# @title Shallow versus deep
# @difficulty 2
# @tags copying, references
# @distractor [[1], [2]] [[1], [2]]
# @distractor [[1, 9], [2]] [[1, 9], [2]]
# @distractor [[1], [2]] [[1, 9], [2]]
# @explain A slice copies the outer list but not the inner lists, so b still shares the inner [1] with a and sees the appended 9. deepcopy duplicates everything, so c is untouched.
import copy

a = [[1], [2]]
b = a[:]
c = copy.deepcopy(a)
a[0].append(9)
print(b, c)
