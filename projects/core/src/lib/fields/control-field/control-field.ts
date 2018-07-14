import { Observable, of } from 'rxjs';

import { FrameworkType } from '../../framework/types/framework-type';
import { State } from '../../utils/state';
import { AbstractField } from '../abstract-field/abstract-field';
import { AbstractFieldOptions } from '../abstract-field/types/abstract-field-options';
import { Abstract } from '../abstract/abstract';
import { ControlFieldOptions } from './types/control-field-options';
import { ControlFieldState } from './types/control-field-state';

export class ControlField extends AbstractField<ControlFieldState> {
    protected _state$: State<ControlFieldState>;

    constructor(options: ControlFieldOptions) {
        super();
        this._state$ = new State(<ControlFieldState>{
            ...this._initAbstractField(<AbstractFieldOptions>{
                ...options,
                type: FrameworkType.CONTROL
            }),
            ...this._initValue(options),
            children: []
        });
    }

    protected _getUpdateWhen(): Observable<Abstract[]> {
        return of([]); // Todo: add right actions
    }

    protected _buildValue(children: AbstractField[]): any {}
}
