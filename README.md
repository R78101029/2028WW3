# Novel Publishing Platform

Multi-novel creative workspace with static site publishing via GitHub + Cloudflare Pages.

## Features

- **Creative Workspace**: Structured environment for novel writing with AI agent support
- **Multi-Project**: Support for multiple novel projects in one repository
- **Static Publishing**: Astro-based website deployed to Cloudflare Pages
- **Agent-Friendly**: Designed for LLM agents (Claude, antigravity, etc.)

## Directory Structure

```
/
├── projects/              # Novel projects
│   └── 2028ww3/          # 2028 第三次世界大戰
│       ├── _CONTEXT.md   # Quick reference (agents read this first)
│       ├── _meta/        # Project management
│       ├── _world/       # World-building
│       ├── _characters/  # Character profiles
│       ├── chapters/     # Story content
│       └── _archives/    # Old versions
│
├── site/                  # Astro website (publishing)
├── scripts/               # Build utilities
├── .agent/                # Agent configuration (antigravity)
├── CLAUDE.md              # Agent entry point
└── README.md              # This file
```

## Projects

| Project | Title | Status | Chapters |
|---------|-------|--------|----------|
| `2028ww3` | 2028 第三次世界大戰 | Active | 27+ |

## For AI Agents

1. Read `CLAUDE.md` for platform overview
2. Navigate to `projects/{name}/`
3. Read `_CONTEXT.md` for project-specific rules
4. Work in `chapters/` directory

## For Humans

### View a Project

```bash
cd projects/2028ww3
cat _CONTEXT.md
```

### Build Website (Coming Soon)

```bash
cd site
npm install
npm run build
```

### Deploy

Automatic deployment via Cloudflare Pages when pushing to main branch.

## License

All rights reserved. Content is for personal use only.
