# @title Powers and signs
# @difficulty 2
# @tags operators, precedence
# @distractor 9 9 0.5 2
# @distractor -9 9 0 2.0
# @distractor -9 9 0.5 2
# @explain ** binds tighter than unary minus, so -3 ** 2 is -(3 ** 2) = -9. Parentheses fix it. A negative exponent yields a float, and / always returns a float, even for exact division.
print(-3 ** 2, (-3) ** 2, 2 ** -1, 10 / 5)
