import { ClassDecoratorType, Newable } from '../utils/types';
import { MemoryStoreMetadata } from './metadata';

export interface EntityOptions {
    name: string;
}

export function Entity(options: EntityOptions): ClassDecoratorType<any> {
    return (target: Newable<any>): void => {
        MemoryStoreMetadata.instance.registerEntityConfig(
            new EntityMetadata(target, options)
        );
    };
}

export class EntityMetadata {
    get target(): Function {
        return this._target;
    }

    get options(): EntityOptions {
        return this._options;
    }

    constructor(private _target: Function, private _options: EntityOptions) {}
}
