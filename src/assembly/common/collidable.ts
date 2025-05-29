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

import {NamespacedKey} from "./namespacedKey";

/**
 * A type of {@link Collidable}
 */
export class CollidableCategory {
    public readonly key: NamespacedKey;

    public constructor(key: NamespacedKey) {
        this.key = key;
    }
}

export function newCollidableType(key: NamespacedKey): CollidableCategory {
    return new CollidableCategory(key);
}

/**
 * An object that can collide with characters.
 */
export class Collidable {
    protected _collidableCategory: CollidableCategory;

    public get collidableCategory(): CollidableCategory {
        return this._collidableCategory;
    }

    constructor(collidableCategory: CollidableCategory) {
        this._collidableCategory = collidableCategory;
    }

}

export function newCollidable(collidableCategory: CollidableCategory): Collidable {
    return new Collidable(collidableCategory);
}

export function getCollidableCategory(collidable: Collidable): CollidableCategory {
    return collidable.collidableCategory;
}