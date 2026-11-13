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
  build: {
    rollupOptions: {
      output: {
        // Split the vendor libraries out of the app bundle. They change far
        // less often than app code, so returning users keep them cached
        // instead of re-downloading ~215 kB on every deploy.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    // The vendor chunks are expected to be large; app chunks are not.
    chunkSizeWarningLimit: 300,
  },
});
