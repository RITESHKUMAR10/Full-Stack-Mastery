# Git & GitHub Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Git 2.40 to 2.47** and current GitHub features (GitHub Actions, Rulesets, Codespaces, Copilot, Dependabot, Projects). Newer commands such as `git switch`, `git restore` (2.23), `git sparse-checkout`, `git maintenance`, `git rebase --update-refs` (2.38) and `zdiff3` conflict style (2.35) are marked. Verify flags with `git help <command>`. Examples use the sample name **Ritesh Kumar**.
> This file covers Git's object model, the three areas, branching, merging, rebasing, undoing changes, remotes, collaboration workflows, history rewriting, recovery with reflog, hooks, submodules, monorepo tooling, and GitHub features: pull requests, code review, Actions CI/CD, branch protection, security, releases and automation.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Scenarios](#-part-6-hands-on-tasks--scenarios)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Git + GitHub + Mixed)](#-part-11-complete-coverage-git--github--mixed)
- [Part 12: Git Internals](#-part-12-git-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Git?
A free, open-source **distributed version control system** created by Linus Torvalds in 2005. It records snapshots of your project over time so you can see history, go back, work on features in parallel (branches), and collaborate. Every clone is a full copy of the repository, including history.

### Q2. What is GitHub? Git vs GitHub *(Must-know)*
Git is the **tool** (command line, local). GitHub is a **hosting service** built around Git that adds pull requests, issues, code review, Actions (CI/CD), permissions, Pages, packages, security scanning and project boards. Alternatives: GitLab, Bitbucket, Azure DevOps, Gitea. You can use Git without GitHub.

### Q3. Why use version control?
History and audit trail, undo mistakes, parallel work (branches), collaboration without overwriting each other, code review, release tagging, and safe experimentation.

### Q4. Centralized vs distributed VCS
Centralized (SVN, CVS): one central server holds history; commits need the server. Distributed (Git, Mercurial): every developer has the full history locally; commit, branch and log work offline; the "central" repo is a convention.

### Q5. The three areas of Git *(Must-know)*
1. **Working directory**: your files on disk.
2. **Staging area (index)**: what will go into the next commit.
3. **Repository (`.git`)**: committed history.
```
working dir --git add--> staging --git commit--> repository
working dir <--git restore / checkout-- (from index or commit)
```

### Q6. Basic setup and first repo
```bash
git config --global user.name "Ritesh Kumar"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git init                    # new repo in current folder
git clone https://github.com/user/repo.git
git config --list --show-origin
```
Config levels: `--system`, `--global` (`~/.gitconfig`), `--local` (`.git/config`); the most local wins.

### Q7. Core daily workflow
```bash
git status                  # what changed
git add file.js             # stage a file (git add . stages everything in cwd)
git add -p                  # stage hunks interactively
git commit -m "Add login validation"
git log --oneline --graph --decorate --all
git diff                    # unstaged changes
git diff --staged           # staged changes
git push origin main
git pull                    # fetch + merge (or rebase)
```

### Q8. What is a commit?
A snapshot of the staged files plus metadata: author, committer, timestamps, message, parent commit(s), and a unique SHA-1 (or SHA-256 in new repos) hash like `a1b2c3d`. Commits form a graph (DAG). Good commits are small, focused and have clear messages.

### Q9. Good commit messages
Short imperative subject (≤ 50 chars), blank line, body explaining **why**. Conventional Commits format is popular: `feat(auth): add refresh token rotation`, `fix(api): handle null user`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, with `BREAKING CHANGE:` footers. It enables automatic changelogs and semantic versioning.

### Q10. What is a branch? *(Must-know)*
A lightweight movable **pointer** to a commit (a 41-byte file in `.git/refs/heads/`). Creating a branch is instant. `HEAD` points to the current branch (or directly to a commit in detached HEAD).
```bash
git branch                       # list
git branch feature/login         # create
git switch feature/login         # switch (2.23+)
git switch -c feature/login      # create + switch
git checkout -b feature/login    # older equivalent
git branch -d feature/login      # delete merged branch (-D force)
```

### Q11. What is HEAD?
A reference to the commit you are currently on (usually via a branch name). `HEAD~1` is the parent, `HEAD~3` three commits back, `HEAD^2` the second parent of a merge commit.

### Q12. Merge basics *(Must-know)*
```bash
git switch main
git merge feature/login
```
- **Fast-forward**: if `main` has not moved, Git just moves the pointer. No merge commit.
- **Three-way merge**: if both branches diverged, Git finds the merge base and creates a **merge commit** with two parents.
`git merge --no-ff` forces a merge commit; `--squash` combines changes into the index without a merge commit.

### Q13. Merge conflicts: what and how to resolve
A conflict happens when both sides changed the same lines (or one deleted what the other edited). Git marks the file:
```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> feature/login
```
Steps: open files, edit to the correct result, remove markers, `git add file`, then `git commit` (or `git merge --continue`). Abort with `git merge --abort`. Use `git mergetool` or an IDE. Enable `merge.conflictstyle zdiff3` to also see the base version.

### Q14. `git pull` vs `git fetch`
`fetch` downloads new commits and updates remote-tracking branches (`origin/main`) without touching your working branch. `pull` = `fetch` + `merge` (or `rebase` with `--rebase`). Prefer `fetch` then inspect (`git log HEAD..origin/main`) when you want control.

### Q15. Remotes
```bash
git remote -v
git remote add origin git@github.com:user/repo.git
git remote set-url origin https://github.com/user/repo.git
git push -u origin main          # -u sets upstream tracking
git branch -vv                   # see tracking info
git push origin --delete old-branch
```
`origin` is just the default name of the remote you cloned from.

### Q16. `.gitignore`
Lists patterns Git should not track (build output, dependencies, secrets, OS files).
```
node_modules/
dist/
.env
*.log
.DS_Store
!important.log
```
It only affects **untracked** files. To stop tracking an already committed file: `git rm --cached file` then commit. Global ignore: `core.excludesFile`. Use `.git/info/exclude` for personal rules.

### Q17. Undoing changes: the main commands *(Must-know)*
| Situation | Command |
|---|---|
| Discard unstaged edits in a file | `git restore file` (older: `git checkout -- file`) |
| Unstage a file | `git restore --staged file` (older: `git reset HEAD file`) |
| Fix the last commit message / add forgotten file | `git commit --amend` |
| Undo a commit but keep changes staged | `git reset --soft HEAD~1` |
| Undo a commit, keep changes unstaged | `git reset --mixed HEAD~1` (default) |
| Undo a commit and discard changes | `git reset --hard HEAD~1` (dangerous) |
| Undo a pushed commit safely | `git revert <sha>` (creates a new commit) |

### Q18. `reset` vs `revert` vs `checkout/restore`
- `reset` moves the branch pointer (rewrites history locally). Use on **unpushed** commits.
- `revert` adds a new commit that cancels an earlier one. Safe for **shared** history.
- `restore`/`checkout` changes files in the working tree/index without moving branches.

### Q19. Soft, mixed and hard reset
| Mode | HEAD/branch | Index | Working dir |
|---|---|---|---|
| `--soft` | moved | unchanged | unchanged |
| `--mixed` (default) | moved | reset | unchanged |
| `--hard` | moved | reset | reset (changes lost) |

### Q20. `git stash`
Temporarily shelves uncommitted changes.
```bash
git stash push -m "wip login form"     # add -u to include untracked files
git stash list
git stash pop                          # apply and drop
git stash apply stash@{1}              # apply, keep stash
git stash drop stash@{0}
git stash branch fix-login stash@{0}   # new branch from stash
```

### Q21. Viewing history
```bash
git log --oneline -10
git log --stat
git log -p file.js                     # patches for a file
git log --author="Ritesh" --since="2 weeks ago"
git log --grep="login"
git log -S"functionName"               # pickaxe: commits that added/removed that string
git log main..feature                  # commits in feature not in main
git show a1b2c3d
git blame -L 10,30 file.js             # who changed these lines
```

### Q22. Tags
Named pointers to commits, used for releases.
```bash
git tag v1.0.0                         # lightweight
git tag -a v1.0.0 -m "Release 1.0.0"   # annotated (has author, date, message)
git tag -s v1.0.0                      # signed
git push origin v1.0.0                 # tags are not pushed by default
git push origin --tags
```
Use annotated tags for releases and semantic versioning (`MAJOR.MINOR.PATCH`).

### Q23. SSH vs HTTPS for remotes
HTTPS: works through firewalls, uses personal access tokens or a credential helper (Git Credential Manager), password auth was removed from GitHub in 2021. SSH: key pair (`ssh-keygen -t ed25519`), add the public key to GitHub, no tokens to paste. Test: `ssh -T git@github.com`.

### Q24. Forking and pull requests (GitHub basics) *(Must-know)*
**Fork** = your own server-side copy of someone's repo. Typical open-source flow: fork → clone your fork → `git remote add upstream <original>` → create branch → commit → push to your fork → open a **pull request** to the original → review → merge.
```bash
git fetch upstream && git switch main && git merge upstream/main
```

### Q25. What is a pull request (PR)?
A request to merge a branch into another, with a discussion thread, diff, reviews, CI status checks and approvals. Not a Git feature; it is a GitHub (GitLab: merge request) feature.

### Q26. Issues, labels, milestones, projects
Issues track bugs, tasks and ideas. Labels (`bug`, `good first issue`), milestones (releases), assignees, and Projects (boards/tables). Link PRs to issues with keywords: `Fixes #123`, `Closes #123` auto-closes the issue on merge.

### Q27. README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT
`README.md` explains the project; `LICENSE` (MIT, Apache-2.0, GPL) defines reuse rights; `CONTRIBUTING.md` explains how to help; `CODE_OF_CONDUCT.md` sets behavior rules; `SECURITY.md` explains vulnerability reporting. GitHub shows them in the repo UI.

### Q28. Cloning options
```bash
git clone --depth 1 URL                 # shallow, latest commit only
git clone --branch dev --single-branch URL
git clone --filter=blob:none URL        # partial clone (fetch blobs on demand)
git clone --recurse-submodules URL
```

### Q29. `git diff` forms
```bash
git diff                     # working dir vs index
git diff --staged            # index vs HEAD
git diff HEAD                # working dir vs HEAD
git diff main..feature       # tip to tip
git diff main...feature      # since merge base (what the PR shows)
git diff --stat ; git diff --name-only
```

### Q30. Detached HEAD
You checked out a commit/tag (`git checkout a1b2c3d`) instead of a branch. New commits are not on any branch and can be lost. Fix: `git switch -c rescue-branch` to keep the work.

### Q31. `git rm` and `git mv`
`git rm file` deletes and stages deletion; `git rm --cached file` untracks but keeps the file. `git mv a b` renames (Git detects renames from content similarity anyway).

### Q32. Staging parts of a file
`git add -p` lets you accept/skip hunks (`y`, `n`, `s` split, `e` edit). Helps create focused commits.

### Q33. Aliases and productivity config
```bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global pull.rebase true
git config --global rerere.enabled true      # remember conflict resolutions
git config --global fetch.prune true
git config --global push.autoSetupRemote true
```

### Q34. What is `origin/main` vs `main`?
`main` is your local branch. `origin/main` is a **remote-tracking branch**: your last known state of the remote's `main`, updated on `fetch`/`pull`/`push`. It is read-only for you.

### Q35. Typical branch naming
`feature/login`, `fix/null-pointer`, `chore/deps`, `release/1.4`, `hotfix/payment-bug`, often with ticket IDs: `feature/PROJ-123-login`. Keep names lowercase, short and meaningful.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Merge vs rebase *(Must-know)*
- **Merge** preserves history exactly, adds a merge commit, non-destructive; graph can get busy.
- **Rebase** replays your commits on top of another base, creating **new commits** (new hashes) and a linear history; rewrites history.
```bash
git switch feature
git rebase main          # replay feature commits onto latest main
```
**Golden rule:** never rebase commits that others have based work on (public/shared branches). Rebase your own local/feature branches before opening or updating a PR.

### Q37. Rebase workflow and conflict handling
```bash
git rebase main
# conflict -> fix files -> git add . -> git rebase --continue
git rebase --abort       # give up and restore original
git rebase --skip        # drop the current commit
git push --force-with-lease   # after rebasing a branch you already pushed
```

### Q38. Interactive rebase *(Must-know)*
```bash
git rebase -i HEAD~4
```
Commands: `pick`, `reword`, `edit` (stop to amend), `squash`/`fixup` (combine), `drop`, and reorder lines. Use `git commit --fixup <sha>` + `git rebase -i --autosquash` to tidy up. Great for cleaning a branch before review.

### Q39. `--force` vs `--force-with-lease`
`--force` overwrites the remote branch unconditionally and can erase teammates' commits. `--force-with-lease` refuses if the remote branch moved since you last fetched, so it protects against overwriting others' work. Prefer `--force-with-lease` (or `--force-if-includes`) and never force-push to protected shared branches.

### Q40. Squash merge vs merge commit vs rebase merge (GitHub PR options)
| Option | Result | Use when |
|---|---|---|
| Merge commit | keeps all commits + merge commit | preserve full history |
| Squash and merge | one commit on main | tidy history, noisy WIP commits |
| Rebase and merge | commits replayed linearly, no merge commit | linear history, clean commits |
Teams pick one default. Squash makes bisect and revert easier (one commit per PR).

### Q41. Cherry-pick
Apply a specific commit onto the current branch.
```bash
git cherry-pick a1b2c3d
git cherry-pick A^..B          # range
git cherry-pick -x a1b2c3d     # adds "(cherry picked from ...)" to message
```
Use for hotfix backports. Overuse creates duplicate commits and confusing history.

### Q42. `git reflog`: your safety net *(Must-know)*
Records where `HEAD` and branches pointed (local only, ~90 days default). Recover lost commits after a bad reset/rebase:
```bash
git reflog
git reset --hard HEAD@{3}
git branch rescue a1b2c3d
```
Unreachable commits remain until `git gc` prunes them.

### Q43. Undo a merge or pushed commit safely
Pushed bad commit: `git revert <sha>`. Merge commit: `git revert -m 1 <merge-sha>` (keep mainline parent 1). Note: reverting a merge means re-merging the same branch later won't re-apply those changes; you must revert the revert first.

### Q44. Amend and fix last commit
```bash
git commit --amend --no-edit          # add staged changes to the last commit
git commit --amend -m "Better message"
```
Only on unpushed commits (or on your own feature branch followed by `--force-with-lease`).

### Q45. Branching strategies: Git Flow, GitHub Flow, trunk-based *(Must-know)*
- **Git Flow**: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`. Good for scheduled releases, heavy process.
- **GitHub Flow**: `main` always deployable; short-lived feature branches → PR → merge → deploy.
- **Trunk-based development**: everyone commits to `main` (or very short branches) behind feature flags; requires strong CI and small changes. Best for continuous delivery.

### Q46. Code review etiquette and PR hygiene
Small PRs (< ~400 lines), clear title and description (what, why, how tested, screenshots), link issue, self-review first, respond to comments, no unrelated changes, green CI before review. Reviewers: be specific and kind, distinguish blocking from nit, check tests, security, performance, readability.

### Q47. Branch protection and rulesets (GitHub)
Rules on important branches: require PR reviews (and CODEOWNERS approval), require status checks to pass, require branches up to date, require signed commits, require linear history, block force pushes and deletions, restrict who can push, require conversation resolution. **Rulesets** (newer) apply rules across many repos/branches/tags with bypass lists.

### Q48. CODEOWNERS
`.github/CODEOWNERS` maps paths to owners who are auto-requested for review.
```
*               @org/platform-team
/frontend/      @ritesh-kumar @org/ui-team
*.sql           @org/dba
```

### Q49. GitHub Actions basics *(Must-know)*
YAML workflows in `.github/workflows/`. Concepts: **workflow** (file), **event** (trigger: `push`, `pull_request`, `schedule`, `workflow_dispatch`), **job** (runs on a runner), **step** (command or action), **runner** (GitHub-hosted `ubuntu-latest` or self-hosted), **action** (reusable unit).
```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
```

### Q50. Secrets, variables and environments in Actions
Store secrets in repo/org/environment settings (`${{ secrets.NPM_TOKEN }}`); never commit them. Environments (`production`) can require manual approval and restrict secrets to specific branches. Prefer **OIDC** to cloud providers (short-lived tokens) over long-lived keys. Pass secrets to steps through `env`, avoid echoing them (they are masked but not foolproof).

### Q51. Caching and matrix builds
```yaml
strategy:
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, windows-latest]
steps:
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```
Matrix runs jobs in parallel for combinations. Cache keys should include a lockfile hash.

### Q52. Releases and semantic versioning
GitHub Releases attach notes and binaries to tags. SemVer: `MAJOR` breaking, `MINOR` features, `PATCH` fixes. Automate with release-please, semantic-release, or `gh release create v1.2.0 --generate-notes`.

### Q53. `git bisect`: find the commit that broke something
```bash
git bisect start
git bisect bad                  # current is broken
git bisect good v1.2.0          # known good
# Git checks out the middle; test and mark good/bad...
git bisect run npm test         # automate
git bisect reset
```
Binary search: O(log n) steps.

### Q54. `git blame` and history archaeology
`git blame -w -C -C file` ignores whitespace and detects moved code. `git log -L :funcName:file` shows the history of a function. `git log --follow file` follows renames. Add noisy reformat commits to `.git-blame-ignore-revs` and set `blame.ignoreRevsFile`.

### Q55. Comparing branches before merging
```bash
git fetch
git log --oneline main..feature       # what feature adds
git diff main...feature --stat
git merge-base main feature
git cherry -v main feature            # which commits are not in main (by patch)
```

### Q56. Submodules vs subtrees vs package managers
- **Submodule**: a pointer to a specific commit in another repo (`.gitmodules`). Needs `git submodule update --init --recursive`; easy to forget; detached HEADs.
- **Subtree**: copies another repo's history into a subdirectory; no special tooling for consumers.
- **Package manager** (npm, pip, Maven): usually the best for libraries.

### Q57. Git LFS (Large File Storage)
Replaces large binary files with text pointers, storing content on an LFS server.
```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
```
Without LFS, big binaries bloat history permanently.

### Q58. Handling secrets accidentally committed
1. **Revoke/rotate the secret immediately** (history is compromised even after removal).
2. Remove from history with `git filter-repo` or BFG, then force-push and have everyone re-clone.
3. Enable push protection / secret scanning, and use `.gitignore`, pre-commit hooks (gitleaks, detect-secrets), and a secrets manager.

### Q59. Hooks (client-side)
Scripts in `.git/hooks/` (not versioned). Common: `pre-commit` (lint, format, secrets scan), `commit-msg` (enforce Conventional Commits), `pre-push` (run tests). Share via Husky, lefthook, pre-commit framework, or `core.hooksPath` pointing to a committed folder. Hooks can be bypassed with `--no-verify`, so also enforce in CI.

### Q60. Working with multiple remotes
```bash
git remote add upstream https://github.com/org/repo.git
git fetch upstream
git push origin main
git push upstream HEAD:refs/heads/hotfix   # push to a specific remote
```
Typical for forks (origin = your fork, upstream = the main repo).

### Q61. Worktrees
Multiple working directories from one repository, each checked out to a different branch.
```bash
git worktree add ../hotfix hotfix/payment
git worktree list
git worktree remove ../hotfix
```
Avoids stashing when switching context and lets you run two branches side by side.

### Q62. Line endings and `.gitattributes`
CRLF (Windows) vs LF (Unix) cause noisy diffs. Use `.gitattributes`: `* text=auto eol=lf`. Mark binaries: `*.png binary`. `core.autocrlf=input` on Mac/Linux, `true` on Windows (older advice; `.gitattributes` is the preferred, versioned way).

### Q63. Case-sensitivity and file renames
Windows/macOS are case-insensitive by default; renaming `File.js` to `file.js` may not register. Use `git mv File.js tmp && git mv tmp file.js`, or `git config core.ignorecase false`. Be careful with imports on Linux CI.

### Q64. Cleaning untracked files
```bash
git clean -n          # dry run
git clean -fd         # remove untracked files and directories
git clean -fdx        # also ignored files (careful!)
```

### Q65. Conflict prevention habits
Pull/rebase often, small short-lived branches, avoid mass reformatting mixed with logic changes, agree on formatter (Prettier/Black) and run it in pre-commit, split large files, communicate when touching shared areas, use CODEOWNERS.

### Q66. Dependabot and security features on GitHub
Dependabot alerts and version/security update PRs, secret scanning with push protection, code scanning (CodeQL), dependency review on PRs, private vulnerability reporting, security advisories (GHSA), SBOM export, artifact attestations. Configure with `.github/dependabot.yml`.

### Q67. GitHub CLI (`gh`)
```bash
gh auth login
gh repo clone org/repo
gh pr create --fill --reviewer teammate
gh pr checkout 123
gh pr checks ; gh pr merge --squash --delete-branch
gh issue create --title "Bug" --body "..."
gh run list ; gh run view --log-failed
```

### Q68. Markdown in GitHub, GitHub Pages
GitHub Flavored Markdown: task lists, tables, code fences with language, mentions `@user`, issue refs `#12`, emoji, Mermaid diagrams, alerts (`> [!NOTE]`). Pages hosts static sites from a branch or Actions workflow.

### Q69. What is a monorepo vs polyrepo?
Monorepo: many projects in one repo (shared tooling, atomic cross-project changes, single CI config; needs tooling like Nx, Turborepo, Bazel, path-filtered CI, sparse checkout). Polyrepo: one repo per service (clear ownership, independent releases, harder cross-repo changes).

### Q70. Forking workflow vs shared repository workflow
Shared repo: contributors have write access and push branches to the main repo (typical inside companies). Fork: contributors push to their own fork and open PRs (typical for open source, restricts access).

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. How does Git store data? (snapshots, not diffs) *(Must-know)*
Git stores content in a **content-addressable object database** (`.git/objects`). Four object types:
- **blob**: file contents.
- **tree**: a directory listing (names, modes → blobs/trees).
- **commit**: points to a root tree, parent commit(s), author, committer, message.
- **tag** (annotated): points to an object with a message and optional signature.
Each object is named by the hash of its content. Identical content is stored once. Conceptually every commit is a full snapshot; physically Git packs objects with delta compression (`.git/objects/pack`).
```bash
git cat-file -t a1b2c3d ; git cat-file -p a1b2c3d
git ls-tree HEAD
```

### Q72. Refs, branches and the packed-refs file
Branches and tags are files under `.git/refs/` (or entries in `packed-refs`) containing a commit hash. `HEAD` is a symbolic ref to a branch (`ref: refs/heads/main`). Moving a branch just rewrites that file. This is why branches are cheap.

### Q73. Fast-forward only, merge strategies and options
`git merge --ff-only` refuses a merge commit (good for linear history). Strategies: `ort` (default since 2.34, fast and handles renames), `recursive` (older), `octopus` (merge many branches), `ours` (keep our tree, record the merge). Options: `-X ours` / `-X theirs` prefer one side **only for conflicting hunks** (not the same as `-s ours`).

### Q74. Merge base and three-way merge
Git finds the **best common ancestor** (`git merge-base A B`), diffs each side against it, and combines non-overlapping changes. Overlapping changes produce conflicts. Criss-cross merges can have multiple bases; `ort` handles them better.

### Q75. `git pull --rebase`, `pull.ff` and avoiding noisy merge commits
`git pull` merges by default, creating "Merge branch 'main' of ..." commits when you have local commits. Use `git pull --rebase` or set `pull.rebase true` (and `rebase.autoStash true`) to keep a linear history. `pull.ff only` makes pull fail instead of creating accidental merges.

### Q76. Rebase `--onto`
Move a range of commits to a new base.
```bash
# feature was branched from old-feature but you want it on main
git rebase --onto main old-feature feature
```
Meaning: take commits in `old-feature..feature` and replay them onto `main`. Also used to remove a middle range of commits.

### Q77. Stacked branches and `--update-refs` (2.38+)
When PR B depends on PR A, rebasing A requires updating B. `git rebase -i --update-refs main` moves all branch pointers in the stack automatically. Tools: `git-branchless`, Graphite, `gh-stack` workflows.

### Q78. Rewriting history safely: when and how
Safe: local unpushed commits, your private feature branch (use `--force-with-lease`, tell reviewers). Unsafe: shared branches (`main`, `develop`, release). After rewriting a shared history everyone must reset or re-clone. Alternatives that do not rewrite: `revert`, follow-up commits, squash-on-merge.

### Q79. Remove a file or secret from all history
```bash
git filter-repo --path secrets.txt --invert-paths      # recommended tool
git filter-repo --replace-text replacements.txt
git push --force --all ; git push --force --tags
```
`git filter-branch` is deprecated and slow. After rewriting: rotate the credential, invalidate caches/forks/PR refs (contact GitHub support to purge cached views), and have collaborators re-clone.

### Q80. Recovering from common disasters
| Mistake | Recovery |
|---|---|
| `git reset --hard` lost commits | `git reflog` → `git reset --hard HEAD@{n}` |
| Deleted branch | `git reflog` → `git branch name <sha>` |
| Bad rebase | `git reflog` find pre-rebase HEAD, `git reset --hard ORIG_HEAD` |
| Committed to wrong branch | `git branch correct` (new branch at HEAD) then `git reset --hard HEAD~1` on the wrong one (or `git cherry-pick` + reset) |
| Dropped stash | `git fsck --unreachable \| grep commit` then `git show`/`git stash apply <sha>` |
| Force pushed over teammate | teammate's reflog or CI/clones still have the commits; push them back |

### Q81. `ORIG_HEAD`, `MERGE_HEAD`, `FETCH_HEAD`
Special refs: `ORIG_HEAD` = HEAD before a risky operation (merge, rebase, reset), handy for undoing. `MERGE_HEAD` = the commit being merged during a merge. `FETCH_HEAD` = last fetched tip(s).

### Q82. Revision syntax
`HEAD~2` (2 first-parents back), `HEAD^2` (second parent of a merge), `main@{yesterday}`, `@{-1}` (previous branch), `:/fix login` (commit message search), `a1b2c3d^{tree}`, `A..B` (reachable from B not A), `A...B` (symmetric difference).

### Q83. Sparse checkout and partial clone for big repos
```bash
git clone --filter=blob:none --sparse URL
cd repo && git sparse-checkout set services/api libs/common
```
Partial clone fetches objects lazily; sparse checkout limits working-tree files. Also `git maintenance start` for background gc/prefetch, `core.fsmonitor`, `feature.manyFiles`, and commit-graph for faster logs.

### Q84. Git performance and repository size
Large repos get slow from huge history, many files, or big binaries. Diagnose: `git count-objects -vH`, `git rev-list --objects --all | git cat-file --batch-check=...`, `git-sizer`. Fixes: LFS, `git gc --aggressive` (rarely needed), shallow/partial clone, split repo, remove large blobs with filter-repo, enable `commit-graph` and `fsmonitor`.

### Q85. `git gc`, `prune`, `fsck`
`gc` packs loose objects and prunes unreachable ones older than the expiry (2 weeks default for `prune`, reflog entries expire at 90 days/30 days unreachable). `git fsck` verifies integrity and lists dangling objects. Automatic gc runs occasionally.

### Q86. Signing commits and tags
```bash
git config --global gpg.format ssh                   # SSH signing (2.34+)
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git log --show-signature
```
GitHub shows a "Verified" badge. Branch protection can require signed commits. Vigilant mode flags unsigned commits from you.

### Q87. Authentication on GitHub
PATs (fine-grained tokens preferred, scoped per repo with expiry), SSH keys, deploy keys (read-only or write per repo), GitHub Apps (best for automation: scoped, short-lived tokens), OAuth apps, `GITHUB_TOKEN` in Actions (auto-generated per run, permissions set with `permissions:`). Enforce 2FA/SSO for orgs.

### Q88. Least-privilege `GITHUB_TOKEN` and workflow security
```yaml
permissions:
  contents: read
  pull-requests: write
```
Default to read-only. Pin third-party actions to a **commit SHA** (tags can move). Beware `pull_request_target` and untrusted input in `run:` steps (script injection via `${{ github.event.pull_request.title }}`): pass through `env` and quote. Use environments for approvals, restrict self-hosted runners to private repos, use OIDC instead of static cloud keys.

### Q89. Reusable workflows and composite actions
Reusable workflow: `on: workflow_call` with inputs/secrets, called with `uses: org/repo/.github/workflows/ci.yml@v1`. Composite action: bundle several steps in `action.yml`. Custom JavaScript/Docker actions for complex logic. Central platform repos standardize CI across teams.

### Q90. Typical CI/CD pipeline with Actions
PR: lint → unit tests → build → security scan (CodeQL, dependency review) → preview deploy. Merge to main: build artifacts/images → push to registry → deploy to staging → integration tests → manual approval → production → smoke tests → notifications. Use concurrency groups to cancel superseded runs.
```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

### Q91. Deployment strategies tied to Git
Git-based deploys: tag → release → pipeline. **GitOps** (Argo CD, Flux): the Git repo is the source of truth for desired state; controllers reconcile clusters to match; rollbacks are `git revert`. Environments via branches or directories (directories/overlays are generally preferred to long-lived env branches).

### Q92. Release branches, hotfixes and backports
Cut `release/1.4` from `main`; only bug fixes go there; tag `v1.4.0`; cherry-pick fixes from `main` (fix on main first, then backport). Hotfix: branch from the production tag, fix, tag `v1.4.1`, merge/cherry-pick back to `main` so the fix is not lost.

### Q93. Changelogs, conventional commits and automation
Conventional Commits + commitlint + release-please/semantic-release produce version bumps and `CHANGELOG.md` automatically. Squash-merge PR titles become the commit message, so enforce a PR title check.

### Q94. Handling long-running feature branches
Rebase/merge `main` frequently, break features into incremental PRs behind **feature flags**, keep CI green, agree on interfaces early. Long-lived branches cause painful merges and hidden integration bugs.

### Q95. Reviewing large diffs and generated files
Ask for splitting, review by commit, use `git diff --stat`, `-w` to ignore whitespace, `--color-moved` to spot moved code. Mark generated files with `linguist-generated` in `.gitattributes` so GitHub collapses them. Keep lockfile and generated changes separate when possible.

### Q96. Fixing a wrong author or email in history
Recent: `git commit --amend --reset-author`. Many commits: interactive rebase with `exec git commit --amend --reset-author --no-edit`, or `git filter-repo --mailmap`. Add `.mailmap` to unify identities in `git shortlog`.

### Q97. Contribution statistics and auditing
```bash
git shortlog -sn --no-merges
git log --since="1 month ago" --pretty=format:"%an" | sort | uniq -c | sort -nr
git log --stat --author=Ritesh
```
GitHub Insights/Contributors, code frequency, and audit logs (orgs) cover broader activity.

### Q98. Git and CI: shallow clones and fetch depth
Actions `checkout` uses `fetch-depth: 1` by default (fast). Use `fetch-depth: 0` when you need history (tags, changelog generation, `git describe`, bisect, diff against base).

### Q99. Handling merge queues (GitHub)
A **merge queue** serializes PR merges: each queued PR is tested on top of the latest main plus PRs ahead of it, preventing "green PR, broken main" races. Requires status checks triggered on `merge_group` events.

### Q100. Pre-merge checks vs post-merge checks
Pre-merge (required checks) must pass to merge; they keep main healthy. Post-merge jobs (deploy, long integration tests) run after merging; failures should trigger alerts and quick reverts. Balance speed vs safety: keep required checks fast (< 10 min).

### Q101. Monorepo CI optimization
Path filters (`on.push.paths`), affected-project detection (Nx `affected`, Turborepo filters, Bazel), remote caching, matrix generation from changed packages, sharded tests. Avoid running everything on every PR.

### Q102. Dependency management in Git workflows
Lockfiles committed (`package-lock.json`, `poetry.lock`), Renovate/Dependabot for updates with grouped PRs and auto-merge for patch updates when CI passes, review changelogs for majors, pin Docker base images by digest.

### Q103. Issue and PR templates
`.github/ISSUE_TEMPLATE/*.yml` (forms) and `.github/pull_request_template.md` standardize information: description, linked issue, testing steps, screenshots, checklist (tests, docs, breaking changes). Improves review quality.

### Q104. GitHub Projects, labels and automation
Projects (v2) support tables/boards, custom fields, automation, and workflows (auto-add issues, set status on PR merge). Use labels sparingly and consistently; automate triage with Actions (`actions/labeler`, `stale`).

### Q105. Forks, upstream sync and contribution etiquette
Sync fork: `git fetch upstream && git rebase upstream/main` (or GitHub "Sync fork"). Open an issue before large PRs, follow CONTRIBUTING, keep PRs focused, add tests/docs, respond to feedback, sign the CLA/DCO if required (`git commit -s` adds `Signed-off-by`).

### Q106. Conflict resolution tooling and `rerere`
`git config rerere.enabled true` records how you resolved a conflict and replays it next time (useful for long rebases or repeated merges). Tools: VS Code merge editor, `git mergetool` (vimdiff, Meld, Beyond Compare), `git checkout --ours/--theirs file` (remember: during rebase "ours" and "theirs" are swapped).

### Q107. Why "ours" and "theirs" swap during rebase
In a rebase Git replays your commits onto the other branch, so "ours" is the branch you are rebasing **onto** (upstream) and "theirs" is **your** commit being replayed. In a merge, "ours" is your current branch.

### Q108. Working with large teams: CODEOWNERS, rulesets, and permissions
Roles: read, triage, write, maintain, admin (+ custom roles on Enterprise). Use teams for access, protect main with rulesets, require review from code owners, limit admins' bypass, audit via logs. Principle of least privilege.

### Q109. Git internals for debugging: plumbing commands
`git hash-object`, `git cat-file`, `git ls-files -s`, `git write-tree`, `git commit-tree`, `git update-ref`, `git rev-parse`, `git rev-list`, `git for-each-ref`, `git show-ref`. Porcelain commands (`add`, `commit`, `merge`) are built from them.

### Q110. Git LFS and large file alternatives
LFS for binaries that change; DVC for ML datasets; artifact registries for build outputs; object storage links in docs. Do not store build artifacts or `node_modules` in Git.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. How does `git merge` actually combine files? (ort internals overview)
`ort` computes tree-level changes between base and each side, detects renames by similarity (default 50%), then merges file contents with a three-way text merge (diff3-style) for paths changed on both sides. Directory renames can be detected. Conflicts are written as markers, and the index stores three stages (1=base, 2=ours, 3=theirs) for conflicted paths (`git ls-files -u`).

### Q112. The index in detail
`.git/index` is a binary file listing path, mode, blob hash, stage number, timestamps and size. It makes `git status` and `git commit` fast (stat cache). Features: intent-to-add (`git add -N`), assume-unchanged / skip-worktree flags, untracked cache, split index, sparse index.

### Q113. Packfiles and delta compression
`git gc` creates packfiles storing objects as full base objects plus deltas (similar objects, not necessarily adjacent versions). Packs have `.idx` index files for lookup. Network transfers use packfiles too (smart protocol: negotiation of haves/wants, then a thin pack). Bitmaps and multi-pack-index speed up large servers.

### Q114. SHA-1, SHA-256 and collisions
Git historically uses SHA-1; SHAttered (2017) showed practical collisions, and Git uses collision-detecting SHA-1 (`sha1dc`). SHA-256 repositories exist (`git init --object-format=sha256`) but interoperability with hosting services is limited. Signed commits/tags provide stronger integrity guarantees.

### Q115. Git protocols and transports
Local, HTTP(S) (smart protocol v2), SSH, and the `git://` protocol. v2 reduces ref advertisement overhead (important for repos with many refs). Bundles (`git bundle`) allow offline transfer. `git archive` exports a tree without history.

### Q116. Designing a branching and release strategy for a team
Questions to ask: release frequency, number of supported versions, deployment automation, team size/maturity, regulatory needs. Small team + continuous deploy → trunk-based or GitHub Flow with flags. Multiple supported versions (on-prem, mobile) → release branches with backports. Document rules, automate enforcement (rulesets, CI), and revisit as the team changes.

### Q117. Trunk-based development requirements
Strong automated tests, fast CI, feature flags (separate deploy from release), small frequent merges, code review that is quick, branch-by-abstraction for large refactors, ability to revert quickly, and observability to catch regressions. Without these, trunk-based becomes risky.

### Q118. Feature flags and Git
Flags let unfinished code live on main safely. Manage lifecycle: create, default off, roll out gradually, remove (delete dead flags in follow-up PRs). Tools: LaunchDarkly, Unleash, OpenFeature, config-based flags. Flags add testing and complexity costs.

### Q119. Monorepo strategy at scale
Benefits: atomic refactors, shared tooling, consistent dependencies. Needs: code ownership (CODEOWNERS), build system with caching and affected analysis, trunk-based flow, sparse checkout/VFS or partial clones, fast CI sharding, strict dependency boundaries (lint rules), and clear contribution rules. Examples: Google (Piper), Meta (Sapling), Microsoft (VFS for Git/Scalar).

### Q120. Scalar, Sapling and big-repo tooling
**Scalar** (bundled in Git 2.38+) configures partial clone, sparse checkout, commit-graph, maintenance and fsmonitor for large repos: `scalar clone URL`. Sapling and Jujutsu are alternative VCS clients with different workflows and Git interop. Know they exist; use based on scale.

### Q121. Automating repository governance
Rulesets as code (Terraform GitHub provider, `gh api`), repo templates, standardized `.github` org repo (default community files, workflows), required workflows, settings-as-code (Probot Settings), periodic audits for stale repos, branch protection drift detection.

### Q122. Supply chain security in GitHub workflows
Pin actions to SHAs, use Dependabot for actions, restrict allowed actions at org level, generate provenance (SLSA, `actions/attest-build-provenance`), sign artifacts (Sigstore/cosign), SBOMs, dependency review, protected environments, ephemeral runners, least-privilege tokens, and review `pull_request_target` carefully.

### Q123. Handling a leaked credential in a public repo (incident steps)
1. Revoke/rotate the credential immediately.
2. Assess impact via provider audit logs.
3. Remove from history (filter-repo) and force push; request GitHub support to purge cached refs/PRs.
4. Enable secret scanning + push protection and pre-commit scanning.
5. Post-incident review and training.
Assume the secret was harvested within minutes.

### Q124. Git hooks for governance on the server side
Self-hosted Git servers support `pre-receive`/`update` hooks (reject bad pushes: large files, missing sign-off, force pushes). On GitHub use rulesets/branch protection, required checks, push rules (file path, size, file extension restrictions in rulesets) and Actions.

### Q125. Rebase vs merge: team policy trade-offs
Rebase/squash: linear, easy `bisect` and revert, but loses original granular commits and requires force-push discipline on feature branches. Merge commits: preserve actual development history and parallel work, but graphs get complex and bisect can be harder. Choose one team default, document it, enforce via repo settings.

### Q126. Bisect with merges and flaky tests
`git bisect --first-parent` follows mainline merge commits only. For flaky tests, run the test multiple times in the script and treat inconsistent results carefully; return exit code 125 to skip untestable commits.
```bash
git bisect run sh -c 'make build || exit 125; ./run_test.sh'
```

### Q127. Reproducible builds and Git metadata
Embed `git describe --tags --always --dirty` in builds for traceability. Use tags for releases and record the commit SHA in artifacts and container image labels (`org.opencontainers.image.revision`). Ensure CI fetches tags.

### Q128. Handling binary merge conflicts
Binary files cannot be text-merged. Choose one side (`git checkout --ours/--theirs file`), coordinate with locking (Git LFS file locking: `git lfs lock`), or use format-specific merge drivers. Prefer avoiding concurrent edits to binaries.

### Q129. Submodules in practice and pitfalls
Pitfalls: forgetting to commit the updated pointer, detached HEAD inside the submodule, CI not initializing submodules, credentials for private submodules. Mitigate with `git submodule update --init --recursive`, `submodule.recurse true`, Dependabot for submodules, or replace with package dependencies.

### Q130. Patches by email
`git format-patch -3` creates `.patch` files; `git am` applies them preserving authorship; `git send-email` sends to mailing lists (Linux kernel workflow). Useful when pull requests are not available.

### Q131. Understanding `git status` and `git ls-files` internals
`status` compares HEAD ↔ index ↔ working tree (three-way). Untracked cache and `fsmonitor` accelerate it. `git ls-files -m -o --exclude-standard` shows modified and untracked files.

### Q132. Patch-based vs snapshot-based VCS
Git stores snapshots and derives diffs; merge and rename detection happen at merge time (heuristic). Darcs/Pijul are patch-theory systems. This explains why Git does not "track renames" explicitly but detects them by similarity.

### Q133. Rename detection and file history
`git log --follow` and `-M`/`-C` flags detect renames/copies. Large refactors with heavy edits may break detection. Do pure renames in separate commits from content changes to preserve history.

### Q134. Commit hygiene at scale
Atomic commits (one logical change), each builds and passes tests (enables bisect), no WIP/debug code, no unrelated formatting. Tools: `git rebase -i`, `git add -p`, commitlint, pre-commit.

### Q135. Git in CI for pull requests: merge ref vs head ref
GitHub creates `refs/pull/N/merge` (the PR merged into base) and `refs/pull/N/head`. `pull_request` events check out the merge ref by default, testing what would happen after merge. Be aware when debugging "passes locally, fails in CI".

### Q136. Monitoring repository health
Track PR cycle time, review latency, CI duration/flakiness, merge conflicts frequency, size of PRs, stale branches, build breakage time-to-fix (DORA metrics: deployment frequency, lead time, change failure rate, MTTR).

### Q137. Archiving, mirroring and migrating repositories
Mirror: `git clone --mirror` then `git push --mirror` (all refs). Migration between hosts: mirror push, then migrate issues/PRs with provider tools (GitHub Enterprise Importer), update CI, webhooks, branch rules, secrets. Archive old repos (read-only) instead of deleting.

### Q138. GitHub Enterprise considerations
SSO/SAML, audit log streaming, enterprise-managed users, org policies, IP allow lists, GHES vs GHEC, runners at scale (ARC on Kubernetes), cost controls for Actions minutes, and Advanced Security licensing.

### Q139. Self-hosted runners and scaling
Use ephemeral, autoscaled runners (Actions Runner Controller, cloud autoscalers) in isolated networks. Never use persistent self-hosted runners for public repos (untrusted PR code). Cache dependencies, use larger runners for builds, and monitor queue time.

### Q140. Common Git anti-patterns in teams
Giant PRs, force-pushing shared branches, committing generated files/secrets, "fix fix fix" histories merged unsquashed, long-lived env branches, no CI, bypassing hooks, using `git add .` blindly, resolving conflicts by taking one side without understanding, no code owners.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do you choose a Git workflow for an organization?
Assess delivery model (SaaS continuous vs versioned releases), team size and distribution, test and CI maturity, compliance (approvals, traceability), and risk tolerance. Prefer the simplest workflow that satisfies them: usually trunk-based or GitHub Flow with flags. Pilot with one team, measure DORA metrics, then standardize.

### Q142. Designing repository structure across many teams
Decide monorepo vs polyrepo by coupling and release independence. Provide templates, shared CI workflows, naming conventions, CODEOWNERS, docs (README/ARCHITECTURE/ADRs), standard branch rules, and a platform team for tooling. Avoid both extremes: hundreds of tiny unmaintained repos or a monorepo without tooling.

### Q143. Governance at scale with rulesets and automation
Org-level rulesets require reviews, signed commits (if needed), status checks, and block force pushes. Use repo creation templates with defaults, automated drift detection, periodic access reviews, and an exceptions process documented in ADRs.

### Q144. Securing the software supply chain end to end
Code (CODEOWNERS, reviews, signed commits) → build (hermetic, ephemeral runners, pinned actions, provenance) → artifacts (signing, SBOMs, registry policies) → deploy (admission control verifying signatures) → runtime. Frameworks: SLSA levels, OpenSSF Scorecard, Sigstore. Communicate risk in business terms.

### Q145. Improving developer productivity with Git and CI
Fast CI (< 10 min), caching, affected-only tests, merge queues, preview environments, good templates, bots for chores (Dependabot/Renovate/labeler), clear contribution docs, pre-commit hooks that are fast, and measuring friction through surveys and cycle-time metrics.

### Q146. Managing technical debt in repositories
Delete dead branches and stale PRs automatically, archive unused repos, reduce repo size (LFS/filter-repo), consolidate duplicated CI, standardize tooling versions, enforce formatting via CI, and schedule maintenance time.

### Q147. Incident handling involving Git
Bad deploy: revert the PR/merge commit (fast, auditable), redeploy, then fix forward. Force-push accident: restore from reflog/CI clone, enable rule blocking force push, run postmortem. Leaked secret: Q123 steps. Keep runbooks and practice (game days).

### Q148. Release management across multiple products
Version policy (SemVer/CalVer), release trains, tags and release notes automation, backport policy, support windows (LTS), compatibility testing matrix, communication to stakeholders, and rollback plans. Keep changelogs generated from commits/PR titles.

### Q149. Mentoring teams on Git
Teach the mental model (three areas, DAG, pointers) before commands. Provide a "Git cheat sheet" and a safe-sandbox exercise (reflog recovery, interactive rebase, conflict drills). Normalize asking before force-pushing. Review PRs as teaching moments.

### Q150. Cost and risk of tools
Evaluate GitHub vs GitLab vs Bitbucket vs self-hosted on features (CI, security, packages), compliance/data residency, pricing at scale (seats, Actions minutes, storage), ecosystem/integrations, migration cost, and vendor risk. Avoid lock-in in CI by keeping logic in scripts/containers (Makefile, Taskfile, Dagger) with thin workflow wrappers.

### Q151. Working across time zones
Small PRs, async-friendly descriptions, clear ownership, review SLAs, follow-the-sun reviewers, CODEOWNERS fallbacks, merge queues for ordering, and written decisions (ADRs, PR discussions).

### Q152. Open source maintenance practices
Clear governance and contribution guides, issue/PR templates, triage labels, CI on all PRs, security policy and advisories, semantic versioning with changelogs, release automation, and a welcoming Code of Conduct. Plan for maintainer burnout with delegation and bots.

### Q153. Data protection and compliance for repos
No personal data or secrets in repos, retention policies, audit logging, access reviews, region/data residency options (GHEC data residency), legal holds, and export controls for regulated code. Document processes for auditors.

### Q154. When Git is not the right tool
Large binary assets (use LFS or asset management), huge datasets (DVC/data lake), real-time collaboration (docs tools), database state (migrations tools). Git is for text source code and configuration.

### Q155. Interview approach: explain Git without jargon
"Git saves snapshots of my project. A branch is a bookmark pointing to a snapshot. Merge combines two lines of work; rebase moves my work on top of the latest. If I make a mistake, reflog remembers where I was." Clear explanations show depth.

---

# 💻 Part 6: Hands-On Tasks & Scenarios

### H1. Start a project and push to GitHub
```bash
mkdir myapp && cd myapp
git init -b main
echo "# MyApp" > README.md
git add README.md && git commit -m "chore: initial commit"
gh repo create myapp --private --source=. --push        # or add remote manually
```

### H2. Feature branch → PR → merge workflow
```bash
git switch main && git pull
git switch -c feature/profile-page
# ...edit...
git add -p && git commit -m "feat(profile): add profile page"
git push -u origin feature/profile-page
gh pr create --fill
# after approval and green checks:
gh pr merge --squash --delete-branch
git switch main && git pull && git branch -d feature/profile-page
```

### H3. Squash the last 4 commits into one
```bash
git rebase -i HEAD~4       # mark the last 3 as "squash" or "fixup"
# or without the editor:
git reset --soft HEAD~4 && git commit -m "feat: complete profile page"
```

### H4. Move recent commits to a new branch (committed on main by mistake)
```bash
git branch feature/oops          # new branch at current commit
git reset --hard origin/main     # move main back to remote state
git switch feature/oops
```
Only safe if `main` commits were not pushed. Check with `git status` / `git log origin/main..main` first.

### H5. Fix a typo in an older commit message
```bash
git rebase -i HEAD~5      # change "pick" to "reword" on that commit
git push --force-with-lease     # only if the branch was pushed and is yours
```

### H6. Split one big commit into two
```bash
git rebase -i HEAD~1        # mark "edit"
git reset HEAD~1            # unstage everything, keep changes
git add -p ; git commit -m "refactor: extract helper"
git add -p ; git commit -m "feat: use helper in checkout"
git rebase --continue
```

### H7. Resolve a merge conflict step by step
```bash
git merge main                         # CONFLICT in app.js
git status                             # "both modified: app.js"
# edit app.js: keep correct code, delete <<<<<<< ======= >>>>>>> markers
git add app.js
git commit                             # or: git merge --continue
```

### H8. Undo a bad merge already pushed to main
```bash
git revert -m 1 <merge-commit-sha>
git push origin main
```

### H9. Recover a deleted branch
```bash
git reflog | grep feature/payments
git branch feature/payments <sha>
```

### H10. Find who introduced a bug and when
```bash
git bisect start
git bisect bad HEAD
git bisect good v2.3.0
git bisect run npm test
git bisect reset
```

### H11. Apply a hotfix to production and back to main
```bash
git switch -c hotfix/payment-rounding v2.3.0
# fix + test
git commit -am "fix(payment): round to 2 decimals"
git tag -a v2.3.1 -m "Hotfix 2.3.1"
git push origin hotfix/payment-rounding v2.3.1
git switch main && git cherry-pick <fix-sha>
```

### H12. Keep a fork in sync
```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git switch main
git rebase upstream/main        # or merge
git push origin main --force-with-lease
```

### H13. Remove a committed file but keep it locally
```bash
echo ".env" >> .gitignore
git rm --cached .env
git commit -am "chore: stop tracking .env"
```
If it had secrets: rotate them and purge history (Q79).

### H14. Compare what a PR changes vs what changed on main since branching
```bash
git fetch
git diff origin/main...HEAD            # your branch's changes since the merge base
git diff HEAD...origin/main            # what main changed that you do not have
```

### H15. A complete GitHub Actions CI + deploy workflow
```yaml
name: ci-cd
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage }

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production        # can require manual approval
    permissions:
      id-token: write              # OIDC to cloud
      contents: read
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh
        env:
          APP_VERSION: ${{ github.sha }}
```

### H16. Pre-commit hook that blocks secrets and runs lint (simple)
```bash
#!/usr/bin/env bash
# .githooks/pre-commit   (enable: git config core.hooksPath .githooks)
set -e
if git diff --cached -U0 | grep -E "(AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC) PRIVATE KEY-----)"; then
  echo "Possible secret detected. Commit blocked." >&2
  exit 1
fi
npx --no-install lint-staged
```

### H17. Write a `.gitignore` for a Node + React project
```
node_modules/
dist/
build/
coverage/
.env
.env.*
!.env.example
*.log
.DS_Store
.vscode/*
!.vscode/extensions.json
```

### H18. Clean up merged local branches
```bash
git fetch --prune
git branch --merged main | grep -vE "^\*|main|develop" | xargs -r git branch -d
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `! [rejected] main -> main (non-fast-forward)`
The remote has commits you do not have. `git pull --rebase` (or merge), resolve conflicts, push again. Do not force-push to fix it on shared branches.

### D2. `fatal: refusing to merge unrelated histories`
Two repos with no common ancestor (for example, a local `git init` plus a GitHub repo created with a README). Fix: `git pull origin main --allow-unrelated-histories`, or better, clone the remote first.

### D3. `error: failed to push some refs ... protected branch`
Branch protection blocks direct pushes. Create a branch and open a PR; check required reviews/checks.

### D4. `Permission denied (publickey)` / `Authentication failed`
SSH: ensure the key is loaded (`ssh-add -l`), uploaded to GitHub, and the remote URL is SSH; test `ssh -T git@github.com`. HTTPS: use a PAT or credential manager (passwords are no longer accepted); SSO orgs need the token authorized for SAML.

### D5. Committed to the wrong branch
See H4. If already pushed to a shared branch, `revert` instead.

### D6. `detached HEAD` warning after checking out a tag
Create a branch if you want to commit: `git switch -c hotfix/from-tag`. To leave without keeping changes: `git switch main`.

### D7. `.gitignore` not ignoring a file
The file is already tracked. `git rm --cached file`; check patterns with `git check-ignore -v file`; check nested `.gitignore`s and negation rules.

### D8. Huge repository / slow clone
Find big blobs (`git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n | tail`), remove with `filter-repo`, move assets to LFS, use shallow/partial clones in CI.

### D9. Merge conflict in `package-lock.json`
Do not hand-merge. Resolve `package.json`, then run `npm install` to regenerate the lock file (or `git checkout --theirs package-lock.json && npm install`), and commit the result.

### D10. CI passes locally but fails in GitHub Actions
Differences: OS (case sensitivity, line endings), Node/Python version, missing env vars/secrets, untracked files ignored locally, caching, network, timezones, tests relying on order. Reproduce with `act` or the same container image; inspect with `gh run view --log-failed`.

### D11. Workflow does not trigger
Check `on:` filters (branches, paths), file location (`.github/workflows/`), YAML validity, event type (`pull_request` from forks lacks secrets), Actions disabled in settings, commit message `[skip ci]`, or workflow only present on a non-default branch (for `workflow_dispatch`/`schedule`).

### D12. `CONFLICT (modify/delete)`
One branch edited a file that the other deleted. Decide: keep the file (`git add file`) or accept deletion (`git rm file`), then continue.

### D13. Lost changes after `git checkout .` or `git restore .`
Uncommitted changes discarded by checkout are not in reflog. Recovery is unlikely unless stashed or staged earlier (staged blobs may exist as dangling objects: `git fsck --lost-found`). Prevention: commit or stash often.

### D14. Pull request shows too many files/commits
The branch was created from the wrong base or main was merged messily. Rebase onto the right base (`git rebase --onto main <old-base> feature`) or create a clean branch and cherry-pick.

### D15. Line-ending warnings ("LF will be replaced by CRLF")
Add `.gitattributes` (`* text=auto eol=lf`), normalize once (`git add --renormalize .`) in a dedicated commit, and agree on editor settings.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `git branch` copy files?
No. It creates a new pointer to an existing commit. That is why branching is instant and cheap.

### T2. If I delete a branch, are commits deleted?
Only the pointer is deleted. Commits remain until unreachable and garbage-collected; reflog can recover them for a while.

### T3. What is the difference between `git fetch` + `git merge` and `git pull`?
Nothing in outcome by default; `pull` is a shortcut. `fetch` alone is safe since it changes only remote-tracking refs.

### T4. Why do hashes change after a rebase?
A commit's hash covers its content, parent hash and metadata. Changing the parent (new base) changes the hash, so rebased commits are **new commits** even if the diff is identical.

### T5. Does `git revert` delete history?
No. It adds a new commit with the inverse changes. History stays intact.

### T6. Is `git reset --hard` always destructive?
It discards uncommitted changes (not recoverable) but committed work can be recovered via reflog. Staged-but-uncommitted blobs may be recoverable via `fsck`.

### T7. Can you have two branches pointing to the same commit?
Yes. Branches are independent pointers; they diverge when you commit on one.

### T8. What does `git add .` stage in a subdirectory?
Since Git 2.0, it stages changes in the current directory and below (including deletions). `git add -A` stages the whole repository. Be careful with `.` at the wrong level.

### T9. `git stash` and untracked files
By default, untracked files are not stashed. Use `-u` (untracked) or `-a` (all, including ignored).

### T10. What is the difference between `HEAD`, `head` and `origin/HEAD`?
`HEAD` = your current checkout. `head` as a word usually means the tip of a branch (`refs/heads/*`). `origin/HEAD` = the remote's default branch pointer (`origin/main`).

### T11. Is a Git tag immutable?
Not technically: tags can be moved or deleted (`git tag -f`, `git push --force origin tag`), but it is bad practice. Treat release tags as immutable; protect with tag rulesets.

### T12. Why can't I push an empty directory?
Git tracks files, not directories. Add a placeholder (`.gitkeep`) file.

### T13. What happens to local changes when I `git switch` to another branch?
If the changes do not conflict with the target branch's files, they carry over. If they would be overwritten, Git refuses and asks you to commit, stash or discard (`git switch -m` attempts a merge).

### T14. Is rebase safe if I use it correctly?
Yes, on private branches. The risk is rewriting shared history and causing duplicates/conflicts for others. Use `--force-with-lease` and communicate.

### T15. What does `git merge --squash` do to history?
It stages the combined changes but makes no merge commit and records no second parent, so Git does not know the branch was merged. Delete the branch afterward and do not merge it again.

### T16. Why do two developers see different `git log` outputs on the same branch?
They have different local states (unfetched commits, rewritten history, different filters), or are viewing different refs/ordering options. `git fetch` and compare `origin/branch`.

### T17. Do forks share history with the original?
Yes, a fork starts as a copy with the same commits, then diverges. GitHub tracks the fork network and shares object storage, which also means commits pushed to a fork can be viewable via the parent's URL (important for leaked secrets).

### T18. What is a "dangling" commit?
A commit not reachable from any ref (branch, tag, stash, reflog). It is eligible for garbage collection after expiry. `git fsck --lost-found` lists them.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Git is …?** A distributed version control system.
- **GitHub is …?** A hosting/collaboration platform for Git repos.
- **Three areas?** Working directory, staging area (index), repository.
- **Create a repo?** `git init`. **Copy a repo?** `git clone`.
- **Stage / commit / push?** `git add` / `git commit` / `git push`.
- **Download without merging?** `git fetch`.
- **Download and merge?** `git pull`.
- **Create & switch branch?** `git switch -c name`.
- **Combine branches?** `git merge` or `git rebase`.
- **Unstage a file?** `git restore --staged file`.
- **Discard local edits?** `git restore file`.
- **Undo last commit, keep changes?** `git reset --soft HEAD~1`.
- **Safe undo of pushed commit?** `git revert`.
- **Temporarily save work?** `git stash`.
- **Find lost commits?** `git reflog`.
- **Find the buggy commit?** `git bisect`.
- **Who changed this line?** `git blame`.
- **Apply one commit elsewhere?** `git cherry-pick`.
- **Mark a release?** `git tag -a`.
- **Ignore files?** `.gitignore`.
- **Large binaries?** Git LFS.
- **Safe force push?** `--force-with-lease`.
- **Fast-forward merge?** Branch pointer moves, no merge commit.
- **Detached HEAD?** HEAD on a commit, not a branch.
- **PR stands for?** Pull request.
- **Auto-close issue from PR?** `Fixes #123`.
- **Who must review files?** CODEOWNERS.
- **CI/CD on GitHub?** GitHub Actions.
- **Workflow location?** `.github/workflows/*.yml`.
- **Dependency update bot?** Dependabot / Renovate.
- **Secret leaked?** Rotate first, then purge history.
- **Linear history option?** Rebase/squash merge.
- **Sign commits?** GPG or SSH signing.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Describe your Git workflow on a team.
"We use GitHub Flow with short-lived branches. I branch from `main`, make small atomic commits with Conventional Commit messages, rebase on `main` before opening a PR, and fill the PR template. CI runs lint, tests and security scans. After review, we squash and merge, and deployments run from `main`."

### P2. Tell me about a time you resolved a hard merge conflict.
STAR: two teams refactored the same module. I met with the other developer, agreed which behavior was correct, resolved conflicts in small steps, wrote tests to confirm the merged behavior, and then proposed splitting the module and CODEOWNERS to reduce future collisions.

### P3. Have you ever lost work in Git? How did you recover?
Example: bad `reset --hard` during a rebase. Used `git reflog` to find the previous HEAD, reset to it, and compared with `git diff`. Lesson: create a backup branch before risky history edits (`git branch backup/pre-rebase`).

### P4. How do you review pull requests?
Understand intent first (description, linked issue), read tests, check design and edge cases, security and performance, run it if needed, comment with suggestions and reasons, label blocking vs nit, approve when the risk is acceptable. Respond quickly to keep cycle time low.

### P5. How do you handle a teammate force-pushing over your work?
Stay calm, recover from reflog or your local clone, push back the commits, discuss the incident without blame, and add branch protections and `--force-with-lease` guidance.

### P6. Tell me about improving a CI/CD pipeline.
Example: reduced CI from 25 to 8 minutes by caching dependencies, running tests in parallel shards, skipping unaffected packages, and cancelling superseded runs. Measured developer wait time and flaky test rate before and after.

### P7. How do you teach Git to new team members?
Short mental-model session (snapshots, branches as pointers, three areas), a practice repo with exercises (conflict, reflog, interactive rebase), a team cheat sheet, and pairing on their first PRs.

### P8. How do you decide when to rebase vs merge?
"Rebase my own feature branch to keep it current and linear before review; never rebase shared branches. Merge (or squash) into main according to the team's policy."

---

# 📚 Part 11: Complete Coverage (Git + GitHub + Mixed)

## Git
- **Fundamentals:** DVCS concepts, three areas, commits, branches, HEAD, tags, remotes, config, aliases.
- **Daily commands:** status, add, commit, diff, log, show, switch/checkout, restore, reset, revert, stash, clean, rm, mv.
- **Integration:** fetch, pull, push, merge (ff, no-ff, squash), rebase (interactive, onto), cherry-pick, conflicts, rerere.
- **History tools:** log filters, blame, bisect, reflog, shortlog, describe, grep, pickaxe (-S/-G), range-diff.
- **Advanced:** worktrees, submodules/subtrees, sparse checkout, partial/shallow clone, LFS, hooks, attributes, filter-repo, bundle, archive, notes, maintenance/scalar.
- **Internals:** objects (blob/tree/commit/tag), refs, index, packfiles, gc, protocols, hashing, plumbing.
- **Workflows:** centralized, feature branch, Git Flow, GitHub Flow, trunk-based, forking, stacked PRs, release branching, hotfixes.

## GitHub
- **Collaboration:** repos, forks, PRs (draft, review, suggestions, merge queue), issues, discussions, projects, wikis, labels, milestones, releases, Pages, Codespaces.
- **Governance:** orgs, teams, roles, CODEOWNERS, branch protection, rulesets, templates, community files.
- **Automation:** Actions (workflows, jobs, matrices, caching, artifacts, environments, OIDC, reusable workflows), Apps, webhooks, GitHub CLI, REST/GraphQL APIs, Probot.
- **Security:** 2FA/SSO, tokens, secret scanning, push protection, code scanning (CodeQL), Dependabot, dependency review, advisories, attestations.
- **Packages:** GitHub Packages (npm, containers, Maven, NuGet), container registry (ghcr.io).
- **AI features:** Copilot suggestions, chat, PR summaries, code review assistance (verify output; treat as a helper, not an approver).

## Mixed topics
- Git + DevOps: GitOps, IaC in repos (Terraform, Helm), Argo CD/Flux, environment promotion, rollbacks via revert.
- Git + testing: required status checks, test sharding, coverage gates, flaky test quarantine.
- Git + security: signed commits, secret scanning, SLSA provenance, least privilege tokens.
- Git + docs: docs-as-code, ADRs, changelogs, README standards, generated API docs on release.
- Git + data/ML: DVC, LFS, model registries, notebooks diffs (`nbdime`), reproducibility with commit SHAs.
- Git + project management: issue linking, release notes, conventional commits, roadmaps via Projects.

---

# 🔬 Part 12: Git Internals

### I1. Inside `.git`
```
.git/
├─ HEAD            # ref: refs/heads/main
├─ config          # repo-level config
├─ index           # staging area
├─ objects/        # blobs, trees, commits, tags (loose + pack/)
├─ refs/           # heads/, tags/, remotes/
├─ logs/           # reflog data
├─ hooks/          # sample hooks
└─ packed-refs
```

### I2. Creating a commit by hand (plumbing demo)
```bash
echo "hello" | git hash-object -w --stdin          # blob, prints hash
git update-index --add --cacheinfo 100644,<blob>,hello.txt
git write-tree                                      # tree hash
git commit-tree <tree> -m "manual commit"           # commit hash
git update-ref refs/heads/demo <commit>
```
This shows Git is "just" objects and refs.

### I3. Content-addressable storage
Object ID = hash(`<type> <size>\0<content>`). Same content → same ID → deduplication. Changing any byte changes the ID, which changes parent commits' IDs: a Merkle DAG that makes history tamper-evident.

### I4. How `git diff` is computed
Diffs are computed on demand between two trees/blobs using a diff algorithm: Myers (default), minimal, patience, histogram (`diff.algorithm histogram` often gives clearer diffs for code). Not stored.

### I5. The reflog internals
Per-ref log files under `.git/logs/` record old and new SHA, who, when and why. Local only, not pushed; entries expire (90 days reachable, 30 days unreachable by default).

### I6. How `git push` works (smart protocol)
Client asks the server for its refs, computes which objects the server lacks, builds a packfile of missing objects, sends it with ref update commands; the server verifies (hooks, rules, fast-forward checks) and updates refs atomically per ref. `--force` skips the fast-forward check; `--force-with-lease` adds an expected-old-value check.

### I7. How `git fetch` works
Negotiation: client advertises commits it has ("haves"), server computes what is needed ("wants"), sends a packfile. Remote-tracking refs update according to the refspec `+refs/heads/*:refs/remotes/origin/*`. `--prune` removes stale remote-tracking refs.

### I8. Refspecs
`<src>:<dst>` mapping. Examples: `git push origin local:remote`, `git push origin :old-branch` (delete), `git fetch origin pull/123/head:pr-123` (fetch a GitHub PR).

### I9. Git attributes and filters
`.gitattributes` controls per-path behavior: text/eol normalization, `binary`, merge drivers, diff drivers (`*.pdf diff=pdf`), LFS filters (clean/smudge), `export-ignore` for archives, `linguist-*` for GitHub stats.

### I10. Rename and copy detection
Not stored explicitly. At diff/merge/log time, Git compares added and deleted files for similarity (≥ 50% by default) to infer renames. This is why mixing rename + heavy edit in one commit can lose history linkage.

---

# 📊 Part 13: Reference Tables

### Undo cheat table
| I want to… | Command |
|---|---|
| Discard working changes to a file | `git restore file` |
| Unstage | `git restore --staged file` |
| Amend last commit | `git commit --amend` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` |
| Undo last commit and changes | `git reset --hard HEAD~1` |
| Undo a pushed commit | `git revert <sha>` |
| Return to a previous state found in reflog | `git reset --hard HEAD@{n}` |
| Abort in-progress merge / rebase / cherry-pick | `git merge --abort` / `git rebase --abort` / `git cherry-pick --abort` |

### Merge vs rebase vs squash
| | Merge | Rebase | Squash merge |
|---|---|---|---|
| History | non-linear, complete | linear | linear, one commit per PR |
| Rewrites commits | no | yes | creates a new combined commit |
| Safe on shared branches | yes | no | yes (as the merge action) |
| Bisect friendliness | medium | good | very good |
| Keeps individual commits | yes | yes | no |

### Branching strategies
| Strategy | Branches | Best for |
|---|---|---|
| Git Flow | main, develop, feature, release, hotfix | versioned releases |
| GitHub Flow | main + short feature branches | continuous deployment |
| Trunk-based | main (+ very short branches) + flags | high-performing CI/CD teams |
| Forking | forks + PRs | open source |

### Common Git config
| Setting | Purpose |
|---|---|
| `pull.rebase true` | avoid merge commits on pull |
| `fetch.prune true` | clean stale remote branches |
| `rerere.enabled true` | reuse conflict resolutions |
| `push.autoSetupRemote true` | no `-u` needed on first push |
| `merge.conflictstyle zdiff3` | show base in conflicts |
| `diff.algorithm histogram` | better diffs |
| `init.defaultBranch main` | default branch name |
| `commit.gpgsign true` | sign commits |

### GitHub Actions events and keys
| Item | Examples |
|---|---|
| Events | `push`, `pull_request`, `workflow_dispatch`, `schedule`, `release`, `workflow_call`, `merge_group` |
| Contexts | `github`, `env`, `secrets`, `vars`, `matrix`, `needs`, `runner` |
| Job keys | `runs-on`, `needs`, `if`, `strategy`, `environment`, `permissions`, `concurrency`, `timeout-minutes` |
| Common actions | `checkout`, `setup-node`, `cache`, `upload-artifact`, `github-script`, `codeql-action` |

### Conventional commit types
| Type | Meaning | SemVer |
|---|---|---|
| `feat` | new feature | minor |
| `fix` | bug fix | patch |
| `perf`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `style` | no API change | none |
| `BREAKING CHANGE` / `!` | breaking | major |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```bash
git init demo && cd demo
echo a > f && git add f && git commit -m "one"
echo b >> f && git add f
echo c >> f
git status -s
```
**Output:** `MM f`. The file is modified in the index (`M` first column) and modified again in the working tree (`M` second column).

### O2.
```bash
git log --oneline
# c3 Add C
# b2 Add B
# a1 Add A
git reset --soft HEAD~2
git log --oneline
git status -s
```
**Output:** log shows only `a1 Add A`. Status shows the changes from B and C staged (`M` or `A` in the first column).

### O3.
```bash
git branch feature
git switch feature
git commit --allow-empty -m "x"
git switch main
git merge feature
```
**Result:** fast-forward (main moved to the commit "x"); output includes `Fast-forward`. No merge commit.

### O4.
`main`: A-B-C; `feature` (from B): B-D. `git switch main && git merge feature` creates what?
**Answer:** A three-way merge commit M with parents C and D (diverged histories).

### O5.
```bash
git rebase main     # on feature, where main has 2 new commits and feature has 3
```
**Result:** feature's 3 commits are replayed after main's tip; they get new hashes; linear history; main is unchanged.

### O6. Range syntax
`git log main..feature` lists commits reachable from `feature` but not `main`. `git log main...feature` lists commits reachable from either but not both.

### O7.
```bash
git stash
git stash list
```
**Output:** `Saved working directory and index state WIP on main: <sha> <msg>` and `stash@{0}: WIP on main: <sha> <msg>`.

### O8. What does `HEAD~2` equal after commits A-B-C-D (HEAD at D)?
**Answer:** B.

### O9.
```bash
git tag v1
git push origin main
```
**Result:** The tag is not pushed. You need `git push origin v1` or `--tags`.

### O10.
```bash
git commit --amend -m "new message"
git log --oneline -1
```
**Result:** The last commit has a new hash and the new message (old commit remains in reflog).

### O11. `.gitignore` check
```
*.log
!keep.log
logs/
```
**Result:** `app.log` ignored, `keep.log` not ignored, everything inside `logs/` ignored. Negation fails if the parent directory is ignored.

### O12. Fast question
`git checkout -b fix main` does what?
**Answer:** Creates branch `fix` starting at `main` and switches to it.

---

# ✅ Part 15: MCQs

**1. Which command downloads changes without merging them?**
A) `git pull`  B) `git fetch`  C) `git merge`  D) `git clone`
**Answer: B**

**2. Which command safely undoes a pushed commit?**
A) `git reset --hard`  B) `git revert`  C) `git clean`  D) `git rebase --abort`
**Answer: B**

**3. What is HEAD?**
A) The first commit  B) A pointer to the current branch/commit  C) The remote server  D) The staging area
**Answer: B**

**4. A fast-forward merge:**
A) Always creates a merge commit  B) Moves the branch pointer without a merge commit  C) Rewrites history  D) Deletes the branch
**Answer: B**

**5. Which is the safest force push?**
A) `git push -f`  B) `git push --force-with-lease`  C) `git push --mirror`  D) `git push --delete`
**Answer: B**

**6. `git stash -u` also stashes:**
A) Ignored files only  B) Untracked files  C) Remote branches  D) Tags
**Answer: B**

**7. Which command shows the history of HEAD movements, useful for recovery?**
A) `git log`  B) `git reflog`  C) `git blame`  D) `git shortlog`
**Answer: B**

**8. Which GitHub feature enforces required reviewers by path?**
A) Dependabot  B) CODEOWNERS  C) Issues  D) Pages
**Answer: B**

**9. A GitHub Actions workflow file lives in:**
A) `.git/workflows`  B) `.github/workflows`  C) `/actions`  D) `.workflow`
**Answer: B**

**10. `git rebase` generally:**
A) Creates new commits with new hashes  B) Keeps identical hashes  C) Deletes remote branches  D) Only works on tags
**Answer: A**

**11. To stop tracking a file but keep it on disk:**
A) `git rm file`  B) `git rm --cached file`  C) `git clean file`  D) `git reset file`
**Answer: B**

**12. Which keyword in a PR description closes an issue on merge?**
A) Related to #12  B) Fixes #12  C) See #12  D) Ref #12
**Answer: B**

**13. `git bisect` is used to:**
A) Compress history  B) Find the commit that introduced a bug  C) Merge branches  D) Sign tags
**Answer: B**

**14. Which merge option produces one commit on the target branch from all PR commits?**
A) Merge commit  B) Squash and merge  C) Rebase and merge  D) Fast-forward
**Answer: B**

**15. What does `git pull --rebase` do?**
A) Fetch then merge  B) Fetch then rebase local commits on top of upstream  C) Delete local commits  D) Only fetch
**Answer: B**

**16. Secrets accidentally pushed: the first action is to:**
A) Delete the file in a new commit  B) Rotate/revoke the secret  C) Ignore it  D) Make the repo private
**Answer: B**

**17. Which file shows how to contribute to a project?**
A) LICENSE  B) CONTRIBUTING.md  C) .gitignore  D) package.json
**Answer: B**

**18. Git stores each commit mainly as:**
A) A diff  B) A snapshot of the tree (with delta-compressed storage)  C) A zip file  D) A database row of patches
**Answer: B**

**19. Which command lists commits in `feature` that are not in `main`?**
A) `git log feature..main`  B) `git log main..feature`  C) `git diff main`  D) `git log --all`
**Answer: B**

**20. Pin third-party GitHub Actions to a commit SHA because:**
A) It is faster  B) Tags/branches can be moved, SHAs are immutable  C) It is required by YAML  D) It reduces cost
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Committing secrets, `node_modules`, or build output.**
2. **Force-pushing shared branches** (use PRs and `--force-with-lease` only on your branches).
3. **Huge, unfocused commits and PRs** with vague messages ("fix", "update", "wip").
4. **Working directly on `main`.**
5. **Rebasing public history.**
6. **`git add .` without reviewing** (`git status`, `git diff --staged`).
7. **Using `reset --hard` without checking what will be lost.**
8. **Resolving conflicts by accepting one side blindly.**
9. **Not pulling/rebasing often**, causing painful integration.
10. **Ignoring CI failures** or merging with red checks.
11. **Leaving long-lived branches and stale PRs.**
12. **Not using `.gitignore` or `.gitattributes`**, causing line-ending churn.
13. **Using `--no-verify` habitually** to bypass hooks.
14. **Storing large binaries in normal Git history.**
15. **Wrong email/author config** so contributions are not attributed.
16. **Granting broad GitHub tokens/permissions** to workflows and bots.
17. **Using unpinned third-party Actions** and untrusted input in `run:` scripts.
18. **Squash-merging when you needed to preserve commit-level history** (or the reverse) without team agreement.
19. **Forgetting to push tags** or to fetch tags in CI.
20. **Treating GitHub as a backup.** Keep real backups/mirrors for critical repos.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain Git with the **object model** (blobs, trees, commits, refs) and know that branches are pointers.
- You pick merge/rebase/squash deliberately, state the team policy, and know the "never rewrite shared history" rule and its exceptions.
- You recover from mistakes calmly with `reflog`, `ORIG_HEAD`, `revert`, and backup branches.
- You write clean, atomic commits (`add -p`, `rebase -i`, `fixup`/`autosquash`) and meaningful PR descriptions.
- You set up repo governance: CODEOWNERS, rulesets, required checks, merge queue, templates, signed commits where needed.
- You build fast, secure CI/CD: caching, matrices, concurrency, least-privilege tokens, OIDC, pinned actions, environments with approvals.
- You handle secret leaks with the right order: revoke, rotate, purge, prevent.
- You know large-repo tooling (LFS, sparse checkout, partial clone, scalar/maintenance) and monorepo CI strategies.
- You use `bisect`, `blame -w -C`, `log -S/-L` to investigate regressions efficiently.
- You measure delivery health (DORA metrics, PR cycle time) and improve workflows with data.
- You mentor others with a clear mental model instead of command memorization.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands
```bash
git status ; git add -p ; git commit -m "feat: ..." ; git push
git switch -c feature/x ; git fetch --prune ; git pull --rebase
git log --oneline --graph --decorate --all
git diff ; git diff --staged ; git stash push -u ; git stash pop
```

### Fix-it commands
```bash
git restore file ; git restore --staged file ; git commit --amend
git reset --soft|--mixed|--hard HEAD~1 ; git revert <sha>
git reflog ; git reset --hard HEAD@{n} ; git cherry-pick <sha>
git rebase -i HEAD~n ; git rebase --abort ; git merge --abort
git push --force-with-lease
```

### Mental model
- Commit = snapshot with parent pointer(s). Branch = movable pointer. HEAD = where you are.
- Merge joins histories; rebase replays commits on a new base (new hashes).
- Reset moves pointers; revert adds an inverse commit; reflog remembers pointer moves.

### PR checklist
Small and focused • clear title/description • linked issue • tests added/updated • CI green • docs/changelog updated • no secrets • self-reviewed • reviewers/CODEOWNERS requested.

### Actions checklist
Least-privilege `permissions` • pinned action SHAs • caching • concurrency cancel • secrets via environments/OIDC • required status checks • timeouts • reusable workflows for shared logic.

### Interview strategy
1. Define the concept in one sentence.
2. Show the command(s) and what changes (history, index, working tree).
3. State the risk (rewrites history? shared branch?) and how to recover.
4. Give a real example from your own project.
5. Mention team policy and automation (branch protection, CI).

### Final checklist before the interview
- [ ] Explain the three areas, objects, branches and HEAD.
- [ ] Explain merge vs rebase vs squash, reset vs revert, fetch vs pull.
- [ ] Demonstrate conflict resolution, interactive rebase, cherry-pick, stash, bisect and reflog recovery.
- [ ] Describe a branching strategy and release/hotfix flow.
- [ ] Write a GitHub Actions CI workflow with caching and secure permissions.
- [ ] Explain branch protection, CODEOWNERS, rulesets, merge queue and secret scanning.
- [ ] Prepare stories: a conflict, a recovery, a pipeline improvement and a security incident.

