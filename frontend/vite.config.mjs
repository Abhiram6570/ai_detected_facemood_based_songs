import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import commonjs from 'vite-plugin-commonjs'; // Ensure CommonJS compatibility
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    commonjs(), // Add CommonJS plugin for better support
  ],
  base: '/', // Base URL for the app
  define: {
    global: 'window', // Ensure `global` is defined as `window`
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Polyfill `global` for Node compatibility
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Polyfill Buffer
          process: true, // Polyfill process
        }),
      ],
    },
  },
  server: {
    open: true, // Automatically open browser
    port: 3000, // Use port 3000
  },
  preview: {
    open: true, // Automatically open browser on preview
    port: 3000, // Use port 3000
  },
});
