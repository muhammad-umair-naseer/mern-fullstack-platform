# @title finally always runs
# @difficulty 3
# @tags exceptions, finally
# @distractor 1\ne\nf
# @distractor 2\ne\nf
# @distractor 1\nf\ne
# @explain A return inside finally overrides the return from try, so f() gives 2. In g() the except block's return value is kept, but finally still runs before the function actually returns, so "f" prints first.
def f():
    try:
        return 1
    finally:
        return 2

def g():
    try:
        raise ValueError
    except ValueError:
        return "e"
    finally:
        print("f")

print(f())
print(g())
