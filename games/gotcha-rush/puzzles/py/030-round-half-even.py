# @title Banker's rounding
# @difficulty 2
# @tags floats, rounding
# @distractor 1 2 3 2.68
# @distractor 0 2 2 2.68
# @distractor 1 2 3 2.67
# @explain round() uses round-half-to-even: ties go to the nearest even number, so 0.5 → 0, 1.5 → 2 and 2.5 → 2. round(2.675, 2) gives 2.67 because 2.675 is actually stored as 2.67499999… in binary.
print(round(0.5), round(1.5), round(2.5), round(2.675, 2))
