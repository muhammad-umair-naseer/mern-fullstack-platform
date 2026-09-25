# @title Shadowing a global
# @difficulty 2
# @tags scope, global
# @distractor 20 20\n30
# @distractor 20 10\n10
# @distractor 10 10\n30
# @explain Assigning x inside f() creates a local x that shadows the global, which stays 10. g() declares global x, so its assignment changes the module-level variable.
x = 10

def f():
    x = 20
    return x

print(f(), x)

def g():
    global x
    x = 30

g()
print(x)
