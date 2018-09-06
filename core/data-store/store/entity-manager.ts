import { Driver } from './driver';
import { Newable } from '../utils/types';
import { Observable } from 'rxjs';
import { UpdateResult } from './types/update-result';
import { Where } from './types/where';
import { DeleteResult } from './types/delete-result';
import { EntityMetadata } from '../metadata/entity';
import { MemoryStoreMetadata } from '../metadata/metadata';

export class EntityManager<ENTITY> {
    constructor(private _entity: Newable<ENTITY>, private _driver: Driver) {}

    public create(entity: ENTITY): ENTITY {
        const instance: ENTITY = new this._entity();
        Object.assign(instance, entity);
        return instance;
    }

    public insert(data: ENTITY): Observable<ENTITY> {
        return this._driver.insert<ENTITY>(this._entity, data);
    }

    public update(
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<UpdateResult<ENTITY>> {
        return this._driver.update<ENTITY>(this._entity, data, where);
    }

    public delete(where?: Where<ENTITY>): Observable<DeleteResult> {
        return this._driver.delete<ENTITY>(this._entity, where);
    }

    public getMany(where?: Where<ENTITY>): Observable<ENTITY[]> {
        return this._driver.getMany<ENTITY>(this._entity, where);
    }

    public getOne(where?: Where<ENTITY>): Observable<ENTITY> {
        return this._driver.getOne<ENTITY>(this._entity, where);
    }

    public getMetadata(): EntityMetadata {
        return this._driver.getMetadata<ENTITY>(this._entity);
    }
}
