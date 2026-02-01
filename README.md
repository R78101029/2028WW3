# Novels365 - 小說發布平台

Multi-novel creative workspace with static site publishing via GitHub + Cloudflare Pages.

**網站**: https://novels.cqi365.net
**部落格**: https://blog.cqi365.net

## Features

- **Creative Workspace**: Structured environment for novel writing with AI agent support
- **Multi-Project**: Support for multiple novel projects in one repository
- **Static Publishing**: Astro-based website deployed to Cloudflare Pages
- **WordPress Integration**: Auto-publish chapter updates to WordPress blog
- **Agent-Friendly**: Designed for LLM agents (Claude, antigravity, etc.)

## Directory Structure

```
/
├── projects/              # Novel projects (creative workspace)
│   └── {novel-slug}/      # Each novel has its own directory
│       ├── _CONTEXT.md    # Quick reference (agents read this first)
│       ├── _meta/         # Project management
│       ├── _world/        # World-building
│       ├── _characters/   # Character profiles
│       ├── chapters/      # Story content
│       └── _archives/     # Old versions
│
├── site/                  # Astro website (publishing)
│   ├── src/
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Route pages
│   │   ├── styles/        # Global CSS
│   │   └── content/       # Synced chapter content
│   └── package.json
│
├── scripts/               # Build utilities
│   ├── sync-chapters.js   # Sync chapters to site
│   └── publish-to-wp.js   # Publish to WordPress
│
├── .github/workflows/     # GitHub Actions
│   └── publish-to-wp.yml  # Auto-publish to WordPress
│
├── .agent/                # Agent configuration (antigravity)
├── CLAUDE.md              # Agent entry point
└── README.md              # This file
```

## Current Projects

| Project | Title | Status | Chapters |
|---------|-------|--------|----------|
| `2028ww3` | 2028 第三次世界大戰 | 連載中 | 35+ |

---

## 新增小說指南

### Step 1: 建立專案目錄

```bash
# 建立目錄結構
mkdir -p projects/{novel-slug}/{_meta,_world,_characters,chapters,_archives}

# 複製範本（可選）
cp projects/2028ww3/_CONTEXT.md projects/{novel-slug}/
cp projects/2028ww3/_meta/agent_guidelines.md projects/{novel-slug}/_meta/
```

### Step 2: 建立 _CONTEXT.md

每個專案必須有 `_CONTEXT.md`，包含：
- 基本資訊（書名、類型、狀態）
- 核心規則
- 時間軸基準
- 角色列表
- 文件索引

參考 `projects/2028ww3/_CONTEXT.md`。

### Step 3: 更新發布腳本

編輯 `scripts/publish-to-wp.js`，在 `NOVELS` 物件新增：

```javascript
const NOVELS = {
  '2028ww3': {
    title: '2028 第三次世界大戰',
    category: '小說連載',
  },
  // 新增這行
  '{novel-slug}': {
    title: '小說名稱',
    category: '小說連載',
  },
};
```

### Step 4: 同步章節到網站

```bash
# 同步特定小說
node scripts/sync-chapters.js {novel-slug}

# 同步所有小說
node scripts/sync-chapters.js
```

### Step 5: 建立網站頁面

在 `site/src/pages/novel/` 建立小說目錄和頁面：

```bash
mkdir -p site/src/pages/novel/{novel-slug}
```

複製並修改現有的 `index.astro` 和 `[...slug].astro`。

### Step 6: 更新首頁

編輯 `site/src/pages/index.astro`，在 `novels` 陣列新增：

```javascript
const novels = [
  // 現有小說...
  {
    slug: '{novel-slug}',
    title: '小說名稱',
    genre: '類型',
    description: '簡介...',
    status: 'ongoing',      // 或 'completed'
    statusText: '連載中',   // 或 '已完結'
    chapters: 10,
    words: '50,000+',
    tags: ['標籤1', '標籤2'],
  },
];
```

### Step 7: 提交並部署

```bash
git add .
git commit -m "新增小說：{小說名稱}"
git push
```

Cloudflare Pages 會自動部署。

---

## 章節發布流程

### 手動發布

1. 在 `projects/{novel}/chapters/` 撰寫章節
2. 執行同步：`node scripts/sync-chapters.js {novel-slug}`
3. 提交並推送：`git add . && git commit -m "新增章節" && git push`

### 自動發布到 WordPress

當章節推送到 `main` 分支時，GitHub Action 會自動：
1. 偵測 `projects/*/chapters/*.md` 變更
2. 提取章節標題和摘要（前 500 字）
3. 發布到 WordPress，包含「繼續閱讀」連結

**觸發條件**：
| 變更位置 | 觸發 WP 發布 |
|----------|-------------|
| `projects/*/chapters/*.md` | ✅ |
| `projects/*/_meta/*.md` | ❌ |
| `site/src/**` | ❌ |

---

## GitHub Secrets 設定

WordPress 自動發布需要以下 Secrets：

| Secret Name | 說明 |
|-------------|------|
| `WP_URL` | WordPress 網址（如 `https://blog.cqi365.net`） |
| `WP_USER` | WordPress 用戶名 |
| `WP_APP_PASSWORD` | WordPress 應用程式密碼 |

設定路徑：GitHub Repo → Settings → Secrets and variables → Actions

---

## 本地開發

### 安裝依賴

```bash
cd site
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置

```bash
npm run build
```

### 同步章節

```bash
npm run sync
# 或
node ../scripts/sync-chapters.js {novel-slug}
```

---

## For AI Agents

1. Read `CLAUDE.md` for platform overview
2. Navigate to `projects/{name}/`
3. Read `_CONTEXT.md` for project-specific rules
4. Work in `chapters/` directory
5. Update `_meta/chapter_order.md` after changes

---

## License

All rights reserved. Content is for personal use only.
