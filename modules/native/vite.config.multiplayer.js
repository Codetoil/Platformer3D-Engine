import {defineConfig, searchForWorkspaceRoot} from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		emptyOutDir: false,
		outDir: "rust-wrapper/src/client-like/client",
		rollupOptions: {
			input: {
				client: '/ts/client/gameEngineClientNative.ts'
			},
			output: {
				format: 'iife',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		}
	},
	worker: {
		format: 'iife',
		rollupOptions: {
			output: {
				format: 'iife',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		}
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
});