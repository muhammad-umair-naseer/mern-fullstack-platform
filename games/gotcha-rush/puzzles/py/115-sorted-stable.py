# @title Sorting by key
# @difficulty 2
# @tags sorting, stability
# @distractor ['ccc', 'dd', 'bb', 'a']\n[3, 2, 1]
# @distractor ['a', 'dd', 'bb', 'ccc']\n[3, 2, 1]
# @distractor ['a', 'bb', 'dd', 'ccc']\n[1, 2, 3]
# @explain Sorting is stable, so "bb" and "dd" (equal length) keep their original order. sorted with reverse=True still keeps equal elements in original order but here they are all distinct.
print(sorted(["bb", "a", "ccc", "dd"], key=len))
print(sorted([3, 1, 2], reverse=True))
