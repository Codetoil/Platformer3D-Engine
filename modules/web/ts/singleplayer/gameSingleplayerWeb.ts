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
import {GameEngine} from "game3d-common/ts/common/gameEngine";
import {GameSingleplayer} from "game3d-common/ts/singleplayer/gameSingleplayer";

export class GameSingleplayerWeb extends GameSingleplayer {
    public readonly name: string = "Game3D Web Client (Singleplayer)";
    public readonly ready: Promise<GameEngine> = new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {
            this.initializeEngine(resolve, reject);
        });
    });
    protected _canvas!: HTMLCanvasElement;

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public initializeEngine(
        resolve: (value: GameEngine | Promise<GameEngine>) => void,
        reject: (reason?: any) => void
    ) {
        this._canvas = document.getElementById(
            "renderCanvas"
        ) as HTMLCanvasElement;
        super.initializeEngine(resolve, reject);
    }

    public assetsDir(): string {
        return "./assets/";
    }

    public async createWebGPUEngine(): Promise<void> {
        this._babylonEngine = new BABYLON.WebGPUEngine(this.canvas, {
            antialias: true,
            stencil: true
        }) as unknown as BABYLON.Engine;
        await (this._babylonEngine as unknown as BABYLON.WebGPUEngine).initAsync();
    }

    public createWebGLEngine(): void {
        this._babylonEngine = new BABYLON.Engine(this.canvas, true, {
            stencil: true,
            disableWebGL2Support: false,
        });
    }

    public async createBabylonEngine(): Promise<BABYLON.Engine> {
        const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
        console.info("Using WebGPU: " + webGPUSupported);
        if (webGPUSupported) {
            await this.createWebGPUEngine();
        } else {
            this.createWebGLEngine();
        }
        console.log("Engine initialized...")
        return this._babylonEngine;
    }
}

export class EventHandler {
    public static onResize(gameClient: GameSingleplayerWeb) {
        gameClient.babylonEngine.resize();
    }
}

const gameSingleplayer: GameSingleplayerWeb = new GameSingleplayerWeb();

gameSingleplayer.ready.then((value) => {
    window.addEventListener("resize", EventHandler.onResize.bind(null, value as GameSingleplayerWeb));
    value.initializeMainLoop();
});