import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'
import createExternal from "vite-plugin-external";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index.html',
				main: 'electron-main/electronInit.ts'
			},
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js',
				dir: 'dist-electron/client'
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