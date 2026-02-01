# Deployment Guide

## Overview

This project uses a dual deployment strategy:
1. **Cloudflare Pages** - Primary website hosting
2. **WordPress** (Optional) - Blog/syndication

## Cloudflare Pages Setup

### 1. Connect Repository

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create new project → Connect to Git
3. Select repository: `CQI365-Novel`
4. Configure build settings:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `site` |

### 2. Environment Variables

No environment variables required for basic setup.

### 3. Custom Domain (Optional)

1. Go to project → Custom domains
2. Add domain: `novels.cqi365.net`
3. Follow DNS configuration instructions

## Local Development

```bash
# Install dependencies
cd site
npm install

# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Build Process

The `npm run build` command runs:

1. **Sync Chapters** (`sync-chapters.js`)
   - Copies chapters from `projects/*/chapters/` to `site/src/content/novels/`
   - Processes frontmatter

2. **Generate Stats** (`generate-stats.js`)
   - Calculates chapter count and word count
   - Outputs to `site/src/data/novels-stats.json`

3. **Astro Build** (`astro build`)
   - Generates static HTML
   - Outputs to `site/dist/`

## WordPress Integration (Optional)

### Setup

1. **Create Application Password**
   - WordPress Admin → Users → Profile
   - Scroll to "Application Passwords"
   - Create new password

2. **Configure GitHub Secrets**

   Go to Repository → Settings → Secrets → Actions

   Add these secrets:
   - `WP_URL`: `https://blog.cqi365.net`
   - `WP_USER`: Your WordPress username
   - `WP_APP_PASSWORD`: Application password from step 1

### Manual Publishing

```bash
# Set environment variables
export WP_URL=https://blog.cqi365.net
export WP_USER=your-username
export WP_APP_PASSWORD=your-app-password

# Publish specific chapter
node scripts/publish-to-wp.js 2028ww3 Chap_01_Interlude_I_Silence_From_Above

# Publish all chapters
node scripts/publish-to-wp.js 2028ww3 --all
```

## Deployment Workflow

### Automatic (Recommended)

1. Push changes to `main` branch
2. Cloudflare Pages automatically builds and deploys
3. Live in ~2-3 minutes

### Manual

```bash
# Build locally
cd site
npm run build

# Deploy via Wrangler (if configured)
npx wrangler pages deploy dist
```

## Troubleshooting

### Build Fails

1. **Check Node version**: Requires Node 18+
2. **Check dependencies**: Run `npm install` in `site/`
3. **Check sync**: Run `node ../scripts/sync-chapters.js` manually

### Content Not Updating

1. Clear Cloudflare cache: Settings → Caching → Purge Everything
2. Check if changes are on `main` branch
3. Verify build succeeded in Cloudflare dashboard

### WordPress Publishing Issues

1. **401 Unauthorized**: Check WP_USER and WP_APP_PASSWORD
2. **Category not found**: Category will be auto-created
3. **Duplicate posts**: Script checks for existing posts by slug

## Monitoring

- **Cloudflare Pages**: Dashboard shows build history and analytics
- **Build logs**: Available in Cloudflare Pages → Deployments

## Security Notes

1. **Never commit secrets**: Use GitHub Secrets or environment variables
2. **Application passwords**: Revoke old passwords periodically
3. **Branch protection**: Consider protecting `main` branch
