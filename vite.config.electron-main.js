import { defineConfig } from 'vite';
import resolve from "@rollup/plugin-node-resolve";
import createExternal from "vite-plugin-external";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  build: {
    rollupOptions: {
      input: {
        main: 'electron-main/electronInit.ts'
      },
      output: {
        format: 'es',
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
        dir: 'dist-electron/main'
      },
    },
    minify: false
  },
  plugins: [
    resolve({
      extensions: ['.js', '.ts']
    }),
    createExternal({
      externals: {
        'electron/main': "electronMain"
      }
    })
  ],
});
