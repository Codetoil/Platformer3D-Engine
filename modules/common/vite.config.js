import { defineConfig } from 'vite';
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig({
	build: {
		lib: {
			entry: {
				clientInputController: "./ts/client/clientInputController.ts",
				entityClient: "./ts/client/entityClient.ts",
				gameClient: "./ts/client/gameClient.ts",
				networkingClient: "./ts/client/networkingClient.ts",
				worldClient: "./ts/client/worldClient.ts",
				badge: "./ts/common/badge.ts",
				entity: "./ts/common/entity.ts",
				game: "./ts/common/game.ts",
				ground: "./ts/common/ground.ts",
				inputController: "./ts/common/inputController.ts",
				move: "./ts/common/move.ts",
				version: "./ts/common/version.ts",
				wall: "./ts/common/wall.ts",
				world: "./ts/common/world.ts",
				gameServer: "./ts/server/gameServer.ts",
				gameServerIntegrated: "./ts/server/gameServerIntegrated.ts",
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