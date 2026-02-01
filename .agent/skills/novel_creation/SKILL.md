---
name: novel_creation
description: 小說創作流程 - 從專案初始化到章節寫作的完整工作流程
---

# Novel Creation Skill

本 Skill 提供完整的小說創作工作流程，適用於長篇小說專案。基於 **Blind Orbit** 專案的實戰經驗整理。

---

## 📚 核心概念

### 專案結構設計

每個小說專案應遵循以下目錄結構：

```
projects/{novel-name}/
├── _CONTEXT.md              # 📖 快讀指南 (READ THIS FIRST)
├── _meta/                   # 🗂️ 專案管理與寫作規範
│   ├── agent_guidelines.md  # Agent 寫作指引
│   ├── chapter_order.md     # 章節順序索引
│   ├── creative_plan.md     # 創作計畫與進度
│   ├── outline.md           # 大綱與劇情結構
│   └── [其他參考文檔]
├── _characters/             # 👥 角色設定
│   ├── character_master.md  # 角色總表
│   ├── character_timelines.md # 角色時間線
│   └── character_relationships.md # 角色關係圖
├── _world/                  # 🌍 世界觀設定
│   ├── world_bible.md       # 世界觀聖經
│   ├── grand_timeline.md    # 時間軸
│   └── [特定設定文檔]
├── chapters/                # 📝 章節內容
│   └── Chap_XX_Title.md
├── _assets/                 # 🖼️ 資源檔案
│   └── chapters/            # 章節圖片
└── _archives/               # 🗄️ 舊版本與草稿
```

---

## 🚀 工作流程

### Phase 1: 專案初始化

#### 步驟 1.1: 創建專案目錄結構

```bash
# 創建核心目錄
mkdir -p projects/{novel-name}/{_meta,_characters,_world,chapters,_assets/chapters,_archives}
```

#### 步驟 1.2: 建立 `_CONTEXT.md`

這是 **最重要** 的入口文件，應包含：

- **基本資訊表**：書名、類型、狀態、版本
- **核心規則**：寫作時必須遵守的世界觀限制
- **時間軸基準**：關鍵時間點定義
- **寫作風格**：敘事視角、基調、關鍵詞
- **主要角色速查表**
- **文件索引**：指向其他關鍵文檔的路徑

**參考範例**: `projects/BlindOrbit/_CONTEXT.md`

#### 步驟 1.3: 撰寫 `_meta/agent_guidelines.md`

定義 Agent 的寫作規範：

- **氛圍定義** (The Vibe)
- **核心規則** (世界觀物理限制)
- **角色語氣指引**
- **格式規範** (Do's and Don'ts)
- **工作流程提醒** (一致性檢查、文檔更新)

**參考範例**: `projects/BlindOrbit/_meta/agent_guidelines.md`

---

### Phase 2: 世界觀與角色開發

#### 步驟 2.1: 建立世界觀聖經 (`_world/world_bible.md`)

應包含：

- **地理環境**：關鍵地點描述
- **歷史背景**：前奏事件、關鍵轉折
- **派系/組織**：各陣營的優勢、弱點、動機
- **世界規則**：科技水平、魔法體系、物理限制

#### 步驟 2.2: 建立角色設定 (`_characters/character_master.md`)

每個角色應包含：

- **基本資訊**：代號、身份、定位
- **特徵與缺陷** (Flaw)：生理/心理特質
- **關鍵裝備**：標誌性物品或技能
- **深度背景**：動機、創傷、轉折點
- **未來伏筆**：角色弧線的發展方向

> [!TIP]
> **反派設計**：賦予反派「結構性弱點」(Systemic Flaw)，例如陣營內部的信任赤字、意識形態分裂等。

#### 步驟 2.3: 建立時間軸 (`_world/grand_timeline.md`)

- **T-Hour 定義**：故事的零時刻
- **關鍵事件序列**：倒敘或插敘的時間錨點
- **多視角同步**：確保不同 POV 章節的時間戳一致

---

### Phase 3: 章節規劃與寫作

#### 步驟 3.1: 建立章節順序索引 (`_meta/chapter_order.md`)

格式範例：

| 編號 | 檔案名稱 | 章節標題 | POV | 備註 |
|------|----------|----------|-----|------|
| 00 | `Chap_00_Prologue.md` | 序章 | 角色A | |
| 01 | `Chap_01_Title.md` | 第一章 | 角色B | |

#### 步驟 3.2: 章節寫作前的檢查清單

在撰寫新章節前，**必須**：

1. **重新閱讀相關章節**：特別是涉及相同時間點或事件的章節
2. **確認時間戳一致性**：檢查 `T-Hour +X` 是否符合時間軸
3. **確認角色狀態**：當前角色的位置、物理狀態、情緒狀態
4. **確認世界規則**：不違反已建立的設定 (例如: NO GPS, NO BVR)

#### 步驟 3.3: 章節寫作規範

##### 檔名格式

```
Chap_{編號}_{英文標題}.md
```

例如: `Chap_13_Asia_Island_Diary.md`

##### Frontmatter 格式

```yaml
---
title: "第XX章：中文標題"
order: "XXX"  # 三位數排序編號
---
```

##### 章節結構

```markdown
# 章節正文內容

## 名詞解釋 (可選)
- **專有名詞**: 解釋...

---

*—— 下一章：Chapter XX: Title*

---

<img src="../_assets/chapters/novel-name_cover.jpg" alt="Cover" style="max-width: 90%; height: auto; display: block; margin: 2rem auto;">
```

#### 步驟 3.4: 新設備/技術描寫規範

> [!IMPORTANT]
> **軍事驚悚的靈魂**：新設備首次登場時，必須進行詳細描寫。

包含元素：
- **外觀**：材質、顏色、尺寸
- **聲音**：啟動聲、運作聲
- **操作手感**：按鈕反饋、重量、溫度
- **角色主觀感受**：恐懼、興奮、熟悉感

**範例**：初次描寫 Leopard 2A8 時，應包含「砲塔旋轉的液壓聲」「熱成像螢幕上敵軍紅外訊號的形狀」。

---

### Phase 4: 章節完成後的更新

#### 必須更新的文檔 (Checklist)

寫完章節後，**務必執行以下更新**：

- [ ] **`_meta/creative_plan.md`**: 標記完成的章節為 ✅
- [ ] **`_meta/chapter_order.md`**: 更新章節資訊 (如新增或修改)
- [ ] **`_characters/timelines.md`**: 更新角色狀態變化
- [ ] **`_world/arsenal_tech.md`**: 記錄新引入的設備或技術

---

## 🎨 進階技巧

### 多視角編織技巧

#### Interlude 使用原則

- **用途**：展示戰略層/上帝視角，填補主角 POV 無法覆蓋的資訊缺口
- **避免**：過度描寫主角的具體動作，以免與後續 POV 章節衝突
- **檢查點**：
  - 時間戳是否一致？
  - 物理狀態 (天氣、光線) 是否一致？
  - 關鍵事件觸發順序是否一致？

### 一致性維護策略

#### 建立「世界觀鎖」

在 `_CONTEXT.md` 和 `agent_guidelines.md` 中定義**不可違反的核心規則**。

**範例 (Blind Orbit)**:
- NO GPS: 無藍軍追蹤系統
- NO BVR: 雷達無法超視距鎖定
- 通訊延遲: 無線電會斷訊、充滿雜訊

這些規則應在每個章節中一致執行。

#### 角色語氣維護

在 `agent_guidelines.md` 中為每個主要角色定義**語氣指引**。

**範例**:
- **林子修 (Skywatcher)**: 壓抑、冷靜到近乎機械化，常用雷達術語
- **Elias Vogel**: 憤世嫉俗、批判性強，喜歡用歷史典故諷刺
- **Kane (Nomad)**: 簡潔、行動派，對話極少，專注物理細節

---

## 🖼️ 圖片生成與插入

### 場景圖片生成流程

參考 `implementation_plan.md` 的批次生成計畫。

#### 設計 Prompt

每章應包含：
- **場景描述**：關鍵視覺元素
- **氛圍關鍵詞**：Cinematic, gritty, moody, etc.
- **技術規格**：16:9, realistic style, etc.

#### 檔案命名規範

```
chapter_XX_scene.webp
```

#### 插入位置

- **場景圖片**：章節開頭 (Title 與 Frontmatter 之後)
- **封面圖片**：章節末尾 (固定)

#### 使用自動化工具

```bash
node scripts/auto-insert-images.js
```

---

## 📋 檢查清單總覽

### 開始新專案時

- [ ] 創建專案目錄結構
- [ ] 撰寫 `_CONTEXT.md`
- [ ] 撰寫 `_meta/agent_guidelines.md`
- [ ] 建立世界觀聖經 (`_world/world_bible.md`)
- [ ] 建立角色設定 (`_characters/character_master.md`)
- [ ] 建立時間軸 (`_world/grand_timeline.md`)
- [ ] 建立章節順序索引 (`_meta/chapter_order.md`)

### 寫作新章節時

- [ ] 重新閱讀相關章節
- [ ] 確認時間戳一致性
- [ ] 確認角色狀態
- [ ] 確認世界規則
- [ ] 新設備進行詳細描寫
- [ ] 遵守角色語氣指引

### 完成章節後

- [ ] 更新 `_meta/creative_plan.md`
- [ ] 更新 `_meta/chapter_order.md`
- [ ] 更新 `_characters/timelines.md`
- [ ] 更新 `_world/arsenal_tech.md` (如適用)
- [ ] 生成並插入場景圖片 (如適用)

---

## 🔗 相關資源

### 參考專案

- **Blind Orbit**: `projects/BlindOrbit/`
  - 完整的軍事驚悚小說範例
  - 包含 35 章完整內容
  - 多視角編織、世界觀鎖、角色弧線的實戰案例

### 工具腳本

- **圖片自動插入**: `scripts/auto-insert-images.js`
- **章節同步**: `scripts/sync-chapters.js`
- **小說編譯**: `scripts/compile_novel.py` (見 `_meta/` 目錄)

---

## 💡 最佳實踐

### 寫作前

> **Rule of Three**: 每次寫作前，至少閱讀三個相關文檔：
> 1. `_CONTEXT.md` (核心規則)
> 2. `_meta/agent_guidelines.md` (寫作規範)
> 3. 相關的舊章節 (一致性檢查)

### 寫作中

> **Show, Don't Tell**: 特別是技術細節，透過角色的感官體驗描寫，而非直接說明。

### 寫作後

> **Update First, Commit Later**: 先更新所有相關文檔，再進行 Git 提交，確保所有變更同步。

---

## 🎯 總結

本 Skill 的核心價值：

1. **標準化結構**：確保每個新專案都有清晰的組織邏輯
2. **一致性維護**：透過文檔索引與檢查清單防止矛盾
3. **可擴展性**：支援多視角、複雜時間軸、大規模角色群
4. **自動化支援**：透過腳本工具提升工作效率

**開始使用本 Skill，創作你的下一部長篇小說！** 📖✨
