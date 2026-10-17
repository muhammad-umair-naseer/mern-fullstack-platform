---
title: "How to learn machine learning from scratch: a roadmap"
description: How to learn machine learning from scratch, in order. What to learn first, what to skip, the mistakes that waste months, and a free course to follow.
author: Umair
date: 2026-10-16
tags: [learning, machine-learning, ai]
targetQuery: how to learn machine learning from scratch
course: ai-ml-essentials
home: /learn/ai-ml-essentials
image: /blog/covers/how-to-learn-machine-learning-from-scratch.webp
imageAlt: "A hand drawn line graph rising from left to right on white paper, with a ruler and two pens on a wooden desk"
---

To learn machine learning from scratch, get comfortable with Python and pandas first, then learn one small loop and repeat it until it is boring: split your data, score a dumb baseline, fit a simple model, measure it honestly, and read the mistakes it makes. Linear models, then trees and boosting, then evaluation, then everything else. Neural networks come late, not first. Most people who give up did it the other way round.

That is the short answer. The rest of this post is the order we would actually follow, what each stage is for, the traps that cost beginners months, and how our free [AI & Machine Learning Essentials](/learn/ai-ml-essentials) course maps onto it chapter by chapter.

## What you need before you start

Less maths than you fear, more programming.

| Before machine learning | How much you need | Why |
| --- | --- | --- |
| Python | Comfortable: functions, loops, lists, dictionaries, reading an error | Every tool you will use is a Python library |
| pandas | Load a CSV, filter rows, group, join, handle missing values | Most real ML time is spent shaping data |
| SQL | Basic SELECT, WHERE, GROUP BY, JOIN | Data at work lives in databases, not CSV files |
| Statistics | Mean, spread, what a distribution looks like | You will be asked whether a score difference is real |
| Linear algebra and calculus | Intuition, not proofs | You can learn the pieces when a lesson needs them |

If the first two rows are shaky, fix them before anything else. Our [Python development](/learn/python-development) course covers the language, and [SQL for data analysis](/learn/sql-data-analysis) covers the querying. A week here saves a month later.

On hardware: classic machine learning on tabular data runs fine on an ordinary laptop. If yours is old, a free hosted notebook works too.



![Architectural Blueprint and Learning Stages for How to learn machine learning from scratch: a roadmap — Cortexis Roadmap Diagram](/blog/diagrams/how-to-learn-machine-learning-from-scratch-architecture.webp)
*Figure 1: Complete step-by-step architectural workflow and technical execution stages for How to learn machine learning from scratch: a roadmap.*

## How to learn machine learning from scratch, step by step

Each stage below builds on the one before it. Skipping ahead is the most common reason people feel lost.

### Stage 1: the idea and the split

Machine learning means writing a program that finds the rules from examples instead of you writing the rules. Learn the vocabulary once (feature, label, sample, training, inference), the difference between supervised and unsupervised problems, and above all the train, validation and test split. The test set is the only honest exam your model gets. If you look at it while building, you have spent it.

Then learn baselines. Before any real model, score something stupid: predict the most common class, or the average value. Every model you build afterwards has to beat that number, and you will be surprised how often a first attempt does not.

### Stage 2: linear models

Linear regression for numbers, logistic regression for yes or no. They are fast, explainable, and often good enough. This is also where you meet overfitting, the bias and variance trade off, and regularisation, which are ideas you will use for the rest of your career.

### Stage 3: trees, forests and boosting

On spreadsheet style data, tree ensembles are usually the strongest tool you have. Learn a single decision tree, then random forests, then gradient boosting. scikit-learn ships its own fast boosting models, and XGBoost, LightGBM and CatBoost are the specialist versions you will see in job posts.

### Stage 4: measuring a model honestly

This is the stage most tutorials rush, and it is the one that separates people who can be trusted with a model from people who cannot. Accuracy lies whenever one class is rare. Learn the confusion matrix, precision, recall, F1, ROC and precision recall curves, cross validation, hyperparameter search, and how to put error bars on a score so you can say whether model B is actually better than model A.

### Stage 5: features, pipelines and leakage

Feature engineering usually moves your score more than switching algorithms does. Wrap every preprocessing step in a scikit-learn pipeline so the same transformations run in training and in production. Learn data leakage here: information from the future or from the answer sneaking into your features, which produces a model that looks brilliant until it meets real data.

### Stage 6 and beyond: shipping, debugging and the rest

Then learn to save a model, serve it behind an API, and watch it for drift, followed by error analysis, time series, scaling, neural networks, and proving a model helped a business at all. This is what turns a notebook into something an employer can use.

## How long it takes to learn machine learning

It depends on your starting point and your hours, so treat this as a shape rather than a promise.

| Your starting point | Realistic first goal | What it takes |
| --- | --- | --- |
| No programming yet | Python and pandas first | Plan for a few months before ML itself |
| Comfortable with Python | Build and evaluate models on tabular data | Roughly two months at a steady part time pace |
| Already doing data analysis | Add ML to your existing work | Weeks, since the data skills transfer |

Our course is listed at eight weeks, with around eleven hours of reading across 48 topics. Reading is not the slow part. Running the code, breaking it and fixing it is, and that is where the learning happens.

## Mistakes that waste months

**Starting with deep learning.** On tabular data a boosted tree usually beats a network, trains in seconds, and teaches you more about evaluation. Our course gets to networks in chapter 10 on purpose.

**Collecting courses instead of building.** Three half finished courses teach less than one finished course plus one project you can explain. Pick one path and finish it.

**Trusting accuracy.** If 2 in every 100 transactions are fraud, a model that says "never fraud" is 98 percent accurate and completely useless. Choose the metric that matches the decision someone will make with the prediction.

**Touching the test set early.** Each peek makes it a less fair exam. Use validation data or cross validation for decisions and look at the test set once.

**Leakage you do not notice.** A feature that is only known after the event you are predicting will make your score look wonderful. If a result seems too good, assume leakage and go hunting.

## What the free AI & Machine Learning Essentials course covers

The course uses scikit-learn throughout and is written as text with code you run yourself, not as videos. It is aimed at people who already write some Python and want to go from beginner to a solid intermediate level. Here is what each of its 12 chapters covers.

| Chapter | What you learn |
| --- | --- |
| 1. What Machine Learning Actually Is | Learning from data, supervised versus unsupervised, the train, validation and test split, baselines |
| 2. Linear Models | Linear and logistic regression, choosing a threshold, overfitting and regularisation, gradient descent |
| 3. Trees, Forests, and Boosting | Decision trees, random forests and bagging, gradient boosting, stacking |
| 4. Measuring a Model Honestly | Confusion matrix, precision, recall, F1, ROC-AUC and PR curves, cross validation, error bars |
| 5. Features, Clusters, and the Limits of Models | Feature engineering and pipelines, clustering, bias and leakage, PCA |
| 6. Shipping It | Saving a model safely, a prediction service, monitoring and drift, packaging |
| 7. Debugging Models and Testing ML Code | Error analysis, explanations you can defend, testing ML code, triage when a model will not learn |
| 8. Time Series | Walk forward backtesting, lag and rolling features, forecast horizons, regime change |
| 9. Scaling It | Data that does not fit in memory, training time, latency budgets, the cost of a prediction |
| 10. Neural Networks, Embeddings, and Pretrained Models | Multilayer networks, training without wasting time, embeddings, transfer learning and when to call an API |
| 11. Proving It Helped | Why offline gains do not always show up, A/B testing a model, uplift, impact without randomisation |
| 12. Governance, Lineage, and a Portfolio of Models | Model cards, reproducing old decisions, regulated decisions, running many models over years |

Chapters 1 to 5 are the core roadmap above. Chapters 6 to 12 cover the work after a model exists, which most free material leaves out.

## How the course and certificate work

Every chapter has four topics. Each topic has its own short quiz, and you need 70 percent on it to unlock the next topic. Each topic also has a minimum reading time of 90 seconds before its quiz opens, so you cannot click straight through. Each chapter then closes with a chapter quiz that pulls the four topics together.

The certificate comes from the final exam: 50 questions, 60 minutes, one timed attempt, and you pass with 50 out of 100 marks. If you fail, a retake opens 30 days later with the questions and options reshuffled. Pass, and you get a free certificate with a verification code and a QR code that anyone can check. Be realistic about what that paper is worth; we wrote about it honestly in [are free online certificates worth anything](/blog/are-free-online-certificates-worth-anything).

## What to do this week

Pick one public dataset with a clear thing to predict. Split it, score a baseline, fit a logistic or linear regression, and write down both scores. Then start [AI & Machine Learning Essentials](/learn/ai-ml-essentials) at one topic a day. If you later want to build products on large language models instead, [AI engineering](/learn/ai-engineering) is the natural next course, and our [AI engineer roadmap](/blog/ai-engineer-roadmap) lays out that path.

## Frequently Asked Questions (FAQ)

### Can I learn machine learning from scratch without a computer science degree?
Yes. What you need is working Python, comfort with data in pandas, and patience with evaluation. A degree helps with some employers, but the skills are learnable on your own.

### How much maths do I need to learn machine learning?
Less than you fear to start. Basic statistics and an intuition for what a slope and an average mean will carry you through the first several stages. Pick up the linear algebra and calculus when a lesson needs them.

### Should I learn machine learning or deep learning first?
Machine learning first. Linear models, trees, boosting and honest evaluation are the foundation deep learning sits on, and on spreadsheet style business data they often perform better anyway. Neural networks make much more sense once you can already measure a model properly.

### Is the AI & Machine Learning Essentials course really free?
Yes. The lessons, quizzes, final exam and certificate are all free. You need an account to track progress and sit the exam.

### How long does it take to learn machine learning from scratch?
If you already write Python, around two months of steady part time study gets you building and evaluating models on tabular data. If you are starting without programming, add a few months for Python and pandas first.

---

*Start with chapter 1 of [AI & Machine Learning Essentials](/learn/ai-ml-essentials): learning from data, the split that makes a score trustworthy, and the baseline every model has to beat. It is free, and you can finish the first topic today.*
