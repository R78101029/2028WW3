# Agent Configuration

This directory contains configuration for AI agent tools (antigravity, Claude Code, etc.).

## Files

- `config.yaml` - Main configuration file

## Quick Start for Agents

1. Read `/CLAUDE.md` for platform overview
2. Navigate to a project: `projects/{novel-name}/`
3. Read `_CONTEXT.md` for project-specific guidelines
4. Follow `_meta/agent_guidelines.md` for writing rules

## Project Structure

Each novel project follows this structure:

```
projects/{novel-name}/
├── _CONTEXT.md      # READ FIRST - Quick reference
├── _meta/           # Management & guidelines
├── _world/          # World-building
├── _characters/     # Character profiles
├── chapters/        # Story content (main work area)
└── _archives/       # Old versions
```

## Writing Guidelines

- Use Deep 3rd Person POV
- Follow "Technical Blinding" rules (NO GPS, NO BVR)
- Reference equipment specs from `_world/arsenal_tech.md`
- Update `_meta/chapter_order.md` after changes
