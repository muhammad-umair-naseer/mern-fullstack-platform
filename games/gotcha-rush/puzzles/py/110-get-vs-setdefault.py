# @title get versus setdefault
# @difficulty 2
# @tags dicts
# @distractor 1 {'a': 1}\n2 {'a': 2}
# @distractor 1 {}\n1 {'a': 2}
# @distractor 1 {}\n2 {}
# @explain get returns the default without touching the dict. setdefault inserts the default when the key is missing, so afterwards "a" exists with the value 2 and get finds it.
d = {}
print(d.get("a", 1), d)
d.setdefault("a", 2)
print(d.get("a", 1), d)
