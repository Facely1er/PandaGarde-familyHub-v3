import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

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
    const redirectsSrc = path.resolve(rootDir, 'public/familyhub-_redirects');
    if (fs.existsSync(redirectsSrc)) {
      fs.copyFileSync(redirectsSrc, path.join(outDir, '_redirects'));
    }
  },
});

/** Hub-only production bundle → dist-familyhub/ (Capacitor webDir) */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [familyhubIndexHtmlPlugin()],
    define: {
      'import.meta.env.VITE_HUB_STANDALONE': JSON.stringify('true'),
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
