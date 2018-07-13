import { merge, Observable, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, map } from 'rxjs/operators';

import { Framework } from '../../framework/framework';
import { Identification } from '../../identification/identification';
import { Item } from '../../item/item';
import { Structur } from '../../structur/structur';
import { StructurState } from '../../structur/types/structur-state';
import { flatten } from '../../utils/flatten';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { AbstractOptions } from './types/abstract-options';
import { AbstractState } from './types/abstract-state';

export interface Abstract<T extends AbstractState = any>
    extends Framework<T>,
        Identification<T>,
        Structur<T>,
        Item<T> {}

export abstract class Abstract<T extends AbstractState = any> {
    protected abstract _state$: State<T>;

    protected _manualUpdates$: Subject<Abstract[]> = new Subject();

    @use(Structur, Identification, Item, Framework)
    public this?: Abstract<T>;

    get updates$(): Observable<void> {
        return this._getUpdates$();
    }

    protected _initAbstract(options: AbstractOptions): AbstractState {
        return {
            ...this._initFramework(options),
            ...this._initIdentification(options),
            ...this._initItem(options),
            ...(<StructurState>{})
        };
    }

    protected abstract _getUpdateWhen(): Observable<Abstract[]>;

    private _getUpdates$(): Observable<void> {
        return this._getUpdateHandler(
            merge(
                ...this.root.all.map((c: Abstract) => c._getUpdateWhen()),
                this.root._manualUpdates$
            )
        );
    }

    private _getUpdateHandler(obs: Observable<Abstract[]>): Observable<void> {
        return obs.pipe(
            buffer(obs.pipe(debounceTime(200))),
            map(flatten),
            concatMap((checkList: Abstract[]) => this._treeDown(checkList))
        );
    }
}
