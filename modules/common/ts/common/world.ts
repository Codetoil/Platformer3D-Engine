/**
 *  Platformer3D Engine, a 3D Platformer Engine built for the web.
 *  Copyright (C) 2021-2025 Codetoil
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

import type {GameEngine} from "./gameEngine";
import {Collidable} from "./collidable";
import {NamespacedKey} from "./namespacedKey";
import {Character} from "./character";



export abstract class World {
    protected _gameEngine: GameEngine;
    protected _isWorldLoaded!: boolean;
    public readonly namespacedKey: NamespacedKey;
    public readonly collidables: Collidable[] = [];
    public readonly characters: Character[] = [];

    constructor(game: GameEngine, namespacedKey: NamespacedKey) {
        this._gameEngine = game;
        this.namespacedKey = namespacedKey;
    }

    public get gameEngine(): GameEngine
    {
        return this._gameEngine;
    }

    public get isWorldLoaded(): boolean
    {
        return this._isWorldLoaded;
    }

    public abstract loadWorld(): Promise<void>;

    public preformTick() {
        this.characters.forEach(character => character.preformTick(() => (((a: number | undefined): number => {
            if (a != undefined)
                return a;
            return 0.0;
        })(this.gameEngine.renderer.deltaTime))));
    }
}
