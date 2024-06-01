import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {visualizer} from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats.html',
      open: false, // Automatically open the visualization file after build
    }),
  ],
  resolve: {
    alias: {
      '@': '/src/',
      '@interfaces': '/src/interfaces',
      '@system': '/src/system',
      '@utils': '/src/utils',
      '@editor': '/src/views/editor',
      '@tree': '/src/views/tree',
    }
  },
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

          if (
            id.includes('views/editor')
          ) {
            return '@editor';
          } 
        },
      },
    },
  },
});
