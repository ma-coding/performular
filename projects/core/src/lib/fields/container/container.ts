import { Observable, of } from 'rxjs';

import { FrameworkType } from '../../framework/types/framework-type';
import { Layout } from '../../layout/layout';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { RunContext } from '../../utils/types/run-context';
import { Abstract } from '../abstract/abstract';
import { AbstractOptions } from '../abstract/types/abstract-options';
import { ContainerOptions } from './types/container-options';
import { ContainerState } from './types/container-state';

export interface Container
    extends Abstract<ContainerState>,
        Layout<ContainerState> {}

export class Container extends Abstract<ContainerState> {
    protected _state$: State<ContainerState>;

    @use(Layout) public this?: Container;

    constructor(options: ContainerOptions) {
        super();
        this._state$ = new State({
            ...this._initAbstract(<AbstractOptions>{
                ...options,
                type: FrameworkType.CONTAINER
            }),
            ...this._initLayout(options),
            ...this._initStructur(options)
        });
    }

    protected _getUpdateWhen(): Observable<Abstract<any>[]> {
        return of([]); // Todo: add right actions
    }

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(); // Todo: add right actions
    }

    protected _onTreeUp(): void {
        // Todo: add right actions
    }
}
