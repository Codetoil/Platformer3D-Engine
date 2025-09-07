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

import {GameEngine} from "../common/gameEngine";
import {Levelpack, Worlds} from "../levelpack/levelpack";
import {World} from "../common/world";
import {NamespacedKey} from "../common/namespacedKey";
import {WorldServer} from "./worldServer";
import {Renderer} from "../common/renderer";
import {NullRenderer} from "./nullRenderer";

export class GameEngineServer extends GameEngine {
    public readonly ready: Promise<GameEngine> = new Promise((resolve: (gameEngine: GameEngine) => void, reject: (reason?: any) => void): void  => {
        this.initializeEngine(resolve, reject);
    });

    public constructor() {
        super();
    }

    public createRenderer(): Promise<Renderer> {
        return new Promise<Renderer>((resolve: (renderer: Renderer) => void, reject: (reason?: any) => void) => {
            console.log("Renderer initialized...")
            resolve(new NullRenderer(this));
        })
    }

    public onLoad(): Promise<void>
    {
        return new Promise<void>((resolve: () => void, reject: (reason?: any) => void): void => {
            Levelpack.load().then(
                (): void => {
                    [Worlds.TEST].forEach((worldKey: NamespacedKey): void => {
                        Levelpack.initializeWorld(this, worldKey).then(
                            (world: World): void => {
                                this.worlds.push(world);
                            }
                        ).catch(reject);
                    });
                }, reject);
        })
    }

    public createWorld(namespaceKey: NamespacedKey): World {
        return new WorldServer(this, namespaceKey);
    }

    public getName(): string {
        return "Platformer3D Engine Server";
    }
}