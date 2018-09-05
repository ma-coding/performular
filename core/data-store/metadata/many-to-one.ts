import { Newable, ObjectKey } from '../utils/types';
import { MemoryStoreMetadata } from './metadata';

export interface ManyToOneOptions {
    referenceEntity: () => Newable<any>;
}

export function ManyToOne(options: ManyToOneOptions): PropertyDecorator {
    return (target: Object, propertyKey: ObjectKey): void => {
        MemoryStoreMetadata.instance.registerM2O(
            new ManyToOneMetadata(target.constructor, propertyKey, options)
        );
    };
}

export class ManyToOneMetadata {
    constructor(
        private _target: Function,
        private _propertyKey: ObjectKey,
        private _options: ManyToOneOptions
    ) {}
}
