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
import {GameEngine} from "../common/gameEngine";
import {Levelpack} from "../levelpack/levelpack";
import {World} from "../common/world";
import {NamespacedKey} from "../common/namespacedKey";
import {WorldServer} from "./worldServer";

export class GameServer extends GameEngine {
    public readonly name: string = "Game3D Server";
    public readonly ready: Promise<GameEngine> = new Promise((resolve, reject) => {
        this.initializeEngine(resolve, reject);
    });

    public constructor() {
        super();
    }

    public async createBabylonEngine(): Promise<BABYLON.NullEngine> {
        this._babylonEngine = new BABYLON.NullEngine();
        console.log("Engine initialized...")
        return this._babylonEngine as unknown as BABYLON.NullEngine;
    }

    public async onLoad(): Promise<void>
    {
        await Levelpack.load(this);
    }

    public createWorld(namespaceKey: NamespacedKey): World {
        return new WorldServer(this, namespaceKey);
    }
}