import { Observable, of } from 'rxjs';
import { Newable } from '../../../internal/utils/types';
import { EntityMetadata } from '../../metadata/entity';
import { EntityManager } from '../../store/entity-manager';
import { QueryRunner } from '../../store/query-runner';
import { Store } from '../../store/store';
import { DeleteResult } from '../../store/types/delete-result';
import { UpdateResult } from '../../store/types/update-result';
import { Where } from '../../store/types/where';
import { IS_DEFINED } from '../../utils/strict-defined';
import { ObjectKey } from '../../utils/types';
import { MemoryDriver } from './memory.driver';
import { MemoryAction, MemoryState } from './types';

export class MemoryQueryRunner implements QueryRunner {
    public store: Store = IS_DEFINED;
    public manager: EntityManager = IS_DEFINED;

    get isTransactionActive(): boolean {
        return false;
    }

    get driver(): MemoryDriver {
        return this.store.driver as MemoryDriver;
    }

    public startTransaction(): Promise<void> {
        return Promise.resolve();
    }

    public commitTransaction(): Promise<void> {
        if (!this.isTransactionActive) {
            throw new Error('There is no active transaction to commit');
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

        const reducer: (
            state: MemoryState
        ) => MemoryState | Observable<MemoryState> = (
            state: MemoryState
        ): MemoryState | Observable<MemoryState> => {
            return of({
                ...state,
                [entityName]: {
                    ...state[entityName],
                    entities: {
                        ...state[entityName].entities,
                        [data[pkName]]: data
                    },
                    ids: [...state[entityName].ids, data[pkName]]
                }
            });
        };

        const action: MemoryAction = new MemoryAction(
            this._getActionType(entityName, 'INSERT'),
            this.driver,
            reducer
        );
        this.driver.dispatch(action);
        return action.result.toPromise();
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

    private _getActionType(entityName: string, actionName: string): string {
        return `[${entityName}] ${actionName}`;
    }

    private _setState<T>(memoryAction: MemoryAction): void {
        this.driver.dispatch(memoryAction);
    }
}
