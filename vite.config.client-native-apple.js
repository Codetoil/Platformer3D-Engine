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
				dir: 'dist-native-apple'
			}
		},
		minify: true
	},
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000
	},
	plugins: [createExternal({
		externals: {
			"@babylonjs/core": 'BABYLON'
		}
	})],
	optimizeDeps: {

	},
});