/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */

import * as BABYLON from "@babylonjs/core";
import { World } from "./world";
import { PlayerInputController } from "./playerInputController";

export class Entity {
  public mesh: BABYLON.Mesh;
  public texture: BABYLON.Texture;

  public world: World;

  public pos: BABYLON.Vector3;
  public vel: BABYLON.Vector3;
  public rot: BABYLON.Quaternion;
  public angVel: BABYLON.Quaternion;

  public onGround: boolean;

  public constructor(world: World) {
    this.world = world;
    this.vel = new BABYLON.Vector3(0.0, 0.0, 0.0);
    this.angVel = new BABYLON.Quaternion(0.0, 0.0, 0.0, 0.0);
  }

  public setMesh(mesh: BABYLON.Mesh): Entity {
    this.mesh = mesh;
    return this;
  }

  public setPositionAndRotation(
    pos: BABYLON.Vector3,
    rot: BABYLON.Quaternion
  ): Entity {
    this.pos = this.mesh.position = pos;
    this.rot = this.mesh.rotationQuaternion = rot;
    return this;
  }
}

export class Player extends Entity {
  public maxHSpeed: number;
  public isSprinting: boolean;
  public isJumping: boolean;
  public canWallJump = true;
  public lastWall = null;
  public hasJumped = false;
  public inputController: PlayerInputController;
  public onWall: Map<BABYLON.Mesh, boolean>;

  public constructor(world: World) {
    super(world);
    this.onWall = new Map<BABYLON.Mesh, boolean>();
    this.inputController = new PlayerInputController(world.engine);
  }

  public moveH(x: number, z: number) {
    let r = Math.sqrt(x ** 2 + z ** 2);

    // Deadzone
    if (r > 0.01) {
      let r1 = Math.abs(x) + Math.abs(z);
      x *= r / r1;
      z *= r / r1;

      let dir = new BABYLON.Vector3(-x, z, 0).toQuaternion();

      //if (this.onGround) {
      this.mesh.rotationQuaternion = dir;
      //}
      dir = dir.scale(this.onGround ? 1.5 : 0.8);

      this.vel = this.vel.add(new BABYLON.Vector3(dir.x, 0, dir.z));
    }
  }

  public jump() {
    this.vel = new BABYLON.Vector3(this.vel.x, 28, this.vel.z);
  }

  public wallJump(wall: BABYLON.Mesh) {
    if (this.lastWall !== wall) {
      let velQ: BABYLON.Quaternion = new BABYLON.Quaternion(
        this.vel.x,
        this.vel.y,
        this.vel.z,
        0.0
      );
      this.mesh.rotationQuaternion = velQ.multiply(
        this.mesh.rotationQuaternion.multiply(velQ)
      );
      this.canWallJump = false;
      this.lastWall = wall;
    }
  }

  public tick(cameraAngle: BABYLON.Quaternion) {
    console.assert(!!cameraAngle, "Camera angle cannot be undefined");
    this.onGround = this.world.grounds
      .map((gnd: BABYLON.Mesh) =>
        this.mesh.intersectsMesh(gnd, false)
          ? this.mesh.intersectsMesh(gnd, true)
          : false
      )
      .reduce((p, c) => p || c, false);
    this.onWall.forEach(
      (_v: boolean, wll: BABYLON.Mesh, map: Map<BABYLON.Mesh, boolean>) => {
        let v = this.mesh.intersectsMesh(wll, false)
          ? this.mesh.intersectsMesh(wll, true)
          : false;
        map.set(wll, v);
      }
    );
    this.inputController.tick(cameraAngle);

    this.maxHSpeed = 10.0 * this.inputController.joystick.length();
    this.isJumping = this.inputController.jumpPressed;
    this.isSprinting = this.inputController.sprintHeld;

    if (this.inputController.joystick != null) {
      this.moveH(
        this.inputController.joystick.x,
        this.inputController.joystick.z
      );
    }

    if (!this.isJumping) {
      this.hasJumped = false;
    }
    if (this.isJumping) {
      if (this.onGround && !this.hasJumped) {
        this.jump();
        this.hasJumped = true;
      }
      if (this.canWallJump && !this.onGround && this.maxHSpeed > 0.1) {
        this.onWall.forEach((e) => {
          if (e[1]) {
            this.wallJump(e[0]);
          }
        });
      }

      if (
        !this.onGround &&
        ![...this.onWall.values()].reduce(
          (p: boolean, c: boolean) => p || c,
          false
        )
      ) {
        this.vel = this.vel.add(new BABYLON.Vector3(0, 0.5, 0));
      }
    } else {
      this.canWallJump = true;
    }
    if (this.onGround) {
      this.lastWall = null;
    }
    var velH = new BABYLON.Vector3(this.vel.x, 0, this.vel.z);
    if (this.isSprinting && this.onGround) {
      this.maxHSpeed *= 1.3;
    } else if (this.isSprinting && !this.onGround) {
      this.maxHSpeed *= 1.2;
    }
    if (velH.length() > this.maxHSpeed) {
      velH = velH.normalize().scale(this.maxHSpeed);
    }
    var vely = this.vel.y;
    if (Math.abs(vely) > 50) {
      vely = 50 * (vely === 0 ? 0 : vely > 0 ? 1 : -1);
    }
    this.vel = new BABYLON.Vector3(velH.x, vely, velH.z);
    this.angVel = BABYLON.Quaternion.Zero();

    this.rot = this.mesh.rotationQuaternion;
  }
}
