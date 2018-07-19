import { Observable, of } from 'rxjs';

import { Framework } from '../framework/framework';
import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { AbstractModelState } from './types/abstract-model-state';
import { LayoutModelOptions } from './types/layout-model-options';

// Todo: add full implementation
export class LayoutModel extends AbstractModel<AbstractModelState> {
    private static _cnt: number = 0;

    protected _state$: State<AbstractModelState>;

    constructor(options: LayoutModelOptions) {
        super();
        this._state$ = new State<AbstractModelState>({
            ...this._initAbstractModel({
                id: LayoutModel._cnt + '-Layout',
                attrs: options,
                model: Framework.getLayoutModel()
            }),
            children: options.children
        });
        LayoutModel._cnt++;
    }

    protected _getUpdateWhen(): Observable<AbstractModel[]> {
        return of([]);
    }

    protected _onTreeUp(): void {}
    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined);
    }
}
