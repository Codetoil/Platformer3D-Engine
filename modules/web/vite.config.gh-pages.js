import { defineConfig } from 'vite';
import assemblyScriptPlugin from "vite-plugin-assemblyscript-asc";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index.html'
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