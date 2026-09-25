# @title Floor division and modulo
# @difficulty 1
# @tags integers, operators
# @distractor 3 -3 1 -1
# @distractor 3.5 -3.5 1 1
# @distractor 3 -4 1 -1
# @explain // rounds toward negative infinity, so -7 // 2 is -4, not -3. Python's % takes the sign of the divisor, so -7 % 3 is 2 (because -7 == -3*3 + 2).
print(7 // 2, -7 // 2, 7 % 3, -7 % 3)
