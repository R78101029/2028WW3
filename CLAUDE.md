# Novel Publishing Platform

## Overview

This repository serves dual purposes:

1. **Creative workspace** for writing and managing novels
2. **Publishing platform** deployed via GitHub + Cloudflare Pages

## Git Workflow & Multi-Agent Collaboration

To manage concurrent edits by multiple agents:

1. **Branching Strategy**:
   - `main`: Remote source of truth (Do not edit directly).
   - `dev`: Local development branch for all active work.

2. **Synchronization**:
   - MUST sync before starting new tasks to avoid conflicts.
   - Use the `git_sync` skill to pull `main` and merge into `dev`.
   - Command: `.agent/skills/git_sync/scripts/sync_dev.ps1`

3. **Process**:
   - **Start**: Run `git_sync`.
   - **Edit**: Work exclusively on `dev`.
   - **Delivery**: Merge `dev` to `main` only when task is complete and verified.

## Directory Structure

```
/
├── projects/           # Novel projects (creative workspace)
│   └── {novel-name}/   # Each novel has its own directory
├── site/               # Astro-based publishing website
├── scripts/            # Build and publishing utilities
├── novels.config.json  # Central configuration for all novels
└── CLAUDE.md           # This file
```

## Configuration System

### Central Config: `novels.config.json`

All novel metadata is centralized in `novels.config.json`:
- Novel info (title, description, tags, cover)
- Site settings (name, tagline)
- Genre categories

**Do NOT hardcode novel data in pages** - always read from config.

### Dynamic Stats: `site/src/data/novels-stats.json`

Generated automatically during build:
- Chapter count
- Word count

Scripts:
- `scripts/generate-stats.js` - Generate stats
- `scripts/sync-chapters.js` - Sync chapters to site

## Working with Novel Projects

### Before modifying any novel:

1. Read the project's `_CONTEXT.md` first
2. Follow the guidelines in `_meta/agent_guidelines.md`
3. Check `_meta/chapter_order.md` for current structure

### Project structure (per novel):

```
projects/{novel-name}/
├── _CONTEXT.md      # Quick reference (READ THIS FIRST)
├── _meta/           # Project management & skills
├── _world/          # World-building documents
├── _characters/     # Character profiles
├── chapters/        # Story content
├── _assets/         # Images (covers, scenes)
└── _archives/       # Old versions and drafts
```

## Available Projects

| Project     | Status | Description                             |
| ----------- | ------ | --------------------------------------- |
| `2028ww3` | Active | 盲軌：2028 (Blind Orbit) - 軍事驚悚小說 |

## Agent Workflow

1. **Sync**: Ensure you are on `dev` branch and execute `git_sync`.
2. **Read** `projects/{name}/_CONTEXT.md` for quick orientation.
3. **Reference** `_meta/` files for detailed rules and continuity.
4. **Write** in `chapters/` directory.
5. **Update** `_meta/chapter_order.md` after changes.
6. **Archive** old versions in `_archives/` if doing major rewrites.

## Skills Reference

Documented procedures in `projects/{novel}/_meta/`:

| Skill | File | Description |
|-------|------|-------------|
| Image Handling | `skill_image_handling.md` | Covers, scenes, WordPress upload |
| Add Novel | `skill_add_novel.md` | Complete guide to add new novel |

## Publishing

### Website (Cloudflare Pages)

```bash
cd site
npm run build    # Runs: sync + stats + astro build
npm run preview  # Local preview
```

Build process:
1. `sync-chapters.js` - Copy chapters to `site/src/content/novels/`
2. `generate-stats.js` - Calculate chapter/word counts
3. `astro build` - Generate static site

Deployment:
- **Platform**: Cloudflare Pages
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Root directory**: `site`

### WordPress (Optional)

Script: `scripts/publish-to-wp.js`

Required GitHub Secrets:
- `WP_URL` - WordPress site URL
- `WP_USER` - Username
- `WP_APP_PASSWORD` - Application password

## Build Commands

```bash
# From project root
node scripts/sync-chapters.js [novel-slug]  # Sync chapters
node scripts/generate-stats.js              # Generate stats

# From site/ directory
npm run build     # Full build (sync + stats + astro)
npm run dev       # Development server
npm run preview   # Preview built site
```

## Important Notes

1. **Generated content is gitignored**: `site/src/content/novels/` is rebuilt during build
2. **Always test locally**: Run `npm run build` before pushing
3. **Config is source of truth**: Novel metadata comes from `novels.config.json`
4. **Images**: Follow `skill_image_handling.md` for proper handling
