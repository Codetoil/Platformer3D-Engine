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

import {World} from "../common/world";
import * as BABYLON from "@babylonjs/core";

export class WorldServer extends World {

    public async loadWorld(): Promise<void> {
        console.info("Loading World...");
        console.debug("Creating Scene")
        this._babylonScene = new BABYLON.Scene(this._gameEngine.babylonEngine);

        console.debug("Initializing Camera...");
        this.babylonCamera = new BABYLON.ArcRotateCamera(
            "fake_camera",
            Math.PI / 2,
            0.5,
            10,
            new BABYLON.Vector3(0, 0, 0),
            this.babylonScene
        );
        (this.babylonCamera as BABYLON.ArcFollowCamera).orthoBottom = -10;
        (this.babylonCamera as BABYLON.ArcFollowCamera).orthoLeft = -10;
        (this.babylonCamera as BABYLON.ArcFollowCamera).orthoRight = 10;
        (this.babylonCamera as BABYLON.ArcFollowCamera).orthoTop = 10;
        this.babylonCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        (this.babylonCamera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
            Math.PI / 2,
            0.0,
            0.0
        ).toQuaternion();
        this._isWorldLoaded = true;
    }
}
