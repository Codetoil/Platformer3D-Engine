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

import type * as BABYLON from "@babylonjs/core";
import {NamespacedKey} from "./namespacedKey";

/**
 * A type of {@link Collidable}
 */
export class CollidableType {
    public readonly key: NamespacedKey;

    public constructor(key: NamespacedKey) {
        this.key = key;
    }
}

/**
 * An object that can collide with characters.
 */
export class Collidable {
    protected _babylonMesh: BABYLON.AbstractMesh;
    protected _collidableType: CollidableType;

    public get babylonMesh(): BABYLON.AbstractMesh {
        return this._babylonMesh;
    }

    public get collidableType(): CollidableType {
        return this._collidableType;
    }

    constructor(babylonMesh: BABYLON.AbstractMesh, collidableCategory: CollidableType) {
        this._babylonMesh = babylonMesh;
        this._collidableType = collidableCategory;
    }

}