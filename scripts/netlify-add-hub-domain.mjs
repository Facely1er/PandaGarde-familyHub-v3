/**
 * Attach hub.pandagarde.com to the pandagarde-family-hub Netlify site.
 * Uses Netlify CLI auth token from local config.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

const SITE_ID = '09a33b67-21f2-4f27-bc38-1b732b9cf29e';
const DOMAIN = 'hub.pandagarde.com';

function getToken() {
  const configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'netlify', 'Config', 'config.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(raw);
  const users = config.users ?? {};
  const first = Object.values(users)[0];
  if (!first?.auth?.token) {
    throw new Error('Netlify auth token not found. Run: netlify login');
  }
  return first.auth.token;
}

async function main() {
  const token = getToken();

  const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ custom_domain: DOMAIN }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('Failed to set custom domain:', res.status, text);
    process.exit(1);
  }

  const site = JSON.parse(text);
  console.log('Custom domain set:', site.custom_domain ?? site.ssl_url);
  console.log('Site URL:', site.ssl_url || site.url);
  console.log('Admin:', site.admin_url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
