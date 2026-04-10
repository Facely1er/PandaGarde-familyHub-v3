import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Mirror the plugin from vite.config.ts so that optional peer dependencies
// (e.g. @emailjs/browser) are treated as external during tests, preventing
// Vite's import-analysis from throwing on modules that are intentionally absent.
const optionalDependenciesPlugin = () => ({
  name: 'optional-dependencies',
  resolveId(id: string) {
    if (id === '@emailjs/browser') {
      return { id, external: true };
    }
    return null;
  },
});

export default defineConfig({
  plugins: [react(), optionalDependenciesPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
});
