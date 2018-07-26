import { Observable, of } from 'rxjs';

import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { ContainerModelOptions } from './types/container-model-options';
import { ContainerModelState } from './types/container-model-state';
import { ModelType } from '../builder/types/model-type';

export class ContainerModel<ATTRS = any> extends AbstractModel<
    ContainerModelState<ATTRS>,
    ATTRS
> {
    protected _state$: State<ContainerModelState<ATTRS>>;

    constructor(options: ContainerModelOptions<ATTRS>) {
        super();
        (options.children || []).forEach((child: AbstractModel) =>
            child.setParent(this)
        );
        this._state$ = new State<ContainerModelState>({
            ...this._initAbstractModel(options),
            children: options.children || [],
            type: ModelType.CONTAINER
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
