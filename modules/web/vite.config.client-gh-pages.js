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
				dir: 'dist/gh-pages/client'
			}
		},
	},
	plugins: [],
	base: "https://codetoil.github.io/Game3D/"
});