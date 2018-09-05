import { ObjectKey } from '../utils/types';
import { MemoryStoreMetadata } from './metadata';

export function PrimaryKey(): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MemoryStoreMetadata.instance.registerPrimaryKey(
            new PrimaryKeyMetadata(target.constructor, propertyKey)
        );
    };
}

export class PrimaryKeyMetadata {
    constructor(private _target: Function, private _propertyKey: ObjectKey) {}
}
