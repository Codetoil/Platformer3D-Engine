/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */

import * as BABYLON from "@babylonjs/core";

export class Entity {
  public mesh: BABYLON.Mesh;
  public pos: BABYLON.Vector3;
  public vel: BABYLON.Vector3;
  public rot: BABYLON.Quaternion;
  public angVel: BABYLON.Quaternion;
  public onGround: boolean;
  public onWall: Map<BABYLON.Mesh, boolean>;
}

export class Player extends Entity {
  public maxHSpeed: number;
  public isSprinting: boolean;
  public isJumping: boolean;
  public canWallJump = true;
  public lastWall = null;
  public hasJumped = false;

  public static calcRadialMovement(x: number, y: number): number {
    return Math.sqrt(x ** 2 + y ** 2);
  }

  public moveH(x: number, y: number) {
    let r = Player.calcRadialMovement(x, y);

    // Deadzone
    if (r > 0.01) {
      let r1 = Math.abs(x) + Math.abs(y);
      x *= r / r1;
      y *= r / r1;

      let dir = new BABYLON.Vector3(x, 0, y);

      if (this.onGround) {
        this.mesh.setDirection(dir);
      }

      this.vel = this.vel.add(dir.scale(this.onGround ? 1.5 : 0.8));
    }
  }

  public jump() {
    this.vel = new BABYLON.Vector3(this.vel.x, 28, this.vel.z);
  }

  public wallJump(wall: BABYLON.Mesh) {
    if (this.lastWall !== wall) {
      this.vel = this.mesh.getDirection(new BABYLON.Vector3(0, 30, -60));
      this.mesh.setDirection(
        this.mesh.getDirection(new BABYLON.Vector3(0, 0, -60))
      );
      this.canWallJump = false;
      this.lastWall = wall;
    }
  }

  public tick() {}
}
