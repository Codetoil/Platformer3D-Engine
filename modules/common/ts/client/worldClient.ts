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
import {PlayerClient} from "./characterClient";
import {World} from "../common/world";
import {GameClient} from "./gameClient";
import {Player} from "../common/character";

export class WorldClient extends World {
    protected _player!: PlayerClient;
    protected _worker!: Worker;

    public get player(): Player
    {
        return this._player;
    }
    public get worker(): Worker
    {
        return this._worker;
    }

    public async read(): Promise<void> {
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

        // TODO - Load world from network into `this.collidablesPerType`
    }

    public async loadWorld(): Promise<void> {
        console.info("Loading World...");
        await this.read();
        console.debug("Initializing Player...");
        // Create the player entity
        this._player = new PlayerClient();
        this._player.mesh = BABYLON.MeshBuilder.CreateSphere(
            "player",
            {
                diameter: 1.5
            },
            this._gameEngine.babylonScene
        );
        this._player.setPositionAndRotation(
            new BABYLON.Vector3(5, -5, -10),
            BABYLON.Quaternion.Identity()
        );
        this._player.height = 3.;
        this._player.world = this;
        this._player.mesh.material = new BABYLON.StandardMaterial(
            "playerMat",
            this.gameEngine.babylonScene
        );
        this._player.texture = new BABYLON.Texture(
            (this.gameEngine as GameClient).assetsDir() + "temp_player.png",
            this.gameEngine.babylonScene
        );
        (this._player.mesh.material as BABYLON.StandardMaterial).diffuseTexture =
            this._player.texture;
        this._player.texture.hasAlpha = true;
        this._player.on.set("ground", true);

        console.debug("Initializing Camera...");
        this._gameEngine.babylonCamera = new BABYLON.ArcFollowCamera(
            "camera",
            Math.PI / 2,
            0.5,
            10,
            this.player.mesh,
            this.gameEngine.babylonScene
        );
        (this._gameEngine.babylonCamera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
            Math.PI / 2,
            0,
            0.25
        ).toQuaternion();
        this._isWorldLoaded = true;
    }

    public preformTick() {
        this._player.tick((this._gameEngine.babylonCamera as BABYLON.ArcFollowCamera).rotationQuaternion,
            () => (((a: number | undefined): number => {
                if (a != undefined)
                    return a;
                return 0.0;
            })(this._gameEngine.babylonScene.deltaTime)));
    }
}
