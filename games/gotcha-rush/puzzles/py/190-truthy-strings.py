# @title Truthiness of odd values
# @difficulty 1
# @tags truthiness, bool
# @distractor False False False False False
# @distractor True False False False False
# @distractor True True False True False
# @explain Any non-empty string is truthy, including "False". Empty strings, zero, and None are falsy. A list is truthy if it has any elements, even a single 0.
print(bool("False"), bool(""), bool(0.0), bool([0]), bool(None))
