/**
 *  Platformer3D Engine, a 3D Platforming Engine built using Web Technologies.
 *  Copyright (C) 2021-2026 Codetoil
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

import {DeviceSource} from "@babylonjs/core/DeviceInput/InputDevices/deviceSource";
import {DeviceSourceManager} from "@babylonjs/core/DeviceInput/InputDevices/deviceSourceManager";
import {
    DeviceType,
    DualSenseInput,
    DualShockInput,
    SwitchInput,
    XboxInput
} from "@babylonjs/core/DeviceInput/InputDevices/deviceEnums";

import type {CharacterInputController} from "platformer3d-engine-server/src/ts/common/characterInputController";
import {Vector2} from "platformer3d-engine-server/src/ts/math/math";

export class PlayerInputController implements CharacterInputController {
    protected _joystick: Vector2 = Vector2.ZERO;
    protected _sprintHeld: boolean = false;
    protected _jumpPressed: boolean = false;
    private readonly _deviceSourceManager!: DeviceSourceManager;

    public constructor(deviceSourceManager: DeviceSourceManager) {
        this._deviceSourceManager = deviceSourceManager;
    }

    public get normalizedHorizontalMovement(): Vector2 {
        return this._joystick;
    }

    public get isSprintActive(): boolean {
        return this._sprintHeld;
    }

    public get isJumpActive(): boolean {
        return this._jumpPressed;
    }

    private setJoystickIfBigger(x: number, y: number): void {
        if (x ** 2 + y ** 2 > this._joystick.length() ** 2) {
            this._joystick = new Vector2(x, y);
        }
    }

    public get deviceSourceManager(): DeviceSourceManager
    {
        return this._deviceSourceManager;
    }


    public preformTick(): void {
        this._sprintHeld = false;
        this._jumpPressed = false;
        this._joystick = Vector2.ZERO;
        if (this.deviceSourceManager.getDeviceSource(DeviceType.Keyboard)) {
            let keyboardSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.Keyboard
            );
            this._sprintHeld =
                this._sprintHeld ||
                keyboardSource!.getInput(16) === 1 ||
                keyboardSource!.getInput(76) === 1;
            this._jumpPressed =
                this._jumpPressed ||
                keyboardSource!.getInput(32) === 1 ||
                keyboardSource!.getInput(74) === 1;
            this.setJoystickIfBigger(
                keyboardSource!.getInput(83) - keyboardSource!.getInput(87),
                keyboardSource!.getInput(65) - keyboardSource!.getInput(68)
            );
            this.setJoystickIfBigger(
                keyboardSource!.getInput(38) - keyboardSource!.getInput(40),
                keyboardSource!.getInput(39) - keyboardSource!.getInput(37)
            );
        }
        if (this.deviceSourceManager.getDeviceSource(DeviceType.Generic)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.Generic
            ) as DeviceSource<DeviceType.Generic>;
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
        if (this.deviceSourceManager.getDeviceSource(DeviceType.Switch)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.Switch
            ) as DeviceSource<DeviceType.Switch>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(SwitchInput.A) === 1 ||
                gamepadSource.getInput(SwitchInput.B) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(SwitchInput.LStickXAxis),
                gamepadSource.getInput(SwitchInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(SwitchInput.X) === 1 ||
                gamepadSource.getInput(SwitchInput.Y) === 1;
        }
        if (this.deviceSourceManager.getDeviceSource(DeviceType.Xbox)) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.Xbox
            ) as DeviceSource<DeviceType.Xbox>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(XboxInput.B) === 1 ||
                gamepadSource.getInput(XboxInput.A) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(XboxInput.LStickXAxis),
                gamepadSource.getInput(XboxInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(XboxInput.X) === 1 ||
                gamepadSource.getInput(XboxInput.Y) === 1;
        }
        if (
            this.deviceSourceManager.getDeviceSource(DeviceType.DualSense)
        ) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.DualSense
            ) as DeviceSource<DeviceType.DualSense>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(DualSenseInput.Square) === 1 ||
                gamepadSource.getInput(DualSenseInput.Triangle) === 1;
            this.setJoystickIfBigger(
                gamepadSource.getInput(DualSenseInput.LStickYAxis),
                -gamepadSource.getInput(DualSenseInput.LStickXAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(DualSenseInput.Circle) === 1 ||
                gamepadSource.getInput(DualSenseInput.Cross) === 1;
        }


        if (
            this.deviceSourceManager.getDeviceSource(DeviceType.DualShock)
        ) {
            let gamepadSource = this.deviceSourceManager.getDeviceSource(
                DeviceType.DualShock
            ) as DeviceSource<DeviceType.DualShock>;
            this._sprintHeld =
                this._sprintHeld ||
                gamepadSource.getInput(DualShockInput.Square) === 1 ||
                gamepadSource.getInput(DualShockInput.Triangle) === 1;
            this.setJoystickIfBigger(
                -gamepadSource.getInput(DualShockInput.LStickXAxis),
                gamepadSource.getInput(DualShockInput.LStickYAxis)
            );
            this._jumpPressed =
                this._jumpPressed ||
                gamepadSource.getInput(DualShockInput.Circle) === 1 ||
                gamepadSource.getInput(DualShockInput.Cross) === 1;
        }
    }
}
