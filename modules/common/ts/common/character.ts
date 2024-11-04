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
import {World} from "./world";
import {Move} from "./move";
import {Skill} from "./skill";
import {AbstractMesh} from "@babylonjs/core";
import {NamespacedKey} from "./namespacedKey";

/**
 * A character in the game world. Can be an Ally, an Enemy, or both. Can be a Player or an NPC.
 */
export class Character {
    protected _mesh!: BABYLON.Mesh;
    protected _world!: World;
    protected _inputController!: InputController;

    // Character Location and Rotation
    protected _pos!: BABYLON.Vector3;
    protected _vel: BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
    protected _rot!: BABYLON.Quaternion;
    protected _facingDirection: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 1).normalize();

    // Character Properties
    // TODO: Load in at runtime
    protected _height: number = 2.0;
    protected _maxHP: number = 10;
    protected _maxMP: number = 10;
    protected _maxSP: number = 10;
    protected _maxHorizontalSpeedJoystickNeutral: number = 2.5;
    protected _maxHorizontalSpeedJoystickFull: number = 12.5;
    protected _maxVerticalSpeed: number = 50.0;
    protected _jumpVerticalVelocity: number = 28.0;
    protected _friction: number = 0.7;
    protected _wallGravity: number = -83.333;
    protected _jumpingGravity: number = -90.0;
    protected _fullGravity: number = -100.0;

    // Character State
    protected _hp!: number;
    protected _mp!: number;
    protected _skills!: Skill[];
    protected _moves!: Move[];
    protected _canWallJumpNow: boolean = true;
    protected _lastWallWallJumpedFrom: BABYLON.Nullable<BABYLON.AbstractMesh> = null;
    protected _jumpState: boolean = false;
    public readonly on: Map<NamespacedKey, boolean> = new Map([
        [new NamespacedKey("game3d", "ground"),  false],
        [new NamespacedKey("game3d", "wall"), false]
    ]);

    public get mesh(): BABYLON.Mesh
    {
        return this._mesh;
    }
    public get world(): World
    {
        return this._world;
    }
    public get inputController(): InputController
    {
        return this._inputController;
    }

    // Character Location and Rotation
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

    // Character Properties
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
    public get maxHorizontalSpeedJoystickNeutral(): number {
        return this._maxHorizontalSpeedJoystickNeutral;
    }
    public get maxHorizontalSpeedJoystickFull(): number {
        return this._maxHorizontalSpeedJoystickFull;
    }
    public get maxVerticalSpeed(): number {
        return this._maxVerticalSpeed;
    }
    public get jumpVerticalVelocity(): number {
        return this._jumpVerticalVelocity;
    }
    public get friction(): number {
        return this._friction;
    }
    public get gravity(): number {
        if (this.on.get(World.WALL_KEY)) return this._wallGravity;
        if (this._inputController.isJumpActive) return this._jumpingGravity;
        return this._fullGravity;
    }

    // Character State
    public get hp(): number
    {
        return this._hp;
    }
    public get mp(): number
    {
        return this._mp;
    }
    public get skills(): Skill[]
    {
        return this._skills;
    }
    public get moves(): Move[]
    {
        return this._moves;
    }
    public get canWallJumpNow(): boolean {
        return this._canWallJumpNow;
    }
    public get lastWallWallJumpedFrom(): BABYLON.Nullable<AbstractMesh>
    {
        return this._lastWallWallJumpedFrom;
    }
    public get jumpState(): boolean
    {
        return this._jumpState;
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
    ): Character {
        this._pos = this.mesh.position = pos;
        this._rot = this.mesh.rotationQuaternion = rot;
        return this;
    }

    protected checkCollisions(): void {
        this._world.collidablesPerType.forEach((collidables, key) => {
            let ray: BABYLON.Ray = new BABYLON.Ray(this._pos,
                this._vel.length() == 0 ? BABYLON.Vector3.Down() : this._vel, this._height / 2);
            let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.babylonScene.pickWithRay(ray,
                (mesh: BABYLON.AbstractMesh) => {
                    return collidables.map((collidable) => collidable.babylonMesh).includes(mesh);
                });
            this.on.set(key, !!(hit && hit.pickedPoint));
        });
    }

    public accelerateAndRotateHorizontalComponents(x: number, z: number): void {
        let r = Math.sqrt(x ** 2 + z ** 2);

        if (r > 0.01) { // Deadzone
            let r1 = Math.abs(x) + Math.abs(z);
            x *= r / r1;
            z *= r / r1;

            if (this.on.get(World.GROUND_KEY)) {
                this.mesh.rotationQuaternion = BABYLON.Vector3.Up()
                    .scale(Math.atan2(z, x))
                    .toQuaternion();

                this._facingDirection.set(z, 0.0, x).normalize();
            }

            this._vel.set(
                this._vel.x + this.horizontalMovementScaleFactor * z,
                this._vel.y,
                this._vel.z + this.horizontalMovementScaleFactor * x
            )
        }

        if (this.on.get(World.GROUND_KEY)) {
            this._vel.set(this.friction * this._vel.x, this._vel.y, this.friction * this._vel.z);
        }
    }

    public preformJump(): void {
        this._vel.y = this.jumpVerticalVelocity;
    }

    public preformWallJump(): void {
        if (!this._facingDirection) return;
        let ray: BABYLON.Ray = new BABYLON.Ray(this._pos, this._facingDirection, this._height / 2);
        let rayHelper: BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this._world.game.babylonScene, BABYLON.Color3.Red());
        let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.babylonScene.pickWithRay(ray,
            (mesh: BABYLON.AbstractMesh) => {
                let walls = this._world.collidablesPerType.get(World.WALL_KEY);
                if (!walls) return false;
                return walls.map((wall) => wall.babylonMesh).includes(mesh);
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
                this._world.game.babylonScene,
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
            this._vel.set(this._vel.x, this.jumpVerticalVelocity, this._vel.z);
            this._canWallJumpNow = false;
            this._lastWallWallJumpedFrom = wall as BABYLON.AbstractMesh;
        }
    }

    private applyHorizontalMovementInfluences(): void {
        let proportionalityConstant: number = 1.0;
        if (this._inputController.isSprintActive && this.on.get(World.GROUND_KEY)) {
            proportionalityConstant = 1.3;
        } else if (this._inputController.isSprintActive && !this.on.get(World.GROUND_KEY)) {
            proportionalityConstant = 1.2;
        }
        if (this._vel.length() ** 2 - this._vel.y ** 2 > (proportionalityConstant *
            (this._maxHorizontalSpeedJoystickNeutral * (1.0 - this._inputController.normalizedHorizontalAcceleration.length()) +
                this._maxHorizontalSpeedJoystickFull * this._inputController.normalizedHorizontalAcceleration.length())) ** 2) {
            this._vel.normalizeFromLength(proportionalityConstant *
                (this._maxHorizontalSpeedJoystickNeutral * (1.0 - this._inputController.normalizedHorizontalAcceleration.length()) +
                    this._maxHorizontalSpeedJoystickFull * this._inputController.normalizedHorizontalAcceleration.length()));
        }
    }

    private applyGravity(getDeltaTime: () => number): void {
        if (!this.on.get(World.GROUND_KEY)) {
            this._vel.y += 0.5 * this.gravity * (getDeltaTime() / 1000.0);
        }
        if (this.on.get(World.GROUND_KEY) && this._vel.y < 0.0) {
            this._vel.y = 0.0;
        }
    }

    private capYVelocity(): void {
        if (Math.abs(this._vel.y) > this.maxVerticalSpeed) {
            this._vel.y = this.maxVerticalSpeed * (this._vel.y === 0 ? 0 : this._vel.y > 0 ? 1 : -1);
        }
    }

    private move(getDeltaTime: () => number): void {
        if (this._inputController.normalizedHorizontalAcceleration != null) {
            this.accelerateAndRotateHorizontalComponents(
                this._inputController.normalizedHorizontalAcceleration.x,
                this._inputController.normalizedHorizontalAcceleration.z
            );
        }
        if (!this._inputController.isJumpActive) {
            this._jumpState = false;
            this._canWallJumpNow = true;
        } else {
            if (this.on.get(World.GROUND_KEY) && !this._jumpState) {
                this.preformJump();
                this._jumpState = true;
            }
            if (
                this._canWallJumpNow &&
                this.on.get(World.WALL_KEY) &&
                !this.on.get(World.GROUND_KEY) &&
                this._inputController.normalizedHorizontalAcceleration.length() > 0.1
            ) {
                this.preformWallJump();
            }
        }
        if (this.on.get(World.GROUND_KEY)) {
            this._lastWallWallJumpedFrom = null;
        }

        this.applyHorizontalMovementInfluences();
        this.applyGravity(getDeltaTime);
        this.capYVelocity();

        let deltaPos = this._vel.scale(getDeltaTime() / 1000.0);

        if (deltaPos.length() > 0) {
            this._world.collidablesPerType.forEach((collidables, _key) => {
                let ray: BABYLON.Ray = new BABYLON.Ray(this._pos, deltaPos, deltaPos.length());
                let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._world.game.babylonScene.pickWithRay(ray,
                    (mesh: BABYLON.AbstractMesh) => {
                        return collidables.map((collidable) => collidable.babylonMesh).includes(mesh);
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
        this.capYVelocity();
    }

    public preformTick(cameraAngle: BABYLON.Quaternion, getDeltaTime: () => number): void {
        console.assert(!!cameraAngle, "Camera angle cannot be undefined");
        this.checkCollisions();
        this._inputController.preformTick(this, this._world);
        this._inputController.normalizedHorizontalAcceleration.rotateByQuaternionToRef(cameraAngle, this._inputController.normalizedHorizontalAcceleration);
        this.move(getDeltaTime);
    }

    protected get horizontalMovementScaleFactor() {
        return this.on.get(World.GROUND_KEY) ? 5.0 : 1.0;
    }
}