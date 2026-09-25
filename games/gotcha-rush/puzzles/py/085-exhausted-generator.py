# @title Used up
# @difficulty 2
# @tags generators, iterators
# @distractor 5 5 [0, 1, 4]
# @distractor 5 5 []
# @distractor 5 0 [0, 1, 4]
# @explain A generator can only be consumed once. The first sum drains it (0 + 1 + 4 = 5), so the second sum sees nothing and list() gets an empty iterator.
g = (x * x for x in range(3))
print(sum(g), sum(g), list(g))
