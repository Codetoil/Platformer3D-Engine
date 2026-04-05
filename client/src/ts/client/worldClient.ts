/**
 *  Platformer3D Engine, a 3D Platforming Engine built using Web Technologies.
 *  Copyright (C) 2021-2026 Codetoil
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

import {GameEngineClient} from "./gameEngineClient";
import {CharacterClient} from "./characterClient";
import {PlayerInputController} from "./playerInputController";

import {ArcFollowCamera} from "@babylonjs/core/Cameras/followCamera";
import {Camera} from "@babylonjs/core/Cameras/camera";
import {DeviceSourceManager} from "@babylonjs/core/DeviceInput/InputDevices/deviceSourceManager"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder";
import {Scene} from "@babylonjs/core/scene"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture"
import {Quaternion as QuaternionBabylon} from "@babylonjs/core/Maths/math.vector";

import {World} from "platformer3d-engine-server/src/ts/common/world";
import {Character} from "platformer3d-engine-server/src/ts/common/character";
import {Quaternion, Vector3} from "platformer3d-engine-server/src/ts/math/math";

export class WorldClient extends World {
    protected _player!: CharacterClient;
    protected _worker!: Worker;
    protected _babylonScene!: Scene;
    protected _babylonCamera!: Camera;

    public get player(): Character
    {
        return this._player;
    }
    public get worker(): Worker
    {
        return this._worker;
    }

    public async loadFromNetwork(): Promise<void> {
        console.debug("Loading world from network...");
        this._worker = new Worker(new URL("../server/integratedServerWorker.ts", import.meta.url));
        this._worker.onmessage = (event: MessageEvent<Uint8Array | string>) => {
            if (typeof(event.data) === "string") {
                console.info("Received: " + (event.data as string))
            } else
            {
                console.info("Received: " + (event.data as Uint8Array).toString())
            }
        }
        this.worker.postMessage(import.meta.url);
        this.worker.postMessage(Uint8Array.of());

        // TODO - Load world from network
    }

    public async loadWorld(): Promise<void> {
        console.info("Loading World...");
        console.debug("Creating Scene")
        this._babylonScene = new Scene((this._gameEngine as GameEngineClient).babylonEngine);

        await this.loadFromNetwork();
        console.debug("Initializing Player...");
        // Create the player entity
        this._player = new CharacterClient(3., MeshBuilder.CreateSphere(
            "player",
            {
                diameter: 1.5
            },
            this._babylonScene
        ), this, new PlayerInputController(new DeviceSourceManager((this._gameEngine as GameEngineClient).babylonEngine)));
        this._player.setPositionAndRotation(
            new Vector3(5, -5, -10),
            Quaternion.IDENTITY
        );
        this._player.babylonMesh.material = new StandardMaterial(
            "playerMat",
            this.babylonScene
        );
        this._player.characterBabylonTexture = new Texture(
            (this.gameEngine as GameEngineClient).assetsDir() + "temp_player.png",
            this.babylonScene
        );
        (this._player.babylonMesh.material as StandardMaterial).diffuseTexture =
            this._player.characterBabylonTexture;
        this._player.characterBabylonTexture.hasAlpha = true;

        console.debug("Initializing Camera...");
        this._babylonCamera = new ArcFollowCamera(
            "camera",
            Math.PI / 2,
            0.5,
            10,
            (this.player as CharacterClient).babylonMesh,
            this.babylonScene
        );
        (this.babylonCamera as ArcFollowCamera).rotationQuaternion = QuaternionBabylon.FromEulerAngles(Math.PI / 2,
            0,
            0.25);
        this._isWorldLoaded = true;
    }

    public preformTick() {
        this._player.preformTick(() => (((a: number | undefined): number => {
                if (a != undefined)
                    return a;
                return 0.0;
            })(this.babylonScene.deltaTime)));
    }

    public get babylonScene(): Scene {
        return this._babylonScene;
    }

    public get babylonCamera(): Camera {
        return this._babylonCamera;
    }
}
