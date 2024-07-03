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

export abstract class Game {
    public abstract name: string;
    public world!: World | undefined;
    public engine!: BABYLON.Engine;
    public scene!: BABYLON.Scene;
    public camera!: BABYLON.Camera;
    public started: boolean = false;
    public stopped: boolean = false;

    public abstract createEngine(): PromiseLike<BABYLON.Engine>;

    public async createScene(): Promise<BABYLON.Scene> {
        this.scene = new BABYLON.Scene(this.engine);
        this.world = await this.createWorld();
        this.world.load();
        this.scene.onBeforeRenderObservable.add(this.beforeRender.bind(this));

        return this.scene;
    }

    public abstract createWorld(): PromiseLike<World>;

    public init(resolve: (value: Game | PromiseLike<Game>) => void, reject: (reason?: any) => void) {
        this.createEngine()
            .then((engine) => {
                if (!engine) reject(new Error("engine should not be null."));
                this.engine = engine;
                this.createScene()
                    .then((scene) => {
                        if (!scene) reject(new Error("scene should not be null."));
                        this.scene = scene;
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
                this.started = true
                console.info("Started " + this.name);
            }
        );
    }

    public tick(): void {
        if (!this.started || this.stopped || !(this.world !== undefined)) return;
        this.world.tick();
    }

    protected beforeRender(): void {
        if (!this.started || this.stopped || !this.world || this.additionalStoppingConditions()) return;
        this.tick();
    }

    public initLoop() {
        this.engine.runRenderLoop(() => {
            if (
                this.started &&
                !this.stopped &&
                this.scene &&
                this.additionalStoppingConditions()
            ) {
                try {
                    this.scene.render();
                } catch (e: any) {
                    console.error(e);
                    this.stopped = true;
                }
            } else if (this.stopped && this.engine) {
                this.engine.stopRenderLoop();
                console.error("Stopped game.");
            }
        });
    }

    public abstract additionalStoppingConditions(): boolean;
}