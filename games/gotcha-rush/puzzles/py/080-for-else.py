# @title for … else
# @difficulty 2
# @tags loops, control flow
# @distractor no break\nbroke
# @distractor broke
# @distractor no break\nno break
# @explain The else clause of a loop runs only when the loop finishes without hitting break. The first loop never breaks, so "no break" prints; the second breaks at i == 1, so its else is skipped.
for i in range(3):
    if i == 5:
        break
else:
    print("no break")

for i in range(3):
    if i == 1:
        break
else:
    print("broke")
