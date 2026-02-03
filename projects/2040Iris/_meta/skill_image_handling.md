# 圖片處理技能 (Image Handling Skill)

> 此文件說明如何在小說專案中處理圖片，包括封面和內文插圖。

## 目錄結構

```
projects/{novel}/
├── _assets/
│   ├── cover.jpg              # 小說封面
│   └── chapters/
│       ├── ch01-cover.jpg     # 章節封面
│       ├── ch01-scene-xxx.jpg # 章節場景圖
│       └── ...
└── chapters/
    └── *.md
```

## 命名規則

### 檔案命名格式
```
{章節}-{類型}-{描述}.{格式}
```

| 類型 | 格式 | 用途 |
|------|------|------|
| `cover` | `ch{N}-cover.jpg` | 章節封面（上傳到 WordPress featured image） |
| `scene` | `ch{N}-scene-{描述}.jpg` | 內文插圖（插入章節內容） |

### 範例
```
ch00-cover.jpg           # 序章封面
ch01-cover.jpg           # 第一章封面
ch01-scene-battlefield.jpg # 第一章戰場場景
ch05-scene-meeting.jpg   # 第五章會議場景
```

## Frontmatter 欄位

章節 Markdown 支援三種封面來源：

```yaml
---
title: "章節標題"
order: 10

# 方式 1：本地檔案（自動上傳到 WordPress）
cover: "ch01-cover.jpg"

# 方式 2：WordPress 現有圖片 URL
cover_url: "https://blog.cqi365.net/wp-content/uploads/2025/12/image.jpg"

# 方式 3：直接指定 WordPress Media ID
cover_media_id: 456
---
```

**優先順序**：`cover_media_id` > `cover_url` > `cover`

## 自動化腳本

### 1. 自動插入圖片
```bash
node scripts/auto-insert-images.js {novel-slug}

# 範例
node scripts/auto-insert-images.js 2028ww3
```

**功能**：
- 掃描 `_assets/chapters/` 中的圖片
- 根據命名規則自動匹配章節
- `ch{N}-cover.jpg` → 設定 frontmatter `cover`
- `ch{N}-scene-{描述}.jpg` → 插入章節內文

### 2. 同步章節和圖片
```bash
node scripts/sync-chapters.js {novel-slug}

# 範例
node scripts/sync-chapters.js 2028ww3
```

**功能**：
- 同步章節到 `site/src/content/novels/`
- 同步圖片到 `site/public/assets/`
- 保留 frontmatter 的 `cover`、`cover_url`、`cover_media_id` 欄位

## 內文圖片語法

在章節 Markdown 中插入圖片：

```markdown
![圖片描述](../_assets/chapters/ch01-scene-battlefield.jpg)
```

發布時會自動轉換為：
```html
<img src="https://novels.cqi365.net/assets/2028ww3/chapters/ch01-scene-battlefield.jpg">
```

## 發布流程

### Novels365 網站 (Cloudflare Pages)
1. `npm run build` 執行時自動同步
2. 圖片從 `_assets/` 複製到 `public/assets/`
3. 章節可引用 `/assets/{novel}/chapters/` 路徑

### WordPress
1. **封面圖** (`cover` 欄位)：上傳到 WP 媒體庫，設為 featured image
2. **WordPress URL** (`cover_url`)：查詢媒體庫，找到對應 ID
3. **內文圖**：轉換為 Novels365 URL，嵌入文章

## 工作流程

### 新增圖片到章節

**方式 A：自動化（推薦）**
1. 產生圖片（Midjourney/DALL-E 等）
2. 命名：`ch{N}-cover.jpg` 或 `ch{N}-scene-{描述}.jpg`
3. 放入 `_assets/chapters/`
4. 執行 `node scripts/auto-insert-images.js {novel}`
5. 推送到 GitHub

**方式 B：手動**
1. 產生圖片
2. 放入 `_assets/chapters/`
3. 編輯章節 Markdown：
   - 封面：在 frontmatter 加入 `cover: "filename.jpg"`
   - 內文：加入 `![描述](../_assets/chapters/filename.jpg)`
4. 推送到 GitHub

### 使用 WordPress 現有圖片

1. 在 WordPress 媒體庫找到圖片 URL
2. 在章節 frontmatter 加入：
   ```yaml
   cover_url: "https://blog.cqi365.net/wp-content/uploads/..."
   ```
3. 推送到 GitHub

## 支援格式

| 格式 | 副檔名 | 建議用途 |
|------|--------|----------|
| JPEG | `.jpg`, `.jpeg` | 照片、場景圖 |
| PNG | `.png` | 透明背景、圖表 |
| WebP | `.webp` | 高壓縮比（推薦） |
| GIF | `.gif` | 動畫 |
| SVG | `.svg` | 向量圖形 |

## 注意事項

1. **檔名避免空格**：使用 `-` 或 `_` 連接
2. **圖片大小**：建議寬度不超過 1200px
3. **WordPress CDN**：支援 `i0.wp.com` 等 Jetpack CDN URL
4. **重複檢查**：腳本會檢查是否已存在，避免重複插入
