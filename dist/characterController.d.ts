/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
import * as BABYLON from "@babylonjs/core";
import { World } from "./world";
import { PlayerInputController } from "./playerInputController";
export declare abstract class Entity {
    mesh: BABYLON.Mesh;
    texture: BABYLON.Texture;
    world: World;
    pos: BABYLON.Vector3;
    velH: BABYLON.Vector3;
    vely: number;
    rot: BABYLON.Quaternion;
    onGround: boolean;
    onWall: boolean;
    abstract gravity: number;
    protected constructor(world: World);
    setMesh(mesh: BABYLON.Mesh): Entity;
    setPositionAndRotation(pos: BABYLON.Vector3, rot: BABYLON.Quaternion): Entity;
    protected checkCollisions(): void;
}
export declare class Player extends Entity {
    maxHSpeed: number;
    canWallJump: boolean;
    lastWallWallJumpedFrom: BABYLON.Mesh;
    jumpState: boolean;
    inputController: PlayerInputController;
    facingDirection: BABYLON.Vector3;
    get gravity(): number;
    constructor(world: World);
    protected get hMovementScaleFactor(): 5 | 1;
    accelerateAndRotateH(x: number, z: number): void;
    jump(): void;
    wallJump(): void;
    private executeJumpRoutine;
    private applyHMovementInfluences;
    private applyGravity;
    private moveMesh;
    tick(cameraAngle: BABYLON.Quaternion): void;
}
//# sourceMappingURL=characterController.d.ts.map