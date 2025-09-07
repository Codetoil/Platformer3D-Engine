/**
 *  Platformer3D Engine, a 3D Platformer Engine built for BOSIX with Web Technologies.
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


import {GameEngine} from "../common/gameEngine";
import {NamespacedKey} from "../common/namespacedKey";
import {World} from "../common/world";
import {WorldClient} from "./worldClient";
import {Renderer} from "../common/renderer";

export class GameEngineClient extends GameEngine {
    public assetsDir(): string
    {

    }

    public createRenderer(): Promise<Renderer>
    {

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
}

