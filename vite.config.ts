import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  clearScreen: false,
  assetsInclude: ['**/*.wasm', '**/*.json', '**/*.tmLanguage.json'],
  publicDir: 'public',
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  resolve: {
    alias: {
      'vs': path.resolve(__dirname, 'src/vs'),
    },
  },
  build: {
    target: ['es2022', 'chrome100'],
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 25000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    esbuild: {
      // Disable aggressive minification to prevent runtime errors
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false,
      keepNames: true,
    },
  },
  optimizeDeps: {
    include: ['vscode-textmate', 'vscode-oniguruma'],
    exclude: ['@tauri-apps/api'],
  },
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        entryFileNames: 'workers/[name]-[hash].js',
        chunkFileNames: 'workers/[name]-[hash].js',
      },
    },
  },
});
