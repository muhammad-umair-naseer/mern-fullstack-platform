---
title: "How to Learn Prompt Engineering: A Free 6 Week Plan"
description: How to learn prompt engineering for free, step by step. Build prompts from role, task, context and format, test them, and prove the skill with a portfolio.
author: Umair
date: 2026-10-16
tags: [ai, prompt engineering, careers]
course: prompt-engineering
home: /learn/prompt-engineering
targetQuery: how to learn prompt engineering
image: /blog/covers/how-to-learn-prompt-engineering.webp
imageAlt: "Overhead view of one hand on a laptop trackpad and the other writing in an open lined notebook on a white desk"
---

To learn prompt engineering, stop collecting "magic prompts" and start practising one habit: write instructions the way you would brief a capable new colleague. Give the model a clear goal, the background it needs, an example of good work and the exact shape of the answer you want. Then test that prompt on several real inputs, not just one. Learn how models read text, learn four building blocks, practise on your own daily work, and measure whether your prompts actually get better. That is the whole skill, and you can learn it for free in about six weeks of steady study with our [free Prompt Engineering course](/learn/prompt-engineering).

## What prompt engineering actually is

Prompt engineering is writing instructions that get a language model to produce the output you need reliably, not once by luck. The prompt is everything the model sees: your request, any examples, pasted documents, and the hidden instructions the app adds behind the scenes.

The difference shows up quickly. Compare these:

| Weak prompt | Strong prompt |
| --- | --- |
| Write a post about our sale | Write a 60 word Instagram caption for a 30% Eid sale on women's lawn suits at our Lahore store. Friendly tone, one emoji, end with "Shop now, link in bio". |
| Summarise this report | Summarise this report for a busy CEO in five bullet points, each under 20 words, focusing on costs and risks. |
| Fix my code | This Python function should return the total of paid orders but returns 0. Explain the bug, then give the corrected function. |

None of that is a trick, just a better brief. Clear communication is what transfers between ChatGPT, Claude, Gemini and whatever comes next.



![Architectural Blueprint and Learning Stages for How to Learn Prompt Engineering: A Free 6 Week Plan — Cortexis Roadmap Diagram](/blog/diagrams/how-to-learn-prompt-engineering-architecture.webp)
*Figure 1: Complete step-by-step architectural workflow and technical execution stages for How to Learn Prompt Engineering: A Free 6 Week Plan.*

## How to learn prompt engineering step by step

### Step 1: Understand how a model reads your prompt

You do not need maths, but you do need a mental model. Language models read text as tokens, not letters, which is why they are unreliable at counting characters or reversing words. They hold your conversation in a context window, so very long chats can push early instructions out of focus. They predict likely text, which is why they can invent facts, quotes and references that look real. And they have randomness built in, so the same prompt can give different answers.

If you need a meta description under 150 characters, ask the model to draft it, then check the length with a spreadsheet formula like LEN instead of trusting its count.

### Step 2: Learn the four building blocks

Almost every good prompt has four parts:

- **Role**: who the model should act as, such as "an experienced customer support lead".
- **Task**: the one specific job, stated as an instruction.
- **Context**: the facts it cannot guess, such as your audience, your product and your rules.
- **Format**: the shape of the answer, such as a table, five bullets or 80 words.

Add **delimiters** (tags or clear markers around pasted text) so the model can tell your instructions apart from your data. Then add **examples**. One or two examples of the output you want usually do more than a paragraph of description. Models copy examples closely. If every example starts with "Introducing", most outputs will too.

### Step 3: Get better reasoning on harder problems

For anything that needs thought, ask the model to work step by step before giving its answer. For big jobs, split the work into a **prompt chain**: one prompt for an outline, another for the draft, another for the edit. Then try a **self critique loop**, where the model reviews its own draft against your criteria, lists the problems and rewrites.

### Step 4: Control the output exactly

Real work needs a fixed shape: a table, valid JSON, a template, or text at the right length, tone and reading level. A concrete description of the reader ("a shop owner with no technical background, short sentences, no jargon") sets the reading level far better than "write simply".

### Step 5: Apply it to the work you already do

Use prompting on your actual tasks: summarising long PDFs, extracting data from emails, drafting social posts in a consistent brand voice, writing spreadsheet formulas and SQL from plain language, or debugging code. Go deep on two areas that match your job.

### Step 6: Test prompts like a professional

Most self taught people skip this step. Build a small **test set** of realistic inputs, including the awkward ones. Score each output with a simple **rubric**, ideally pass or fail criteria rather than a vague 1 to 10 scale. Change one thing at a time and compare versions on the same test set. Keep your best prompts in a versioned library so you know which one is current.

## A 6 week roadmap you can follow

Plan on roughly an hour a day, five days a week, split between lessons and practice on your own tasks.

| Week | Focus | Practice task |
| --- | --- | --- |
| 1 | How models work, the four building blocks | Rewrite five prompts you used this month using role, task, context and format |
| 2 | Examples, reasoning, prompt chains | Build a three step chain for one recurring job, such as a weekly report |
| 3 | Output control, documents, long context | Extract fields from ten real emails or invoices into a table |
| 4 | System prompts and custom assistants | Write instructions for a simple assistant that answers questions about one policy |
| 5 | Writing, marketing, code, data and images | Produce a batch of on brand posts or a set of working spreadsheet formulas |
| 6 | Testing, safety, career | Score two versions of one prompt on 20 inputs and write it up as a case study |

## Mistakes to avoid

- **Hunting for magic words.** Phrases that once worked on one model often break after an update or on another tool. Clear briefs keep working.
- **Judging a prompt on one output.** One good answer proves very little. Try it on ten different inputs before you trust it.
- **Trusting facts and references.** A model with no search access can produce realistic author names and journal titles for papers that do not exist. Verify every reference yourself.
- **Asking it to "improve" your writing with no limits.** Without a stated editing level, models tend to rewrite heavily and replace your voice with theirs. Say "fix grammar only" or "tighten, keep my wording".
- **Pasting private data.** Customer details, passwords and confidential documents should not go into a tool your organisation has not approved.

## What the free course covers, chapter by chapter

The [Prompt Engineering course](/learn/prompt-engineering) is rated Beginner to Intermediate, is planned for six weeks, and has 12 chapters with four lessons each. Every lesson ends with a short quiz.

1. **How Language Models Read Your Prompt**: what prompt engineering is, tokens and context windows, why models hallucinate and drift, and temperature.
2. **The Building Blocks of a Strong Prompt**: role, task, context and format, clear constraints, delimiters, and zero shot, one shot and few shot examples.
3. **Getting Better Reasoning**: step by step thinking, prompt chains, self critique loops, and choosing between fast and reasoning models.
4. **Controlling the Output**: tables and templates, JSON, length, tone and reading level, and prompts that check other prompts.
5. **Working With Documents and Long Context**: summaries that keep what matters, extracting data from PDFs, emails and forms, answering with quotes, and merging sources.
6. **System Prompts and Custom Assistants**: what a system prompt controls, instructions for GPTs, Projects and Gems, personas and guardrails, and the limits of knowledge files and memory.
7. **Prompting for Writing and Marketing**: brand voice, social posts and ad copy at scale, long form and SEO drafts, and AI as an editor.
8. **Prompting for Code and Data**: code requests, debugging, formulas and SQL from plain language, and data analysis with its limits.
9. **Image, Audio and Video Prompting**: the anatomy of an image prompt, style and iteration, video and voice tools, and rights, likeness and disclosure.
10. **Testing and Improving Prompts**: test sets, rubrics, fair comparisons and prompt libraries.
11. **Prompt Safety and Security**: prompt injection, keeping private data out, misuse limits, and reviewing output before it ships.
12. **Prompt Engineering as a Career Skill**: working across ChatGPT, Claude and Gemini, building a portfolio, freelance services, and keeping your skills current.

## Who this is for, and how long it takes

The course suits students, office workers, marketers, freelancers, support staff and developers who already use a chatbot and want reliable results instead of lucky ones. You need no coding background.

If you have never used an AI chatbot at all, start one level lower with [AI Tools for Everyone](/learn/ai-tools-for-everyone) and our guide on how to [learn how to use AI tools for free](/blog/learn-how-to-use-ai-tools-for-free). If you want to go further and connect prompts to real systems, [AI Automation and Agents](/learn/ai-automation-agents) and [AI Engineering](/learn/ai-engineering) are the natural next steps.

Six weeks is the planned pace. Taking longer because you practise on your own work is the better outcome.

## How the free certificate works

Each lesson has a 90 second reading time before its quiz unlocks, so you cannot just click through. The certificate comes from a final exam of 50 questions in 60 minutes, taken in one timed attempt. If it does not go well, one retake opens 30 days later. Leaving the exam tab submits it.

Be honest with yourself about what a certificate proves. The course itself ranks a certificate with no project attached below a tested case study. Pair it with two or three case studies: the problem, your prompt, your test set, and how the results improved between versions. We cover this in [are free online certificates worth anything](/blog/are-free-online-certificates-worth-anything).

## Frequently Asked Questions (FAQ)

### Can I learn prompt engineering for free?
Yes. The free plans of ChatGPT, Claude and Gemini are enough to practise the core text skills, and our course, quizzes and certificate are free.

### Do I need to know coding to learn prompt engineering?
No. Most prompt engineering is clear writing and careful testing. Coding helps if you want to connect prompts to software or output JSON for an app, but beginners can learn the core skill without it.

### How long does it take to learn prompt engineering?
Plan for about six weeks at an hour a day to cover the fundamentals and apply them properly. Real fluency keeps growing as you use the skill on your own work.

### Is prompt engineering still worth learning?
The job title may come and go, but the skill keeps its value. Turning a messy request into a clear brief, then testing whether the output holds up, is useful in marketing, operations, analysis, support and development roles.

### How do I show employers or clients my prompt engineering skill?
Build a small portfolio. Show a real problem, your prompt, a test set, and how pass rates improved from your first version to your last. That says far more than a list of clever prompts.

Ready to start? Open the free [Prompt Engineering course](/learn/prompt-engineering) and finish the first chapter this week.
