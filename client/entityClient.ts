/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2023  Codetoil
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
import { Mixin } from "ts-mixer";
import { PlayerInputController } from "./clientInputController";
import { Entity, Player } from "../common/entity";
import type { World } from "../common/world";
import {Wall} from "../common/world";

export abstract class EntityClient extends Entity {
    public texture?: BABYLON.Texture;

    protected checkCollisions(): void {
        let ray: BABYLON.Ray = new BABYLON.Ray(this.pos, BABYLON.Vector3.Down(), this.height / 2);
        let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this.world.game.scene.pickWithRay(ray,
            (mesh: BABYLON.AbstractMesh) => {
                return this.world.grounds.map((ground) => ground.mesh).includes(mesh);
            });
        this.onGround = !!(hit && hit.pickedPoint);
        this.onWall = this.world.walls
            .map((wall: Wall) =>
                this.mesh.intersectsMesh(wall.mesh, false)
                    ? this.mesh.intersectsMesh(wall.mesh, true)
                    : false
            )
            .reduce((p, c) => p || c, false);
    }
}

export class PlayerClient extends Mixin(EntityClient, Player) {

    public constructor() {
        super();
        this.inputController = new PlayerInputController();
    }

    public setWorld(world: World): Player {
        super.setWorld(world);
        (this.inputController as PlayerInputController).setEngine(this.world.game.engine);
        return this;
    }

    public accelerateAndRotateH(x: number, z: number): void {
        let r = Math.sqrt(x ** 2 + z ** 2);

        // Deadzone
        if (r > 0.01) {
            let r1 = Math.abs(x) + Math.abs(z);
            x *= r / r1;
            z *= r / r1;

            if (this.onGround) {
                this.mesh.rotationQuaternion = BABYLON.Vector3.Up()
                    .scale(Math.atan2(z, x))
                    .toQuaternion();

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

    public jump(): void {
        this.vely = 28.0;
    }

    public wallJump(): void {
        if (!this.facingDirection) return;
        let ray: BABYLON.Ray = new BABYLON.Ray(this.pos, this.facingDirection, this.height / 2);
        let rayHelper: BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this.world.game.scene, BABYLON.Color3.Red());
        let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this.world.game.scene.pickWithRay(ray,
            (mesh: BABYLON.AbstractMesh) => {
            return this.world.walls.map((wall) => wall.mesh).includes(mesh);
        });
        if (!hit) return;
        if (!hit.pickedMesh) return;
        let wall: BABYLON.AbstractMesh = hit.pickedMesh;
        if (!(this.lastWallWallJumpedFrom === null) && this.lastWallWallJumpedFrom?.mesh !== wall) {
            let normalVectorNullable: BABYLON.Nullable<BABYLON.Vector3> = hit.getNormal(true);
            if (!normalVectorNullable) return;
            let normalVector: BABYLON.Vector3 = normalVectorNullable;
            console.debug([wall, normalVector]);
            if (!hit.pickedPoint) return;
            let rayNormal = new BABYLON.Ray(hit.pickedPoint, normalVector, 1);
            new BABYLON.RayHelper(rayNormal).show(
                this.world.game.scene,
                BABYLON.Color3.Blue()
            );
            let normal: BABYLON.Quaternion = new BABYLON.Quaternion(
                normalVector.x,
                normalVector.y,
                normalVector.z,
                0.0
            );
            console.assert(!!this.mesh.rotationQuaternion, "Rotation Quaternion cannot be null");
            this.mesh.rotationQuaternion = normal
                .multiply((this.mesh.rotationQuaternion as BABYLON.Quaternion).multiply(normal))
                .normalize();
            this.velH = this.velH.subtract(
                normalVectorNullable.scale(2 * BABYLON.Vector3.Dot(this.velH, normalVectorNullable))
            );
            this.vely = 28.0;
            this.canWallJump = false;
            this.lastWallWallJumpedFrom.mesh = wall as BABYLON.AbstractMesh;
        }
    }

    private executeJumpRoutine(): void {
        if (!this.inputController.jumpPressed) {
            this.jumpState = false;
            this.canWallJump = true;
        } else {
            if (this.onGround && !this.jumpState) {
                this.jump();
                this.jumpState = true;
            }
            if (
                this.canWallJump &&
                this.onWall &&
                !this.onGround &&
                this.inputController.joystick.length() > 0.1
            ) {
                this.wallJump();
            }
        }
        if (this.onGround) {
            this.lastWallWallJumpedFrom = null;
        }
    }

    private applyHMovementInfluences(): void {
        if (this.inputController.sprintHeld && this.onGround) {
            this.maxHSpeed *= 1.3;
        } else if (this.inputController.sprintHeld && !this.onGround) {
            this.maxHSpeed *= 1.2;
        }
        if (this.velH.length() > this.maxHSpeed) {
            this.velH = this.velH.normalize().scale(this.maxHSpeed);
        }
    }

    private applyGravity(getDeltaTime: () => number): void {
        if (!this.onGround) {
            this.vely += 0.5 * this.gravity * (getDeltaTime() / 1000.0);
        }
        if (this.onGround && this.vely < 0.0) {
            this.vely = 0.0;
        }
    }

    private capYVelocity(): void {
        if (Math.abs(this.vely) > 50) {
            this.vely = 50 * (this.vely === 0 ? 0 : this.vely > 0 ? 1 : -1);
        }
    }

    private moveMesh(getDeltaTime: () => number): void {
        this.maxHSpeed = 2.5 + 10.0 * this.inputController.joystick.length();

        if (this.inputController.joystick != null) {
            this.accelerateAndRotateH(
                this.inputController.joystick.x,
                this.inputController.joystick.z
            );
        }
        this.executeJumpRoutine();

        this.applyHMovementInfluences();
        this.applyGravity(getDeltaTime);
        this.capYVelocity();

        let deltaPos = new BABYLON.Vector3(this.velH.x, this.vely, this.velH.z)
            .scale(getDeltaTime() / 1000.0);

        if (deltaPos.length() > 0)
        {
            let ray: BABYLON.Ray = new BABYLON.Ray(this.pos, deltaPos, deltaPos.length());
            let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this.world.game.scene.pickWithRay(ray,
                (mesh: BABYLON.AbstractMesh) => {
                return this.world.grounds.map((ground) => ground.mesh).includes(mesh);
            });
            if (hit && hit.pickedPoint)
            {
                this.mesh.position = this.pos = hit.pickedPoint as BABYLON.Vector3;
            }
            else
            {
                this.mesh.position = this.pos = this.pos.add(deltaPos);
            }
        }
        console.assert(!!this.mesh.rotationQuaternion, "Rotation quaternion cannot be undefined");
        this.rot = this.mesh.rotationQuaternion as BABYLON.Quaternion;
        this.checkCollisions();
        this.applyGravity(getDeltaTime);
        this.capYVelocity();
    }

    public tick(cameraAngle: BABYLON.Quaternion, getDeltaTime: () => number): void {
        console.assert(!!cameraAngle, "Camera angle cannot be undefined");
        this.checkCollisions();
        this.inputController.tick(this, this.world);
        this.inputController.joystick.rotateByQuaternionToRef(cameraAngle, this.inputController.joystick);
        this.moveMesh(getDeltaTime);
    }
}