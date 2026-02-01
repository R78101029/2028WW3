#!/usr/bin/env node
/**
 * Generate novel statistics (chapter count, word count)
 *
 * Usage: node scripts/generate-stats.js
 *
 * Outputs: site/src/data/novels-stats.json
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const CONFIG_PATH = join(PROJECT_ROOT, 'novels.config.json');
const PROJECTS_DIR = join(PROJECT_ROOT, 'projects');
const OUTPUT_DIR = join(PROJECT_ROOT, 'site/src/data');
const OUTPUT_PATH = join(OUTPUT_DIR, 'novels-stats.json');

// Count Chinese characters (exclude punctuation, spaces, markdown)
function countChineseWords(text) {
  // Remove frontmatter
  const content = text.replace(/^---[\s\S]*?---/, '');
  // Remove markdown syntax
  const cleaned = content
    .replace(/#+\s/g, '')           // Headers
    .replace(/\*\*|__/g, '')        // Bold
    .replace(/\*|_/g, '')           // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')     // Images
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`[^`]+`/g, '')        // Inline code
    .replace(/>\s/g, '')            // Blockquotes
    .replace(/[-*]\s/g, '')         // Lists
    .replace(/\n/g, '')             // Newlines
    .replace(/\s/g, '');            // Spaces

  // Count CJK characters
  const cjkMatch = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  return cjkMatch ? cjkMatch.length : 0;
}

async function generateStats() {
  // Read config
  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf-8'));

  const stats = {};

  for (const novel of config.novels) {
    const chaptersDir = join(PROJECTS_DIR, novel.slug, 'chapters');

    if (!existsSync(chaptersDir)) {
      console.warn(`Warning: ${chaptersDir} not found, skipping ${novel.slug}`);
      stats[novel.slug] = { chapters: 0, words: 0, wordsFormatted: '0' };
      continue;
    }

    const files = await readdir(chaptersDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    let totalWords = 0;

    for (const file of mdFiles) {
      const content = await readFile(join(chaptersDir, file), 'utf-8');
      totalWords += countChineseWords(content);
    }

    // Format word count
    let wordsFormatted;
    if (totalWords >= 10000) {
      wordsFormatted = Math.floor(totalWords / 10000) + '萬+';
    } else if (totalWords >= 1000) {
      wordsFormatted = Math.floor(totalWords / 1000) + '千+';
    } else {
      wordsFormatted = totalWords.toString();
    }

    stats[novel.slug] = {
      chapters: mdFiles.length,
      words: totalWords,
      wordsFormatted,
    };

    console.log(`${novel.slug}: ${mdFiles.length} chapters, ${totalWords} words (${wordsFormatted})`);
  }

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Write stats file
  await writeFile(OUTPUT_PATH, JSON.stringify(stats, null, 2));
  console.log(`\nStats written to ${OUTPUT_PATH}`);

  return stats;
}

generateStats().catch(console.error);
