import { EntityMetadata } from './entity';
import { ManyToOneMetadata } from './many-to-one';
import { PrimaryKeyMetadata } from './primary-key';
import { PropertyMetadata } from './property';
import { Newable } from '../utils/types';

export class MetadataStorage {
    private static _instance?: MetadataStorage;

    private _entities: EntityMetadata<any>[] = [];
    private _primaryKeys: PrimaryKeyMetadata[] = [];
    private _m2os: ManyToOneMetadata[] = [];
    private _properties: PropertyMetadata[] = [];

    static get instance(): MetadataStorage {
        if (!MetadataStorage._instance) {
            MetadataStorage._instance = new MetadataStorage();
        }
        return MetadataStorage._instance;
    }
    private constructor() {}

    public getEntities(): EntityMetadata<any>[] {
        return this._entities;
    }

    public getEntity<ENTITY>(
        entity: Newable<ENTITY>
    ): EntityMetadata<any> | undefined {
        return this._entities.find(
            (search: EntityMetadata<any>) => search.target === entity
        );
    }

    public registerEntityConfig(entity: EntityMetadata<any>): void {
        entity.primaryKey = this._primaryKeys.find(
            (p: PrimaryKeyMetadata) => p.target === entity.target
        );
        entity.m2os = this._m2os.filter(
            (p: ManyToOneMetadata) => p.target === entity.target
        );
        entity.properties = this._properties.filter(
            (p: PropertyMetadata) => p.target === entity.target
        );
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
