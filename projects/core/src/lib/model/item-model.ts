import { Observable, of } from 'rxjs';

import { Framework } from '../framework/framework';
import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { AbstractModelState } from './types/abstract-model-state';
import { ItemModelOptions } from './types/item-model-options';

// Todo: add full implementation
export class ItemModel extends AbstractModel<AbstractModelState> {
    private static _cnt: number = 0;

    protected _state$: State<AbstractModelState>;

    constructor(options: ItemModelOptions) {
        super();
        this._state$ = new State({
            ...this._initAbstractModel({
                id: ItemModel._cnt + '-Item',
                attrs: options,
                model: Framework.getItemModel()
            }),
            children: [options.child]
        });
        ItemModel._cnt++;
    }

    protected _getUpdateWhen(): Observable<AbstractModel[]> {
        return of([]);
    }

    protected _onTreeUp(): void {}
    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined);
    }
}
