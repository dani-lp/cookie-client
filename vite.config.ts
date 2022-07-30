/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    checker({ typescript:true }),
    eslintPlugin(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
  },
});
