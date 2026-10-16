---
title: "How to learn Git and GitHub, the right way round"
description: How to learn Git and GitHub by understanding commits, branches and remotes first, with a 4 week plan, common mistakes and a free course with a certificate.
author: Umair
date: 2026-10-16
tags: [programming, git, github]
targetQuery: how to learn git and github
image: /blog/covers/how-to-learn-git-and-github.webp
imageAlt: "Thin bare tree branches in focus against a pale grey overcast sky, with blurred trees behind"
course: git-github
---

The best way to learn Git and GitHub is to learn the model before the commands. A commit is a snapshot of your whole project, a branch is a label that points at one commit, and almost every "dangerous" command just creates new commits and moves a label. Once those three ideas are solid, learn Git on your own laptop for a week or two, then move to GitHub for remotes and pull requests, and practise undoing mistakes on purpose. Most people who say Git is confusing skipped the first step and memorised commands instead.

This guide gives you that order as a 4 week plan, the mistakes that cost beginners the most time, and what our free [Git & GitHub course](/learn/git-github) covers chapter by chapter.

## Git and GitHub are not the same thing

Git is a program that runs on your computer and keeps the history of a folder. GitHub is a website that hosts copies of Git repositories so people can share them, review each other's changes and run automation. You can use Git for years without GitHub. You cannot really use GitHub without Git.

| | Git | GitHub |
| --- | --- | --- |
| What it is | Version control software | A hosting service for Git repositories |
| Where it runs | Your laptop, offline | In the browser and on GitHub's servers |
| What you do with it | Commit, branch, merge, rebase, undo | Push, open pull requests, review, run Actions |
| Learn it | First | Second |

## Step 1: learn the mental model, not a cheat sheet

Cheat sheets hide the three facts that make everything else make sense.

**A commit is a snapshot, not a diff.** Each commit records the complete state of every tracked file, plus its parent commit, its author and a message. When Git shows you a diff, it is comparing two snapshots on the spot. Commits are never edited. Commands like `--amend`, `rebase` and `reset` make new commits and move a pointer, which is why nearly every mistake can be recovered.

**Your files move through three areas.** The working directory is what you see in your editor. The index, also called the staging area, is what the next commit will contain. The repository is the history. `git add` moves changes into the index, `git commit` turns the index into a snapshot. Most beginner confusion about "why is this file not in my commit" is confusion about the index.

**A branch is a pointer.** In a standard repository a branch is just a name stored with one commit hash, often a tiny file under `.git/refs/heads`. HEAD tells Git which branch you are on.

For the first few days, run `git status` and `git log --oneline --graph` after every command and predict the output first.

## Step 2: commit like someone else will read it

A good commit does one thing, and the project still works with it applied. Stage deliberately, using `git add -p` to pick the exact hunks that belong together, instead of `git add .` at the end of a long day.

Write messages that say why, not just what. "Fix rounding on invoice totals" is useful. "updates" is not. Set up a `.gitignore` from the very first commit, and keep secrets out: commit a `.env.example` with dummy values and ignore the real `.env`. Deleting a file in a later commit does not remove it from history, so a password that was committed once stays in history, and in every clone already made. Treat it as leaked and change it.

## Step 3: branch, merge and rebase without fear

Learn the two kinds of merge. A fast forward just moves the branch label ahead. A three way merge creates a new commit with two parents. Then learn rebase, which replays your commits on top of another branch to give a straight line of history.

The rule most teams follow: rebase your own unpublished work freely, but do not rewrite a branch other people have already pulled.

Conflicts deserve their own practice. Create one on purpose: two branches that edit the same line, then merge them. Read the conflict markers, decide what the final line should say, stage the file and finish the merge.

## Step 4: move to GitHub and work like a team

Now the remote side makes sense. `git fetch` downloads new commits without touching your work. `git pull` is a fetch followed by a merge or rebase. `git push` sends your branch up. `origin` is just the default name `git clone` gives the remote, not a special keyword.

On GitHub, practise the full loop: create a branch, push it, open a pull request, ask a friend to review it, respond to comments with new commits, and merge. Then contribute to a project without write access: fork it, add the original as `upstream`, work on a branch, and keep your fork's `main` free of your own commits.

## Step 5: practise undoing every kind of mistake

This step turns Git from frightening into boring. Learn what each undo command does:

- `git restore` throws away uncommitted changes to a file, or unstages it.
- `git revert` makes a new commit that cancels an old one. It is safe on shared branches.
- `git reset` moves your branch label back. Safe on your own work, risky on shared branches.
- `git stash` parks unfinished work so you can switch branches.
- `git reflog` lists everywhere HEAD has been recently, which is how you find commits you thought you deleted.

Make a throwaway repository, break it every way you can, and recover each time.

## A 4 week plan to learn Git and GitHub

Thirty to forty five minutes a day, with a terminal open, is enough.

| Week | Focus | Practise until you can |
| --- | --- | --- |
| 1 | Mental model, staging, good commits | Predict `git status` and `git log` output before running them |
| 2 | Branches, merges, rebase, conflicts | Resolve a merge conflict without searching for help |
| 3 | Remotes, pull requests, forks, tags | Open, review and merge a pull request with a friend |
| 4 | Undoing, stash, reflog, history search | Recover a "lost" commit with the reflog |

After week 4, use Git on everything you build, even solo projects. If you are learning web development at the same time, our [full stack web course](/learn/full-stack-web) gives you real projects to version properly.

## Mistakes that slow beginners down

- **Memorising commands without the model.** You will forget the flags. You will not forget that a branch is a pointer.
- **One giant commit per day.** It cannot be reviewed, reverted cleanly or searched later.
- **Committing secrets or build output.** Ignore `node_modules/`, `dist/` and `.env` from day one. Do commit lock files like `package-lock.json`.
- **Force pushing a shared branch.** It strands everyone who pulled the old version. Use `--force-with-lease` if you must, and tell your team first.
- **Panicking after a bad reset.** Stop, run `git reflog`, and find the commit you were on. It is almost always still there.

## What the free Git & GitHub course covers

The [Git & GitHub course](/learn/git-github) is a beginner level course planned for about 4 weeks. It has 12 chapters of 4 lessons each, and every lesson is a 12 to 14 minute read with real terminal output and a short quiz.

1. **The Mental Model:** commits as snapshots, the three areas, branches as pointers, config and line endings.
2. **Committing Well:** building commits on purpose, useful messages, `.gitignore`, signing commits.
3. **Branching, Merging, and Rebasing:** fast forward and three way merges, rebase, conflicts, choosing a branching model.
4. **Remotes and Collaboration:** fetch, pull and push, pull request etiquette, tags and releases, forks and upstream.
5. **Undoing Things and Recovering:** restore, revert and reset, stashing, the reflog, undoing a merge.
6. **Investigating History:** commit ranges, `log -S`, `log -L` and `blame`, `git bisect`, reading diffs carefully.
7. **Hooks, CI, and Repositories at Scale:** hooks, branch protection, keeping big repositories fast, submodules.
8. **Automating GitHub with Actions:** triggers and jobs, matrices and caching, reusable workflows, release automation.
9. **Rewriting History Deliberately:** interactive rebase, fixup and autosquash, `filter-repo`, rewriting shared branches safely.
10. **Access, Secrets, and Supply Chain:** SSH keys and tokens, least privilege in CI with OIDC, secret scanning, pinned actions.
11. **Restructuring and Migration:** splitting repositories, monorepos, subtree, moving between hosts.
12. **Plumbing, Forensics, and Rescue:** `cat-file` and `update-ref`, packfiles and `gc`, rebuilding a force pushed branch, bundles and repair.

The first five chapters are the core every developer needs. Chapters 7, 8 and 10 lead naturally into DevOps work; if that is where you are heading, our [DevOps roadmap](/blog/devops-roadmap) and the [Cloud & DevOps course](/learn/cloud-devops) are the next step.

## Who it is for and how the certificate works

It suits students who keep hearing "push it to GitHub", self taught developers scared of rebase and reset, and anyone about to join a team or freelance where clients will look at their repositories.

Each lesson unlocks its quiz after 90 seconds of reading, and you need 70 percent to pass it. The course ends with a final exam of 50 questions in 60 minutes, and you pass with 50 out of 100 marks. You get one timed attempt; if it goes badly, a single retake opens 30 days later. Pass, and you get a certificate with a verification code anyone can check.

Be honest with yourself about what it proves. It shows you passed our exam. For an employer, a public GitHub profile with clean commit history, real pull requests and a sensible README says far more. Our post on [whether free online certificates are worth anything](/blog/are-free-online-certificates-worth-anything) covers this in detail.

## Frequently Asked Questions (FAQ)

### How long does it take to learn Git and GitHub?

The everyday basics, committing, branching, pushing and opening pull requests, take a week or two of daily practice. Being comfortable with conflicts, rebase and recovering from mistakes usually takes about a month. Our course is planned for 4 weeks.

### Should I learn Git or GitHub first?

Git first. GitHub is built on top of Git, so its pull requests, forks and branch settings only make sense once you understand commits, branches and remotes on your own machine.

### Can I learn Git and GitHub for free?

Yes. Git is free and open source, GitHub offers free accounts with public and private repositories, and our Git & GitHub course, including the certificate, costs nothing.

### Do I need to know programming before learning Git?

A little helps, but many people learn Git alongside their first language. Any folder, even plain text notes, is enough to practise with.

### Is the command line necessary, or can I use GitHub Desktop?

Graphical tools are fine for daily use, but learn the command line first. Tutorials, error messages, CI logs and teammates all speak in commands, and recovery tools like the reflog are easiest to use from a terminal.

Start with chapter one of the free [Git & GitHub course](/learn/git-github) today, keep a practice repository open beside it, and break things on purpose. That is how Git stops being scary.
