---
title: "Gotcha Rush: a guess the output game for coders"
description: How to play Gotcha Rush, a free guess the output game. Read a JavaScript or Python snippet, type what it prints, and beat up to four other players.
date: 2026-10-09
tags: [games, javascript, python, multiplayer]
targetQuery: guess the output game
image: /blog/covers/gotcha-rush-guess-the-output-game.webp
imageAlt: "The Gotcha Rush home screen with a language picker and buttons for Quick Match, Solo Rush and Play with friends"
home: /games/gotcha-rush
---

Gotcha Rush is a guess the output game: you read a short piece of JavaScript or Python code and type exactly what it prints, while up to four other players try to beat you to it. To start, pick a language on the game's home screen (JavaScript, Python or Both). Then press **Quick Match** to play a ranked room, **Solo Rush** to play alone, or **Play with friends** to make a private room. A room is one shared game that several players join.

## How one round works

Every round has the same four steps. They are printed on the game itself.

1. **Read the snippet.** Everyone in the room sees the same few lines of code.
2. **Type what it prints.** You get one box for each line of output. Press Enter to move to the next box. On the last line, Enter locks in.
3. **Lock in.** Locking in means sending your final answer. Press the Lock in button, or Ctrl+Enter (Cmd+Enter on a Mac). The sooner you lock in, the more you can score.
4. **Watch it run.** The real output prints line by line next to what you typed. You see exactly which lines you got right.

You have forty seconds per round. After the answer is shown, a **Why** box explains the trick behind the snippet. So a wrong answer still teaches you something. Then the next round starts.

A public match has 8 rounds. Every puzzle has a difficulty from 1 (easy) to 5 (hardest). The puzzles get harder as the match goes on. The first rounds use easy snippets (difficulty 1 to 2), and the last ones use medium to hardest (3 to 5).

## How your answer is checked

The game compares your answer with the real output one line at a time. Two rules matter:

- **Spaces do not matter.** `[0, 0, 0]` and `[0,0,0]` count as the same line.
- **Capital letters do.** In Python, `True` is right and `true` is wrong. In JavaScript it is the other way round.

Extra lines count against you. If the code prints two lines and you type three, the answer is not a full match.

## Two real puzzles from the game

These come from the game's set of puzzles. They look almost the same, but the two languages give different answers. Try them before you read the output.

### Chained comparisons in JavaScript

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Output:**

```
true
false
```

JavaScript works out comparisons from left to right. Each step gives a boolean, which is `true` or `false`. `1 < 2` is `true`, and `true < 3` becomes `1 < 3`, which is `true`. But `3 > 2` is `true`, and `true > 1` becomes `1 > 1`, which is `false`.

### Chained comparisons in Python

```python
print(1 < 2 < 3, 1 < 3 > 2, 1 == 1 in [1], "a" < "b" < "B")
```

**Output:**

```
True True True False
```

Python reads `a < b < c` as `a < b and b < c`. That is why `1 < 3 > 2` is `True` here. The same chaining works with `in`, so `1 == 1 in [1]` means `1 == 1 and 1 in [1]`. The last one is `False` because capital letters sort before small letters, so `"b" < "B"` is false.

Every output in the game came from really running the code, not from typing it by hand. The game has 83 puzzles: 41 in JavaScript and 42 in Python. Want more practice first? Read our [JavaScript output questions](/blog/javascript-output-questions) and [Python output questions](/blog/python-output-questions). Each has 10 snippets and full explanations.

## How points are scored

Your points for a round come from a few pieces.

- **Base points.** A fully correct answer is worth 80 points plus 60 for each difficulty level. That makes 140 to 380.
- **Speed bonus.** Lock in early and you get up to 50% more on top of the base.
- **First in the room.** The first player with a fully correct answer gets 60 extra points.
- **Combo.** A combo is a run of fully correct rounds in a row. Each one adds 15% to your next correct answer. After 5 in a row you reach the limit of 1.75 times. The combo multiplies your base and speed points, but not the 60 points for being first.
- **Partial answers.** If only some lines are right, you still get a small share of the base points for those lines. But your combo resets. An answer with no right lines scores nothing.

### The lifeline

Stuck? Press the **Lifeline** button. It turns the round into a multiple choice question with up to four options: the real answer and some wrong ones. The catch is that your points for that round are cut in half. It is a good way to keep a combo alive on a hard puzzle.

## Quick Match, Solo Rush and private rooms

### Quick Match

Quick Match puts you in a public room of up to five players. The lobby is the waiting screen before a match. If not enough people join, it waits about 12 seconds. Then bots (computer players) join so there are at least four players in the room. Bots take a believable amount of time to answer and make more mistakes on harder puzzles.

### Solo Rush

Solo Rush is a single player mode with three lives and no fixed number of rounds. Any round you do not answer fully right costs a life. The clock starts at forty seconds and gets 2 seconds shorter each round, down to 14 seconds. The puzzles also get harder as you go. Your run ends when you lose your third life. Your best run can go on the Rush ranking board, which is explained below.

### Play with friends

Make a private room and share the room code. As the host, you pick the language and the number of rounds (5, 8, 10 or 12). You can also choose whether bots join to make at least four players. The room has chat, just like Quick Match rooms do. Private games are friendlies. They do not give ranked points. But they still keep a head to head record against each player and keep your daily streak going.

## Rankings, levels and achievements

Only players signed in with a Cortexis account are ranked. If you play as a guest, your scores stay on your device and are not ranked.

After a ranked match, your score turns into ranked points. You get a tenth of your match score, plus a bonus for your place. That is 200 for first, 120 for second, 80 for third and 40 for everyone else. Getting every round right adds 150 more.

Rankings are shown on boards, which are lists of the top players. There are boards for points, Rush runs, accuracy, puzzles solved, combos, wins and streaks. You can see each board for the whole world or just your country.

Some other things that build up as you play:

- **Daily streak.** Finish a game on back to back days and each day adds 5% to your points, up to 50%. Miss a day and it starts again. Days are counted in UTC time, so the day may change at a different hour where you live.
- **Levels and titles.** Points raise your level, and levels give titles. You start as a Script Kiddie and can climb through titles like Debugger, Type Coercer and Language Lawyer.
- **Achievements.** There are 25 to earn.

## Tips for your first match

- **Count the lines first.** The number of answer boxes is a hint, so check how many lines the code prints before you type.
- **Watch the case.** Many wrong answers are just `true` typed in a Python round, or `None` typed where JavaScript prints `undefined`.
- **Do not rush the hard ones.** Being first gives you 60 points, but a wrong answer earns little or nothing and resets your combo.

When you want a break from code puzzles, try a live typing race in [TypeDash](/games/typedash) or a drafting game in [PickParty](/games/pickparty). All our games are on the [free games page](/games), and if you want to learn JavaScript or Python properly, start with our [free courses](/courses).

## Frequently Asked Questions (FAQ)

### What is a guess the output game?
It is a game where you see a short piece of code and have to say exactly what it prints. Gotcha Rush makes it a live race. Everyone gets the same snippet and the same clock, and the fastest correct answer scores the most.

### Which languages does Gotcha Rush use?
JavaScript and Python. You can pick one of them or choose Both to get a mix of the two.

### How many people can play in one room?
Up to five players share a room. In Quick Match, bots join so there are at least four players if not enough people come. In a private room the host decides whether bots join.

### Do I need an account to play?
No. You can play as a guest. Guest scores stay on your device and are not ranked, so sign in with a Cortexis account if you want to appear on the rankings.

### Does the lifeline cost anything?
Yes. It gives you up to four options to pick from, but it halves your points for that round.
