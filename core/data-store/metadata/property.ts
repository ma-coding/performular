import { ObjectKey, Newable } from '../utils/types';
import { MetadataStorage } from './metadata-storage';

export function Property(): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MetadataStorage.instance.registerProperty(
            new PropertyMetadata(<any>target.constructor, propertyKey)
        );
    };
}

export class PropertyMetadata {
    get target(): Newable<any> {
        return this._target;
    }

    constructor(
        private _target: Newable<any>,
        private _propertyKey: ObjectKey
    ) {}
}
