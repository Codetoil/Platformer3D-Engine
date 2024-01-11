import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index.html'
			},
			output: {
				format: 'es',
				dir: 'dist/client'
			}
		},
	},
	base: "https://codetoil.github.io/Game3D/"
});