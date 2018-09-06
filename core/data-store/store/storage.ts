import { Driver } from './driver';
import { Newable } from '../utils/types';
import { EntityManager } from './entity-manager';

export class Storage {
    constructor(private _driver: Driver) {}

    public getManager<ENTITY>(entity: Newable<ENTITY>): EntityManager<ENTITY> {
        return new EntityManager<ENTITY>(entity, this._driver);
    }
}
