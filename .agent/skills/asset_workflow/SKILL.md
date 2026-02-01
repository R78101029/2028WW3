---
name: asset_workflow
description: Manage and automate chapter image insertion and synchronization
---

# Asset Workflow Skill

This skill standardizes the process of adding cover art and illustrations to novel chapters, and synchronizing them with the publishing platform.

## 1. Naming Convention (Strict)

Images **MUST** be placed in `projects/{novel}/_assets/chapters/` and follow these rules:

| Type | Format | Example | Purpose |
|------|--------|---------|---------|
| **Cover** | `ch{N}-cover.jpg` | `ch015-cover.jpg` | WordPress Featured Image |
| **Scene** | `ch{N}-scene-{desc}.jpg` | `ch015-scene-bunker.jpg` | In-text illustration (auto-inserted) |

> **Note**: `{N}` should match the chapter number format used in filenames (e.g., `015`).

## 2. Frontmatter Fields

The automation scripts manage these fields in your markdown files:

```yaml
cover: "ch015-cover.jpg"        # Local filename (Auto-populated)
cover_url: "https://..."       # WordPress URL (Populated after WP sync)
cover_media_id: 456            # WP Media ID (Populated after WP sync)
```

## 3. Workflow

### Step 1: Prepare Images
1.  Generate or acquire images.
2.  Rename them strictly according to the **Naming Convention**.
3.  Move files to `projects/{novel-name}/_assets/chapters/`.

### Step 2: Process & Sync
Run the automation wrapper. You can specify a project or let it auto-detect.

**Auto-detect (single project) or Select (multiple projects):**
```powershell
.agent/skills/asset_workflow/scripts/process_images.ps1
```

**Specify Project:**
```powershell
.agent/skills/asset_workflow/scripts/process_images.ps1 -Novel "2028ww3"
```

*This script:*
1.  **Reads structure**: Scans for valid chapters and assets in the selected project.
2.  **Auto-inserts**: Matches `ch{N}` images to markdown files and updates frontmatter/content.
3.  **Syncs**: Prepares content for the publishing site (frontmatter normalization, asset copying).

## 4. Agent Generation Workflow (For AI)

When the User asks you to generate illustrations for a specific chapter:

1.  **Generate** the image using your tool.
2.  **Import** the image using the helper script. This will automatically rename it, move it to the correct asset folder, and update the markdown file.

```bash
node .agent/skills/asset_workflow/scripts/import_image.js "<ChapterFilePath>" "<GeneratedImagePath>" <type> [description]
```

**Parameters:**
- `<ChapterFilePath>`: Absolute path to the markdown file (e.g., `.../chapters/Chap_01.md`).
- `<GeneratedImagePath>`: Path to the generated artifact image.
- `<type>`: `cover` or `scene`.
- `[description]`: Short keyword for scene (required for `scene` type), e.g., "battle", "city-view".

**Example:**
```bash
node .agent/skills/asset_workflow/scripts/import_image.js "E:/.../Chap_01.md" "E:/.../artifacts/img_01.png" scene "night-market"
```

```bash
git add projects/{novel}/chapters/*.md projects/{novel}/_assets/
git commit -m "feat(assets): add images for ch{N}"
```
