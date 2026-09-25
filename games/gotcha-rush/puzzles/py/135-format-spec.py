# @title Format specs
# @difficulty 2
# @tags f-strings, formatting
# @distractor 3.14|3.1|hi|42
# @distractor 3.14|     3.1|hi   |00042
# @distractor 3.142|     3.1|   hi|42
# @explain .2f rounds to two decimals; 8.1f pads to width 8; >5 right-aligns in a field of 5; 05d zero-pads an integer to width 5.
x = 3.14159
print(f"{x:.2f}|{x:8.1f}|{'hi':>5}|{42:05d}")
