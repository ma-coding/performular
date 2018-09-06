import { Newable } from '../utils/types';
import { UpdateResult } from './types/update-result';
import { Where } from './types/where';
import { DeleteResult } from './types/delete-result';
import { QueryRunner } from './query-runner';
import { Store } from './store';

export class EntityManager {
    constructor(private _store: Store, private _queryRunner?: QueryRunner) {}

    public create<ENTITY>(type: Newable<ENTITY>, entity: ENTITY): ENTITY {
        return this._store.getMetadata<ENTITY>(type).create(entity);
    }

    public async transaction<T>(
        runInTransaction: (entityManager: EntityManager) => Promise<T>
    ): Promise<T> {
        if (this._queryRunner && this._queryRunner.isTransactionActive) {
            throw new Error('Allready inside Transaction');
        }

        const queryRunner: QueryRunner = this._getQueryRunner();
        try {
            await queryRunner.startTransaction();
            const result: T = await runInTransaction(queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        } catch (err) {
            try {
                await queryRunner.rollbackTransaction();
                return Promise.reject(err);
            } catch (rollbackError) {
                throw err;
            }
        }
    }

    public async insert<ENTITY>(
        type: Newable<ENTITY>,
        data: ENTITY
    ): Promise<ENTITY> {
        return this._getQueryRunner().insert(type, data);
    }

    public async update<ENTITY>(
        type: Newable<ENTITY>,
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<UpdateResult<ENTITY>> {
        return this._getQueryRunner().update(type, data, where);
    }

    public async delete<ENTITY>(
        type: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<DeleteResult> {
        return this._getQueryRunner().delete<ENTITY>(type, where);
    }

    public async getMany<ENTITY>(
        type: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY[]> {
        return this._getQueryRunner().getMany<ENTITY>(type, where);
    }

    public async getOne<ENTITY>(
        type: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY> {
        return this._getQueryRunner().getOne<ENTITY>(type, where);
    }

    private _getQueryRunner(): QueryRunner {
        return this._queryRunner || this._store.createQueryRunner();
    }
}
