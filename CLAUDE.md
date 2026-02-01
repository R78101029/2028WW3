# Novel Publishing Platform

## Overview

This repository serves dual purposes:
1. **Creative workspace** for writing and managing novels
2. **Publishing platform** deployed via GitHub + Cloudflare Pages

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

| Project | Status | Description |
|---------|--------|-------------|
| `2028ww3` | Active | 2028 第三次世界大戰 - Military thriller |

## Agent Workflow

1. **Read** `projects/{name}/_CONTEXT.md` for quick orientation
2. **Reference** `_meta/` files for detailed rules and continuity
3. **Write** in `chapters/` directory
4. **Update** `_meta/chapter_order.md` after changes
5. **Archive** old versions in `_archives/` if doing major rewrites

## Publishing

The `site/` directory contains an Astro-based website that reads from `projects/` and publishes to Cloudflare Pages.

Build command: `npm run build`
Output directory: `dist`
