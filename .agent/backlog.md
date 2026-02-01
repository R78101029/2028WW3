# Backlog - Blind Orbit Novel Project

**最後更新時間**: 2026-02-01T21:48:06+08:00

---

## 🎯 當前進度

### 已完成項目 (Completed)

1. **封面圖片部署** ✅
   - 為全書所有章節（序章 - 第 34 章）新增小說封面圖片
   - 重構 `auto-insert-images.js` 腳本以支援逐章處理
   - 驗證所有章節的封面圖片正確顯示
   - Git 提交並推送變更

2. **第 11-12 章場景圖片生成與插入** ✅
   - Chapter 11: 亞洲內爆（台北醫院停電場景）
   - Chapter 12: 間奏曲 II：變色龍（布魯塞爾 EU 總部會議室）
   - 圖片生成、複製到 `_assets/chapters/` 並插入章節
   - Git 提交並推送變更

3. **第 13-34 章內容分析與 Prompt 設計** ✅
   - 完成 Batch 3 (Ch 13-20) 的 Prompt 設計
   - 完成 Batch 4 (Ch 21-30) 的 Prompt 設計
   - 完成 Batch 5 (Ch 31-34) 的 Prompt 設計
   - 所有 Prompts 已記錄於 `implementation_plan.md`

---

## 🔄 進行中項目 (In Progress)

### 第 13-34 章場景圖片批次生成
**狀態**: ⏸️ **待用戶批准 & API 配額重置**

**已完成**:
- ✅ 內容分析與 Prompt 設計（全部完成）
- ✅ 實施計畫文檔更新

**待執行**:
- ⏳ 批次生成圖片（Batch 3-5，共 22 章）
- ⏳ 使用 `auto-insert-images.js` 插入圖片
- ⏳ 驗證圖片顯示效果
- ⏳ Git 提交並推送最終成果

**阻塞因素**:
- 🚫 AI 圖片生成 API 配額限制（已達上限，需等待重置）
- 📋 等待用戶審閱 `implementation_plan.md` 並批准執行

---

## 📋 待辦項目 (Todo)

### 優先級：高 (High Priority)

1. **執行第 13-34 章圖片生成**
   - 前置條件：API 配額重置 + 用戶批准
   - 預計工作量：約 22 張圖片
   - 預計時間：1-2 小時（視生成速度而定）

### 優先級：中 (Medium Priority)

2. **網站部署與同步**
   - 執行 `sync-chapters.js` 同步章節到 `site/` 目錄
   - 執行 `astro build` 建構網站
   - 部署到 Cloudflare Pages

3. **文檔更新**
   - 更新 `walkthrough.md` 記錄最終成果
   - 更新 `projects/BlindOrbit/_meta/chapter_order.md`（如需要）

### 優先級：低 (Low Priority)

4. **圖片優化**
   - 檢視生成圖片的品質與一致性
   - 必要時重新生成特定章節的圖片

5. **Git 分支管理**
   - 將 `dev` 分支合併回 `main`
   - 清理臨時檔案與分支

---

## 📊 專案統計

| 項目 | 數量 | 狀態 |
|------|------|------|
| 總章節數 | 35 | - |
| 已完成封面圖片 | 35 | ✅ |
| 已完成場景圖片 | 2 (Ch 11-12) | ✅ |
| 設計完成 Prompts | 22 (Ch 13-34) | ✅ |
| 待生成場景圖片 | 22 (Ch 13-34) | ⏳ |

**總體進度**: ~45% (基於場景圖片生成)

---

## 🔧 技術資訊

**相關檔案**:
- Script: `scripts/auto-insert-images.js`
- 圖片目錄: `projects/BlindOrbit/_assets/chapters/`
- 章節目錄: `projects/BlindOrbit/chapters/`

**當前 Git 分支**: `dev`

**已知問題**:
- AI 圖片生成 API 有配額限制（約 50-60 分鐘重置）
- 需確保圖片檔名遵循命名規範：`chapter_XX_scene.webp`

---

## 📝 備註

- 本專案採用 Git workflow，所有變更須在 `dev` 分支開發，完成後合併至 `main`
- 每次重大變更前須執行 `git_sync` 確保同步
- 圖片插入格式: HTML `<img>` tag，`max-width: 90%`，置中顯示
