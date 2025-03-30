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

export class Vector3 {
    private readonly _x: number = 0;
    private readonly _y: number = 0;
    private readonly _z: number = 0;

    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get z(): number { return this._z; }

    @operator("+")
    public static add(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }

    @operator("-")
    public static sub(vector1: Vector3, vector2: Vector3): Vector3 {
        return new Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
    }

    @operator("*")
    public static scale(scalar: number, vector: Vector3): Vector3 {
        return new Vector3(scalar * vector.x, scalar * vector.y, scalar * vector.z);
    }
}

export class Vector2 {
    private readonly _x: number = 0;
    private readonly _y: number = 0;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }

    @operator("+")
    public static add(vector1: Vector2, vector2: Vector2): Vector2 {
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    @operator("-")
    public static sub(vector1: Vector2, vector2: Vector2): Vector2 {
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    @operator("*")
    public static scale(scalar: number, vector: Vector2): Vector2 {
        return new Vector2(scalar * vector.x, scalar * vector.y);
    }
}

export class Quaternion {
    private readonly _a: number = 0;
    private readonly _b: number = 0;
    private readonly _c: number = 0;
    private readonly _d: number = 0;

    constructor(a: number, b: number, c: number, d: number) {
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
    }

    public get a(): number { return this._a; }
    public get b(): number { return this._b; }
    public get c(): number { return this._c; }
    public get d(): number { return this._d; }
}