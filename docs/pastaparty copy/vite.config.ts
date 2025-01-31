import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Keep the root as is
  build: {
    outDir: 'dist',
  },
  base: './', // 👈 Ensures all asset URLs are relative (needed for subfolder deployment)
});