---
trigger: always_on
glob:
description:
---

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
├── .agent/             # Agent configuration (antigravity)
└── CLAUDE.md           # This file
```

## Working with Novel Projects

### Before modifying any novel:

1. Read the project's `_CONTEXT.md` first
2. Follow the guidelines in `_meta/agent_guidelines.md`
3. Check `_meta/chapter_order.md` for current structure

### Project structure (per novel):

```
projects/{novel-name}/
├── _CONTEXT.md      # Quick reference (READ THIS FIRST)
├── _meta/           # Project management files
├── _world/          # World-building documents
├── _characters/     # Character profiles
├── chapters/        # Story content
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

## Publishing

The `site/` directory contains an Astro-based website that reads from `projects/` and publishes to Cloudflare Pages.

Build command: `npm run build`
Output directory: `dist`
