import { Newable } from '../utils/types';
import { Where } from './types/where';
import { UpdateResult } from './types/update-result';
import { DeleteResult } from './types/delete-result';
import { EntityManager } from './entity-manager';
import { Store } from './store';

export interface QueryRunner {
    manager: EntityManager;
    store: Store;
    isTransactionActive: boolean;

    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;

    insert<ENTITY>(entity: Newable<ENTITY>, data: ENTITY): Promise<ENTITY>;

    insertBulk<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY[]
    ): Promise<ENTITY[]>;

    update<ENTITY>(
        entity: Newable<ENTITY>,
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<UpdateResult<ENTITY>>;

    delete<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<DeleteResult>;

    getMany<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY[]>;

    getOne<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY>;
}
