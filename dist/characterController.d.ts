/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
import * as BABYLON from "@babylonjs/core";
import { World } from "./world";
import { PlayerInputController } from "./playerInputController";
export declare class Entity {
    mesh: BABYLON.Mesh;
    texture: BABYLON.Texture;
    world: World;
    pos: BABYLON.Vector3;
    vel: BABYLON.Vector3;
    rot: BABYLON.Quaternion;
    angVel: BABYLON.Quaternion;
    onGround: boolean;
    constructor(world: World);
    setMesh(mesh: BABYLON.Mesh): Entity;
    setPositionAndRotation(pos: BABYLON.Vector3, rot: BABYLON.Quaternion): Entity;
}
export declare class Player extends Entity {
    maxHSpeed: number;
    isSprinting: boolean;
    isJumping: boolean;
    canWallJump: boolean;
    lastWall: any;
    hasJumped: boolean;
    inputController: PlayerInputController;
    onWall: Map<BABYLON.Mesh, boolean>;
    constructor(world: World);
    moveH(x: number, z: number): void;
    jump(): void;
    wallJump(wall: BABYLON.Mesh): void;
    tick(cameraAngle: BABYLON.Quaternion): void;
}
//# sourceMappingURL=characterController.d.ts.map