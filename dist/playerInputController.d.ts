/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
import * as BABYLON from "@babylonjs/core";
export declare class PlayerInputController {
    private deviceSourceManager;
    sprintHeld: boolean;
    jumpPressed: boolean;
    joystick: BABYLON.Vector3;
    constructor(engine: BABYLON.Engine);
    private setJoystickIfBigger;
    tick(cameraAngle: BABYLON.Quaternion): void;
}
//# sourceMappingURL=playerInputController.d.ts.map