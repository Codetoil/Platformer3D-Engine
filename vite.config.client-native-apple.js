import { defineConfig } from 'vite';
import createExternal from 'vite-plugin-external';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/client/gameClientNativeApple.ts'
			},
			output: {
				format: 'iife',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js',
				dir: 'dist-native-apple/client'
			}
		},
		minify: true
	},
	plugins: [createExternal({
		externals: {
			"@babylonjs/core": 'BABYLON'
		}
	})]
});