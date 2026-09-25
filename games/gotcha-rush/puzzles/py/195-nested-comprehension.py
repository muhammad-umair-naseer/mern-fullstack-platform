# @title Nested comprehension
# @difficulty 2
# @tags comprehensions
# @distractor [[0], [0, 1], [0, 1, 2]]
# @distractor [[0], [0, 1]]
# @distractor [[0, 1, 2], [0, 1], [0]]
# @explain The inner range(i) has i elements, and i runs 0, 1, 2, so the rows have 0, 1 and 2 elements respectively.
print([[j for j in range(i)] for i in range(3)])
