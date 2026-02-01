#!/usr/bin/env node
/**
 * Sync chapters from projects/ to site/src/content/novels/
 *
 * Usage: node scripts/sync-chapters.js [novel-name]
 * Example: node scripts/sync-chapters.js 2028ww3
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';

const PROJECTS_DIR = './projects';
const CONTENT_DIR = './site/src/content/novels';

// Chapter order mapping based on file naming convention
function getChapterOrder(filename) {
  const match = filename.match(/Chap_(\d+)(?:-([A-Z]))?/);
  if (!match) return 999;

  const mainNum = parseInt(match[1], 10);
  const subNum = match[2] ? match[2].charCodeAt(0) - 64 : 0; // A=1, B=2, etc.

  return mainNum * 10 + subNum;
}

// Extract frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    return {
      frontmatter: match[1],
      body: content.slice(match[0].length).trim()
    };
  }
  return { frontmatter: null, body: content };
}

// Generate frontmatter for chapter
function generateFrontmatter(filename, existingFrontmatter) {
  const order = getChapterOrder(filename);

  // Extract title from filename
  const titleMatch = filename.match(/Chap_\d+(?:-[A-Z])?_[^_]+_(.+)\.md$/);
  const title = titleMatch
    ? titleMatch[1].replace(/_/g, ' ')
    : filename.replace('.md', '');

  return `---
title: "${title}"
order: ${order}
---`;
}

async function syncNovel(novelName) {
  const projectDir = join(PROJECTS_DIR, novelName, 'chapters');
  const contentDir = join(CONTENT_DIR, novelName);

  if (!existsSync(projectDir)) {
    console.error(`Project not found: ${projectDir}`);
    process.exit(1);
  }

  // Ensure content directory exists
  await mkdir(contentDir, { recursive: true });

  // Get all markdown files
  const files = await readdir(projectDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  console.log(`Syncing ${mdFiles.length} chapters from ${novelName}...`);

  for (const file of mdFiles) {
    const srcPath = join(projectDir, file);
    const destPath = join(contentDir, file);

    const content = await readFile(srcPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    // Add or update frontmatter
    const newFrontmatter = generateFrontmatter(file, frontmatter);
    const newContent = `${newFrontmatter}\n\n${body}`;

    await writeFile(destPath, newContent);
    console.log(`  ✓ ${file}`);
  }

  console.log(`\nDone! ${mdFiles.length} chapters synced.`);
}

// Main
const novelName = process.argv[2] || '2028ww3';
syncNovel(novelName).catch(console.error);
