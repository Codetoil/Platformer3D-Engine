/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
 *  Copyright (C) 2021-2025 Codetoil
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

import type {CharacterInputController} from "../common/characterInputController";

export class PlayerInputController implements CharacterInputController {
    protected _joystick: BABYLON.Vector2 = BABYLON.Vector2.Zero();
    protected _sprintHeld: boolean = false;
    protected _jumpPressed: boolean = false;
    private readonly _deviceSourceManager!: BABYLON.DeviceSourceManager;

    public constructor(deviceSourceManager: BABYLON.DeviceSourceManager) {
        this._deviceSourceManager = deviceSourceManager;
    }

    public get normalizedHorizontalMovement(): BABYLON.Vector2 {
        return this._joystick;
    }

    public get isSprintActive(): boolean {
        return this._sprintHeld;
    }

    public get isJumpActive(): boolean {
        return this._jumpPressed;
    }

    private setJoystickIfBigger(x: number, y: number): void {
        if (x ** 2 + y ** 2 > this._joystick.lengthSquared()) {
            this._joystick.x = x;
            this._joystick.y = y;
        }
    }

    public get deviceSourceManager(): BABYLON.DeviceSourceManager
    {
        return this._deviceSourceManager;
    }


    public preformTick(): void {
        this._sprintHeld = false;
        this._jumpPressed = false;
        this._joystick = BABYLON.Vector2.Zero();
        if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard)) {
            let keyboardSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.Keyboard
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.Keyboard>;
            this._sprintHeld =
                this._sprintHeld ||
                keyboardSource.getInput(16) === 1 ||
                keyboardSource.getInput(76) === 1;
            this._jumpPressed =
                this._jumpPressed ||
                keyboardSource.getInput(32) === 1 ||
                keyboardSource.getInput(74) === 1;
            this.setJoystickIfBigger(
                keyboardSource.getInput(83) - keyboardSource.getInput(87),
                keyboardSource.getInput(65) - keyboardSource.getInput(68)
            );
            this.setJoystickIfBigger(
                keyboardSource.getInput(38) - keyboardSource.getInput(40),
                keyboardSource.getInput(39) - keyboardSource.getInput(37)
            );
        }
        if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Generic)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.Generic
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.Generic>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(0) === 1 ||
                gamepadSource.getInput(3) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(15),
                gamepadSource.getInput(14)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(1) === 1 ||
                gamepadSource.getInput(2) === 1;
        }
        if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Switch)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.Switch
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.Switch>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(BABYLON.SwitchInput.A) === 1 ||
                gamepadSource.getInput(BABYLON.SwitchInput.B) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(BABYLON.SwitchInput.LStickXAxis),
                gamepadSource.getInput(BABYLON.SwitchInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(BABYLON.SwitchInput.X) === 1 ||
                gamepadSource.getInput(BABYLON.SwitchInput.Y) === 1;
        }
        if (this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Xbox)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.Xbox
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.Xbox>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(BABYLON.XboxInput.B) === 1 ||
                gamepadSource.getInput(BABYLON.XboxInput.A) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(BABYLON.XboxInput.LStickXAxis),
                gamepadSource.getInput(BABYLON.XboxInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(BABYLON.XboxInput.X) === 1 ||
                gamepadSource.getInput(BABYLON.XboxInput.Y) === 1;
        }
        if (
            this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.DualSense)
        ) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.DualSense
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.DualSense>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(BABYLON.DualSenseInput.Square) === 1 ||
                gamepadSource.getInput(BABYLON.DualSenseInput.Triangle) === 1;
            this.setJoystickIfBigger(
                gamepadSource.getInput(BABYLON.DualSenseInput.LStickYAxis),
                -gamepadSource.getInput(BABYLON.DualSenseInput.LStickXAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(BABYLON.DualSenseInput.Circle) === 1 ||
                gamepadSource.getInput(BABYLON.DualSenseInput.Cross) === 1;
        }


        if (
            this.deviceSourceManager.getDeviceSource(BABYLON.DeviceType.DualShock)
        ) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                BABYLON.DeviceType.DualShock
            ) as BABYLON.DeviceSource<BABYLON.DeviceType.DualShock>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(BABYLON.DualShockInput.Square) === 1 ||
                gamepadSource.getInput(BABYLON.DualShockInput.Triangle) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(BABYLON.DualShockInput.LStickXAxis),
                gamepadSource.getInput(BABYLON.DualShockInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(BABYLON.DualShockInput.Circle) === 1 ||
                gamepadSource.getInput(BABYLON.DualShockInput.Cross) === 1;
        }
    }
}
