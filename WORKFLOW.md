# Multi-Agent Workflow Guide

## Overview

This project supports simultaneous editing from multiple agents:
- **Claude Code** (cloud) - Technical changes, configuration, scripts
- **Google Antigravity** (local) - Creative writing, chapter editing

## Avoiding Conflicts

### Golden Rules

1. **Always pull before starting work**
   ```bash
   git pull origin main
   ```

2. **Commit frequently** - Small, focused commits reduce merge conflicts

3. **Divide responsibilities clearly**

### Recommended Division of Work

| Task | Recommended Agent | Reason |
|------|-------------------|--------|
| Writing chapters | Antigravity | Better for long-form creative work |
| Editing chapters | Antigravity | Context continuity |
| Config changes | Claude Code | Technical expertise |
| Script fixes | Claude Code | Debugging capability |
| Adding new novels | Either | Follow `skill_add_novel.md` |
| Image handling | Either | Follow `skill_image_handling.md` |

### File Ownership

To minimize conflicts, avoid editing the same files simultaneously:

| Files | Primary Owner | Notes |
|-------|--------------|-------|
| `chapters/*.md` | Antigravity | Creative content |
| `_meta/*.md` | Antigravity | Story continuity |
| `scripts/*.js` | Claude Code | Technical |
| `site/src/**` | Claude Code | Website code |
| `novels.config.json` | Either | Coordinate changes |
| `CLAUDE.md` | Claude Code | Agent instructions |

## Generated Files (Safe to Ignore)

These files are regenerated during build - no need to sync:

```
site/src/content/novels/   # Synced from projects/
site/src/data/             # Generated stats
node_modules/              # Dependencies
dist/                      # Build output
.astro/                    # Astro cache
```

## Conflict Resolution

### If you encounter a merge conflict:

1. **For chapters (content)**:
   - Keep the version with more content
   - Or manually merge if both have valuable changes

2. **For config/code**:
   - Understand what each change does
   - Test after resolving

3. **For generated files**:
   - Delete and regenerate: `npm run build`

### Common Scenarios

#### Scenario 1: Both edited different chapters
- No conflict - git will merge automatically

#### Scenario 2: Both edited same chapter
- Git will show conflict markers
- Review both versions and combine

#### Scenario 3: One edited chapter, other ran build
- No conflict if `site/src/data/` is gitignored
- Generated content is always rebuilt

## Pre-Work Checklist

Before starting any work:

- [ ] `git pull origin main`
- [ ] Check if other agent is working (communicate if possible)
- [ ] Know which files you'll be editing
- [ ] Plan to commit after completing logical units

## Post-Work Checklist

After completing work:

- [ ] `git status` - review changes
- [ ] Test: `cd site && npm run build`
- [ ] Commit with clear message
- [ ] Push: `git push origin main`

## Branch Strategy (Optional)

For complex changes, use feature branches:

```bash
# Create branch
git checkout -b feature/new-chapter-5

# Work on changes...

# Merge back
git checkout main
git pull origin main
git merge feature/new-chapter-5
git push origin main
```

## Communication

If using both agents regularly:
1. Document current work in commit messages
2. Use `_meta/` files to track story progress
3. Consider adding a `CURRENT_WORK.md` file for status
