# @title nonlocal and the unbound local
# @difficulty 3
# @tags scope, closures
# @distractor 3\n1
# @distractor 1\nunbound
# @distractor 3\nNameError
# @explain nonlocal lets inner() rebind outer's x, so two calls take it to 3. In f(), the assignment y += 1 makes y local to the whole function, and reading it before assignment raises UnboundLocalError, even though a global y exists.
def outer():
    x = 1
    def inner():
        nonlocal x
        x += 1
        return x
    inner()
    inner()
    return x

print(outer())

y = 0
def f():
    try:
        y += 1
    except UnboundLocalError:
        print("unbound")

f()
