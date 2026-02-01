#!/usr/bin/env node
/**
 * Auto-insert images into chapters based on naming conventions
 *
 * Usage: node scripts/auto-insert-images.js [novel-name]
 *
 * Naming conventions for images in _assets/chapters/:
 *   {chapter}-cover.jpg         → Set as frontmatter cover
 *   {chapter}-scene-{desc}.jpg  → Insert into chapter content
 *
 * Chapter matching:
 *   ch01  → matches Chap_01, chapter_01, etc.
 *   ch05  → matches Chap_05, chapter_05, etc.
 *
 * Examples:
 *   ch01-cover.jpg           → Sets cover for chapter 1
 *   ch01-scene-battle.jpg    → Inserts image in chapter 1
 *   ch03-scene-meeting.jpg   → Inserts image in chapter 3
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';

const PROJECTS_DIR = './projects';

/**
 * Parse image filename to extract chapter number and type
 */
function parseImageName(filename) {
  // Match: ch01-cover.jpg or ch01-scene-description.jpg
  const match = filename.match(/^ch(\d+)-(cover|scene)(?:-(.+))?\.(jpg|jpeg|png|gif|webp)$/i);
  if (!match) return null;

  return {
    chapterNum: parseInt(match[1], 10),
    type: match[2].toLowerCase(),  // 'cover' or 'scene'
    description: match[3] || '',
    filename: filename,
  };
}

/**
 * Find chapter file by chapter number
 */
function findChapterFile(files, chapterNum) {
  const patterns = [
    new RegExp(`Chap_0*${chapterNum}[_-]`, 'i'),
    new RegExp(`chapter_0*${chapterNum}[_.]`, 'i'),
    new RegExp(`^0*${chapterNum}[_-]`, 'i'),
  ];

  for (const file of files) {
    for (const pattern of patterns) {
      if (pattern.test(file)) return file;
    }
  }
  return null;
}

/**
 * Parse markdown frontmatter
 */
function parseMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const frontmatter = {};
    match[1].split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.substring(0, colonIdx).trim();
        const value = line.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = value;
      }
    });
    return { frontmatter, body: match[2].trim(), raw: match[1] };
  }
  return { frontmatter: {}, body: content.trim(), raw: '' };
}

/**
 * Rebuild frontmatter string
 */
function buildFrontmatter(frontmatter) {
  const lines = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: "${value}"`);
  return `---\n${lines.join('\n')}\n---`;
}

/**
 * Generate image alt text from description
 */
function generateAltText(description, chapterNum) {
  if (description) {
    return description.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  return `Chapter ${chapterNum} Scene`;
}

/**
 * Check if image already exists in content
 */
function imageExistsInContent(content, filename) {
  return content.includes(filename);
}

/**
 * Insert scene image into chapter body
 * Inserts after the first paragraph or heading
 */
function insertSceneImage(body, imageRef) {
  // Find first paragraph break or after first heading
  const firstBreak = body.search(/\n\n/);
  if (firstBreak > 0) {
    return body.slice(0, firstBreak) + '\n\n' + imageRef + body.slice(firstBreak);
  }
  // If no break found, add at the beginning
  return imageRef + '\n\n' + body;
}

/**
 * Main function
 */
async function main() {
  const novelName = process.argv[2] || '2028ww3';
  const assetsDir = join(PROJECTS_DIR, novelName, '_assets', 'chapters');
  const chaptersDir = join(PROJECTS_DIR, novelName, 'chapters');

  if (!existsSync(assetsDir)) {
    console.log(`No assets directory: ${assetsDir}`);
    console.log('Create the directory and add images first.');
    return;
  }

  if (!existsSync(chaptersDir)) {
    console.log(`No chapters directory: ${chaptersDir}`);
    return;
  }

  // Get all images
  const imageFiles = (await readdir(assetsDir))
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log('No images found in assets directory.');
    return;
  }

  // Get all chapter files
  const chapterFiles = (await readdir(chaptersDir))
    .filter(f => f.endsWith('.md'));

  // Optional: Filter by specific chapter if provided
  const targetChapter = process.argv[3];
  if (targetChapter) {
    console.log(`Targeting specific chapter: ${targetChapter}`);
  }

  console.log(`Found ${imageFiles.length} images, ${chapterFiles.length} chapters`);
  console.log('');

  // Group images by chapter
  const imagesByChapter = new Map();
  for (const imageFile of imageFiles) {
    const parsed = parseImageName(imageFile);
    if (!parsed) {
      console.log(`⚠ Skipping (invalid name): ${imageFile}`);
      continue;
    }

    if (!imagesByChapter.has(parsed.chapterNum)) {
      imagesByChapter.set(parsed.chapterNum, []);
    }
    imagesByChapter.get(parsed.chapterNum).push(parsed);
  }

  // Process each chapter
  let updatedCount = 0;
  for (const [chapterNum, images] of imagesByChapter) {
    // If target provided, skip unless this chapter matches the target
    // Note: This relies on the image matching the chapter number.
    // If we want to force-match the file, we need to ensure the image IS for this file.
    
    let chapterFile = findChapterFile(chapterFiles, chapterNum);
    
    // If specific target is requested, override the lookup
    if (targetChapter) {
        // Only process if the found file matches ONLY, or if the user wants to strictly link ANY ch{N} image to THIS file?
        // Better logic: If targetChapter is set, we ONLY process that file.
        // And we need to find which 'chapterNum' that file corresponds to, OR just assume the images are correctly named for it.
        // But the images are grouped by 'chapterNum' derived from filename 'ch{N}'.
        
        // Let's invert: If we found a file for this chapterNum, check if it matches target.
        if (chapterFile !== targetChapter) {
            // Check if existing lookup found the WRONG file for this number
            // e.g. looked for 01, found 01-B, but target is 01_Interlude.
            
            // Try to force-match the target file to see if it acts as chapterNum
            // This is tricky because the image says "ch01". The file says "Chap_01...".
            // If we are processing images for ch01, and target is Chap_01_Interlude...
            // we should perform the update on Chap_01_Interlude instead of what findChapterFile returns.
            
            // Is targetString containing chapterNum?
            const targetNumMatch = targetChapter.match(/(?:Chap|chapter)_?0*(\d+)/i) || targetChapter.match(/^0*(\d+)/);
            const targetNum = targetNumMatch ? parseInt(targetNumMatch[1], 10) : -1;
            
            if (targetNum === chapterNum) {
                chapterFile = targetChapter; // Force it
            } else {
                continue; // This image group belongs to a different chapter number
            }
        }
    }
    
    if (!chapterFile) {
      console.log(`⚠ No chapter file found for ch${String(chapterNum).padStart(2, '0')}`);
      continue;
    }

    const chapterPath = join(chaptersDir, chapterFile);
    const content = await readFile(chapterPath, 'utf-8');
    const { frontmatter, body } = parseMarkdown(content);

    let newFrontmatter = { ...frontmatter };
    let newBody = body;
    let modified = false;

    for (const image of images) {
      if (image.type === 'cover') {
        // Set cover in frontmatter
        if (frontmatter.cover !== image.filename) {
          newFrontmatter.cover = image.filename;
          console.log(`✓ ${chapterFile}: Set cover → ${image.filename}`);
          modified = true;
        }
      } else if (image.type === 'scene') {
        // Insert scene image into body
        if (!imageExistsInContent(body, image.filename)) {
          const altText = generateAltText(image.description, chapterNum);
          const imageRef = `![${altText}](../_assets/chapters/${image.filename})`;
          newBody = insertSceneImage(newBody, imageRef);
          console.log(`✓ ${chapterFile}: Insert scene → ${image.filename}`);
          modified = true;
        }
      }
    }

    if (modified) {
      const newContent = `${buildFrontmatter(newFrontmatter)}\n\n${newBody}`;
      await writeFile(chapterPath, newContent);
      updatedCount++;
    }
  }

  console.log('');
  console.log(`Done! Updated ${updatedCount} chapter(s).`);

  if (updatedCount > 0) {
    console.log('');
    console.log('Next steps:');
    console.log('1. Review the changes: git diff');
    console.log('2. Commit and push to trigger WordPress publish');
  }
}

main().catch(console.error);
