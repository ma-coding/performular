import { Observable, of } from 'rxjs';

import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { ContainerModelOptions } from './types/container-model-options';
import { ContainerModelState } from './types/container-model-state';
import { ModelType } from '../builder/types/model-type';
import { DisplayModel } from './display-model';

export class ContainerModel<ATTRS = any> extends DisplayModel<
    ContainerModelState<ATTRS>,
    ATTRS
> {
    protected _state$: State<ContainerModelState<ATTRS>>;

    constructor(options: ContainerModelOptions<ATTRS>) {
        super();
        (options.children || []).forEach((c: AbstractModel) =>
            c.setParent(this)
        );
        this._state$ = new State<ContainerModelState>({
            ...this._initDisplayModel(options)
        });
    }
}
