import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import {visualizer} from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  plugins: [
    react(),
    visualizer({
      filename: './stats.html',
      open: false, // Automatically open the visualization file after build
    }),
  ],
  resolve: {
    alias: {
      '@editorHelpers': '/src/views/editor/lexicalHelpers',
      'shared': '/src/views/editor/lexicalHelpers',
      '@editor': '/src/views/editor',
      '@tree': '/src/views/tree',
      '@coreSystems': '/src/interfaces/system',
      '@systems': '/src/system',
      '@interfaces': '/src/interfaces',
      '@utils': '/src/utils',
      '@': '/src/',
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if ( id.includes('node_modules') ) {
            return id.split("/node_modules/").pop()?.split("/")[0];
          }
          
          if (id.includes('react')) {
            return '@react';
          }
          if ( id.includes('libs/lexical') ) {
            return '@lexical';
          } 

          if ( id.includes('views/editor') ) {
            return '@editor';
          } 
        },
      },
    },
  },
});
