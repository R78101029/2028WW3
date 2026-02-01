#!/usr/bin/env node
/**
 * Publish chapter updates to WordPress
 *
 * Usage: node scripts/publish-to-wp.js [chapter-files...]
 *
 * Environment variables:
 * - WP_URL: WordPress site URL (e.g., https://blog.cqi365.net)
 * - WP_USER: WordPress username
 * - WP_APP_PASSWORD: WordPress application password
 * - NOVEL_SITE_URL: Novel site URL for "read more" links
 *
 * Image handling:
 * - Cover images (frontmatter `cover` field): Uploaded to WP as featured image
 * - Inline images: Converted to use NOVEL_SITE_URL URLs
 */

import { readFile, access } from 'fs/promises';
import { basename, dirname, join } from 'path';
import { constants } from 'fs';

const WP_URL = process.env.WP_URL || 'https://blog.cqi365.net';
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
const NOVEL_SITE_URL = process.env.NOVEL_SITE_URL || 'https://novels.cqi365.net';

// Novel metadata
const NOVELS = {
  '2028ww3': {
    title: '2028 第三次世界大戰',
    category: '小說連載',
  },
};

/**
 * Get auth header
 */
function getAuthHeader() {
  return `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64')}`;
}

/**
 * Extract frontmatter and content from markdown
 */
function parseMarkdown(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (frontmatterMatch) {
    const frontmatter = {};
    frontmatterMatch[1].split('\n').forEach(line => {
      const [key, ...value] = line.split(':');
      if (key && value.length) {
        frontmatter[key.trim()] = value.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
    return { frontmatter, body: frontmatterMatch[2].trim() };
  }
  return { frontmatter: {}, body: content };
}

/**
 * Get chapter URL slug from filename
 */
function getChapterSlug(filename) {
  return basename(filename, '.md').toLowerCase().replace(/_/g, '-');
}

/**
 * Get novel slug from file path
 */
function getNovelSlug(filepath) {
  const match = filepath.match(/projects\/([^/]+)\/chapters/);
  return match ? match[1] : null;
}

/**
 * Create excerpt (first 500 characters)
 */
function createExcerpt(content, maxLength = 500) {
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '')  // Remove images
    .replace(/[#*_`]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;

  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Convert inline markdown images to use Novels365 URLs
 */
function convertInlineImages(markdown, novelSlug) {
  // Convert relative image paths to absolute URLs
  // ![alt](../_assets/chapters/image.jpg) -> ![alt](https://novels.cqi365.net/assets/novel-slug/image.jpg)
  return markdown.replace(
    /!\[(.*?)\]\(\.\.?\/_assets\/(.*?)\)/g,
    (match, alt, path) => {
      const imageUrl = `${NOVEL_SITE_URL}/assets/${novelSlug}/${path}`;
      return `![${alt}](${imageUrl})`;
    }
  );
}

/**
 * Convert markdown to HTML (basic conversion)
 */
function markdownToHtml(markdown) {
  return markdown
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;">')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap in paragraph
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<img[^>]*>)<\/p>/g, '$1')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
}

/**
 * Search for existing post by slug
 */
async function findExistingPost(slug) {
  const endpoint = `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish,draft`;

  const response = await fetch(endpoint, {
    headers: { 'Authorization': getAuthHeader() },
  });

  if (!response.ok) return null;

  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Search for existing media by filename
 */
async function findExistingMedia(filename) {
  const searchName = basename(filename, '.jpg').replace(/[^a-zA-Z0-9]/g, '-');
  const endpoint = `${WP_URL}/wp-json/wp/v2/media?search=${encodeURIComponent(searchName)}`;

  const response = await fetch(endpoint, {
    headers: { 'Authorization': getAuthHeader() },
  });

  if (!response.ok) return null;

  const media = await response.json();
  // Find exact match by slug pattern
  const exactMatch = media.find(m => m.slug.includes(searchName.toLowerCase()));
  return exactMatch || null;
}

/**
 * Upload image to WordPress media library
 */
async function uploadImageToWordPress(imagePath, altText) {
  const filename = basename(imagePath);

  // Check if file exists
  try {
    await access(imagePath, constants.R_OK);
  } catch {
    console.log(`    ⚠ Cover image not found: ${imagePath}`);
    return null;
  }

  // Check if already uploaded
  const existing = await findExistingMedia(filename);
  if (existing) {
    console.log(`    ↻ Cover already exists in WP (ID: ${existing.id})`);
    return existing.id;
  }

  // Read and upload
  const imageBuffer = await readFile(imagePath);
  const endpoint = `${WP_URL}/wp-json/wp/v2/media`;

  // Determine content type
  const ext = filename.split('.').pop().toLowerCase();
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
  };
  const contentType = contentTypes[ext] || 'image/jpeg';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body: imageBuffer,
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(`    ⚠ Failed to upload cover: ${error}`);
    return null;
  }

  const media = await response.json();

  // Update alt text
  if (altText) {
    await fetch(`${WP_URL}/wp-json/wp/v2/media/${media.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alt_text: altText }),
    });
  }

  console.log(`    ✓ Cover uploaded (ID: ${media.id})`);
  return media.id;
}

/**
 * Generate unique post slug from novel and chapter
 */
function generatePostSlug(novelSlug, chapterSlug) {
  return `${novelSlug}-${chapterSlug}`;
}

/**
 * Resolve cover image path
 */
function resolveCoverPath(chapterFile, coverValue, novelSlug) {
  const chapterDir = dirname(chapterFile);
  const projectDir = join(chapterDir, '..');

  // If cover is just a filename like "ch01-cover.jpg"
  // Look in _assets/chapters/
  if (!coverValue.includes('/')) {
    return join(projectDir, '_assets', 'chapters', coverValue);
  }

  // If it's a relative path
  return join(chapterDir, coverValue);
}

/**
 * Post to WordPress (create or update)
 */
async function postToWordPress(title, content, excerpt, slug, featuredMediaId = null) {
  // Check if post already exists
  const existingPost = await findExistingPost(slug);

  const postData = {
    title,
    content,
    excerpt,
    slug,
    status: 'publish',
  };

  // Add featured image if provided
  if (featuredMediaId) {
    postData.featured_media = featuredMediaId;
  }

  let endpoint, method;

  if (existingPost) {
    endpoint = `${WP_URL}/wp-json/wp/v2/posts/${existingPost.id}`;
    method = 'PUT';
  } else {
    endpoint = `${WP_URL}/wp-json/wp/v2/posts`;
    method = 'POST';
  }

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WordPress API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return { ...result, isUpdate: !!existingPost };
}

/**
 * Main function
 */
async function main() {
  const files = process.argv.slice(2).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No chapter files to publish.');
    return;
  }

  if (!WP_USER || !WP_APP_PASSWORD) {
    console.error('Error: WP_USER and WP_APP_PASSWORD environment variables required.');
    process.exit(1);
  }

  console.log(`Publishing ${files.length} chapter(s) to WordPress...`);
  console.log(`Novel site: ${NOVEL_SITE_URL}`);
  console.log('');

  for (const file of files) {
    try {
      const novelSlug = getNovelSlug(file);
      const novel = NOVELS[novelSlug];

      if (!novel) {
        console.log(`⊘ Skipping ${file}: Unknown novel`);
        continue;
      }

      console.log(`Processing: ${basename(file)}`);

      const content = await readFile(file, 'utf-8');
      const { frontmatter, body } = parseMarkdown(content);

      const chapterTitle = frontmatter.title || basename(file, '.md');
      const chapterSlug = getChapterSlug(file);
      const chapterUrl = `${NOVEL_SITE_URL}/novel/${novelSlug}/${chapterSlug}`;
      const wpSlug = generatePostSlug(novelSlug, chapterSlug);

      // Handle cover image
      let featuredMediaId = null;
      if (frontmatter.cover) {
        const coverPath = resolveCoverPath(file, frontmatter.cover, novelSlug);
        console.log(`    Cover: ${frontmatter.cover}`);
        featuredMediaId = await uploadImageToWordPress(coverPath, `${novel.title} - ${chapterTitle}`);
      }

      // Convert inline images to use Novels365 URLs
      const bodyWithUrls = convertInlineImages(body, novelSlug);

      // Create WordPress post content
      const wpTitle = `【${novel.title}】${chapterTitle}`;
      const excerpt = createExcerpt(body);

      const wpContent = `
<p>${excerpt}</p>

<p><a href="${chapterUrl}" target="_blank" rel="noopener"><strong>👉 點此繼續閱讀完整章節</strong></a></p>

<hr>

<p><em>本章節來自《${novel.title}》，更多精彩內容請前往 <a href="${NOVEL_SITE_URL}" target="_blank">Novels365</a> 閱讀。</em></p>
      `.trim();

      const result = await postToWordPress(wpTitle, wpContent, excerpt, wpSlug, featuredMediaId);
      const action = result.isUpdate ? '✓ Updated' : '✓ Created';
      console.log(`  ${action}: ${chapterTitle}`);
      console.log(`    URL: ${result.link}`);
      console.log('');

    } catch (error) {
      console.error(`  ✗ Failed: ${file}`);
      console.error(`    Error: ${error.message}`);
      console.log('');
    }
  }

  console.log('Done!');
}

main().catch(console.error);
