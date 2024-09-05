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

export abstract class Game {
    public readonly abstract name: string;
    protected _world: World | undefined;
    protected _engine!: BABYLON.Engine;
    protected _scene!: BABYLON.Scene;
    protected _camera!: BABYLON.Camera;
    protected _started: boolean = false;
    protected _stopped: boolean = false;

    public get world(): World | undefined {
        return this._world;
    }
    public get engine(): BABYLON.Engine {
        return this._engine;
    }
    public get scene(): BABYLON.Scene {
        return this._scene;
    }
    public get camera(): BABYLON.Camera {
        return this._camera;
    }
    public get started(): boolean
    {
        return this._started;
    }
    public get stopped(): boolean
    {
        return this._stopped;
    }

    public set camera(camera: BABYLON.Camera) {
        if (this._camera) return;
        this._camera = camera;
    }

    public abstract createEngine(): Promise<BABYLON.Engine>;

    public async createScene(): Promise<BABYLON.Scene> {
        this._scene = new BABYLON.Scene(this._engine);
        this._world = this.createWorld();
        this._scene.onBeforeRenderObservable.add(this.beforeRender.bind(this));

        return this._scene;
    }

    public abstract createWorld(): World;

    public init(resolve: (value: Game | Promise<Game>) => void, reject: (reason?: any) => void) {
        console.info(`Starting ${this.name} Version ${VERSION}`)
        this.createEngine()
            .then((engine) => {
                if (!engine) reject(new Error("engine should not be null."));
                this._engine = engine;
                this.createScene()
                    .then((scene) => {
                        if (!scene) reject(new Error("scene should not be null."));
                        this._scene = scene;
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

    protected beforeRender(): void {
        this.tick();
    }

    public tick(): void {
        if (this.shouldStop()) return;
        this._world?.tick();
    }

    public initLoop() {
        this._engine.runRenderLoop(() => {
            if (!this.shouldStop()) {
                try {
                    this._scene.render();
                } catch (e: any) {
                    console.error(e);
                    this._stopped = true;
                }
            } else if (this._engine) {
                this._engine.stopRenderLoop();
                console.error("Stopped game.");
            }
        });
    }

    public shouldStop(): boolean {
        return !this._started || this._stopped || this.additionalStoppingConditions();
    }

    public abstract additionalStoppingConditions(): boolean;
}