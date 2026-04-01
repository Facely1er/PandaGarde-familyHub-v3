import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const optionalDependenciesPlugin = () => ({
  name: 'optional-dependencies',
  resolveId(id: string) {
    if (id === '@emailjs/browser') {
      return { id, external: true };
    }
    return null;
  },
});

const cleanPublicDirPlugin = () => ({
  name: 'clean-public-dir',
  buildStart() {
    const storyDir = path.resolve(__dirname, 'public/images/story');
    if (fs.existsSync(storyDir)) {
      const files = fs.readdirSync(storyDir);
      files.forEach(file => {
        if (file.includes("'") || file.includes(' ')) {
          const filePath = path.join(storyDir, file);
          try {
            fs.unlinkSync(filePath);
            console.log(`Removed problematic file: ${file}`);
          } catch (err) {
            // File might be locked, skip it
          }
        }
      });
    }
  }
});

export default defineConfig({
  plugins: [react(), optionalDependenciesPlugin(), cleanPublicDirPlugin()],
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
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) return 'images/[name]-[hash][extname]';
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) return 'fonts/[name]-[hash][extname]';
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
