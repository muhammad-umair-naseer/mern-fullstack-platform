# @title __str__ versus __repr__
# @difficulty 3
# @tags classes, dunder methods
# @distractor S [S] S S
# @distractor R [R] R R
# @distractor S [R] R S
# @explain print and f-strings use __str__. Containers show their elements with __repr__, and the !r conversion asks for __repr__ explicitly.
class P:
    def __repr__(self):
        return "R"
    def __str__(self):
        return "S"

p = P()
print(p, [p], f"{p}", f"{p!r}")
