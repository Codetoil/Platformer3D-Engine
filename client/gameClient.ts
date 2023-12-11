/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2023  Codetoil
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
import { Game } from "../common/game";
import {WorldClient} from "./worldClient";

export abstract class GameClient extends Game {
  public name: string = "Game";

  public abstract createEngine(): Promise<BABYLON.Engine>;

  public async createScene(): Promise<BABYLON.Scene> {
    this.scene = new BABYLON.Scene(this.engine);
    this.world = new WorldClient(this);
    this.world.load();
    this.scene.onBeforeRenderObservable.add(this.beforeRender.bind(this));

    return this.scene;
  }

  public async setMenuCamera(): Promise<void> {
    this.camera = new BABYLON.UniversalCamera(
      "default",
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
  }

  private beforeRender(): void {
    if (!this.started || this.stopped || !this.world) return;
    this.tick();
  }
}

export function initRenderLoop(value: Game)
{
  value.engine.runRenderLoop(() => {
    if (
        value.started &&
        !value.stopped &&
        value.scene &&
        value.scene.activeCamera
    ) {
      try {
        value.scene.render();
      } catch (e: any) {
        console.error(e);
        value.stopped = true;
      }
    } else if (value.stopped && value.engine) {
      value.engine.stopRenderLoop();
      console.error("Stopped game.");
    }
  });
}