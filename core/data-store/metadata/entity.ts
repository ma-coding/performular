import { ClassDecoratorType, Newable } from '../utils/types';
import { MemoryStoreMetadata } from './metadata';

export function Entity(): ClassDecoratorType<any> {
    return (target: Newable<any>): void => {
        MemoryStoreMetadata.instance.registerEntityConfig(
            new EntityMetadata(target)
        );
    };
}

export class EntityMetadata {
    constructor(private _target: Function) {}
}
