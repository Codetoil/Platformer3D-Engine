/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
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
import type {World} from "./world";
import {VERSION} from "./version";
import {NamespacedKey} from "./namespacedKey";

/**
 * Base class for the Game Engine
 */
export abstract class GameEngine {
    public readonly abstract name: string;
    public readonly worlds: World[] = [];
    protected _babylonEngine!: BABYLON.Engine;
    protected _started: boolean = false;
    protected _stopped: boolean = false;

    public get babylonEngine(): BABYLON.Engine {
        return this._babylonEngine;
    }
    public get started(): boolean
    {
        return this._started;
    }
    public get stopped(): boolean
    {
        return this._stopped;
    }

    public abstract createBabylonEngine(): Promise<BABYLON.Engine>;

    public abstract onLoad(): Promise<void>;

    public abstract createWorld(namespaceKey: NamespacedKey): World;

    public initializeEngine(resolve: (value: GameEngine | Promise<GameEngine>) => void, reject: (reason?: any) => void) {
        console.info(`Starting ${this.name} Version ${VERSION}`)
        this.createBabylonEngine()
            .then((engine) => {
                if (!engine) reject(new Error("engine should not be null."));
                this._babylonEngine = engine;
                this.onLoad().then(() => resolve(this), (error) => reject(error));
            })
            .catch((e: any) => {
                console.error("The available createEngine function failed.");
                console.error(e);
                reject(e);
            }).then(
            () => {
                this._started = true
                console.info("Started " + this.name);
            }
        );
    }

    public initializeMainLoop() {
        this._babylonEngine.runRenderLoop(() => {
            if (!this.shouldStop()) {
                try {
                    this.worlds.forEach(world => {
                        world.babylonScene.render();
                    });
                } catch (e: any) {
                    console.error(e);
                    this._stopped = true;
                }
            } else if (this._babylonEngine) {
                this._babylonEngine.stopRenderLoop();
                console.error("Stopped game.");
            }
        });
    }

    public shouldStop(): boolean {
        return !this._started || this._stopped;
    }
}