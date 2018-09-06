import { ObjectKey, Newable } from '../utils/types';
import { MetadataStorage } from './metadata-storage';
import { EntityOptions } from './entity';

export function PrimaryKey(): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MetadataStorage.instance.registerPrimaryKey(
            new PrimaryKeyMetadata(<any>target.constructor, propertyKey)
        );
    };
}

export class PrimaryKeyMetadata {
    get target(): Newable<any> {
        return this._target;
    }

    get propertyKey(): ObjectKey {
        return this._propertyKey;
    }

    constructor(
        private _target: Newable<any>,
        private _propertyKey: ObjectKey
    ) {}
}
