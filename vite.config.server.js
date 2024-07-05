import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				server: '/node/server/gameDedicatedServer.ts'
			},
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js',
				dir: 'dist/node/server/'
			},
		},
		minify: true
	},
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
});