import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				singleplayer: '/index.html'
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