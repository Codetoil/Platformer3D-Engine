import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		lib: {
			entry: {
				characterClient: "./ts/client/characterClient.ts",
				gameClient: "./ts/client/gameClient.ts",
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
				gameServer: "./ts/server/gameServer.ts",
				gameServerIntegrated: "./ts/server/gameServerIntegrated.ts",
				integratedServerWorker: "./ts/server/integratedServerWorker.ts",
				worldServer: "./ts/server/worldServer.ts",
			},
			formats: ['es']
		},
		emptyOutDir: false,
		outDir: "dist",
		sourcemap: true,
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