/**
 *  Game3D, a 3D Platformer built for the web.
 *  Copyright (C) 2021-2024 Codetoil
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

import type {Game} from "./game";
import {Collidable} from "./collidable";

export abstract class World {
    protected _game: Game;
    protected _loaded!: boolean;
    public readonly collidablesPerType: Map<string, Collidable[]> = new Map([["ground", []], ["wall", []]]);

    constructor(game: Game) {
        this._game = game;
    }

    public get game(): Game
    {
        return this._game;
    }

    public get loaded(): boolean
    {
        return this._loaded;
    }

    public abstract load(): Promise<void>;

    public abstract tick(): void;
}
