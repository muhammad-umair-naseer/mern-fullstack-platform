# @title sep and end
# @difficulty 1
# @tags print
# @distractor a b!\nc
# @distractor a-b\n!c
# @distractor a-b!c!
# @explain sep goes between arguments and end replaces the newline. Since the first print ends with "!" and no newline, "c" lands on the same line.
print("a", "b", sep="-", end="!")
print("c")
