# @title Chained comparisons
# @difficulty 2
# @tags comparisons, operators
# @distractor True True True True
# @distractor True False True False
# @distractor True True False False
# @explain a < b < c means a < b and b < c, and the same chaining applies to any comparison operators, including in. "b" < "B" is False because upper-case letters sort before lower-case ones.
print(1 < 2 < 3, 1 < 3 > 2, 1 == 1 in [1], "a" < "b" < "B")
