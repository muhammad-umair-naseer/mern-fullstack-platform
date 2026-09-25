# @title Sets and equal values
# @difficulty 2
# @tags sets, equality
# @distractor {3, 1, 2} [3, 2, 1] 3
# @distractor {1, 2, 3} [3, 2, 1] 2
# @distractor {1, 2, 3} [1, 2, 3] 1
# @explain Small integers hash to themselves, so this set iterates in numeric order. 1, 1.0 and True are equal with the same hash, so the set keeps only one of them.
print({3, 1, 2}, sorted({3, 1, 2}, reverse=True), len({1, 1.0, True}))
