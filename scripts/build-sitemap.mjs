#!/usr/bin/env node
/**
 * Generate dist/sitemap.xml from the marketing route catalog.
 * Refreshes robots.txt Sitemap: line to match SITE_ORIGIN.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN } from './lib/siteOrigin.mjs';
import { MARKETING_ROUTES } from './lib/seoMarketingRoutes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = SITE_ORIGIN;
const TODAY = new Date().toISOString().slice(0, 10);

function locFor(routePath) {
  if (routePath === '/') return `${SITE}/`;
  return `${SITE}${routePath}`;
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function writeRobots(outDir) {
  const robotsPath = path.join(outDir, 'robots.txt');
  const publicRobotsPath = path.join(ROOT, 'public/robots.txt');
  if (!fs.existsSync(publicRobotsPath)) return;
  let robots = fs.readFileSync(publicRobotsPath, 'utf8');
  if (/^Sitemap:\s*\S+/m.test(robots)) {
    robots = robots.replace(/^Sitemap:\s*\S+\s*$/gim, `Sitemap: ${SITE}/sitemap.xml`);
  } else {
    robots = `${robots.trimEnd()}\n\nSitemap: ${SITE}/sitemap.xml\n`;
  }
  fs.writeFileSync(robotsPath, robots, 'utf8');
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[build-sitemap] dist/ missing — run vite build first');
    process.exit(1);
  }

  const entries = MARKETING_ROUTES.map((route) =>
    urlEntry({
      loc: locFor(route.path),
      lastmod: TODAY,
      changefreq: route.changefreq,
      priority: route.priority,
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  if (/https:\/\/(?!www\.)pandagarde\.com\b/i.test(xml)) {
    console.error(
      '[build-sitemap] refused to write apex host URLs — SITE_ORIGIN must be https://www.pandagarde.com'
    );
    process.exit(1);
  }

  const out = path.join(DIST, 'sitemap.xml');
  fs.writeFileSync(out, xml, 'utf8');
  writeRobots(DIST);

  // Keep public stub aligned for local previews / GSC spot-checks before deploy.
  fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf8');
  writeRobots(path.join(ROOT, 'public'));

  console.log(`[build-sitemap] wrote ${entries.length} URLs → ${out}`);
}

main();
