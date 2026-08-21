import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'git-github',
  title: 'Git & GitHub',
  category: 'Tools',
  level: 'Beginner',
  duration: '4 weeks',
  accent: 'indigo',
  coverKey: 'git-github',
  summary:
    'Stop memorising Git commands and learn the model underneath — commits as snapshots, branches as pointers, and a calm way out of every mistake.',
  description:
    'You build history on purpose: staging changes hunk by hunk, writing commits that explain themselves, branching, merging, rebasing, and resolving conflicts without guesswork. Then you work the way teams actually do — remotes, pull requests, tagged releases — and practise undoing every class of mistake with restore, revert, reset, stash, and the reflog.',
  chapters: [
    chapter(
      'The Mental Model',
      'Commits as snapshots, the three areas your files move through, and why a branch is just a file with a hash in it.',
      [
        lesson('A Commit Is a Snapshot, Not a Diff', 13, `
Git is not a stack of patches. Every commit records the **complete state of every tracked file** at that moment. Once you actually believe that, most of Git's frightening commands stop being frightening.

### What is inside a commit

Ask Git to print a commit object exactly as it is stored on disk:

\`\`\`bash
$ git cat-file -p HEAD
tree 9f2b0c1e4a...
parent 4c1d77aa93...
author Ayesha Khan <ayesha@example.com> 1718880000 +0500
committer Ayesha Khan <ayesha@example.com> 1718880000 +0500

Fix rounding on invoice totals
\`\`\`

Four things, and nothing else:

- **tree** — a snapshot of the entire directory at that moment
- **parent** — the commit (or commits) this one came after
- **author / committer** — who, and when
- **message** — why

There is no diff in there. When \`git show\` prints a patch, Git computed it on the spot by comparing this commit's tree against its parent's tree. **A diff is a view, not the storage format.**

### "Doesn't storing everything get enormous?"

No. Trees point at **blobs** addressed by the hash of their contents. If a file is byte-identical between two commits, both trees point at the same blob. A thousand commits touching one file in a ten-thousand-file project store one copy of the 9,999 untouched files, not a thousand copies.

### The hash is the identity

That \`9f2b0c1e\` is the SHA of the object's own contents. Change the message, the author, the parent, or a single byte of a single file, and you get a different hash — which means a **different commit**. This is the most important consequence in the whole course:

> Commits are immutable. Nothing edits a commit. \`--amend\`, \`rebase\`, and \`reset\` all *create new commits and move a pointer*. The originals sit there untouched until garbage collection eventually sweeps them.

That single fact is why every recovery trick in Chapter 5 works.

### History is a graph

Each commit names its parent, so commits form a graph pointing backwards in time:

\`\`\`bash
$ git log --oneline --graph --all --decorate
* e5c1a90 (HEAD -> main) Merge branch 'checkout-fix'
|\\
| * 77bd2f1 (checkout-fix) Guard against an empty cart
| * 1a09e33 Extract the price formatter
* | 4c1d77a Bump dependencies
|/
* 9a0f2bb Initial import
\`\`\`

An ordinary commit has one parent. A merge commit has two. The very first commit has none. "Branching" is nothing more exotic than two commits naming the same parent.

Make that command a reflex. Learning Git without looking at the graph is like learning to drive with the windscreen painted over.

### The common mistake

Beginners picture history as a stack of patches, so they assume \`git reset --hard HEAD~1\` "subtracts a change" and that rebase "re-applies edits to files". Both models feel fine until something goes wrong, and then they produce panic at exactly the worst moment — usually a frantic re-clone of the repository and a day of lost work.

The accurate picture: **each commit is a full snapshot with a fixed identity, branches are labels stuck on snapshots, and every command that "rewrites history" builds new snapshots and re-points a label.** The old snapshots are still on disk. You just need to point a label back at them.

### Try it now

\`\`\`bash
git log --oneline --graph --all --decorate   # the shape of your history
git cat-file -p HEAD^{tree}                  # the top level of one snapshot
git show --stat HEAD                         # the diff Git computed for you
git rev-parse HEAD                           # the full 40-character identity
\`\`\`

Run these in a repository you already have. Nothing here changes anything — all four are read-only, which makes them the safest possible place to build intuition.
        `),
        lesson('Working Directory, Index, Repository', 13, `
Git has three places your work can live, and nearly every everyday command is just moving content between them.

| Area | What it is | Lives in |
|---|---|---|
| **Working directory** | The real files on disk that your editor opens | Your project folder |
| **Index** (staging area) | The proposed *next* commit, held as a complete tree | \`.git/index\` |
| **Repository** | Immutable committed history | \`.git/objects\` |

The index is the part people skip, and it is the part that makes Git better than "save a zip of the folder". It lets you decide what goes into a commit **separately** from what you happen to have edited.

### Reading git status properly

\`\`\`bash
$ git status -s
 M src/cart.js      # modified on disk, NOT staged
M  src/price.js     # staged, and the file on disk matches what is staged
MM src/tax.js       # staged, then edited again afterwards
A  src/coupon.js    # newly tracked, staged
?? notes.md         # untracked — Git has never seen this file
\`\`\`

There are two columns. The **left** column compares index against the last commit. The **right** column compares the working directory against the index. \`MM\` is the one that catches people: you staged a version, then kept typing. Commit now and you commit the *older* version, then spend twenty minutes wondering why the bug is still there.

### The three diffs

| Command | Compares | Answers |
|---|---|---|
| \`git diff\` | working directory ↔ index | "What have I changed but not staged?" |
| \`git diff --staged\` | index ↔ HEAD | "What exactly will my next commit contain?" |
| \`git diff HEAD\` | working directory ↔ HEAD | "What have I changed at all since the last commit?" |

This produces the single most common beginner scare: *"I edited a file, ran \`git add\`, and now \`git diff\` prints nothing — did I lose my work?"* You did not. \`git diff\` with no arguments asks "what is unstaged?", and after staging, the answer is legitimately nothing. Run \`git diff --staged\`.

### Moving content backwards

\`\`\`bash
git restore --staged src/tax.js          # unstage: index <- HEAD, file on disk untouched
git restore src/tax.js                   # discard edits: file on disk <- index  (DESTRUCTIVE)
git restore --source=HEAD~2 src/tax.js   # bring an old version into the working directory
\`\`\`

Note the asymmetry. \`git restore --staged\` is completely safe — it only rearranges the index, and your edits stay on disk. \`git restore <file>\` with no flag **overwrites your file with no backup and no undo**, because those edits were never recorded anywhere. That is the whole danger of Chapter 5 in miniature: Git can recover anything it has seen, and nothing it has not.

(You may see the older spelling \`git checkout -- file\` in tutorials. \`restore\` and \`switch\` exist precisely because \`checkout\` did two unrelated jobs and people confused them.)

### The -a shortcut and its trap

\`\`\`bash
git commit -am "Fix cart total"   # stage all TRACKED files, then commit
\`\`\`

\`-a\` stages modifications and deletions of files Git already tracks. It does **not** pick up untracked files. This is why the brand-new component you just created was mysteriously missing from the commit — it was \`??\` in \`git status\`, and \`-a\` skipped straight past it. Read \`git status\` before every commit and this never happens.

### A ten-minute drill

\`\`\`bash
echo "one" > a.txt && git add a.txt   # index has "one"
echo "two" >> a.txt                   # disk has "one\\ntwo"
git diff                              # shows the "two" line
git diff --staged                     # shows only the "one" line
git commit -m "Add a.txt"             # commits "one" only
git status                            # a.txt still modified — exactly as it should be
\`\`\`

Do that once by hand and the three areas will stop being abstract.
        `),
        lesson('Branches Are Pointers, HEAD Is Where You Are', 12, `
A branch in Git is not a copy of your project, a directory, or a sequence of changes. It is a **file containing one commit hash**. Prove it:

\`\`\`bash
$ cat .git/refs/heads/main
e5c1a90b7f4c2d1e8a3b6c9d0f2a4e7b1c8d5a30

$ cat .git/HEAD
ref: refs/heads/main
\`\`\`

Forty-one bytes. That is the entire branch.

### What commits actually do to it

When you commit, Git writes a new commit object whose parent is the current one, then **rewrites the branch file** to hold the new hash. The branch does not "contain" commits; it points at the newest one, and every earlier commit is reachable by walking parent links backwards.

Two consequences that surprise people:

- Creating a branch is instant and free, whatever the size of the repository. \`git switch -c feature\` writes 41 bytes. Branch generously.
- \`git branch -d feature\` deletes 41 bytes. **The commits are untouched.** If they are still reachable from another branch, nothing at all has happened to them; if not, they linger unreferenced until garbage collection, and Chapter 5 shows you how to get them back.

### HEAD is the "you are here" marker

\`.git/HEAD\` normally contains \`ref: refs/heads/main\` — a pointer to a pointer. That indirection is what makes committing move the branch automatically.

\`\`\`bash
git switch feature       # point HEAD at refs/heads/feature, update the working tree
git switch -c fix-tax    # create a branch at the current commit, then switch to it
git switch -             # back to where you just were
git branch -vv           # every branch, its tip, and its upstream
\`\`\`

### Detached HEAD, demystified

\`\`\`bash
$ git switch --detach 1a09e33
You are in 'detached HEAD' state...
\`\`\`

HEAD now points **straight at a commit** instead of at a branch. Everything still works — you can edit, commit, run tests. The only difference is that new commits update nothing but HEAD itself, so when you switch away, no label points at them.

That is the whole story. It is not corruption, and you have not lost anything. If you made commits there and want to keep them:

\`\`\`bash
git switch -c rescued-work   # give the current commit a name, right there
\`\`\`

If you already switched away, \`git reflog\` finds them (Chapter 5, Lesson 3).

### Where the working tree fits

Switching branches rewrites the files on disk to match the target commit. Uncommitted changes come *with* you if they do not conflict, and Git refuses the switch if they do:

\`\`\`bash
$ git switch main
error: Your local changes to 'src/cart.js' would be overwritten by checkout.
\`\`\`

That error is Git protecting work it cannot recover. Commit it, or stash it (Chapter 5, Lesson 2). Never reach for \`--force\`, which resolves the problem by deleting your edits.

### The classic mistake

*"I switched branches and my work vanished."* Almost always one of two things: uncommitted edits travelled with you and are sitting right there in \`git status\` on the other branch, or commits were made on a detached HEAD and now have no label. Neither is data loss. Data loss in Git essentially requires \`git reset --hard\`, \`git restore <file>\`, or \`git clean\` — commands that overwrite things Git never recorded.

### Naming that scales

Use short, greppable branch names with a consistent shape: \`fix/cart-rounding\`, \`feat/coupon-codes\`, \`chore/bump-deps\`. Delete branches once merged. A repository with 90 stale branches is one where nobody can tell which work is live — and since a branch is 41 bytes, keeping them costs nothing but confusion.
        `),
      ],
      [
        q('What does a commit object actually store?', [
          'A diff against its parent commit',
          'A list of changed line numbers per file',
          'A full snapshot of the tracked tree, plus parent, author, and message',
          'Only the files you staged since the last commit',
        ], 2, 'Commits store complete trees; the diff you see in git show is computed on demand by comparing two trees.'),
        q('You edit a file, run git add, then run git diff and see nothing. What happened?', [
          'git diff compares the working directory with the index, and they now match',
          'git add discarded the edit',
          'Diffs only work after committing',
          'The file must be listed in .gitignore',
        ], 0, 'Plain git diff answers "what is unstaged?" — after staging, the correct answer is nothing. Use git diff --staged.'),
        q('Physically, what is a branch in Git?', [
          'A copy of the project directory',
          'A stored sequence of diffs',
          'A compressed archive of commits',
          'A small file containing one commit hash',
        ], 3, 'A branch is a ref — 41 bytes naming a commit — which is why creating and deleting branches is instant.'),
        q('You run git branch -d feature after merging it. What happens to its commits?', [
          'They are deleted from disk immediately',
          'They stay in the repository; only the label pointing at them is removed',
          'They are moved into .git/lost-found',
          'They are squashed into the merge commit',
        ], 1, 'Deleting a branch removes a pointer, not history — the commits remain reachable through whatever merged them.'),
      ]
    ),
    chapter(
      'Committing Well',
      'Building each commit on purpose, writing messages your future self can use, and keeping the wrong files out of history forever.',
      [
        lesson('Building a Commit on Purpose', 13, `
The index exists so a commit can be **a decision, not an accident**. \`git add .\` throws away that decision every time you use it.

### Stage by hunk, not by file

You set out to fix a rounding bug, and along the way you renamed a variable, deleted a stale comment, and added a \`console.log\`. Those are three different things. \`git add -p\` lets you split them:

\`\`\`bash
$ git add -p src/invoice.js
@@ -18,7 +18,7 @@ export function total(items) {
-  return items.reduce((sum, i) => sum + i.price, 0);
+  return Math.round(items.reduce((sum, i) => sum + i.price, 0) * 100) / 100;

(1/3) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?
\`\`\`

The keys worth knowing:

| Key | Does |
|---|---|
| \`y\` / \`n\` | stage this hunk / skip it |
| \`s\` | split the hunk into smaller ones |
| \`e\` | edit the hunk by hand — stage individual lines |
| \`q\` | quit, keeping what you have already answered |
| \`?\` | the full list |

Then commit the fix alone, and stage the rest separately. The \`console.log\` never gets committed at all, because you saw it.

### What "atomic" buys you

A commit is atomic when it does exactly one thing and the project still builds and passes tests with it applied. That is not tidiness for its own sake — it is what makes three of Git's best tools work:

\`\`\`bash
git revert 4c1d77a          # undo one thing without unpicking four
git bisect start            # binary-search history for the commit that broke it
git log -S "roundToCents"   # find the commit that introduced this string
\`\`\`

\`git bisect\` is the payoff. It finds the guilty commit in a 4,000-commit history in about twelve steps — but only if each commit builds. One "big refactor + feature + formatting" commit turns bisect into a shrug.

### Fixing the commit you just made

\`\`\`bash
git commit --amend                    # edit message and/or add staged changes
git commit --amend --no-edit          # fold staged changes in, keep the message
\`\`\`

Remember Chapter 1: this does not edit anything. It builds a **new** commit with the same parent and moves the branch to it. The original is still on disk, orphaned.

The rule that keeps you safe: **amend freely before you push, never after** — unless the branch is yours alone and you are ready to force-push with \`--force-with-lease\` (Chapter 4). Amending a commit that others have already pulled hands them a duplicated history to untangle.

### The pre-commit habit that costs ten seconds

\`\`\`bash
git status              # anything untracked I meant to add?
git diff --staged       # is this exactly what I want to record?
git commit
\`\`\`

Reading your own staged diff catches debug statements, commented-out code, a stray API key, and half-finished renames before they become permanent. It is the highest-value ten seconds in the whole workflow.

### The common mistake

\`git add .\` from the project root at the end of a long session, then one commit called "updates". You have now bundled a bug fix, a dependency bump, an editor config file, and a 900-line \`dist/\` build output into a single unreviewable, unrevertable, unbisectable blob. When that commit later turns out to break production, your only options are reverting all of it or reading the whole thing line by line.

Stage deliberately. If you genuinely did one thing, \`git add -A\` is fine — but know that you decided.
        `),
        lesson('Commit Messages That Earn Their Keep', 12, `
A commit message is documentation aimed at a specific reader: whoever runs \`git log\` at 2am wondering why this line exists. Often that is you, in eight months, with no memory of the sprint.

### The shape

\`\`\`text
Fix rounding on invoice totals

Prices were summed as floats, so a 19.99 + 0.02 cart rendered as
20.009999999999998 on the receipt PDF. Sum in integer cents and
divide once at the end.

The PDF renderer is unchanged; this only affects the total() helper.

Refs #412
\`\`\`

The rules, in order of how much they matter:

1. **Subject line, imperative mood, roughly 50 characters, no full stop.** Write it so it completes the sentence *"Applying this commit will…"*. Git's own generated messages ("Merge branch…", "Revert…") are imperative, so yours match.
2. **Blank line after the subject.** Every Git tool splits on it. Without it, \`git log --oneline\` prints your whole essay as the subject.
3. **Body explains *why*, wrapped at ~72 columns.** The diff already shows *what* changed. What it can never show is what you tried, what you rejected, and what constraint forced the ugly bit.
4. **Trailers for machine-readable metadata** — \`Refs #412\`, \`Fixes #88\`. GitHub closes an issue automatically when a commit saying \`Fixes #88\` lands on the default branch.

### Before and after

| Bad | Why it fails | Better |
|---|---|---|
| \`fix\` | Fix what? Every project has 200 of these | \`Fix crash when cart is empty\` |
| \`Updated the header and also fixed the login bug and bumped deps\` | Three commits wearing a trench coat | Split into three commits |
| \`Fixed rounding\` | Past tense, drifts from Git's own voice | \`Fix rounding on invoice totals\` |
| \`asdf\` | Costs a future engineer an hour | Anything true |

### Conventional Commits, if your team wants automation

\`\`\`text
feat(cart): apply coupon codes at checkout
fix(invoice): sum prices in integer cents
chore(deps): bump express to 4.19.2
docs(readme): document the seed script
feat(api)!: drop the v1 endpoints      <- "!" marks a breaking change
\`\`\`

The prefix is a machine-readable claim about the *kind* of change. Tools then generate a changelog and pick the next version number for you: \`fix\` bumps the patch digit, \`feat\` the minor, \`!\` the major (Chapter 4, Lesson 3). Adopt it only if something actually consumes it — otherwise it is ceremony.

### Why this pays off later

\`\`\`bash
git log --oneline -20                     # is this history readable at a glance?
git log --since="2 weeks ago" --author=me # what did I actually ship?
git log -S "legacyTaxRate" --oneline      # when did this appear, and why?
git blame src/invoice.js                  # who wrote this line, in which commit
\`\`\`

\`git blame\` is the killer case. You find a bizarre-looking line, blame gives you the commit, and the message either explains the constraint that forced it — or says "fix". One of those outcomes saves you an afternoon; the other costs you one.

### The common mistake

Writing the message *after* the fact, as an afterthought, describing the diff: "changed line 42 in invoice.js". The diff is right there; you are duplicating it. Write the sentence you would say to a colleague who asked "why did you do that?" — that sentence is the commit body, and it is the only part of the commit a diff cannot reconstruct.
        `),
        lesson('.gitignore, and What Must Never Enter History', 12, `
Some files simply should not be in a repository: build output, dependencies, machine-specific config, and above all **secrets**. \`.gitignore\` keeps them out — as long as you understand precisely what it does and does not do.

### The syntax

\`\`\`gitignore
# dependencies and build output
node_modules/
dist/
*.log

# environment and secrets
.env
.env.*
!.env.example        # negate: this one IS tracked

# OS and editor noise
.DS_Store

# anchoring
/config.local.js     # leading slash: only at the repository root
build/               # trailing slash: directories only, never a file named build
**/temp/             # any depth
\`\`\`

Four rules cover almost everything:

- A pattern with **no slash** matches at any depth. \`*.log\` catches \`server/logs/app.log\`.
- A **leading slash** anchors the pattern to the repository root.
- A **trailing slash** means directories only.
- \`!\` **negates** — but it cannot resurrect a file whose *parent directory* is excluded. \`node_modules/\` plus \`!node_modules/keep.js\` does not work, because Git never descends into an excluded directory.

Not sure which line is catching a file? Ask:

\`\`\`bash
$ git check-ignore -v config.local.js
.gitignore:15:/config.local.js    config.local.js
\`\`\`

### The mistake everyone makes exactly once

**.gitignore only affects untracked files.** Once a file is tracked, Git keeps tracking it and ignores your ignore rule completely. Adding \`.env\` to \`.gitignore\` after committing it changes nothing at all.

\`\`\`bash
git rm --cached .env       # stop tracking it; the file stays on disk
echo ".env" >> .gitignore
git commit -m "Stop tracking .env"
\`\`\`

Use \`--cached\`. Plain \`git rm .env\` deletes your actual environment file, which is a memorable way to lose an afternoon.

### Three levels of ignoring

| Where | Scope | Use for |
|---|---|---|
| \`.gitignore\` (committed) | everyone on the project | \`node_modules/\`, \`dist/\`, \`.env\` |
| \`~/.gitignore_global\` | every repo on your machine | \`.DS_Store\`, \`.idea/\`, \`*.swp\` |
| \`.git/info/exclude\` | this clone only, never shared | your personal \`scratch.md\` |

\`\`\`bash
git config --global core.excludesFile ~/.gitignore_global
\`\`\`

Editor and OS junk belongs in your global file, not in the project's. Your teammates should not have to carry an ignore rule for an editor they do not use.

### When a secret does get committed

Treat it as **leaked, immediately**. This is not paranoia:

1. **Rotate the credential first.** Revoke the key, issue a new one. Do this before anything else, because everything else takes time and the old key is live the whole while.
2. Understand that deleting the file in a new commit does *not* remove it. The old commit still contains it, in every clone, every fork, and often in CI caches and GitHub's own dangling-commit view.
3. Purge history with \`git filter-repo\` (or the BFG), then force-push and have every collaborator re-clone. Every commit hash after the touched one changes, which is why step 1 matters more than step 3.

Prevention costs nothing: commit \`.env.example\` with the *names* and dummy values, keep real values in \`.env\`, and ignore it from the very first commit.

### A sane starting file

For a Node project, ignore \`node_modules/\`, \`dist/\`, \`build/\`, \`coverage/\`, \`*.log\`, and \`.env*\`. Do **not** ignore \`package-lock.json\` — it is the record of exactly which dependency versions were installed, and it belongs in history so every machine and every CI run builds the identical tree.
        `),
      ],
      [
        q('Why prefer git add -p over git add . when you have made two unrelated changes?', [
          'It runs faster on large repositories',
          'It lets you stage one logical change at a time, so each commit does exactly one thing',
          'It writes the commit message for you',
          'It prevents merge conflicts later on',
        ], 1, 'Hunk-level staging is what makes commits atomic, which is what makes revert, bisect, and review usable.'),
        q('A file is already tracked. You add it to .gitignore. What happens?', [
          'It is removed from the next commit automatically',
          'Git deletes it from your working directory',
          'Its future changes are ignored from then on',
          'Nothing — .gitignore only applies to untracked files, so you must git rm --cached it first',
        ], 3, 'Ignore rules are consulted only for files Git is not already tracking; tracked files keep being tracked.'),
        q('Which commit subject matches the convention Git itself uses?', [
          'Fix rounding on invoice totals',
          'Fixed rounding on invoice totals',
          'fixing the rounding bug and also tidying up the header',
          'updates',
        ], 0, 'Imperative mood, one concern, under 50 characters — it completes the sentence "Applying this commit will…".'),
        q('You committed and pushed a .env holding a live API key. What must you do first?', [
          'Add .env to .gitignore and commit',
          'Run git rm --cached .env and push',
          'Rotate the key — the old commit exists in every clone and fork regardless of what you do next',
          'Amend the commit to drop the file',
        ], 2, 'Purging history takes time and cooperation; revoking the credential is the only step that stops the leak immediately.'),
      ]
    ),
    chapter(
      'Branching, Merging, and Rebasing',
      'Fast-forward versus three-way merges, what rebase really does to your commits, and resolving conflicts without panic.',
      [
        lesson('Merging: Fast-Forward and Three-Way', 13, `
Merging joins two lines of history. Git picks one of two strategies automatically, and knowing which one you are about to get removes most merge surprises.

### Case 1: fast-forward

You branched off \`main\`, did some work, and nobody touched \`main\` meanwhile:

\`\`\`text
A---B---C---D    feature
        ^
        main
\`\`\`

\`main\` is an **ancestor** of \`feature\`, so the two histories never actually diverged and there is nothing to reconcile. Git just slides the \`main\` label forward to \`D\`. No new commit, no merge commit, and no conflict is even possible.

\`\`\`bash
$ git switch main
$ git merge feature
Updating b7f4c2d..d1e8a3b
Fast-forward
 src/coupon.js | 42 +++++++++++++++++
\`\`\`

If you would rather keep a visible record that a branch existed, force a merge commit:

\`\`\`bash
git merge --no-ff feature
\`\`\`

Teams disagree about this and both answers are defensible: \`--no-ff\` gives you a history where every feature is a visible bubble you can revert in one move; plain fast-forward gives you a clean straight line. Pick one and configure it, rather than getting whichever the situation happened to produce.

### Case 2: three-way merge

Now the realistic case — both branches moved:

\`\`\`text
      C---D              feature
     /
A---B---E---F            main
\`\`\`

Git finds the **merge base**: the most recent commit both branches share, here \`B\`. Then it compares three snapshots — base \`B\`, tip \`F\`, tip \`D\` — and for each file asks "which side changed this relative to the base?"

- Changed on one side only → take that side.
- Changed identically on both → take it once.
- Changed differently on both → **conflict**, hand it to the human.

The result is a new commit with **two parents**:

\`\`\`text
      C-------D
     /         \\
A---B---E---F---M        main
\`\`\`

\`M\` is the only new object. Crucially, **merging never alters an existing commit.** \`C\`, \`D\`, \`E\`, and \`F\` keep their hashes forever. That is what makes merge the safe default on shared branches.

### Useful variations

\`\`\`bash
git merge --abort            # conflicts appeared; put everything back, no harm done
git merge --squash feature   # take the changes, stage them — you then commit ONCE yourself
git merge --no-commit feature  # do the merge but let me inspect before committing
\`\`\`

\`--squash\` is how many teams land a messy ten-commit branch as one clean commit. Note it records no merge relationship, so Git will not know the branch was merged — delete the branch yourself afterwards.

### Reading what happened

\`\`\`bash
git log --oneline --graph --all       # see the bubble
git log --merges --oneline            # merge commits only
git show M --stat                     # what a merge commit actually changed
\`\`\`

### The common mistake

Running \`git merge main\` from \`main\`, or merging in the wrong direction and wondering why nothing happened. The direction is always: **switch to the branch that should receive the changes, then merge the branch that has them.** To bring \`main\` into your feature branch, you \`git switch feature && git merge main\` — not the reverse. Getting this backwards on a shared \`main\` is how half-finished features reach production.
        `),
        lesson('Rebase, and When Each Is Right', 14, `
Rebase answers a different question from merge. Merge asks *"how do I combine these two histories?"* Rebase asks *"what would my work look like if I had started from the newer base instead?"*

### What it actually does

\`\`\`text
before:
      C---D                  feature
     /
A---B---E---F                main

after: git switch feature && git rebase main
              C'---D'        feature
             /
A---B---E---F                main
\`\`\`

Read those primes carefully. \`C'\` and \`D'\` are **new commits with new hashes**. Git took the *changes* introduced by \`C\` and \`D\`, replayed them one at a time on top of \`F\`, and moved the branch label to the last one. The originals \`C\` and \`D\` still exist on disk with nothing pointing at them — which is exactly why \`git reflog\` can rescue a rebase gone wrong (Chapter 5).

The result is a straight line: your feature looks like it was written against the latest \`main\`, and reviewers see your changes without a merge commit interleaved.

### The golden rule

> **Never rebase commits that other people have already pulled.**

If a teammate has \`C\` and you replace it with \`C'\`, their Git now sees two commits with identical content and different identities. Their next pull produces a duplicated history, and the confusion generally ends with somebody re-cloning. The safe boundary is simple: **rebase your own unpushed or unshared branches freely; merge into shared ones.**

### Interactive rebase: cleaning up before review

\`\`\`bash
$ git rebase -i main
pick 1a09e33 Extract the price formatter
squash 77bd2f1 fix typo
squash 4c1d77a wip
reword e5c1a90 Guard against an empty cart
drop  9a0f2bb Add console.log
\`\`\`

| Command | Effect |
|---|---|
| \`pick\` | keep as-is |
| \`reword\` | keep the change, edit the message |
| \`squash\` | fold into the previous commit, combine messages |
| \`fixup\` | fold into the previous commit, discard this message |
| \`drop\` | remove the commit entirely |
| \`edit\` | stop here so you can amend or split it |

Five honest commits turn into two reviewable ones. Combined with \`git commit --fixup <sha>\` and \`git rebase -i --autosquash\`, this becomes routine rather than fiddly.

### Rebasing your pulls

\`\`\`bash
git pull --rebase                        # replay my local commits on top of theirs
git config --global pull.rebase true     # make that the default
\`\`\`

Without it, every routine \`git pull\` on a busy branch creates a "Merge branch 'main' of github.com…" commit that documents nothing. Those commits are the main source of the tangled-spaghetti graphs people blame on Git itself.

### Choosing between them

| Situation | Use |
|---|---|
| Updating your local branch with new \`main\` | \`rebase\` |
| Tidying messy WIP commits before a pull request | \`rebase -i\` |
| Syncing before a push on a shared branch | \`pull --rebase\` |
| Landing a finished feature onto \`main\` | \`merge\` (often \`--no-ff\` or squash) |
| Anything already pushed and pulled by others | \`merge\`, always |
| You want an exact record of when work was integrated | \`merge\` |

### The common mistake

Rebasing \`main\` itself onto a feature branch, then force-pushing. Every hash on the shared branch changes at once, every teammate's clone diverges, and open pull requests based on the old \`main\` show hundreds of unrelated commits. If you find yourself typing \`--force\` while standing on \`main\`, stop: you almost certainly wanted \`git revert\` (Chapter 5) instead.

And whenever a rebase turns into a conflict swamp, remember the escape hatch is free:

\`\`\`bash
git rebase --abort    # back to exactly where you started, every time
\`\`\`
        `),
        lesson('Resolving Conflicts Calmly', 13, `
A conflict is not an error and not a failure. It is Git saying: *"two people changed the same region of the same file, and I will not guess which is right."* That is exactly what you want it to do.

### What you see

\`\`\`js
export function total(items) {
<<<<<<< HEAD
  // our version — the branch you are merging INTO
  return roundCents(items.reduce((s, i) => s + i.price, 0));
=======
  // their version — the branch being merged IN
  return items.reduce((s, i) => s + i.priceCents, 0) / 100;
>>>>>>> feature/price-cents
}
\`\`\`

Everything between \`<<<<<<<\` and \`=======\` is one side, everything from \`=======\` to \`>>>>>>>\` is the other, and the label after \`>>>>>>>\` names where the second side came from.

Turn on the better conflict style once and never look back:

\`\`\`bash
git config --global merge.conflictstyle zdiff3
\`\`\`

That adds a third section showing the **common ancestor**, so you can see what each side actually changed rather than guessing from two finished results. It converts many "which of these do I want?" moments into an obvious answer.

### The loop

\`\`\`bash
git status                       # "both modified:" lists exactly what needs you
# ... edit each file: keep one side, the other, or write the correct combination ...
git add src/invoice.js           # staging a file marks it resolved
git status                       # repeat until nothing is unmerged
git merge --continue             # or: git rebase --continue
\`\`\`

Staging **is** the resolution — there is no separate "resolve" command. And \`git diff --diff-filter=U\` shows only the still-unmerged files if \`status\` is noisy.

### ours and theirs, and the trap

\`\`\`bash
git checkout --ours   src/invoice.js    # take my side wholesale
git checkout --theirs src/invoice.js    # take their side wholesale
\`\`\`

During a **merge**, \`--ours\` is your current branch, as you would expect.

During a **rebase**, the meanings flip. Git checks out the upstream branch first and replays your commits onto it, so \`--ours\` is the branch you are rebasing **onto** and \`--theirs\` is your own work. This reversal catches experienced people, not just beginners — when in doubt, resolve by editing the file rather than by picking a side blind.

### Reduce conflicts before they happen

- **Integrate often.** A branch that is three days old conflicts; one that is three weeks old conflicts catastrophically.
- **Keep pull requests small.** Conflict probability scales with the surface area you touched.
- **Do not mix a reformat with a logic change.** A prettier run across 200 files guarantees conflicts with every open branch, and buries the real change.
- **Turn on rerere** — \`git config --global rerere.enabled true\` — and Git remembers how you resolved a given conflict, replaying it automatically the next time the same one appears. Invaluable during a long rebase.

### The escape hatch, always available

\`\`\`bash
git merge --abort         # mid-merge
git rebase --abort        # mid-rebase
git cherry-pick --abort   # mid-cherry-pick
\`\`\`

Each returns you to the exact state before you started. Nothing is lost, nothing is half-done. Knowing this is what makes conflicts stop being stressful — the worst realistic outcome is that you spend ten minutes and then press undo.

### The common mistake

Committing the conflict markers. It happens when someone resolves five files, misses the sixth, and stages everything with \`git add -A\`. The code then fails to parse, usually in CI, usually ten minutes later.

Two cheap defences: read \`git diff --staged\` before committing (Chapter 2), and add a CI grep for \`<<<<<<<\` in tracked files so the build fails loudly instead of production failing quietly.
        `),
      ],
      [
        q('main has not moved since you branched. You run git merge feature from main. What does Git do?', [
          'Fast-forwards main to the tip of feature, creating no new commit',
          'Creates a merge commit with two parents',
          'Rebases feature onto main',
          'Refuses, since the branches have not diverged',
        ], 0, 'When the target is an ancestor of the source there is nothing to reconcile, so Git simply moves the label forward.'),
        q('What does git rebase main do to the commits on your feature branch?', [
          'Moves the same commit objects to a new position in the graph',
          'Merges main into your branch and leaves your commits untouched',
          'Creates new commits, with new hashes, containing the same changes',
          'Discards them and keeps only the final file contents',
        ], 2, 'Rebase replays each change onto a new base, producing new commit objects — the originals become unreferenced.'),
        q('Which situation makes rebase the wrong tool?', [
          'A local feature branch nobody else has fetched',
          'A shared branch teammates have already pulled',
          'A branch with three messy work-in-progress commits',
          'A branch that has fallen two commits behind main',
        ], 1, 'Rewriting commits others already hold gives them a duplicated, diverged history — merge into shared branches instead.'),
        q('During a rebase, git checkout --ours refers to which side?', [
          'Your feature branch commits, the same as during a merge',
          'Whichever side changed more lines',
          'The file as it was at the merge base',
          'The upstream branch you are replaying onto, because Git checks that out first',
        ], 3, 'Rebase checks out the upstream and replays your work onto it, so "ours" is the upstream and "theirs" is your own commits.'),
      ]
    ),
    chapter(
      'Remotes and Collaboration',
      'How your clone talks to GitHub, what a pull request is really for, and shipping tagged releases people can rely on.',
      [
        lesson('Remotes: fetch, pull, and push', 13, `
A **remote** is nothing but a named URL that Git knows how to talk to.

\`\`\`bash
$ git remote -v
origin  git@github.com:acme/storefront.git (fetch)
origin  git@github.com:acme/storefront.git (push)
\`\`\`

\`origin\` is a convention, not a keyword — it is simply the name \`git clone\` assigns. You can have several: \`origin\` for your fork, \`upstream\` for the project you forked from.

### Remote-tracking branches are bookmarks, not live views

This is the concept that unlocks everything else. \`origin/main\` is a **local** ref recording what \`main\` looked like on the server **the last time you fetched**. It is read-only, it does not update itself, and it can be hours out of date.

\`\`\`text
main         your local branch, you commit to it
origin/main  your local snapshot of the server's main
             (updated only by fetch, pull, or push)
\`\`\`

So when \`git status\` says *"Your branch is up to date with 'origin/main'"*, it means up to date with your **cached copy**. It has not checked the network.

### The three verbs

| Command | What it does |
|---|---|
| \`git fetch\` | Download new objects and update \`origin/*\`. Touches nothing you are working on. |
| \`git pull\` | \`fetch\`, then \`merge\` (or \`rebase\`) \`origin/main\` into your branch. Changes your files. |
| \`git push\` | Upload your commits and ask the server to move its branch. |

\`git fetch\` is the completely safe one. Nothing in your working directory changes; you simply learn what happened. A good habit:

\`\`\`bash
git fetch origin
git log --oneline HEAD..origin/main    # what did they do that I do not have?
git log --oneline origin/main..HEAD    # what do I have that they do not?
\`\`\`

### Pushing and upstreams

\`\`\`bash
git switch -c fix/cart-rounding
git push -u origin fix/cart-rounding    # -u links the two; later, plain "git push" works
\`\`\`

Pushing a branch also creates it on the server if it is not there. \`-u\` (short for \`--set-upstream\`) is what makes \`git status\` able to say "ahead 2, behind 1".

### When a push is rejected

\`\`\`bash
$ git push
 ! [rejected]        main -> main (fetch first)
hint: Updates were rejected because the remote contains work that you do not have locally.
\`\`\`

The server is refusing to lose commits. Somebody pushed while you were working. The fix is never force — it is to integrate:

\`\`\`bash
git pull --rebase       # replay my commits on top of theirs (Chapter 3)
git push
\`\`\`

### When you genuinely must rewrite a pushed branch

After an interactive rebase on **your own** feature branch, the remote's version is now the odd one out and a normal push will be rejected. Use:

\`\`\`bash
git push --force-with-lease
\`\`\`

Never plain \`--force\`. \`--force-with-lease\` first checks that the remote branch is still where you last saw it; if a teammate pushed in the meantime, it aborts instead of silently deleting their commit. It is the same command with a seatbelt, and there is no reason to prefer the version without one.

### Housekeeping

\`\`\`bash
git fetch --prune     # delete origin/* bookmarks for branches deleted on the server
git remote prune origin
git branch -vv        # spot local branches whose upstream is marked [gone]
\`\`\`

### The common mistake

*"GitHub shows three new commits but \`git log\` shows nothing, and \`git status\` says I am up to date."* Nothing is broken: you have not fetched, so your \`origin/main\` bookmark is stale and \`status\` is faithfully reporting a comparison against old data. Run \`git fetch\` and look again. Fetch early in any confusing situation — it costs nothing and cannot break anything.
        `),
        lesson('Pull Requests and Review Etiquette', 13, `
A pull request is two things at once: a *request* to merge one branch into another, and a *place to talk about the code before that happens*. Git provides the first; GitHub provides the second, and the second is where the value is.

### The loop

\`\`\`bash
git switch -c feat/coupon-codes
# ... work, committing in atomic pieces (Chapter 2) ...
git push -u origin feat/coupon-codes
gh pr create --fill --draft     # or open the link GitHub prints after the push
\`\`\`

Open it as a **draft** while it is still moving. That signals "not for review yet" without leaving your work invisible, and CI still runs.

### Making a pull request that gets a good review

- **Small.** Under ~400 changed lines is the range where reviewers actually find defects; past roughly 800 they skim and approve. Two PRs get reviewed better than one PR of the same total size.
- **One concern.** Never mix a formatting sweep with a behaviour change — the real change disappears into 600 lines of re-indentation.
- **A description that answers three questions:** why this change exists, what approach you took and what you rejected, and how you verified it. Screenshots for UI, a curl command for an API.
- **Self-review first.** Read your own diff on GitHub before requesting review. You will find a stray \`console.log\` roughly one time in three, and the reviewer's attention is a finite resource you should not spend on that.
- **Green CI.** Requesting review on a red build asks someone to do the machine's job.

### Reviewing well

Review the **code**, never the person. "This function does X, which breaks when the cart is empty" is useful; "you didn't think about empty carts" is not, and it makes people defensive rather than curious.

Label the weight of each comment so the author knows what blocks:

\`\`\`text
blocking: this drops the tax line when the coupon is 100% — see test case below
question: is the retry intentional here, or left over from debugging?
nit: spelling — "recieve" -> "receive"  (feel free to ignore)
suggestion: extracting this into formatCents() would let the PDF path reuse it
\`\`\`

If nothing blocks, **approve with comments** rather than holding the PR for a nit. A review that sits for two days because of a typo costs the team far more than the typo does.

Two more habits that matter: prefer questions to commands when you might be missing context, and if a thread passes three round trips, stop typing and have a five-minute conversation.

### As the author

Reply to every comment — even if only with "done" or "left as is, because X". Silent force-pushes mid-review are the one genuinely rude move: the reviewer loses their place and cannot see what changed since they last looked. Push follow-up commits during review, and squash at merge time instead.

### Merge strategies, and what each leaves behind

| Strategy | Result on the base branch |
|---|---|
| **Merge commit** | Every commit preserved, plus a merge commit. Full fidelity, busier graph. |
| **Squash and merge** | One commit per PR. Clean, revertable history — the squashed message becomes the record, so write it properly. |
| **Rebase and merge** | Each commit replayed on top, no merge commit. Linear, but every hash changes. |

Squash-and-merge is the common default because it makes \`main\` a readable list of shipped changes, each one revertable in a single command. Whichever you choose, delete the branch after merging and pull the base branch before starting the next piece of work.

### The common mistake

Letting a branch age. A PR opened on Monday and merged the following Friday has drifted from \`main\`, accumulated conflicts, and gone stale in the reviewer's head. Keep branches short-lived, rebase onto \`main\` daily while the PR is open (it is your branch — Chapter 3's golden rule permits it), and ship in small pieces.
        `),
        lesson('Tags, Releases, and Versioning', 12, `
Branches move; **tags do not**. A tag is a permanent name for one specific commit, which makes it the right tool for "this exact snapshot is version 1.4.0".

### Two kinds of tag

\`\`\`bash
git tag v1.4.0                                  # lightweight: just a ref, like a frozen branch
git tag -a v1.4.0 -m "Coupon codes, faster PDF" # annotated: a real object
\`\`\`

An **annotated** tag is a full Git object carrying a tagger, a date, a message, and optionally a GPG signature. A lightweight tag is a bare pointer with no metadata at all.

Use annotated tags for anything you publish. The rule of thumb: lightweight tags are private bookmarks, annotated tags are public statements.

\`\`\`bash
$ git show v1.4.0
tag v1.4.0
Tagger: Ayesha Khan <ayesha@example.com>
Date:   Mon Jun 24 11:02:00 2024 +0500

Coupon codes, faster PDF
\`\`\`

### Tags are not pushed by default

\`\`\`bash
git push origin v1.4.0     # push one tag — do this
git push --follow-tags     # push commits plus annotated tags that point at them
git push --tags            # push every local tag, including junk you forgot about
git tag -l "v1.*"          # list
git tag -d v1.4.0          # delete locally
\`\`\`

Forgetting to push the tag is the classic release-day slip: the release exists on your machine and nowhere else, and CI never triggers.

### Semantic versioning, decided concretely

\`MAJOR.MINOR.PATCH\` — and the digits are a promise to your users, not decoration:

| Change | Bump | Example |
|---|---|---|
| Bug fix, no API change | PATCH | \`1.4.0\` → \`1.4.1\` |
| New feature, still backwards compatible | MINOR | \`1.4.1\` → \`1.5.0\` |
| Anything that breaks existing callers | MAJOR | \`1.5.0\` → \`2.0.0\` |

A renamed field, a removed endpoint, a changed default, a stricter validation rule — all major. "It is only a small break" is how you lose a user's trust: they pinned \`^1.0.0\` on the strength of that promise.

This is where Chapter 2's message discipline pays off. With \`feat:\` / \`fix:\` / \`!\` prefixes, the next version number and the changelog are both derivable from \`git log\` by a tool, with no human judgement needed.

### GitHub Releases

A GitHub Release is a tag plus notes, plus optional binary assets:

\`\`\`bash
gh release create v1.4.0 --generate-notes
gh release create v1.4.0 --notes-file CHANGELOG.md ./dist/app.zip
\`\`\`

\`--generate-notes\` builds the notes from the merged pull request titles since the previous tag — which is precisely why PR titles deserve the same care as commit subjects.

### Tagging builds automatically

\`\`\`bash
$ git describe --tags
v1.4.0-12-g7f4c2d1     # 12 commits after v1.4.0, at commit 7f4c2d1
\`\`\`

Stamp that into your build output and any bug report tells you the exact commit it came from.

### The common mistake

Moving or deleting a published tag. Somebody spots a problem in \`v1.4.0\`, fixes it, and re-points the tag at the new commit. Now \`v1.4.0\` means two different things: fresh clones get the new code, everyone who already fetched keeps the old, and CI caches serve whichever they happened to store. Debugging that costs hours.

Tags are immutable by convention, and the convention exists for a reason. The fix for a bad release is always **v1.4.1**, never a second \`v1.4.0\`.
        `),
      ],
      [
        q('A teammate pushed to main an hour ago. Your git log shows nothing new and git status says "up to date". Why?', [
          'Their push silently failed',
          'Your branch is in a detached HEAD state',
          'You must run git merge before git log reflects new work',
          'origin/main is a local bookmark from your last fetch, and you have not fetched since',
        ], 3, 'Remote-tracking refs only update when you fetch, pull, or push — status compares against that cached copy, not the network.'),
        q('Why prefer git push --force-with-lease over --force?', [
          'It transfers less data',
          'It aborts if the remote moved since your last fetch, so you cannot silently erase a teammate\'s push',
          'It creates a backup branch automatically',
          'It only rewrites merge commits',
        ], 1, 'The "lease" is a check that the remote is still where you last saw it — the same operation, with a seatbelt.'),
        q('Which pull request is easiest to review well?', [
          'A large PR with the feature plus a repository-wide formatting sweep',
          'A PR with no description, because the code should be self-documenting',
          'A 200-line PR doing one thing, described with why it exists and how it was tested',
          'A PR left open for two weeks so everyone has time to look',
        ], 2, 'Reviewers find real defects in small, single-purpose diffs; past a few hundred lines review quality collapses into skimming.'),
        q('What is the practical difference between an annotated and a lightweight tag?', [
          'An annotated tag is a real object with tagger, date, and message, so it can be signed and described',
          'A lightweight tag can be moved later, an annotated one cannot',
          'Only lightweight tags are pushed by default',
          'Annotated tags point at branches, lightweight tags point at commits',
        ], 0, 'Annotated tags carry metadata and can be signed, which is why releases should always use them.'),
      ]
    ),
    chapter(
      'Undoing Things and Recovering',
      'restore, revert, and the three resets — plus stash, cherry-pick, and the reflog that makes almost nothing permanent.',
      [
        lesson('restore, revert, reset — What Each Actually Does', 14, `
Three commands undo things and they are not interchangeable. Choose by asking one question: **what am I moving — a file, history, or a pointer?**

### restore: file level, no history involved

\`\`\`bash
git restore src/cart.js                    # discard my edits (DESTRUCTIVE, no undo)
git restore --staged src/cart.js           # unstage, keep the edits on disk (safe)
git restore --source=HEAD~3 src/cart.js    # bring an old version of one file into the working tree
\`\`\`

None of these touch a commit. \`restore\` moves content between the areas from Chapter 1, Lesson 2.

### revert: a new commit that undoes an old one

\`\`\`bash
git revert 4c1d77a          # creates a NEW commit applying the inverse change
git revert -n 4c1d77a       # stage the inverse without committing yet
\`\`\`

History grows; nothing is rewritten. Because it adds rather than removes, **revert is the only correct way to undo something already pushed and pulled by others.** Everyone gets the fix through a normal pull, no force-push, no diverged clones.

### reset: move the branch pointer

Remember Chapter 1: a branch is a pointer. \`reset\` re-points it, and the flag decides how much comes along.

\`\`\`bash
git reset --soft  HEAD~1
git reset --mixed HEAD~1     # the default
git reset --hard  HEAD~1
\`\`\`

| Mode | Branch pointer | Index | Working directory | You are left with |
|---|---|---|---|---|
| \`--soft\` | moves | untouched | untouched | The changes **staged**, ready to re-commit |
| \`--mixed\` | moves | reset to new HEAD | untouched | The changes **on disk, unstaged** |
| \`--hard\` | moves | reset | **overwritten** | Nothing — the changes are gone |

Read that table twice. Every reset question you will ever have is answered by it.

### The recipe you will use most

Squash your last three commits into one, before pushing:

\`\`\`bash
git reset --soft HEAD~3        # pointer back 3, all the changes stay staged
git commit -m "Add coupon codes at checkout"
\`\`\`

Three messy WIP commits become one clean one, with zero risk — nothing was in the working directory to lose.

### And the one that bites

\`\`\`bash
git reset --hard HEAD~1
\`\`\`

Two different things happen here, and only one is recoverable:

- The **commit** you moved off is still in the object database and \`git reflog\` will find it (next lesson but one).
- Any **uncommitted work** in your working directory is overwritten permanently. Git never recorded it, so there is nothing to recover from.

That is the real danger. \`--hard\` is safe on committed history and unforgiving about everything else. Commit or stash first, always.

### Choosing, in one table

| You want to | Use |
|---|---|
| Throw away edits to one file | \`git restore <file>\` |
| Unstage something | \`git restore --staged <file>\` |
| Undo a commit that is already public | \`git revert <sha>\` |
| Re-do the last local commit's message or contents | \`git commit --amend\` |
| Combine several local commits | \`git reset --soft\` then commit |
| Unstage everything, keep the work | \`git reset\` (mixed, the default) |
| Abandon local commits *and* the edits | \`git reset --hard\` |

### The common mistake

Using \`git reset --hard\` to remove a commit that is already on \`origin/main\`, then force-pushing. You have rewritten shared history: everyone else still has the old commit, their next push tries to put it back, and the "deleted" commit reappears twice. Meanwhile anyone who pulled during the window has a diverged clone.

Public history is append-only. \`revert\` in public, \`reset\` in private — that one sentence prevents most Git disasters that reach a team chat.
        `),
        lesson('Stashing and Moving Work Between Branches', 12, `
Half-finished work is normal. Git gives you two clean ways to park it and one way to copy a finished commit somewhere else.

### Stash: a shelf for work in progress

\`\`\`bash
git stash push -m "half-done coupon validation"   # save and clean the working tree
git stash list
# stash@{0}: On feat/coupons: half-done coupon validation
git stash pop         # re-apply the newest stash and delete it
git stash apply       # re-apply but KEEP it on the shelf
git stash drop        # delete without applying
\`\`\`

Always pass \`-m\`. A list of five entries reading "WIP on main" is a list you will never dare to pop.

### The gotcha that eats new files

By default, **stash ignores untracked files.** You stash, switch branches, and the brand-new component you created is still sitting there — now on the wrong branch, and sometimes blocking the switch entirely with "would be overwritten by checkout".

\`\`\`bash
git stash push -u    # include untracked files
git stash push -a    # include ignored files too (rarely what you want)
\`\`\`

You can also stash selectively, which is often better than stashing everything:

\`\`\`bash
git stash push -m "just the CSS" src/styles/
\`\`\`

### Wrong branch? Two ways out

You made three commits on \`main\` that belonged on a feature branch:

\`\`\`bash
git switch -c feat/coupons     # branch here — the commits come with you
git switch main
git reset --hard origin/main   # put main back where the server has it
\`\`\`

Or for uncommitted work, simply \`git stash\`, switch, \`git stash pop\`. Both are routine; neither loses anything.

### The better habit for anything long-lived

A stash is a shelf, not a filing cabinet. It has no branch, no message discipline, and no visibility in the graph — a stash three weeks old is a stash you will drop unread.

For work you will return to tomorrow, make a real commit instead:

\`\`\`bash
git commit -am "WIP: coupon validation, do not review"
# ... later, to pick up where you left off ...
git reset --soft HEAD~1    # the commit dissolves back into your staged changes
\`\`\`

It is on a branch, it is pushable as a backup, and Chapter 5's recovery tools cover it.

### cherry-pick: copy one commit elsewhere

\`\`\`bash
git switch release/1.4
git cherry-pick 4c1d77a       # apply that commit's change here as a NEW commit
git cherry-pick -x 4c1d77a    # same, but record "cherry picked from 4c1d77a" in the message
git cherry-pick a1b2c3d..e5f6a7b   # a range
\`\`\`

Like rebase (Chapter 3), cherry-pick **creates a new commit with a new hash**. The change now exists twice in history — which is fine when it is deliberate, such as landing a hotfix on both \`main\` and a maintenance release branch. Use \`-x\` so the duplicate is traceable.

Conflicts work exactly as they do in a merge, with the same escape hatch:

\`\`\`bash
git cherry-pick --abort
\`\`\`

### The common mistake

Cherry-picking as a routine way to move work between branches. It creates duplicate commits that later merges must reconcile, which produces conflicts that look impossible because both sides genuinely contain the same change under different hashes. If you are cherry-picking several times a week, the branching model is wrong — usually a long-lived branch that should have been rebased or merged instead.
        `),
        lesson('The Reflog: Why Almost Nothing Is Lost', 13, `
Every time HEAD moves — commit, switch, merge, rebase, reset, pull — Git writes a line to the **reflog**. It is a local, per-clone journal of where your pointers have been, kept for 90 days by default.

\`\`\`bash
$ git reflog
e5c1a90 HEAD@{0}: reset: moving to HEAD~3
7f4c2d1 HEAD@{1}: commit: Add coupon validation
b3a9e11 HEAD@{2}: commit: Extract price formatter
d0f2a4e HEAD@{3}: checkout: moving from main to feat/coupons
9a0f2bb HEAD@{4}: pull --rebase: checkout 9a0f2bb
\`\`\`

Read it as a stack of "where HEAD was". \`HEAD@{1}\` is where it pointed one move ago. That is enough to undo nearly anything.

### Recovery recipes

**A reset went too far:**

\`\`\`bash
git reflog                       # find the entry from just BEFORE the reset
git reset --hard 7f4c2d1         # or: git reset --hard HEAD@{1}
\`\`\`

**A rebase mangled the branch:**

\`\`\`bash
git reset --hard ORIG_HEAD       # Git saves the pre-rebase tip here automatically
\`\`\`

**You deleted a branch that was not merged:**

\`\`\`bash
git reflog | grep "checkout: moving from feat/coupons"
git branch recovered-coupons 7f4c2d1     # point a new label at the old tip
\`\`\`

**You committed on a detached HEAD and switched away** (Chapter 1, Lesson 3): the same move — find the hash in the reflog, create a branch at it.

**Amended away a commit you needed:**

\`\`\`bash
git reflog                       # the pre-amend commit is still listed
git switch -c rescued HEAD@{1}
\`\`\`

### When even the reflog has no entry

Dropped stashes and other genuinely orphaned objects leave nothing in the reflog. They are still in the object database until garbage collection:

\`\`\`bash
git fsck --lost-found --unreachable | grep commit
git show <sha>                   # is this the one?
git branch recovered <sha>
\`\`\`

Do this promptly. \`git gc\` prunes unreachable objects after roughly two weeks.

### The limits, stated plainly

- The reflog is **local**. A fresh clone has an empty one, and it is not pushed anywhere.
- It only records things **Git saw**. Uncommitted edits destroyed by \`git reset --hard\`, \`git restore <file>\`, or \`git clean -fd\` are not in it, because they were never objects. Nothing recovers those.
- Entries expire — 90 days for reachable, 30 for unreachable.

### What this changes about how you work

Once you trust the reflog, experiments stop being risky. Try the interactive rebase. Try the merge. Try the reset. Every one of them is undoable in a single command, and the worst realistic outcome is five minutes reading \`git reflog\`.

The one asymmetry worth internalising: **Git protects what it has recorded and cannot protect what it has not.** So the safety habit is simply to commit often. A commit takes two seconds, is recoverable for three months, and can be reshaped later with \`reset --soft\`, \`--amend\`, or \`rebase -i\` — all of which you now know.

### Where you have got to

You can now describe what a commit is, what a branch is, and where your files are at any moment. You can build a commit deliberately, write a message worth reading, keep secrets out of history, branch and merge, rebase without fear, resolve conflicts, collaborate through remotes and pull requests, tag a release, and undo every one of those operations. That is the whole model — the commands were only ever the surface.
        `),
      ],
      [
        q('You have three unpushed commits you want to combine into one. Which gets you there?', [
          'git reset --hard HEAD~3, then re-edit the files by hand',
          'git revert HEAD~3..HEAD',
          'git reset --soft HEAD~3, then git commit',
          'git restore --source=HEAD~3 .',
        ], 2, '--soft moves only the branch pointer, leaving all three commits\' changes staged and ready to re-commit as one.'),
        q('What does git reset --mixed HEAD~1 (the default) leave you with?', [
          'The commit undone and its changes erased from disk',
          'The commit undone and its changes staged',
          'The commit intact, plus a new commit reversing it',
          'The commit undone, its changes in your working directory but unstaged',
        ], 3, 'Mixed moves the branch and resets the index, but never touches the working directory — so the work survives, unstaged.'),
        q('A bad commit is already on origin/main and teammates have pulled it. Correct fix?', [
          'git revert <sha>, then push the new commit',
          'git reset --hard <sha>^, then force-push',
          'git commit --amend, then force-push',
          'Delete the branch on GitHub and push it again',
        ], 0, 'Revert adds an inverse commit, so public history stays append-only and everyone gets the fix through a normal pull.'),
        q('git reset --hard threw away commits you still needed. What recovers them?', [
          'Nothing — --hard is permanent by design',
          'git reflog, then reset --hard to the HEAD@{n} entry from just before the mistake',
          'git stash pop',
          'Re-cloning the repository from origin',
        ], 1, 'The commits are still in the object database, and the reflog records the pointer position you moved away from.'),
      ]
    ),
    chapter(
      'Investigating History',
      'Naming exactly the commits you mean, tracking down the change that introduced a line, and letting bisect find the guilty commit for you.',
      [
        lesson('Naming Commits: Ranges, Carets, and Tildes', 13, `
Every command that takes a commit takes a **revision**, and Git's revision grammar is small, precise, and worth ten minutes of your life. Most "why is this diff showing 400 files?" moments are a revision you did not mean to write.

### Walking backwards: ~ and ^

\`HEAD~n\` walks **n generations back**, always along first parents. \`HEAD^n\` selects the **nth parent of a single commit**.

| Expression | Resolves to |
|---|---|
| \`HEAD~1\`, \`HEAD^\` | the parent |
| \`HEAD~2\` | the grandparent, down the first-parent line |
| \`HEAD^2\` | the **second** parent — exists only on a merge commit |
| \`HEAD~2^2\` | the second parent of the grandparent |

For an ordinary one-parent commit \`HEAD~1\` and \`HEAD^\` coincide, which is why the difference stays hidden — until the day you type \`git show HEAD^2\` expecting the grandparent and Git answers \`fatal: ambiguous argument\`, because an ordinary commit has no second parent. On a merge commit that same expression resolves happily, to the tip of whatever was merged in. Check before you act rather than after:

\`\`\`bash
git rev-parse --short HEAD~2   # print what it actually resolves to
git rev-parse --short HEAD^2   # --short verifies one revision at a time, so ask separately
\`\`\`

### Ranges

\`\`\`bash
git fetch
git log --oneline main..feature       # commits on feature that main does not have
git log --oneline feature..main       # commits on main that feature is missing
git rev-list --count main..feature    # "ahead by" — a single number
\`\`\`

\`A..B\` means *reachable from B but not from A*, and it is directional: swapping the sides asks the opposite question. That is exactly the pair of commands from Chapter 4 for comparing yourself against \`origin/main\`.

In \`git log\`, three dots give the **symmetric difference** — commits on either side but not both. Add \`--left-right\` and Git marks each line with \`<\` or \`>\` so you can see who has what.

### The three-dot trap in diff

\`git diff\` uses the same punctuation for a *different* meaning, and this is the classic bug:

| Command | Compares |
|---|---|
| \`git diff main feature\`, \`git diff main..feature\` | the two tips, exactly as they are now |
| \`git diff main...feature\` | the **merge base** against the feature tip |

If \`main\` gained forty commits while you worked, \`git diff main feature\` reports all forty — reversed, as though you had deleted them — mixed in with your two real lines. Three dots ask the question you actually meant: *what did my branch add?* It is what a pull request displays, and the explicit form is:

\`\`\`bash
git diff $(git merge-base main feature) feature
\`\`\`

### Excluding, and reading a squashed main

\`\`\`bash
git log --oneline feature --not main         # the long form of main..feature
git log --oneline --no-merges main..feature  # skip merge commits
git log --oneline --first-parent main        # one line per integration
\`\`\`

\`--first-parent\` is how you read a \`main\` full of merge commits: it follows the mainline only, so each entry is one merged pull request instead of everybody's work-in-progress interleaved by date.

### Other handles worth knowing

\`\`\`bash
git show @{u}                # the upstream tip — usually origin/main
git show HEAD@{2}            # reflog: where HEAD was two moves ago (Chapter 5)
git show main@{yesterday}    # reflog again, so local-only and clone-specific
git show :/rounding          # newest commit whose message contains "rounding"
git show HEAD~3:src/cart.js  # one file, as it was three commits ago
\`\`\`

The \`@{...}\` forms read the reflog, so they mean nothing in a fresh clone and nothing on a colleague's machine. Hashes, tags and branch names are the only revisions you can safely paste into a chat.

### The common mistake

Reviewing with \`git diff main feature\` and concluding the author touched half the codebase. They did not; you compared two tips that share no recent history. Any time a diff is inexplicably large, the first thing to check is not the branch — it is whether you typed two dots where you meant three.
        `),
        lesson('Finding the Change: log -S, -L, and blame', 13, `
\`git blame\` tells you who last touched a line. That is rarely the question. The real question is **which commit introduced this behaviour, and why** — and the log has purpose-built tools for it.

### The pickaxe: -S and -G

\`\`\`bash
git log -S "roundToCents" --oneline    # commits where the NUMBER of occurrences changed
git log -S "roundToCents" -p           # ...with the patch, so you watch it happen
git log -G "round(Cents|Up)" --oneline # commits whose diff has any line matching the regex
\`\`\`

\`-S\` answers *"when did this string appear or disappear?"* by comparing occurrence counts between a commit and its parent — so a commit that merely moved the line slips past it silently. \`-G\` answers *"which commits touched a line mentioning this?"* and matches far more, including moves and reformatting.

The rule of thumb: **-S for the birth or death of an identifier, -G for every commit that fiddled with it.**

### The life story of one function

\`\`\`bash
git log -L :total:src/invoice.js   # every change to the total() function
git log -L 40,60:src/invoice.js    # every change to those lines, tracked as they drift
\`\`\`

\`-L\` prints one patch per commit, restricted to that range, and follows the range as it moves up and down the file across history. Nothing else in the toolbox answers "how did this function get like this?" as directly.

### Renames

\`\`\`bash
git log --oneline -- src/invoice.js           # stops dead at the rename
git log --oneline --follow -- src/invoice.js  # keeps walking through it
\`\`\`

Chapter 1 explained that Git stores snapshots, not operations — there is no "rename" recorded anywhere. Renames are *detected* by content similarity, and \`--follow\` turns that detection on for the path you named. Without it, a file renamed in March looks like it was created in March, and you conclude the bug is far younger than it is.

### Blame that survives formatting

\`\`\`bash
git blame -w -C -L 30,50 src/invoice.js
\`\`\`

- \`-w\` ignores whitespace-only changes, so a reindentation stops stealing the blame
- \`-C\` detects lines moved or copied from another file in the same commit
- \`-L\` restricts the output to a range, so you read 20 lines instead of 900

And when a repository-wide formatting sweep has already landed — Chapter 3 warned you not to mix one with a logic change — record it so blame skips over it:

\`\`\`bash
echo "9a0f2bbf16a7b0f8a2d1e33c9b7a4e2f1d0c8a55" >> .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs
\`\`\`

Commit that file. GitHub honours it in its own blame view too, which stops "Run Prettier across the repo" from appearing as the author of half your codebase.

### Searching content instead of diffs

\`\`\`bash
git grep -n "legacyTaxRate"           # the working tree
git grep -n "legacyTaxRate" v1.4.0    # any commit or tag, without checking it out
git grep -n --heading --break "TODO(" -- src/
\`\`\`

\`git grep\` searches tracked files only, which makes it dramatically faster than \`grep -r\` in a repository with a \`node_modules\` in it — and it can search a commit you do not have checked out.

| Question | Tool |
|---|---|
| Where is this string right now? | \`git grep\` |
| When did this identifier appear or vanish? | \`git log -S\` |
| Which commits edited lines mentioning it? | \`git log -G\` |
| How did this function evolve? | \`git log -L\` |
| Who wrote this line, ignoring reformatting? | \`git blame -w -C\` |

### The common mistake

Running blame on a suspicious line, landing on "Reformat with Prettier" or a rename commit, and stopping there — concluding that nobody knows why the line exists. Blame reports the last commit to touch a line, not the one that gave it meaning. When blame lands on noise, switch to \`git log -S\` on the identifier or \`-L\` on the range. Those follow the *content*, and they lead you to the commit whose message actually explains the decision.
        `),
        lesson('git bisect: Let Git Find the Bad Commit', 14, `
The feature worked in \`v1.4.0\` and is broken on \`main\`, and there are 800 commits in between. Reading them is hopeless. \`git bisect\` binary-searches instead: 800 commits cost about ten tests, and 4,000 cost twelve.

### The manual loop

\`\`\`bash
git bisect start
git bisect bad              # the commit I am on is broken
git bisect good v1.4.0      # this tag was fine
# Bisecting: 399 revisions left to test after this (roughly 9 steps)
\`\`\`

Git checks out the midpoint — on a detached HEAD, exactly as described in Chapter 1, Lesson 3. Test it, then tell Git which way to go:

\`\`\`bash
git bisect good     # works here, so the bug is newer
git bisect bad      # broken here too, so the bug is older
git bisect skip     # this commit will not build; try a neighbour
\`\`\`

Repeat until Git announces the answer:

\`\`\`text
7f4c2d1a9b is the first bad commit
    Sum prices in integer cents
\`\`\`

Then, always:

\`\`\`bash
git bisect reset    # return to the branch you started from
\`\`\`

### Let it drive itself

Anything you can script, Git will run for you:

\`\`\`bash
git bisect start main v1.4.0     # bad first, good second — the whole setup in one line
git bisect run npm test -- invoice
\`\`\`

Exit codes are the protocol:

| Exit code | Means |
|---|---|
| \`0\` | good |
| \`1\`–\`127\`, except \`125\` | bad |
| \`125\` | untestable — skip this commit |
| \`128\` and above | abort the bisect |

So a wrapper script is three lines:

\`\`\`sh
#!/bin/sh
# bisect-check.sh — keep it OUTSIDE the repo, or bisect will check it out from under you
npm ci --silent || exit 125    # deps will not install at this commit: skip, do not blame it
npm test --silent -- invoice   # exit 0 = good, anything else = bad
\`\`\`

Then \`git bisect run ../bisect-check.sh\`. That \`|| exit 125\` is the line that separates a bisect which works from one that confidently blames the commit that bumped a dependency.

### Not only for bugs

Bisect finds the first commit where *any* property flipped, and the terms are renameable:

\`\`\`bash
git bisect start --term-old fast --term-new slow
git bisect slow
git bisect fast v1.4.0
git bisect run ./perf-check.sh   # exit 1 when the p95 is over 200ms
\`\`\`

Performance regressions, a bundle crossing its size budget, a test that started flaking — same machinery.

### Narrowing and replaying

\`\`\`bash
git bisect start -- src/invoice.js   # only consider commits touching this path
git bisect log > bisect.log          # save the session
git bisect replay bisect.log         # resume it later, or hand it to a colleague
\`\`\`

### Why Chapter 2 mattered

Bisect assumes **every commit builds and runs**. A history of atomic commits gives a clean binary search and one guilty commit whose message explains itself. A history of "wip", "wip 2", "fix the wip" gives a run of \`skip\`s and a final answer of "somewhere in these nine commits". Staging deliberately was never tidiness for its own sake; this is the payoff.

### The common mistake

Two, and both look like Git misbehaving:

- **Forgetting \`git bisect reset\`.** You get interrupted mid-session, come back an hour later, and commit — on a detached HEAD. Nothing is lost, and Chapter 5 gets it back, but HEAD is not where you think it is.
- **Bisecting with a flaky test.** One false "good" and the search converges, with total confidence, on an innocent commit. If a test is intermittent, run it three times inside your script and treat any failure as bad — or \`skip\` and accept a wider answer than a wrong one.
        `),
      ],
      [
        q('main gained 40 commits while your feature branch gained 3. Which command shows only what your branch changed?', [
          'git diff main feature',
          'git diff main..feature',
          'git diff main...feature',
          'git log -p feature',
        ], 2, 'In diff, three dots compare the merge base against the feature tip, so commits main gained meanwhile are excluded.'),
        q('What does HEAD^2 refer to?', [
          'The second parent of HEAD, which only exists if HEAD is a merge commit',
          'The same commit as HEAD~2',
          'The second commit ever made in the repository',
          'The second file changed by HEAD',
        ], 0, 'Tilde walks generations back along first parents, while caret picks which parent of one commit — so ^2 resolves only on a merge.'),
        q('You want the commit that removed the last call to roundToCents(). Which finds it?', [
          'git blame src/invoice.js',
          'git log --follow -- src/invoice.js',
          'git grep roundToCents',
          'git log -S "roundToCents" -p',
        ], 3, 'The pickaxe reports commits where the number of occurrences of the string changed, which is exactly an addition or a removal.'),
        q('Your bisect script exits with code 125. What does Git do?', [
          'Marks the commit bad and continues',
          'Skips the commit as untestable and picks a neighbour',
          'Stops the bisect with an error',
          'Marks the commit good and continues',
        ], 1, '125 is the reserved "cannot test this one" code, so a commit that fails to build is never mistaken for the commit that caused the bug.'),
      ]
    ),
    chapter(
      'Hooks, CI, and Repositories at Scale',
      'Hooks that catch mistakes before they land, the server-side rules that actually enforce them, and keeping a large clone fast.',
      [
        lesson('Hooks: Catching Mistakes Before They Land', 13, `
Git runs your own scripts at fixed points in its operations. That is the whole mechanism of a **hook**: an executable file, with the right name, in the hooks directory.

\`\`\`bash
$ ls .git/hooks
applypatch-msg.sample  commit-msg.sample  pre-commit.sample  pre-push.sample  ...
\`\`\`

Drop the \`.sample\`, make it executable, and Git runs it. Any language with a shebang works.

### The four worth having

| Hook | Runs | A non-zero exit |
|---|---|---|
| \`pre-commit\` | before the message editor opens | aborts the commit |
| \`commit-msg\` | after the message is written; \`$1\` is the message file | aborts the commit |
| \`pre-push\` | before objects are sent; refs arrive on stdin | aborts the push |
| \`post-checkout\` | after a switch or checkout | cannot abort anything |

### A pre-commit worth copying

\`\`\`sh
#!/bin/sh
# .githooks/pre-commit   (remember: chmod +x)
set -e

# 1. Conflict markers and whitespace errors, in what is STAGED (Chapter 3).
git diff --cached --check

# 2. Never commit a real .env, whatever .gitignore happens to say today (Chapter 2).
if git diff --cached --name-only | grep -qx '\\.env'; then
  echo "pre-commit: refusing to commit .env" >&2
  exit 1
fi

# 3. Lint the staged files only — not the whole project.
files=$(git diff --cached --name-only --diff-filter=ACM | grep '\\.js$' || true)
if [ -n "$files" ]; then
  npx eslint $files
fi
exit 0
\`\`\`

Note \`--cached\` in every one of those commands: the hook must judge the index, not your working directory. Linting the files on disk means the half-finished edit you deliberately did not stage (Chapter 2) fails your commit.

### commit-msg: enforce the shape

\`\`\`sh
#!/bin/sh
# .githooks/commit-msg   ($1 is the path to the message file)
subject=$(head -n 1 "$1")

if [ \${#subject} -gt 72 ]; then
  echo "commit-msg: subject is \${#subject} characters; keep it under 72" >&2
  exit 1
fi

# Conventional Commits, if something in your pipeline actually consumes them
echo "$subject" | grep -qE '^(feat|fix|chore|docs|test|refactor)(\\(.+\\))?!?: .+' || {
  echo "commit-msg: subject must look like  fix(invoice): sum in cents" >&2
  exit 1
}
\`\`\`

### pre-push: the last cheap gate

\`\`\`sh
#!/bin/sh
npm test --silent || { echo "pre-push: tests failed" >&2; exit 1; }
\`\`\`

Budget your hooks by how often they run. **Keep \`pre-commit\` under about two seconds** — people commit dozens of times a day, and a hook they wait ten seconds for is a hook they disable by Friday. Slow suites belong in \`pre-push\`, which runs rarely, and in CI, which runs somewhere else entirely.

### Hooks are not cloned

\`.git/hooks\` lives inside \`.git\`, and \`.git\` is not part of history. Nothing you put there ever reaches a teammate. The fix is one config setting plus a committed directory:

\`\`\`bash
mkdir .githooks
git config core.hooksPath .githooks   # then commit .githooks/ like any other source
\`\`\`

Now the scripts are versioned and reviewed like code — though every clone still has to run that \`git config\` line once, so wire it into your setup script or a \`postinstall\`. Husky is a package that automates exactly this dance.

### The common mistake

Believing hooks enforce anything. \`git commit --no-verify\` skips \`pre-commit\` and \`commit-msg\`; \`git push --no-verify\` skips \`pre-push\`; and a colleague who never ran the \`core.hooksPath\` line never had them at all. **A hook is a fast local safety net, not a control.**

The rule that genuinely holds is the one the server enforces — required checks and branch protection, in the next lesson. Run the same lint and test commands in both places: the hook so you find out in two seconds, CI so it cannot be skipped.
        `),
        lesson('CI and Branch Protection: Making the Rules Real', 14, `
A hook tells you. A **required status check** stops you. Once a rule matters, it has to live where \`--no-verify\` cannot reach it.

### A workflow that earns its minutes

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0        # full history — see below
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci             # lockfile-exact install
      - run: npm run lint
      - run: npm test
        env:
          NODE_ENV: test
\`\`\`

Two lines in there are worth more than all the rest:

- **\`npm ci\`, never \`npm install\`.** It installs exactly what \`package-lock.json\` records, and fails loudly if the lockfile is stale. That is why Chapter 2 insisted the lockfile belongs in history: it is the difference between CI testing your code and CI testing whatever happened to be published this morning.
- **\`fetch-depth: 0\`.** \`actions/checkout\` makes a shallow, single-branch clone by default. Fast, and fine for a lint job — and it quietly breaks everything that reads history. \`git describe --tags\` (Chapter 4) prints \`fatal: No names found, cannot describe anything.\`, \`git log main..HEAD\` fails because there is no \`main\`, changed-file detection reports the entire repository, and \`git bisect\` (Chapter 6) has nothing to search.

### Making the check a rule

In branch protection, or a ruleset, on \`main\`:

- **Require a pull request before merging.** Direct pushes to \`main\` stop depending on everyone remembering Chapter 4.
- **Require status checks to pass**, naming the exact jobs. A check that is not marked required is a suggestion with a green tick next to it.
- **Require branches to be up to date before merging.** The strongest setting, and it costs a CI re-run per merge. On a busy repository use a **merge queue** instead: it batches pull requests, tests them in the order they will actually land, and merges the ones that pass.
- **Require review from code owners.**
- **Block force pushes and deletions.** This is what finally turns "never rewrite public history" (Chapter 5) from a promise into a guarantee.

### CODEOWNERS

\`\`\`text
# .github/CODEOWNERS — last matching pattern wins
*                      @acme/engineering
/src/billing/**        @acme/payments
/.github/workflows/    @acme/platform
package-lock.json      @acme/platform
\`\`\`

Owning the workflow files themselves is the line people forget. Without it, a pull request can quietly edit the very check that is supposed to be gating it.

### Keep CI honest

- **Fast.** Ten minutes is roughly the edge of patience; past it, people stop waiting and start merging on hope. Cache dependencies, run jobs in parallel, and split lint from tests so a failure names itself in the check list.
- **Deterministic.** A single flaky test teaches the whole team to press "re-run" without reading the log, and from that day CI is decoration. Quarantine flakes the week they appear.
- **The same commands as local.** If CI runs \`npm run lint\` and your hook runs \`eslint\` with different flags, you get failures that reproduce nowhere and arguments that go nowhere.

### The common mistake

Protecting \`main\` and leaving the loopholes open: administrators exempt from the rules, force pushes allowed "for emergencies", or — the quiet one — a required check whose job name changed during a refactor. The branch is now gated on a check that never runs, every pull request goes green, and nobody notices for a month.

Verify protection the way you would test any other code: open a scratch pull request that deliberately fails lint, and confirm the merge button is genuinely blocked.
        `),
        lesson('Keeping a Big Repository Fast', 13, `
Clones get slow for three separate reasons, and each has a different fix: **too many objects** (long history), **too many bytes per object** (binaries), or **too many files in the working tree**.

Find out which one you have before treating it:

\`\`\`bash
git count-objects -vH        # size-pack: how big is the object store, really?

git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  awk '$1 == "blob"' | sort -k3 -n -r | head -10
\`\`\`

That pipeline lists your ten largest blobs with their paths. In a repository that feels mysteriously heavy, it is almost always a handful of files you can name in one line each.

### Binaries: the wound that does not heal

Chapter 1 explained that commits store whole snapshots and that identical files are shared between them. Binaries break the second half. Change one byte of a 40 MB design file and Git stores another ~40 MB, because already-compressed formats do not delta well. Twenty revisions is 800 MB — in **every clone, forever**, including the CI runner that clones on every push.

**Git LFS** keeps a small pointer in Git and the bytes on a separate server:

\`\`\`bash
git lfs install
git lfs track "*.psd" "*.mp4"   # writes .gitattributes
git add .gitattributes          # commit this, or nothing is tracked for anyone else
\`\`\`

Two caveats. Every collaborator needs the LFS client, or they check out pointer text files and file a very confusing bug report. And converting *existing* history means rewriting it with \`git filter-repo\` — the same disruptive, everyone-re-clones operation as purging a leaked secret in Chapter 2. Set LFS up on day one; retrofitting it is a team-wide event.

### Cloning less

\`\`\`bash
git clone --filter=blob:none <url>   # blobless: full commit graph, file contents on demand
git clone --filter=tree:0  <url>     # treeless: smallest, for throwaway CI checkouts
git clone --depth 1 <url>            # shallow: the tip commit and nothing else
\`\`\`

\`--filter=blob:none\` is the one to reach for on a large repository you actually work in. \`git log\`, \`git blame\` and \`git bisect\` all still work; Git fetches blobs when it needs them, which does mean those commands now want the network.

\`--depth 1\` is the aggressive option. A shallow clone has no merge base, so merges, \`git describe\` and bisect all fail — right for a build that only compiles the tip, wrong for anything that reads history, which is precisely the CI trap from the previous lesson.

### Checking out less

For a monorepo where you need three directories out of two hundred:

\`\`\`bash
git clone --filter=blob:none --sparse <url>
cd storefront
git sparse-checkout set apps/web packages/ui
git sparse-checkout list
\`\`\`

Cone mode, the default, keeps whole directories, which is both fast and predictable. Your working tree then holds the paths you asked for plus the root files; everything else stays in history and off your disk.

### Keeping a clone quick

\`\`\`bash
git maintenance start              # scheduled background gc, commit-graph, prefetch
git gc --prune=now                 # a one-off manual repack
git config core.fsmonitor true     # huge trees: watch the filesystem instead of stat-ing it
git config core.untrackedCache true
\`\`\`

A \`git status\` that takes eight seconds is almost always working-tree size rather than history size, and those last two settings usually fix it outright.

### Two checkouts, one clone

\`\`\`bash
git worktree add ../storefront-hotfix release/1.4
git worktree list
git worktree remove ../storefront-hotfix
\`\`\`

A second working directory sharing one object store: an urgent hotfix without stashing (Chapter 5), without re-cloning, and without throwing away your build cache. The one rule is that a branch cannot be checked out in two worktrees at once.

### The common mistake

"It was only one 200 MB video, and I deleted it in the very next commit." Deleting a file does not remove it from history — the same point Chapter 2 made about \`.env\`. The blob stays reachable from the commit that added it, so every clone from now until the end of the project downloads it, and the only cure is rewriting history and asking everyone to re-clone.

Decide *before* the first commit whether a file belongs in Git, in LFS, or in object storage with nothing but a URL in the repository.
        `),
      ],
      [
        q('Why can a pre-commit hook not guarantee that main never receives a lint failure?', [
          'Hooks only run on the default branch',
          'Hooks live in .git, are never cloned, and any commit can bypass them with --no-verify',
          'Hooks cannot run linters, only formatters',
          'Hooks run after the commit object has already been written',
        ], 1, 'A hook is local advice a teammate may never have installed and can always skip, so the enforcing rule has to live on the server.'),
        q('Your CI job runs git describe --tags and prints "fatal: No names found, cannot describe anything.", though the tag exists. Why?', [
          'The tag is annotated rather than lightweight',
          'git describe does not work inside containers',
          'There have been no commits since the tag',
          'actions/checkout makes a shallow clone by default, so no tag history was fetched',
        ], 3, 'The default checkout is depth 1 and single-branch, so anything that reads history needs fetch-depth: 0.'),
        q('A 200 MB video was committed once and deleted in the next commit. What is true now?', [
          'Every clone still downloads it, because the commit that added it still contains it',
          'It is gone as soon as the deleting commit is pushed',
          'Adding it to .gitignore removes it from history',
          'git gc prunes it automatically after two weeks',
        ], 0, 'The blob stays reachable from the commit that introduced it, so only rewriting history — plus a team-wide re-clone — actually removes it.'),
        q('You need three directories from a 200-directory monorepo, but full history for blame and bisect. What do you use?', [
          'git clone --depth 1',
          'A downloaded zip of the default branch',
          'git clone --filter=blob:none --sparse, then git sparse-checkout set',
          'A full clone, then delete the directories you do not need',
        ], 2, 'A blobless clone keeps the whole commit graph so history commands work, while sparse checkout puts only the paths you asked for on disk.'),
      ]
    ),
  ],
  final: [
    q('Why does amending a commit message produce a different hash?', [
      'Git renumbers commits sequentially',
      'The hash covers the whole commit, message included, so any change makes a different object',
      'Amend adds a second parent to the commit',
      'The old hash is reserved by the reflog',
    ], 1, 'A commit is identified by the hash of its own contents, so changing any part of it produces a new commit entirely.'),
    q('git diff --staged answers which question?', [
      'What have I changed since I last pushed?',
      'What is different between main and my branch?',
      'What has changed on disk since I ran git add?',
      'What exactly will go into my next commit?',
    ], 3, 'It compares the index against HEAD, and the index is precisely the proposed next commit.'),
    q('The staging area exists mainly so that you can…', [
      'compose a commit out of only part of your working changes',
      'make git status run faster',
      'avoid merge conflicts',
      'keep a backup copy of your files',
    ], 0, 'Separating "what I have edited" from "what I am about to record" is what makes atomic commits possible.'),
    q('Which of these belongs in a project .gitignore?', [
      'package-lock.json',
      'Your source files',
      'node_modules/ and .env',
      'The .gitignore file itself',
    ], 2, 'Regenerable dependencies and machine-specific secrets stay out; the lockfile belongs in history so builds are reproducible.'),
    q('What is the merge base of two branches?', [
      'The branch you are merging into',
      'The most recent commit both branches share',
      'The very first commit in the repository',
      'The merge commit that Git creates',
    ], 1, 'A three-way merge compares both tips against their common ancestor to work out what each side changed.'),
    q('Your teammate has already pulled the commits on a branch. Which operation is now unsafe?', [
      'Rebasing that branch and force-pushing it',
      'Merging main into it',
      'Adding a new commit to it',
      'Tagging one of its commits',
    ], 0, 'Rebase replaces commits with new hashes, so anyone holding the originals ends up with a duplicated, diverged history.'),
    q('git pull is shorthand for…', [
      'git fetch followed by git reset --hard',
      'git clone followed by git switch',
      'git push, run in reverse',
      'git fetch followed by git merge — or rebase, if configured',
    ], 3, 'Fetch updates your origin/* bookmarks; the second half integrates those changes into your current branch.'),
    q('Why does commit-message discipline pay off at release time?', [
      'It makes clones smaller',
      'It prevents merge conflicts',
      'Generated release notes and git log -S searches are only as good as the messages behind them',
      'Annotated tags require a specific message format',
    ], 2, 'Changelog tooling and history archaeology both read your messages — vague ones make both worthless.'),
    q('Which command can permanently destroy work that Git has never recorded?', [
      'git reset --hard',
      'git revert HEAD',
      'git branch -d feature',
      'git fetch --prune',
    ], 0, '--hard overwrites the working directory, and uncommitted edits were never objects, so the reflog cannot bring them back.'),
    q('What does the reflog record?', [
      'Every command you have ever run',
      'Every position HEAD and your branch tips have pointed at, in this clone',
      'The full history of the remote repository',
      'Every change made to every file',
    ], 1, 'It is a local journal of pointer movements, which is exactly what you need to undo a reset, rebase, or branch deletion.'),
    q('Why does git diff main...feature show what a pull request shows?', [
      'It hides merge commits',
      'It diffs the two branch tips directly',
      'Three dots diff the merge base against the feature tip, so commits main gained meanwhile are excluded',
      'It only shows the files you have staged',
    ], 2, 'A pull request asks "what did this branch add?", which is the merge base compared with the branch tip — not tip against tip.'),
    q('git bisect can search 4,000 commits in about twelve tests, but only if…', [
      'every commit in the range builds and can be tested',
      'the branch has been rebased into a straight line',
      'the repository was cloned with --depth 1',
      'every commit uses a Conventional Commits message',
    ], 0, 'Binary search needs a verdict at each midpoint, which is exactly why atomic, always-building commits are what make bisect usable.'),
    q('What makes a required status check stronger than a pre-push hook?', [
      'It runs faster than a local hook',
      'It can run tests that a hook cannot',
      'It reports the failure to the whole team',
      'The server enforces it, so --no-verify and an uninstalled hook cannot get past it',
    ], 3, 'Local hooks are opt-in and skippable; branch protection is the only place a rule genuinely holds.'),
    q('Which file belongs in Git LFS rather than in ordinary Git?', [
      'package-lock.json',
      'A 40 MB design file revised every week',
      'A 2,000-line CSS file',
      'The .gitattributes file itself',
    ], 1, 'Binaries do not delta compress, so each revision adds its full size to every clone forever — LFS keeps those bytes out of the object store.'),
  ],
});
