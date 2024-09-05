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
import type {InputController} from "./inputController";
import type {World} from "./world";
import {Move} from "./move";
import {Skills} from "./skills";
import {AbstractMesh} from "@babylonjs/core";

export abstract class Entity {
    protected _mesh!: BABYLON.Mesh;
    protected _inputController!: InputController;
    protected _height!: number;
    protected _maxHP!: number;
    protected _maxMP!: number;
    protected _maxSP!: number;

    protected _world!: World;
    protected _pos!: BABYLON.Vector3;
    protected _vel: BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
    protected _rot!: BABYLON.Quaternion;
    protected _facingDirection: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 1).normalize();
    protected _hp!: number;
    protected _mp!: number;
    protected _skills!: Skills[];
    protected _moves!: Move[];

    public readonly on: Map<string, boolean> = new Map([["ground",  false], ["wall", false]]);

    protected abstract _gravity: number;

    public get mesh(): BABYLON.Mesh
    {
        return this._mesh;
    }
    public get inputController(): InputController
    {
        return this._inputController;
    }
    public get height(): number
    {
        return this._height;
    }
    public get maxHP(): number
    {
        return this._maxHP;
    }
    public get maxMP(): number
    {
        return this._maxMP;
    }
    public get maxSP(): number
    {
        return this._maxSP;
    }

    public get world(): World
    {
        return this._world;
    }
    public get pos(): BABYLON.Vector3
    {
        return this._pos;
    }
    public get vel(): BABYLON.Vector3
    {
        return this._vel;
    }
    public get rot(): BABYLON.Quaternion
    {
        return this._rot;
    }
    public get facingDirection(): BABYLON.Vector3
    {
        return this._facingDirection;
    }
    public get hp(): number
    {
        return this._hp;
    }
    public get mp(): number
    {
        return this._mp;
    }
    public get skills(): Skills[]
    {
        return this._skills;
    }
    public get moves(): Move[]
    {
        return this._moves;
    }

    public get gravity(): number
    {
        return this._gravity;
    }

    public set height(height: number) {
        if (this._height) return;
        this._height = height;
    }

    public set mesh(mesh: BABYLON.Mesh) {
        if (this._mesh) return;
        this._mesh = mesh;
    }

    public set world(world: World) {
        if (this._world) return;
        this._world = world;
    }

    public setPositionAndRotation(
        pos: BABYLON.Vector3,
        rot: BABYLON.Quaternion
    ): Entity {
        this._pos = this.mesh.position = pos;
        this._rot = this.mesh.rotationQuaternion = rot;
        return this;
    }

    protected checkCollisions(): void {
        this._world.collidablesPerType.forEach((collidables, key) => {
            let ray: BABYLON.Ray = new BABYLON.Ray(this._pos,
                this._vel.length() == 0 ? BABYLON.Vector3.Down() : this._vel, this._height / 2);
            let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.scene.pickWithRay(ray,
                (mesh: BABYLON.AbstractMesh) => {
                    return collidables.map((collidable) => collidable.mesh).includes(mesh);
                });
            this.on.set(key, !!(hit && hit.pickedPoint));
        });
    }
}

export class Player extends Entity {
    protected _maxSpeed: number = -1.0;
    protected _canWallJump: boolean = true;
    protected _lastWallWallJumpedFrom: BABYLON.Nullable<BABYLON.AbstractMesh> = null;
    protected _jumpState: boolean = false;
    public readonly friction: number = 0.7;

    public get maxSpeed(): number {
        return this._maxSpeed;
    }
    public get canWallJump(): boolean {
        return this._canWallJump;
    }
    public get lastWallWallJumpedFrom(): BABYLON.Nullable<AbstractMesh>
    {
        return this._lastWallWallJumpedFrom;
    }
    public get jumpState(): boolean
    {
        return this._jumpState;
    }

    public accelerateAndRotateH(x: number, z: number): void {
        let r = Math.sqrt(x ** 2 + z ** 2);

        if (r > 0.01) { // Deadzone
            let r1 = Math.abs(x) + Math.abs(z);
            x *= r / r1;
            z *= r / r1;

            if (this.on.get("ground")) {
                this.mesh.rotationQuaternion = BABYLON.Vector3.Up()
                    .scale(Math.atan2(z, x))
                    .toQuaternion();

                this._facingDirection.set(z, 0.0, x).normalize();
            }

            this._vel.set(
                this._vel.x - this.hMovementScaleFactor * z,
                this._vel.y,
                this._vel.z + this.hMovementScaleFactor * x
            )
        }

        if (this.on.get("ground")) {
            this.vel.set(this.friction * this._vel.x, this._vel.y, this.friction * this._vel.z);
        }
    }

    public jump(): void {
        this._vel.y = 28.0;
    }

    public wallJump(): void {
        if (!this._facingDirection) return;
        let ray: BABYLON.Ray = new BABYLON.Ray(this._pos, this._facingDirection, this._height / 2);
        let rayHelper: BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this._world.game.scene, BABYLON.Color3.Red());
        let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.scene.pickWithRay(ray,
            (mesh: BABYLON.AbstractMesh) => {
                let walls = this._world.collidablesPerType.get("wall");
                if (!walls) return false;
                return walls.map((wall) => wall.mesh).includes(mesh);
            });
        if (!hit) return;
        if (!hit.pickedMesh) return;
        let wall: BABYLON.AbstractMesh = hit.pickedMesh;
        if (this._lastWallWallJumpedFrom == wall) {
            let normalVectorNullable: BABYLON.Nullable<BABYLON.Vector3> = hit.getNormal(true);
            if (!normalVectorNullable) return;
            let normalVector: BABYLON.Vector3 = normalVectorNullable;
            console.debug([wall, normalVector]);
            if (!hit.pickedPoint) return;
            let rayNormal = new BABYLON.Ray(hit.pickedPoint, normalVector, 1);
            new BABYLON.RayHelper(rayNormal).show(
                this._world.game.scene,
                BABYLON.Color3.Blue()
            );
            let normal: BABYLON.Quaternion = new BABYLON.Quaternion(
                normalVector.x,
                normalVector.y,
                normalVector.z,
                0.0
            );
            console.assert(!!this._mesh.rotationQuaternion, "Rotation Quaternion cannot be null");
            this._mesh.rotationQuaternion = normal
                .multiply((this.mesh.rotationQuaternion as BABYLON.Quaternion).multiply(normal))
                .normalize();
            this._vel.subtractInPlace(
                normalVectorNullable.scale(2 * BABYLON.Vector3.Dot(this.vel, normalVectorNullable)));
            this._vel.set(this._vel.x, 28.0, this._vel.z);
            this._canWallJump = false;
            this._lastWallWallJumpedFrom = wall as BABYLON.AbstractMesh;
        }
    }

    private executeJumpRoutine(): void {
        if (!this._inputController.jumpPressed) {
            this._jumpState = false;
            this._canWallJump = true;
        } else {
            if (this.on.get("ground") && !this._jumpState) {
                this.jump();
                this._jumpState = true;
            }
            if (
                this._canWallJump &&
                this.on.get("wall") &&
                !this.on.get("ground") &&
                this._inputController.joystick.length() > 0.1
            ) {
                this.wallJump();
            }
        }
        if (this.on.get("ground")) {
            this._lastWallWallJumpedFrom = null;
        }
    }

    private applyMovementInfluences(): void {
        if (this._inputController.sprintHeld && this.on.get("ground")) {
            this._maxSpeed *= 1.3;
        } else if (this._inputController.sprintHeld && !this.on.get("ground")) {
            this._maxSpeed *= 1.2;
        }
        if (this._vel.length() > this._maxSpeed) {
            this._vel.normalize().scaleInPlace(this._maxSpeed);
        }
    }

    private applyGravity(getDeltaTime: () => number): void {
        if (!this.on.get("ground")) {
            this._vel.y += 0.5 * this.gravity * (getDeltaTime() / 1000.0);
        }
        if (this.on.get("ground") && this._vel.y < 0.0) {
            this._vel.y = 0.0;
        }
    }

    private moveMesh(getDeltaTime: () => number): void {
        this._maxSpeed = 2.5 + 10.0 * this._inputController.joystick.length();

        if (this._inputController.joystick != null) {
            this.accelerateAndRotateH(
                this._inputController.joystick.x,
                this._inputController.joystick.z
            );
        }
        this.executeJumpRoutine();

        this.applyMovementInfluences();
        this.applyGravity(getDeltaTime);

        let deltaPos = this._vel.scale(getDeltaTime() / 1000.0);

        if (deltaPos.length() > 0) {
            this._world.collidablesPerType.forEach((collidables, _key) => {
                let ray: BABYLON.Ray = new BABYLON.Ray(this._pos, deltaPos, deltaPos.length());
                let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.scene.pickWithRay(ray,
                    (mesh: BABYLON.AbstractMesh) => {
                        return collidables.map((collidable) => collidable.mesh).includes(mesh);
                    });
                if (hit && hit.pickedPoint) {
                    this._mesh.position = this._pos = hit.pickedPoint as BABYLON.Vector3;
                } else {
                    this._mesh.position = this._pos = this._pos.add(deltaPos);
                }
            });
        }
        console.assert(!!this._mesh.rotationQuaternion, "Rotation quaternion cannot be undefined");
        this._rot = this._mesh.rotationQuaternion as BABYLON.Quaternion;
        this.checkCollisions();
        this.applyGravity(getDeltaTime);
    }

    public tick(cameraAngle: BABYLON.Quaternion, getDeltaTime: () => number): void {
        console.assert(!!cameraAngle, "Camera angle cannot be undefined");
        this.checkCollisions();
        this._inputController.tick(this, this._world);
        this._inputController.joystick.rotateByQuaternionToRef(cameraAngle, this._inputController.joystick);
        this.moveMesh(getDeltaTime);
    }

    public get _gravity(): number {
        if (this.on.get("wall")) return -83.333;
        if (this._inputController.jumpPressed) return -90.0;
        return -100.0;
    }

    protected get hMovementScaleFactor() {
        return this.on.get("ground") ? 5.0 : 1.0;
    }
}