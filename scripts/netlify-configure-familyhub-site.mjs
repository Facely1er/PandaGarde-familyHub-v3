/**
 * Configure pandagarde-family-hub Netlify site for hub-only CI builds.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

const SITE_ID = '09a33b67-21f2-4f27-bc38-1b732b9cf29e';

function getToken() {
  const configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'netlify', 'Config', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const first = Object.values(config.users ?? {})[0];
  if (!first?.auth?.token) {
    throw new Error('Netlify auth token not found');
  }
  return first.auth.token;
}

async function main() {
  const token = getToken();

  const body = {
    build_settings: {
      cmd: 'npm ci --ignore-scripts && npm run build:familyhub',
      dir: 'dist-familyhub',
      base: '',
    },
    repo: {
      repo_path: 'Facely1er/PandaGarde-familyHub-v3',
      provider: 'github',
      repo_branch: 'main',
      cmd: 'npm ci --ignore-scripts && npm run build:familyhub',
      dir: 'dist-familyhub',
    },
  };

  const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('Failed:', res.status, text);
    process.exit(1);
  }

  const site = JSON.parse(text);
  console.log('Build command:', site.build_settings?.cmd);
  console.log('Publish dir:', site.build_settings?.dir);
  console.log('Production URL:', site.ssl_url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
