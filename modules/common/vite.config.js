import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				format: 'es',
				assetFileNames: 'assets/[name][extname]',
				chunkFileNames: '[name].js',
				entryFileNames: '[name].js'
			},
		},
		lib: {
			entry: {
				characterClient: "./ts/client/characterClient.ts",
				gameEngineClient: "./ts/client/gameEngineClient.ts",
				networkingClient: "./ts/client/networkingClient.ts",
				playerInputController: "./ts/client/playerInputController.ts",
				worldClient: "./ts/client/worldClient.ts",
				character: "./ts/common/character.ts",
				characterInputController: "./ts/common/characterInputController.ts",
				collidable: "./ts/common/collidable.ts",
				gameEngine: "./ts/common/gameEngine.ts",
				inventory: "./ts/common/inventory.ts",
				item: "./ts/common/item.ts",
				move: "./ts/common/move.ts",
				namespacedKey: "./ts/common/namespacedKey.ts",
				skill: "./ts/common/skill.ts",
				version: "./ts/common/version.ts",
				world: "./ts/common/world.ts",
				levelpack: "./ts/levelpack/levelpack.ts",
				gameEngineServer: "./ts/server/gameEngineServer.ts",
				integratedServerWorker: "./ts/server/integratedServerWorker.ts",
				worldServer: "./ts/server/worldServer.ts",
				characterSingleplayer: "./ts/singleplayer/characterSingleplayer.ts",
				gameEngineSingleplayer: "./ts/singleplayer/gameEngineSingleplayer.ts",
				worldSingleplayer: "./ts/singleplayer/worldSingleplayer.ts"
			},
			formats: ['es']
		},
		emptyOutDir: false,
		outDir: "dist",
		sourcemap: true,
		minify: true
	},
	plugins: [
		resolve({
			extensions: ['.js', '.ts']
		})
	],
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000
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