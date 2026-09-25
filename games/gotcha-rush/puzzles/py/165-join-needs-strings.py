# @title join wants strings
# @difficulty 2
# @tags strings, join, errors
# @distractor 1,2\n1,2
# @distractor 3\n1,2
# @distractor TypeError\n[1, 2]
# @explain str.join only accepts strings; integers raise TypeError. Mapping str over the list first fixes it.
try:
    print(",".join([1, 2]))
except TypeError:
    print("TypeError")
print(",".join(map(str, [1, 2])))
