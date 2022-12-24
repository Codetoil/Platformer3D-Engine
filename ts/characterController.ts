/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */

import * as BABYLON from "@babylonjs/core";
import { World } from "./world";
import { PlayerInputController } from "./playerInputController";

export abstract class Entity {
  public mesh: BABYLON.Mesh;
  public texture: BABYLON.Texture;

  public world: World;

  public pos: BABYLON.Vector3;
  public velH: BABYLON.Vector3;
  public vely: number;
  public rot: BABYLON.Quaternion;

  public onGround: boolean;
  public onWall: boolean;

  public abstract gravity: number;

  protected constructor(world: World) {
    this.world = world;
    this.velH = new BABYLON.Vector3(0.0, 0.0, 0.0);
    this.vely = 0.0;
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

  protected checkCollisions() {
    this.onGround = this.world.grounds
      .map((ground: BABYLON.Mesh) =>
        this.mesh.intersectsMesh(ground, false)
          ? this.mesh.intersectsMesh(ground, true)
          : false
      )
      .reduce((p, c) => p || c, false);
    this.onWall = this.world.walls
      .map((wall: BABYLON.Mesh) =>
        this.mesh.intersectsMesh(wall, false)
          ? this.mesh.intersectsMesh(wall, true)
          : false
      )
      .reduce((p, c) => p || c, false);
  }
}

export class Player extends Entity {
  public maxHSpeed: number;
  public isSprinting: boolean;
  public isJumpButtonPressed: boolean;
  public canWallJump = true;
  public lastWallWallJumpedFrom = null;
  public jumpState2 = false;
  public inputController: PlayerInputController;
  public facingDirection: BABYLON.Vector3;

  public get gravity(): number {
    return this.isJumpButtonPressed ? -1.8 : -2.0;
  }

  public constructor(world: World) {
    super(world);
    this.inputController = new PlayerInputController(world.engine);
  }

  protected get hMovementScaleFactor() {
    return this.onGround ? 5.0 : 1.0;
  }

  public accelerateAndRotateH(x: number, z: number) {
    let r = Math.sqrt(x ** 2 + z ** 2);

    // Deadzone
    if (r > 0.01) {
      let r1 = Math.abs(x) + Math.abs(z);
      x *= r / r1;
      z *= r / r1;

      if (this.onGround) {
        this.mesh.rotationQuaternion = new BABYLON.Vector3(
          0.0,
          Math.atan2(z, x),
          0
        ).toQuaternion();

        this.facingDirection = new BABYLON.Vector3(z, 0.0, x).normalize();
      }

      this.velH = this.velH.add(
        new BABYLON.Vector3(
          this.hMovementScaleFactor * z,
          0.0,
          this.hMovementScaleFactor * x
        )
      );
    }

    if (this.onGround) {
      this.velH.scaleToRef(0.7, this.velH);
    }
  }

  public jump() {
    this.vely = 28.0;
  }

  public wallJump() {
    if (!this.facingDirection) return;
    let ray = new BABYLON.Ray(this.pos, this.facingDirection, 100);
    let rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(this.world.scene, BABYLON.Color3.Red());
    let hit = this.world.scene.pickWithRay(ray, (mesh: BABYLON.Mesh) => {
      return this.world.walls.includes(mesh);
    });
    let wall = hit.pickedMesh;
    if (!wall) return;
    if (this.lastWallWallJumpedFrom !== wall) {
      let normalV: BABYLON.Vector3 = hit.getNormal();
      console.debug(normalV);
      let normal: BABYLON.Quaternion = new BABYLON.Quaternion(
        normalV.x,
        normalV.y,
        normalV.z,
        0.0
      );
      this.mesh.rotationQuaternion = normal
        .multiply(this.mesh.rotationQuaternion.multiply(normal))
        .normalize();
      this.velH = this.velH.subtract(
        normalV.scale(2 * BABYLON.Vector3.Dot(this.velH, normalV))
      );
      this.canWallJump = false;
      this.lastWallWallJumpedFrom = wall;
    }
  }

  private executeJumpRoutine() {
    if (!this.isJumpButtonPressed) {
      this.jumpState2 = false;
    }
    if (this.isJumpButtonPressed) {
      if (this.onGround && !this.jumpState2) {
        this.jump();
        this.jumpState2 = true;
      }
      if (
        this.canWallJump &&
        this.onWall &&
        !this.onGround &&
        this.maxHSpeed > 0.1
      ) {
        this.wallJump();
      }
    } else {
      this.canWallJump = true;
    }
    if (this.onGround) {
      this.lastWallWallJumpedFrom = null;
    }
  }

  private applyHMovementInfluences() {
    if (this.isSprinting && this.onGround) {
      this.maxHSpeed *= 1.3;
    } else if (this.isSprinting && !this.onGround) {
      this.maxHSpeed *= 1.2;
    }
    if (this.velH.length() > this.maxHSpeed) {
      this.velH = this.velH.normalize().scale(this.maxHSpeed);
    }
  }

  private applyGravity() {
    if (!this.onGround) {
      this.vely += this.gravity;
    }
    if (this.onGround && this.vely < 0.0) {
      this.vely = 0.0;
    }
  }

  private moveMesh() {
    this.maxHSpeed = 2.5 + 10.0 * this.inputController.joystick.length();
    this.isJumpButtonPressed = this.inputController.jumpPressed;
    this.isSprinting = this.inputController.sprintHeld;

    if (this.inputController.joystick != null) {
      this.accelerateAndRotateH(
        this.inputController.joystick.x,
        this.inputController.joystick.z
      );
    }
    this.executeJumpRoutine();

    this.applyHMovementInfluences();
    this.applyGravity();

    let deltay = this.vely + (!this.onGround ? this.gravity / 2 : 0.0);
    if (Math.abs(deltay) > 50) {
      deltay = 50 * (deltay === 0 ? 0 : deltay > 0 ? 1 : -1);
    }
    let deltaPos = new BABYLON.Vector3(this.velH.x, deltay, this.velH.z).scale(
      1.0 / 60.0
    );

    this.mesh.position = this.mesh.position.add(deltaPos);
    this.pos = this.mesh.position;
    this.rot = this.mesh.rotationQuaternion;
  }

  public tick(cameraAngle: BABYLON.Quaternion) {
    console.assert(!!cameraAngle, "Camera angle cannot be undefined");

    this.checkCollisions();
    this.inputController.tick(cameraAngle);
    this.checkCollisions();

    this.moveMesh();
  }
}
