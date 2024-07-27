/**
 *  Game3D, a 3D Platformer built for the web.
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

import {parse, stringify, v7, validate} from 'uuid';

export class ComponentIdentifier {
    public readonly packId: string;
    public readonly componentId: string;

    public constructor(packId: string, componentId: string)
    {
        this.packId = packId;
        this.componentId = componentId;
    }
}

export abstract class ComponentType<C extends Component<C>> {
    public readonly id: ComponentIdentifier;

    public serialize(component: C): Uint8Array | undefined
    {
        let buffer: Uint8Array = new Uint8Array();
        if (!validate(component.uuid)) return undefined;
        buffer.set(parse(component.uuid), 0);
        return buffer;
    }

    public abstract deserialize(buffer: Uint8Array): C | undefined;

    public getUUID(buffer: Uint8Array): string | undefined {
        try {
            return stringify(buffer, 0);
        } catch (_e: unknown)
        {
            if (_e instanceof TypeError)
            {
                return undefined;
            }
            throw _e;
        }
    }

    protected constructor(id: ComponentIdentifier) {
        this.id = id;
    }
}

export abstract class Component<C extends Component<C>> {
    public readonly type: ComponentIdentifier;
    public readonly uuid: string;

    protected constructor(type: ComponentIdentifier, uuid: string = v7()) {
        this.type = type;
        this.uuid = uuid;
    }
}