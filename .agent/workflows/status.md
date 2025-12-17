---
description: Check project status (TURBO)
---

# Project Status Check

This workflow checks the current status of the project, git, and dependencies.

// turbo-all

## Steps

1. Check git status
```bash
git status
```

2. Check current branch
```bash
git branch --show-current
```

3. Check Node version
```bash
node --version
```

4. Check npm version
```bash
npm --version
```

5. List installed packages
```bash
npm list --depth=0
```

6. Check for uncommitted changes
```bash
git diff --stat
```
