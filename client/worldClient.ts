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
import {PlayerClient} from "./entityClient";
import {Ground, Wall, World} from "../common/world";
import {GameClient} from "./gameClient";

export class WorldClient extends World {
    public player!: PlayerClient;

    public read() {
        console.debug("Reading world...");
    }

    public load(): void {
        console.info("Loading World...");
        this.read();
        // Lights
        console.debug("Initializing Lights...");
        new BABYLON.HemisphericLight(
            "hemi",
            new BABYLON.Vector3(0, 1, 0),
            this.game.scene
        );
        console.debug("Initializing Player...");
        // Create the player entity
        this.player = new PlayerClient()
            .setWorld(this)
            .setHeight(3)
            .setMesh(
                BABYLON.MeshBuilder.CreateCapsule(
                    "player",
                    {
                        capSubdivisions: 10,
                        height: 3,
                        radius: 0.75,
                        subdivisions: 10,
                        tessellation: 10,
                    },
                    this.game.scene
                )
            )
            .setPositionAndRotation(
                new BABYLON.Vector3(5, -5, -10),
                BABYLON.Quaternion.Identity()
            ) as PlayerClient;
        this.player.mesh.material = new BABYLON.StandardMaterial(
            "playerMat",
            this.game.scene
        );

        this.player.texture = new BABYLON.Texture(
            (this.game as GameClient).assetsDir() + "temp_player.png",
            this.game.scene
        );
        (this.player.mesh.material as BABYLON.StandardMaterial).diffuseTexture =
            this.player.texture;
        this.player.texture.hasAlpha = true;
        this.player.onGround = true;

        console.debug("Initializing Camera...");
        this.game.camera = new BABYLON.ArcFollowCamera(
            "camera",
            Math.PI / 2,
            0.5,
            10,
            this.player.mesh,
            this.game.scene
        );
        (this.game.camera as BABYLON.ArcFollowCamera).orthoBottom = -10;
        (this.game.camera as BABYLON.ArcFollowCamera).orthoLeft = -10;
        (this.game.camera as BABYLON.ArcFollowCamera).orthoRight = 10;
        (this.game.camera as BABYLON.ArcFollowCamera).orthoTop = 10;
        // this.game.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        if (this.game.camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
            (this.game.camera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
                Math.PI / 2,
                0.0,
                0.0
            ).toQuaternion();
        } else {
            (this.game.camera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
                Math.PI / 2,
                0,
                0.25
            ).toQuaternion();
        }

    }

    public tick() {
        this.player.tick((this.game.camera as BABYLON.ArcFollowCamera).rotationQuaternion,
            () => (((a: number | undefined): number => {
                if (a != undefined)
                    return a;
                return 0.0;
            })(this.game.scene.deltaTime)));
    }
}
