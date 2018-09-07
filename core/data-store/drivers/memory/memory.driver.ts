import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { mergeScan, takeUntil } from 'rxjs/operators';
import { EntityMetadata } from '../../metadata/entity';
import { MetadataStorage } from '../../metadata/metadata-storage';
import { Driver } from '../../store/driver';
import { MemoryQueryRunner } from './memory.query-runner';
import { MemoryAction, MemoryState } from './types';

export class MemoryDriver implements Driver {
    private _disconnector$: Subject<void> = new Subject();
    private _actions?: Subject<MemoryAction>;
    private _database: BehaviorSubject<MemoryState>;

    constructor(initialState?: MemoryState) {
        this._database = new BehaviorSubject<MemoryState>(
            initialState || this._createInitState()
        );
    }

    public dispatch(state: MemoryAction): void {
        if (this._actions) {
            this._actions.next(state);
        }
    }

    public getSnapshot(): MemoryState {
        return this._database.getValue();
    }

    public connect(): Promise<void> {
        if (this._actions) {
            return Promise.resolve();
        }
        this._actions = new Subject<MemoryAction>();
        this._actions
            .pipe(
                takeUntil(this._disconnector$),
                mergeScan((state: MemoryState, action: MemoryAction) => {
                    const result:
                        | MemoryState
                        | Observable<MemoryState> = action.reducer(state);
                    if (result instanceof Observable) {
                        return result;
                    }
                    return of(result);
                }, this._database.getValue())
            )
            .subscribe();

        return Promise.resolve();
    }

    public disconnect(): Promise<void> {
        this._disconnector$.next();
        this._actions = undefined;
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
