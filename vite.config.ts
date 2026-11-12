import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths keep the build portable across hosts and subpaths
  // (GitHub Pages serves this repo from /ielts-cefr-mock-app/, not /).
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
