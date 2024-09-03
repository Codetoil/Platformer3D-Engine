import {defineConfig, searchForWorkspaceRoot} from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		lib: {
			entry: {
				gameServerIntegrated: "./ts/server/gameServerIntegrated.ts",
			},
			formats: ['es']
		},
		emptyOutDir: false
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
});