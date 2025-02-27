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

import {GameEngine} from "game3d-common/ts/common/gameEngine";
import {GameEngineSingleplayer} from "game3d-common/ts/singleplayer/gameEngineSingleplayer";

export class GameEngineSingleplayerNative extends GameEngineSingleplayer {
    public readonly name: string = "Platformer3D Engine Native Client (Singleplayer)";
    public readonly ready: Promise<GameEngine> = new Promise((resolve, reject) => {
        this.initializeEngine(resolve, reject);
    });

    public initializeEngine(
        resolve: (value: GameEngine | Promise<GameEngine>) => void,
        reject: (reason?: any) => void
    ) {
        super.initializeEngine(resolve, reject);
    }

    public assetsDir(): string {
        return "./assets/";
    }

    public async createRenderer(): Promise<BABYLON.Engine> {
        this._babylonEngine = new BABYLON.NativeEngine();
        console.log("Engine initialized...")
        return this._babylonEngine;
    }
}

const gameSingleplayer: GameEngineSingleplayerNative = new GameEngineSingleplayerNative();

gameSingleplayer.ready.then((value) => {
    value.initializeMainLoop();
});
