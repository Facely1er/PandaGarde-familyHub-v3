import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Website-only public assets — not used in the standalone Family Hub app (saves ~8 MB in AAB). */
const MOBILE_PRUNE_PATHS = [
  'images/story',
  'images/coloring',
  'downloads',
  'offline.html',
  'favicon.ico',
  'manifest.json',
  '_redirects',
  '_headers',
];

function rmPath(target: string) {
  if (!fs.existsSync(target)) {
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function pruneMobileOnlyAssets(outDir: string) {
  for (const rel of MOBILE_PRUNE_PATHS) {
    rmPath(path.join(outDir, rel));
  }
}

/** Capacitor and most hosts expect index.html at the web root */
const familyhubIndexHtmlPlugin = () => ({
  name: 'familyhub-index-html',
  closeBundle() {
    const outDir = path.resolve(rootDir, 'dist-familyhub');
    const src = path.join(outDir, 'familyhub.html');
    const dest = path.join(outDir, 'index.html');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
    // Netlify-only — skip for Capacitor (pruned after copy if present).
    const redirectsSrc = path.resolve(rootDir, 'public/familyhub-_redirects');
    if (fs.existsSync(redirectsSrc)) {
      fs.copyFileSync(redirectsSrc, path.join(outDir, '_redirects'));
    }
    const headersSrc = path.resolve(rootDir, 'public/_headers');
    if (fs.existsSync(headersSrc)) {
      fs.copyFileSync(headersSrc, path.join(outDir, '_headers'));
    }
    // Service workers break Capacitor — never ship sw.js in the hub bundle.
    const swPath = path.join(outDir, 'sw.js');
    if (fs.existsSync(swPath)) {
      fs.unlinkSync(swPath);
    }
    pruneMobileOnlyAssets(outDir);
  },
});

/** Hub-only production bundle → dist-familyhub/ (Capacitor webDir) */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [familyhubIndexHtmlPlugin()],
    define: {
      'import.meta.env.VITE_HUB_STANDALONE': JSON.stringify('true'),
      'import.meta.env.VITE_STORE_SCREENSHOTS': JSON.stringify(process.env.VITE_STORE_SCREENSHOTS ?? 'false'),
    },
    build: {
      outDir: 'dist-familyhub',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: path.resolve(rootDir, 'familyhub.html'),
        },
      },
    },
    server: {
      port: 5174,
      open: '/familyhub.html',
    },
  })
);
