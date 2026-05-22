/**
 * Verifies internal app paths resolve to registered routes (no user-facing 404s).
 * Run: node scripts/verify-routes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function extractAppRoutes(appTsx) {
  const routes = new Set(['/']);
  const re = /path=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(appTsx)) !== null) {
    const p = m[1];
    if (p === '*') continue;
    routes.add(p.startsWith('/') ? p : `/${p}`);
  }
  // Legacy aliases that redirect via <Navigate>
  const navRe = /<Navigate\s+to=["'](\/[^"']+)["']/g;
  while ((m = navRe.exec(appTsx)) !== null) {
    routes.add(m[1].split('#')[0].replace(/\/$/, '') || '/');
  }
  return routes;
}

function extractHubRoutes(wrapperTsx) {
  const routes = new Set(['/family-hub', '/family-hub/']);
  const re = /path=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(wrapperTsx)) !== null) {
    const p = m[1];
    if (p === '*') continue;
    routes.add(`/family-hub${p === '/' ? '' : `/${p.replace(/^\//, '')}`}`);
  }
  const legacy = ['profile', 'certificates', 'learning', 'journeys', 'games'];
  for (const segment of legacy) {
    routes.add(`/family-hub/${segment}`);
  }
  return routes;
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name === 'node_modules' || name.endsWith('.test.tsx') || name.endsWith('.test.ts')) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(full);
  }
  return files;
}

function extractLinkedPaths(content) {
  const paths = new Set();
  const patterns = [
    /\bto=["'](\/[^"'#?]*)/g,
    /\bhref=["'](\/[^"'#?]*)/g,
    /\burl:\s*["'](\/[^"'#?]*)/g,
    /\blinkUrl:\s*["'](\/[^"'#?]*)/g,
    /\bpageUrl:\s*["'](\/[^"'#?]*)/g,
    /\barticleUrl:\s*["'](\/[^"'#?]*)/g,
    /\bnavigate\(\s*["'](\/[^"'#?]*)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      let p = m[1].replace(/\/$/, '') || '/';
      paths.add(p);
    }
  }
  return paths;
}

function normalizeForMatch(linkPath, appRoutes) {
  if (appRoutes.has(linkPath)) return { ok: true };

  // Family hub nested
  if (linkPath.startsWith('/family-hub')) {
    const hubRoutes = extractHubRoutes(read('src/pages/family-hub/FamilyHubWrapper.tsx'));
    if (hubRoutes.has(linkPath)) return { ok: true };
    // /family-hub alone -> redirect
    if (linkPath === '/family-hub') return { ok: true };
  }

  // Dynamic: stories, newsletter, activities
  if (linkPath.startsWith('/stories/')) {
    const slug = linkPath.slice('/stories/'.length);
    const stories = read('src/data/stories.ts');
    if (stories.includes(`slug: '${slug}'`) || stories.includes(`slug: "${slug}"`)) {
      return { ok: true };
    }
    return { ok: false, reason: 'unknown story slug' };
  }

  if (linkPath.startsWith('/newsletter/') && linkPath !== '/newsletter/archive' && linkPath !== '/newsletter/unsubscribe') {
    const id = linkPath.slice('/newsletter/'.length);
    const newsletters = read('src/data/newsletters/index.ts');
    if (newsletters.includes(`id: '${id}'`) || newsletters.includes(`id: "${id}"`)) {
      return { ok: true };
    }
    return { ok: false, reason: 'unknown newsletter id' };
  }

  if (linkPath.startsWith('/activities/') && linkPath !== '/activities/privacy-learning-kit' && linkPath !== '/activities/story') {
    const slug = linkPath.slice('/activities/'.length);
    const catalog = read('src/data/privacyActivitiesCatalog.ts');
    if (catalog.includes(`slug: '${slug}'`) || catalog.includes(`id: '${slug}'`)) {
      return { ok: true };
    }
    return { ok: false, reason: 'unknown activity slug' };
  }

  // Prefix match for param routes in App.tsx
  const prefixes = [
    ['/stories/', '/stories/:slug'],
    ['/newsletter/', '/newsletter/:id'],
    ['/activities/', '/activities/:activityId'],
    ['/family-hub/', '/family-hub/*'],
  ];

  for (const [prefix, routePattern] of prefixes) {
    if (linkPath.startsWith(prefix) && appRoutes.has(routePattern)) {
      return { ok: true, note: 'dynamic segment (not validated)' };
    }
  }

  if (appRoutes.has('/family-hub/*') && linkPath.startsWith('/family-hub/')) {
    return { ok: false, reason: 'family-hub path not in hub registry' };
  }

  return { ok: false, reason: 'no matching route' };
}

const appRoutes = extractAppRoutes(read('src/App.tsx'));
const hubRoutes = extractHubRoutes(read('src/pages/family-hub/FamilyHubWrapper.tsx'));

const allLinks = new Map();
for (const file of walk(srcDir)) {
  const rel = path.relative(root, file);
  if (
    rel.includes('FamilyHubPage.tsx') ||
    rel.includes('FamilyHubFooter.tsx') ||
    rel.includes('FamilyHubHeader.tsx') ||
    rel.includes('FamilyHubApp.tsx')
  ) {
    continue; // legacy / standalone entry — not main App routes
  }
  const content = fs.readFileSync(file, 'utf8');
  for (const p of extractLinkedPaths(content)) {
    if (!allLinks.has(p)) allLinks.set(p, []);
    allLinks.get(p).push(rel);
  }
}

const failures = [];
for (const [linkPath, sources] of [...allLinks.entries()].sort()) {
  const result = normalizeForMatch(linkPath, appRoutes);
  if (!result.ok) {
    failures.push({ linkPath, reason: result.reason, sources: [...new Set(sources)].slice(0, 3) });
  }
}

// Search index explicit check
const search = read('src/lib/searchService.ts');
const searchUrls = [...search.matchAll(/url:\s*['"](\/[^'"]+)['"]/g)].map((m) => m[1]);

console.log(`App routes: ${appRoutes.size}`);
console.log(`Family hub routes: ${[...hubRoutes].join(', ')}`);
console.log(`Internal links scanned: ${allLinks.size}`);

if (failures.length) {
  console.error('\nBroken internal links (would hit NotFound or empty hub shell):\n');
  for (const f of failures) {
    console.error(`  ${f.linkPath} — ${f.reason}`);
    console.error(`    via: ${f.sources.join(', ')}\n`);
  }
  process.exit(1);
}

const searchBroken = searchUrls.filter((u) => !normalizeForMatch(u, appRoutes).ok);
if (searchBroken.length) {
  console.error('\nBroken search index URLs:\n');
  for (const u of searchBroken) console.error(`  ${u}`);
  process.exit(1);
}

console.log('\nAll scanned internal paths resolve.');
