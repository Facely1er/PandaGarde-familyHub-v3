#!/usr/bin/env node
/**
 * Ensures every imageUrl in storyScenes.ts exists under public/images/story with non-zero size.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storyScenesPath = path.join(root, 'src/data/storyScenes.ts');
const storyDir = path.join(root, 'public/images/story');

const source = fs.readFileSync(storyScenesPath, 'utf8');
const urls = [...source.matchAll(/imageUrl:\s*'([^']+)'/g)].map((m) => m[1]);

if (!fs.existsSync(storyDir)) {
  console.error('verify-story-scene-assets: missing directory public/images/story');
  process.exit(1);
}

const errors = [];
for (const url of urls) {
  const fileName = path.basename(url);
  const filePath = path.join(storyDir, fileName);
  if (!fs.existsSync(filePath)) {
    errors.push(`missing file: ${fileName} (from ${url})`);
    continue;
  }
  const { size } = fs.statSync(filePath);
  if (size === 0) {
    errors.push(`empty file: ${fileName}`);
  }
}

if (errors.length > 0) {
  console.error('verify-story-scene-assets: FAILED\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`verify-story-scene-assets: OK (${urls.length} scene images)`);
