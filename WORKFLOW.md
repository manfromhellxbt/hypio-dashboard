# Git Workflow Guide

## Branch Structure

```
main (production) ← Stable releases only
  └── develop (staging) ← Active development
       └── feature/* ← New features
       └── fix/* ← Bug fixes
```

## 🌳 Branch Descriptions

- **`main`** - Production branch. Always stable. Auto-deploys to production.
- **`develop`** - Development branch. All new work merges here first.
- **`feature/*`** - Feature branches. Created from develop.
- **`fix/*`** - Bug fix branches. Created from develop.

---

## 📝 Daily Workflow

### Starting New Feature

```bash
# 1. Switch to develop and update
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/analytics-dashboard

# 3. Make changes, commit often
git add .
git commit -m "Add analytics component"

# 4. Push feature branch
git push -u origin feature/analytics-dashboard
```

### Finishing Feature

```bash
# 1. Make sure develop is up to date
git checkout develop
git pull origin develop

# 2. Merge your feature
git merge feature/analytics-dashboard

# 3. Push to develop
git push origin develop

# 4. Delete feature branch (optional)
git branch -d feature/analytics-dashboard
git push origin --delete feature/analytics-dashboard
```

### Releasing to Production

```bash
# 1. Switch to main
git checkout main
git pull origin main

# 2. Merge develop into main
git merge develop

# 3. Tag the release (optional but recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Push to production
git push origin main --tags
```

---

## 🚨 Emergency Hotfix

```bash
# 1. Create hotfix from main
git checkout main
git checkout -b fix/critical-bug

# 2. Fix the bug and commit
git add .
git commit -m "Fix critical production bug"

# 3. Merge to main
git checkout main
git merge fix/critical-bug
git push origin main

# 4. Also merge to develop
git checkout develop
git merge fix/critical-bug
git push origin develop

# 5. Delete hotfix branch
git branch -d fix/critical-bug
```

---

## 🔄 Rollback Strategies

### Rollback Last Commit (Before Push)

```bash
git reset --hard HEAD~1
```

### Rollback After Push (Safe Way)

```bash
# Creates new commit that undoes changes
git revert HEAD
git push origin main
```

### Rollback to Specific Commit

```bash
# Find the good commit
git log --oneline

# Reset to that commit (e.g., c1e824a)
git reset --hard c1e824a
git push --force origin main  # ⚠️ Use with caution!
```

---

## 🎯 Vercel Deployments

- **main branch** → Auto-deploys to: `https://your-app.vercel.app`
- **develop branch** → Preview at: `https://your-app-git-develop.vercel.app`
- **feature branches** → Preview at: `https://your-app-git-feature-name.vercel.app`

---

## ✅ Best Practices

1. **Never commit directly to main**
2. **Always work in feature branches**
3. **Test in develop before merging to main**
4. **Use Vercel preview URLs to test**
5. **Write meaningful commit messages**
6. **Keep commits small and focused**

---

## 📋 Quick Reference

```bash
# Check current branch
git branch

# See all branches
git branch -a

# Switch branches
git checkout develop
git checkout main

# Update current branch
git pull

# See recent commits
git log --oneline -10

# See what changed
git status
git diff
```

---

## 🆘 Help Commands

```bash
# Undo uncommitted changes
git restore .

# Unstage files
git restore --staged .

# See remote branches
git remote -v

# Clean up deleted branches
git fetch --prune
```
