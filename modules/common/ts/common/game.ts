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
import type {World} from "./world";
import {VERSION} from "./version";

/**
 * Base class for the Game Engine
 */
export abstract class Game {
    public readonly abstract name: string;
    public readonly worlds: World[] = [];
    protected _babylonEngine!: BABYLON.Engine;
    protected _babylonScene!: BABYLON.Scene;
    protected _babylonCamera!: BABYLON.Camera;
    protected _started: boolean = false;
    protected _stopped: boolean = false;

    public get babylonEngine(): BABYLON.Engine {
        return this._babylonEngine;
    }
    public get babylonScene(): BABYLON.Scene {
        return this._babylonScene;
    }
    public get babylonCamera(): BABYLON.Camera {
        return this._babylonCamera;
    }
    public get started(): boolean
    {
        return this._started;
    }
    public get stopped(): boolean
    {
        return this._stopped;
    }

    public set babylonCamera(camera: BABYLON.Camera) {
        if (this._babylonCamera) return;
        this._babylonCamera = camera;
    }

    public abstract createBabylonEngine(): Promise<BABYLON.Engine>;

    public async createBabylonScene(): Promise<BABYLON.Scene> {
        this._babylonScene = new BABYLON.Scene(this._babylonEngine);
        this._babylonScene.onBeforeRenderObservable.add(this.onBeforeRender.bind(this));

        return this._babylonScene;
    }

    public abstract onLoad(): void;

    public initialize(resolve: (value: Game | Promise<Game>) => void, reject: (reason?: any) => void) {
        console.info(`Starting ${this.name} Version ${VERSION}`)
        this.createBabylonEngine()
            .then((engine) => {
                if (!engine) reject(new Error("engine should not be null."));
                this._babylonEngine = engine;
                this.createBabylonScene()
                    .then((scene) => {
                        if (!scene) reject(new Error("scene should not be null."));
                        this._babylonScene = scene;
                        this.onLoad();
                        resolve(this);
                    })
                    .catch(function (e: any) {
                        console.error("The available createScene function failed.");
                        console.error(e);
                        reject(e);
                    });
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

    protected onBeforeRender(): void {
        this.preformTick();
    }

    public preformTick(): void {
        if (this.shouldStop()) return;
        this.worlds.forEach(world => world.tick);
    }

    public initializeMainLoop() {
        this._babylonEngine.runRenderLoop(() => {
            if (!this.shouldStop()) {
                try {
                    this._babylonScene.render();
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
        return !this._started || this._stopped || this.additionalStoppingConditions();
    }

    public abstract additionalStoppingConditions(): boolean;
}