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
				dir: 'dist/single-file'
			}
		},
	},
	plugins: [
		viteSingleFile()
	]
});