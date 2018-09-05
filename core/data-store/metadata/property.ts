import { ObjectKey } from '../utils/types';
import { MemoryStoreMetadata } from './metadata';

export function Property(): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MemoryStoreMetadata.instance.registerProperty(
            new PropertyMetadata(target.constructor, propertyKey)
        );
    };
}

export class PropertyMetadata {
    constructor(private _target: Function, private _propertyKey: ObjectKey) {}
}
