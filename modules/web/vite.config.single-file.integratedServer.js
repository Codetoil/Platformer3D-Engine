import {defineConfig} from 'vite';
import resolve from '@rollup/plugin-node-resolve'
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		lib: {
			entry: {
				gameServerIntegrated: "./ts/server/gameServerIntegrated.ts",
			},
			formats: ['es']
		},
		output: {
			dir: 'dist/single-file'
		},
		emptyOutDir: false
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		}),
		viteSingleFile()
	]
});