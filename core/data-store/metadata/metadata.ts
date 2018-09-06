import { EntityMetadata } from './entity';
import { ManyToOneMetadata } from './many-to-one';
import { PrimaryKeyMetadata } from './primary-key';
import { PropertyMetadata } from './property';
import { Newable } from '../utils/types';

export class MemoryStoreMetadata {
    private static _instance?: MemoryStoreMetadata;

    private _entities: EntityMetadata[] = [];
    private _primaryKeys: PrimaryKeyMetadata[] = [];
    private _m2os: ManyToOneMetadata[] = [];
    private _properties: PropertyMetadata[] = [];

    static get instance(): MemoryStoreMetadata {
        if (!MemoryStoreMetadata._instance) {
            MemoryStoreMetadata._instance = new MemoryStoreMetadata();
        }
        return MemoryStoreMetadata._instance;
    }
    private constructor() {}

    public getEntity<ENTITY>(
        entity: Newable<ENTITY>
    ): EntityMetadata | undefined {
        return this._entities.find(
            (search: EntityMetadata) => search.target === entity
        );
    }

    public registerEntityConfig(entity: EntityMetadata): void {
        this._entities.push(entity);
    }

    public registerPrimaryKey(primaryKey: PrimaryKeyMetadata): void {
        this._primaryKeys.push(primaryKey);
    }

    public registerM2O(m2o: ManyToOneMetadata): void {
        this._m2os.push(m2o);
    }

    public registerProperty(property: PropertyMetadata): void {
        this._properties.push(property);
    }
}
