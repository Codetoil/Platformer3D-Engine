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

import * as BABYLON from "@babylonjs/core";
import { PlayerClient } from "./entityClient";
import {Ground, Wall, World} from "../common/world";
import {GameClient} from "./gameClient";

export class WorldClient extends World {
    public player!: PlayerClient;

    public read() {
        console.debug("Reading world...");
        console.debug("(TEMP: HARDCODED)");
        this.grounds = [];
        this.walls = [];

        //Ground
        console.debug("(TEMP: Ground)");
        const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane(
            "ground",
            {width: 20.0, height: 20.0},
            this.game.scene
        );
        ground.material = new BABYLON.StandardMaterial("groundMat", this.game.scene);
        (ground.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(1, 1, 1);
        ground.material.backFaceCulling = false;
        ground.position = new BABYLON.Vector3(5, -10, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        this.grounds.push(new Ground().setMesh(ground));

        console.debug("(TEMP: Wall)");
        var wall: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
            "wall",
            { width: 15, height: 15, depth: 0.75 },
            this.game.scene
        );
        wall.material = new BABYLON.StandardMaterial("wallMat", this.game.scene);
        (wall.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(1, 1, 1);
        wall.material.backFaceCulling = false;
        wall.position = new BABYLON.Vector3(3.2, -2.5, -15);
        wall.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        this.walls.push(new Wall().setMesh(wall));

        console.debug("(TEMP: Wall2)")
        var wall2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
            "wall2",
            { width: 15, height: 15, depth: 0.75 },
            this.game.scene
        );
        wall2.material = wall.material;
        wall2.position = new BABYLON.Vector3(6.8, -2.5, -15);
        wall2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        this.walls.push(new Wall().setMesh(wall2));

        console.debug("(TEMP: Platform)");
        var platform = BABYLON.MeshBuilder.CreateBox(
            "platform1",
            { width: 5.0, depth: 5.0, height: 0.5 },
            this.game.scene
        );
        platform.material = wall.material;
        platform.position = new BABYLON.Vector3(17, -10, -10);
        this.grounds.push(new Ground().setMesh(platform));

        console.debug("(TEMP: DBox)");
        const dbox = BABYLON.MeshBuilder.CreateBox(
            "dbox",
            {width: 1, height: 2, depth: 1},
            this.game.scene
        );
        dbox.position = wall.position;
        dbox.material = new BABYLON.StandardMaterial("dboxMat", this.game.scene);
        (dbox.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(0, 1, 1);
        dbox.material.backFaceCulling = false;
        dbox.setEnabled(false);
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
