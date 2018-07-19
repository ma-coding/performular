import { Observable, of } from 'rxjs';

import { Layout } from '../handler/layout/layout';
import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { ContainerModelOptions } from './types/container-model-options';
import { ContainerModelState } from './types/container-model-state';

export class ContainerModel extends AbstractModel<ContainerModelState> {
    protected _state$: State<ContainerModelState>;

    constructor(options: ContainerModelOptions) {
        super();
        (options.children || []).forEach((child: AbstractModel) =>
            child.setParent(this)
        );
        this._state$ = new State<ContainerModelState>({
            ...this._initAbstractModel(options),
            children: options.children || [],
            layout: new Layout(options)
        });
    }

    protected _getUpdateWhen(): Observable<AbstractModel<any>[]> {
        return of([]); // Todo: add right actions
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(); // Todo: add right actions
    }

    protected _onTreeUp(): void {
        // Todo: add right actions
    }
}
