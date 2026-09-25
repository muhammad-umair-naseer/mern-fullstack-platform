# @title Dictionary order
# @difficulty 2
# @tags dicts, ordering
# @distractor ['a', 'b', 'c']
# @distractor ['c', 'a', 'b']
# @distractor ['b', 'a', 'c']
# @explain Dicts keep insertion order. Updating an existing key keeps its position, deleting removes it, and inserting it again puts it at the end.
d = {"a": 1, "b": 2}
d["a"] = 3
d["c"] = 4
del d["b"]
d["b"] = 5
print(list(d))
