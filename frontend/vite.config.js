import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000', // Proxy API calls to Django
    },
  },
  build: {
    outDir: '../backend/static/frontend', // Ensure Vite output aligns with Django
    emptyOutDir: true,
  }
});
  