/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
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
import type {CharacterInputController} from "./characterInputController";
import {World} from "./world";
import {AbstractMesh} from "@babylonjs/core";
import {Collidable, CollidableType} from "./collidable";
import {CollidableTypes} from "../levelpack/levelpack";
import {Skill} from "./skill";
import {Item} from "./item";
import {InventorySlot} from "./inventory";

/**
 * A character in the game world. Can be an Ally, an Enemy, or both. Can be a Player or an NPC.
 */
export class Character {
    protected _babylonMesh!: BABYLON.Mesh;
    protected _characterWorld!: World;
    protected _characterInputController!: CharacterInputController;

    // Character Location and Rotation
    protected _characterPosition!: BABYLON.Vector3;
    protected _characterVelocity: BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
    protected _characterOrientation!: BABYLON.Quaternion;
    protected _characterRayOfView: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 1).normalize();

    private readonly collisionRayHelper: Map<Collidable, BABYLON.RayHelper> = new Map();
    protected movementRayHelper!: BABYLON.RayHelper;

    // Character Properties
    // TODO: Load in at runtime
    protected _characterHeight: number = 2.0;
    protected _characterMaximumHealthPoints: number = 10;
    protected _characterMaximumManaPoints: number = 10;
    protected _characterMaximumSkillPoints: number = 10;
    protected _characterMaximumHorizontalSpeedUponJoystickNeutral: number = 2.5;
    protected _characterMaximumHorizontalSpeedUponJoystickFullyActive: number = 12.5;
    protected _characterMaximumVerticalSpeed: number = 50.0;
    protected _characterVerticalJumpVelocity: number = 28.0;
    protected _characterGroundFriction: number = 0.7;
    protected _characterWallSlideGravitationalAcceleration: number = -0.83333;
    protected _characterGravitionalAccelerationUponHoldingJump: number = -0.9;
    protected _characterNormalGravititationalAcceleration: number = -1.0;

    // Character State
    protected _healthPoints!: number;
    protected _manaPoints!: number;

    protected _canWallJumpNow: boolean = true;
    protected _lastWallWallJumpedFrom: BABYLON.Nullable<BABYLON.AbstractMesh> = null;
    protected _jumpState: boolean = false;
    /**
     * A map from a world surface type to a boolean
     */
    public readonly isCharacterOnWorldSurface: Map<CollidableType, boolean> = new Map([]);

    /**
     * An array of skills this character is using right now.
     */
    public readonly characterSkillsEquiped: Array<Skill> = new Array(

    );

    /**
     * Every character possesses an inventory.
     * This maps from an {@link InventorySlot} to an {@link Item}.
     */
    public readonly characterInventory: Map<InventorySlot, Item> = new Map(

    );

    public get babylonMesh(): BABYLON.Mesh {
        return this._babylonMesh;
    }

    /**
     * The world the character is currently in.
     */
    public get characterWorld(): World {
        return this._characterWorld;
    }

    public get characterInputController(): CharacterInputController {
        return this._characterInputController;
    }


    // Character Location and Rotation
    /**
     * Character position in 3D Space.
     */
    public get characterPosition(): BABYLON.Vector3 {
        return this._characterPosition;
    }

    /**
     * Character Velocity in 3D Space.
     */
    public get characterVelocity(): BABYLON.Vector3 {
        return this._characterVelocity;
    }

    /**
     * Character Orientation in 3D Space (as a Quaternion)
     */
    public get characterOrientation(): BABYLON.Quaternion {
        return this._characterOrientation;
    }

    /**
     * Character Ray of View in 3D Space
     */
    public get characterRayOfView(): BABYLON.Vector3 {
        return this._characterRayOfView;
    }

    // Character Properties
    public get characterHeight(): number {
        return this._characterHeight;
    }

    public get characterMaximumHealthPoints(): number {
        return this._characterMaximumHealthPoints;
    }

    public get characterMaximumManaPoints(): number {
        return this._characterMaximumManaPoints;
    }

    public get characterMaximumSkillPoints(): number {
        return this._characterMaximumSkillPoints;
    }

    public get characterMaximumHorizontalSpeedUponJoystickNeutral(): number {
        return this._characterMaximumHorizontalSpeedUponJoystickNeutral;
    }

    public get characterMaximumHorizontalSpeedUponJoystickFullyActive(): number {
        return this._characterMaximumHorizontalSpeedUponJoystickFullyActive;
    }

    public get characterMaximumVerticalSpeed(): number {
        return this._characterMaximumVerticalSpeed;
    }

    public get characterVerticalJumpVelocity(): number {
        return this._characterVerticalJumpVelocity;
    }

    public get characterGroundFriction(): number {
        return this._characterGroundFriction;
    }

    public get characterGravitationalAcceleration(): number {
        if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND))
            return 0.0;
        if (this.isCharacterOnWorldSurface.get(CollidableTypes.WALL))
            return this._characterWallSlideGravitationalAcceleration;
        if (this._characterInputController.isJumpActive)
            return this._characterGravitionalAccelerationUponHoldingJump;
        return this._characterNormalGravititationalAcceleration;
    }

    // Character State
    public get healthPoints(): number {
        return this._healthPoints;
    }

    public get manaPoints(): number {
        return this._manaPoints;
    }

    public get canWallJumpNow(): boolean {
        return this._canWallJumpNow;
    }

    public get lastWallWallJumpedFrom(): BABYLON.Nullable<AbstractMesh> {
        return this._lastWallWallJumpedFrom;
    }

    public get jumpState(): boolean {
        return this._jumpState;
    }

    constructor(characterHeight: number, babylonMesh: BABYLON.Mesh, characterWorld: World,
                characterInputController: CharacterInputController) {
        this._characterHeight = characterHeight;
        this._babylonMesh = babylonMesh;
        this._characterWorld = characterWorld;
        this._characterInputController = characterInputController;
    }


    public setPositionAndRotation(
        pos: BABYLON.Vector3,
        rot: BABYLON.Quaternion
    ): Character {
        this._characterPosition = this.babylonMesh.position = pos;
        this._characterOrientation = this.babylonMesh.rotationQuaternion = rot;
        return this;
    }

    protected checkCollisions(): void {
        this.isCharacterOnWorldSurface.forEach((_value: boolean, collidableType: CollidableType) => {
            this.isCharacterOnWorldSurface.set(collidableType, false);
        })
        this._characterWorld.collidables.forEach((collidable) => {
            let ray: BABYLON.Ray = new BABYLON.Ray(this._characterPosition, collidable.babylonMesh.position
                .subtract(this._characterPosition).normalize(), this._characterHeight / 2);
            if (this.collisionRayHelper.get(collidable)) {
                this.collisionRayHelper.get(collidable)!.dispose();
                this.collisionRayHelper.delete(collidable);
            }
            this.collisionRayHelper.set(collidable, new BABYLON.RayHelper(ray));
            this.collisionRayHelper.get(collidable)!.show(
                this._characterWorld.babylonScene,
                BABYLON.Color3.Green()
            );
            let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._characterWorld.babylonScene.pickWithRay(ray,
                (mesh: BABYLON.AbstractMesh) => {
                    return mesh == collidable.babylonMesh;
                });
            if (!!hit && hit.hit) console.debug("hit")
            this.isCharacterOnWorldSurface.set(collidable.collidableType,
                this.isCharacterOnWorldSurface.get(collidable.collidableType) || (!!hit && hit.hit));
        });
    }

    public accelerateAndRotateHorizontalComponents(x: number, z: number): void {
        let r = Math.sqrt(x ** 2 + z ** 2);

        if (r > 0.01) { // Deadzone
            let r1 = Math.abs(x) + Math.abs(z);
            x *= r / r1;
            z *= r / r1;

            if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND)) {
                this.babylonMesh.rotationQuaternion = BABYLON.Vector3.Up()
                    .scale(Math.atan2(z, x))
                    .toQuaternion();

                this._characterRayOfView.set(z, 0.0, x).normalize();
            }

            this._characterVelocity.set(
                this._characterVelocity.x + this.horizontalMovementScaleFactor * z,
                this._characterVelocity.y,
                this._characterVelocity.z + this.horizontalMovementScaleFactor * x
            )
        }

        if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND)) {
            this._characterVelocity.set(this.characterGroundFriction * this._characterVelocity.x, this._characterVelocity.y, this.characterGroundFriction * this._characterVelocity.z);
        }
    }

    public preformJump(): void {
        this._characterVelocity.y = this.characterVerticalJumpVelocity;
    }

    public preformWallJump(): void {
        if (!this._characterRayOfView) return;
        let ray: BABYLON.Ray = new BABYLON.Ray(this._characterPosition, this._characterRayOfView, this._characterHeight / 2);
        let rayHelper: BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this._characterWorld.babylonScene, BABYLON.Color3.Red());
        let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._characterWorld.babylonScene.pickWithRay(ray,
            (mesh: BABYLON.AbstractMesh) => {
                let walls = this._characterWorld.collidables.filter(collidable =>
                    collidable.collidableType === CollidableTypes.WALL);
                if (!walls) return false;
                return walls.map((wall) => wall.babylonMesh).includes(mesh);
            });
        if (!hit) return;
        if (!hit.pickedMesh) return;
        let wall: BABYLON.AbstractMesh = hit.pickedMesh;
        if (this._lastWallWallJumpedFrom == wall) {
            let normalVector: BABYLON.Nullable<BABYLON.Vector3> = hit.getNormal(true);
            if (!normalVector) return;
            console.debug([wall, normalVector]);
            if (!hit.pickedPoint) return;
            let rayNormal = new BABYLON.Ray(hit.pickedPoint, normalVector, 1);
            new BABYLON.RayHelper(rayNormal).show(
                this._characterWorld.babylonScene,
                BABYLON.Color3.Blue()
            );
            let normal: BABYLON.Quaternion = new BABYLON.Quaternion(
                normalVector.x,
                normalVector.y,
                normalVector.z,
                0.0
            );
            console.assert(!!this._babylonMesh.rotationQuaternion, "Rotation Quaternion cannot be null");
            this._babylonMesh.rotationQuaternion = normal
                .multiply((this.babylonMesh.rotationQuaternion as BABYLON.Quaternion).multiply(normal))
                .normalize();
            this._characterVelocity.subtractInPlace(
                normalVector.scale(2 * BABYLON.Vector3.Dot(this.characterVelocity, normalVector)));
            this._characterVelocity.set(this._characterVelocity.x, this.characterVerticalJumpVelocity, this._characterVelocity.z);
            this._canWallJumpNow = false;
            this._lastWallWallJumpedFrom = wall as BABYLON.AbstractMesh;
        }
    }

    private applyHorizontalMovementInfluences(): void {
        let proportionalityConstant: number = 1.0;
        if (this._characterInputController.isSprintActive && this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND)) {
            proportionalityConstant = 1.3;
        } else if (this._characterInputController.isSprintActive && !this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND)) {
            proportionalityConstant = 1.2;
        }
        if (this._characterVelocity.length() ** 2 - this._characterVelocity.y ** 2 > (proportionalityConstant *
            (this._characterMaximumHorizontalSpeedUponJoystickNeutral * (1.0 - this._characterInputController.normalizedHorizontalMovement.length()) +
                this._characterMaximumHorizontalSpeedUponJoystickFullyActive * this._characterInputController.normalizedHorizontalMovement.length())) ** 2) {
            this._characterVelocity.normalizeFromLength(proportionalityConstant *
                (this._characterMaximumHorizontalSpeedUponJoystickNeutral * (1.0 - this._characterInputController.normalizedHorizontalMovement.length()) +
                    this._characterMaximumHorizontalSpeedUponJoystickFullyActive * this._characterInputController.normalizedHorizontalMovement.length()));
        }
    }

    private applyGravity(getDeltaTime: () => number): void {
        this._characterVelocity.y += 0.5 * this.characterGravitationalAcceleration * (getDeltaTime() / 1000.0);
        if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND) && this._characterVelocity.y < 0.0) {
            this._characterVelocity.y = 0.0;
        }
    }

    private capYVelocity(): void {
        if (Math.abs(this._characterVelocity.y) > this.characterMaximumVerticalSpeed) {
            this._characterVelocity.y = this.characterMaximumVerticalSpeed * (this._characterVelocity.y === 0 ? 0 : this._characterVelocity.y > 0 ? 1 : -1);
        }
    }

    private move(getDeltaTime: () => number): void {
        if (this._characterInputController.normalizedHorizontalMovement != null) {
            this.accelerateAndRotateHorizontalComponents(
                this._characterInputController.normalizedHorizontalMovement.x,
                this._characterInputController.normalizedHorizontalMovement.y
            );
        }
        if (!this._characterInputController.isJumpActive) {
            this._jumpState = false;
            this._canWallJumpNow = true;
        } else {
            if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND) && !this._jumpState) {
                this.preformJump();
                this._jumpState = true;
            }
            if (
                this._canWallJumpNow &&
                this.isCharacterOnWorldSurface.get(CollidableTypes.WALL) &&
                !this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND) &&
                this._characterInputController.normalizedHorizontalMovement.length() > 0.1
            ) {
                this.preformWallJump();
            }
        }
        if (this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND)) {
            this._lastWallWallJumpedFrom = null;
        }

        this.applyHorizontalMovementInfluences();
        this.applyGravity(getDeltaTime);
        this.capYVelocity();

        let deltaPos = this._characterVelocity.scale(getDeltaTime() / 1000.0);

        if (deltaPos.length() > 0) {
            let ray: BABYLON.Ray = new BABYLON.Ray(this._characterPosition, deltaPos.normalizeToNew(), this._characterHeight / 2);
            this.movementRayHelper = new BABYLON.RayHelper(ray);
            this.movementRayHelper.show(
                this._characterWorld.babylonScene,
                BABYLON.Color3.Purple()
            );
            let hit: BABYLON.Nullable<BABYLON.PickingInfo> = this._characterWorld.babylonScene.pickWithRay(ray,
                (mesh: BABYLON.AbstractMesh) => {
                    return this._characterWorld.collidables
                        .map((collidable) => collidable.babylonMesh).includes(mesh);
                });
            if (hit && hit.pickedPoint && hit.getNormal(true)) {
                console.debug(hit, hit.getNormal(true))
                this._babylonMesh.position = this._characterPosition =
                    hit.pickedPoint.add(hit.getNormal(true)!.scale(this._characterHeight / 2));
                this._characterVelocity = this._characterVelocity
                    .subtract(hit.getNormal(true)!.scale(this._characterVelocity.dot(hit.getNormal(true)!)));

            } else {
                this._babylonMesh.position = this._characterPosition = this._characterPosition.add(deltaPos);
            }
        }
        console.assert(!!this._babylonMesh.rotationQuaternion, "Rotation quaternion cannot be undefined");
        this._characterOrientation = this._babylonMesh.rotationQuaternion as BABYLON.Quaternion;
        this.checkCollisions();
        this.applyGravity(getDeltaTime);
        this.capYVelocity();
    }

    public preformTick(getDeltaTime: () => number): void {
        this.checkCollisions();
        this._characterInputController.preformTick();
        this.move(getDeltaTime);
    }

    protected get horizontalMovementScaleFactor() {
        return this.isCharacterOnWorldSurface.get(CollidableTypes.GROUND) ? 5.0 : 1.0;
    }
}