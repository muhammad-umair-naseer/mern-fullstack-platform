# @title The walrus
# @difficulty 3
# @tags walrus, assignment expressions
# @distractor 3\n[1, 2, 3]
# @distractor 6\n[1, 2, 3, 3]
# @distractor 3\n[1, 2, 3, 6]
# @explain := assigns and yields the value in one expression. n becomes 3 inside the if. In the comprehension, y is assigned to the doubled value inside the filter and then used as the element, so the result is the doubled values — and unlike x, y leaks out of the comprehension (it is 6 afterwards).
data = [1, 2, 3]
if (n := len(data)) > 2:
    print(n)
print([y for x in data if (y := x * 2) < 10])
