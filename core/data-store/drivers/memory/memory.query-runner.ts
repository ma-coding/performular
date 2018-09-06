import { QueryRunner } from '../../store/query-runner';
import { UpdateResult } from '../../store/types/update-result';
import { Where } from '../../store/types/where';
import { Newable } from '../../../internal/utils/types';
import { DeleteResult } from '../../store/types/delete-result';
import { EntityManager } from '../../store/entity-manager';
import { IS_DEFINED } from '../../utils/strict-defined';
import { Store } from '../../store/store';
import { TransactionTree } from '../../transaction/transaction-tree';
import { MemoryState } from './types';
import { StateFn, ObjectKey } from '../../utils/types';
import { MemoryDriver } from './memory.driver';
import { EntityMetadata } from '../../metadata/entity';

export interface MemoryTransaction {
    stateModifier: StateFn<MemoryState, MemoryState | void>;
}

export class MemoryQueryRunner implements QueryRunner {
    public store: Store = IS_DEFINED;
    public manager: EntityManager = IS_DEFINED;

    public transactionTree?: TransactionTree<
        StateFn<MemoryState, MemoryState | void>
    >;

    get isTransactionActive(): boolean {
        return !!this.transactionTree;
    }

    get driver(): MemoryDriver {
        return this.store.driver as MemoryDriver;
    }

    public startTransaction(): Promise<void> {
        this.transactionTree = new TransactionTree((): void => {});
        return Promise.resolve();
    }

    public commitTransaction(): Promise<void> {
        if (!this.transactionTree) {
            throw new Error('There is no active transaction to commit');
        }
        if (this.transactionTree.isEmpty()) {
        }
        return Promise.resolve();
    }

    public rollbackTransaction(): Promise<void> {
        throw new Error('Should never be called!');
    }

    public async insert<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY
    ): Promise<ENTITY> {
        const metadata: EntityMetadata<ENTITY> = this.store.getMetadata(entity);
        const entityName: string = metadata.options.name;
        const pkName: ObjectKey = metadata.pk.propertyKey;
        this._setState((state: MemoryState) => {
            return {
                ...state,
                [entityName]: {
                    ...state[entityName],
                    entities: {
                        ...state[entityName].entities,
                        [data[pkName]]: data
                    },
                    ids: [...state[entityName].ids, data[pkName]]
                }
            };
        });
        return Promise.resolve(data);
    }

    public insertBulk<ENTITY>(
        entity: Newable<ENTITY>,
        data: ENTITY[]
    ): Promise<ENTITY[]> {
        throw new Error('Method not implemented.');
    }

    public update<ENTITY>(
        entity: Newable<ENTITY>,
        data: Partial<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<UpdateResult<ENTITY>> {
        throw new Error('Method not implemented.');
    }

    public delete<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    public getMany<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY[]> {
        throw new Error('Method not implemented.');
    }

    public getOne<ENTITY>(
        entity: Newable<ENTITY>,
        where?: Where<ENTITY>
    ): Promise<ENTITY> {
        throw new Error('Method not implemented.');
    }

    private _setState<T>(newStateFn: StateFn<MemoryState>): void {
        if (this.transactionTree) {
            this.transactionTree.addNode(newStateFn);
        } else {
            this._dispatch(newStateFn(this.driver.getSnapshot()));
        }
    }

    private _dispatch(state: MemoryState): void {
        this.driver.dispatch(state);
    }
}
