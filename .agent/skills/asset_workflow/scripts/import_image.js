const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Usage: node .agent/skills/asset_workflow/scripts/import_image.js <chapterPath> <imageSourcePath> <type> [description]
 * 
 * Example:
 * node .agent/skills/asset_workflow/scripts/import_image.js "projects/2028ww3/chapters/Chap_01.md" "C:/tmp/img.png" "scene" "battle"
 */

const [,, chapterPath, imageSource, type, desc] = process.argv;

if (!chapterPath || !imageSource || !type) {
    console.error("Usage: node import_image.js <chapterPath> <imageSource> <type:cover|scene> [description]");
    process.exit(1);
}

// 1. Resolve Paths & Novel
const absoluteChapterPath = path.resolve(chapterPath);
const projectChaptersDir = path.dirname(absoluteChapterPath);
const projectDir = path.dirname(projectChaptersDir);
const novelName = path.basename(projectDir);
const assetsDir = path.join(projectDir, '_assets', 'chapters');

// 2. Parse Chapter Number (e.g., Chap_01.md -> 01)
const filename = path.basename(absoluteChapterPath);
const match = filename.match(/(?:Chap|chapter)_?0*(\d+)/i) || filename.match(/^0*(\d+)/);

if (!match) {
    console.error(`Error: Could not extract chapter number from filename: ${filename}`);
    process.exit(1);
}

const chapterNum = match[1].padStart(3, '0'); // Normalize to 3 digits (e.g. 015) based on user convention? 
// Original auto-insert script supports various formats, but let's stick to standardizing on 3 digits or just using what auto-insert expects.
// auto-insert expects "chXX". Let's use the digits we found.
// Actually auto-insert uses parseInt. So "ch01" is fine.
const normalizedChapterNum = match[1].padStart(2, '0'); // Safe default

// 3. Construct Target Filename
// Format: ch{N}-cover.jpg OR ch{N}-scene-{desc}.jpg
const ext = path.extname(imageSource);
let targetName = `ch${normalizedChapterNum}-${type}`;
if (type === 'scene' && desc) {
    // Sanitize description
    const safeDesc = desc.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    targetName += `-${safeDesc}`;
}
targetName += ext;

const targetPath = path.join(assetsDir, targetName);

// 4. Ensure Assets Dir
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 5. Copy/Move Image
console.log(`\nImporting Image...`);
console.log(` Source: ${imageSource}`);
console.log(` Target: ${targetPath}`);

try {
    fs.copyFileSync(imageSource, targetPath);
    console.log(`✓ Image saved successfully.`);
} catch (err) {
    console.error(`Error copying file: ${err.message}`);
    process.exit(1);
}

// 6. trigger auto-insertion
console.log(`\nTriggering Auto-Insert for ${novelName}...`);
try {
    // Determine path to auto-insert script relative to CWD
    const scriptPath = path.join('scripts', 'auto-insert-images.js');
    if (fs.existsSync(scriptPath)) {
        // Pass filename to ensure the script targets the exact file we are working on
        const output = execSync(`node "${scriptPath}" "${novelName}" "${filename}"`, { encoding: 'utf-8' });
        console.log(output);
    } else {
        console.warn(`Warning: ${scriptPath} not found. Please run auto-insert manually.`);
    }
} catch (err) {
    console.error(`Error running auto-insert: ${err.message}`);
    // Don't exit 1 here, the image is saved.
}

console.log(`Done.`);
