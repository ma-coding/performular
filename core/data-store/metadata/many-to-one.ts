import { Newable, ObjectKey } from '../utils/types';
import { MetadataStorage } from './metadata-storage';

export interface ManyToOneOptions {
    referenceEntity: () => Newable<any>;
}

export function ManyToOne(options: ManyToOneOptions): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MetadataStorage.instance.registerM2O(
            new ManyToOneMetadata(<any>target.constructor, propertyKey, options)
        );
    };
}

export class ManyToOneMetadata {
    get target(): Newable<any> {
        return this._target;
    }

    constructor(
        private _target: Newable<any>,
        private _propertyKey: ObjectKey,
        private _options: ManyToOneOptions
    ) {}
}
