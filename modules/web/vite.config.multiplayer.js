import {defineConfig, searchForWorkspaceRoot} from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				client: '/index-multiplayer.html'
			},
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		}
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000,
		fs: {
			allow: [
				// search up for workspace root
				searchForWorkspaceRoot(process.cwd()),
				// your custom rules
				'../common',
				'node_modules/platformer3d-engine-common',
			],
		},
	},
	worker: {
		format: 'es',
		rollupOptions: {
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		}
	},
});