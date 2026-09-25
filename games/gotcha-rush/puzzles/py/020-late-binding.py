# @title Late binding
# @difficulty 3
# @tags closures, lambdas
# @distractor [0, 1, 2]\n[0, 1, 2]
# @distractor [2, 2, 2]\n[2, 2, 2]
# @distractor [0, 1, 2]\n[2, 2, 2]
# @explain A closure looks up i when it is called, not when it is created, and by then the loop has finished with i == 2. The default argument i=i captures the current value at definition time.
fs = [lambda: i for i in range(3)]
print([f() for f in fs])
gs = [lambda i=i: i for i in range(3)]
print([g() for g in gs])
