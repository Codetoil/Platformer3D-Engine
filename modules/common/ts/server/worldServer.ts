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
import {Player} from "../common/character";
import {Collidable} from "../common/collidable";

export class WorldServer extends World {
    private _players!: Player[];

    public get players(): Player[] {
        return this._players;
    }

    public async read(): Promise<void> {
        console.debug("Reading world...");
        console.debug("(TEMP: HARDCODED)");

        //Collidable
        console.debug("(TEMP: Collidable)");
        const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane(
            "ground",
            {width: 20.0, height: 20.0},
            this._game.babylonScene
        );
        ground.material = new BABYLON.StandardMaterial("groundMat", this.game.babylonScene);
        (ground.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(1, 1, 1);
        ground.material.backFaceCulling = false;
        ground.position = new BABYLON.Vector3(5, -10, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        this.collidablesPerType.get("ground")!.push(new Collidable(ground));

        console.debug("(TEMP: Wall)");
        let wall: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
            "wall",
            {width: 15, height: 15, depth: 0.75},
            this._game.babylonScene
        );
        wall.material = new BABYLON.StandardMaterial("wallMat", this.game.babylonScene);
        (wall.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(1, 1, 1);
        wall.material.backFaceCulling = false;
        wall.position = new BABYLON.Vector3(3.2, -2.5, -15);
        wall.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        this.collidablesPerType.get("wall")!.push(new Collidable(wall));

        console.debug("(TEMP: Wall2)")
        var wall2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
            "wall2",
            {width: 15, height: 15, depth: 0.75},
            this._game.babylonScene
        );
        wall2.material = wall.material;
        wall2.position = new BABYLON.Vector3(6.8, -2.5, -15);
        wall2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        this.collidablesPerType.get("wall")!.push(new Collidable(wall2));

        console.debug("(TEMP: Platform)");
        const platform = BABYLON.MeshBuilder.CreateBox(
            "platform1",
            {width: 5.0, depth: 5.0, height: 0.5},
            this._game.babylonScene
        );
        platform.material = wall.material;
        platform.position = new BABYLON.Vector3(17, -10, -10);
        this.collidablesPerType.get("ground")!.push(new Collidable(platform));

        console.debug("(TEMP: DBox)");
        const dbox = BABYLON.MeshBuilder.CreateBox(
            "dbox",
            {width: 1, height: 2, depth: 1},
            this._game.babylonScene
        );
        dbox.position = wall.position;
        dbox.material = new BABYLON.StandardMaterial("dboxMat", this.game.babylonScene);
        (dbox.material as BABYLON.StandardMaterial).diffuseColor =
            new BABYLON.Color3(0, 1, 1);
        dbox.material.backFaceCulling = false;
        dbox.setEnabled(false);

        // Lights
        console.debug("Initializing Lights...");
        new BABYLON.HemisphericLight(
            "hemi",
            new BABYLON.Vector3(0, 1, 0),
            this._game.babylonScene
        );

        console.debug("Initializing Camera...");
        this._game.babylonCamera = new BABYLON.ArcRotateCamera(
            "fake_camera",
            Math.PI / 2,
            0.5,
            10,
            new BABYLON.Vector3(0, 0, 0),
            this.game.babylonScene
        );
        (this._game.babylonCamera as BABYLON.ArcFollowCamera).orthoBottom = -10;
        (this._game.babylonCamera as BABYLON.ArcFollowCamera).orthoLeft = -10;
        (this._game.babylonCamera as BABYLON.ArcFollowCamera).orthoRight = 10;
        (this._game.babylonCamera as BABYLON.ArcFollowCamera).orthoTop = 10;
        this._game.babylonCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        (this._game.babylonCamera as BABYLON.ArcFollowCamera).rotationQuaternion = new BABYLON.Vector3(
            Math.PI / 2,
            0.0,
            0.0
        ).toQuaternion();
    }

    public async load(): Promise<void> {
        console.info("Loading World...");
        await this.read();
        this._loaded = true;
    }

    public tick() {
    }
}
