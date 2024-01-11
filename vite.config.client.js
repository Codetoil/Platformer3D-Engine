import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index.html'
			},
			output: {
				format: 'es',
				dir: 'dist/client'
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