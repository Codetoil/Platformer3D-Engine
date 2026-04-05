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


import {Character} from "platformer3d-engine-server/src/ts/common/character";
import {World} from "platformer3d-engine-server/src/ts/common/world";
import {CharacterInputController} from "platformer3d-engine-server/src/ts/common/characterInputController";

import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import {Mesh} from "@babylonjs/core/Meshes/mesh";

export class CharacterClient extends Character {
    protected _characterBabylonTexture?: Texture;
    protected _characterBabylonMesh: Mesh;

    constructor(characterHeight: number,
                characterBabylonMesh: Mesh,
                characterWorld: World,
                characterInputController: CharacterInputController) {
        super(characterHeight, characterWorld, characterInputController);
        this._characterBabylonMesh = characterBabylonMesh;
    }

    public get characterBabylonTexture(): Texture | undefined
    {
        return this._characterBabylonTexture;
    }

    public set characterBabylonTexture(characterBabylonTexture: Texture)
    {
        this._characterBabylonTexture = characterBabylonTexture;
    }

    public get babylonMesh(): Mesh
    {
        return this._characterBabylonMesh;
    }
}