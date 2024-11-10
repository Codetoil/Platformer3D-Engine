import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index-multiplayer.html'
			},
			output: {
				format: 'es',
				dir: 'dist/gh-pages'
			}
		},
	},
	plugins: [],
	base: "https://game3d.codetoil.io"
});