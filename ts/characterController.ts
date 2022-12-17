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

  public onGround: boolean;

  public constructor(world: World) {
    this.world = world;
    this.vel = new BABYLON.Vector3(0.0, 0.0, 0.0);
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

      let dir = new BABYLON.Vector3(0.0, Math.atan2(z, x), 0).toQuaternion();

      if (this.onGround) {
        this.mesh.rotationQuaternion = dir;
      }
      let s = this.onGround ? 5.0 : 1.0;

      this.vel = this.vel.add(new BABYLON.Vector3(s * z, 0.0, s * x));
    }

    if (this.onGround) {
      this.vel = new BABYLON.Vector3(
        0.7 * this.vel.x,
        this.vel.y,
        0.7 * this.vel.z
      );
    }
  }

  public jump() {
    this.vel = new BABYLON.Vector3(this.vel.x, 28, this.vel.z);
  }

  public wallJump(wall: BABYLON.Mesh) {
    if (this.lastWall !== wall) {
      let normal: BABYLON.Quaternion = wall.rotation.toQuaternion();
      this.mesh.rotationQuaternion = normal
        .multiply(this.mesh.rotationQuaternion.multiply(normal))
        .normalize();
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
    for (const wall of this.world.walls) {
      let v = this.mesh.intersectsMesh(wall, false)
        ? this.mesh.intersectsMesh(wall, true)
        : false;
      this.onWall.set(wall, v);
    }

    this.inputController.tick(cameraAngle);

    this.maxHSpeed = 3.0 + 10.0 * this.inputController.joystick.length();
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
        this.onWall.forEach((wallCanBeJumped, wall) => {
          if (wallCanBeJumped) {
            this.wallJump(wall);
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
    if (!this.onGround) {
      vely += this.world.gravity / 60.0;
    } else if (this.onGround && vely < 0.0) {
      vely = 0.0;
    }
    if (Math.abs(vely) > 50) {
      vely = 50 * (vely === 0 ? 0 : vely > 0 ? 1 : -1);
    }
    this.vel = new BABYLON.Vector3(velH.x, vely, velH.z);
    vely = vely + (!this.onGround ? this.world.gravity / 2 : 0.0) / 60.0;
    if (Math.abs(vely) > 50) {
      vely = 50 * (vely === 0 ? 0 : vely > 0 ? 1 : -1);
    }
    let vel1 = new BABYLON.Vector3(velH.x, vely, velH.z);
    this.mesh.position = this.mesh.position.add(vel1.scale(1.0 / 60.0));
    this.pos = this.mesh.position;
    this.rot = this.mesh.rotationQuaternion;
  }
}
