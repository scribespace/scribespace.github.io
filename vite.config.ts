import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // creating a chunk to react routes deps. Reducing the vendor chunk size
          if (
            id.includes('libs/lexical')
          ) {
            return '@lexical';
          } 
        },
      },
    },
  },
});
