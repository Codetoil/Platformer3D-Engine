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

import * as BABYLON from "@babylonjs/core";
import { Game } from "game3d-common/ts/common/game";
import { GameServer } from "game3d-common/ts/server/gameServer";

export class GameDedicatedServer extends GameServer {
    public readonly name: string = "Game3D Dedicated Server";
    public readonly ready: Promise<Game> = new Promise((resolve, reject) => {
        this.initialize(resolve, reject);
    });
    public initialize(
        resolve: (value: Game | Promise<Game>) => void,
        reject: (reason?: any) => void
    ) {
        super.initialize(resolve, reject);
    }

    public async createBabylonEngine(): Promise<BABYLON.NullEngine> {
        this._babylonEngine = new BABYLON.NullEngine();
        console.log("Engine initialized...")
        return this._babylonEngine as unknown as BABYLON.NullEngine;
    }
}

const gameDedicatedServer: GameDedicatedServer = new GameDedicatedServer();

gameDedicatedServer.ready.then((value) => {
    value.world!.load().catch((reason: any) => {
            console.error("FAILED TO LOAD WORLD: ");
            console.error(reason);
    });
    value.initializeMainLoop();
});