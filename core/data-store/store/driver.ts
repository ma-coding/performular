import { Observable } from 'rxjs';
import { Newable } from '../utils/types';
import { DeleteResult } from './types/delete-result';
import { UpdateResult } from './types/update-result';
import { Where } from './types/where';

export abstract class Driver {
    public abstract getInitStorage(): any;

    public abstract insert<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY
    ): Observable<ENTITY>;

    public abstract insertBulk<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY[]
    ): Observable<ENTITY[]>;

    public abstract update<ENTITY>(
        entity: Newable<ENTITY>,
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<UpdateResult<ENTITY>>;

    public abstract delete<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<DeleteResult>;

    public abstract getMany<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<ENTITY[]>;

    public abstract getOne<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Observable<ENTITY>;
}
