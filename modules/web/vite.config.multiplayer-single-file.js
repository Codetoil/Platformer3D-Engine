import { defineConfig } from 'vite';
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				singleplayer: '/index-multiplayer-single-file.html'
			},
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js',
				dir: 'dist/single-file'
			}
		},
	},
	plugins: [
		viteSingleFile()
	],
	worker: {
		format: 'es',
		rollupOptions: {
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		}
	},
});