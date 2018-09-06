import { Driver } from './store/driver';
import { Newable } from '../internal/utils/types';
import { Observable, BehaviorSubject } from 'rxjs';
import { UpdateResult } from './store/types/update-result';
import { Where } from './store/types/where';
import { DeleteResult } from './store/types/delete-result';
import { HashMap } from './utils/types';

export interface MemoryEntityState {
    entities: HashMap<any>;
    ids: string[];
}

export type MemoryState = Record<string, MemoryEntityState>;

export class MemoryDriver extends Driver {
    private _store: BehaviorSubject<MemoryState>;

    constructor(initialState: any[]) {
        super();
        this._store = new BehaviorSubject({});
    }

    public insert<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY
    ): Observable<ENTITY> {
        throw new Error('Method not implemented.');
    }

    public insertBulk<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY[]
    ): Observable<ENTITY[]> {
        throw new Error('Method not implemented.');
    }

    public update<ENTITY>(
        entity: Newable<ENTITY>,
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<UpdateResult<ENTITY>> {
        throw new Error('Method not implemented.');
    }

    public delete<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    public getMany<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<ENTITY[]> {
        throw new Error('Method not implemented.');
    }

    public getOne<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<ENTITY> {
        throw new Error('Method not implemented.');
    }
}
