# @title is versus ==
# @difficulty 2
# @tags identity, equality
# @distractor True\nTrue True
# @distractor False\nTrue False
# @distractor True\nFalse False
# @explain == compares values; is compares identity. Small integers are cached, so both names point at the same 256 object. Two separate list literals are equal in value but are two different objects.
a = 256
b = 256
print(a is b)
c = [1]
d = [1]
print(c == d, c is d)
