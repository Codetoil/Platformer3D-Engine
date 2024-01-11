import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
      rollupOptions: {
          input: {
              main: 'electron-main/electronInit.ts'
          },
          output: {
              format: 'cjs',
              assetFileNames: 'assets/[name][extname]',
              chunkFileNames: '[name].cjs',
              entryFileNames: '[name].cjs',
              dir: 'dist-electron/main'
          },
      },
      minify: false
  },
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  }
});
