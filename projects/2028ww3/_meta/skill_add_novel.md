# 新增小說技能 (Add Novel Skill)

> 此文件說明如何在平台上新增一本新小說。

## 概覽

新增小說需要以下步驟：
1. 建立專案目錄結構
2. 更新中央配置
3. 建立網站頁面
4. 測試並部署

## 步驟 1：建立專案目錄

```bash
# 建立專案目錄結構
mkdir -p projects/{novel-slug}/
mkdir -p projects/{novel-slug}/_meta
mkdir -p projects/{novel-slug}/_world
mkdir -p projects/{novel-slug}/_characters
mkdir -p projects/{novel-slug}/chapters
mkdir -p projects/{novel-slug}/_assets/chapters
mkdir -p projects/{novel-slug}/_archives
```

### 必要檔案

| 檔案 | 用途 |
|------|------|
| `_CONTEXT.md` | 專案快讀指南（Agent 必讀） |
| `_meta/agent_guidelines.md` | 寫作規範與原則 |
| `_meta/chapter_order.md` | 章節順序與狀態 |
| `chapters/*.md` | 章節內容 |

### `_CONTEXT.md` 範本

```markdown
# {小說標題} - 專案快讀指南

> **Agent 必讀**：修改本專案前，請先閱讀本文件。

## 基本資訊

| 項目 | 內容 |
|------|------|
| 書名 | {中文名} ({英文名}) |
| 專案代號 | {novel-slug} |
| 類型 | {類型} |
| 狀態 | 初稿 |
| 版本 | v1 |

## 核心設定

{世界觀、主要規則等}

## 主要角色

{角色列表}

## 參考文件

- 詳細設定：`_world/`
- 角色檔案：`_characters/`
- 寫作指引：`_meta/agent_guidelines.md`

---

*完整指引請參考 `_meta/agent_guidelines.md`*
```

## 步驟 2：更新中央配置

編輯 `/novels.config.json`，在 `novels` 陣列中新增：

```json
{
  "slug": "novel-slug",
  "title": "中文標題",
  "titleEn": "English Title",
  "genre": "類型",
  "description": "小說簡介...",
  "status": "ongoing",
  "statusText": "連載中",
  "tags": ["標籤1", "標籤2"],
  "coverUrl": "https://...",
  "wordpress": {
    "category": "分類名稱",
    "coverMediaId": null
  }
}
```

### 狀態選項

| status | statusText | 說明 |
|--------|------------|------|
| `ongoing` | `連載中` | 正在更新 |
| `completed` | `已完結` | 已完結 |
| `hiatus` | `暫停` | 暫停更新 |

## 步驟 3：建立網站頁面

### 3.1 建立小說目錄頁面

複製並修改現有範本：

```bash
cp -r site/src/pages/novel/2028ww3 site/src/pages/novel/{novel-slug}
```

編輯 `site/src/pages/novel/{novel-slug}/index.astro`：

```astro
---
// 更新 novelInfo
const novelInfo = {
  title: '中文標題',
  titleEn: 'English Title',
  slug: 'novel-slug',
  description: '小說簡介...',
  author: 'CQI365',
  status: '連載中',
  coverUrl: 'https://...',
};

// 更新 filter
const chapters = allChapters
  .filter(c => c.id.startsWith('novel-slug/'))
  ...
---
```

### 3.2 更新章節頁面

編輯 `site/src/pages/novel/{novel-slug}/[...slug].astro`：

```astro
---
// 更新 getStaticPaths 中的 filter
const chapters = allChapters.filter(c => c.id.startsWith('novel-slug/'));

// 更新 novelSlug
const novelSlug = 'novel-slug';
---
```

## 步驟 4：新增第一章

建立章節檔案：

```markdown
---
title: "第一章標題"
order: 10
---

章節內容...
```

### 章節命名規則

```
Chap_{序號}_{區域}_{標題}.md
```

範例：
- `Chap_00_Prologue_Opening.md` - 序章
- `Chap_01_Asia_First_Chapter.md` - 第一章

## 步驟 5：測試

```bash
# 同步章節
node scripts/sync-chapters.js {novel-slug}

# 生成統計
node scripts/generate-stats.js

# 建置網站
cd site && npm run build

# 本地預覽
npm run preview
```

## 步驟 6：部署

```bash
# 提交變更
git add .
git commit -m "新增小說：{小說標題}"

# 推送到 GitHub（觸發 Cloudflare Pages 自動部署）
git push
```

## 檢查清單

- [ ] 專案目錄結構完整
- [ ] `_CONTEXT.md` 已建立
- [ ] `novels.config.json` 已更新
- [ ] 網站頁面已建立 (`index.astro`, `[...slug].astro`)
- [ ] 至少有一章內容
- [ ] `npm run build` 成功
- [ ] 本地預覽正常

## 注意事項

1. **slug 必須唯一**：不能與現有小說重複
2. **保持一致性**：目錄名、config slug、頁面路徑必須一致
3. **先測試再部署**：確保本地建置成功後再推送
4. **圖片處理**：參考 `skill_image_handling.md`
