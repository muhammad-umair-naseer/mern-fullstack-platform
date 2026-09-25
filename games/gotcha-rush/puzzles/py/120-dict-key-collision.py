# @title Three keys, one slot
# @difficulty 3
# @tags dicts, hashing, equality
# @distractor True True {1: 'a', 1.0: 'b', True: 'c'}
# @distractor True False {1: 'c'}
# @distractor True True {True: 'c'}
# @explain 1, 1.0 and True are all equal and hash to the same value, so they are the same dict key. The first key written (1) keeps its spelling; later writes only update the value, ending with "c".
print(1 == 1.0, hash(1) == hash(1.0), {1: "a", 1.0: "b", True: "c"})
