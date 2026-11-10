import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/(gsap|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          if (id.includes('/node_modules/swiper/')) return 'gallery';
        },
      },
    },
  },
});
