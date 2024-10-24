/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2024 Codetoil
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

import type { GameServerIntegrated } from "./gameServerIntegrated";

function startServer(gameServerIntegratedType: { GameServerIntegrated: GameServerIntegrated }): void {
    const gameServerIntegrated: GameServerIntegrated = new gameServerIntegratedType.GameServerIntegrated();

    gameServerIntegrated.ready.then((value) => {
        value.world!.load().catch((reason: any) => {
            console.error("FAILED TO LOAD WORLD: ");
            console.error(reason);
        });
        value.initLoop();
    });
}

self.onmessage = (event: MessageEvent<string | Uint8Array>) => {
    console.debug("Recieved Data: " + event.data.toString());
    if (typeof (event.data) == "string") {
        const url_base = event.data;
        const url1: string = new URL("../gameServerIntegrated.js", url_base).toString();
        import(url1).then(startServer)
            .catch((reason: any) => {
                console.info("Failed to load production integrated game server, assuming development environment...");
                console.info(reason);
                const url2: string = new URL("../server/gameServerIntegrated.ts", url_base).toString();
                import(url2).then(startServer);
            });
    }
}


