/**
 *  Platformer3D Engine, a 3D Platforming Engine built using Web Technologies.
 *  Copyright (C) 2021-2026 Codetoil
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

import {WorldClient} from "./worldClient";

import {AbstractEngine} from "@babylonjs/core/Engines/abstractEngine";

import {GameEngine} from "platformer3d-engine-server/src/ts/common/gameEngine";
import {NamespacedKey} from "platformer3d-engine-server/src/ts/common/namespacedKey";
import {World} from "platformer3d-engine-server/src/ts/common/world";
import {Renderer} from "platformer3d-engine-server/src/ts/common/renderer";

export class GameEngineClient extends GameEngine {
    protected _babylonEngine!: AbstractEngine;

    public assetsDir(): string
    {
        return "assets";
    }

    public createRenderer(): Promise<Renderer>
    {
        return Promise.reject("Not implemented yet");
    }

    public async onLoad(): Promise<void>
    {
    }

    public createWorld(namespacedKey: NamespacedKey): World {
        return new WorldClient(this, namespacedKey);
    }

    public getName(): string {
        return "Platformer3D Engine Client";
    }

    public get babylonEngine(): AbstractEngine {
        return this._babylonEngine;
    }
}

