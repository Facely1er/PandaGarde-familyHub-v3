import { defineConfig, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';

/** React printable hub routes — must win over public/downloads/*.html clean URLs in dev/preview. */
const SPA_DOWNLOAD_ROUTES = new Set([
  '/downloads/coloring-sheets',
  '/downloads/safety-posters',
  '/downloads/certificates',
  '/downloads/family-agreement',
  '/downloads/worksheets',
]);

const spaDownloadRoutesPlugin = () => ({
  name: 'spa-download-routes',
  enforce: 'pre' as const,
  configureServer(server: Connect.Server) {
    server.middlewares.use(spaDownloadRouteMiddleware);
  },
  configurePreviewServer(server: Connect.Server) {
    server.middlewares.use(spaDownloadRouteMiddleware);
  },
});

const spaDownloadRouteMiddleware: Connect.NextHandleFunction = (
  req: IncomingMessage,
  _res: ServerResponse,
  next,
) => {
  const pathname = req.url?.split('?')[0] ?? '';
  if (SPA_DOWNLOAD_ROUTES.has(pathname)) {
    req.url = '/index.html';
  }
  next();
};

const optionalDependenciesPlugin = () => ({
  name: 'optional-dependencies',
  resolveId(id: string) {
    if (id === '@emailjs/browser') {
      return { id, external: true };
    }
    return null;
  },
});

/** Legacy scene files used spaces/apostrophes; rename to hyphenated URLs in storyScenes.ts. */
const STORY_SCENE_RENAMES: Record<string, string> = {
  "05-Po's Den.png": '05-Po-Den.png',
  '06-Turtle Appears.png': '06-Turtle-Appears.png',
  '08-New Po.png': '08-New-Po.png',
  '09-Po teaches.png': '09-Po-teaches.png',
};

const normalizeStorySceneAssetsPlugin = () => ({
  name: 'normalize-story-scene-assets',
  buildStart() {
    const storyDir = path.resolve(__dirname, 'public/images/story');
    if (!fs.existsSync(storyDir)) {
      return;
    }
    for (const [legacyName, safeName] of Object.entries(STORY_SCENE_RENAMES)) {
      const legacyPath = path.join(storyDir, legacyName);
      const safePath = path.join(storyDir, safeName);
      if (!fs.existsSync(legacyPath)) {
        continue;
      }
      try {
        if (!fs.existsSync(safePath) || fs.statSync(safePath).size === 0) {
          fs.copyFileSync(legacyPath, safePath);
        }
        fs.unlinkSync(legacyPath);
        console.warn(`Renamed story scene asset: ${legacyName} → ${safeName}`);
      } catch (_err) {
        // File might be locked; skip
      }
    }
  },
});

export default defineConfig({
  plugins: [react(), spaDownloadRoutesPlugin(), optionalDependenciesPlugin(), normalizeStorySceneAssetsPlugin()],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {return 'images/[name]-[hash][extname]';}
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {return 'fonts/[name]-[hash][extname]';}
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: false
  }
});
