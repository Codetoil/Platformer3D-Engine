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


import * as BABYLON from "@babylonjs/core";
import { GameEngine } from "../common/gameEngine";
import {GameServer} from "./gameServer";

export class GameServerIntegrated extends GameServer {
    public readonly name: string = "Game3D Integrated Server";
    public readonly ready: Promise<GameEngine> = new Promise((resolve, reject) => {
        this.initialize(resolve, reject);
    });

    public constructor() {
        super();
    }

    public initialize(
        resolve: (value: GameEngine | Promise<GameEngine>) => void,
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