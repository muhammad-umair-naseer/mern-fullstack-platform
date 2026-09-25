# @title range from the other end
# @difficulty 1
# @tags range, sequences
# @distractor [10, 7, 4, 1] [] 5
# @distractor [10, 7, 4] [] 4
# @distractor [10, 7, 4, 1] [0] 4
# @explain range(10, 0, -3) counts down until it would pass 0. range(0) is empty. range objects support indexing, and -1 gives the last element, 4.
print(list(range(10, 0, -3)), list(range(0)), range(5)[-1])
