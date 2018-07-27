import { Observable, of } from 'rxjs';

import { State } from '../util/state';
import { RunContext } from '../util/types/run-context';
import { AbstractModel } from './abstract-model';
import { ContainerModelOptions } from './types/container-model-options';
import { ContainerModelState } from './types/container-model-state';
import { ModelType } from '../builder/types/model-type';
import { every } from '../../../../../node_modules/rxjs/operators';

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
            type: ModelType.CONTAINER,
            hideWhenNoChild: options.hideWhenNoChild || true
        });
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined); // Todo: add right actions
    }

    protected _onTreeUp(): void {
        const everyChildHidden: boolean = this.children.every(
            (c: AbstractModel) => c.hidden
        );
        if (this.hidden !== everyChildHidden) {
            this._state$.updateKey('hidden', everyChildHidden);
        }
    }
}
