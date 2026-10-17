---
title: "TypeDash: a free online typing race game and how to play"
description: TypeDash is a free typing race game in your browser. Learn the modes, how points work, why a typo never gets you stuck, and how levels and streaks grow.
author: Umair
date: 2026-10-09
tags: [games, typing, multiplayer]
targetQuery: online typing race game
image: /blog/covers/typedash-online-typing-race-game.webp
imageAlt: "The TypeDash home screen with a live race track, a button to race other people and options to type on your own or play the daily paragraph"
---

TypeDash is a free typing race game in your browser. A short paragraph appears, everyone types it, and each car on the track moves as its owner types. To start, press **Race other people** above, wait for the countdown, and type the words you see.

## Three ways to start a race

- **Race other people.** You join a public room. A room holds up to five racers. If there are not enough people, computer players join so the race can start after a short wait.
- **Type on your own.** A practice run starts right away with no waiting. By default you race a pacer. A pacer is a computer car that types at one steady speed.
- **The daily paragraph.** Look for the strip marked **Today** and press **Have a go**. Everyone in the world gets the same paragraph each day. Only your first finished run counts, so you get one proper shot.

Want to race people you know? Press **Play with friends**, then **Make a private game**, and share the code or link. Our guide on [how to start a typing race with friends](/blog/typing-race-with-friends) walks through it step by step.



![Architectural Blueprint and Learning Stages for TypeDash: a free online typing race game and how to play — Cortexis Roadmap Diagram](/blog/diagrams/typedash-online-typing-race-game-architecture.webp)
*Figure 1: Complete step-by-step architectural workflow and technical execution stages for TypeDash: a free online typing race game and how to play.*

## Pick a language, a mode and a pacer

Press **Change** under the play buttons. A small panel opens with a few steps.

**Language.** There are seven: English, Spanish, German, French, Portuguese, Indonesian and Turkish. If your keyboard has no accent keys, the plain letter works too. For example, e is accepted for é and s for ş.

**Mode.** In English there are two extra modes:

- **Code.** Real one line snippets in JavaScript, Python, SQL, Go, Rust, TypeScript, CSS, Bash and more. Read [typing practice for programmers](/blog/typing-practice-for-programmers) if this is the mode you want.
- **Numbers and symbols.** Dates, prices and codes.

Rooms are matched by language and mode, so everyone in your race types the same kind of text.

**Pacer.** This step is for practice runs. The pacer starts on medium, which types at 55 words per minute. You can switch to easy at 35, hard at 80 or pro at 110. You can also race your own best, race a ghost (explained below) or turn the pacer off.

## How the race works

After the countdown, type the paragraph. Your car moves forward with every correct letter. The other cars are the other racers, moving live as they type.

A race ends one minute after the first racer finishes, or when the time limit of two and a half minutes runs out. Then the results table lists every racer with their speed, accuracy, points and time. Press **Stay for another race** and the next race starts in the same room.

## The no stuck typo rule

In many typing games a wrong key goes into the text. You have to delete it before you can carry on.

TypeDash works differently. In accordance with standard browser keystroke handling (defined in the [W3C KeyboardEvent specification](https://www.w3.org/TR/uievents/#events-keyboardevents)), a wrong key never goes into the text. The letter you needed turns red, and you lose 20 points. Then you just press the right key to carry on. You only ever retype that one letter. There is nothing to fix with Backspace, so one typo can never trap you.

Every wrong key also counts as one error in your accuracy, and it resets your combo. So it is still worth slowing down a little to type cleanly.

## How points work in a race

| Scoring Component | Points Value | Trigger / Requirement | Impact on Play |
| --- | --- | --- | --- |
| **Correct Key** | 10 pts × Multiplier | Hit expected letter | Base progression |
| **Combo Tier 1 (10 keys)** | 1.25× multiplier | 10 streak without error | Early score build |
| **Combo Tier 2 (25 keys)** | 1.50× multiplier | 25 streak without error | High scoring zone |
| **Combo Tier 3 (50 keys)** | 2.00× multiplier | 50 streak without error | Double points per key |
| **Combo Tier 4 (100 keys)** | 3.00× multiplier | 100 streak without error | Maximum multiplier |
| **Flawless Word** | +40 pts | Word typed with 0 typos | Fills nitro meter (5 needed) |
| **Golden Word** | +250 pts | Typed highlighted golden word cleanly | High-value target |
| **1st Place Finish** | +1,000 pts | Cross finish line first | Match win bonus |
| **Typo Penalty** | -20 pts | Wrong key pressed | Resets combo streak to 0 |

Your race score comes from a few simple rules.

- **Each correct key** is worth 10 points, times your current multiplier. It starts at 1.
- **Combos.** A combo is your run of correct keys in a row. At 10 in a row your points grow by a quarter. At 25 they grow by half. At 50 they double and at 100 they triple. One wrong key sends the combo back to zero. The pop ups and the results screen talk about words in a row, but the game really counts keys.
- **Flawless words.** A flawless word is a word you typed with no wrong keys. Each one adds 40 points.
- **Nitro.** Nitro is a short speed boost. Every flawless word fills part of the nitro meter, and five fill it. Then nitro fires for about three seconds. Your points double, your car gets flames, and everyone in the room can see it. A typo takes away half a word of charge. The results screen calls these "boosts used".
- **Golden words.** Three words in each race glow gold in the paragraph. Type one with no mistakes for 250 bonus points. The results screen calls these "bonus words".
- **Finish bonus.** First place adds 1000 points, second 600, third 400 and any other finish 200. A finish with no wrong keys at all adds another 500. If you made a few mistakes but still kept 98% accuracy or better, you get 200 instead.

Wrong keys cost 20 points each, but your score never drops below zero.

## Which points count

The results screen shows two numbers, and they are not the same.

The big number marked **points** is your race score. It is just for fun.

The smaller **+N points** next to your level bar is your ranked points. These are the ones that count. They raise your level and put you on the world rankings. The server works them out from your real race stats: distance, speed, accuracy, place, golden words and best combo.

## Ghosts: race a replay of a real run

Every finished run leaves a replay called a ghost. In practice you can race the ghost of the world record on that paragraph. It shows up as a see through car typing exactly as the record holder did. You can also race the ghost of your own best.

When you share a practice result, the share page includes a link so a friend can race your ghost.

## Levels, cars, streaks and rankings

**Levels.** Ranked points raise your level, and each level gives you a title. You start as a Rookie and can climb through names like Racer, Turbo and Speed Demon up to Immortal.

**Cars.** There are nine car skins in the garage. You start with one and unlock the rest as your level goes up.

**Play streak.** Play on days in a row to build a play streak. Any race counts, not just the daily paragraph. A practice run or a race with friends keeps it alive too. Each day adds 5% to your ranked points, up to a limit of 50%. Miss a day and it starts again. The daily paragraph also keeps its own separate streak.

**Rankings.** There are world boards for points, speed, combo, wins, streak and golden words. There are also boards for the daily paragraph, teams and countries. The points race also starts again every calendar month as a new season, and the top 100 of each season get a badge.

Two things to know. Guest scores are not ranked. To get a place on the boards, press the **Sign in** link under the play buttons. Also, practice runs and private games with friends never give ranked points. Those come only from public races.

## Tips for your first few races

- Look at the next word, not the letter you just typed.
- Aim for clean words before speed. Flawless words fill your nitro, and not missing keys keeps your combo growing.
- Watch for the golden words and slow down a little on them.
- Warm up with a practice run against the easy pacer before a public race.

If you want a plan to get faster over a few weeks, read [how to type faster and more accurately](/blog/how-to-type-faster). When you want a break from typing, try our other [free browser games](/games), such as [Gotcha Rush](/games/gotcha-rush) or [PickParty](/games/pickparty).

## Frequently Asked Questions (FAQ)

### Is TypeDash free to play?
Yes. It is free and runs in your browser with nothing to download. You can play as a guest straight away, and sign in when you want your scores ranked.

### How many people can be in one race?
Up to five racers share one race. In public rooms, computer players join when there are not enough people, so the race can start after a short wait.

### What happens when I press the wrong key?
The wrong letter does not go into the text. The letter you needed turns red, you lose 20 points and your combo resets. Press the right key and you carry on, so you never get stuck.

### Can I play TypeDash on my own?
Yes. Press Type on your own to practise against a pacer car, your own best run or the ghost of the world record. Practice keeps your play streak going but does not give ranked points.

### What is the daily paragraph?
It is one paragraph that everyone in the world types on the same day. Press Have a go in the Today strip to play it. Only your first finished run counts, and it has its own board each day.

### Can I race on code instead of normal text?
Yes. Press Change, choose English and then the Code mode. You will type real short snippets from languages like JavaScript, Python and SQL, symbols and all.
