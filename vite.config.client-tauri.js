import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'
import { internalIpV4 } from "internal-ip";

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index.html'
			},
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js',
				dir: 'dist/tauri/client'
			},
		},
		minify: false
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
	// Vite options tailored for Tauri development and only applied in `src-tauri dev` or `src-tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. src-tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: mobile ? "0.0.0.0" : false,
		hmr: mobile
			? {
				protocol: "ws",
				host: await internalIpV4(),
				port: 1421,
			}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `tauri`
			ignored: ["**/tauri/**"],
		},
	},
});