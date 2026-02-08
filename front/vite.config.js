import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Garante que o /api não seja removido
      },
      '/images': 'http://localhost:3001',
    },
  },
  plugins: [react(), tailwindcss()],
});
