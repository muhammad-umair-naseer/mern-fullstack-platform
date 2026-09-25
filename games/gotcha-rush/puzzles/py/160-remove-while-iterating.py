# @title Removing while iterating
# @difficulty 3
# @tags lists, iteration
# @distractor [1, 3]
# @distractor [1, 2, 2, 3]
# @distractor []
# @explain The loop walks by index. After removing the first 2 at index 1, the second 2 slides into index 1 — which the loop has already passed — so it survives. Never mutate a list you are iterating over.
a = [1, 2, 2, 3]
for x in a:
    if x == 2:
        a.remove(x)
print(a)
