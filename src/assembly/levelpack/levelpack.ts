/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
 *  Copyright (C) 2021-2025 Codetoil
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
// TODO Dynamicly load information from file system
import {NamespacedKey} from "../common/namespacedKey";
import {MoveLevel} from "../common/move";
import {Collidable, CollidableType} from "../common/collidable";
import {GameEngine} from "../common/gameEngine";
import {World} from "../common/world";

export class MoveLevels {
    public static readonly REGULAR: MoveLevel = new MoveLevel(new NamespacedKey("game3d", "regular"));
    public static readonly SUPER: MoveLevel = new MoveLevel(new NamespacedKey("game3d", "super"));
    public static readonly ULTRA: MoveLevel = new MoveLevel(new NamespacedKey("game3d", "ultra"));
}

export class Moves {

}

export class Skills {

}

export class Items {

}

export class CollidableTypes {
    public static readonly GROUND: CollidableType = new CollidableType(new NamespacedKey("game3d", "ground"));
    public static readonly WALL: CollidableType = new CollidableType(new NamespacedKey("game3d", "wall"));
}

export class Worlds {
    public static TEST: NamespacedKey = new NamespacedKey("game3d", "test");
}

export class Levelpack {
    public static readonly VERSION: number = 0;

    public static load(): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (reason?: any) => void): void => {
            // TODO Load world data from Levelpack

            console.debug("Loading levelpack...");
            console.debug("(TEMP: HARDCODED)");

        });
    }

    public static initializeWorld(gameEngine: GameEngine, namespacedKey: NamespacedKey): Promise<World> {

        return new Promise<World>(
            (resolve: (world: World) => void, reject: (reason?: any) => void): void => {
                console.debug(`Reading world ${namespacedKey}...`);
                let world: World;

                if (namespacedKey !== Worlds.TEST) throw new Error("World could not be found.");
                world = gameEngine.createWorld(namespacedKey);
                world.loadWorld().then((): void => {
                    //Collidable
                    console.debug("(TEMP: Collidable)");
                    /*const ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane(
                        "ground",
                        {width: 20.0, height: 20.0},
                        world.babylonScene
                    );
                    ground.material = new BABYLON.StandardMaterial("groundMat", world.babylonScene);
                    (ground.material as BABYLON.StandardMaterial).diffuseColor =
                        new BABYLON.Color3(1, 1, 1);
                    ground.material.backFaceCulling = false;
                    ground.position = new BABYLON.Vector3(5, -10, -15);
                    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);*/
                    world.collidables.push(new Collidable(CollidableTypes.GROUND));

                    console.debug("(TEMP: Wall)");
                    /*const wall: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
                        "wall",
                        {width: 15, height: 15, depth: 0.75},
                        world.babylonScene
                    );
                    wall.material = new BABYLON.StandardMaterial("wallMat", world.babylonScene);
                    (wall.material as BABYLON.StandardMaterial).diffuseColor =
                        new BABYLON.Color3(1, 1, 1);
                    wall.material.backFaceCulling = false;
                    wall.position = new BABYLON.Vector3(3.2, -2.5, -15);
                    wall.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);*/
                    world.collidables.push(new Collidable(CollidableTypes.WALL));

                    console.debug("(TEMP: Wall2)")
                    /*const wall2: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(
                        "wall2",
                        {width: 15, height: 15, depth: 0.75},
                        world.babylonScene
                    );
                    wall2.material = wall.material;
                    wall2.position = new BABYLON.Vector3(6.8, -2.5, -15);
                    wall2.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);*/
                    world.collidables.push(new Collidable(CollidableTypes.WALL));

                    console.debug("(TEMP: Platform)");
                    /*const platform = BABYLON.MeshBuilder.CreateBox(
                        "platform1",
                        {width: 5.0, depth: 5.0, height: 0.5},
                        world.babylonScene
                    );
                    platform.material = wall.material;
                    platform.position = new BABYLON.Vector3(17, -10, -10);*/
                    world.collidables.push(new Collidable(CollidableTypes.GROUND));

                    console.debug("(TEMP: DBox)");
                    /*const dbox = BABYLON.MeshBuilder.CreateBox(
                        "dbox",
                        {width: 1, height: 2, depth: 1},
                        world.babylonScene
                    );
                    dbox.position = wall.position;
                    dbox.material = new BABYLON.StandardMaterial("dboxMat", world.babylonScene);
                    (dbox.material as BABYLON.StandardMaterial).diffuseColor =
                        new BABYLON.Color3(0, 1, 1);
                    dbox.material.backFaceCulling = false;
                    dbox.setEnabled(false);*/

                    // Lights
                    console.debug("Initializing Lights...");
                    /*new BABYLON.HemisphericLight(
                        "hemi",
                        new BABYLON.Vector3(0, 1, 0),
                        world.babylonScene
                    );*/
                    resolve(world);
                }).catch((e: Error) => {
                    reject(e);
                });
            }
        );


    }
}
