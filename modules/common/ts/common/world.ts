/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2024 Codetoil
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type {GameEngine} from "./gameEngine";
import {Collidable} from "./collidable";
import {NamespacedKey} from "./namespacedKey";
import * as BABYLON from "@babylonjs/core";

export abstract class World {
    protected _gameEngine: GameEngine;
    protected _isWorldLoaded!: boolean;
    protected _babylonScene: BABYLON.Scene;
    protected _babylonCamera!: BABYLON.Camera;
    public readonly namespacedKey: NamespacedKey;
    public readonly collidables: Collidable[] = [];

    constructor(game: GameEngine, namespacedKey: NamespacedKey) {
        this._gameEngine = game;
        this.namespacedKey = namespacedKey;
        this._babylonScene = new BABYLON.Scene(this._gameEngine.babylonEngine);
        this._babylonScene.onBeforeRenderObservable.add(this.preformTick.bind(this));
    }

    public get gameEngine(): GameEngine
    {
        return this._gameEngine;
    }
    public get babylonScene(): BABYLON.Scene {
        return this._babylonScene;
    }
    public get babylonCamera(): BABYLON.Camera {
        return this._babylonCamera;
    }

    public set babylonCamera(camera: BABYLON.Camera) {
        if (this._babylonCamera) return;
        this._babylonCamera = camera;
    }

    public get isWorldLoaded(): boolean
    {
        return this._isWorldLoaded;
    }

    public abstract loadWorld(): Promise<void>;

    public abstract preformTick(): void;
}
