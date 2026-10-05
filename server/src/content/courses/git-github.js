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
        `,
        [
          q('You run git commit --amend to fix a typo in the last commit message. What happens to the original commit object?', [
            'Its message field is rewritten in place, so the hash is unchanged',
            'A new commit is written with a new hash, and the original sits unreferenced on disk',
            'It is deleted at once, so the object database stays compact',
            'It is kept, and both commits stay on the branch as separate entries',
          ], 1, 'Amend cannot edit an immutable object, so Git builds a fresh commit from the new message and moves the branch label, leaving the original on disk with nothing naming it.'),
          q('A repository holds 10,000 files. You make 1,000 commits, each touching one file. Why does the object database not end up storing 10 million file copies?', [
            'Trees reference blobs by content hash, so unchanged files are shared between commits',
            'Git stores only a diff for every commit after the very first one',
            'Only files named in the newest commit are kept, older ones get pruned',
            'Each commit compresses its whole tree into a single packed patch',
          ], 0, 'Identical content hashes to the same blob, so a file that did not change is pointed at by every tree containing it rather than copied into each one.'),
          q('git show HEAD prints a patch. Where did that patch come from?', [
            'From the diff stored inside the commit object when it was created',
            'From the index, which caches the last diff Git calculated',
            'Git computed it just now by comparing this commit\'s tree with its parent\'s',
            'From the packfile, which stores commits as deltas against the branch tip',
          ], 2, 'Commits store whole trees, so every diff you see is generated on demand from two snapshots, which is why the same commit can be diffed against any other.'),
        ]
      ),
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
        `,
        [
          q('git status -s shows \'MM src/tax.js\'. You run git commit right now. What lands in the commit?', [
            'Both the staged version and the newer edits, since it is one file',
            'Nothing, because Git refuses to commit a file held in two states',
            'The staged version only, and the file stays modified afterwards',
            'The version on disk, because the working directory always wins',
          ], 2, 'A commit records the index, so edits made after staging are left out and git status keeps reporting the file as modified until you stage them too.'),
          q('Which of these can destroy work that Git has never recorded anywhere?', [
            'git restore --staged src/tax.js, which rewrites the index entry',
            'git restore src/tax.js, which overwrites the file from the index',
            'git diff --staged, which compares the index against HEAD',
            'git add -p src/tax.js, which stages the hunks you pick',
          ], 1, 'Unstaged edits exist only on disk, so overwriting the file from the index removes the single copy that ever existed and no Git command can bring it back.'),
          q('You created src/coupon.js, then ran git commit -am \'Add coupon codes\'. The new file is missing from the commit. Why?', [
            'The -a flag stages changes to tracked files only, and a brand new file is untracked',
            'The -a flag skips any file whose name is not listed in .gitignore',
            'The -m flag cancels the staging that -a would otherwise perform',
            'New files need git init to run again before Git will commit them',
          ], 0, 'The -a shortcut picks up modifications and deletions of files Git already knows about, so anything showing as ?? in git status is skipped entirely.'),
        ]
      ),
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
        `,
        [
          q('You made three commits while in detached HEAD, then ran git switch main without doing anything else. What is true of those three commits?', [
            'They were merged into main automatically as you switched',
            'They were discarded, since a detached HEAD cannot accept commits',
            'They travelled with you and now sit at the tip of main',
            'They still exist, but no branch label points at them any more',
          ], 3, 'Committing on a detached HEAD moves only HEAD itself, so switching away leaves those commits in the object database with nothing naming them.'),
          q('git switch main fails with \'Your local changes to src/cart.js would be overwritten\'. Why does Git stop?', [
            'The two branches have diverged, so a merge has to happen first',
            'Switching rewrites files on disk, and those edits are recorded nowhere yet',
            'The branch main is protected against checkout while it is behind',
            'The index is locked by another Git process that is still running',
          ], 1, 'Git carries uncommitted work across a switch when it does not clash, but refuses when the switch would overwrite edits it holds no copy of.'),
          q('You commit while standing on the branch feature. What changes inside the .git directory?', [
            'The new commit is appended to a list of commits kept in the branch file',
            'The branch file for feature is rewritten to hold the new commit\'s hash',
            'HEAD is changed to point straight at the new commit instead of the branch',
            'The parent commit is updated so that it records its new child commit',
          ], 1, 'A branch file holds exactly one hash, so committing writes the new object then overwrites that ref, while HEAD carries on pointing at the branch.'),
        ]
      ),
            lesson('Config Layers, Identity, and Line Endings', 13, `
Your first commit on a fresh laptop is authored by \`ubuntu@ip-172-31-4-9\`, and GitHub will never connect it to your account. That identity is baked into the commit object, so the only real fix is rewriting history. Two minutes of setup avoids the whole problem.

### Three files, narrowest wins

Git reads configuration from three layers, and the narrowest one that sets a value wins.

| Scope | Flag | File | Use it for |
|---|---|---|---|
| system | \`--system\` | \`/etc/gitconfig\` | almost never |
| global | \`--global\` | \`~/.gitconfig\` | your defaults on this machine |
| local | \`--local\` | \`.git/config\` in the repo | anything one project needs |

When a setting misbehaves, do not guess which file set it:

\`\`\`bash
$ git config --list --show-origin --show-scope | grep user.email
global  file:/Users/ayesha/.gitconfig   user.email=ayesha@personal.dev
local   file:.git/config                user.email=ayesha@acme.com
\`\`\`

Local wins, so this repository commits as \`ayesha@acme.com\`.

### Identity is part of the hash

The opening lesson showed author and committer stored inside the commit object. Change either one and the hash changes, which is why correcting 40 commits made under the wrong address means rebuilding all 40. Set a default per machine:

\`\`\`bash
git config --global user.name "Ayesha Khan"
git config --global user.email ayesha@personal.dev
\`\`\`

Better, let the directory decide:

\`\`\`gitconfig
# ~/.gitconfig
[includeIf "gitdir:~/work/"]
  path = ~/.gitconfig-work
\`\`\`

Every repository under \`~/work/\` now picks up the work identity automatically, and you stop leaking personal-address commits into company history.

### Settings worth thirty seconds

\`\`\`bash
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git config --global push.autoSetupRemote true  # first push needs no -u
git config --global diff.algorithm histogram   # cleaner diffs on refactors
git config --global help.autocorrect 20        # "git stauts" runs after 2 seconds
\`\`\`

\`push.autoSetupRemote\` is the quiet favourite. Without it, the first push of every new branch stops with a paragraph of instructions telling you to retype the command with \`--set-upstream\`. With it, \`git push\` creates the remote branch and links the two.

### Line endings, the invisible diff

Windows editors write CRLF, macOS and Linux write LF. Somebody opens \`src/cart.js\`, saves it, and their pull request shows all 240 lines changed with nothing visibly different. Reviewers see noise, every open branch conflicts, and \`git blame\` stops naming the person who wrote the logic.

\`core.autocrlf\` fixes that one machine at a time, which means it fixes nothing for the teammate who never ran it. Commit the rule instead:

\`\`\`gitattributes
# .gitattributes, tracked like any other file
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
\`\`\`

\`text=auto\` stores LF inside history and checks out whatever the platform expects. Because the file is tracked, it applies to everyone who clones, CI runners included.

### Aliases that pay rent

\`\`\`bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -s"
git config --global alias.last "show --stat HEAD"
\`\`\`

Keep them few and boring. An alias nobody else can read turns your pair-programming session into a translation exercise.

### The common mistake

Running \`git config user.email ...\` without \`--global\`, inside whatever repository you happened to be standing in. Months later one project stamps the wrong address on every commit, nothing you set globally seems to apply, and the config file you keep editing is not the one being read. \`--show-origin\` answers it in one second.

Build the habit: after any configuration surprise, print where the value came from before you change anything.
      `,
        [
          q('Your global config sets user.email to ayesha@personal.dev, and .git/config in the current repository sets ayesha@acme.com. Which address is stamped on your next commit?', [
            'ayesha@acme.com, because the repository\'s own config is the narrowest scope',
            'ayesha@personal.dev, because global settings apply to every repository',
            'Whichever of the two was written most recently, judged by timestamp',
            'Neither of them, because Git asks you to choose at commit time',
          ], 0, 'Git reads system, then global, then local, and the last value read wins, so anything in .git/config overrides the default you set for the machine.'),
          q('A Windows teammate opens a pull request and every line of every file shows as changed, though the code looks identical. What fixes this for the whole team rather than one laptop?', [
            'Ask each person to set core.autocrlf on their own machine',
            'Reformat the files with the project linter and commit the result',
            'Commit a .gitattributes containing \'text=auto\' so the rule is tracked',
            'Add the affected files to .gitignore until the diff settles down',
          ], 2, 'Line ending normalisation declared in a tracked .gitattributes reaches every clone including CI, while core.autocrlf only helps on machines where somebody remembered to set it.'),
          q('You set core.editor globally to \'code --wait\', but committing in ~/projects/api still opens vim. What is the fastest way to find out why?', [
            'Reinstall Git so that the global config file is rebuilt',
            'Delete ~/.gitconfig and set the editor value once again',
            'Set the EDITOR variable in your shell profile instead',
            'Run git config --list --show-origin to see which file sets core.editor',
          ], 3, 'Printing the origin of every value names the exact file responsible, which here is almost always that repository\'s own .git/config overriding your global default.'),
        ]
      ),
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
        `,
        [
          q('A single commit bundles a refactor, a new feature, and a repository-wide formatting sweep. Which later job does that hurt most?', [
            'git fetch, which now has more objects to download',
            'git status, which cannot classify mixed changes',
            'git bisect, which lands on a huge commit that may not even build',
            'git branch, since branching off it costs more',
          ], 2, 'Bisect narrows history down to one guilty commit, and that answer is only useful when each commit does one thing and still builds on its own.'),
          q('You amend a commit that you already pushed and that a teammate has already pulled. What do they meet on their next pull?', [
            'Two commits with the same change and different hashes, which they must untangle',
            'Nothing unusual, because the amend rewrote the commit they already hold',
            'A conflict in every file that the amended commit touched',
            'A rejected pull, because their history no longer matches yours',
          ], 0, 'Amend creates a new commit instead of editing the old one, so their clone keeps the original and gains the replacement, leaving them with duplicated history.'),
          q('A hunk contains five changed lines and you want to stage only two of them. What gets you there?', [
            'Stage the whole file, then unstage the three lines you did not want',
            'Run git add with the --intent-to-add flag on that file first',
            'Stage everything and note the extra lines in the commit message',
            'In git add -p, press s to split the hunk, then e to edit it',
          ], 3, 'Splitting narrows the hunk and the editor lets you choose individual lines, which is how one file holding two unrelated changes becomes two clean commits.'),
        ]
      ),
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
        `,
        [
          q('Why does the blank line between the commit subject and the body matter?', [
            'A pre-commit hook rejects any message that lacks one',
            'Git tools split subject from body on it, so without it a short log prints everything',
            'GitHub needs it before it will link issue numbers found in the body',
            'It keeps the message out of the commit hash calculation',
          ], 1, 'Every tool that renders a one-line log takes the first paragraph as the subject, so a missing blank line turns your whole explanation into one enormous subject.'),
          q('Under Conventional Commits, which subject tells release tooling that the next version must be a major bump?', [
            'fix(api): drop the v1 endpoints from the router',
            'chore(api): remove the v1 endpoints and their tests',
            'feat(api): drop the v1 endpoints from the router',
            'feat(api)!: drop the v1 endpoints from the router',
          ], 3, 'The exclamation mark is the agreed marker for a breaking change, so tooling bumps the major digit; feat on its own only moves the minor digit.'),
          q('You blame a strange looking line, find the commit behind it, and the message says only \'fix\'. What has been lost?', [
            'The reason for the change, the one thing a diff can never reconstruct',
            'The list of files touched, which blame is unable to show you',
            'The author and the date, which short messages do not record',
            'The line numbers as they stood before the change was made',
          ], 0, 'The diff already shows what changed, so the only irreplaceable part of a message is why it was done and which alternatives were rejected.'),
        ]
      ),
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
        `,
        [
          q('A .gitignore contains the line node_modules/ and then the line !node_modules/keep.js. What happens to keep.js?', [
            'It is tracked, because a later negation line overrides the earlier rule',
            'It is tracked, but only until node_modules is installed again',
            'It stays ignored, because Git never descends into an excluded directory',
            'It stays ignored until you move the negation above the directory rule',
          ], 2, 'Excluding a directory stops Git walking into it at all, so no pattern inside that directory is ever consulted and the negation has nothing to act on.'),
          q('You committed .env last week. Which sequence stops Git tracking it while leaving the file on your disk?', [
            'Add .env to .gitignore, then commit that change',
            'git rm --cached .env, add .env to .gitignore, then commit',
            'git restore --staged .env, then commit the deletion',
            'git rm .env, add .env to .gitignore, then commit',
          ], 1, 'Ignore rules never apply to tracked files, so the file has to leave the index first, and --cached is what removes it from the index without deleting it from disk.'),
          q('A Node project ignores its build output and its dependencies. Which of these belongs in history rather than in .gitignore?', [
            'package-lock.json, the record of exactly which versions were installed',
            'node_modules/, which any machine can rebuild from the manifest',
            'coverage/, which the test runner regenerates on every run',
            'dist/, which the build step produces from the source files',
          ], 0, 'The lock file is the only one here that cannot be regenerated identically, and committing it is what makes every machine and every CI run install the same tree.'),
        ]
      ),
            lesson('Signing Commits So Authorship Means Something', 13, `
Nothing stops me committing as you. Two commands:

\`\`\`bash
git config user.name "Ayesha Khan"
git config user.email ayesha@acme.com
git commit -m "Relax the payment guard for partner accounts"
\`\`\`

The log now says Ayesha wrote it, and so does GitHub if that address is on her account. Author and committer are plain text fields you type. Push access proves who pushed a branch; nothing inside an ordinary commit proves who wrote it.

### Signing, in four commands

Git can sign with an SSH key, which skips the GPG keyring entirely:

\`\`\`bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
\`\`\`

Then add that same public key to GitHub a second time, choosing **Signing Key** rather than Authentication Key. This is the step almost everyone misses: the key is already on the account for pushing, so they assume it counts, and every commit stays grey and Unverified while the local log insists the signature is good.

### -s and -S are unrelated

| Flag | Adds | Proves |
|---|---|---|
| \`git commit -s\` | a \`Signed-off-by:\` trailer | nothing, anyone can type that line |
| \`git commit -S\` | a cryptographic signature | the key holder created this commit |

Lowercase is the Developer Certificate of Origin, a legal assertion used by projects such as the Linux kernel. Uppercase is cryptography. Send the wrong one to a project that wanted the other and the CI failure mentions "sign-off", which sends you to entirely the wrong documentation for twenty minutes.

### Checking the work

\`\`\`bash
$ git log --show-signature -1
commit 7f4c2d1a9b3e6f0c2d5a8b1e4f7c0a3d6b9e2f51
Good "git" signature for ayesha@acme.com with ED25519 key SHA256:9k2Qr...
\`\`\`

To verify other people's commits locally, Git needs a list of keys it should trust:

\`\`\`bash
echo 'omar@acme.com ssh-ed25519 AAAAC3NzaC1lZDI1...' >> ~/.git-allowed-signers
git config --global gpg.ssh.allowedSignersFile ~/.git-allowed-signers
\`\`\`

Without that file your own commits verify and everybody else's report an unknown key, which looks alarming and means nothing.

### What the badge actually claims

Verified means two things: the commit object carries a signature from a key registered to an account, and the author address is verified on that account. It does not mean the code is correct, reviewed, or safe. It means the name in the log is not a costume.

One surprise catches teams that turn signing on for compliance reasons. Merge a pull request with GitHub's web buttons and the commit that lands on \`main\` is created **on the server**, so it is signed with GitHub's own web-flow key rather than yours. The history shows Verified next to a signature that belongs to GitHub. If per-author attestation is the point, land those branches by pushing a fast-forward merge from a client instead.

Once every author is set up, the branch rule "Require signed commits" turns the convention into something the server enforces.

### The common mistake

Turning on \`commit.gpgsign\` globally and then meeting this on a server or a build box:

\`\`\`text
error: gpg failed to sign the data
fatal: failed to write commit object
\`\`\`

The setting travelled through your dotfiles repository; the private key did not, and it should not. Configure signing per machine, and where a repository genuinely must not sign, override it in that repository with \`git config commit.gpgsign false\`.
      `,
        [
          q('What does git commit -s actually add to a commit?', [
            'A cryptographic signature made with your SSH or GPG key',
            'A trailer naming the reviewer who approved the change',
            'A Signed-off-by trailer, which is plain text anyone can type',
            'A verified badge on GitHub once the key is registered',
          ], 2, 'Lowercase -s writes a Developer Certificate of Origin trailer and proves nothing cryptographically, while only uppercase -S attaches a real signature.'),
          q('git log --show-signature reports a good signature on your last commit, yet GitHub still shows it as Unverified. What is the likely cause?', [
            'The commit was amended after your key signed it',
            'The public key sits on your account as an authentication key, not a signing key',
            'Signatures only appear once the branch has been merged into main',
            'Your clone is shallow, so GitHub cannot see the parent commits',
          ], 1, 'GitHub checks signatures against keys registered for signing, so a key added only for pushing leaves every commit unverified even though Git verifies it locally.'),
          q('Your branch holds six commits, every one signed by you. A maintainer lands it with the squash button on GitHub. What does the resulting commit on main carry?', [
            'Six signatures, one preserved for each original commit',
            'Your signature, copied from the last commit on the branch',
            'No signature at all, because squashing always strips them',
            'One signature from GitHub, since the server created that commit',
          ], 3, 'A web merge builds a brand new commit object on GitHub\'s side and signs it with GitHub\'s own web-flow key, so your per-commit attestation does not survive the squash.'),
        ]
      ),
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
        `,
        [
          q('You run git merge --squash feature while on main, then commit. What does that commit fail to record?', [
            'The file changes, which you must then apply again by hand',
            'Any merge relationship, so Git does not consider the branch merged',
            'The commit message, because squash merges always leave it empty',
            'The conflict resolutions, which return on the next merge attempt',
          ], 1, 'A squash merge stages the combined change and you commit it as an ordinary single-parent commit, so nothing links it to the branch and Git still reports that branch as unmerged.'),
          q('Both branches have edited src/invoice.js since the merge base. Which situation actually produces a conflict?', [
            'Both sides edited the file, in functions 200 lines apart',
            'Both sides made the identical change to the same line',
            'One side edited the file and the other left it untouched',
            'Both sides changed the same lines in different ways',
          ], 3, 'Git compares each side against the merge base and can resolve automatically unless both sides altered the same region differently, which is the one case only a human can settle.'),
          q('You are standing on main and want main\'s newest commits inside your feature branch. What do you run?', [
            'git switch feature, then git merge main',
            'git merge feature, staying on main',
            'git merge main, staying on main',
            'git switch feature, then git merge --squash main',
          ], 0, 'A merge always brings the named branch into the branch you are standing on, so you switch to the receiving branch first; merging feature into main would ship unfinished work.'),
        ]
      ),
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
        `,
        [
          q('In an interactive rebase you want to keep a commit\'s changes but throw its message away, folding it into the commit above. Which keyword does that?', [
            'squash',
            'reword',
            'fixup',
            'edit',
          ], 2, 'Both squash and fixup combine a commit with the previous one, and fixup is the variant that discards this commit\'s message rather than asking you to merge the two texts.'),
          q('Why does a plain git pull clutter the history of a busy shared branch?', [
            'Each pull that finds new commits adds a merge commit recording nothing but the sync',
            'Each pull rewrites your local commits, so their hashes keep changing',
            'Each pull deletes and recreates the remote-tracking refs for that branch',
            'Each pull squashes your unpushed commits down into a single one',
          ], 0, 'Pull defaults to merging the fetched branch into yours, so every sync on a busy branch leaves behind a merge commit that says nothing about the code.'),
          q('Halfway through rebasing five commits you hit a third conflict and give up. What does git rebase --abort leave you with?', [
            'The commits that replayed cleanly, with the remaining ones dropped',
            'The branch sitting on the last commit that replayed successfully',
            'A detached HEAD holding the partially rebased work for later',
            'The branch exactly where it was before the rebase started',
          ], 3, 'Rebase builds new commits without touching the originals, so aborting just points the branch back at the commit it started from and nothing is lost.'),
        ]
      ),
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
        `,
        [
          q('What does setting merge.conflictstyle to zdiff3 add to a conflicted region?', [
            'A colour-coded view of which side changed the most lines',
            'A section showing the common ancestor, so you see what each side changed',
            'An automatic resolution whenever only one side touched the region',
            'A backup copy of the file as it stood before the merge began',
          ], 1, 'Seeing the base version turns a guess between two finished results into a comparison, because you can tell which side actually changed what.'),
          q('You have edited a conflicted file until it is correct. How do you tell Git that it is resolved?', [
            'Run git merge --resolve naming that file',
            'Save the file, since Git rechecks it on the next status',
            'Stage it with git add, which is what marks it resolved',
            'Run git checkout --ours on it to confirm your version',
          ], 2, 'There is no separate resolve command: staging the file is the signal, which is why git status keeps listing it as unmerged until you add it.'),
          q('CI fails with a syntax error and the offending file contains a line reading <<<<<<< HEAD. How did that reach the branch?', [
            'Someone resolved most files, missed one, and staged everything with git add -A',
            'Git wrote the markers into the commit because the merge was aborted',
            'A merge driver in .gitattributes committed both sides of the change',
            'The conflict was resolved on another branch and copied over from there',
          ], 0, 'Staging in bulk marks every file resolved, conflict markers included, so the one file nobody edited gets committed exactly as Git left it.'),
        ]
      ),
            lesson('Choosing a Branching Model Your Team Can Keep', 13, `
Five engineers, eleven open branches, the oldest one 34 days old. Every merge that week cost somebody an afternoon of conflict resolution, and two of them produced bugs that neither branch had on its own. Nobody was bad at Git. The branching model was wrong.

How you branch decides how often you meet the conflicts from the previous lesson. It is a throughput decision, not a matter of taste.

### The three models people actually run

| Model | Branch lifetime | Long-lived branches | Fits |
|---|---|---|---|
| Trunk based | hours to a day | \`main\` only | continuous deployment, strong tests |
| GitHub Flow | a day to a few days | \`main\` only | most web teams and services |
| GitFlow | days to weeks | \`main\`, \`develop\`, \`release/*\` | shipped software with supported versions |

GitHub Flow is the safe default: branch from \`main\`, open a pull request, merge, deploy \`main\`. Trunk based is the same shape with the dial turned up, where branches live hours and integration happens several times a day.

### Merging work that is not finished

Trunk based development sounds reckless until you see the mechanism. Unfinished paths are merged, but switched off:

\`\`\`js
// src/checkout.js
if (flags.couponCodes) {
  applyCoupon(cart, code);
}
\`\`\`

The code is on \`main\`, exercised by tests, reviewed in small pieces, and dark in production until the flag turns on. Your branch never has time to drift, so it never has time to conflict.

The cost is real: flags accumulate. A flag left in place after launch is a permanent second code path that nobody tests. Delete each one in the sprint after it ships, and keep a dated list of the live ones.

### Where GitFlow still earns its keep

If you ship versioned artefacts that customers install and you support two or three releases at once, you need somewhere for \`release/1.4\` fixes to live. That is what release branches are for:

\`\`\`bash
git switch -c release/1.4 v1.4.0
# fix, test, tag v1.4.1 on this branch
git switch main
git merge release/1.4      # forward merge, so the fix is not lost
\`\`\`

That last step is the one teams forget. A hotfix that lands on the release branch and never reaches \`main\` reappears as a bug the moment the next version ships, and the reporter will swear you already fixed it.

### Measure it before arguing about it

Two numbers settle most debates:

\`\`\`bash
# how stale is each remote branch?
git for-each-ref --sort=committerdate \\
  --format='%(committerdate:short) %(refname:short)' refs/remotes/origin

# how far has main moved since this branch left it?
git rev-list --count main..origin/feat/coupon-codes
\`\`\`

If your average branch is a week old and \`main\` gained 60 commits meanwhile, no merge strategy saves you. Cut the work smaller.

### The common mistake

Adopting GitFlow for a web application that deploys three times a day. Now \`main\` and \`develop\` hold almost the same commits, every hotfix has to be merged into both, and half the ceremony exists to synchronise two branches that were never allowed to differ. The failure is quiet: somebody merges a fix into \`main\` for the release, forgets the merge back into \`develop\`, and the next deploy silently reverts it.

Pick the simplest model your release process tolerates. If you deploy from \`main\` continuously, one long-lived branch is all you need, and every extra one is a job somebody has to remember to do.
      `,
        [
          q('A team deploys its web application three times a day and adopts GitFlow, with both main and develop. What goes wrong first?', [
            'Feature branches can no longer be reviewed before they merge',
            'Tags stop pointing at the commit that was actually deployed',
            'CI has to run twice for each commit, doubling the build minutes',
            'Every fix needs merging into both branches, and a forgotten one regresses',
          ], 3, 'Two long-lived branches meant to hold the same code have to be kept in step by hand, so one missed forward merge quietly undoes a fix at the next release.'),
          q('Trunk based development merges unfinished work into main several times a day. What keeps that safe for users?', [
            'The unfinished code sits in a directory the build step skips',
            'The new path is behind a feature flag that stays off in production',
            'CI refuses to deploy any commit that touches unfinished files',
            'The work is committed on main but deliberately never pushed',
          ], 1, 'A flag lets code be integrated, reviewed and tested while staying dark for users, which is what makes merging partial work every day reasonable rather than reckless.'),
          q('Which single measurement best predicts how much conflict pain a team is about to have?', [
            'The number of engineers pushing to the repository',
            'The size of the repository once it is fully cloned',
            'How long branches live before they are merged',
            'How many commits each branch contains when merged',
          ], 2, 'Divergence accumulates with time, so a branch of twenty commits merged the same day hurts far less than a one-commit branch merged three weeks late.'),
        ]
      ),
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
        `,
        [
          q('After git fetch origin, the command git log --oneline HEAD..origin/main prints four commits. What does that tell you?', [
            'You have four commits that the server has not seen yet',
            'Four commits will be dropped from your branch on the next pull',
            'origin/main holds four commits you do not have, and your files are untouched',
            'Four of your commits conflict with what the server already holds',
          ], 2, 'That range lists commits reachable from the remote-tracking ref but not from you, and fetching updated only that ref, so nothing in your working directory changed.'),
          q('Your push is rejected with \'Updates were rejected because the remote contains work that you do not have locally\'. What is the correct response?', [
            'Integrate their commits with git pull --rebase, then push again',
            'Push again with --force, since your branch is the newer one',
            'Delete the remote branch and push yours in its place',
            'Fetch with --prune, which clears out the stale remote refs',
          ], 0, 'The server refuses because accepting the push would drop commits it holds, so the fix is to bring those commits into your branch and then push a history containing both.'),
          q('What does the -u in git push -u origin fix/cart-rounding actually buy you?', [
            'It creates the branch on the server, which push otherwise cannot do',
            'It records the upstream, so status can report ahead and behind counts',
            'It lets future pushes to that branch skip the pre-push checks',
            'It fetches the remote branch first, which avoids a rejected push',
          ], 1, 'Pushing creates the remote branch with or without -u; the flag links the two refs so that a bare git push works and git status can compare them.'),
        ]
      ),
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
        `,
        [
          q('Reviewing a solid pull request you find one spelling mistake and nothing else. What is the right move?', [
            'Request changes, so the typo is certainly fixed before merge',
            'Push a commit to their branch fixing it while you are in there',
            'Approve silently and leave the typo for somebody else to spot',
            'Approve, and leave the typo as a comment marked as a nit',
          ], 3, 'Blocking a correct change over a typo costs the team more than the typo does, and labelling the comment as a nit tells the author it need not hold the merge.'),
          q('Why is force-pushing to your own branch in the middle of a review considered rude?', [
            'It restarts CI, using build minutes that the team pays for',
            'The reviewer loses their place and cannot see what changed since',
            'It closes the pull request, which then has to be reopened',
            'It deletes the reviewer\'s comments on the files they touched',
          ], 1, 'Rewriting commits the reviewer already read leaves them no way to see just the new work, so add follow-up commits during review and tidy the branch when it merges.'),
          q('Your team wants main to read as a list of shipped changes, each one revertable with a single command. Which merge option fits?', [
            'Squash and merge, which lands one commit for each pull request',
            'Rebase and merge, which replays every commit onto the branch tip',
            'Merge commit, which keeps each commit plus a merge commit',
            'Fast-forward only, which needs the branch to be fully up to date',
          ], 0, 'One commit per pull request keeps main readable at a glance and means git revert on that single commit removes the entire feature.'),
        ]
      ),
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
        `,
        [
          q('You tagged v1.4.0, pushed your commits, and the release job never ran. GitHub shows no tag at all. Why?', [
            'Lightweight tags cannot be pushed, only annotated ones can',
            'A tag appears only once you create a GitHub Release from it',
            'git push does not send tags, so you need git push origin v1.4.0',
            'Branch protection on main blocks tags that were created locally',
          ], 2, 'Tags are separate refs that an ordinary push ignores, so the tag lives only on your machine until you push it by name or use --follow-tags.'),
          q('Your API renames a field that client applications already read. Under semantic versioning, which digit moves?', [
            'PATCH, because no code path was added or removed',
            'MINOR, because a rename is not really a new feature',
            'Nothing needs to move, because the data itself is unchanged',
            'MAJOR, because existing callers break on the new name',
          ], 3, 'Any change that breaks working client code is a major bump whatever its size, because the version number is the promise those clients pinned against.'),
          q('Someone finds a bug in v1.4.0, fixes it, and moves the v1.4.0 tag onto the new commit. What is the damage?', [
            'The version now means two different things, depending on when you fetched',
            'The original commit is deleted, so the old release cannot be rebuilt',
            'Every clone refuses to fetch until that tag is deleted locally',
            'The release notes are regenerated and the earlier ones are lost',
          ], 0, 'Anyone who already fetched keeps the old target while fresh clones get the new one, so builds and caches disagree about what v1.4.0 contains; the fix belongs in v1.4.1.'),
        ]
      ),
            lesson('Forks and Upstream: Contributing Without Push Access', 13, `
Your first pull request to an open source project comes back with one comment: "please rebase, this has 47 commits". You wrote three of them. The other 44 belong to the maintainers, and they are in your pull request because you committed on your fork's \`main\` and then pulled from the project to catch up.

That mistake is worth understanding, because contributing to a repository you cannot push to is most of open source and most cross-team work inside a company.

### Three repositories, one you can write to

| Name | What it is | Can you push? |
|---|---|---|
| upstream | \`acme/storefront\` on GitHub, the real project | no |
| origin | \`ayesha/storefront\`, your fork on GitHub | yes |
| your clone | the copy on your laptop | yes, locally |

\`\`\`bash
$ gh repo fork acme/storefront --clone
$ git remote -v
origin    git@github.com:ayesha/storefront.git   (fetch)
upstream  https://github.com/acme/storefront.git (fetch)
\`\`\`

If you cloned before forking, add the second remote yourself with \`git remote add upstream https://github.com/acme/storefront.git\`.

### Keep your fork's main pristine

Your fork's \`main\` has exactly one job: to be an exact copy of upstream's \`main\`. Never commit to it.

\`\`\`bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
\`\`\`

\`--ff-only\` is the guard rail. If it refuses, stop and read the message: your \`main\` has commits of its own, which means you worked on it by mistake. That single habit prevents the 47-commit pull request.

### Start every branch from upstream

\`\`\`bash
git fetch upstream
git switch -c fix/pdf-margins upstream/main
# ... work, commit ...
git push -u origin fix/pdf-margins
gh pr create --repo acme/storefront --base main --head ayesha:fix/pdf-margins
\`\`\`

Branching from \`upstream/main\` rather than from your fork's copy means your work starts on today's code, even when you last synced the fork a month ago.

Leave "Allow edits by maintainers" ticked. It lets a maintainer push a small fix to your branch instead of asking you for three more rounds of review.

### Reviewing somebody else's fork branch

You cannot switch to a branch that lives in a stranger's repository, but you can fetch the pull request itself:

\`\`\`bash
gh pr checkout 412
git fetch upstream pull/412/head:pr-412 && git switch pr-412
\`\`\`

That gives you the code locally for testing, which is worth far more than reading the diff on a web page.

### The surprise that wastes an afternoon

A workflow triggered by \`pull_request\` from a fork runs **without the repository's secrets** and with a read-only token. Your patch is fine; the deploy-preview job fails because its API key resolved to an empty string. Maintainers see this constantly and know to ignore it, and first-time contributors spend hours rewriting perfectly good code chasing it.

\`\`\`yaml
# .github/workflows/preview.yml
on:
  pull_request_target:   # runs with secrets, checks out the BASE repo by default
\`\`\`

\`pull_request_target\` is how projects work around that, and it is also a well known way to leak those secrets if the workflow checks out and runs the contributor's code. If you maintain a project, read that trade off carefully before switching.

### The common mistake

Treating your fork as your work area rather than as a staging post. Commits accumulate on its \`main\`, upstream moves, you pull to catch up, and now your history contains merge commits between two copies of the same project. Fork, branch, push, open the pull request, delete the branch. Your fork's \`main\` should never have a single commit that upstream does not.
      `,
        [
          q('After git fetch upstream, the command git merge --ff-only upstream/main refuses to run on your fork\'s main. What does that tell you?', [
            'Upstream deleted commits that your fork is still holding',
            'Your main has commits of its own, so you worked on it by mistake',
            'You have to fetch again before the merge is allowed to proceed',
            'The fork is too far behind for a fast-forward to be attempted',
          ], 1, 'A fast-forward is only possible when your branch is an ancestor of the target, so a refusal means main has diverged, which on a fork means you committed to it.'),
          q('Your pull request to acme/storefront fails one CI job with an empty API key, although the same workflow passes inside your fork. Why?', [
            'Your fork is running a different workflow file from the upstream one',
            'Upstream has not yet approved a first-time contributor to run workflows',
            'Workflows triggered by a pull request from a fork run without secrets',
            'Secrets are available only on branches that branch protection covers',
          ], 2, 'A fork cannot be trusted with the base repository\'s secrets, so the value resolves to an empty string and a read-only token, which has nothing to do with your patch.'),
          q('You forked acme/storefront two months ago and have not touched it since. What is the right way to start a new fix today?', [
            'Commit on your fork\'s main, then push that branch to origin',
            'Branch from your fork\'s main, which the fork keeps current for you',
            'Clone acme/storefront directly and push a branch straight to it',
            'Fetch upstream, then create the branch from upstream/main',
          ], 3, 'A fork never updates itself, so branching from upstream/main after a fetch is what puts your work on today\'s code rather than on two-month-old code.'),
        ]
      ),
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
        `,
        [
          q('You run git restore --staged src/cart.js after staging a change. What is true immediately afterwards?', [
            'Your edits are unstaged but still on disk, ready to stage again',
            'Your edits are discarded and the file now matches HEAD',
            'A new commit is created that undoes the staged change',
            'The branch pointer moves back one commit, keeping the edits',
          ], 0, 'The --staged form only moves content out of the index, so the file on disk keeps every edit you made and simply stops being part of the next commit.'),
          q('Which loss caused by git reset --hard HEAD~1 can nothing at all recover?', [
            'The commit it moved off, once its hash drops out of the log',
            'The branch label, which is deleted along with the commit',
            'Uncommitted edits in the working tree, which Git never recorded',
            'The commit message, which is stored only inside the index',
          ], 2, 'Git can only restore what it turned into an object, and working tree edits that were never staged or committed were never objects, so --hard overwrites them permanently.'),
          q('You need one file exactly as it was three commits ago, with history and every other file left alone. Which command does that?', [
            'git reset --mixed HEAD~3',
            'git revert HEAD~3',
            'git checkout -b old-cart HEAD~3',
            'git restore --source=HEAD~3 src/cart.js',
          ], 3, 'restore works at file level and --source names the commit to read the content from, so only that one path changes and no commit or pointer moves.'),
        ]
      ),
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
        `,
        [
          q('You create a brand new file src/Coupon.js, run git stash, then switch branches. Where is that file?', [
            'Inside the stash entry, waiting for git stash pop',
            'Still on disk and untracked, because plain stash ignores untracked files',
            'Deleted, since stash cleans the working tree completely',
            'Committed to the branch you were on before switching',
          ], 1, 'Plain git stash saves tracked modifications only, so a file Git has never seen stays in the working tree and travels with you to the other branch unless you pass -u.'),
          q('Why does the -x flag matter when you cherry-pick a hotfix onto release/1.4 as well as main?', [
            'It merges the two branches so the fix exists only once',
            'It prevents a conflict when those branches are later merged',
            'The copy gets a new hash, and -x records which commit it came from',
            'It signs the new commit so reviewers can verify the author',
          ], 2, 'Cherry-pick creates a new commit rather than moving the original, so the same change now exists under two hashes and -x writes the source hash into the message to keep that duplication traceable.'),
          q('Three unpushed commits sit on main but belong on a feature branch. Which sequence moves them cleanly?', [
            'git switch -c feat/coupons, then git switch main and git reset --hard origin/main',
            'git stash, then git switch -c feat/coupons and git stash pop',
            'git revert HEAD~3..HEAD, then re-commit the work on the new branch',
            'git cherry-pick HEAD~3..HEAD on the new branch, then force-push main',
          ], 0, 'Creating a branch at your current position keeps all three commits under the new label, after which resetting main to the server position leaves main exactly as the remote has it.'),
        ]
      ),
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
        `,
        [
          q('Your reflog lists a commit a colleague needs. Can they run git reset --hard HEAD@{4} in their own clone to reach it?', [
            'Yes, the reflog travels with the branch when you push',
            'Yes, as soon as they run git fetch --all',
            'No, the reflog is local to your clone, so send the commit hash instead',
            'No, HEAD@{4} expires after the first 30 days',
          ], 2, 'The reflog records where pointers moved in one clone and is never transferred, so the same expression means something different or nothing at all on another machine.'),
          q('Which of these does the reflog never help you recover?', [
            'A commit abandoned by git reset --hard yesterday',
            'Work wiped by git restore src/cart.js that was never committed',
            'The pre-amend version of a commit you amended this morning',
            'The tip of a feature branch you deleted before merging it',
          ], 1, 'The reflog is a journal of pointer positions, so it only reaches content Git had already stored as a commit, and edits destroyed before any commit existed leave no entry.'),
          q('You dropped a stash by mistake and no reflog entry mentions it. What is the realistic next step?', [
            'Nothing, dropped stashes leave the object database immediately',
            'git stash apply stash@{0}, which restores the most recent drop',
            'git fetch origin, since stashes are also stored on the remote',
            'git fsck --lost-found --unreachable, then branch the commit you find',
          ], 3, 'The stash commit is still an unreachable object until garbage collection prunes it, and fsck lists exactly those orphans so you can inspect them and attach a label.'),
        ]
      ),
            lesson('Undoing a Merge Without Breaking the Next One', 13, `
A pull request lands on Friday, production breaks on Saturday, and you revert the merge. Everything calms down. Two weeks later the team fixes the real bug on that same branch and merges it again, and the fix does not appear on \`main\`. No error, no conflict, no warning. The files are simply not there.

That is the merge revert trap, and it costs a team a day of confusion every time it fires.

### Pick the tool by how far the merge has travelled

| Where the merge is | Command | What it leaves you |
|---|---|---|
| Still in progress, conflicts open | \`git merge --abort\` | The pre-merge index and working tree, exactly |
| Committed locally, never pushed | \`git reset --hard ORIG_HEAD\` | The branch back at its old tip, no trace |
| Already on \`origin/main\` | \`git revert -m 1 <sha>\` | A new commit undoing the merged content |

\`ORIG_HEAD\` is written by merge, rebase, reset and pull, and the next of those overwrites it. If you ran something else in between, read the position out of \`git reflog\` instead.

### Why revert refuses a merge commit

\`\`\`bash
$ git revert 8f21ac4
error: commit 8f21ac4 is a merge but no -m option was given.
fatal: revert failed
\`\`\`

Revert applies the inverse of the change a commit made. A merge commit has two parents, so "the change" is ambiguous: measured against \`main\`, or against the branch? You settle it with \`-m\` and a parent number.

\`\`\`bash
$ git log --oneline --parents -1 8f21ac4
8f21ac4 4c1d77a 7f4c2d1 Merge pull request #482 from feat/coupons
$ git revert -m 1 8f21ac4
\`\`\`

The first parent of a merge made on \`main\` is \`main\` itself, so \`-m 1\` means "keep the mainline, undo what the branch brought in". That is nearly always what you want. \`-m 2\` does the exact opposite and deletes every commit your colleagues landed while that branch was open, in one quiet commit that reviews as a routine revert.

Write a real message on it too. The default body says "This reverts commit 8f21ac4", which tells the next reader nothing about why.

### The trap

Reverting a merge undoes the content. It does not undo the ancestry. Every commit on \`feat/coupons\` is still an ancestor of \`main\`, so the merge base has already moved to the branch tip:

\`\`\`bash
$ git merge feat/coupons
Already up to date.
\`\`\`

Git compared the merge base against both tips, found nothing new on the branch side, and did nothing at all. The revert still stands, the code is still missing, and the pull request still shows as merged. Everyone stares at a green tick and an empty diff.

### Two ways out

Revert the revert, when the branch was mostly good:

\`\`\`bash
git revert 3d9e02b        # the revert commit, not the merge
git merge feat/coupons    # commits added since now land normally
\`\`\`

Or rebuild the branch, when it was small:

\`\`\`bash
git switch -c feat/coupons-v2 main
git cherry-pick 1a09e33^..7f4c2d1
\`\`\`

Cherry-picking mints fresh hashes, as the previous lesson showed, so the replayed work shares no ancestry with the reverted merge and the second merge behaves like any first merge.

Rough rule: under five commits, rebuild it. Forty commits of real work, revert the revert.

### The common mistake

Reaching for \`git revert -m 1\` on a merge that has not been pushed anywhere, because revert feels like the safe option. You now carry a merge commit and a revert commit that cancel each other out, plus permanent ancestry that will silently swallow the next attempt. Nobody outside your machine had seen any of it, and \`git reset --hard ORIG_HEAD\` would have left nothing behind.

Revert in public, reset in private. Same sentence as the first lesson of this chapter, and the merge case is where it pays for itself.
      `,
        [
          q('git revert 8f21ac4 fails with \'is a merge but no -m option was given\'. Why does Git insist on that number?', [
            'A merge commit stores two diffs and -m picks one of them',
            'A merge has two parents, so -m says which side counts as the mainline',
            'The number tells Git how many commits from the branch to undo',
            'The flag sets how many merge conflicts Git will tolerate',
          ], 1, 'Revert needs a single baseline to invert against, and a merge commit offers two parents, so you name the parent whose line of history should survive.'),
          q('Weeks after a reverted merge, feat/coupons gains a fix and is merged again. Git says \'Already up to date\'. What explains it?', [
            'The branch was deleted on the remote, so its commits went with it',
            'The revert commit conflicts with the branch and Git skipped it',
            'Those commits are already ancestors of main, so the merge base sees nothing new',
            'Merging one branch twice is refused unless you pass --allow-unrelated',
          ], 2, 'The first merge permanently made the branch part of main\'s ancestry, and reverting changed only the file content, so the second merge finds no commits it has not already integrated.'),
          q('You merged feat/coupons into main locally and have not pushed. You want main to look as though the merge never happened. Which command?', [
            'git revert -m 1 HEAD',
            'git merge --abort',
            'git reset --soft HEAD~1',
            'git reset --hard ORIG_HEAD',
          ], 3, 'ORIG_HEAD still holds the tip main had before the merge, so a hard reset to it removes both the merge commit and its merged content with nothing left behind.'),
        ]
      ),
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
        `,
        [
          q('After a fetch, git log --oneline feature..main lists four commits. What have you learned?', [
            'Your feature branch added four commits that main does not have',
            'Four commits exist on both branches under different hashes',
            'main has four commits your feature branch has not got yet',
            'Four commits will conflict when the branches are merged',
          ], 2, 'A..B lists commits reachable from B but not from A, so putting feature on the left asks what main has gained that your branch is missing.'),
          q('main is full of merge commits and you want one line per merged pull request rather than everybody\'s work in progress. Which command?', [
            'git log --oneline --first-parent main',
            'git log --oneline --no-merges main',
            'git log --oneline --graph --all',
            'git log --oneline --merges --reverse',
          ], 0, 'Following only the first parent walks the mainline itself, so each entry is one integration point instead of the branch commits that were merged in.'),
          q('git log --oneline main..feature prints nothing at all, yet the two branches are clearly at different commits. What does that tell you?', [
            'The branches share no common ancestor, so the range is undefined',
            'feature has no commits that main lacks, so main has simply moved ahead',
            'The range was consumed by a squash merge and the commits were deleted',
            'You must fetch before any range expression will resolve correctly',
          ], 1, 'An empty main..feature means everything reachable from feature is already reachable from main, which is what you see when your branch is behind rather than ahead.'),
        ]
      ),
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
        `,
        [
          q('Which commit will git log -S "roundToCents" fail to report?', [
            'The commit that first added the call to src/invoice.js',
            'One that moved the existing call a few lines up the same file',
            'The commit that deleted the last remaining call',
            'One that added a second call inside a new helper',
          ], 1, 'The pickaxe compares how many times the string occurs in a commit and in its parent, so a move that leaves the count unchanged is invisible to it and needs -G instead.'),
          q('git log -- src/invoice.js stops in March, although you know the code is two years old. What is the likely explanation?', [
            'Commits older than a year need --since to be shown',
            'The file was force-pushed away and only the reflog has it',
            'Blame was configured to ignore the earlier revisions',
            'The file was renamed in March, and the walk stops at the rename',
          ], 3, 'Git stores snapshots rather than rename operations, so a path-limited log ends where that exact path first appears unless you add --follow to turn on rename detection.'),
          q('You add the repository-wide Prettier commit hash to .git-blame-ignore-revs and set blame.ignoreRevsFile. What changes?', [
            'Blame skips that commit and credits each line to the commit that last changed it meaningfully',
            'That commit is removed from history so it can never be blamed again',
            'Blame refuses to run until every collaborator has committed the file',
            'Only GitHub honours the file, so local blame output stays the same',
          ], 0, 'Ignored revisions are stepped over during the blame walk, so the formatting sweep stops claiming authorship and the commit whose message explains the line surfaces instead.'),
        ]
      ),
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
        `,
        [
          q('Git has named the first bad commit and you want to start writing the fix. What must you run first, and why?', [
            'git bisect reset, because bisect left you on a detached HEAD at a midpoint commit',
            'git bisect log, because the session must be archived before it can be closed',
            'git stash, because bisect keeps your working tree changes in the index',
            'git switch --detach, because a fix has to start from the bad commit itself',
          ], 0, 'Bisect checks out midpoints with no branch attached, so until you reset you would be committing onto a detached HEAD rather than onto your branch.'),
          q('The test you are bisecting with fails about one run in five even on good commits. What is the risk?', [
            'Bisect will run twice as many steps to compensate for the noise',
            'Git refuses to continue once two neighbouring results disagree',
            'One false result sends the search the wrong way and it blames an innocent commit',
            'The session stops with an error and has to be replayed from the log',
          ], 2, 'Binary search trusts every answer you give it, so a single wrong good or bad discards half the range for good and the run still ends confidently on the wrong commit.'),
          q('A bisect over 800 commits ends with a run of skips and an answer of \'somewhere in these nine commits\'. What caused that?', [
            'The range was too wide for a binary search to converge',
            'The good and bad ends were given to git bisect start the wrong way round',
            'Nine of the commits could not be built or tested, so they had to be skipped',
            'The repository was cloned shallow, so those commits carry no trees',
          ], 2, 'Bisect can only narrow the range using commits that actually run, so a stretch of work in progress commits that do not build leaves an interval rather than a single culprit.'),
        ]
      ),
            lesson('Reading a Diff Without Being Fooled', 13, `
A pull request arrives showing 912 changed lines. The author says the real change is six. Both are true: somebody moved a 400-line module into \`src/billing/\`, reindented it inside a new class, and fixed a rounding bug on the way past. Read line by line, that diff costs an hour and the bug hides in plain sight. Read with three flags, it costs four minutes.

### Ask for the shape before the detail

\`\`\`bash
git diff --stat main...feature       # files, plus a bar chart of churn
git diff --shortstat main...feature  # 14 files changed, 458 insertions(+), 454 deletions(-)
git diff --numstat main...feature    # added, deleted, path: easy to sort
git diff --dirstat main...feature    # which directories absorbed the change
\`\`\`

Insertions and deletions that almost match, spread over two paths, is the signature of a move rather than of new work.

### Moved code, made visible

\`\`\`bash
git diff --color-moved=zebra --color-moved-ws=allow-indentation-change
git config --global diff.colorMoved zebra
\`\`\`

\`--color-moved\` paints a block that was deleted in one place and added in another in a different colour from genuinely new lines. The \`-ws\` option keeps that matching alive when the indentation changed, which is exactly what happens the moment relocated code lands inside a new class or \`try\` block. On that 912-line diff, 900 lines take on the moved colour and the six that matter stay the other one.

### Renames are detected by similarity, and similarity is a number

\`--stat\` prints \`src/{invoice.js => billing/invoice.js}\` when Git is confident. The default confidence threshold is 50%.

\`\`\`bash
git diff -M30% main...feature      # accept weaker matches as renames
git diff -C --find-copies-harder   # detect copied blocks, not only moved files
\`\`\`

Split one 400-line file into two 200-line files and each half is only half similar to the original, so detection fails and the diff reports a delete plus two unrelated additions. Lowering the threshold usually brings the rename back and shrinks the review to what actually changed.

### Noise filters, and what each one costs

| Flag | Hides |
|---|---|
| \`-w\` | every whitespace difference, anywhere |
| \`--ignore-space-at-eol\` | trailing whitespace only |
| \`--ignore-blank-lines\` | added or removed empty lines |
| \`-I '^\\s*//'\` | any change whose lines all match that regex |

\`-w\` is the blunt instrument. It also hides \`total*rate\` becoming \`total * rate\`, and in Python or YAML it hides edits where the indentation *is* the meaning. Reach for the narrow flags first.

### The algorithm is a choice

\`\`\`bash
git config --global diff.algorithm histogram
\`\`\`

Myers, the default, minimises the edit script. Add a function directly above an existing one and it frequently pairs your new closing brace with the old function's, so both functions appear modified. Histogram anchors on rare lines and usually draws the diff a human would have drawn. Same commit, same bytes, very different reading experience.

### Word level, for files where the line is the wrong unit

\`\`\`bash
git diff --word-diff=color README.md
git diff --word-diff-regex='[^[:space:],]+' package.json
\`\`\`

A 300-character line with one changed value is one red line and one green line in ordinary output, and your eyes have to diff it. Word diff marks the value.

### The common mistake

Judging risk by the number at the top of the pull request. A 900-line diff that is one file move plus one line of logic is safe. A 9-line diff that changes a rounding rule inside the payments loop is not. \`--stat\` measures churn, and churn is not risk. Get the shape, subtract everything that only moved, then spend the whole of your attention on what is left.
      `,
        [
          q('A pull request reports 912 changed lines, but the author insists only six lines of logic changed. Which option separates relocated code from new code?', [
            'git diff --stat, which totals the changed lines per file',
            'git diff --color-moved=zebra, which paints relocated blocks separately',
            'git diff --ignore-blank-lines, which drops the empty lines',
            'git diff --numstat piped into sort, ranking files by churn',
          ], 1, 'Color-moved matches a block deleted in one place against the same block added elsewhere and colours it differently, so the genuinely new lines stand out from the move.'),
          q('You split src/invoice.js into two files of roughly equal size. The diff shows one deletion and two unrelated additions instead of a rename. Why?', [
            'Rename detection only works when the file keeps its original name',
            'Renames must be staged with git mv or Git cannot record them',
            'Each new file is only about half similar to the original, under the 50% default',
            'Detection is disabled whenever more than one file changes in a commit',
          ], 2, 'Git infers renames from content similarity against a threshold, so halving a file drops each part below the default 50% and only a lower -M value brings the match back.'),
          q('package.json has one 300-character line where a single dependency version changed. Which view shows the change most directly?', [
            'git diff --stat, because it reports the line counts first',
            'git diff -w, because whitespace is what makes the line long',
            'git diff --dirstat, because it narrows the change to a directory',
            'git diff --word-diff=color, because it marks the changed token',
          ], 3, 'Line-based output marks the whole 300-character line as removed and re-added, while word diff highlights only the token that differs so you read one value instead of two long lines.'),
        ]
      ),
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
        `,
        [
          q('Your pre-commit hook lints the files on disk rather than passing --cached. What breaks?', [
            'The hook cannot see files that were added in this commit',
            'Linting runs twice, once for the index and once for the tree',
            'A half-finished edit you deliberately left unstaged fails the commit',
            'The hook exits zero even when the linter reports errors',
          ], 2, 'The commit is built from the index, so judging the working tree instead means work you chose not to stage is still allowed to block a commit that does not contain it.'),
          q('A twelve-second test suite is fine in pre-push but a bad idea in pre-commit. Why?', [
            'pre-commit runs many times a day, so a slow one gets disabled within a week',
            'pre-commit cannot run commands that need network access',
            'Git kills any pre-commit hook that takes longer than ten seconds',
            'pre-commit runs before the index exists, so tests have nothing to read',
          ], 0, 'Hook cost multiplies by how often it fires, and a gate people meet dozens of times a day has to stay near instant or they start passing --no-verify by habit.'),
          q('A commit-msg hook must reject subject lines over 72 characters. What does $1 give it?', [
            'The commit hash, which the hook can pass to git show',
            'The path to the file holding the message the author just wrote',
            'The message text itself, already split into subject and body',
            'The staged diff, so the hook can match the message against it',
          ], 1, 'Git writes the pending message to a temporary file and hands the hook its path, which is why the script reads it with head and can also rewrite it in place.'),
        ]
      ),
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
        `,
        [
          q('Why should a CI workflow run npm ci rather than npm install?', [
            'It runs the install step and the test step in a single process',
            'It skips devDependencies, so the job finishes noticeably sooner',
            'It writes a fresh lockfile, so CI always tests the newest versions',
            'It installs exactly what the lockfile records and fails if it is stale',
          ], 3, 'A reproducible job has to test the dependency versions your commit actually pins, and npm ci refuses to silently resolve anything the lockfile does not already name.'),
          q('A required status check is named \'test\', and a refactor renames the job to \'unit-tests\'. What happens to main?', [
            'Branch protection rejects every pull request until the name is fixed',
            'The rule waits on a check that never runs, so pull requests merge unchecked',
            'GitHub matches the new job automatically and the rule keeps working',
            'The old check keeps reporting its last known result on new commits',
          ], 1, 'Required checks are matched by name, so a renamed job leaves the branch gated on something that no longer reports and every pull request sails through green.'),
          q('Why does a CODEOWNERS entry for /.github/workflows/ matter more than most?', [
            'Without it, a pull request can quietly edit the check that is meant to gate it',
            'Workflow files are ignored by branch protection unless somebody owns them',
            'GitHub refuses to run any workflow that has no code owner assigned',
            'Ownership decides which team\'s minutes the workflow run is billed to',
          ], 0, 'The workflow definition is the rule itself, so leaving it unowned lets a change weaken or delete its own gate and still merge on a green tick.'),
        ]
      ),
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
        `,
        [
          q('git status takes eight seconds in a repository with a huge working tree but a short history. What helps most?', [
            'core.fsmonitor and core.untrackedCache, which stop Git stat-ing every path',
            'git gc --prune=now, which repacks the object database',
            'Cloning again with --depth 1 to shorten the history',
            'git maintenance start, which schedules background prefetching',
          ], 0, 'That delay comes from scanning the working tree rather than from history size, so watching the filesystem and caching untracked results attacks the actual cost.'),
          q('Why is a 40 MB design file revised weekly far worse for a repository than a 40 MB file committed once?', [
            'Git refuses to compress any object over 32 MB in size',
            'Every revision after the first is stored as a diff that must be replayed',
            'Compressed binaries barely delta, so each revision stores another 40 MB forever',
            'Large files are fetched again on every pull rather than cached locally',
          ], 2, 'Git shares identical blobs between commits but cannot pack similar compressed binaries efficiently, so twenty revisions become roughly 800 MB in every clone from now on.'),
          q('A hotfix is needed on release/1.4 while your feature work stays half-built on disk. Which tool is designed for this?', [
            'git clone the repository a second time into another directory',
            'git sparse-checkout set, then switch to release/1.4',
            'git stash -u, switch, fix, then switch back and pop',
            'git worktree add ../storefront-hotfix release/1.4',
          ], 3, 'A worktree gives a second checkout sharing one object store, so the hotfix gets its own directory and build cache while your feature branch stays exactly as you left it.'),
        ]
      ),
            lesson('Submodules: A Repository Inside Another', 13, `
CI fails with \`fatal: reference is not a tree: 9c2f81a\`. Your machine builds the same commit perfectly. Nothing is corrupted: you pushed the parent repository pointing at a submodule commit that never left your laptop, and this is the single most common way submodules bite.

### What the parent repository actually stores

Not the files. One commit id.

\`\`\`bash
$ git ls-tree HEAD vendor/design-system
160000 commit 9c2f81a3e4b7d2c1908f5a6b3c2d1e0f9a8b7c6d  vendor/design-system
\`\`\`

Mode \`100644\` is a file, \`040000\` is a directory, and \`160000\` is a **gitlink**: a pointer to a commit in a different repository. Alongside it sits a normal tracked file that says where to get it:

\`\`\`ini
[submodule "vendor/design-system"]
	path = vendor/design-system
	url = https://github.com/acme/design-system.git
	branch = main
\`\`\`

A submodule is therefore a pin, not a subscription. The parent names an exact commit, and it stays on that commit until somebody commits a new id.

### Getting the files

\`\`\`bash
git clone --recurse-submodules https://github.com/acme/storefront.git
git submodule update --init --recursive   # for a clone that forgot
\`\`\`

A plain \`git clone\` leaves \`vendor/design-system\` as an empty directory, and the build then fails with a missing module error that never mentions submodules. Half an hour of people's lives, every time.

### Changing something inside one

\`cd vendor/design-system\` and \`git status\` reports \`HEAD detached at 9c2f81a\`. That is correct behaviour: the parent pinned a commit, not a branch. The order of the next five commands is what matters.

\`\`\`bash
cd vendor/design-system
git switch main
git commit -am "Fix the focus ring on dark backgrounds"
git push                        # the submodule first, always
cd ..
git add vendor/design-system    # stages the new commit id, nothing else
git commit -m "Bump design system for the focus ring fix"
git push
\`\`\`

Reverse the two pushes and every teammate and every CI run gets a parent pointing at a commit only you have. Two config lines make that mistake impossible to repeat:

\`\`\`bash
git config --global push.recurseSubmodules check  # block the parent push if the pin is unpushed
git config --global submodule.recurse true        # pull and switch update submodules too
\`\`\`

### Moving the pin forward

\`\`\`bash
git submodule update --remote vendor/design-system   # move to the tracked branch tip
git submodule status
git diff --submodule=log
\`\`\`

Without \`submodule.recurse\`, a plain \`git pull\` in the parent changes the pin but leaves your checkout on the old commit, and \`git status\` reports the submodule as modified when you changed nothing.

### When a submodule is the wrong tool

| What you need | Reach for |
|---|---|
| Shared library code with its own versions | A published package and a lockfile |
| Two apps that always ship together | One repository with two directories |
| A vendored fork you patch locally | git subtree, or a plain copy |
| An exact commit of a separately released repo | A submodule |

Submodules pay off when the inner repository really is a separate product with its own release cycle and no package registry you can use.

### The common mistake

Approving a pull request whose entire diff is two lines:

\`\`\`text
-Subproject commit 9c2f81a3e4b7d2c1908f5a6b3c2d1e0f9a8b7c6d
+Subproject commit 4b71de0c8f2a5b9e7d3c1a0f6e4d2b8c5a9f7e3b
\`\`\`

There is nothing to read, so it gets a tick in four seconds. That hash bump can carry two hundred commits from another repository, including the breaking change that takes production down on Tuesday. Run \`git diff --submodule=log\` and review the commit list, not the pointer.
      `,
        [
          q('CI fails on your commit with \'fatal: reference is not a tree: 9c2f81a\', yet the same commit builds on your laptop. What went wrong?', [
            'The submodule URL in .gitmodules points at a private repository',
            'You pushed the parent\'s new pointer but never pushed the submodule commit',
            'The CI runner cloned without --recurse-submodules',
            'The submodule was left on a detached HEAD when you committed',
          ], 1, 'The parent stores only a commit id, so if that commit exists nowhere but your own clone then every other machine looks it up in the submodule remote and finds nothing.'),
          q('What does the parent repository store at the path vendor/design-system?', [
            'A compressed copy of the submodule\'s files at that revision',
            'A symbolic link resolved when the working tree is checked out',
            'The branch name from .gitmodules, resolved fresh on each pull',
            'A gitlink entry holding one commit id from the other repository',
          ], 3, 'The tree entry uses mode 160000 and records a single commit hash, which is why a submodule is a pin to an exact commit rather than a subscription to a branch.'),
          q('A pull request\'s whole diff is a Subproject commit line changing from one hash to another. How should you review it?', [
            'Approve it, since a pointer bump changes no code in this repository',
            'Ask for the submodule to be replaced by a package dependency first',
            'Run git diff --submodule=log and read the commits the bump pulls in',
            'Check out the branch and diff the submodule directory against main',
          ], 2, 'That single line can move the pin across hundreds of commits in another repository, and expanding it into a commit log is the only way to see what is actually landing.'),
        ]
      ),
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
      chapter(
      'Automating GitHub with Actions',
      'Workflows that do real work rather than just gate a merge: the event model, runs that stay fast, pieces you reuse across repositories, and a release that publishes itself from a tag.',
      [
      lesson('Triggers, Jobs, and the Workflow Event Model', 13, `
Your test job prints the commit it is testing, and that SHA exists in no branch anywhere. \`git log -1\` in the runner shows \`Merge 8f1c2ad into 41b90e7\`, authored by a bot you have never met. Nothing is broken. That phantom commit is the clearest window into how Actions really decides what to run and against what.

### An event, then a ref, then a workflow

GitHub does not run "your workflow file". It records an **event**, picks a ref for that event, reads \`.github/workflows/\` **as it exists on that ref**, and starts every workflow whose \`on:\` block matches.

| Event | Workflow file read from | What checkout gets by default |
|---|---|---|
| \`push\` | the commit that was pushed | that commit |
| \`pull_request\` | the head of the pull request | a throwaway merge of head into base |
| \`schedule\` | tip of the default branch | tip of the default branch |
| \`workflow_dispatch\` | the ref you pick | that ref |

Two things fall straight out of that table. Editing a workflow on a branch and pushing does test the new version, because the file is read from your commit. But a \`schedule\` trigger added on a feature branch never fires, because cron only ever reads the default branch. People lose an afternoon to the second one.

The phantom commit is the third consequence. A \`pull_request\` run tests the **merge result**, not your branch tip. Your pull request can turn red without you touching a line, because someone merged something to \`main\` that breaks against yours. That is the point. It is also why "it passes on my machine" stops being an argument.

### Filters narrow the trigger

\`\`\`yaml
on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    paths-ignore: ['docs/**', '**/*.md']
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
\`\`\`

The default \`pull_request\` types are \`opened\`, \`synchronize\` and \`reopened\`, so marking a draft as ready for review runs nothing at all unless you list \`ready_for_review\` yourself. That is why a draft pull request often sits with no checks and then floods you with them on one click.

### Jobs are separate machines

Jobs in the same workflow share no filesystem, no checkout and no installed toolchain. Each one is a fresh runner. \`needs:\` orders them, and anything that has to cross the gap goes through a declared output or an uploaded artifact:

\`\`\`yaml
jobs:
  version:
    runs-on: ubuntu-latest
    outputs:
      tag: \${{ steps.read.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: read
        run: echo "tag=$(node -p "require('./package.json').version")" >> "$GITHUB_OUTPUT"

  build:
    needs: version
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building v\${{ needs.version.outputs.tag }}"
\`\`\`

Steps inside one job do share a disk, which is why \`npm ci\` in step three is still installed in step six.

### The gotcha that blocks a merge forever

That \`paths-ignore\` above looks harmless until \`test\` is a required status check (Chapter 7). A pull request that only edits \`README.md\` never triggers the workflow, so the check never reports, and the merge button sits on "Expected: test" until somebody works out why.

The fix is not to delete the filter. Keep the trigger broad and skip the work inside the job:

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            code: ['src/**', 'package-lock.json']
      - if: steps.changes.outputs.code == 'true'
        run: npm ci && npm test
\`\`\`

The job always runs and always reports, and simply does nothing on a docs commit.

### The common mistake

Reaching for \`pull_request_target\` because a pull request from a fork has no secrets. That emptiness is deliberate: fork runs get a read only token and no secrets, so a stranger cannot lift your npm publish key by opening a pull request. \`pull_request_target\` runs the base branch's workflow with a full token, and if you then check out the fork's head you are executing a stranger's script with write access to your repository. Chapter 10 covers the safe patterns. Until then, treat it as a loaded gun with the safety off.
      `,
        [
          q('Your CI job logs a commit SHA that exists on no branch, with the message \'Merge 8f1c2ad into 41b90e7\'. What produced it?', [
            'The runner squashed your branch before checking it out',
            'actions/checkout rewrote history to make the diff smaller',
            'A pull_request run tests a temporary merge of head into base',
            'The push event checked out the base branch instead of yours',
          ], 2, 'A pull_request event builds a throwaway merge of your head into the current base and tests that, which is why the SHA belongs to no branch and why base moving can turn your run red.'),
          q('Your test workflow sets paths-ignore for docs/**, and \'test\' is a required check. A pull request edits only README.md. What happens?', [
            'The workflow never runs, so the check never reports and the merge stays blocked',
            'The workflow runs with every step skipped and reports a green tick',
            'Branch protection treats the missing check as passed and allows the merge',
            'GitHub runs the workflow anyway because the check is marked required',
          ], 0, 'A path filter suppresses the run itself rather than the work inside it, so a required check that never reports leaves the pull request waiting on a status that will never arrive.'),
          q('You add a schedule trigger to a workflow on your feature branch and nothing ever fires. Why?', [
            'Scheduled runs only fire on repositories with Actions billing enabled',
            'A schedule trigger needs a workflow_dispatch trigger alongside it',
            'Cron triggers are ignored until the workflow has run manually once',
            'Cron only reads workflows on the default branch, not on yours',
          ], 3, 'Each event decides which ref its workflow files are read from, and schedule always reads the tip of the default branch, so a cron trigger has to be merged before it can fire.'),
        ]
      ),
      lesson('Matrices, Concurrency, and Caching That Actually Hits', 14, `
Every run ends with \`Cache saved successfully\` and a size of 384 MB. Every run also spends 70 seconds installing dependencies. The cache is working perfectly and saving you nothing, and the reason is worth understanding before you add a second one.

### setup-node caches downloads, not node_modules

\`cache: npm\` tells \`actions/setup-node\` to cache \`~/.npm\`, the package download cache. \`npm ci\` still deletes \`node_modules\` and rebuilds it from scratch; it just stops fetching tarballs over the network. On a mid sized project that is 70 seconds down to about 25, not down to zero.

If you want to skip the install itself you cache \`node_modules\` yourself, and the key has to be exact, because a partial match restores a tree that does not correspond to your lockfile.

### Cache entries are immutable

This is the rule that catches everyone. A cache key is written **once**. If a later run computes the same key, it reads the existing entry and never updates it.

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-cache          # broken: frozen on the day it was first saved
\`\`\`

Add a dependency next month and that entry still holds last month's packages, so npm downloads the difference on every single run forever. The key has to change when the inputs change:

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-\${{ runner.os }}-\${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-\${{ runner.os }}-
\`\`\`

\`restore-keys\` is the prefix fallback. A miss on the exact key restores the newest entry starting \`npm-Linux-\`, you install the delta, and a fresh entry is saved under the exact key at the end of the job.

### Scope, and why your pull requests never hit

A cache written on \`feature/checkout-fix\` is visible to that branch and nothing else. A cache written on the default branch is visible to every branch in the repository. So if caching only ever happens on pull requests, every pull request starts cold. Run the same workflow on \`push: [main]\` and your branches inherit a warm cache. Repositories get 10 GB, oldest entries are evicted first, and anything untouched for 7 days disappears.

### A matrix multiplies more than jobs

\`\`\`yaml
strategy:
  fail-fast: false
  max-parallel: 4
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, windows-latest, macos-latest]
    exclude:
      - { os: macos-latest, node: 18 }
    include:
      - { os: ubuntu-latest, node: 22, coverage: true }
\`\`\`

That is 9 combinations, minus one exclusion, so 8 jobs. The bill is not 8 equal jobs, because hosted runners carry a billing multiplier:

| Runner | Multiplier | An 8 minute job costs |
|---|---|---|
| \`ubuntu-latest\` | 1x | 8 minutes |
| \`windows-latest\` | 2x | 16 minutes |
| \`macos-latest\` | 10x | 80 minutes |

One macOS entry in a matrix that runs on every pull request is how a team burns a month of minutes in a week. Lint and unit tests on Linux, the full matrix on \`main\` and on tags.

\`fail-fast\` defaults to \`true\`, which cancels every sibling the moment one fails. Cheap, and useless when you wanted to know whether the failure was Node 18 only.

### Concurrency: cancel the right things

\`\`\`yaml
concurrency:
  group: ci-\${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

Push three times in five minutes and the first two runs die immediately. On a busy repository this is the single biggest minute saver available.

Now copy it into your deploy workflow and watch it kill a production rollout halfway through, leaving half your fleet on the new build. Deploys want the opposite:

\`\`\`yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
\`\`\`

That queues instead of cancelling. Note that only one run waits: a third arrival replaces the pending one, which is usually what you want since it is newer.

### The common mistake

Caching \`dist/\` with a key built from \`hashFiles('package-lock.json')\`. Change a source file without touching the lockfile and the key is identical, so the runner restores last week's build and ships it. Caches are for things derived only from what is in the key, which in practice means dependencies derived from a lockfile. Build output moves between jobs as an artifact, never as a cache.
      `,
        [
          q('A cache step uses the fixed key \'npm-cache\' with no hash in it. Why does it stop helping after the first week?', [
            'Keys shorter than sixteen characters are rejected and silently skipped',
            'Entries are immutable, so that key never updates once it is written',
            'A key without a hash is scoped to one branch and never shared',
            'GitHub evicts fixed keys first when the repository hits its size limit',
          ], 1, 'A cache entry is written once and read forever after, so a key that does not change with the lockfile keeps restoring the dependency set from the day it was first saved.'),
          q('You copy cancel-in-progress: true from your CI workflow into the production deploy workflow. What goes wrong?', [
            'Deploys queue behind each other and the newest one waits longest',
            'The second deploy is rejected outright, so the release never lands',
            'Both deploys run at once and the older one overwrites the newer',
            'A new push kills a rollout midway, leaving the fleet half upgraded',
          ], 3, 'Cancelling a superseded test run is free, but cancelling a deploy stops it partway through, so deploy groups want cancel-in-progress set to false and allowed to queue.'),
          q('A job caches dist/ with a key built from hashFiles(\'package-lock.json\'). What breaks?', [
            'A source only change keeps the key identical, so a stale build is restored',
            'The key changes on every run, so the cache is written but never read',
            'dist/ is generated, and generated paths cannot be cached by actions/cache',
            'Restoring dist/ before checkout deletes the files the build step needs',
          ], 0, 'A cache key has to cover every input to the thing it caches, and build output depends on source files the lockfile hash knows nothing about, so the run ships last week\'s bytes.'),
        ]
      ),
      lesson('Reusable Workflows and Composite Actions', 13, `
Fourteen repositories, each with a near identical 60 line \`ci.yml\`. Node 20 reaches end of life and the bump is fourteen pull requests. Three of them get missed, and six months later somebody discovers a service still tested on a runtime nobody patches. Copy paste scales fine until the day you need to change something.

There are two ways to share workflow code, and picking the wrong one costs you a day.

| | Composite action | Reusable workflow |
|---|---|---|
| Unit of reuse | a group of steps | one or more whole jobs |
| Referenced from | \`uses:\` inside \`steps:\` | \`uses:\` at job level |
| Runner | the caller's runner | its own runner |
| Can set \`runs-on\` | no | yes |
| Can define a matrix | no | yes |
| Secrets | passed in as inputs | declared under \`secrets:\` |
| Nesting depth | 10 | 4 |

### Composite action: the steps you always run first

\`\`\`yaml
# .github/actions/setup-project/action.yml
name: Set up project
description: Node plus a cache warmed install
inputs:
  node-version:
    description: Node major version
    required: false
    default: '20'
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: npm
    - run: npm ci
      shell: bash
\`\`\`

Every \`run\` step in a composite action needs its own \`shell:\`. Leave it off and the whole action fails before a single line executes, with \`Required property is missing: shell\`. It is the most common composite action error by a wide margin, and the message does not tell you which step.

Calling it:

\`\`\`yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      node-version: '22'
  - run: npm test
\`\`\`

The local path form only works after \`checkout\`, because the action file has to be on disk before the runner can read it. A \`uses: ./...\` on line one fails with "Can't find action.yml".

### Reusable workflow: whole jobs someone else owns

Put this in a repository called \`.github\` in your organisation:

\`\`\`yaml
# acme/.github/.github/workflows/node-ci.yml
on:
  workflow_call:
    inputs:
      node-version: { type: string, default: '20' }
    secrets:
      NPM_TOKEN: { required: false }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
        with: { node-version: '\${{ inputs.node-version }}' }
      - run: npm test
\`\`\`

And call it from all fourteen repositories:

\`\`\`yaml
jobs:
  ci:
    uses: acme/.github/.github/workflows/node-ci.yml@v2
    with:
      node-version: '22'
    secrets:
      NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
\`\`\`

The doubled \`.github/.github/\` is not a typo: the repository is named \`.github\` and workflows live in its \`.github/workflows\` directory.

A job that calls a reusable workflow is **replaced** by it. Adding \`steps:\` or \`runs-on:\` alongside that \`uses:\` is a syntax error, because there is no local job left to attach them to. If you need a step before and a step after, that is a composite action, or two jobs joined with \`needs:\`.

### Choosing

Ask one question: does the shared thing need its own runner, its own \`runs-on\`, or its own matrix? If yes, it is a reusable workflow. If it is "the five steps we always do before tests", it is a composite action, and it keeps running on the caller's machine where the checkout already is.

### The common mistake

\`@main\`. A shared workflow referenced by a moving branch changes your pipeline with no commit in your repository, so a Tuesday afternoon edit in the platform repo breaks fourteen builds at once and none of the git blames point anywhere useful. Tag the shared repository, reference \`@v2\`, and let each consumer move when it suits them.

The same instinct applies to \`secrets: inherit\`. It hands the callee every secret the caller holds, which is fine inside one team and much less fine when the reference is a branch in a repository you do not control. Chapter 10 takes that further, down to pinning a full commit SHA.
      `,
        [
          q('Your composite action fails immediately with \'Required property is missing: shell\'. What is wrong?', [
            'The action was called before actions/checkout, so its file is missing',
            'Inputs were declared without a default, so the runner cannot resolve them',
            'Each run step in a composite action must declare its own shell',
            'Composite actions must set runs-on before any run step executes',
          ], 2, 'A composite action runs inside the caller\'s job rather than defining one, so it cannot inherit a default shell and every run step has to name one explicitly.'),
          q('A job has \'uses: acme/.github/.github/workflows/node-ci.yml@v2\' plus its own steps and runs-on. Why is that invalid?', [
            'Reusable workflows cannot be stored in a repository named .github',
            'The called workflow replaces the job, so there is nothing left to attach steps to',
            'runs-on has to appear before uses for the parser to accept the job',
            'A job may reference at most one workflow, and steps count as a second',
          ], 1, 'Calling a reusable workflow at job level substitutes that workflow\'s jobs for yours, so local steps and a runner declaration have no job left to belong to.'),
          q('Why is \'secrets: inherit\' on a reusable workflow referenced at @main worth a second thought?', [
            'Inherited secrets are written into the run log where anyone can read them',
            'Secrets passed this way are shared with every other job in the workflow',
            'A branch reference caches the workflow, so secret rotation never reaches it',
            'Whoever can edit that branch decides what your credentials get used for',
          ], 3, 'A moving reference means the code your secrets are handed to can change without any commit in your repository, so inherit plus a branch hands editing rights over your credentials to someone else.'),
        ]
      ),
      lesson('Release Automation: From Tag Push to Published Artifact', 14, `
The bump job worked. \`package.json\` says 1.4.0, the commit is on \`main\`, the tag \`v1.4.0\` is on GitHub, and the release workflow that watches for tags did not run. No error, no cancelled run, nothing in the Actions tab at all.

That is loop prevention, and it is the rule that costs teams the most time: **an event created using \`GITHUB_TOKEN\` does not trigger another workflow run.** Without it, a workflow that pushes a tag would trigger itself forever. With it, a bot created tag is silent. Push that same tag from your laptop and the workflow fires instantly, which is what makes the bug so confusing to reproduce.

Three ways out: do the release work in the same workflow immediately after tagging, push the tag with a GitHub App token or a personal access token instead of the default one, or trigger the release yourself with \`workflow_dispatch\`.

### The trigger

\`\`\`yaml
on:
  push:
    tags: ['v[0-9]+.[0-9]+.[0-9]+']
\`\`\`

Tag filters are glob style patterns, not regular expressions, and \`+\` means "one or more of the preceding character". The pattern has to match the whole ref, so \`v1.4.0\` matches and \`v1.4.0-rc.1\` does not, which keeps release candidates out of your production pipeline for free.

### Build in parallel, publish once

Each job is a fresh machine (topic 1), so the release job cannot see anything the build jobs wrote. Artifacts are the bridge:

\`\`\`yaml
jobs:
  build:
    strategy:
      matrix:
        target: [linux-x64, darwin-arm64, win32-x64]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npm ci
      - run: npm run build -- --target=\${{ matrix.target }}
      - uses: actions/upload-artifact@v4
        with:
          name: storefront-\${{ matrix.target }}
          path: dist/storefront-\${{ matrix.target }}.tar.gz

  release:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: artifacts
          merge-multiple: true
      - run: sha256sum artifacts/* > checksums.txt
      - env:
          GH_TOKEN: \${{ github.token }}
        run: |
          gh release create "$GITHUB_REF_NAME" \\
            artifacts/* checksums.txt \\
            --repo "$GITHUB_REPOSITORY" \\
            --generate-notes \\
            --verify-tag
\`\`\`

Details that earn their place:

- \`permissions: contents: write\` on that job only. The default token is read only on newer repositories, and \`gh release create\` fails with a 403 that reads like an authentication problem rather than a permissions one.
- \`fetch-depth: 0\` because a shallow checkout has no previous tag, so any changelog step or \`git describe --tags\` (Chapter 7) has nothing to compare against.
- \`merge-multiple: true\`, because upload names must be unique in v4, so three uploads means three artifacts to flatten back into one directory.
- \`--verify-tag\` refuses to create a release for a tag that does not exist, which turns a typo into a clean failure instead of a release attached to nothing.

### Reruns are not free

Rerun a release job that failed on its last step and it dies on the first one instead, with \`release already exists\`. Publishing is not idempotent unless you make it so:

\`\`\`bash
if gh release view "$GITHUB_REF_NAME" >/dev/null 2>&1; then
  gh release upload "$GITHUB_REF_NAME" artifacts/* --clobber
else
  gh release create "$GITHUB_REF_NAME" artifacts/* --generate-notes
fi
\`\`\`

Anything that talks to a registry needs the same treatment. \`npm publish\` on a version that already exists is a hard error, so guard it with a version check rather than letting a half finished release block every retry.

### A human in the loop

\`\`\`yaml
  publish:
    needs: release
    environment: production
    runs-on: ubuntu-latest
\`\`\`

An environment with required reviewers pauses the job until somebody approves it, and records who did. That is the cheapest approval gate in the product, and it costs no runner minutes while it waits.

### The common mistake

Building the artifact twice: once to test it, once to publish it. The bytes you tested are then not the bytes you shipped, and the difference shows up as a bug that reproduces on exactly one platform. Build once, upload, test that artifact, and publish the same file.
      `,
        [
          q('A workflow bumps the version and pushes tag v1.4.0 using GITHUB_TOKEN. The tag triggered release workflow never runs. Why?', [
            'Events created with GITHUB_TOKEN do not start new workflow runs',
            'Tag pushes only trigger workflows that also listen for push on branches',
            'The release workflow has to exist on the tag before the tag is created',
            'Lightweight tags are ignored by tag filters, which need annotated tags',
          ], 0, 'Actions blocks the default token from triggering further runs so that a workflow cannot trigger itself in a loop, which is why the same tag pushed from a laptop fires normally.'),
          q('Your release job failed uploading the last asset. You rerun it and it fails on the first step with \'release already exists\'. What is the fix?', [
            'Delete the tag and push it again so the workflow starts from clean',
            'Move the gh release create call into the build job that ran first',
            'Check whether the release exists and upload with --clobber if it does',
            'Add fetch-depth: 0 so the job can see the tag it is publishing to',
          ], 2, 'Publishing steps are not idempotent by default, so a retryable release job has to detect the release it already created and update its assets instead of creating it twice.'),
          q('The release job runs \'sha256sum dist/*\' and reports \'No such file or directory\', though the build job clearly produced dist/. Why?', [
            'needs: build only orders the jobs, it does not wait for them to finish',
            'Each job runs on its own machine, so dist/ has to arrive as an artifact',
            'Artifacts are deleted as soon as the job that uploaded them completes',
            'The release job checked out the tag, and dist/ is listed in .gitignore',
          ], 1, 'Jobs share ordering through needs but never share a filesystem, so anything built in one job reaches another only by being uploaded and then downloaded as an artifact.'),
        ]
      ),
      ],
      [
      q('Why can a pull request turn red without anyone touching the branch?', [
        'A rerun always uses the newest runner image, which can change results',
        'Required checks re-evaluate against the default branch every hour',
        'The cache is shared with main, so main\'s build output leaks into yours',
        'pull_request runs test a merge of your head into the current base',
      ], 3, 'The run tests the merge result rather than your branch tip, so a change landing on the base branch can break your pull request while your own commits stay untouched.'),
      q('A matrix adds one macos-latest entry to a workflow that runs on every pull request. What is the cost?', [
        'macOS minutes bill at ten times the Linux rate, so the spend jumps',
        'macOS runners ignore caches, so every job in the matrix starts cold',
        'fail-fast stops applying, so failed jobs keep running to completion',
        'The matrix exceeds the job limit and the whole workflow is skipped',
      ], 0, 'Hosted runners carry billing multipliers, and at ten times Linux a macOS entry on every pull request quietly dominates the bill even though it is only one job in the grid.'),
      q('You want to share three setup steps that must run on whatever runner the caller already checked out on. Which fits?', [
        'A reusable workflow called with secrets: inherit from each repository',
        'A composite action, since it runs inside the caller\'s existing job',
        'A reusable workflow, because only it can accept inputs from a caller',
        'A separate workflow triggered by workflow_dispatch from the caller',
      ], 1, 'A composite action bundles steps that execute in the calling job on the calling runner, so the checkout and installed tools already there are still available to it.'),
      q('Which pair of settings belongs on a job that publishes a GitHub release?', [
        'concurrency with cancel-in-progress: true, and fetch-depth: 1',
        'strategy.fail-fast: false, and a cache keyed on the lockfile',
        'permissions: contents: write, and an idempotent create or upload',
        'paths-ignore for docs, and secrets: inherit from the caller',
      ], 2, 'Creating a release needs write access to repository contents, and the step has to survive a rerun, so it must update an existing release rather than failing on a duplicate.'),
      ]
    ),
    chapter(
      'Rewriting History Deliberately',
      'Interactive rebase past squash, splitting and reordering commits into a branch worth reviewing, purging a file from every commit that ever held it, and rewriting a shared branch without stranding your team.',
      [
      lesson('Interactive Rebase: Reword, Reorder, Split, Drop', 13, `
Nine commits on \`checkout-fix\`, and the reviewer stops at the fourth: "this one renames a helper and fixes a rounding bug in the same commit, please separate them". You cannot amend it. Amend only ever reaches the tip. Interactive rebase reaches all nine.

### The todo list is a program you edit

\`git rebase -i main\` rewrites nothing when it starts. It writes a file and opens it in your editor:

\`\`\`text
pick 3f9a1c2 Add the tax rate lookup
pick 8b02de4 Rename formatMoney to formatCurrency
pick c17ff90 Update the checkout snapshot tests
pick 55ad3e1 Handle a missing postcode
\`\`\`

Oldest at the top, which is the reverse of \`git log\`. Treat it as a script: Git checks out \`main\` on a detached HEAD, executes one line at a time, then moves the \`checkout-fix\` label to whatever it finishes on. Change the script and you change the history that gets built.

One consequence catches everybody. Every replayed commit gets a new parent, so every commit from the first changed line downwards gets a new hash. Reword the second of nine and you rewrite eight commits, not one.

### Reordering, and the commit that quietly stops building

Moving a line is a cut and paste, and Git replays in the order it reads. The danger is not a conflict. A conflict stops and asks you. The danger is the clean apply: drag \`Update the checkout snapshot tests\` above the commit that changes the rounding, both apply without complaint, and you are left with one commit in the middle of the branch where the suite fails. Nobody notices until a \`git bisect\` (Chapter 6) lands on it months later and blames the wrong change.

### Dropping without dropping by accident

Deleting a line drops that commit, and so does writing \`drop\` in front of it. Deleting is more dangerous than it looks, because an editor that swallows a line looks exactly like a deliberate removal. Turn the check on once:

\`\`\`bash
git config --global rebase.missingCommitsCheck error
\`\`\`

The default is \`ignore\`. Set to \`error\`, a todo list that lost a line refuses to run and names the commit that went missing.

### Splitting one commit into two

\`edit\` stops the rebase after applying that commit, with HEAD on it and a clean tree. From there:

\`\`\`bash
$ git rebase -i main            # change pick to edit on 8b02de4
Stopped at 8b02de4... Rename formatMoney to formatCurrency

$ git reset HEAD^
Unstaged changes after reset:
M	src/checkout/format.js
M	src/checkout/tax.js

$ git add src/checkout/format.js
$ git commit -m "Rename formatMoney to formatCurrency"
$ git add src/checkout/tax.js
$ git commit -m "Round invoice totals to whole cents"
$ git rebase --continue
\`\`\`

\`git reset HEAD^\` is a mixed reset: the commit goes away, its changes stay in the working tree waiting to be re-staged in two pieces. The version people reach for out of muscle memory is \`git reset --hard HEAD^\`, and that deletes the work you were about to split. The reflog gets it back, but only if you notice before you continue.

If a single file carries both changes, stage it hunk by hunk with \`git add -p\` (Chapter 2) rather than whole files.

### Picking the verb

| What you want | Line to write | What follows |
|---|---|---|
| a better message | \`reword\` | the editor opens when Git reaches it |
| a different order | move the line | check that commit still builds |
| this commit gone | \`drop\` | keep \`missingCommitsCheck\` on |
| two ideas, one commit | \`edit\` | \`git reset HEAD^\`, commit twice, continue |

Stopped halfway and regretting it? \`git rebase --abort\`. Already finished and regretting it? The branch tip from before the rebase is still sitting in \`ORIG_HEAD\`, so \`git reset --hard ORIG_HEAD\` puts all nine commits back exactly as they were.
      `,
        [
          q('You run git rebase -i main on a nine commit branch and change only the second line from pick to reword. How many commits end up with new hashes?', [
            'Eight, the reworded commit and every commit replayed after it',
            'One, because only that commit\'s message text changed',
            'Two, the reworded commit and the tip of the branch',
            'Nine, because rebase replays the branch from main upwards',
          ], 0, 'Each commit names its parent, so rewriting one commit forces every commit after it to be rebuilt with a new parent and therefore a new hash.'),
          q('At an edit stop you want to split the commit into two, and you type git reset --hard HEAD^. What state does that leave you in?', [
            'The commit is gone and its changes are staged, ready to split',
            'The commit is gone but its changes sit unstaged in the tree',
            'The commit is gone and its changes are gone from the tree too',
            'The rebase aborts, because a hard reset is refused mid rebase',
          ], 2, 'A hard reset moves the branch and overwrites the working tree, so the changes you were about to divide into two commits are wiped and only the reflog can bring them back.'),
          q('Your editor mangles the todo list and one pick line never gets saved. With rebase.missingCommitsCheck left at its default, what happens?', [
            'Git refuses the todo list and names the commit that went missing',
            'Git replays the missing commit anyway and prints a warning',
            'The rebase pauses at that point and waits for you to continue',
            'The rebase runs and that commit is silently dropped from history',
          ], 3, 'The default value is ignore, which treats a vanished line as a deliberate drop, so the commit disappears without any warning at all.'),
        ]
      ),
      lesson('fixup, autosquash, and Review-Ready Branches', 13, `
A pull request that opened with three clean commits arrives at review round four carrying fourteen, six of them named "address review feedback". The reviewer cannot re-read a commit. They can only re-read the whole diff, again, and that is why round four takes longer than round one.

Fixup commits fix this without making you stop and rebase every time someone leaves a comment.

### Aiming a fix at the commit that needs it

You spot a typo in \`formatCurrency\`, introduced three commits back in \`8b02de4\`:

\`\`\`bash
$ git add src/checkout/format.js
$ git commit --fixup 8b02de4
[checkout-fix a91c703] fixup! Rename formatMoney to formatCurrency
\`\`\`

That message is machinery, not prose. \`fixup!\` plus the target's subject line is how Git pairs the two later. Keep making ordinary commits alongside these, in any order.

When the branch is ready to land:

\`\`\`bash
git rebase -i --autosquash main
\`\`\`

\`--autosquash\` writes the todo list for you, moving each \`fixup!\` line directly under its target and switching \`pick\` to \`fixup\`:

\`\`\`text
pick 8b02de4 Rename formatMoney to formatCurrency
fixup a91c703 fixup! Rename formatMoney to formatCurrency
pick c17ff90 Round invoice totals to whole cents
\`\`\`

Read that list before you save it. It is the entire safety check.

### The variants worth knowing

| Command | Content | Message |
|---|---|---|
| \`git commit --fixup 8b02de4\` | folded in | target's message kept |
| \`git commit --squash 8b02de4\` | folded in | both, opened for editing |
| \`git commit --fixup=amend:8b02de4\` | folded in | editor opens on the target |
| \`git commit --fixup=reword:8b02de4\` | nothing staged | target's message replaced |

\`--fixup=reword:\` is the one people miss. It repairs a bad commit message four commits back without touching a single file.

Two settings make the whole thing routine:

\`\`\`bash
git config --global rebase.autosquash true   # -i always autosquashes
git config --global rebase.autostash true    # stash dirty work, restore after
\`\`\`

### The gotcha: matching happens on the subject line

Git matches \`fixup! Round invoice totals\` against subject lines, not against a stored id. If two commits on the branch open with the same subject, or you reword the target before you rebase, the fixup attaches to the wrong commit or to nothing at all. Either way it applies cleanly and nothing warns you. Distinct subject lines are not a style preference here, they are what makes autosquash correct.

### Making every commit build

A branch is review ready when someone can read it commit by commit and each one stands on its own. Prove that rather than assuming it:

\`\`\`bash
git rebase -i --exec 'npm test --silent' main
\`\`\`

Git inserts that command after every line of the todo list and stops at the first commit where the suite fails, leaving you parked on it, ready to fix. On a six commit branch this costs four minutes and finds the commit that only works because a later one repairs it, which is precisely the failure that makes a \`git bisect\` useless a year from now.

### Stacked branches stop getting stranded

Rebasing a branch used to abandon every other branch label pointing into the middle of it. Since Git 2.38:

\`\`\`bash
git rebase --update-refs main
git config --global rebase.updateRefs true
\`\`\`

Every branch label inside the rebased range moves to the rewritten copy. If \`api-schema\`, \`api-handlers\` and \`api-docs\` are stacked on each other, one rebase of the bottom carries all three forward instead of leaving two of them pointing at commits nothing else references.

### Skipping the editor

Once the generated list is one you trust:

\`\`\`bash
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash main
\`\`\`

\`:\` is a shell builtin that does nothing and succeeds, so the list is accepted exactly as written. Useful in a script, and a reasonable habit only after you have read a few dozen of those lists by hand.
      `,
        [
          q('Why does git commit --fixup 8b02de4 write the message for you instead of letting you type one?', [
            'The message is a placeholder that rebase swaps for the target\'s',
            'Autosquash later matches that line against the target\'s subject',
            'Git needs a marker so that push refuses to send the commit on',
            'The prefix tells GitHub to collapse the commit in the diff view',
          ], 1, 'Autosquash finds the pair by reading the fixup! prefix and the subject line that follows it, so the generated message is what makes the pairing work.'),
          q('You commit a fixup aimed at "Round invoice totals", then reword that commit\'s subject before running rebase -i --autosquash. What happens?', [
            'The rebase refuses to start until the orphaned fixup is removed',
            'Git falls back to the stored sha, so the fixup still lands right',
            'The fixup is dropped from the todo list and a warning is printed',
            'The fixup matches nothing, so it stays a separate commit',
          ], 3, 'Matching is done on subject line text rather than on an id, so changing the target subject leaves the fixup with nothing to attach to and it is simply picked as an ordinary commit.'),
          q('What does git rebase -i --exec "npm test --silent" main tell you that running the tests on the branch tip cannot?', [
            'Whether each individual commit passes, not just the final state',
            'Whether the branch conflicts with main before you open a review',
            'Whether the suite runs slower on some commits than on others',
            'Whether any commit message breaks the project linting rules',
          ], 0, 'The command runs after every replayed commit, which is the only way to catch a commit that fails on its own and is repaired by a later one in the same branch.'),
        ]
      ),
      lesson('filter-repo: Purging a File From Every Commit', 14, `
\`git log --all --oneline -- .env\` returns two commits from fourteen months ago. \`git show 4c1d77a:.env\` prints a live Stripe secret key. Somebody deleted the file the next day, which changed nothing: the blob is still reachable from the commit that added it, in your clone, in every teammate's clone, and in all nine forks.

Rotate the key first. Chapter 2 explained why that comes before everything else. Then remove it from history properly.

### Why not filter-branch

\`git filter-branch\` ships with Git and its own manual page tells you not to use it. It forks a shell process per commit, so a 20,000 commit repository runs for hours, and its defaults leave tags, replace refs and newly empty commits in a state you then have to clean by hand. \`git filter-repo\` is what the documentation points at now.

\`\`\`bash
pip install git-filter-repo     # or: brew install git-filter-repo
\`\`\`

### The run

It expects a fresh clone and it means it. Running in your everyday clone risks pushing a half checked rewrite over the real repository.

\`\`\`bash
git clone https://github.com/acme/storefront.git storefront-rewrite
cd storefront-rewrite
git filter-repo --invert-paths --path .env --path config/stripe.yml
\`\`\`

\`--path\` selects, \`--invert-paths\` flips that selection into a removal. Every commit that ever touched those paths is rebuilt without them, every later commit is rebuilt on the new parent, and branches and tags are moved to the rewritten commits.

Four flags cover most real jobs:

| Goal | Flag |
|---|---|
| drop a path everywhere | \`--invert-paths --path .env\` |
| drop everything matching | \`--invert-paths --path-glob '*.pem'\` |
| redact a string, keep the file | \`--replace-text secrets.txt\` |
| shrink a bloated repository | \`--strip-blobs-bigger-than 10M\` |

\`secrets.txt\` holds one rule per line:

\`\`\`text
sk_live_51HQ9xLKa2mZ8P4vN==>REMOVED
regex:AKIA[0-9A-Z]{16}==>AWS_KEY_REMOVED
\`\`\`

Reach for \`--replace-text\` when the file itself must survive, for example a config file that held one credential among fifty legitimate settings.

### What it leaves behind

filter-repo deletes the \`origin\` remote on purpose, so nothing you type by reflex pushes the result before you have looked at it. It also writes a translation table:

\`\`\`bash
$ head -2 .git/filter-repo/commit-map
old                                       new
4c1d77aa93b2f0e18d5a6b3c2d1e0f9a8b7c6d55  8f3e02c1d4a97b6e2f0c8a1d3b5e7f9021c4d6a8
\`\`\`

Keep that file. Every sha in your changelog, deploy scripts, ticket comments and CI pins now names a commit that no longer exists, and the map is the only mechanical way to translate them.

Then push everything back:

\`\`\`bash
git remote add origin https://github.com/acme/storefront.git
git push --force origin --all
git push --force origin --tags
\`\`\`

### The part that surprises people

The old commits do not vanish from GitHub. A commit that was ever pushed stays reachable by its full sha through pull request refs and the fork network, so the leaked key is still fetchable from a URL after your force push lands. Closing or deleting the pull requests that reference those commits, deleting forks you control, and opening a GitHub Support ticket to purge the stale references are all part of the job, not optional tidying.

The other trap is human. A teammate back from holiday pushes out of a clone of the old history and puts \`.env\` straight back. Lock the branch for the rewrite window, tell people to delete their clone rather than pull it, and run \`git log --all -- .env\` on a brand new clone before you call it done.
      `,
        [
          q('You rewrite history with filter-repo and force push, and the key is gone from every branch. Why can it still be fetched from github.com?', [
            'Force pushed branches keep their previous tip for ninety days',
            'GitHub restores the missing objects from its own nightly backups',
            'Old commits stay reachable by sha through pull requests and forks',
            'The blob survives in the repository packfiles until gc is run',
          ], 2, 'Pull request refs and the fork network keep those commits alive on GitHub independently of your branches, so the sha URL still resolves until support purges them.'),
          q('A config file holds one API key among fifty settings the application still needs. Which filter-repo option fits the job?', [
            '--replace-text with a rule that rewrites the key to a placeholder',
            '--invert-paths --path on that file, then commit the file again',
            '--strip-blobs-bigger-than set just below the size of that file',
            '--path-glob on the file extension, run without inverting paths',
          ], 0, 'Replace-text edits the contents of every historical version of the file, which removes the credential while leaving the settings the application reads.'),
          q('git filter-repo deletes the origin remote when it finishes. What is that behaviour protecting you from?', [
            'Fetching the old history back over the rewritten commits again',
            'Pushing a rewrite you have not yet checked over the real repository',
            'Leaking rewritten objects to a mirror that holds the old ones',
            'Running the same filter twice and rewriting every sha again',
          ], 1, 'Dropping the remote makes an accidental push impossible, so you have to add origin back deliberately once you have verified the rewritten history.'),
        ]
      ),
      lesson('Rewriting a Shared Branch Without Stranding the Team', 13, `
You force pushed a rebased \`release/2.4\` at 16:40. At 16:52 a teammate ran \`git pull\`, it reported success, and the nine commits you had just squashed away were back on the remote. Nothing was corrupted and nobody did anything stupid. Their clone still held the old commits, \`pull\` merged them into their branch, and \`push\` sent the merge.

A rewrite is not finished when your push succeeds. It is finished when every clone has stopped carrying the old history.

### Lease your force push

\`\`\`bash
git push --force-with-lease origin release/2.4
\`\`\`

\`--force\` says "make the remote look like me". \`--force-with-lease\` says "make the remote look like me, but only if it still points where I last saw it". Git compares the remote's current tip against your \`refs/remotes/origin/release/2.4\` and refuses if anyone pushed in between. On a shared branch that difference is your entire safety margin.

### Where the lease leaks

Here is the counter intuitive part. The lease trusts your remote-tracking ref, and plenty of things move that ref without you reading a single commit: an editor that fetches in the background, a shell prompt that runs \`git fetch\` on a timer, a build script that fetches before it starts.

The sequence is quiet. Their commit lands on the remote, your background fetch updates \`origin/release/2.4\`, your lease now matches, and your force push destroys work you never saw.

\`\`\`bash
git push --force-with-lease --force-if-includes origin release/2.4
\`\`\`

\`--force-if-includes\` (Git 2.30 and later) adds the condition that was missing: the commits currently on the remote must appear in your local branch's reflog, meaning you genuinely had them before you rewrote. Type the pair together every time.

### Telling the team exactly what to run

The advice they will follow if you say nothing is "just pull", and after a rewrite \`git pull\` merges the old history back. That is the 16:52 incident.

Someone with no local work of their own:

\`\`\`bash
git fetch origin
git reset --hard origin/release/2.4
\`\`\`

Someone carrying three commits on top of the old branch needs those commits moved, not merged:

\`\`\`bash
git fetch origin
git rebase --onto origin/release/2.4 origin/release/2.4@{1}
\`\`\`

\`origin/release/2.4@{1}\` reads the remote-tracking reflog: where that ref pointed before the fetch, which is the old base their work sits on. Rebase replays everything after that base onto the new tip and skips any commit whose patch already exists upstream. No shas to look up, no guessing.

### The protocol around the rewrite

| Step | Why it is there |
|---|---|
| announce a window, then freeze | one push mid rewrite recreates the old history |
| unlock branch protection briefly | force push is blocked by default, correctly |
| rewrite, then verify on a fresh clone | your own clone can hide leftovers |
| post the exact recovery commands | people paste, they do not improvise |
| re-lock protection immediately | the window is the risk, so close it |

Two more things worth knowing. An open pull request based on the rewritten branch shows every commit as new, so warn reviewers before they open a 400 file diff. And if the rewrite makes you resolve the same conflict again and again, switch on \`git config --global rerere.enabled true\` before you start: Git records each resolution and replays it automatically the next time that exact conflict appears.

Never move a tag that has already been published. Someone's deploy pins \`v2.4.0\`, and repointing it changes what that build produces without changing its name, which is the hardest class of bug to be told about. Cut \`v2.4.1\` instead.
      `,
        [
          q('Your editor fetches in the background every minute. Why can git push --force-with-lease still destroy a teammate\'s push?', [
            'The lease expires after a few minutes and then acts like --force',
            'Background fetches move your local branch to match the remote tip',
            'The lease checks only the branch tip, not the commits underneath',
            'The fetch updates the tracking ref, so the lease matches work you never read',
          ], 3, 'The lease compares the remote against your remote-tracking ref, and a background fetch quietly makes them agree, which is exactly what --force-if-includes was added to catch.'),
          q('A teammate has three unpushed commits on top of release/2.4, which you have just rewritten. Which command moves their work onto the new history?', [
            'git pull origin release/2.4 and resolve the merge it produces',
            'git rebase --onto origin/release/2.4 origin/release/2.4@{1}',
            'git reset --hard origin/release/2.4, then redo the work by hand',
            'git cherry-pick the old branch tip onto the rewritten branch',
          ], 1, 'The reflog entry names the base their commits were built on, so rebase can replay only their three commits onto the rewritten tip instead of merging the old history back.'),
          q('Why should a published tag be replaced with a new version rather than moved onto the rewritten commit?', [
            'Git refuses to push a tag whose name already exists on the remote',
            'Moving a tag destroys the annotated tag object it pointed at',
            'Clones that already hold it keep the old tag, so builds diverge',
            'A moved tag invalidates the signature on every commit it covers',
          ], 2, 'A tag already fetched is never updated by a plain fetch, so half the team builds the old commit and half builds the new one under one version name.'),
        ]
      ),
      ],
      [
      q('A rewrite changes one commit near the start of a 200 commit branch. What is true of the 199 commits after it?', [
        'They are rebuilt with new hashes, since each one names its parent',
        'They keep their hashes, since only the edited commit changed',
        'They are rebuilt only if they touch the files the edit touched',
        'They are folded into a single squashed commit at the branch tip',
      ], 0, 'A commit id covers its parent, so changing any commit forces every descendant to be rebuilt, which is why a rewrite is always a whole branch event.'),
      q('You must remove a 300 MB video from every commit and also fix the subject of a commit three back on your feature branch. Which pairing is right?', [
        'filter-repo for both, since it rewrites messages and blobs alike',
        'rebase -i for both, since it can drop a file from an older commit',
        'filter-repo for the message, rebase -i for the oversized video',
        'filter-repo for the video, commit --fixup=reword for the message',
      ], 3, 'Filter-repo is built for stripping content out of every commit that held it, while a message four commits back is a local branch tidy that autosquash handles in seconds.'),
      q('A colleague asks why a release branch rewrite needs an announced freeze window at all. Which answer is right?', [
        'Git locks the object database during a rewrite, so pushes fail anyway',
        'Any push from a clone of the old history restores what you removed',
        'Branch protection cannot be re-enabled while a rewrite is running',
        'The remote rejects fetches while its refs are being force updated',
      ], 1, 'Every teammate still holds the old commits, so one ordinary push during the window puts the whole history you deleted straight back on the remote.'),
      q('You are on a branch of six commits, none of them pushed, and want to split the third into two. What gets you there?', [
        'git revert the third commit, then commit the two halves separately',
        'git reset --soft HEAD~3, then rebuild all six commits by hand',
        'rebase -i, mark that commit edit, git reset HEAD^, then commit twice',
        'git commit --squash on the third commit, then rebase --autosquash',
      ], 2, 'Only an edit stop puts you on that commit with its changes recoverable into the working tree, which is what lets you commit the two halves separately and continue.'),
      ]
    ),
    chapter(
      'Access, Secrets, and Supply Chain',
      'Who can push what, how credentials leak through a repository, and keeping the actions and dependencies you already trust from becoming the way in.',
      [
      lesson('Credentials That Fit the Job: Keys, Tokens, and Apps', 13, `
A contractor joins for a six week integration, gets a classic personal access token with the \`repo\` scope so their script can open pull requests, then leaves. Two years later that token still sits in a CI variable somewhere, and it still reads every private repository in every organisation that person belongs to. Not the one repo they were hired for. All of them.

Classic tokens are scoped to verbs, not to repositories. That single design decision sits behind most credential incidents you will ever clean up.

### Five credentials, and the column that matters

| Credential | Acts as | Scope you can set | Lifetime |
|---|---|---|---|
| SSH key | A human, per device | Everything that human can reach | Until revoked |
| Deploy key | Nobody, one repository | One repo, read or read-write | Until revoked |
| Classic PAT | A human, in every org | Verb scopes like \`repo\` | Often none set |
| Fine-grained PAT | A human, one org | Named repos, per permission | 366 days maximum |
| App installation token | The app itself | Named repos, per permission | 60 minutes |

Read the right hand column first. Lifetime decides what a leak actually costs you, and it is the one property an attacker cannot widen after the fact.

### Keys on laptops, deploy keys on machines

An SSH key identifies a device, so give every device its own and name it honestly:

\`\`\`bash
ssh-keygen -t ed25519 -C "ayesha@work-mbp" -f ~/.ssh/id_github_work
\`\`\`

A build box that only needs to clone one repository should never hold a human's key. Generate a deploy key, add it to that one repository, and leave the write box unticked:

\`\`\`bash
ssh-keygen -t ed25519 -C "deploy@invoicing-prod" -f ~/.ssh/invoicing_deploy
# Settings > Deploy keys > Add key, paste invoicing_deploy.pub, no write access
\`\`\`

A read only key for a single repository is a credential whose theft is an inconvenience rather than an incident.

### Tokens: fine-grained, expiring, stored somewhere real

A fine-grained token names its repositories and its permissions one at a time: \`Contents: Read\` and \`Pull requests: Write\` on \`acme/invoicing\`, nothing else. Organisation owners can require approval before one is issued, which is the closest thing GitHub offers to code review for credentials.

Where the token lands matters as much as what it can do. On Linux the \`store\` credential helper writes tokens as plain text into \`~/.git-credentials\`, which is then swept up by every backup job and laptop imaging script you own:

\`\`\`bash
git config --global credential.helper osxkeychain   # macOS keychain
git config --global credential.helper libsecret     # Linux keyring
gh auth status                                      # what am I holding, and with which scopes
\`\`\`

### Unattended work wants an App

A GitHub App is not a person. It holds a private key, signs a short JWT, and trades that for an installation token:

\`\`\`bash
curl -s -X POST \\
  -H "Authorization: Bearer $APP_JWT" \\
  -H "Accept: application/vnd.github+json" \\
  https://api.github.com/app/installations/49281733/access_tokens
# {"token":"ghs_...","expires_at":"2026-03-04T15:07:12Z"}
\`\`\`

Sixty minutes of life, only the repositories the organisation installed it on, and a rate limit that scales with installation size instead of the 5,000 requests per hour a single user gets. A stolen \`ghs_\` token is a stolen hour.

### The common mistake

Building automation on a human's token. It carries that human's blast radius, it dies the day they rotate or leave, and the audit log prints their name against every action the bot ever took, which turns an incident timeline into fiction. If a script runs with nobody watching, it wants an App. Where an App is genuinely too much machinery, a dedicated machine account with a fine-grained token is the floor, seat cost included.

Audit yours today: open your token list, sort by last used, and revoke anything whose job you cannot describe in one sentence.
      `,
        [
          q('A nightly script runs under a classic personal access token with the repo scope, created by an engineer who has since moved to another team. What is the realistic blast radius if that token leaks?', [
            'Only the one repository the nightly script reads and writes',
            'Every private repository that engineer can reach, in all their orgs',
            'Nothing, because tokens stop working when someone changes team',
            'Read access everywhere, but writes only in the repo it was made for',
          ], 1, 'Classic scopes grant a verb across everything the human account can already reach, so the token inherits that person\'s whole membership rather than the narrow job the script does.'),
          q('Why is a GitHub App installation token a better fit than a personal token for a deploy bot?', [
            'It never expires, so the bot survives the maintainer leaving the org',
            'It is stored encrypted, so a stolen copy cannot be replayed at all',
            'It grants organisation owner rights, which the deploy step needs anyway',
            'It expires in an hour and reaches only the repos the app is installed on',
          ], 3, 'An installation token is short lived and bound to the app installation rather than a person, so a theft is worth about an hour and the automation does not break when an engineer leaves.'),
          q('A build server needs to clone one private repository and nothing else. Which credential fits the job?', [
            'A read only deploy key added to that single repository',
            'The team lead\'s SSH key, copied onto the build server',
            'A classic token with repo scope, rotated every quarter',
            'A fine-grained token covering every repo in the org',
          ], 0, 'A deploy key carries no human identity and reaches exactly one repository, so losing it costs read access to that repo alone rather than to a person\'s whole account.'),
        ]
      ),
      lesson('Least Privilege in CI: Scoped Tokens and OIDC', 13, `
Open a repository created before 2023 and look at what \`GITHUB_TOKEN\` can do by default: write to contents, packages, deployments, issues and pull requests. Every step of every job holds it, including the third party action three levels down that nobody on your team has read. One hostile step is enough to publish a package, cut a release, or edit an issue thread under your organisation's name.

Two lines close most of that.

### Deny by default, grant per job

\`\`\`yaml
name: CI
on: [pull_request, push]

permissions:
  contents: read          # every other permission becomes none

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test

  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write     # only this job can push a package
      id-token: write
    runs-on: ubuntu-latest
    steps:
      - run: npm publish
\`\`\`

The part that catches people: declaring any \`permissions\` key sets every key you did not name to \`none\`, not to its previous default. That is why one \`contents: read\` at the top is such a cheap win, and why a job that comments on a pull request has to ask for \`pull-requests: write\` out loud.

### Swap the stored key for a minted identity

A static \`AWS_SECRET_ACCESS_KEY\` in repository secrets has no expiry, no audience, and no link to the run that used it. If it appears in a log, you find out from your bill. OIDC replaces it with a token the runner requests at the moment it needs one:

\`\`\`yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::402913887214:role/invoicing-deploy
          aws-region: eu-west-1
\`\`\`

Nothing secret is stored anywhere. GitHub signs a JWT describing the run, AWS checks that signature against a published key set, and hands back a session that dies in an hour.

### The trust policy is the whole control

Here is the broken version, copied from blog posts more often than anyone admits:

\`\`\`json
"Condition": {
  "StringLike": {
    "token.actions.githubusercontent.com:sub": "repo:acme/*"
  }
}
\`\`\`

Any repository in the organisation can now assume the production deploy role. Any branch of it. Including the scratch repo an intern creates on their first afternoon.

The fixed version pins both the audience and the exact subject:

\`\`\`json
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:acme/invoicing:environment:production"
  }
}
\`\`\`

Pair that with required reviewers on the \`production\` environment and minting a production credential now costs a human click, recorded with a name against it.

### Forks get nothing, and that is deliberate

A \`pull_request\` run from a fork receives a read only token and no secrets at all. \`pull_request_target\` is the escape hatch: it runs in the base repository's context, with the secrets, while the pull request's code sits one \`git checkout\` away. Fetch that head and run its build script and you have handed your deploy credentials to a stranger who filed a friendly looking typo fix.

If you need labels or comments on fork pull requests, do that work in a separate workflow triggered by \`workflow_run\`, and never check out untrusted code in a job that holds anything worth taking.

### The common mistake

Granting \`id-token: write\` at the workflow level because one job needed it. Every job in the file can then mint a cloud credential, lint included, and lint is the job that installs forty transitive packages from a registry you do not control. Grant it to the job that deploys, and to nothing else.
      `,
        [
          q('A workflow declares a permissions block containing only contents: read. A job in it then tries to post a review comment on the pull request. What happens?', [
            'It succeeds, because pull request write is on by default',
            'It succeeds, because top level keys apply only to the first job',
            'It fails, because naming any permission sets the rest to none',
            'It fails, but only where the repository has branch protection on',
          ], 2, 'Declaring a permissions block replaces the defaults wholesale, so anything you did not list is set to none and the job has to request pull-requests: write explicitly.'),
          q('An IAM trust policy matches the OIDC subject claim with StringLike on repo:acme/*. Why is that dangerous?', [
            'Any repository in the org, including a brand new one, can assume the role',
            'StringLike is unsupported here, so the whole condition is ignored',
            'It forces the session to last twelve hours instead of one hour',
            'It excludes the main branch, which is the only branch that deploys',
          ], 0, 'The subject claim is the only thing tying a session to a specific workflow, so a wildcard across the organisation lets any repo anyone creates there mint production credentials.'),
          q('Why is checking out the fork\'s head inside a pull_request_target workflow risky?', [
            'The fork\'s code cannot be fetched unless a deploy key is present',
            'The run is billed to the fork owner rather than to the base repo',
            'GitHub cancels the run as soon as an external head is fetched',
            'That code then runs in a context holding the base repo secrets',
          ], 3, 'pull_request_target runs with the base repository\'s secrets and a writable token, so executing a contributor\'s code inside that job hands those secrets to whoever opened the pull request.'),
        ]
      ),
      lesson('Secret Scanning, Push Protection, and Rotating First', 13, `
Push at 14:02. First unauthorised API call at 14:03. Bots read GitHub's public events firehose continuously, and a live cloud key in a public repository is typically exercised within minutes of landing there.

The reflex almost everyone has is to delete the file, amend the commit, and force push. It feels like fixing it. It revokes nothing.

### Why cleaning history first is the wrong order

Three reasons, and each one is enough on its own:

- The commit stays reachable by its hash on GitHub after your force push, and in every fork, until Support purges the cached view.
- Whoever cloned or scraped during the exposure window already holds the value, and a rewrite cannot reach into their disk.
- The rewrite itself is a \`git filter-repo\` job (Chapter 9) that costs the whole team a re-clone, which is a lot of disruption to buy zero security.

| Step | Do this | Why it sits here |
|---|---|---|
| 1 | Revoke or disable the credential at the provider | The only action that stops an attacker |
| 2 | Issue a replacement and update the consumers | Restores service on a value nobody else has |
| 3 | Read the provider audit log for the exposure window | Separates a near miss from a breach |
| 4 | Purge from history, then ask Support to clear caches | Housekeeping, and only now |

Step 3 is the one people skip. CloudTrail, \`gh api /orgs/acme/audit-log\`, or your provider's equivalent answers the only question your manager will ask: did anything actually use it.

### Push protection stops it at the server

Secret scanning matches known provider formats. Push protection turns a match into a rejected push, so the leak never reaches the default branch:

\`\`\`text
remote: GITHUB PUSH PROTECTION
remote: Push cannot contain secrets
remote:   Amazon AWS Access Key ID
remote:   commit 9c41f0e, path config/deploy.rb:14
remote: To push anyway, follow the bypass link and give a reason.
\`\`\`

The bypass exists, requires a written reason, and lands in the audit log with a name attached. Custom patterns cover your own token formats, which is where a surprising share of real leaks live:

\`\`\`text
name:    Acme live API key
pattern: acme_live_[0-9a-f]{32}
\`\`\`

### A clean scan proves less than you think

Partner patterns match things that look like keys. A base64 blob holding a Google service account JSON, a private key renamed \`config.txt\`, a Postgres URL with the password inline: those routinely sail through. Add a local gate on top, using the hook mechanics from Chapter 7:

\`\`\`bash
# .githooks/pre-commit
gitleaks protect --staged --redact || exit 1
\`\`\`

Fast, runs on the index rather than your working tree, and catches the paste before it becomes history. To work out when something entered history in the first place, the pickaxe from Chapter 6 beats reading commits by hand:

\`\`\`bash
git log -S 'AKIA' --oneline --all
\`\`\`

### Stop needing the secret on disk

Scanning is a net under the trapeze, not the act itself. A repository that never holds a credential cannot leak one:

\`\`\`bash
op run --env-file=.env.template -- npm run dev     # 1Password injects at run time
aws sso login --profile invoicing-dev              # short lived, no key on disk
\`\`\`

### The common mistake

Rotating the key and stopping there because the repository is private. Private is not secret. Every fork, every contractor's laptop, every stale CI cache, and every future decision to open source that code carries the commit forward. Rotate first, always. Then decide with clear eyes whether the history purge is worth what it costs your team.
      `,
        [
          q('An AWS access key was pushed to a public repository nine minutes ago. What is the first thing to do?', [
            'Force push a rewritten history with that commit removed',
            'Open a support ticket to purge the cached commit view',
            'Run filter-repo over the repo and tell the team to re-clone',
            'Deactivate the key at the provider so it stops working now',
          ], 3, 'Only revocation stops an attacker who already holds the value, because history rewriting removes your copy of the string while leaving the credential itself perfectly valid.'),
          q('After a leak, why does removing the commit and force pushing fail to close the exposure?', [
            'Force pushes are silently rejected on repositories that have scanning on',
            'The commit stays reachable by hash and in forks, and copies exist already',
            'The rewrite keeps the original blob inside the new commit\'s tree object',
            'GitHub replays any removed commit back into the default branch overnight',
          ], 1, 'Unreachable commits stay fetchable by their hash until caches are purged, forks keep their own copies, and anyone who cloned or scraped in the meantime kept the value regardless.'),
          q('Secret scanning reports nothing on a repository holding a base64 encoded service account JSON. Why?', [
            'Scanning skips any file larger than one kilobyte by default',
            'Encoded content is decoded and matched, so this is a false negative',
            'Partner patterns match known key shapes, which encoding hides',
            'Scanning reads only the default branch tip, never older commits',
          ], 2, 'Detection works by matching recognisable provider formats, so wrapping a credential in base64 or a house format removes the shape the scanner is looking for.'),
        ]
      ),
      lesson('Pinned Actions, Dependency Review, and Build Provenance', 13, `
In March 2025 an attacker with write access to the \`tj-actions/changed-files\` repository retagged every version tag, v1 through v45, to point at a commit that dumped the runner's memory into the workflow log. Roughly 23,000 repositories used that action. On the public ones, the secrets in those logs were readable by anybody who opened the run.

Every workflow that referenced the action by commit hash was untouched.

### A tag is a pointer, and pointers move

\`uses: actions/checkout@v4\` is resolved when the job starts, every single time. A tag is a ref, and a ref is one line in a file that its owner can rewrite whenever they like. A commit hash names content, so it cannot be repointed at all.

\`\`\`yaml
steps:
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  - uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af # v4.1.0
    with:
      node-version: 20
\`\`\`

Four ways to name the same action, and only one of them holds still:

| Reference | Resolves to | Can move under you |
|---|---|---|
| \`@v4\` | Whatever the v4 tag points at today | Yes, silently |
| \`@v4.2.2\` | Whatever that exact tag points at today | Yes, tags are rewritable |
| \`@main\` | The branch tip at job start | Yes, on every push |
| \`@11bd7190...\` | One commit, forever | No |

Pinning is ugly, and it is the highest value habit on this page. Dependabot reads pinned hashes, bumps them, and rewrites the trailing comment for you, so the standing cost is one extra pull request a month rather than a permanent manual chore.

Back that with an organisation policy: Settings, then Actions, then allow only actions by verified creators plus an explicit allowlist. It turns "any action on the internet" into a list a human approved.

### Dependency review reads the diff, not the world

\`\`\`yaml
- uses: actions/dependency-review-action@3b139cfc5fae8b618d3eae3675e383bb1769c019 # v4.5.0
  with:
    fail-on-severity: high
    deny-licenses: AGPL-3.0, GPL-3.0
\`\`\`

It compares the manifests and lockfiles the pull request changes, then fails the check and comments on what the change introduces. That framing is the point. A repository wide scan reports 900 findings nobody triages; a review that says "this pull request adds \`left-pad@1.0.0\`, which carries a high severity advisory" gets acted on before merge.

### Provenance: a receipt for the bytes

Pinning protects your build inputs. Attestation protects your build outputs:

\`\`\`yaml
permissions:
  id-token: write
  attestations: write
  contents: read

steps:
  - run: npm pack
  - uses: actions/attest-build-provenance@v2
    with:
      subject-path: invoicing-2.4.0.tgz
\`\`\`

The runner signs a statement binding the artifact's digest to the workflow, the commit and the repository that produced it, using the same OIDC identity described in the previous topic. Verify before you deploy:

\`\`\`bash
gh attestation verify invoicing-2.4.0.tgz --repo acme/invoicing
# Loaded digest sha256:8f0c9a... signed by GitHub Actions
# Predicate type: https://slsa.dev/provenance/v1
\`\`\`

For packages, \`npm publish --provenance\` publishes the same evidence next to the tarball on the registry.

What it proves: these exact bytes came out of that workflow, at that commit, in that repository. What it does not prove: that the code is any good. It moves you from trusting a maintainer's account password to verifying a build.

### The common mistake

Generating attestations and never verifying them. If nothing in the deploy path runs \`gh attestation verify\`, or a policy engine checking the same digest, you have produced a receipt nobody reads while the cluster still pulls whatever the registry hands it. Put the verify step in the consuming pipeline, and make it fail closed.

The second mistake is pinning your own workflows carefully and forgetting the reusable workflows and composite actions they call. Those pull their own dependencies, at their own tags, in your context. Pin all the way down, or the chain has one soft link and an attacker only needs one.
      `,
        [
          q('A popular action\'s maintainer account is compromised and every version tag is repointed at a malicious commit. Which workflows are unaffected?', [
            'Those referencing the action by full commit hash',
            'Those referencing a major tag such as v3 only',
            'Those running exclusively on self hosted runners',
            'Those that set permissions to contents: read',
          ], 0, 'A commit hash names immutable content, so retagging cannot change what it resolves to, while any tag or branch reference is looked up fresh at the start of every run.'),
          q('What does the dependency review action give you that a repository wide vulnerability scan does not?', [
            'It rewrites the lockfile to the nearest safe version',
            'It proves the build artifact came from this repository',
            'It reports only what this pull request adds or changes',
            'It blocks every merge until all old findings are cleared',
          ], 2, 'Reviewing the manifest diff keeps the output down to the handful of packages a change actually introduces, which is small enough that reviewers read it and act before merge.'),
          q('Your release workflow generates a build provenance attestation, and the deploy job pulls the artifact from the registry without checking it. What have you gained?', [
            'Nothing, since attestations require a paid plan to be created',
            'Very little, as an unverified attestation blocks no bad artifact',
            'Full protection, since the registry rejects unattested uploads',
            'Protection from tag moves, which attestations catch at pull time',
          ], 1, 'An attestation is evidence rather than enforcement, so unless something in the consuming path verifies the digest and fails closed, the deploy still accepts whatever the registry hands it.'),
        ]
      ),
      ],
      [
      q('Which pairing gives an unattended deploy pipeline the smallest standing credential footprint?', [
        'A classic token with repo scope plus branch protection on main',
        'A machine user\'s SSH key plus a static cloud access key pair',
        'A fine-grained token with no expiry plus secret scanning on',
        'A GitHub App token plus OIDC federation into the cloud role',
      ], 3, 'Both halves of that pairing are minted per run and expire on their own, so no long lived value sits in repository secrets waiting for someone to walk off with it.'),
      q('A workflow file contains a deploy job that assumes a cloud role and a lint job that installs packages. Where should id-token: write be declared?', [
        'On the deploy job alone, so no other job can mint one',
        'At the workflow level, so both jobs inherit it cleanly',
        'In repository settings, since jobs cannot request claims',
        'On the lint job too, because checkout needs that claim',
      ], 0, 'Permissions are settable per job for exactly this reason, and a lint job pulling dozens of transitive packages has no business holding the ability to assume a production role.'),
      q('Which sequence handles a leaked third party API token correctly?', [
        'Purge history, force push, rotate, then read the audit log',
        'Rotate, purge history, force push, then tell the provider',
        'Revoke, replace, read the audit log, then clean history',
        'Read the audit log, purge history, revoke, then replace',
      ], 2, 'Revocation is the only step that stops an attacker, replacement restores service, the audit log tells you whether damage was done, and history cleanup changes none of those three.'),
      q('Which change does most to reduce the risk that a third party action steals your secrets?', [
        'Setting fail-on-severity to high in dependency review',
        'Pinning every action to a hash and cutting job permissions',
        'Publishing build provenance attestations for each release',
        'Moving repository secrets into an environment with reviewers',
      ], 1, 'Pinning removes the retag path that supply chain attacks travel down, and a job holding nothing beyond contents: read has little worth taking even if a step does run hostile code.'),
      ]
    ),
    chapter(
      'Restructuring and Migration',
      'Splitting one repository into two, joining several into a monorepo, retiring submodules in favour of subtrees, and moving years of history to a new host without losing blame.',
      [
      lesson('Splitting a Repository and Keeping Its History', 13, `
\`acme/platform\` carries 4,200 commits, and one directory inside it, \`services/billing\`, now belongs to a different team. The ninety second version of the split is to copy that directory somewhere new, run \`git init\`, and commit "Initial import". Do that and \`git blame services/billing/tax.py\` names one author, one date, one commit, for code eleven people wrote over three years. \`git log -S vat_rate\` finds nothing. \`git bisect\` has a single commit to search.

Keeping the history costs about ten minutes.

### filter-repo as a path selector

Chapter 9 used \`git filter-repo\` to erase a file from every commit. Run with \`--path\` it does the opposite: it keeps only the paths you name and throws the rest of the repository away.

\`\`\`bash
git clone https://github.com/acme/platform.git billing-extract
cd billing-extract

git filter-repo \\
  --path services/billing \\
  --path .github/workflows/billing.yml \\
  --path-rename services/billing/:
\`\`\`

The bare \`:\` in \`--path-rename\` renames the prefix to nothing, so \`services/billing/tax.py\` becomes \`tax.py\` in every commit that ever held it, all the way back to the first.

Three results catch people out.

**Most of the commits vanish.** 4,200 go in, 380 come out. A commit that touched nothing under the kept paths has an empty diff once the filter runs, and filter-repo prunes empty commits by default. The 380 survivors are exactly the commits that touched billing.

**Every hash changes.** Rewriting the root commit's tree changes its id, which changes its child's parent field, and the cascade runs to the tip. Commit ids sitting in old tickets and chat threads now point at nothing.

**\`origin\` is gone.** filter-repo deletes the remote deliberately, so that a reflexive \`git push --force\` cannot drop the rewrite on top of the repository you extracted from.

### Sending it to its new home

\`\`\`bash
git remote add origin https://github.com/acme/billing.git
git push -u origin --all
git push origin --tags
\`\`\`

Tags come through the rewrite untouched, which is usually wrong: \`v3.9.0\` of the platform means nothing in a billing repository that starts at version zero. Rename them during the filter with \`--tag-rename '':'platform-'\`, or leave them behind.

### Check before you push

\`\`\`bash
git log --oneline | wc -l           # 380, not 4,200
git ls-files | head                 # paths start at the root now
git log --follow tax.py | tail -4
\`\`\`

That last command is the one that matters. If \`--follow\` walks past the extraction and on into the original history, the rename landed in every commit and blame will read correctly.

### The version with nothing to install

\`\`\`bash
git subtree split --prefix services/billing --branch billing-only
\`\`\`

| | \`filter-repo\` | \`subtree split\` |
|---|---|---|
| Extra install | yes | no, ships with Git |
| 4,200 commits | seconds | many minutes |
| Several paths at once | yes | one prefix only |
| Moves files to the root | yes | always |

\`subtree split\` is fine for one directory on a short history. Past a few thousand commits it crawls, and it cannot carry \`.github/workflows/billing.yml\` alongside \`services/billing\`.

### The mistake that bites a month later

Finishing the extract and leaving \`services/billing\` sitting in the monolith. Both copies build, both take commits, and for three weeks nobody notices the tax table was fixed in only one of them. Removing the directory from the source is an ordinary commit, not a rewrite:

\`\`\`bash
git rm -r services/billing
git commit -m "Move billing to acme/billing"
\`\`\`

Announce a freeze before you start. Open pull requests against \`services/billing\` cannot follow the split, because their commits have different hashes on the other side and the branch they targeted no longer contains the directory. Merge them or close them first, then extract, then delete.
      `,
        [
          q('You split services/billing out with git filter-repo --path, and 4,200 commits come out the other side as 380. Where did the rest go?', [
            'filter-repo keeps only commits that carry a tag or a merge',
            'The clone was shallow, so most commits were never present',
            'Commits touching nothing under the kept path went empty and were pruned',
            'filter-repo squashes each day of history down to one commit',
          ], 2, 'The filter rewrites every commit to hold only the kept paths, so a commit that never touched billing ends up with the same tree as its parent, and filter-repo drops empty commits by default.'),
          q('git filter-repo deletes the origin remote once the split finishes. What is that protecting you from?', [
            'Force pushing the rewritten history over the repo you extracted from',
            'Fetching new commits that would undo the path filter you just ran',
            'Leaking the original remote URL inside the rewritten commit messages',
            'Pushing tags that still use the old project\'s numbering scheme',
          ], 0, 'Every commit has a new hash after the rewrite, so one reflexive push force onto the source would replace the whole monolith\'s history with a billing only history.'),
          q('You extract services/billing into its own repository and leave the directory sitting in the monolith. What goes wrong?', [
            'The monolith\'s build breaks because the path is now tracked twice',
            'Both copies keep taking commits and quietly drift out of sync',
            'The new repository cannot be cloned until the old path is removed',
            'git blame in the new repository starts reporting the wrong authors',
          ], 1, 'Nothing links the two copies after the split, so a fix landed in one of them is simply absent from the other until somebody notices weeks later.'),
        ]
      ),
      lesson('Joining Repositories Into a Monorepo', 13, `
Renaming one field on a shared error type takes three pull requests, two package publishes and a forty minute wait between them, because \`web\`, \`api\` and \`worker\` live in three repositories. At that point merging them stops being a philosophy argument and becomes a build time decision.

### The obvious merge, and why it fails

Git will merge two histories that share no ancestor at all:

\`\`\`bash
git remote add api ../api
git fetch api
git merge --allow-unrelated-histories api/main
\`\`\`

The flag is required because Git refuses an ancestorless merge by default, on the reasonable theory that you mistyped a branch name. Add it and you get this:

\`\`\`text
CONFLICT (add/add): Merge conflict in README.md
CONFLICT (add/add): Merge conflict in .gitignore
CONFLICT (add/add): Merge conflict in package.json
\`\`\`

Both histories put files at the repository root, so every root file collides with its counterpart. You could resolve nine of those by hand. What you cannot fix is that \`api/src/server.js\` and \`web/src/server.js\` now both want to be \`src/server.js\`, in every commit that ever touched either one.

### Move each history into its own directory first

Rewrite each source repository so its files have always lived where they are going:

\`\`\`bash
git clone https://github.com/acme/api.git api-tmp
cd api-tmp
git filter-repo --to-subdirectory-filter services/api \\
                --tag-rename '':'api-'
\`\`\`

Every commit in that history now reads \`services/api/src/server.js\`, including the first one. Then assemble:

\`\`\`bash
git init acme-platform && cd acme-platform
git commit --allow-empty -m "Root commit"

for r in api web worker; do
  git remote add $r ../$r-tmp
  git fetch $r
  git merge --allow-unrelated-histories -m "Merge $r" $r/main
done
\`\`\`

Zero conflicts, because no two histories ever name the same path. \`git log --follow services/api/src/server.js\` walks back through every commit the api repository made to that file, and \`git blame\` names the right people on the right lines.

### What still goes wrong

| Problem | What you see | Fix |
|---|---|---|
| Tags collide | \`v1.2.0\` exists three times | \`--tag-rename\` per source |
| Default branches differ | \`master\` here, \`main\` there | fetch each ref by its real name |
| Log looks shuffled | three teams interleaved by date | \`git log --first-parent\` |
| Clone is huge | the sum of three object stores | \`--filter=blob:none\` (Chapter 7) |

That last row is the cost nobody budgets for. The merged repository holds every object all three repositories ever created, permanently, including objects for files you delete the following week. Three 400 MB repositories make a 1.2 GB clone, and no amount of later tidying shrinks it.

### Teach CI the new shape

A monorepo running the old workflows fires every suite for a README typo:

\`\`\`yaml
on:
  pull_request:
    paths:
      - 'services/api/**'
      - 'packages/shared/**'
      - '.github/workflows/api.yml'
\`\`\`

List the shared packages the service actually depends on, and the workflow file itself. Miss that last line and a change to the pipeline never runs the pipeline.

### The common mistake

Treating the merge as the finish line. The morning after, \`main\` is one branch that three teams push to, so review load, \`CODEOWNERS\` and the required checks all have to change with it, and the branch protection you tuned for one team is now the bottleneck for twelve people. Branches still open in the old repositories are stranded too: their base commits do not exist anywhere in the new history under the new paths. Cut over in a quiet week, and archive every source repository read only the same hour.
      `,
        [
          q('You merge api/main into the web repository with --allow-unrelated-histories and get add/add conflicts on README.md, .gitignore and package.json. What is the underlying problem?', [
            'The two repositories used different default branch names',
            'Git cannot merge histories that have no commit in common',
            'The api repository carries tags the web repository already uses',
            'Both histories place files at the root, so every root path collides',
          ], 3, 'A merge combines trees by path, and two repositories that each keep server.js and README.md at the top level are claiming the same paths, which is why each history has to be moved into its own directory first.'),
          q('What does git filter-repo --to-subdirectory-filter services/api actually change?', [
            'It moves the files on disk and records the move as one commit',
            'It rewrites every commit so the files were always under that path',
            'It creates a branch containing only the commits under that path',
            'It sets a default prefix that all future commits are written to',
          ], 1, 'The rewrite touches the whole history rather than the tip, so git log and git blame on services/api/src/server.js reach back through every commit the original repository ever made.'),
          q('Three repositories that each tagged v1.2.0 are merged into one monorepo. What happens to those tags if you do nothing?', [
            'They collide, and one release\'s tag is all that survives',
            'Git refuses the merge until the duplicate tags are deleted',
            'Each tag is kept and automatically prefixed with its source',
            'The tags are dropped entirely because their commits moved',
          ], 0, 'Tag names live in one flat namespace per repository, so three tags called v1.2.0 cannot coexist, which is why each source gets its own prefix with --tag-rename during the rewrite.'),
        ]
      ),
      lesson('Vendoring with Subtree Instead of Submodules', 13, `
A new contractor clones the repository, runs the build, and gets \`Cannot find module '../../vendor/design-system'\`. The directory is there. It is empty. That is a submodule (Chapter 7) doing exactly what it was designed to do, and it is why plenty of teams reach for \`git subtree\` instead.

A subtree commits the upstream files into your own history at a prefix. No pointer, no second fetch step, no \`.gitmodules\`. A plain \`git clone\` of your repository is complete and buildable.

### Adding one

\`\`\`bash
git subtree add --prefix vendor/design-system \\
  https://github.com/acme/design-system.git v2.4.0 --squash
\`\`\`

\`--squash\` collapses upstream's history into a single commit, so you carry a copy of its current files rather than its entire object store. Omit it on a 90 MB upstream and you have just added 90 MB to every clone your team will ever make.

Read the commit it produced:

\`\`\`text
Squashed 'vendor/design-system/' content from commit 8f31c02

git-subtree-dir: vendor/design-system
git-subtree-split: 8f31c02b7d4a9e1f6c05d38b2a7e94f1c6d0b3a8
\`\`\`

Those two trailers are the entire bookkeeping system. \`git subtree pull\` reads them to work out where you last synced from, then applies only what changed since.

### Updating

\`\`\`bash
git subtree pull --prefix vendor/design-system \\
  https://github.com/acme/design-system.git v2.5.0 --squash
\`\`\`

Two rules keep this working. The working tree must be clean, and \`--squash\` has to be used every single time if it was used once. Mix the two modes and the next pull re-applies upstream's whole tree as a conflict.

### Sending a patch back

\`\`\`bash
git subtree push --prefix vendor/design-system \\
  git@github.com:acme/design-system.git patch/button-focus
\`\`\`

That replays your prefix commits onto a branch in upstream, ready for a pull request over there. It walks your entire history hunting for commits that touched the prefix, so on a big repository it is slow enough that you run it once and keep the branch.

### The trailer is fragile, and that is the real gotcha

If your team squash merges pull requests into \`main\`, the \`git-subtree-split\` trailer disappears into a rewritten subject line. The next \`subtree pull\` then finds no record of the last sync, treats upstream as brand new, and hands you a conflict in every vendored file. Land subtree updates with a real merge commit, or push them straight to \`main\`.

The other annoyance is quieter: the upstream URL is stored nowhere. A submodule commits \`.gitmodules\`; a subtree commits nothing at all. Record it yourself.

\`\`\`bash
git remote add design-system https://github.com/acme/design-system.git
\`\`\`

Remotes are local to a clone, so put that line in your setup script or a \`make vendor-sync\` target as well, or the next person guesses.

### Retiring a submodule in favour of a subtree

\`\`\`bash
git submodule deinit -f vendor/design-system
git rm -f vendor/design-system
rm -rf .git/modules/vendor/design-system
git commit -m "Replace design-system submodule with a subtree"
git subtree add --prefix vendor/design-system \\
  https://github.com/acme/design-system.git v2.4.0 --squash
\`\`\`

All four steps matter. Skip the \`.git/modules\` removal and the \`subtree add\` fails on a stale directory that nothing in the error message explains.

### Choosing

| Situation | Use |
|---|---|
| A library published to npm or PyPI | the package manager |
| A fork you patch locally and sync twice a year | subtree |
| An exact commit of a repo with its own release train | submodule |
| Patches you must send back upstream regularly | subtree, then \`git subtree push\` |

Subtree buys clones that just work and a tree everyone can grep. It charges you bytes in every clone forever, plus a merge history that reads oddly for anyone who has not seen the trailers. Neither tool beats a real package registry when one is available.
      `,
        [
          q('Your team squash merges every pull request into main, including the ones that update a subtree. What breaks?', [
            'The vendored files get committed without their upstream contents',
            'git subtree push starts rejecting the prefix as unknown to Git',
            'The git-subtree-split trailer is lost, so the next pull conflicts everywhere',
            'The prefix directory turns into an empty pointer, like a submodule',
          ], 2, 'Subtree keeps its only record of the last sync point in that commit message trailer, so a squash that rewrites the message leaves the next pull nothing to diff against and it re-applies the entire upstream tree.'),
          q('You add a 90 MB upstream repository as a subtree and forget --squash. What does that cost you?', [
            'Every future subtree pull has to re-download the upstream tags',
            'The prefix directory stays checked out empty until the first pull',
            'Upstream commits become unreachable and get collected by gc',
            'Upstream\'s whole object store lands in every clone your team makes',
          ], 3, 'Without --squash the subtree merges upstream\'s actual history, so those objects live in your repository permanently and every clone anyone ever makes pays for them.'),
          q('Compared with a submodule, what does a subtree give a contractor who runs a plain git clone?', [
            'A smaller clone, because the vendored files are fetched lazily',
            'A complete, buildable tree with the vendored files already in it',
            'An automatic update to the newest upstream release on checkout',
            'A .gitmodules file recording where the vendored code came from',
          ], 1, 'The vendored files are ordinary blobs inside your own commits, so there is no second fetch step to forget and no empty directory waiting to break the build.'),
        ]
      ),
      lesson('Changing Hosts: Mirrors, Imports, and the Cutover', 14, `
The migration ran clean. \`git clone\` worked, the build passed, everyone moved on. Three days later a release engineer asked where \`v2.8.3\` had gone, and the answer was that it never left the old server, along with 213 other branches and every LFS object in the repository.

\`git clone\` followed by \`git push\` moves one branch. That is all it has ever done.

### Mirror, not clone

\`\`\`bash
git clone --mirror https://git.internal.acme/platform.git
cd platform.git
git remote set-url --push origin git@github.com:acme/platform.git
git push --mirror
\`\`\`

\`--mirror\` makes a bare repository whose fetch refspec is \`+refs/*:refs/*\`, so it holds every ref the source has: branches, tags, notes, everything under \`refs/\`. The push then sends all of them.

Two sharp edges come with the word "every".

**A mirror push deletes.** Refs on the destination that are absent from the source are removed. Mirror pushing into a repository that already has commits in it destroys them, with no prompt and no undo on the far side. Push into an empty repository, always.

**Mirroring from GitHub drags \`refs/pull/*\` along.** Those refs are read only on the far side, so the push fails partway through with \`deny updating a hidden ref\`. Clear them before you push:

\`\`\`bash
git for-each-ref --format='delete %(refname)' 'refs/pull' \\
  | git update-ref --stdin
\`\`\`

### Check the size before you spend forty minutes on it

GitHub rejects any single file over 100 MB, and the rejection arrives at the end of the push rather than the start.

\`\`\`bash
git cat-file --batch-all-objects \\
  --batch-check='%(objectsize) %(objectname)' \\
  | sort -nr | head -3
\`\`\`

If the top line is a 340 MB training video committed in 2019, this move needs a history rewrite (Chapter 9) or Git LFS before it needs a new host.

### What a mirror does not carry

| Thing | Moved by a mirror push | How it actually moves |
|---|---|---|
| Commits, branches, tags, notes | yes | the mirror push |
| LFS objects | no | \`git lfs fetch --all\`, then \`git lfs push --all\` |
| Issues, pull requests, reviews | no | the GitHub Importer, or the API |
| Wiki | no | its own repository, \`platform.wiki.git\` |
| Release notes and attached files | tags only | the releases API |
| Branch protection, webhooks, secrets | no | recreate by hand, or in Terraform |

The LFS row is the one that ships broken. A mirror push copies the pointer files happily, so the migration looks finished until the first person clones and hits \`smudge filter lfs failed\` on checkout.

### The cutover

1. Dry run into a scratch repository and time it. A 3.1 GB history with 8,900 commits takes minutes, not seconds, and you want that number before you announce a window.
2. Freeze the source: archive it, or strip write access. A migration still taking pushes is a migration you run twice.
3. Final mirror push, then the LFS transfer.
4. Compare \`git ls-remote <old> | wc -l\` with the same count against the new host. The numbers match or you are not finished.
5. Everyone runs \`git remote set-url origin <new>\`. Nobody needs to re-clone, and telling them to invites a day of lost stashes.
6. Repoint CI, deploy keys, webhooks, and every script with the old URL hardcoded in it.

Leave the old repository readable and archived for a quarter. Something always still references it: a runbook, a dashboard link, a \`go.mod\` line, a Dockerfile fetching a tarball from a path that no longer resolves.
      `,
        [
          q('Why should git push --mirror only ever target a completely empty repository?', [
            'It deletes destination refs that the source does not have',
            'It refuses to run against a repository that already has commits',
            'It rewrites commit hashes to match the destination\'s history',
            'It can only create new branches, never update existing ones',
          ], 0, 'A mirror push makes the destination match the source exactly, so any branch or tag that exists only on the destination is removed rather than left alone.'),
          q('A repository moves hosts with a clean mirror push, then the first developer to clone hits smudge filter lfs failed. What was missed?', [
            'The .gitattributes file was excluded by the mirror refspec',
            'The destination host has LFS disabled for the organisation',
            'LFS blobs are not refs, so the mirror push never moved them',
            'The tags carrying the LFS pointers were rejected on push',
          ], 2, 'A mirror push moves refs and Git objects, while LFS content sits in a separate store that has to be copied with git lfs fetch --all followed by git lfs push --all.'),
          q('Which of these actually survives a git push --mirror to a brand new host?', [
            'The branch protection rules on the default branch',
            'The review comments left on merged pull requests',
            'The binary files attached to each published release',
            'Every tag and note under refs, exactly as stored',
          ], 3, 'The mirror refspec covers everything under refs, so commits, branches, tags and notes all move, while anything held in the host\'s own database stays behind.'),
        ]
      ),
      ],
      [
      q('You need services/billing out of a 4,200 commit monolith with blame and bisect intact. What is the first move?', [
        'Copy the directory into a new repository and commit it once',
        'Clone, then run git filter-repo with --path and --path-rename',
        'Create an orphan branch holding only the billing directory',
        'Push a shallow clone of the monolith to the new remote',
      ], 1, 'Filtering a fresh clone by path keeps every commit that ever touched billing with its real author and date, which is exactly what blame, bisect and log -S need to work.'),
      q('Two repositories are being merged into a monorepo. What has to happen before the merge so paths do not collide?', [
        'Every tag in both repositories has to be deleted first',
        'Both repositories must be squashed down to one commit',
        'The two histories need a shared root commit created',
        'Each history is rewritten into its own subdirectory',
      ], 3, 'Moving each repository\'s files under a distinct prefix in every commit means no two histories ever claim the same path, so the unrelated histories merge without a single conflict.'),
      q('You maintain a patched fork of a design system and there is no package registry available. Subtree or submodule?', [
        'Subtree, since the patched files live in your own commits',
        'Submodule, since the fork keeps its own release train',
        'Submodule, since local patches belong in the pinned commit',
        'Subtree, but only once the fork is published to npm',
      ], 0, 'A fork you edit yourself is easiest as a subtree, because your patches are ordinary commits in your repository and nobody has to keep a second checkout in sync.'),
      q('The mirror push finished and the ref counts match on both hosts. What still has to be migrated separately?', [
        'Every commit hash, rewritten so the new host recognises them',
        'The object store, rebuilt by re-cloning on every machine',
        'LFS objects, issues, protection rules and webhooks',
        'The tags, since a mirror push only ever sends branches',
      ], 2, 'Git refs are the only thing a mirror push carries, so LFS content and everything the host stores outside the repository itself has to be moved by other means.'),
      ]
    ),
    chapter(
      'Plumbing, Forensics, and Rescue',
      'The object layer underneath the commands you know, used to read a repository\'s true state, work out what really happened to a branch, and bring back work everyone else has written off.',
      [
      lesson('Plumbing: hash-object, cat-file, and update-ref', 14, `
Five commands, no \`git add\` and no \`git commit\`, and a real commit lands on \`main\`:

\`\`\`bash
$ git hash-object -w tax.js
b7ed298f3922af9fd15dbdfbd9c5a8dc9a121a58
$ git update-index --add --cacheinfo 100644,b7ed298f3922af9fd15dbdfbd9c5a8dc9a121a58,tax.js
$ git write-tree
9ef04ca9230b2d14c8ca73dc16d90d251e1b0fff
$ echo "Add the VAT rate constant" | git commit-tree 9ef04ca
58f465cb2f8558e966645f668fb0bae5d254c76e
$ git update-ref refs/heads/main 58f465c
\`\`\`

\`git log --oneline\` now prints \`58f465c Add the VAT rate constant\`. That is all \`git commit\` is: those steps, plus hooks, plus an editor, plus friendly error messages.

### Porcelain and plumbing

Git ships two command sets. **Porcelain** is what you type: \`add\`, \`commit\`, \`merge\`, \`status\`. **Plumbing** is what porcelain calls: \`hash-object\`, \`cat-file\`, \`write-tree\`, \`update-ref\`, \`rev-list\`. The split is a promise. Porcelain output is tuned for humans, gets translated, gains colour, and changes between releases. Plumbing output is a stable contract for scripts.

So a deploy script that greps \`git status\` is a bug waiting for a locale change. One that asks \`git rev-parse HEAD\` or \`git diff --name-only --diff-filter=ACM\` keeps working for a decade.

### The hash is not the hash of your file

\`\`\`bash
$ shasum tax.js
2a5682c68214708e70b49ff5412b3065ae74062f  tax.js
$ git hash-object tax.js
b7ed298f3922af9fd15dbdfbd9c5a8dc9a121a58
\`\`\`

Two different values for the same 30 bytes, which costs people an afternoon roughly once per career. Git hashes a header first: the type, a space, the byte length, then a NUL, then the content.

\`\`\`bash
$ { printf 'blob 30\\0'; cat tax.js; } | shasum
b7ed298f3922af9fd15dbdfbd9c5a8dc9a121a58  -
\`\`\`

Now they match. Note also that the blob holds only bytes. The path \`tax.js\` and the mode \`100644\` live in the tree, which is why moving a file changes no blob at all.

### Reading any object

| Flag | Answers |
|---|---|
| \`git cat-file -t <id>\` | What type is this: blob, tree, commit or tag |
| \`git cat-file -s <id>\` | How many bytes of content |
| \`git cat-file -p <id>\` | Print it in a readable form |

For thousands of objects, forking a process each time is the slow part. Feed them all to one:

\`\`\`bash
$ printf 'b7ed298\\nHEAD\\n' | git cat-file --batch-check
b7ed298f3922af9fd15dbdfbd9c5a8dc9a121a58 blob 30
c0571f052aa762fa3d477b6fc113f4383ec58c6d commit 231
\`\`\`

One process, one pass. The largest-blob pipeline from Chapter 7 is that flag doing the actual work.

### update-ref earns its name

A ref is a file with a hash in it, so it is tempting to write one with \`echo\`. Do not.

\`\`\`bash
git update-ref refs/heads/main 58f465c c0571f0   # move it, but only if it is still c0571f0
git update-ref -d refs/heads/scratch
git update-ref --stdin <<'EOF'
update refs/heads/release/2.1 58f465cb2f8558e966645f668fb0bae5d254c76e
delete refs/heads/scratch
EOF
\`\`\`

Three things you get for free. The optional old value is a compare and swap, so a concurrent fetch cannot be silently clobbered. Every update appends a reflog line, which is what makes the recovery in Chapter 5 possible at all. And \`--stdin\` applies the whole batch as one transaction: either every ref moves or none does.

### The common mistake

Writing a hash into \`.git/refs/heads/main\` with a shell redirect. No reflog entry, so the previous position is gone forever. No compare and swap, so you overwrite whatever arrived in the last second. And the mirror image of that mistake, deleting \`.git/refs/heads/staging\` by hand, does not delete the branch at all: if a packed copy exists in \`.git/packed-refs\`, removing the loose file simply uncovers the older packed value, and the branch reappears pointing somewhere you did not choose.
      `,
        [
          q('shasum tax.js and git hash-object tax.js print different values for the same 30 byte file. Why?', [
            'Git hashes a type and byte length header plus a NUL before the content',
            'Git compresses the file with zlib first and hashes the compressed bytes',
            'Git folds the path and the file mode into the hash along with content',
            'shasum reads the file as text while Git always reads it as raw bytes',
          ], 0, 'Git prefixes every object with its type, a space, the content length and a NUL byte before hashing, so reproducing the id by hand means hashing \'blob 30\' plus a NUL plus the file.'),
          q('Why should a deploy script call git rev-parse and git cat-file --batch-check rather than parse git log or git status output?', [
            'Plumbing commands run faster because they never open the pager',
            'Porcelain commands refuse to run when no terminal is attached',
            'Only plumbing commands can read objects stored inside a packfile',
            'Porcelain output is written for humans and changes between releases',
          ], 3, 'Porcelain formatting is free to change with new versions, colour settings and translations, while plumbing output is a stable contract that scripts can rely on for years.'),
          q('What does git update-ref refs/heads/main 58f465c c0571f0 give you that writing the hash into .git/refs/heads/main does not?', [
            'It rewrites the commit so that its parent matches the new position',
            'It appends a reflog entry and refuses if main has moved off c0571f0',
            'It rewrites packed-refs so the packed copy of main matches the new id',
            'It verifies that the new commit is a descendant of the old commit',
          ], 1, 'The optional old value makes the update a compare and swap that fails rather than clobbering a concurrent change, and the reflog line it writes is what later recovery depends on.'),
        ]
      ),
      lesson('Refs, Packfiles, and What gc Really Deletes', 14, `
Forty seven branches in \`git branch -a\`, and this on disk:

\`\`\`bash
$ find .git/refs -type f
$ head -3 .git/packed-refs
# pack-refs with: peeled fully-peeled sorted
26a93876955f0dd2116a64171fece4dacad28a2a refs/heads/drafts
26a93876955f0dd2116a64171fece4dacad28a2a refs/heads/main
\`\`\`

Nothing under \`refs/\`. Every branch lives in one sorted text file, because \`git gc\` ran \`git pack-refs\` and swept the loose files away. Thousands of tiny files become one, and ref lookup goes from a directory scan to a binary search.

### Loose beats packed

A ref can exist in both places at once. The loose file wins, always. That single rule explains a whole family of confusions: a branch you thought you deleted comes back, a branch you moved snaps to an old commit, a tag resolves differently in two clones. \`git update-ref\` and \`git branch -d\` understand both stores. Hand editing understands neither. When two answers disagree, \`git show-ref release/2.1\` prints what Git actually resolved, and \`git for-each-ref refs/heads\` walks both stores in one pass.

### Inside a packfile

\`\`\`bash
$ git count-objects -vH        # before gc
count: 12
size: 48.00 KiB
in-pack: 0
$ git gc -q && git count-objects -vH
count: 0
in-pack: 12
size-pack: 2.36 KiB
\`\`\`

Forty eight kilobytes of loose objects became 2.36 KiB packed. A packfile is a stream of objects plus an \`.idx\` file mapping object id to byte offset, and objects that resemble each other are stored as deltas against a chosen base.

\`\`\`bash
$ git verify-pack -v .git/objects/pack/*.idx | head -4
c0571f0 commit 231 157 12
b0e2dae commit 231 158 169
58f465c commit 190 133 327
a0ebe9c blob    44  49 460
\`\`\`

Columns: size, packed size, offset. Here is the counter-intuitive part. Git does not delta a file against its own previous version in history. It sorts candidates by type, path and size, slides a window over them, and picks whichever base compresses best. The base is very often the **newer** object, because a full copy of the current version plus instructions for reconstructing older ones is the cheaper arrangement. Delta direction and history direction are unrelated. This is also why repacking a repository can shrink it dramatically without deleting a single object: a better window simply finds better bases.

### What gc actually deletes

Less than you think.

| Setting | Default | Governs |
|---|---|---|
| \`gc.reflogExpire\` | 90 days | Reflog entries still reachable |
| \`gc.reflogExpireUnreachable\` | 30 days | Reflog entries for orphaned commits |
| \`gc.pruneExpire\` | 2 weeks | Loose unreachable objects |

Reachability is not just branches and tags. It includes the reflog, the index, \`ORIG_HEAD\`, stashes and worktree HEADs. Watch what that means:

\`\`\`bash
$ git reset --hard HEAD~1      # 26a9387 is now unreachable from any branch
$ git gc --prune=now
$ git cat-file -t 26a9387
commit
\`\`\`

Still there, after an explicit \`--prune=now\`. The reflog names it, so it counts as reachable. To genuinely destroy it you have to remove the thing that is holding it:

\`\`\`bash
$ git reflog expire --expire-unreachable=now --expire=now --all
$ git gc --prune=now
$ git cat-file -t 26a9387
fatal: git cat-file: could not get object info
\`\`\`

### The common mistake

"I removed the API key commit, ran \`git gc --prune=now\`, we are fine." Three problems. Your own reflog was still holding it, as above. Every teammate's clone has its own copy and its own reflog. And on GitHub the object usually stays fetchable by hash long after the branch moved, which is exactly why Chapter 10 says rotate the credential first and treat the history rewrite as cleanup rather than as containment.
      `,
        [
          q('git gc --prune=now completes, yet git cat-file -t on a commit no branch reaches still prints commit. What explains it?', [
            'The commit sits in a packfile, and gc never rewrites an existing pack',
            'Pruning removes only blobs and trees, never the commit objects above',
            'The reflog still names that commit, and reflog entries count as reachable',
            'The --prune=now flag only expires objects written in the last fourteen days',
          ], 2, 'Reachability includes the reflog, the index, ORIG_HEAD and stashes, so an orphaned commit survives until the reflog entry naming it is expired as well.'),
          q('A teammate deletes .git/refs/heads/staging by hand, then git branch still lists staging, pointing at an older commit. Why?', [
            'A packed-refs entry for staging was uncovered when the loose file went',
            'Git restored the ref automatically from that branch\'s own reflog file',
            'The commit-graph cached the branch name along with its last known tip',
            'Another process recreated the loose ref during the next gc invocation',
          ], 0, 'A ref can live in both the loose file and packed-refs, the loose copy takes precedence, so removing it simply exposes the older packed value instead of deleting the branch.'),
          q('When Git stores an object as a delta inside a packfile, what decides which object becomes the base?', [
            'Always the same path as it stood one commit earlier in that branch',
            'The parent commit\'s version of the file, so deltas mirror history',
            'The smallest object of the same type currently held in the packfile',
            'A similarity heuristic over a window sorted by type, path and size',
          ], 3, 'Git sorts candidate objects and slides a window over them looking for whichever base compresses best, so the base is frequently a newer object and delta direction says nothing about history.'),
        ]
      ),
      lesson('Reconstructing a Force-Pushed Branch From Many Clones', 14, `
06:40 on a Tuesday. Someone resolves a rebase badly and runs \`git push --force\` on \`release/2.1\`. Fourteen commits from three people are no longer on that branch, and the server keeps no reflog you are allowed to read. The objects almost certainly still exist. The hash naming them is the thing you have lost.

### First action is a message, not a command

Send this before you debug anything:

> Do not fetch, do not run \`git fetch --prune\`, do not run \`git gc\`, do not delete or re-clone your copy of the repository. Reply with the output of two commands.

Every clone that fetched \`release/2.1\` before 06:40 is a witness. A \`--prune\` fetch drops the stale \`origin/release/2.1\` bookmark, and a \`gc\` after the reflog expires drops the objects. People helpfully tidying up is how a recoverable incident becomes an unrecoverable one.

### Where the old tip is hiding

| Source | How to read it |
|---|---|
| A colleague's tracking ref | \`git rev-parse origin/release/2.1\` |
| That ref's history | \`git reflog show origin/release/2.1\` |
| Your own branch history | \`git reflog show release/2.1\` |
| A CI runner's checkout | The build log prints the commit it built |
| An open pull request | \`git fetch origin refs/pull/318/head\` |

Remote tracking refs keep reflogs too, and almost nobody knows it:

\`\`\`bash
$ git reflog show origin/release/2.1
9c2f81a refs/remotes/origin/release/2.1@{0}: fetch: forced-update
4b71de0 refs/remotes/origin/release/2.1@{1}: fetch: fast-forward
\`\`\`

\`4b71de0\` is the answer. Entry zero is the damage, entry one is what was there before it. On GitHub there is a second copy of that fact in plain sight: the pull request timeline records "force-pushed the release/2.1 branch from 4b71de0 to 9c2f81a", and that page survives the push.

### Publish the hash before you do anything clever

The moment one machine has the commit, get it onto the server under a name nothing will move:

\`\`\`bash
git push origin 4b71de0c8f2a5b9e7d3c1a0f6e4d2b8c5a9f7e3b:refs/heads/rescue/release-2.1
\`\`\`

Now the recovery no longer depends on one laptop staying switched on.

### Reconcile, do not overwrite

Work has usually landed on \`release/2.1\` since 06:40, so a second force push in the other direction just moves the outage.

\`\`\`bash
git fetch origin
git log --oneline origin/release/2.1..origin/rescue/release-2.1   # what was lost
git log --oneline origin/rescue/release-2.1..origin/release/2.1   # what landed since
\`\`\`

Read both lists, then merge, or cherry-pick the smaller set across, or \`git rebase --onto\` if the branch is yours alone. Whichever you pick, announce the plan in the channel first, because a rescue that lands as a surprise force push is indistinguishable from a second incident. Chapter 9's rules about rewriting shared branches apply with full force here, because the branch is already fragile and the team is already watching.

### Making it not happen again

\`--force-with-lease\` compares the remote against your \`origin/release/2.1\` bookmark and refuses if it moved. The gap: an editor or a shell prompt that fetches in the background updates that bookmark for you, so the lease now approves a value you never looked at. Add \`--force-if-includes\`, which additionally requires that the remote tip is in your own reflog. Better still, turn on branch protection so \`release/2.1\` refuses non fast forward pushes outright.

### The common mistake

Re-cloning the repository "to get a clean state" while the incident is live. The reflog is local and a fresh clone starts with an empty one. That command deletes the only surviving record of where the branch used to point.
      `,
        [
          q('Ten minutes after a destructive force push to release/2.1, what is the most useful thing to tell the whole team?', [
            'Re-clone the repository so that everybody starts from a consistent state',
            'Stop fetching with --prune and stop running gc until we have the old hash',
            'Push your own copy of release/2.1 back over the remote branch right now',
            'Raise a support ticket, because only the host can restore a deleted ref',
          ], 1, 'The old commits survive only while some clone still names them, and a pruning fetch or a gc is exactly what drops the stale tracking ref and then the objects behind it.'),
          q('Which command run in a colleague\'s clone most reliably reveals the tip release/2.1 had before the force push?', [
            'git log --oneline release/2.1, reading back past the merge base',
            'git fsck --lost-found run against the server\'s bare repository',
            'git rev-parse release/2.1@{upstream}, then walking to its parent',
            'git reflog show origin/release/2.1, which lists its earlier values',
          ], 3, 'Remote tracking refs keep their own reflog, so the entry below the forced-update line holds the exact commit the branch pointed at before the push.'),
          q('Why can git push --force-with-lease still destroy a colleague\'s commit?', [
            'It compares the remote tip against your branch reflog, not against theirs',
            'It guards only those branches already covered by a protection rule',
            'A background fetch refreshes the tracking ref you never actually looked at',
            'It skips the safety check whenever the push is a fast-forward for you',
          ], 2, 'The lease is checked against your remote tracking ref, so an editor or prompt that fetches in the background can update it to a value you never saw, which is why --force-if-includes exists.'),
        ]
      ),
      lesson('Backups, Bundles, and Repairing a Broken Repository', 13, `
\`\`\`bash
$ git log --oneline
error: inflate: data stream error (incorrect header check)
fatal: loose object dce96ea2cc79c9c05ebe190f00f867b48b50794b is corrupt
\`\`\`

One bad sector, and a repository that worked ten minutes ago will not print its own history. What happens next depends entirely on decisions you made before it broke.

### A clone is not a backup

It is a good copy of the reachable history and nothing else. A clone leaves behind your reflog, your stashes, every commit no branch or tag reaches, your hooks, your config, and any ref outside \`refs/heads\` and \`refs/tags\`. If your backup story is "everyone has a clone", the reflog rescue in Chapter 5 and the force-push rescue you just read stop working the day the server dies.

\`\`\`bash
git clone --mirror git@github.com:acme/storefront.git storefront.git
cd storefront.git && git remote update --prune
\`\`\`

\`--mirror\` makes a bare repository with the refspec \`+refs/*:refs/*\`, so every advertised ref comes across and \`remote update\` keeps it current. That is a backup.

### Bundles: history in one file

A bundle is a packfile plus a ref list in a single file. You can clone it, fetch from it, and email it.

\`\`\`bash
$ git bundle create storefront-2026-03-02.bundle --all
$ git bundle verify storefront-2026-03-02.bundle
The bundle contains these 2 refs:
c0571f0 refs/heads/main
c0571f0 HEAD
The bundle records a complete history.
$ git clone storefront-2026-03-02.bundle recovered
\`\`\`

Incremental bundles take a range, and \`verify\` is blunt about the consequence:

\`\`\`bash
$ git bundle create nightly.bundle main~1..main
$ git bundle verify nightly.bundle
The bundle requires this ref:
b0e2daed9f2dd14db6cd0d71ae765fbbb5aa1457
\`\`\`

"Requires" means it restores nothing on a machine that lacks \`b0e2dae\`. Incremental bundles are a chain, and a chain with one missing link is a pile of useless files.

| Method | Carries reflogs | Restores offline | Cheap nightly |
|---|---|---|---|
| Plain clone | No | Yes | Yes |
| \`clone --mirror\` | No | Yes | Yes |
| Full bundle | No | Yes | Gets large |
| Filesystem copy | Yes | Yes | Risky while Git runs |

### Repairing what broke

Start with a diagnosis, never a fix:

\`\`\`bash
$ git fsck --full
error: unable to unpack header of .git/objects/dc/e96ea...
error: dce96ea: object corrupt or missing
dangling tree d683c1f649ce977cf047a4af75fc49020db2f8b0
\`\`\`

Loose object files are written read only, so a corrupt one is usually hardware or a bad copy rather than an edit. The repair is to source that exact object from somewhere healthy, since object ids are content addressed and any copy is the copy:

\`\`\`bash
rm -f .git/objects/dc/e96ea2cc79c9c05ebe190f00f867b48b50794b
git unpack-objects -r < ../storefront-good/.git/objects/pack/pack-c6e5a86.pack
git fsck --full     # silent means fixed
\`\`\`

If the damage is in a \`.pack\`, note the asymmetry: \`git index-pack\` rebuilds a missing \`.idx\` from the \`.pack\`, but nothing rebuilds a \`.pack\` from an \`.idx\`. When nothing healthy exists, your last option is to move the branch back to the newest commit that \`git fsck\` can still read and accept the loss.

Catch it earlier next time:

\`\`\`bash
git config --global fetch.fsckObjects true
git config --global transfer.fsckObjects true
\`\`\`

### The common mistake

Backing up with \`cp -r\` or \`rsync\` on a repository somebody is using. Git repacks and deletes files as it goes, so a copy taken during \`gc\` can contain a \`packed-refs\` naming objects the copy never received. It restores, it clones, and it fails a year later when someone asks for an old commit. Snapshot with \`git clone --mirror\` or \`git bundle\`, both of which read a consistent view.
      `,
        [
          q('A colleague argues that everyone having a clone is a complete backup of the repository. What does that miss?', [
            'Reflogs, stashes and every commit that no branch or tag still reaches',
            'Tag objects, since a clone fetches those only when --tags is passed',
            'Most of the history, because clones are made shallow by default now',
            'Any blob above the pack size limit, which is left behind on the server',
          ], 0, 'A clone copies reachable history only, so the local rescue material that Chapters 5 and 12 depend on, plus stashes and non standard refs, never leaves the original machine.'),
          q('git bundle verify reports that a bundle requires ref b0e2dae. What does that tell you about restoring from it?', [
            'The bundle is damaged and has to be produced again from the source',
            'The bundle carries tags whose target commits were left out of it',
            'It is incremental, so it restores nothing unless b0e2dae is already present',
            'It came from a shallow clone and its history stops at that commit',
          ], 2, 'A bundle built from a range carries only the commits in that range, so the listed prerequisite must already exist in the target repository or the bundle cannot be applied at all.'),
          q('git log dies with \'loose object dce96ea is corrupt\' and a healthy clone of the same repository sits on another machine. What fixes it?', [
            'Run git gc --prune=now so the damaged object is repacked correctly',
            'Delete the object file, then unpack the healthy clone\'s pack into it',
            'Rebuild the object using git index-pack from the local .idx file',
            'Remove the object and run git fsck, which regenerates it from HEAD',
          ], 1, 'Object ids are content addressed, so any healthy copy of dce96ea is byte identical to the one you lost and unpacking it from another clone\'s packfile restores the repository exactly.'),
        ]
      ),
      ],
      [
      q('You build a commit with git commit-tree and the object exists, but git log never shows it. What is missing?', [
        'A tree object, because commit-tree records only a message and an author',
        'An index entry, which git log reads to work out where to start walking',
        'A signature, without which git log skips commits it cannot verify',
        'A ref pointing at it, so nothing reachable ever leads Git to that commit',
      ], 3, 'History is walked backwards from refs, so an object with no branch, tag or reflog entry naming it is invisible to log even though it is stored perfectly well.'),
      q('Which sequence actually removes an unreachable commit from your own clone?', [
        'git branch -D on the old branch, then git gc --prune=now to repack',
        'git reflog expire --expire-unreachable=now --all, then git gc --prune=now',
        'git fsck --unreachable to list it, then git prune --expire=2.weeks.ago',
        'git repack -ad to rewrite the pack, then git count-objects -vH to check',
      ], 1, 'The reflog counts as a reachability source, so the entries naming the commit have to be expired before any prune or gc is able to delete the object.'),
      q('Someone force-pushed over main and the server has since been garbage collected. Where is the previous tip most likely still readable?', [
        'In a teammate\'s clone, recorded under origin/main in its reflog',
        'In the server\'s packed-refs file, kept there as a peeled entry',
        'In your working tree, which still contains the earlier file contents',
        'In the local .git/index, which caches the previously checked out tree',
      ], 0, 'Fetches write reflog entries for remote tracking refs, so any clone that fetched main before the force push still records the hash it pointed at beforehand.'),
      q('An auditor with no network access needs the full history of one repository on a USB stick. What do you hand over?', [
        'A tar of the working tree together with a text export of git log',
        'A shallow clone made with --depth 50 to keep the file size down',
        'A bundle produced by git bundle create storefront.bundle --all',
        'A copy of .git/objects/pack alongside the packed-refs file only',
      ], 2, 'A bundle is a single self contained file holding a packfile and its refs, and the receiver can clone or fetch from it directly with no server involved.'),
      ]
    ),
  ],
  final: [
    q('Why does amending a commit message produce a different hash?', [
      'Git renumbers commits sequentially',
      'The hash covers the whole commit, message included, so any edit makes a new object',
      'Amend adds a second parent to the commit so the new version links back to the original one',
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
      'keep a backup copy of your files in case the working directory is lost',
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
      'The very first commit in the repository, which every branch starts from',
      'The merge commit that Git creates',
    ], 1, 'A three-way merge compares both tips against their common ancestor to work out what each side changed.'),
    q('Your teammate has already pulled the commits on a branch. Which operation is now unsafe?', [
      'Rebasing that branch and force-pushing it',
      'Merging main into it',
      'Adding a new commit to it and pushing normally to the shared remote',
      'Tagging one of its commits',
    ], 0, 'Rebase replaces commits with new hashes, so anyone holding the originals ends up with a duplicated, diverged history.'),
    q('git pull is shorthand for…', [
      'git fetch followed by git reset --hard to match the remote exactly',
      'git clone followed by git switch',
      'git push, run in reverse',
      'git fetch followed by git merge, or rebase if configured',
    ], 3, 'Fetch updates your origin/* bookmarks; the second half integrates those changes into your current branch.'),
    q('Why does commit-message discipline pay off at release time?', [
      'It makes clones smaller',
      'It prevents merge conflicts',
      'Generated release notes and git log -S searches are only as good as the messages',
      'Annotated tags require a specific message format that release tooling will then parse',
    ], 2, 'Changelog tooling and history archaeology both read your messages — vague ones make both worthless.'),
    q('Which command can permanently destroy work that Git has never recorded?', [
      'git reset --hard',
      'git revert HEAD',
      'git branch -d feature',
      'git fetch --prune',
    ], 0, '--hard overwrites the working directory, and uncommitted edits were never objects, so the reflog cannot bring them back.'),
    q('What does the reflog record?', [
      'Every command you have ever run',
      'Where HEAD and your branch tips have pointed, in this clone',
      'The full history of the remote repository, as seen from every collaborator',
      'Every change made to every file',
    ], 1, 'It is a local journal of pointer movements, which is exactly what you need to undo a reset, rebase, or branch deletion.'),
    q('Why does git diff main...feature show what a pull request shows?', [
      'It hides merge commits',
      'It diffs the two branch tips directly, so any commits main gained since the split appear as deletions',
      'Three dots diff the merge base against the feature tip, so main\'s newer commits are excluded',
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
      'It also checks the contributor\'s uncommitted local edits before anything is pushed',
      'The server enforces it, so --no-verify or a missing hook cannot get past it',
    ], 3, 'Local hooks are opt-in and skippable; branch protection is the only place a rule genuinely holds.'),
    q('Which file belongs in Git LFS rather than in ordinary Git?', [
      'package-lock.json',
      'A 40 MB design file revised every week',
      'A 2,000-line CSS file that changes in small edits most days',
      'The .gitattributes file itself',
    ], 1, 'Binaries do not delta compress, so each revision adds its full size to every clone forever — LFS keeps those bytes out of the object store.'),
    q('A workflow caches ~/.npm under a key built from hashFiles(\'package-lock.json\'), and it is triggered only by pull_request. Every pull request still downloads every package from the network. What explains that?', [
      'A cache saved on a branch is readable only by that branch, and no default-branch run wrote one',
      'hashFiles is evaluated after the restore step, so the key is empty on the lookup',
      'Cache entries are immutable, so the entry stays frozen with the packages it first held, even after changes',
      'npm ci deletes node_modules, which invalidates the entry that was just restored',
    ], 0, 'Cache entries are scoped to the branch that wrote them, and only entries written on the default branch are visible everywhere, so a workflow that never runs on main leaves every pull request starting cold no matter how good the key is.'),
    q('You run git commit --fixup 8b02de4, then decide that commit\'s subject line reads badly and reword it before finally running git rebase -i --autosquash main. What happens to the fixup?', [
      'The rebase stops and reports a fixup commit whose target cannot be found',
      'Autosquash pairs on subject text, so the fixup is left in the list as an ordinary commit',
      'Git falls back to the hash recorded in the fixup, so it still folds into the right commit',
      'The fixup is folded into whichever commit sits immediately above it in the todo list',
    ], 1, 'Autosquash matches a fixup! line against target subject lines rather than against any stored id, so rewording the target breaks the pairing silently and the fixup survives the rebase as a separate commit that nobody warned you about.'),
    q('You purged .env from every commit with git filter-repo, force pushed all branches and tags, and ran gc on your own clone. Why is the leaked key still fetchable from GitHub?', [
      'packed-refs keeps the old branch tips until the next full repack runs',
      'The tags were rewritten but the commits they pointed at were left alone',
      'Pushed commits stay reachable by hash through pull request refs and forks',
      'GitHub copies every force pushed tip into a backup ref that anyone can read',
    ], 2, 'A rewrite only changes what your refs point at, while GitHub keeps the old commit fetchable by its full hash through pull request refs and the fork network until Support purges them, which is exactly why the credential has to be rotated before any history work begins.'),
    q('Every action in your workflow is pinned to a full commit SHA, but the job also calls an organisation reusable workflow at @v2, and that workflow uses actions/checkout@v4. What is your real exposure?', [
      'None, because a called workflow inherits the pinned references of its caller',
      'The callee resolves its own tags at run time, so a moved tag runs in your job',
      'Only your own steps can be tampered with, since the callee runs on a separate runner',
      'The v2 reference is signature checked, so checkout@v4 is the single remaining risk',
    ], 1, 'A reusable workflow resolves the actions it names when it runs, so pinning stops at the first unpinned link in the chain and a repointed tag anywhere below that link executes inside a run that holds your secrets.'),
    q('You extract services/billing from a 4,200 commit monolith with git filter-repo, and the new repository\'s log shows 380 commits. What does that number tell you?', [
      'The clone was shallow, so most of the original history never arrived to be filtered',
      'filter-repo collapsed each day of work into one commit in order to save space',
      'Only merge commits survive a path filter, and the monolith happened to have 380',
      'Commits that touched nothing under the kept path went empty and were pruned',
    ], 3, 'The filter rebuilds every commit against the paths you kept, and a commit that changed nothing there ends up with an empty diff and is dropped, so the survivors are precisely the commits that ever touched billing and blame still names the right authors.'),
    q('After git reset --hard HEAD~1 you run git gc --prune=now, yet git cat-file -t on the discarded commit still prints commit. Why did it survive?', [
      'gc only rewrites packed-refs and never removes any object from the store',
      'The commit already sits inside a packfile, and gc prunes only loose objects',
      'A hard reset rewrites just the index, so the branch still points at that commit',
      'The reflog still names the commit, and reflog entries count as reachable',
    ], 3, 'Reachability covers the reflog, the index, ORIG_HEAD and stashes as well as branches and tags, so gc keeps the commit until you expire the reflog entries holding it, which is also why running gc is no way to contain a leaked secret.'),
    q('You are on main and run `git branch feature`, then edit a file and commit. Which branch pointer moves to the new commit?', [
      'feature, because it is the newest branch',
      'main, because git branch does not switch branches',
      'Both main and feature, since they pointed at the same commit',
      'Neither, because the commit is made in detached HEAD',
    ], 1, 'git branch only creates a pointer; HEAD still points at main, so committing moves main and leaves feature where it was.'),
    q('When you are on main, what does the file .git/HEAD normally contain?', [
      'The hash of main\'s latest commit',
      'A list of every local branch',
      'ref: refs/heads/main',
      'The path of the last file you edited',
    ], 2, 'HEAD is normally a pointer to a pointer: it names the current branch, which is why committing moves that branch automatically.'),
    q('Why set user.name and user.email on a new laptop before the first commit, rather than fixing them later?', [
      'Git refuses to run any command until both are set',
      'They are needed to encrypt the objects in .git',
      'They take effect for repositories cloned afterwards, not for ones already on the laptop',
      'Identity is stored in each commit, so fixing it rewrites history',
    ], 3, 'Author and committer are part of the commit object and its hash, so a wrong identity can only be corrected by creating new commits.'),
    q('What does the .gitignore line `build/` match?', [
      'Directories named build at any depth, but no files',
      'Only a build directory at the repository root',
      'Files and directories named build anywhere',
      'Only files whose names end in build',
    ], 0, 'A trailing slash means directories only, and a pattern with no other slash matches at any depth.'),
    q('A file keeps being ignored and you cannot tell which rule is responsible. Which command names the exact file and line?', [
      'git status --ignored',
      'git check-ignore -v <path>',
      'git ls-files --others',
      'git config --list --show-origin',
    ], 1, 'git check-ignore -v prints the ignore file, line number and pattern that matched the path.'),
    q('You want to ignore a personal scratch.md in one repository only, without committing any ignore rule. Where does the pattern go?', [
      'The project\'s .gitignore file',
      'A global excludes file for all repositories',
      '.git/info/exclude in that clone',
      'The repository\'s .gitattributes file',
    ], 2, '.git/info/exclude applies to this clone only and is never shared, unlike .gitignore, which is committed for everyone.'),
    q('You rebased your already-pushed feature branch onto the latest main, and `git push` is now rejected as non-fast-forward. What caused the rejection?', [
      'Git blocks pushes for a while after any rebase',
      'The rebase deleted the remote copy of the branch',
      'The rebase switched the branch\'s upstream to main, so Git treats the push as unrelated',
      'Rebase created new commits, so the remote tip is no longer an ancestor',
    ], 3, 'Rebase replaces your commits with new ones, so the pushed tip is not in your new history and only a force push, ideally --force-with-lease, can replace it.'),
    q('While on main you run `git merge feature` and get a conflict. Whose version appears directly after the `<<<<<<< HEAD` marker?', [
      'main\'s version, the branch you are merging into',
      'feature\'s version, the branch being merged in',
      'The merge base\'s original version of the lines',
      'A combined version that Git generated itself',
    ], 0, 'During a merge, HEAD is the branch you are on, so the first section shows main\'s side and the section after ======= shows feature\'s.'),
    q('Your library is at 2.3.1. You add a new optional parameter, and existing callers need no changes. Under semantic versioning, what is the next version?', [
      '3.0.0, because the public API changed',
      '2.3.2',
      '2.4.0',
      '2.4.1',
    ], 2, 'A backwards-compatible new feature bumps the minor digit and resets the patch digit, giving 2.4.0.'),
    q('You forked acme/storefront to contribute a fix but have no push access to acme. Where do you push your fix branch?', [
      'To upstream, since that is where it will be merged',
      'To origin, your fork, then open a pull request to acme',
      'Into your fork\'s main, which the pull request then tracks',
      'To a new remote that Git creates for pull requests',
    ], 1, 'You push the branch to your own fork and open the pull request from there; your fork\'s main should stay an exact copy of upstream.'),
    q('Why open a pull request as a draft while the work is still changing?', [
      'It hides the branch from everyone except the author and the reviewers',
      'It lets the pull request merge without approval',
      'It pauses the branch so nobody can push to it',
      'It signals it is not ready for review, while CI still runs',
    ], 3, 'A draft keeps the work visible and tested without asking reviewers to spend time on code that is still moving.'),
    q('You want to apply the same stash to two different branches in turn. Which command keeps the stash entry after applying it?', [
      'git stash apply',
      'git stash pop',
      'git stash drop',
      'git stash push',
    ], 0, 'apply re-applies the changes but keeps the entry on the shelf, while pop applies and then deletes it.'),
    q('You cherry-pick commit a1b2c3 from main onto release/1.4. What does release/1.4 gain?', [
      'The same commit object a1b2c3, now shared by both branches',
      'A merge commit joining main into release/1.4',
      'A new commit with the same change but a different hash',
      'Every commit on main up to and including a1b2c3',
    ], 2, 'Cherry-pick replays one commit\'s change on top of the current branch, producing a new commit with a new parent and therefore a new hash.'),
    q('On a branch with a linear history, which commit does the revision `HEAD~3` name?', [
      'The third parent of the HEAD merge commit, counting from the left',
      'The commit three generations back, following first parents',
      'The third most recent branch you checked out',
      'The commit three positions ahead of HEAD',
    ], 1, '~n walks n generations back along first parents, while ^n selects the nth parent of a single merge commit.'),
    q('You want every commit that changed the total() function in src/invoice.js, following it as it moves around the file. Which command does that?', [
      'git blame src/invoice.js',
      'git log -S total src/invoice.js',
      'git log --follow --stat src/invoice.js',
      'git log -L :total:src/invoice.js',
    ], 3, 'git log -L tracks a function or line range through history, printing only the patch for that range in each commit.'),
    q('You run `git bisect start`, mark main as bad and v1.4.0 as good. What does Git do next?', [
      'Checks out a commit about halfway between them for you to test',
      'Runs the test suite on every commit between them in order',
      'Lists all the commits between them for manual review',
      'Resets main back to v1.4.0 until the bug is found',
    ], 0, 'Bisect is a binary search: each good or bad answer halves the remaining range, so it checks out the midpoint for you to test.'),
    q('You add a pre-commit script to .git/hooks, but teammates who pull never get it. Why, and what is the fix?', [
      'Hooks run on the machine that first cloned the repository, not on later clones',
      'Teammates must run git gc before new hooks can load',
      '.git/hooks is not versioned; commit a hooks folder and set core.hooksPath',
      'Hooks are shared only when they are pushed with --tags',
    ], 2, 'Nothing in .git/hooks is versioned, so a committed directory plus core.hooksPath is how hook scripts reach other clones.'),
    q('A fresh clone of a repository that uses a submodule shows vendor/design-system as an empty folder. What fixes that clone?', [
      'git pull --rebase --autostash origin main',
      'git submodule update --init --recursive',
      'git fetch --all --tags --prune',
      'git checkout -- vendor/design-system',
    ], 1, 'A plain clone records the submodule but does not fetch it; git submodule update --init --recursive fetches and checks out the pinned commit.'),
    q('In a matrix run, the Node 18 job fails. With the default strategy settings, what happens to the other matrix jobs still running?', [
      'They keep running, because fail-fast defaults to false',
      'They restart on Node 18 to confirm the failure',
      'They pause until someone re-runs the failed job',
      'They are cancelled, because fail-fast defaults to true',
    ], 3, 'fail-fast is true by default, so one failure cancels the siblings; set it to false when you need to see which versions fail.'),
    q('You push three commits to a pull request within a few minutes. Which setting cancels the older CI runs for that branch?', [
      'A concurrency group keyed on the ref with cancel-in-progress: true',
      'fail-fast: true in the job\'s matrix strategy block, so older runs stop early',
      'timeout-minutes: 5 set on every job in the workflow',
      'needs: linking each new run to the previous one',
    ], 0, 'Runs that share a concurrency group replace each other, and cancel-in-progress stops the outdated ones immediately.'),
    q('Which trigger must a workflow declare so that other workflows can call it with a job-level `uses:`?', [
      'workflow_dispatch',
      'repository_dispatch',
      'workflow_call',
      'workflow_run',
    ], 2, 'workflow_call turns a workflow into a reusable one that callers reference with uses:, passing inputs and secrets.'),
    q('In `git rebase -i`, how do you change the order of two commits?', [
      'Mark both commits with the reorder keyword',
      'Swap their pick lines in the todo list',
      'Run git commit --amend on each in turn',
      'Rename the commits so they sort differently',
    ], 1, 'Git replays the todo list from top to bottom, so moving the lines changes the order in which the commits are recreated.'),
    q('Why can `git commit --amend` not fix a typo in the message of the third-from-last commit?', [
      'Amend refuses to run once three commits exist',
      'Messages of older commits are read-only in Git',
      'Amend works only on commits that are already pushed',
      'Amend only ever rewrites the tip commit of the branch',
    ], 3, 'Amend replaces only the latest commit; reaching an older one needs an interactive rebase with reword.'),
    q('What does GitHub push protection do when a push contains a recognised provider secret?', [
      'Rejects the push, so the secret never reaches the branch',
      'Accepts the push and rotates the secret automatically',
      'Accepts the push and hides the file from the web view',
      'Encrypts the secret inside the commit before storing it',
    ], 0, 'Push protection turns a secret scanning match into a rejected push, stopping the leak before it lands.'),
    q('A script must open pull requests in one repository, acme/invoicing, for the next month. Which personal credential fits best?', [
      'A classic token with the repo scope and no expiry set',
      'Your account password saved in the script\'s config file for the whole month',
      'A fine-grained token for that repo, minimal permissions, with an expiry',
      'An SSH key added to your personal account for all repos',
    ], 2, 'A fine-grained token names one repository and specific permissions and must expire, so a leak reaches far less for far less time.'),
    q('Your workflows pin every third-party action to a full commit SHA. What keeps those pins up to date without manual edits?', [
      'GitHub moves the pins to the newest tag automatically',
      'Dependabot, which bumps pinned hashes in pull requests',
      'Running git fetch --tags before each workflow starts',
      'Switching the pins to @main once a month',
    ], 1, 'Dependabot reads pinned hashes and opens pull requests that bump them, so pinning stays safe without becoming a chore.'),
    q('How do you bring a newer upstream version into a directory vendored with git subtree?', [
      'git submodule update --remote vendor/design-system',
      'Run git pull upstream main inside vendor/design-system, then commit the result',
      'Cherry-pick the upstream commits into main one by one',
      'git subtree pull --prefix vendor/design-system <url> <tag> --squash',
    ], 3, 'git subtree pull reads the trailers from the last sync and merges in only what changed upstream since then.'),
    q('When moving a repository to a new host, why freeze the old one, by archiving it or removing write access, before the final mirror?', [
      'So nobody pushes to the old host after the final copy is taken',
      'So the mirror push can compress the history more tightly',
      'Because mirror pushes only work from archived repositories',
      'Because Git cannot read a repository that still accepts writes',
    ], 0, 'Without a freeze, commits pushed to the old host after the mirror are silently left behind when everyone switches.'),
    q('Which Git object type records a directory: the names, modes and hashes of the files and subdirectories inside it?', [
      'blob',
      'commit',
      'tree',
      'tag',
    ], 2, 'A tree lists entries with their mode, name and object hash; blobs hold only file content, which is why moving a file changes no blob.'),
    q('Given an object\'s hash, which command prints that object, such as a commit or tree, in readable form?', [
      'git hash-object <hash>',
      'git update-ref <hash>',
      'git rev-list <hash>',
      'git cat-file -p <hash>',
    ], 3, 'git cat-file -p pretty-prints any object, while -t reports its type and -s its size.'),
  ],
});
