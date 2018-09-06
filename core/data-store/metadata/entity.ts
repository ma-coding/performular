import { ClassDecoratorType, Newable } from '../utils/types';
import { MetadataStorage } from './metadata-storage';
import { ManyToOneMetadata } from './many-to-one';
import { PrimaryKeyMetadata } from './primary-key';
import { PropertyMetadata } from './property';

export interface EntityOptions {
    name: string;
}

export function Entity<T>(options: EntityOptions): ClassDecoratorType<T> {
    return (target: Newable<T>): void => {
        MetadataStorage.instance.registerEntityConfig(
            new EntityMetadata<T>(target, options)
        );
    };
}

export class EntityMetadata<T> {
    get target(): Newable<T> {
        return this._target;
    }

    get options(): EntityOptions {
        return this._options;
    }

    get pk(): PrimaryKeyMetadata {
        if (!this.primaryKey) {
            throw new Error('');
        }
        return this.primaryKey;
    }

    public primaryKey?: PrimaryKeyMetadata;
    public m2os: ManyToOneMetadata[] = [];
    public properties: PropertyMetadata[] = [];

    constructor(private _target: Newable<T>, private _options: EntityOptions) {}

    public create(entity: Partial<T>): T {
        const instance: T = new this._target();
        Object.assign(instance, entity);
        return instance;
    }
}
