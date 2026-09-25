# @title Floats and ints under pressure
# @difficulty 2
# @tags floats, integers
# @distractor 0.3 True 1e+16 9007199254740992
# @distractor 0.30000000000000004 False 10000000000000001 9007199254740993
# @distractor 0.30000000000000004 False 1e+16 9007199254740992
# @explain 0.1 + 0.2 is the usual binary rounding surprise. 1e16 is a float, so adding 1 is lost to precision and repr shows 1e+16. 2 ** 53 + 1 is pure integer arithmetic, which is exact at any size.
print(0.1 + 0.2, 0.1 + 0.2 == 0.3, 1e16 + 1, 2 ** 53 + 1)
