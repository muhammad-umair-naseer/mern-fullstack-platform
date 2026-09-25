# @title all and any of nothing
# @difficulty 2
# @tags builtins, truthiness
# @distractor False False False False
# @distractor True False True True
# @distractor True True False False
# @explain all([]) is True (no element is false) and any([]) is False (no element is true). A list containing an empty list has one falsy element, so all is False and any is False.
print(all([]), any([]), all([[]]), any([[]]))
