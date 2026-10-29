import { defineConfig } from 'vite';
export default defineConfig({
  base: '/agenda/',
  build: { rollupOptions: { input: { final: 'index.html', taller: 'taller/index.html' } } },
});
