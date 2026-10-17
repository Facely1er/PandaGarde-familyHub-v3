import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Website-only public assets — not used in the standalone Family Hub app (saves ~8 MB in AAB).
 * Keep offline.html, _redirects, and _headers: hub.pandagarde.com (Netlify) and deploy:check need them.
 * Capacitor ignores those files; sw.js is still stripped below.
 */
const MOBILE_PRUNE_PATHS = [
  'images/story',
  'images/coloring',
  'downloads',
  'favicon.ico',
  'manifest.json',
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

function captureBootHtmlPlugin() {
  const storeCapture = process.env.VITE_STORE_SCREENSHOTS === 'true';
  const appReviewCapture = process.env.VITE_APP_REVIEW_DEMO === 'true';
  return {
    name: 'capture-boot-html',
    transformIndexHtml(html: string) {
      const flags: string[] = [];
      if (storeCapture) {
        flags.push('window.__PG_STORE_CAPTURE__=true');
      }
      if (appReviewCapture) {
        flags.push('window.__PG_APP_REVIEW_CAPTURE__=true');
      }
      if (flags.length === 0) {
        return html;
      }
      const bootFlag = `<script>${flags.join(';')};</script>`;
      return html.replace('<head>', `<head>\n    ${bootFlag}`);
    },
  };
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

/**
 * Dev/preview: serve familyhub.html at `/` and for hub SPA routes.
 * Without this, Vite still serves the website index.html — and opening
 * `/familyhub.html` leaves React Router on that pathname (infinite Navigate).
 */
const familyhubDevSpaPlugin = () => ({
  name: 'familyhub-dev-spa',
  configureServer(server: { middlewares: { use: (fn: (req: { url?: string }, _res: unknown, next: () => void) => void) => void } }) {
    server.middlewares.use((req, _res, next) => {
      const raw = req.url ?? '';
      const pathname = raw.split('?')[0] ?? '';
      const qs = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';

      const isViteInternal =
        pathname.startsWith('/@') ||
        pathname.startsWith('/node_modules') ||
        pathname.startsWith('/src/') ||
        pathname.startsWith('/__');
      const isStaticAsset =
        /\.\w+$/.test(pathname) &&
        pathname !== '/index.html' &&
        pathname !== '/familyhub.html';

      if (isViteInternal || isStaticAsset) {
        next();
        return;
      }

      req.url = `/familyhub.html${qs}`;
      next();
    });
  },
  configurePreviewServer(server: { middlewares: { use: (fn: (req: { url?: string }, _res: unknown, next: () => void) => void) => void } }) {
    server.middlewares.use((req, _res, next) => {
      const raw = req.url ?? '';
      const pathname = raw.split('?')[0] ?? '';
      const qs = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
      if (pathname === '/' || pathname === '/index.html' || !/\.\w+$/.test(pathname)) {
        req.url = `/familyhub.html${qs}`;
      }
      next();
    });
  },
});

/** Hub-only production bundle → dist-familyhub/ (Capacitor webDir) */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [familyhubDevSpaPlugin(), captureBootHtmlPlugin(), familyhubIndexHtmlPlugin()],
    define: {
      'import.meta.env.VITE_HUB_STANDALONE': JSON.stringify('true'),
      'import.meta.env.VITE_STORE_SCREENSHOTS': JSON.stringify(process.env.VITE_STORE_SCREENSHOTS ?? 'false'),
      'import.meta.env.VITE_CAPTURE_SCREEN': JSON.stringify(process.env.VITE_CAPTURE_SCREEN ?? ''),
      'import.meta.env.VITE_APP_REVIEW_DEMO': JSON.stringify(process.env.VITE_APP_REVIEW_DEMO ?? 'false'),
      'import.meta.env.VITE_DISABLE_PREMIUM_COMMERCE': JSON.stringify(
        process.env.VITE_DISABLE_PREMIUM_COMMERCE ?? 'false'
      ),
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
      open: '/',
    },
  })
);
