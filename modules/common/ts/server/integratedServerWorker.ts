import {GameEngineServer} from "./gameEngineServer";

/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
 *  Copyright (C) 2021-2025 Codetoil
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/// <reference no-default-lib="true" />
/// <reference lib="es2022" />
/// <reference lib="webworker" />

function startServer(gameServerType: { GameServer: GameEngineServer }): void {
    const gameServer: GameEngineServer = new gameServerType.GameServer();

    gameServer.ready.then((value) => {
        value.initializeMainLoop();
    });
}

self.onmessage = (event: MessageEvent<string | Uint8Array>) => {
    console.debug("Recieved Data: " + event.data.toString());
    if (typeof (event.data) == "string") {
        const url_base = event.data;
        const url1: string = new URL("../gameServer.js", url_base).toString();
        import(url1).then(startServer)
            .catch((reason: any) => {
                console.info("Failed to load production integrated game server, assuming development environment...");
                console.info(reason);
                const url2: string = new URL("../server/gameEngineServer.ts", url_base).toString();
                import(url2).then(startServer);
            });
    }
}



