import {defineConfig, searchForWorkspaceRoot} from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		emptyOutDir: false,
		outDir: "dist-dedicated-server",
		rollupOptions: {
			input: {
				dedicated_server: '/ts/server/runServer.ts'
			},
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