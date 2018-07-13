import { Observable, of } from 'rxjs';

import { Layout } from '../../layout/layout';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { RunContext } from '../../utils/types/run-context';
import { Abstract } from '../abstract/abstract';
import { ContainerOptions } from './types/container-options';
import { ContainerState } from './types/container-state';

export interface Container extends Abstract<ContainerState>, Layout<ContainerState> { }

export class Container extends Abstract<ContainerState> {

    protected _field: Abstract<any> = this;
    protected _state$: State<ContainerState>;

    @use(Layout) public this?: Container;

    constructor(options: ContainerOptions) {
        super();
        this._state$ = new State({
            ...this._initAbstract(options),
            ...this._initLayout(options)
        });
    }

    protected _getUpdateWhen(): Observable<Abstract<any>[]> {
        return of([]);
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of();
    }

    protected _onTreeUp(): void { }
}
