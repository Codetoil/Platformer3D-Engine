import { defineConfig } from 'vite';
import resolve from "@rollup/plugin-node-resolve";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'electron-preload/electronPreload.mts'
            },
            output: {
                format: 'es',
                assetFileNames: 'assets/[name][extname]',
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
                dir: 'dist-native/electron-preload'
            },
        },
        minify: false
    },
    plugins: [
        resolve({
            extensions: ['.js', '.ts']
        })
    ]
});
