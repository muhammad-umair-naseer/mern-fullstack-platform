# @title Where does not bind?
# @difficulty 3
# @tags operators, precedence
# @distractor False False 1
# @distractor True False 0
# @distractor True True 1
# @explain not has lower precedence than comparison and arithmetic operators. not 1 == 2 is not (1 == 2) → True; not 1 + 1 is not (2) → False; (not 1) + 1 is False + 1 → 1.
print(not 1 == 2, not 1 + 1, (not 1) + 1)
