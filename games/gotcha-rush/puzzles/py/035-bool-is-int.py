# @title Booleans are integers
# @difficulty 1
# @tags bool, types
# @distractor TrueTrue True 2
# @distractor 2 False 2
# @distractor True True 2
# @explain bool is a subclass of int with True == 1 and False == 0, so booleans add up and count in sums. isinstance(True, int) is therefore True.
print(True + True, isinstance(True, int), sum([True, False, True]))
