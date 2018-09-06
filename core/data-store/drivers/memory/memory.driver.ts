import { Driver } from '../../store/driver';
import { MemoryQueryRunner } from './memory.query-runner';
import { BehaviorSubject } from 'rxjs';
import { MemoryState } from './types';
import { MetadataStorage } from '../../metadata/metadata-storage';
import { EntityMetadata } from '../../metadata/entity';

export class MemoryDriver implements Driver {
    private _database: BehaviorSubject<MemoryState>;

    constructor(initialState?: MemoryState) {
        this._database = new BehaviorSubject<MemoryState>(
            initialState || this._createInitState()
        );
    }

    public dispatch(state: MemoryState): void {
        this._database.next(state);
    }

    public getSnapshot(): MemoryState {
        return this._database.getValue();
    }

    public connect(): Promise<void> {
        return Promise.resolve();
    }

    public disconnect(): Promise<void> {
        return Promise.resolve();
    }

    public createQueryRunner(): MemoryQueryRunner {
        return new MemoryQueryRunner();
    }

    public generatesPrimaryKeys(): boolean {
        return true;
    }

    private _createInitState(): MemoryState {
        return MetadataStorage.instance
            .getEntities()
            .reduce((prev: MemoryState, curr: EntityMetadata<any>) => {
                return {
                    ...prev,
                    [curr.options.name]: {
                        entities: {},
                        ids: []
                    }
                };
            }, {});
    }
}
