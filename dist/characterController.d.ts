/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
import * as BABYLON from "@babylonjs/core";
export declare class Entity {
    mesh: BABYLON.Mesh;
    pos: BABYLON.Vector3;
    vel: BABYLON.Vector3;
    rot: BABYLON.Quaternion;
    angVel: BABYLON.Quaternion;
    onGround: boolean;
    onWall: Map<BABYLON.Mesh, boolean>;
}
export declare class Player extends Entity {
    maxHSpeed: number;
    isSprinting: boolean;
    isJumping: boolean;
    canWallJump: boolean;
    lastWall: any;
    hasJumped: boolean;
    static calcRadialMovement(x: number, y: number): number;
    moveH(x: number, y: number): void;
    jump(): void;
    wallJump(wall: BABYLON.Mesh): void;
    tick(): void;
}
//# sourceMappingURL=characterController.d.ts.map