# @title zip stops early
# @difficulty 2
# @tags zip, dicts
# @distractor {'a': 0, 'b': 1, 'c': 2}\n[(1, 3), (2, None)]
# @distractor ValueError
# @distractor {'a': 0, 'b': 1, 'c': 2, 3: None}\n[(1, 3)]
# @explain zip stops at the shortest input. Pairing "abc" with range(10) yields three pairs; pairing a two-element list with a one-element list yields one.
print(dict(zip("abc", range(10))))
print(list(zip([1, 2], [3])))
