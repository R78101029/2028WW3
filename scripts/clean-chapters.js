#!/usr/bin/env node
/**
 * Clean up chapters - remove agent writing metadata
 *
 * Removes:
 * - <metadata>...</metadata> blocks
 * - Empty lines left behind
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const PROJECTS_DIR = './projects';

async function cleanChapter(filePath) {
  let content = await readFile(filePath, 'utf-8');
  const original = content;

  // Remove <metadata>...</metadata> blocks (including multiline)
  content = content.replace(/<metadata>[\s\S]*?<\/metadata>\s*/gi, '');

  // Remove standalone metadata-like lines that might remain
  // e.g., "- **字數目標**：~5000 字"
  content = content.replace(/^- \*\*字數目標\*\*：.*$/gm, '');
  content = content.replace(/^- \*\*POV\*\*：.*$/gm, '');
  content = content.replace(/^- \*\*時間軸\*\*：.*$/gm, '');
  content = content.replace(/^- \*\*核心主題\*\*：.*$/gm, '');
  content = content.replace(/^- \*\*場景\*\*：.*$/gm, '');

  // Clean up excessive blank lines (more than 2 consecutive)
  content = content.replace(/\n{4,}/g, '\n\n\n');

  // Remove blank lines right after frontmatter
  content = content.replace(/(---\n)\n+/g, '$1\n');

  if (content !== original) {
    await writeFile(filePath, content);
    return true;
  }
  return false;
}

async function main() {
  const novelName = process.argv[2] || '2028ww3';
  const chaptersDir = join(PROJECTS_DIR, novelName, 'chapters');

  const files = await readdir(chaptersDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`Cleaning ${mdFiles.length} chapters...`);

  let cleanedCount = 0;
  for (const file of mdFiles) {
    const filePath = join(chaptersDir, file);
    const wasModified = await cleanChapter(filePath);
    if (wasModified) {
      console.log(`  ✓ Cleaned: ${file}`);
      cleanedCount++;
    }
  }

  console.log(`\nDone! ${cleanedCount} files cleaned.`);
}

main().catch(console.error);
