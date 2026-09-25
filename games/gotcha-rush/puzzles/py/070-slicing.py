# @title Slices never complain
# @difficulty 1
# @tags strings, slicing
# @distractor IndexError
# @distractor bc abc c cba
# @distractor bc None c cba
# @explain Slicing clamps out-of-range indices instead of raising, so s[1:10] is "bc" and s[10:] is an empty string. Negative indices count from the end, and [::-1] reverses.
s = "abc"
print(s[1:10], s[10:], s[-1], s[::-1])
