# @title The tuple that changed anyway
# @difficulty 4
# @tags tuples, mutability, augmented assignment
# @distractor error\n(1, [2])
# @distractor (1, [2, 3])
# @distractor error\n(1, [2, 3, 3])
# @explain t[1] += [3] first extends the list in place (that succeeds), then tries to assign the result back into the tuple, which raises TypeError. So the error is printed and the list inside the tuple has still grown.
t = (1, [2])
try:
    t[1] += [3]
except TypeError:
    print("error")
print(t)
