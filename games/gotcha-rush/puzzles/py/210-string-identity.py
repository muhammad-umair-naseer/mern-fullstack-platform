# @title Counting with strings
# @difficulty 2
# @tags strings, methods
# @distractor 2 3 2
# @distractor 3 2 1
# @distractor 2 2 1
# @explain count finds non-overlapping occurrences, so "aaa" contains "aa" only once. find returns the first index; rfind the last.
s = "banana"
print(s.count("an"), "aaa".count("aa"), s.rfind("a") - s.find("a"))
