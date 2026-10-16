---
title: "How to learn TypeScript: a roadmap for JS developers"
description: How to learn TypeScript after JavaScript: strict mode, unions, narrowing, generics, typing APIs and React, in order. Plus a free 12 chapter course.
author: Umair
date: 2026-10-16
tags: [programming, typescript, javascript]
targetQuery: how to learn typescript
course: typescript
image: /blog/covers/how-to-learn-typescript.webp
imageAlt: "Architectural floor plan drawings on a desk with a mechanical pencil, a metal ruler, tape and a case of drafting pens"
---

The fastest answer to how to learn TypeScript is to stop treating it as a new language. It is JavaScript with a checker that reads your code before it runs. So learn it in this order: turn on strict mode in a real project, learn to describe the shapes of your data with unions, let the checker narrow those unions for you, then learn generics, and only after that touch the clever type level features. If you already write JavaScript comfortably, you can be productive in TypeScript within a couple of weeks and genuinely good at it within a couple of months.

This guide walks through that roadmap step by step, lists the mistakes that keep people stuck at "TypeScript is just annoying", and explains what our free [TypeScript for JavaScript Developers](/learn/typescript) course covers, chapter by chapter.

## Before you start: do you know enough JavaScript?

TypeScript adds nothing at runtime, so every confusing moment is either a JavaScript problem or a types problem, and you need to tell them apart. Be comfortable with:

- objects, arrays, destructuring and spread
- functions as values, callbacks and closures
- promises and `async`/`await`
- modules (`import` and `export`)
- reading a stack trace without panic

If several feel shaky, spend a few weeks on plain JavaScript first through [full stack web](/learn/full-stack-web) or [frontend engineering](/learn/frontend-engineering).

## Why bother: what types actually catch

Here is the kind of bug that ships every week in JavaScript:

```js
function totalPrice(order) {
  return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

totalPrice({ items: [{ price: '', qty: 2 }] }); // 0, a blank price is silently free
```

No crash, no stack trace, just a wrong number in your database. With a two line type, the editor flags it before you save the file:

```ts
type Item = { price: number; qty: number };
type Order = { items: Item[] };
// totalPrice({ items: [{ price: '', qty: 2 }] })
// Type 'string' is not assignable to type 'number'.
```

Types catch typos and renames, missing values (the endless "Cannot read properties of undefined") and wrong shapes across a function boundary. They do not catch wrong business logic, and they do not check data arriving from outside your program unless you make them.

## How to learn TypeScript: the roadmap, step by step

| Stage | What to learn | You are done when |
| --- | --- | --- |
| 1. Setup | `tsc`, `tsconfig.json`, `strict: true` | a small project compiles with zero errors in strict mode |
| 2. Shapes | type aliases, interfaces, unions, optional properties | you can type an API response by hand |
| 3. Narrowing | `typeof`, `in`, discriminated unions, `unknown` | a `switch` over a union errors when you forget a case |
| 4. Generics | type parameters, `keyof`, utility types | you write one generic helper instead of three copies |
| 5. Real code | async types, `.d.ts` files, React props and hooks | a real feature ships in TypeScript with no `any` |
| 6. Precision | conditional types, branded types, `satisfies` | you can read a library's types without fear |

### Stage 1: get strict mode running on day one

Install TypeScript, run `tsc --init`, and set `"strict": true`. Do not start without it. Strict mode switches on `strictNullChecks`, which is the single flag that removes most undefined errors, and `noImplicitAny`, which stops values quietly losing their types. Learning TypeScript with strict mode off teaches you a weaker language and leaves you with habits to unlearn.

Then learn when *not* to annotate: annotate function parameters and exported return types, and let inference handle local variables.

### Stage 2: describe shapes, and lean on unions

Learn `type` and `interface` (they overlap a lot; pick one style and stay consistent), optional properties, and above all union types. The most useful pattern in the entire language is the discriminated union:

```ts
type RequestState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; data: User[] };
```

With this, "loading but also has data" simply cannot be written. Bad states become unrepresentable.

### Stage 3: narrowing and the edges

TypeScript follows your `if` statements. After `if (req.status === 'error')`, it knows `message` exists. Learn type guards, predicates and assertion functions for when the built in checks are not enough. Learn the difference between `unknown` (a value you must check before using) and `any` (a value the checker stops caring about). Use `never` to make a `switch` fail to compile when someone adds a new case and forgets to handle it.

### Stage 4: generics without fear

Generics are parameters for types. Start with `first<T>(items: T[]): T | undefined`, then learn `keyof`, `typeof`, indexed access and the weekly utility types: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`. The goal is deriving types instead of copying them.

### Stage 5: TypeScript in a real codebase

Most tutorials stop too early here. Type async functions and API responses (`res.json()` hands you `any`), write a declaration file for an untyped package, type React components and hooks, and migrate a JavaScript project gradually. If you are on the backend side, pairing this stage with a [Node.js backend](/learn/nodejs-backend) project works well; our guide on [how to learn Node.js backend](/blog/how-to-learn-nodejs-backend) shows the API you could build.

### Stage 6: the type level tools, last

Conditional types, `infer`, template literals, branded types and `satisfies` are powerful, and they are where beginners lose weeks writing types nobody can read. Learn them after shipping real code.

## Mistakes that keep people stuck

**Reaching for `any` whenever an error appears.** Every `any` is a hole that spreads: whatever touches it loses its type too. Use `unknown` and narrow it.

**Using `as` to silence the checker.** An assertion says "trust me", and usually hides the bug the error was pointing at.

**Trusting types at the boundary.** A type annotation on `JSON.parse` output is a promise, not a check. Data from an API, a form or an environment variable must be validated at runtime, with a schema library such as Zod or your own guards, before the type means anything.

**Not reading the error.** TypeScript errors look long, but the most specific line is often the last one in the chain, so try reading from the bottom up.

## What the free TypeScript course covers

[TypeScript for JavaScript Developers](/learn/typescript) is an intermediate, text based course built around the roadmap above. It has 12 chapters with four lessons each, a quiz after every topic, and a final exam. Each chapter is meant to leave you able to fix a specific real failure.

| Chapter | What you learn |
| --- | --- |
| 1. Why Types, and Getting Them Running | what types catch, `tsc`, `tsconfig` and strict mode, inference, type checking JavaScript with JSDoc |
| 2. Describing Shapes | interfaces vs type aliases, unions and intersections, literal types and discriminated unions, when to avoid enums |
| 3. Narrowing, Guards, and the Edges of the Type System | control flow analysis, type guards and assertion functions, `unknown`, `any` and `never`, escape hatches |
| 4. Generics and Type Transformations | generics from first principles, `keyof` and `typeof`, utility types, function overloads |
| 5. TypeScript in a Real Codebase | typing async code and API responses, declaration files, React components and hooks, migrating a JS project |
| 6. Types That Compute | conditional types and `infer`, template literal types, branded types and `satisfies`, recursive types |
| 7. Keeping a Large Codebase Fast and Green | reading type errors, build speed and project references, testing types, upgrading TypeScript safely |
| 8. Where Types Meet Real Data | parse, don't validate, schemas as the single source of truth, typed config and env, generated types from OpenAPI, GraphQL and SQL |
| 9. Why the Checker Says Yes | how assignability works, excess property checks, variance, the unsound corners |
| 10. Modelling a Domain in Types | failure as data, state machines the compiler enforces, `readonly`, domain types vs wire types |
| 11. Shipping Types Other People Depend On | APIs that infer for the caller, readable error messages, ESM, CJS and module resolution, versioning types |
| 12. Programming the Compiler Itself | the compiler API, codemods with ts-morph, type aware lint rules, language service plugins |

Chapters 1 to 5 are what most working developers need. Chapters 6 to 12 are for people maintaining large codebases or publishing libraries.

## Who it is for, and how long it takes

The course is for people who already write JavaScript: frontend developers moving a React app to TypeScript, Node developers tired of runtime surprises, and students whose internship codebase turned out to be TypeScript. It is not a first programming course. If you are still choosing a first language, read [which programming language to learn first](/blog/which-programming-language-should-you-learn-first-in-pakistan) instead.

The suggested pace is 6 weeks. The reading is roughly ten and a half hours, but typing the examples into an editor, breaking them and watching the errors change is where TypeScript sticks. With an hour or so a day, six weeks is realistic.

## How the quizzes and free certificate work

Each topic has a minimum reading time of 90 seconds before its quiz opens, and you need 70 percent on that quiz to unlock the next topic. Chapter quizzes are practice with instant feedback.

The certificate comes from the final exam: 50 questions, 60 minutes, one timed attempt, and you pass with 50 out of 100 marks. If you do not pass, a retake opens 30 days later with the questions and options reshuffled. Pass, and you get a free certificate with a verification code and a QR code anyone can check. Keep it in proportion: a reviewer will learn more from a repository with strict mode on and no stray `any` than from any certificate, ours included.

## Frequently Asked Questions (FAQ)

### Should I learn JavaScript before TypeScript?
Yes. TypeScript is JavaScript plus a type checker, so every runtime behaviour, from closures to promises, is still JavaScript. Learn the language first, then add types. You will understand the errors much faster.

### How long does it take to learn TypeScript?
If you already write JavaScript, the everyday parts (strict mode, unions, narrowing, basic generics) take a couple of weeks of real use. Comfort with declaration files, React typing and the advanced type features takes a couple of months. Our course suggests 6 weeks for the full twelve chapters.

### Is TypeScript hard to learn?
The basics are not. Most difficulty comes from turning strict mode off, escaping errors with `any`, or jumping to advanced type tricks too early.

### Do I need TypeScript for React or Node.js?
Neither requires it, but many teams use it for both because it makes large codebases safer to change.

### Is the TypeScript course really free?
Yes. The lessons, quizzes, final exam and certificate are all free. You need an account to track your progress and sit the exam.

---

*Ready to start? Open [TypeScript for JavaScript Developers](/learn/typescript), switch on strict mode in a project you already have, and work through Chapter 1 this week. The red squiggles are the point.*
