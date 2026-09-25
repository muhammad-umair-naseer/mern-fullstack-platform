# @title The mutable default
# @difficulty 2
# @tags defaults, mutability
# @distractor [1]\n[2]\n[3]
# @distractor [1]\n[1, 2]\n[1, 2, 3]
# @distractor [1]\n[2]\n[1, 2, 3]
# @explain Default values are evaluated once, when the function is defined, so every call that omits acc shares the same list. Passing a fresh list for the third call sidesteps it.
def f(x, acc=[]):
    acc.append(x)
    return acc

print(f(1))
print(f(2))
print(f(3, []))
