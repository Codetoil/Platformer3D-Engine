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
import {World} from "../common/world";
import {GameSingleplayer} from "./gameSingleplayer";
import {CharacterSingleplayer} from "./characterSingleplayer";
import {Character} from "../common/character";
import {PlayerInputController} from "../client/playerInputController";
import {DeviceSourceManager} from "@babylonjs/core";

export class WorldSingleplayer extends World {
    protected _player!: CharacterSingleplayer;

    public get player(): Character
    {
        return this._player;
    }

    public async loadWorld(): Promise<void> {
        console.info("Loading World...");
        console.debug("Creating Scene")
        this._babylonScene = new BABYLON.Scene(this._gameEngine.babylonEngine);
        if (!this._babylonScene) throw new Error("Couldn't create Scene!");
        this._babylonScene.onBeforeRenderObservable.add(this.preformTick.bind(this));

        console.debug("Initializing Player...");
        // Create the player entity
        this._player = new CharacterSingleplayer(1.5,
            /*BABYLON.MeshBuilder.CreateSphere(
            "player",
            {
                diameter: 1.5
            },
            this.babylonScene
            )*/
            BABYLON.MeshBuilder.CreateSphere(
                "player",
                {
                    diameter: 0.01
                }
            ,this.babylonScene
            )
        , this, new PlayerInputController(new DeviceSourceManager(this._gameEngine.babylonEngine)));
        this._player.setPositionAndRotation(
            new BABYLON.Vector3(5, -5, -10),
            BABYLON.Quaternion.Identity()
        );
        this._player.babylonMesh.material = new BABYLON.StandardMaterial(
            "playerMat",
            this.babylonScene
        );
        this._player.babylonTexture = new BABYLON.Texture(
            (this.gameEngine as GameSingleplayer).assetsDir() + "temp_player.png",
            this.babylonScene
        );
        (this._player.babylonMesh.material as BABYLON.StandardMaterial).diffuseTexture =
            this._player.babylonTexture;
        this._player.babylonTexture.hasAlpha = true;
        this.characters.push(this._player);

        console.debug("Initializing Camera...");
        this.babylonCamera = new BABYLON.ArcFollowCamera(
            "camera",
            Math.PI / 2,
            0.5,
            10,
            this.player.babylonMesh,
            this.babylonScene
        );
        (this.babylonCamera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
            Math.PI / 2,
            0,
            0.25
        ).toQuaternion();
        this._isWorldLoaded = true;
    }
}
