/**
 * ALL RIGHTS RESERVED Codetoil (c) 2021-2022
 */
import * as BABYLON from "@babylonjs/core";
import { Player } from "./characterController";
import { World } from "./world";
export declare class Game3D {
    ready: Promise<Game3D>;
    started: boolean;
    stopped: boolean;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
    scene: BABYLON.Scene;
    player: Player;
    camera: BABYLON.ArcFollowCamera;
    world: World;
    constructor();
    createEngine(): Promise<BABYLON.Engine>;
    createScene(): Promise<BABYLON.Scene>;
    private beforeRender;
}
export declare class EventHandler {
    static onResize(game3D: Game3D): void;
}
//# sourceMappingURL=main.d.ts.map