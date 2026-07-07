import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Capacitor and most hosts expect index.html at the web root */
const kidsIndexHtmlPlugin = () => ({
  name: 'kids-index-html',
  closeBundle() {
    const outDir = path.resolve(rootDir, 'dist-kids');
    const src = path.join(outDir, 'kids.html');
    const dest = path.join(outDir, 'index.html');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  },
});

/** Kids-game-only production bundle → dist-kids/ (future Capacitor webDir).
 *  Privacy-first: this bundle boots src/kidsapp/main.tsx, which initializes no
 *  analytics, no service worker, and makes no external network calls. */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [kidsIndexHtmlPlugin()],
    define: {
      'import.meta.env.VITE_KIDS_APP': JSON.stringify('true'),
    },
    build: {
      outDir: 'dist-kids',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: path.resolve(rootDir, 'kids.html'),
        },
      },
    },
    server: {
      port: 5175,
      open: '/kids.html',
    },
  })
);
