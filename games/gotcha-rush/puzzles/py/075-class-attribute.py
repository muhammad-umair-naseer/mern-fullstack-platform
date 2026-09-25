# @title Class attribute or instance attribute?
# @difficulty 3
# @tags classes, attributes
# @distractor [1] [2] [3]
# @distractor [1, 3] [2, 3] [1, 3]
# @distractor [1, 2, 3] [1, 2, 3] [1, 2, 3]
# @explain a.items.append mutates the single list on the class, shared by every instance. b.items = [2] creates a new instance attribute that shadows it for b only. A.items.append(3) mutates the class list, which a still sees.
class A:
    items = []

a = A()
b = A()
a.items.append(1)
b.items = [2]
A.items.append(3)
print(a.items, b.items, A.items)
