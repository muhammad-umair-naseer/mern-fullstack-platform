---
title: "AI engineer roadmap: what to learn, and in what order"
description: An honest AI engineer roadmap for developers who already code. What to learn in order, from tokens and RAG to evals and guardrails, and what to skip.
author: Umair
date: 2026-10-16
tags: [careers, ai, learning]
targetQuery: ai engineer roadmap
image: /blog/covers/ai-engineer-roadmap.webp
imageAlt: "An open notebook full of hand-drawn sketches and notes with a wooden pen resting on the page"
course: ai-engineering
---

A sensible AI engineer roadmap starts with ordinary programming, then goes in this order: how a model call actually works, structured output, retrieval over your own documents, tools and agents, and finally evaluation, cost and safety. You do not need to train a model from scratch to do this job. You need to build software on top of models that other people trained, and make it hold up when real users arrive with messy input.

That distinction is the whole point of this guide. Most roadmaps you will find online are machine learning roadmaps with a new title: linear algebra, then neural networks, then transformers, then maybe an API call in month nine. That path suits research. It is the wrong path if you want to ship a support bot or a document search tool next year. Our free [AI Engineering with LLMs](/learn/ai-engineering) course follows the second path, and the roadmap below is built the same way.

## What an AI engineer actually does

An AI engineer writes the code around a language model. Concretely, that looks like:

- calling a model API and handling timeouts, retries and rate limits
- forcing the model to return JSON your code can parse every single time
- building retrieval so the model answers from your company's documents rather than its memory
- giving the model tools (a database lookup, an order status check) and keeping that loop bounded
- measuring whether any of it works, with an eval set rather than a gut feeling
- keeping the monthly bill predictable

Notice what is missing: calculus, training runs, GPU clusters.

| | AI engineer | ML engineer |
| --- | --- | --- |
| Main material | prompts, APIs, retrieval, tools, evals | datasets, training, model architecture |
| Typical first task | wire a model into an existing product | improve a model's accuracy on a task |
| Maths needed day to day | light | substantial |
| Starting point | a working backend developer | a strong Python and statistics base |

If the right column is what you want, start with [AI and ML Essentials](/learn/ai-ml-essentials) instead. If the left column is what you want, keep reading.

## Step 0: be able to build a small backend first

This is the step people skip. Nearly every hard bug in an LLM feature is a normal software bug wearing a costume: a request with no timeout, a retry loop that hammers a provider that is already down, user input pasted straight into a string, a refund issued twice because a request was replayed.

Before the roadmap proper, you should be able to write a small API in Python or JavaScript, call another API from it, read JSON, handle an error, and put it somewhere a friend can reach. The AI Engineering course is marked Intermediate for this reason, and its code examples are almost all in JavaScript, with a little Python. If you are not there yet, [Python Development](/learn/python-development) is the gentler start, and our post on [which programming language to learn first in Pakistan](/blog/which-programming-language-should-you-learn-first-in-pakistan) will help you choose without switching four times.

## The AI engineer roadmap, stage by stage

### Stage 1: how models actually work

Learn what a token is, why the context window is a single budget shared by input and output, and why every request resends the whole conversation. Learn what temperature does, and why temperature 0 still does not give you true determinism.

### Stage 2: prompting and structured output

A prompt that works on three examples you tried is not a prompt. Learn to keep instructions and user data in separate places, change one thing at a time, and use few-shot examples rather than paragraphs of description. Above all, learn structured output: give the model a schema, validate the result anyway, and retry once with the validation error. Truncated or malformed JSON is one of the first production failures most teams meet.

If you want to go deeper on this layer alone, [Prompt Engineering](/learn/prompt-engineering) is a shorter companion course.

### Stage 3: embeddings and retrieval (RAG)

Retrieval augmented generation is how a model answers from facts it was never trained on. Learn embeddings and cosine similarity, how to chunk and clean documents before indexing, and how to order what you pack into the context. When an answer is wrong, check whether retrieval found the right passage before blaming the model; a retrieval miss often looks exactly like a hallucination.

### Stage 4: tools, agents and their failure modes

Function calling lets the model choose an action, but your code executes it, and the arguments the model produces are untrusted user input. Learn the agent loop, and just as importantly, when not to build one. Learn why prompt injection has no fix that lives inside the prompt, and why code execution needs a real sandbox, never your own server process.

### Stage 5: evaluation, cost and shipping

This is where hobby projects and production systems part ways. Build an eval set from real traffic, run it like a test suite, and accept that offline evals are not enough on their own. Learn how caching cuts cost, and choose a model with your own bake-off rather than a public leaderboard.

### Stage 6 onwards: the production layer

Once the core is solid, the remaining topics are about running these systems for months: streaming, queues and fallbacks, fine-tuning and distillation when prompting has plateaued, permission-aware retrieval, conversation memory, multi-agent orchestration, red-teaming, and drift.

## What the free course covers, chapter by chapter

The [AI Engineering with LLMs](/learn/ai-engineering) course has 12 chapters of 4 lessons each, 48 lessons in total, with each lesson marked at 12 to 15 minutes of reading. It is text and code, not video.

| # | Chapter | What you come away able to do |
| --- | --- | --- |
| 1 | How Models Actually Work | reason about tokens, sampling, API calls and knowledge cutoffs |
| 2 | Prompting and Structured Output | write prompts that survive real input and get JSON that parses |
| 3 | Embeddings and Retrieval-Augmented Generation | build and debug a RAG pipeline over your own documents |
| 4 | Tools, Agents, and Failure Modes | add function calling, bound an agent loop, handle injection and PII |
| 5 | Evaluation, Cost, and Shipping | evaluate non-deterministic output, cache, and pick a model by bake-off |
| 6 | Streaming, Throughput, and Reliability | stream safely, queue work, add fallbacks and idempotency |
| 7 | Fine-Tuning, Distillation, and Multimodal | know when to fine-tune, build cascades, handle documents and voice |
| 8 | Databases, Live APIs, and Permissioned Retrieval | run text to SQL on a read-only role, respect who may see what |
| 9 | Memory, Compaction, and the Long Conversation | summarise long chats and store memory users can delete |
| 10 | Orchestration, Sub-Agents, and Tool Ecosystems | split work across agents and choose from large tool registries |
| 11 | Red-Teaming, Guardrails, and Blast Radius | attack your own feature and limit what a compromised agent can do |
| 12 | Drift, Regression, and the Improvement Loop | monitor live quality and survive a model deprecation |

Every chapter is built around a specific production failure you learn to diagnose, such as a prompt cache that never hits or an eval suite that quietly rewards longer answers.

## How long this roadmap takes

The course is listed at eight weeks. That assumes you already code and can give it steady time most days. The stages stick when you build one small project per stage: a script that returns validated JSON, then a question answering tool over your own PDFs, then the same tool with a function call and a small eval set.

If you are starting from zero programming, add the time it takes to get comfortable with a backend first.

## Mistakes that slow people down

- **Starting with the maths.** Useful for ML research, a detour for this job. You can return to it later.
- **Raising temperature to fix a bad prompt.** You get output that is randomly bad instead of predictably bad, and you can no longer reproduce the failure.
- **Skipping evals.** Without a fixed set of test questions, you cannot tell whether yesterday's change helped or hurt.
- **Trusting the model with permissions.** Credentials belong to the user, not the agent, and irreversible actions need a human to confirm them.

## How the free certificate works

Each lesson ends with a short quiz, which unlocks after 90 seconds on the lesson, and you need 70 percent to pass it. The course ends with a final exam of 50 questions in 60 minutes, and you pass with 50 out of 100 marks. You get one timed attempt; if it does not go your way, a single retake opens 30 days later. Pass, and the certificate is issued with a verification code anyone can check.

Be clear about what that certificate says: that you passed our exam. It will not get you hired on its own. A small deployed project with an eval set will do far more for you in an interview. Our post on [whether free online certificates are worth anything](/blog/are-free-online-certificates-worth-anything) goes into this honestly.

## Who this roadmap is for

It suits backend and full stack developers who want to add AI features to real products, final year students who already build things and want a focused next step, and freelancers whose clients keep asking for a chatbot that answers from their own documents. If you mainly want to use AI tools at work rather than build with them, this is the wrong course, and [AI Automation and Agents](/learn/ai-automation-agents) or a no-code route will serve you better.

## Frequently Asked Questions (FAQ)

### Do I need a computer science degree to follow an AI engineer roadmap?
No. You need to be able to write and deploy a small backend in Python or JavaScript.

### How much maths does an AI engineer need?
Much less than an ML engineer. Knowing roughly what an embedding is and what cosine similarity measures is enough to start. Calculus and training theory matter if you later move into fine-tuning research or model training.

### Should I learn Python or JavaScript for AI engineering?
Either works for the job itself. The course examples are mostly JavaScript, but the ideas carry straight over to Python, so pick the one you already ship code in.

### Is the AI Engineering with LLMs course really free?
Yes. All 48 lessons, the quizzes, the final exam and the certificate are free. You will need your own access to a model API to run the examples, and providers set their own terms and pricing for that.

### What should I build first to show employers?
A question answering tool over a small set of real documents, with retrieval, a structured output step and a short eval set you can run in one command. Put it online and be ready to explain one failure you found and fixed.

---

*Ready to start? [AI Engineering with LLMs](/learn/ai-engineering) begins with tokens and the shape of a real API call, and it is free from the first lesson to the certificate.*
